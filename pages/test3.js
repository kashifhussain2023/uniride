import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import { Typography } from "@mui/material";

export default function Test() {
  return (
    <ThemeProvider>
      <Head>
        <title>Edutech - EFFICIENT, EFFECTIVE, ETHICAL</title>
        <meta
          name="description"
          content="Edutech - EFFICIENT, EFFECTIVE, ETHICAL"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />        
      </Head>
      <Typography variant="h2">Hello</Typography>
    </ThemeProvider>
  );
}


