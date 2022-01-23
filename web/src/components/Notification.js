import { useEffect, useState } from "react";
import styles from "./Notification.module.css"

const Notification = ({ msg, duration }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(true);
        const timer = setTimeout(() => setActive(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const closeNotif = () => {
        setActive(false);
    }

    return (
        <div className={`${styles.notif} ${active && styles.active}`}>
            <p>{msg}</p >
            <span onClick={closeNotif}>&#10799;</span>
        </div >
    );
}

export default Notification;