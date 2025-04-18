import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import CarProvider from "./context/CarListContext";
import "../styles/custom.css";

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
