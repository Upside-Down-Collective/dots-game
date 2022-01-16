const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

const PORT = process.env.PORT || 5000;
const clientRooms = {};

io.on('connection', (socket) => {
    console.log('a user connected with id: ', socket.id);

    socket.on('joinRoom', (gameCode) => {
        const room = io.sockets.adapter.rooms.get(gameCode)

        let numClients;
        if (room) {
            numClients = room.size;
        }

        if (numClients === 0) {
            console.log('unknown room', gameCode);
            return;
        }
        else if (numClients > 1) {
            console.log('too many players, ', numClients)
            return;
        }

        clientRooms[socket.id] = gameCode;
        socket.join(gameCode);
        socket.number = 2;
        socket.emit('init', 2, gameCode)
    })

    socket.on('newRoom', () => {
        let roomName = makeid(5);
        clientRooms[socket.id] = roomName;
        socket.emit('gameCode', roomName);

        socket.join(roomName)
        socket.number = 1;
        socket.emit('init', 1, roomName);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// io.of("/").adapter.on("join-room", (room, id) => {
//     console.log(`socket ${id} has joined room ${room}`);
// });

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