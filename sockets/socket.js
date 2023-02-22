//to create socketId according t email incoming
const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

let users = [];

const adduser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId })
}

const getUser = (userId) => {
  console.log("users",users);
  return users.find(user => user.userId === userId)
}

const removeUser = (socketId) => {
  users = users.filter((user => user.socketId !== socketId))
}

export const sockets = (socket) => {
  console.log("New Connection");

  // take userid and socketid from the user
  socket.on("addUser", userId => {
    adduser(userId, socket.id)
    io.emit("getUsers", users)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id)
    io.emit("getUsers", users)
  })

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(111, user);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    })
  });

  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log("User", emailId, "Joined Room", roomId);
    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    console.log('joineddddd');
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });

  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit('incoming-call', { from: fromEmail, offer });
  });

  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit("call-accepted", { ans })
  });

}

//connecting with an event & event listener
// io.on('connection', (socket) => {
//   socket.emit('me', socket.id);
//   console.log('socket connected');

//   socket.on('disconnect', () => {
//     socket.broadcast.emit('callEnded');
//   })

//   socket.on('callUser', ({ userToCall, signalData, from, name }) => {
//     console.log(userToCall);
//     console.log(signalData);
//     console.log(from);
//     console.log(name);

//     userSchema.findOne({ email: from}).then((user) => {
//       console.log(user);
//       io.to(user.socketId).emit("callUser", {
//         signal: signalData,
//         from,
//         name,
//       });
//     });
//   });
//     // io.to(userToCall).emit('callUser', { signal: signalData, from, name })
//   // })

//   socket.on('answerCall', (data) => {
//     io.to(data.to).emit('callAccepted', data.signal);
//   })
// })