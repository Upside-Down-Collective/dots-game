import { useEffect, useState } from 'react';
import { makeGrid, makeBoxes, drawDots } from './utils';

function whoWon(points) {
    if (points[0] > points[1]) {
        return "Player 1 won!"
    }
    else if (points[1] > points[0]) {
        return "Player 2 won!"
    }
    else {
        return "it's a draw."
    }
}

function Game({ gridSize }) {
    const [lines, setLines] = useState(makeGrid(gridSize));
    const [boxes, setBoxes] = useState(makeBoxes(gridSize));
    const [turns, setTurns] = useState(0);
    const [points, setPoints] = useState([0, 0]);
    const [lineCount, setLineCount] = useState(0);
    const [win, setWin] = useState(false);

    useEffect(() => {
        if (lineCount === gridSize * (gridSize + 1) + (gridSize + 1) * gridSize) {
            whoWon(points);
            setWin(true);
        }
    }, [lineCount])

    function handleClick(line) {
        if (line.isTaken === 0) {
            const tempLine = [...lines];
            tempLine[line.y][line.x].isTaken = (turns % 2 + 1);

            let { points: score, boxCoords } = tempLine[line.y][line.x].checkNeighbours()
            setPoints(p => {
                const prev = [...p];
                prev[turns % 2] += score;
                return prev;
            })
            setLines([...tempLine]);
            if (score === 0) {
                setTurns(prev => prev + 1)
            }
            else {
                setBoxes(prev => {
                    const p = [...prev];
                    for (const c of boxCoords) {
                        p[c.y * gridSize + c.x].color = tempLine[line.y][line.x].colors[turns % 2 + 1];
                    }
                    return p;
                })
            }
            setLineCount(prev => prev + 1)
        }
    }

    function restart() {
        setLines(makeGrid(gridSize));
        setBoxes(makeBoxes(gridSize));
        setTurns(0);
        setPoints([0, 0]);
        setLineCount(0);
        setWin(false);
    }

    return (
        <section className="Game">
            <div className="game-grid">
                {//draws boxes (squares)
                    boxes.map(box => (
                        <div className={`box ${box.color}`} key={Math.random() * 1000} style={{
                            top: `${box.y * gridSize * 2 + gridSize / 2 + 0.375}em`,
                            left: `${box.x * gridSize * 2 + gridSize / 2 + 0.75}em`
                        }}></div>
                    ))
                }
                {//draws lines
                    lines.map(row => (row.map(line => (
                        < div className={`line ${line.isHorisontal ? "h-line" : "v-line"} ${line.colors[line.isTaken]}`} style={{
                            top: `${gridSize * line.y + gridSize / 2 + 0.375}em`,
                            left: `${gridSize * 2 * line.x + gridSize / 2 + 0.75}em`,
                            width: `${gridSize * 2}em`
                        }}
                            onClick={() => handleClick(line)}
                            key={Math.random() * 10000}></div>
                    ))))
                }
                {drawDots(gridSize)}
                <div className={`win ${win ? "end" : ""}`}>
                    <p>{whoWon(points)}</p>
                </div>
            </div >
            <div className="game-info">
                <p className="p1-points"> <span className={`${turns % 2 === 0 ? "turn" : ""}`}>Player 1: </span> {points[0]} points</p>
                <p className="p2-points"><span className={`${turns % 2 === 1 ? "turn" : ""}`}>Player 2: </span> {points[1]} points</p>
                <button onClick={restart}>New Game</button>
            </div>
        </section>
    )
}

export default Game;