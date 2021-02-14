const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const morgon = require("morgan");
const cors = require("cors");
const app = express();
const path = require("path");
const server = http.createServer(app);
const io = socketio(server, { path: "/api/chatbox" });
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

app.use(cors());
app.use(morgon("dev"));

//? server static flies
app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//! Chat service
io.on("connection", (socket) => {
  console.log("new connection");
  //* socket deals as cuurent user
  //* io use for global
  socket.on("join room", ({ name, room, id }) => {
    const { error, user } = addUser({
      id,
      name,
      room,
    });
    console.log(user, "join");
    if (error) {
      let msg = error.error;
      socket.emit("failedJoin", msg);
    }
    socket.emit("message", {
      user: "Admin",
      text: `${user.name} welcome to the room`,
    }); //? send message event to current user only
    socket.join(user.room);
    socket.broadcast.to(user.room).emit("message", {
      user: "Admin",
      text: `${user.name} has joined the room`,
    }); //? send message event to other user but not current user
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  //? receive message from client
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    // console.log(user);
    io.to(user.room).emit("message", { user: user.name, text: message });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  //! handle video call
  //? send caller offer to receiver
  socket.on("sendOffer", ({ signal, receiver, caller }) => {
    console.log("sending to: ", receiver.name, " :from: ", caller.name);
    io.to(receiver.id).emit("offer", { signal, receiver, caller });
  });
  //? send receiver anwser back to caller
  socket.on("sendAnswer", ({ signal, receiver, caller }) => {
    console.log("sending back to: ", caller.name, " :from: ", receiver.name);
    io.to(caller.id).emit("answer", { signal, receiver, caller });
  });

  //? send ice-candidate to receiver
  socket.on("send-ice-candidate-to-receiver", (payload) => {
    io.to(payload.receiver.id).emit(
      "ice-candidate-from-caller",
      payload.icecandidate
    );
  });
  //? send ice-candidate to caller
  socket.on("send-ice-candidate-to-caller", (payload) => {
    io.to(payload.caller.id).emit(
      "ice-candidate-from-receiver",
      payload.icecandidate
    );
  });

  //! handle user left
  socket.on("disconnect", () => {
    console.log("disconnect...");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("left", { id: user.id });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server running at ${port}`));
