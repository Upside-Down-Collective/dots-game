import './App.css';
import Game from './components/Game';
import Nav from './components/Nav';

function App() {
  return (
    <div className="App">
      <Nav />
      <Game gridSize={4} />
    </div>
  );
}

export default App;
