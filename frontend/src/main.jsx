import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles';
import { militaryTheme } from './theme';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={militaryTheme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
