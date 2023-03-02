import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import mongoDB from './database/connection.js';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import trainerRouter from './routes/trainerRoute.js';
import conversationRouter from './routes/conversationRoute.js';
import messageRouter from './routes/messagesRoute.js';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { Server } from 'socket.io';

const app = express();
dotenv.config();

const corsOptions = {
  origin: 'https://bfitpro.netlify.app',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(morgan('dev'));
app.use(express.json({ extended: true, parameterLimit: 1000000, limit: '10000kb' }))
app.use(express.urlencoded({ extended: true, parameterLimit: 1000000, limit: '10000kb' }))
app.use(fileUpload({
  useTempFiles: true
}))
app.use(cors(corsOptions));

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/trainer', trainerRouter);
app.use('/conversations', conversationRouter);
app.use('/messages', messageRouter);

const port = 5000
const server = http.createServer(app);
try {
  mongoDB().then(() => {
    server.listen(port, () => {
      console.log(`Server successfully connected to ${port}`);
    });
  });
} catch (err) {
  console.log(err);
}

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://bfitpro.netlify.app",
    cors: true,
  }
});

let users = [];

const adduser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

io.on("connection", (socket) => {
  console.log("Socket Connected");

  socket.on("addUser", (userId) => {
    adduser(userId, socket.id)
    io.emit("getUsers", users)
  })

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    })
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id)
    io.emit("getUsers", users)
  })

});