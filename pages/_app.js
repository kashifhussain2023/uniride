import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
import CarProvider from './context/CarListContext';
const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <CssBaseline />
        <ToastContainer />
        <CarProvider>
          <Component {...pageProps} />
        </CarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};
export default App;
