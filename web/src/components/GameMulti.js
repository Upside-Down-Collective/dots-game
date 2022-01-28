import { useEffect, useState, useCallback, useReducer } from 'react';
import { makeGrid, makeBoxes, drawDots } from '../utils';
import Notification from './Notification';
import Alert from './Alert';

function whoWon(points, playerNum) {
    if (points[0] > points[1]) {
        if (playerNum === 1) {
            return { msg: "You won!", isLost: false }
        }
        else return { msg: "You lost.", isLost: true }
    }
    else if (points[1] > points[0]) {
        if (playerNum === 2) {
            return { msg: "You won!", isLost: false }
        }
        else return { msg: "You lost.", isLost: true }
    }
    else {
        return { msg: "It's a draw.", isLost: false }
    }
}

const ACTIONS = {
    USER_LEFT: 'user-left',
    WAITING_FOR_RESPONCE: 'waiting-for-responce',
    NEW_GAME_DENIED: 'new-game-denied',
}

function reducer(state, action) {
    let temp;
    switch (action.type) {
        case ACTIONS.USER_LEFT:
            temp = { ...state };
            temp.userLeft.isActive = action.active;
            return temp
        case ACTIONS.WAITING_FOR_RESPONCE:
            temp = { ...state };
            temp.waitingForResponce.isActive = action.active;
            return temp
        case ACTIONS.NEW_GAME_DENIED:
            temp = { ...state };
            temp.newGameDenied.isActive = action.active;
            return temp
        default:
            return state
    }
}

function GameMulti({ socket, playerNum, roomCode, gridSize }) {
    const [lines, setLines] = useState(makeGrid(gridSize));
    const [boxes, setBoxes] = useState(makeBoxes(gridSize));
    const [turn, setTurn] = useState(0);
    const [points, setPoints] = useState([0, 0]);
    const [lineCount, setLineCount] = useState(0);
    const [endGame, setEndGame] = useState({
        isEnd: false,
        msg: "",
        isLost: false
    });
    const [isAlert, setisAlert] = useState(false)

    const initialState = {
        userLeft: {
            isActive: false,
            msg: "Opponent left the game."
        },
        waitingForResponce: {
            isActive: false,
            msg: "Waiting for the opponent's responce."
        },
        newGameDenied: {
            isActive: false,
            msg: "Your opponent doesn't want to restart the game."
        }
    }
    const [notifications, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        // lineCount === total number of lines in the grid.
        if (lineCount === gridSize * (gridSize + 1) + (gridSize + 1) * gridSize) {
            let end = whoWon(points, playerNum);
            setEndGame({
                isEnd: true,
                msg: end.msg,
                isLost: end.isLost
            });
        }
    }, [lineCount, gridSize, points, playerNum])

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

    const newGame = useCallback(() => {
        setLines(makeGrid(gridSize));
        setBoxes(makeBoxes(gridSize))
        setTurn(1);
        setLineCount(0);
        setEndGame({
            isEnd: false,
            msg: "",
            isLost: false
        });
    }, [gridSize])

    useEffect(() => {
        socket.on("start-game", newGame)

        socket.on("opponent-move", (x, y) => {
            updateGameValues(x, y);
        })

        socket.on("opponent-left", () => {
            dispatch({ type: ACTIONS.USER_LEFT, active: true })
        })

        socket.on("restart-game-request", () => {
            setisAlert(true);
        })

        socket.on("restart-game-ready", isReady => {
            if (isReady) {
                newGame();
            }
            else {
                dispatch({ type: ACTIONS.NEW_GAME_DENIED, active: true })
            }
        })

        return () => {
            socket.removeAllListeners();
        }
    }, [socket, updateGameValues, newGame])

    const handleClick = (line) => {
        if (line.isTaken === 0 && turn === playerNum) {
            socket.emit("turn", line.x, line.y, roomCode);
            updateGameValues(line.x, line.y);
        }
    }

    function restart() {
        socket.emit("restart-game", roomCode)
        dispatch({ type: ACTIONS.WAITING_FOR_RESPONCE, active: true })
    }

    const handleClickNo = () => {
        socket.emit("restart-game-responce", false, roomCode)
        setisAlert(false);
    }

    const handleClickYes = () => {
        socket.emit("restart-game-responce", true, roomCode)
        setisAlert(false);
        newGame();
    }

    return (
        <>
            {isAlert && <Alert handleClickNo={handleClickNo} handleClickYes={handleClickYes} />}
            <section className="Game">

                <Notification
                    msg={notifications.waitingForResponce.msg}
                    active={notifications.waitingForResponce.isActive}
                    dispatch={dispatch}
                    action={ACTIONS.WAITING_FOR_RESPONCE} />
                <Notification
                    msg={notifications.newGameDenied.msg}
                    active={notifications.newGameDenied.isActive}
                    dispatch={dispatch}
                    action={ACTIONS.NEW_GAME_DENIED} />
                <Notification
                    msg={notifications.userLeft.msg}
                    active={notifications.userLeft.isActive}
                    dispatch={dispatch}
                    action={ACTIONS.USER_LEFT} />

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
                    <div className={`win ${endGame.isEnd ? "end" : ""} ${endGame.isLost ? "lost" : ""}`}>
                        <p>{endGame.msg}</p>
                    </div>
                </div >
                }
                <div className="game-info">
                    {turn === 0 && <p className='room-code'>Your room code: {roomCode}, <br />waiting for the opponent to join</p>}
                    <p className="p1-points"> <span className={`${turn === 1 ? "turn" : ""}`}> {playerNum === 1 ? "You:" : "Opponent:"} </span> {points[0]} points</p>
                    <p className="p2-points"><span className={`${turn === 2 ? "turn" : ""}`}>{playerNum === 2 ? "You:" : "Opponent:"} </span> {points[1]} points</p>
                    <button onClick={restart}>New Game</button>
                </div>
            </section>
        </>
    )
}

export default GameMulti;