import './App.css';
import Game from './components/Game';
import Nav from './components/Nav';
import Multiplayer from './components/Multiplayer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Rules from './components/Rules';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Game gridSize={4} />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
