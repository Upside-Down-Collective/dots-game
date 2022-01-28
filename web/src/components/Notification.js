import { useEffect } from "react";
import styles from "./Notification.module.css"

const Notification = ({ msg, active, dispatch, action }) => {
    useEffect(() => {
        const timer = active ? setTimeout(() => dispatch({ type: action, active: false }), 2500) : null;
        return () => clearTimeout(timer);
    }, [active, dispatch, action]);

    const closeNotif = () => {
        dispatch({ type: action, active: false })
    }

    return (
        <div className={`${styles.notif} ${active ? styles.active : ''}`}>
            <p>{msg}</p >
            <span onClick={closeNotif}>&#10799;</span>
        </div >
    );
}

export default Notification;