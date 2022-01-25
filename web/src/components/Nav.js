import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../logo/dots-and-boxes.jpg"

function Nav() {
    const [navActive, setnavActive] = useState(false);

    function showNav() {
        setnavActive(prev => !prev)
    }

    return (
        <div className="nav-bg">
            <nav>
                <div className="logo">
                    <img src={logo} alt="logo" />
                    <h1>Dots and Boxes</h1>
                </div>
                <ul className={`nav-links ${navActive ? "nav-active" : ""}`}>
                    <li><NavLink to="/multiplayer">Multiplayer</NavLink></li>
                    <li><NavLink to="/">Play</NavLink></li>
                    <li><NavLink to="/rules">Rules</NavLink></li>
                </ul>
                <div className="burger" onClick={showNav}>
                    <div className="burger-line"></div>
                    <div className="burger-line"></div>
                    <div className="burger-line"></div>
                </div>
            </nav>
        </div >
    );
}

export default Nav;