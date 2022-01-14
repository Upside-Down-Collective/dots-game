const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    console.log('a user connected with id: ', socket.id);
    // console.log(socket)

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});