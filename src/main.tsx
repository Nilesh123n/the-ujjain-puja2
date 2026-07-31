import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { CustomizationProvider } from './context/CustomizationContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <CustomizationProvider>
        <App />
      </CustomizationProvider>
    </LanguageProvider>
  </StrictMode>,
);
