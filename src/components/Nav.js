import { Link } from "react-router-dom";

function Nav() {
    return (
        <div className="nav-bg">
            <nav>
                <h1>Dots and Boxes</h1>
                <ul>
                    <li><Link to="/">Play</Link></li>
                    <li><Link to="/rules">Rules</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Nav;