import './App.css';
import Game from './components/Game';
import Nav from './components/Nav';
import Multiplayer from './components/Multiplayer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Rules from './components/Rules';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route exact path="/" element={<Game gridSize={4} />} />
          <Route exact path="/rules" element={<Rules />} />
          <Route exact path="/multiplayer" element={<Multiplayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
