import { useState } from "react";

function JoinRoom({ socket }) {
    const [roomCode, setRoomCode] = useState('');
    function joinRoom() {
        socket.emit("joinRoom", roomCode)
        setRoomCode('');
    }

    function newRoom() {
        socket.emit("newRoom");
    }

    return (
        <section className="JoinRoom">
            <button onClick={newRoom}>Create New Room</button>
            <p> OR </p>
            <input type={"text"} placeholder="Enter a room code" maxLength={10} value={roomCode} onInput={e => setRoomCode(e.target.value)}></input>
            <button onClick={joinRoom}>Join Room</button>
        </section>
    )
}

export default JoinRoom;