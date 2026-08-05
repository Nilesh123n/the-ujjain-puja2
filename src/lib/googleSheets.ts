import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { BookingData } from '../types';

// Initialize Firebase App safely (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add required Google Workspace Sheets & Drive scopes
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

/**
 * Initialize Auth listener
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Trigger Google Sign In with Sheets Scopes
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token from sign-in credential');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get cached memory access token
 */
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Set cached access token manually if obtained
 */
export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Logout Google user
 */
export const googleLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Create a new Google Spreadsheet and populate it with Puja Bookings
 */
export const createBookingsSpreadsheet = async (
  title: string = 'Ujjain Sacred Puja Bookings',
  bookings: BookingData[] = []
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Google Authentication required. Please sign in with Google first.');
  }

  // 1. Create a new Spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `${title} - ${new Date().toLocaleDateString('en-IN')}`,
      },
      sheets: [
        {
          properties: {
            title: 'Puja Bookings',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createResponse.ok) {
    const errData = await createResponse.json();
    throw new Error(errData.error?.message || 'Failed to create Google Spreadsheet');
  }

  const sheetData = await createResponse.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Prepare headers and booking rows
  const headers = [
    'Booking ID',
    'Puja Name',
    'Devotee Name',
    'Phone',
    'Email',
    'Puja Date',
    'Puja Type',
    'City',
    'Gotra',
    'Rashi',
    'Sankalp Wishes',
    'Amount (₹)',
    'Payment Method',
    'Payment Status',
    'Booking Time',
  ];

  const rows = bookings.map((b) => [
    b.bookingId || '',
    b.pujaName || '',
    b.fullName || '',
    b.phone || '',
    b.email || '',
    b.pujaDate || '',
    b.pujaType || '',
    b.city || '',
    b.gotra || '',
    b.rashi || '',
    b.wishes || '',
    b.pujaPrice || 0,
    b.paymentMethod || '',
    b.paymentStatus || '',
    b.timestamp || new Date().toLocaleString(),
  ]);

  const valueData = [headers, ...rows];

  // 3. Append data to spreadsheet
  const appendResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Puja Bookings!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: valueData,
      }),
    }
  );

  if (!appendResponse.ok) {
    const err = await appendResponse.json();
    console.warn('Warning adding rows to sheet:', err);
  }

  return { spreadsheetId, spreadsheetUrl };
};

/**
 * Append single new booking to an existing Google Sheet
 */
export const appendBookingToSheet = async (
  spreadsheetId: string,
  booking: BookingData
): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) {
    console.warn('Cannot sync to Google Sheet: User not authenticated with Google');
    return false;
  }

  const row = [
    booking.bookingId || '',
    booking.pujaName || '',
    booking.fullName || '',
    booking.phone || '',
    booking.email || '',
    booking.pujaDate || '',
    booking.pujaType || '',
    booking.city || '',
    booking.gotra || '',
    booking.rashi || '',
    booking.wishes || '',
    booking.pujaPrice || 0,
    booking.paymentMethod || '',
    booking.paymentStatus || '',
    booking.timestamp || new Date().toLocaleString(),
  ];

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.error('Error appending booking to Google Sheet:', err);
    return false;
  }
};

/**
 * Read values from a Google Spreadsheet
 */
export const readSheetData = async (
  spreadsheetId: string,
  range: string = 'A1:Z1000'
): Promise<string[][] | null> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Google Authentication required to read Google Sheet');
  }

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to read Google Sheet data');
  }

  const data = await res.json();
  return data.values || [];
};
