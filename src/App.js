import './App.css';
import Grid from './components/Grid';
import Nav from './components/Nav';

function App() {
  return (
    <div className="App">
      <Nav />
      <Grid gridSize={4} />
    </div>
  );
}

export default App;
