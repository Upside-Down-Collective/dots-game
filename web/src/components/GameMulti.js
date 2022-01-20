import { useEffect, useState, useCallback } from 'react';
// import { useOutletContext } from 'react-router-dom';
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

function GameMulti({ socket, playerNum, roomCode, gridSize }) {
    // const { socket, playerNum, roomCode, gridSize } = useOutletContext();
    const [lines, setLines] = useState(makeGrid(gridSize));
    const [boxes, setBoxes] = useState(makeBoxes(gridSize));
    const [turn, setTurn] = useState(0);
    const [points, setPoints] = useState([0, 0]);
    const [lineCount, setLineCount] = useState(0);
    const [win, setWin] = useState(false);

    useEffect(() => {
        // lineCount === total number of lines in the grid.
        if (lineCount === gridSize * (gridSize + 1) + (gridSize + 1) * gridSize) {
            setWin(true);
        }
    }, [lineCount, gridSize])

    const updateGameValues = useCallback((x, y) => {
        const tempLine = [...lines];
        tempLine[y][x].isTaken = turn;

        let { points: score, boxCoords } = tempLine[y][x].checkNeighbours()
        setPoints(p => {
            const prev = [...p];
            prev[turn - 1] += score;
            return prev;
        })

        setLines([...tempLine]);
        if (score === 0) {
            setTurn(prev => prev === 1 ? 2 : 1)
        }
        else {
            setBoxes(prev => {
                const p = [...prev];
                for (const c of boxCoords) {
                    p[c.y * gridSize + c.x].color = tempLine[y][x].colors[turn];
                }
                return p;
            })
        }
        setLineCount(prev => prev + 1)
    }, [gridSize, lines, turn])

    useEffect(() => {
        socket.on("startGame", () => {
            console.log("startgame")
            setTurn(1);
            setLineCount(0);
            setWin(false);
        })

        socket.on("opponent-move", (x, y) => {
            updateGameValues(x, y);
        })

        socket.on("opponent-left", () => {
            console.log("opponent left")
        })

        return () => {
            socket.removeAllListeners();
        }
    }, [socket, updateGameValues])

    const handleClick = (line) => {
        if (line.isTaken === 0 && turn === playerNum) {
            socket.emit("turn", line.x, line.y, roomCode);
            updateGameValues(line.x, line.y);
        }
    }

    function restart() {
        // setLines(makeGrid(gridSize));
        // setBoxes(makeBoxes(gridSize));
        // setTurn(0);
        // setPoints([0, 0]);
        // setLineCount(0);
        // setWin(false);
    }

    return (
        <section className="Game">
            {lines && <div className="game-grid">
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
            }
            <div className="game-info">
                {turn === 0 && <p>Your room code: {roomCode}, <br />waiting for the opponent to join</p>}

                <p className="p1-points"> <span className={`${turn === 1 ? "turn" : ""}`}> {playerNum === 1 ? "You:" : "Opponent:"} </span> {points[0]} points</p>
                <p className="p2-points"><span className={`${turn === 2 ? "turn" : ""}`}>{playerNum === 2 ? "You:" : "Opponent:"} </span> {points[1]} points</p>
                <button onClick={restart}>New Game</button>
            </div>
        </section>
    )
}

export default GameMulti;