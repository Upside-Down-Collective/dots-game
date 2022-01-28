const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('join-room', (gameCode) => {
        const room = io.sockets.adapter.rooms.get(gameCode)

        let numClients = 0;
        if (room) {
            numClients = room.size;
        }

        if (numClients === 0) {
            socket.emit("join-fail", "This room does not exist.")
            return;
        }
        else if (numClients > 1) {
            socket.emit("join-fail", "This room is already full.")
            return;
        }

        socket.join(gameCode);
        socket.number = 2;
        socket.emit('init', 2, gameCode)

        io.to(gameCode).emit('start-game');
    })

    socket.on('new-room', () => {
        let roomName = makeid(5);
        socket.join(roomName)
        socket.number = 1;
        socket.emit('init', 1, roomName);
    })

    socket.on("turn", (x, y, roomCode) => {
        socket.to(roomCode).emit("opponent-move", x, y)
    })

    socket.on("restart-game", (roomCode) => {
        socket.to(roomCode).emit("restart-game-request")
    })

    socket.on("restart-game-responce", (isReady, roomCode) => {
        socket.to(roomCode).emit("restart-game-ready", isReady)
    })
});


io.of("/").adapter.on("leave-room", (room, id) => {
    io.in(room).emit("opponent-left");
    io.in(room).socketsLeave(room);
});

function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});