import io from "socket.io-client";
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
  query: {},
});
socket.on("connect", () => {
  console.log("connected ✔️");
});
socket.on("disconnect", () => {
  console.log("DisConnected ❌");
});

export const joinRoom = (roomId) => {
  console.log(roomId);
  socket.emit("join", roomId);
};
export default socket;
