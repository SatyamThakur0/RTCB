import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);
dotenv.config({});
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Allow client origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from localhost:5173
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true,
  })
);

io.on("connection", (socket) => {
  //   const { roomId } = socket.handshake.query;
  //   socket.join(roomId);
//   console.log(socket);
//   console.log(socket.handshake.query);
  
  socket.on("join", (roomID) => {
    console.log(socket.id, " Connected to ", roomID);
    socket.join(roomID);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, " Disconnected");
  });

  socket.on("moved", ({ objs, roomId }) => {
    console.log("move received");
    console.log("roomID", roomId);
    console.log(socket.connected);

    socket.to(roomId).emit("movedShape", objs);
    // io.in(roomId)
    //     .allSockets()
    //     .then((sockets) => {
    //         console.log(
    //             `Broadcasted movedShape to room ${roomId}, members:`,
    //             Array.from(sockets)
    //         );
    //     });
  });
  socket.on("rotated", ({ objs, roomId }) => {
    socket.to(roomId).emit("rotatedShape", objs);
  });
  socket.on("textChanged", ({ obj, roomId }) => {
    socket.to(roomId).emit("receiveText", obj);
  });
  socket.on("scaled", ({ objs, roomId }) => {
    socket.to(roomId).emit("scaledShape", objs);
  });
  socket.on("newShape", ({ shape, roomId }) => {
    console.log("shape received", shape);
    socket.to(roomId).emit("receivedShape", shape);
  });
  socket.on("clearSelection", ({ objs, roomId }) => {
    socket.to(roomId).emit("clearedShapes", objs);
  });
  socket.on("freePath", (path) => {
    socket.broadcast.emit("receivedFreePath", path);
  });
});

app.get("/", (req, res) => res.send("Hello there user"));

server.listen(port, () => console.log(`server started at port : ${port}`));
