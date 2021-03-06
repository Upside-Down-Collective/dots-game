import { useEffect, useState } from "react";

function JoinRoom({ socket }) {
    const [roomCode, setRoomCode] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        socket.on("join-fail", (msg) => {
            setErrorMsg(msg)
        })
        return () => socket.removeAllListeners("join-fail")
    }, [socket])

    function joinRoom() {
        socket.emit("join-room", roomCode)
        setRoomCode('');
    }

    function newRoom() {
        socket.emit("new-room");
    }

    return (
        <section className="JoinRoom">
            <button onClick={newRoom}>Create New Room</button>
            <p> OR </p>
            <input type={"text"} placeholder="Enter a room code" maxLength={10} value={roomCode} onInput={e => setRoomCode(e.target.value.trim())}></input>
            {errorMsg && <p>{errorMsg}</p>}
            <button onClick={joinRoom}>Join Room</button>
        </section>
    )
}

export default JoinRoom;