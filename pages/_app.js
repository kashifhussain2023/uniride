import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import CarProvider from './context/CarListContext';
const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <CssBaseline />
        <ToastContainer
          sx={{
            zIndex: 9999,
            '& .Toastify__toast-container': {
              zIndex: 9999,
            },
          }}
        />
        <CarProvider>
          <Component {...pageProps} />
        </CarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};
export default App;
