import { useEffect, useState } from "react";
import io from "socket.io-client";
import JoinRoom from "./JoinRoom";


function Multiplayer() {
    const [socket, setSocket] = useState(null);
    const [playerNum, setPlayerNum] = useState();
    const [roomCode, setRoomCode] = useState();

    useEffect(() => {
        const s = io(`http://${window.location.hostname}:5000`)
        s.on('connect', () => {
            console.log(`your id: ${s.id}`)
            setSocket(s);
        })
        return () => s.disconnect();
    }, []);

    if (socket) {
        socket.on('init', (playerNum, roomName) => {
            setRoomCode(roomName);
            setPlayerNum(playerNum);
            console.log({ playerNum, roomName })
        })
    }

    return (
        <>
            {!roomCode && (socket ? <JoinRoom socket={socket} setPlayerNum={setPlayerNum} setRoom={setRoomCode} /> : <p>Loading...</p>)}
            {roomCode && <p>Your room code is: {roomCode}, player: {playerNum}</p>}
        </>
    )
}

export default Multiplayer;