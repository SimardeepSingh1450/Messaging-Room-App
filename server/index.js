const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected : ${socket.id}`);

  socket.on("sendMsg", (data) => {
    // console.log(`Data received is : ${data.message}`);
    if (data.msg != "") {
      data.msgs.push({ user: data.username, msg: data.msg });
    }
    io.emit("rcvMsg", data);
  });
});

server.listen(3001, () => {
  console.log("Server is listening on PORT 3001...");
});
