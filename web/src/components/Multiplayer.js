import { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import GameMulti from "./GameMulti";
import JoinRoom from "./JoinRoom";


function Multiplayer() {
    const [socket, setSocket] = useState(null);
    const [playerNum, setPlayerNum] = useState();
    const [roomCode, setRoomCode] = useState();
    // let navigate = useNavigate()
    // const gridSize = 4;

    useEffect(() => {
        const s = io(`http://${window.location.hostname}:5000`)
        s.on('connect', () => {
            console.log(`your id: ${s.id}`)
            setSocket(s);
        })
        // console.log("mount")
        s.on('init', (playerNum, roomName) => {
            setRoomCode(roomName);
            setPlayerNum(playerNum);
            // navigate('play');
        })
        return () => s.disconnect();
    }, []);

    return (
        <>
            {!roomCode && (socket ? <JoinRoom socket={socket} setPlayerNum={setPlayerNum} setRoom={setRoomCode} /> : <p>Loading...</p>)}
            {roomCode && <GameMulti socket={socket} playerNum={playerNum} roomCode={roomCode} gridSize={4} />}
            {/* <Outlet context={{ socket, playerNum, roomCode, gridSize }} /> */}
        </>
    )
}

export default Multiplayer;