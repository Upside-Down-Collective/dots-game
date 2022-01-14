import { useEffect } from "react";
import io from "socket.io-client";


function Multiplayer() {

    useEffect(() => {
        const socket = io(`http://${window.location.hostname}:5000`);

        socket.on('connect', () => {
            console.log(`your id: ${socket.id}`)
        })
    }, []);



    return (
        <h1>test.</h1>
    )
}

export default Multiplayer;