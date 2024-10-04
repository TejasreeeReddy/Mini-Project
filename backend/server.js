const { createServer } = require("http");//importing http module for creating http server.
const { Server } = require("socket.io");//importing socket module to make websocket connections.
const express = require('express')//express
const cors = require('cors');//middle ware to handle resoure sharing
const fileupload = require("express-fileupload")//middleware to handle file uploads
const cookieParser = require("cookie-parser")//middleware for parsing cookies.

const app = express()

app.use(cors({  //middleware setup
  origin: '*'
}));
const httpServer = createServer(app);//Creates an HTTP server using the Express app.
global.io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // allowing connection from frntend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});


const apiRoutes = require("./routes/apiRoutes")

app.use(express.json())//middleware to parse json rqst
app.use(cookieParser())//middleware to parse cookies from the rqst
app.use(fileupload())// middleware to handle file uploads

const admins = [];
let activeChats = [];
function get_random(array) {
  return array[Math.floor(Math.random() * array.length)]
}

io.on("connection", (socket) => {
  socket.on("admin connected with server", (adminName) => {
    admins.push({ id: socket.id, admin: adminName })
  })
  socket.on("client sends message", (msg) => {//if theres no admin avl it send response
    if (admins.length === 0) {
      socket.emit("no admin", "")
    } else {
      let client = activeChats.find((client) => client.clientId === socket.id);
      let targetAdminId;
      if (client) {
        targetAdminId = client.adminId;
      } else {
        let admin = get_random(admins)
        activeChats.push({ clientId: socket.id, adminId: admin.id });
        targetAdminId = admin.id
      }
      socket.broadcast.to(targetAdminId).emit("server sends message from client to admin", {
        user: socket.id,
        message: msg,
      })
    }
  })
  socket.on("admin sends message", ({ user, message }) => {//reads msgs and send response to client.
    socket.broadcast.to(user).emit("server sends message from admin to client", message)
  });

  socket.on("admin closes chat", (socketId) => {// make admin to close the chat
    socket.broadcast.to(socketId).emit("admin closed chat", "");
    let c = io.sockets.sockets.get(socketId);
    c.disconnect();
  })


  socket.on("disconnect", (reason) => {//disconnects both client and admin
    const removeIndex = admins.findIndex((item) => item.id === socket.id);
    if (removeIndex !== -1) {
      admins.splice(removeIndex, 1)
    }
    activeChats = activeChats.filter((item) => item.adminId !== socket.id);

    //client disconnect
    const removeIndexClient = activeChats.findIndex((item) => item.clientId === socket.id);
    if (removeIndexClient !== -1) {
      activeChats.splice(removeIndexClient, 1)
    }
    socket.broadcast.emit("disconnected", { reason: reason, socketId: socket.id });
  })
});


app.get('/', async (req, res, next) => {

  res.json({ message: "API running..." })
})

//mongoDB connection
const connectDB = require("./config/db")
connectDB();


app.use('/api', apiRoutes)

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error)
})
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack
    })

  } else {
    res.status(500).json({
      message: error.message
    })
  }
})

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))


