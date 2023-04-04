import { io } from "socket.io-client";

const URL = "http://34.130.118.63:3000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
