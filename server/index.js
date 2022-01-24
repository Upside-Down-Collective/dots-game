const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000"] // If you want to access multiplayer server from another device, you need to also add IP address of server, so this line should look somewhat like this: 'origin: ["http://localhost:3000", http://192.168.0.1:3000]'. Of course server's IP address may be different, so write the one of your server.
    }
});

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    socket.on('joinRoom', (gameCode) => {
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

    socket.on('newRoom', () => {
        let roomName = makeid(5);
        socket.emit('gameCode', roomName);

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