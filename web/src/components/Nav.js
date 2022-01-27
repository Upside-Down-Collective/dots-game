import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../logo/dots-and-boxes_2.jpg"

function Nav() {
    const [navActive, setnavActive] = useState(false);
    const [toggleBurger, setToggleBurger] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    function toggleNav() {
        setnavActive(prev => !prev)
        setToggleBurger(prev => !prev)
    }

    function handleResize() {
        let resizeTimer
        setIsResizing(true)
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setIsResizing(false)
        }, 400);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="nav-bg">
            <nav className={isResizing ? "resize-animation-stopper" : ""}>
                <div className="logo">
                    <img src={logo} alt="logo" />
                    <h1>Dots and Boxes</h1>
                </div>
                <ul className={`${navActive ? "nav-active" : ""} nav-links`} onClick={toggleNav}>
                    <li><NavLink to="/multiplayer">Multiplayer</NavLink></li>
                    <li><NavLink to="/">Play offline</NavLink></li>
                    <li><NavLink to="/rules">Rules</NavLink></li>
                </ul>
                <div className={`${toggleBurger ? "close" : ""} burger`} onClick={toggleNav}>
                    <div className="burger-a"></div>
                    <div className="burger-b"></div>
                    <div className="burger-c"></div>
                </div>
            </nav>
        </div >
    );
}

export default Nav;