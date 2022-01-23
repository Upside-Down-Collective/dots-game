import { useEffect, useState } from "react";
import styles from "./Alert.module.css"

const Alert = ({ handleClickNo, handleClickYes }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(true);
    }, [])

    return (
        <>
            <div className={`${styles.alert} ${open ? styles.active : ""}`}>
                <p>Your opponent wants to restart the game. Restart game?</p>
                <div className="btn-group">
                    <button className={styles.btn} onClick={handleClickYes}>Yes</button>
                    <button className={styles.btn} onClick={handleClickNo}>No</button>
                </div>
            </div>
            <div className={`${styles.overlay} ${open ? styles.active : ""}`}></div>
        </>
    );
}

export default Alert;