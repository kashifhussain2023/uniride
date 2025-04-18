import { useEffect } from "react";
import Head from "next/head";
import io from "socket.io-client";
import ThemeProvider from "@/theme/ThemeProvider";
import { Typography } from "@mui/material";


export default function Test() {



  useEffect(() => {
    const socket = io("https://uniridesocket.24livehost.com/connect-socket", { // https://unirideus.com:3050
      debug: true
    });
    // Example: Listen for messages from the server
    socket.on("connect", data => {
      console.log("dfd",data);
    });

    socket.on("error", error => {
      console.error("Socket error:", error);
    });
  }, []);

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


