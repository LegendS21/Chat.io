const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors')
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const Controller = require('./controllers/controller');
const authentication = require('./middlewares/authentication');
const server = createServer(app);

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api
app.post('/login', Controller.Login)
app.use(authentication)
app.get('/room', Controller.readRoom)
app.post('/room/add', Controller.createRoom)
app.get('/room/:roomId', Controller.RoomDetail)
app.delete('/room/del/:roomId', Controller.RoomDel)
app.get('/chat/:roomId', Controller.readChat)
app.post('/chat/:roomId', Controller.sentChat)
app.post('/chat/img/:roomId', Controller.sentImage)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on('connection', (socket) => {
    console.log(socket.id);

    if (socket.handshake.auth) {
        console.log('username : ' + socket.handshake.auth.username);
    }
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });
    socket.on("message:new", ({ message, roomId }) => {
        io.to(roomId).emit("message:update", {
            from: socket.handshake.auth.username,
            message
        })
    })
})

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})