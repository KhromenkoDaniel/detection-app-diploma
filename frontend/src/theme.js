import { createTheme } from '@mui/material/styles';

export const militaryTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#556B2F', // Olive Drab
      contrastText: '#fff',
    },
    secondary: {
      main: '#8A9A5B', // Khaki green
    },
    background: {
      default: '#F5F7F2', // дуже світлий хакі
      paper: '#E5E8D5',   // світлий military paper
    },
    error: {
      main: '#B22222', // military red
    },
    text: {
      primary: '#2E3D13', // темно-зелений
      secondary: '#556B2F',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});