import io from "socket.io-client";

const socket = io("https://uniridesocket.24livehost.com/connect-socket");

socket.on("connect", () => {});

socket.on("error", (error) => {});

export default socket;
