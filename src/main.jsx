import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { EventProvider } from './context/EventContext.jsx'; // YENİ EKLENDİ
import { LanguageProvider } from './context/LanguageContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <EventProvider>
          <App />
        </EventProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)