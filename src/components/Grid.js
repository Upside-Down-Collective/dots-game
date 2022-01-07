import { useEffect, useState } from 'react';

class Line {
    constructor(x, y, h) {
        this.x = x;
        this.y = y;
        this.isHorisontal = h;
        this.neighbours = [];
        this.isTaken = 0; // 0 - no, 1 - player1, 2 - player2
        this.colors = ["gray", "player1", "player2"]
    }

    checkNeighbours() {
        let points = 0;
        let squareComplete = true;
        let boxCoords = [];
        for (const squares of this.neighbours) {
            squareComplete = true;
            for (const line of squares) {
                if (line.isTaken === 0) {
                    squareComplete = false;
                    break;
                }
            }
            if (squareComplete) {
                points++;
                //figuring out what box to color
                if (this.isHorisontal) {
                    boxCoords.push(this.y > squares[0].y ? { x: squares[0].x, y: squares[0].y / 2 } : { x: this.x, y: this.y / 2 })
                }
                else {
                    boxCoords.push({ x: squares[0].x, y: squares[0].y / 2 })
                }
            }
        }
        return { points, boxCoords };
    }
}

class Box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "";
    }
}

function makeGrid(gridSize) {
    let gridLines = [];
    for (let i = 0; i < gridSize * 2 + 1; i++) {
        let row = [];
        for (let j = 0; j < gridSize + 1; j++) {
            if (i % 2 === 0) {
                if (j === gridSize) break;
                row.push(new Line(j, i, true))
            }
            else {
                row.push(new Line(j, i, false))
            }

        }
        gridLines.push(row)
    }

    //tracking neigbours (squares) for each line
    for (let i = 0; i < gridLines.length; i++) {
        for (let j = 0; j < gridLines[i].length; j++) {
            if (gridLines[i][j].isHorisontal) {
                //checking for bottom square, opposite line is first
                if (gridLines[i + 1]) {
                    gridLines[i][j].neighbours.push([gridLines[i + 2][j], gridLines[i + 1][j + 1], gridLines[i + 1][j]])
                }
                //checking for top square
                if (gridLines[i - 1]) {
                    gridLines[i][j].neighbours.push([gridLines[i - 2][j], gridLines[i - 1][j + 1], gridLines[i - 1][j]])
                }
            }
            else {
                //left square, top line is first
                if (gridLines[i][j - 1]) {
                    gridLines[i][j].neighbours.push([gridLines[i - 1][j - 1], gridLines[i][j - 1], gridLines[i + 1][j - 1]])
                }
                //right square
                if (gridLines[i][j + 1]) {
                    gridLines[i][j].neighbours.push([gridLines[i - 1][j], gridLines[i][j + 1], gridLines[i + 1][j]])
                }
            }
        }
    }
    return gridLines;
}

function drawDots(gridSize) {
    const circles = [];
    for (let i = 0; i < gridSize + 1; i++) {
        for (let j = 0; j < gridSize + 1; j++) {
            circles.push((<div className="circle" style={{
                top: `${gridSize * 2 * i + 2.5}rem`,
                left: `${gridSize * 2 * j + 2.5}rem`
            }} key={Math.random() * 10000}></div>))
        }
    }
    return circles;
}

function makeBoxes(gridSize) {
    const boxes = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            boxes.push(new Box(j, i))
        }
    }
    return boxes;
}

function Grid({ gridSize }) {
    const [lines, setLines] = useState(makeGrid(gridSize));
    const [boxes, setBoxes] = useState(makeBoxes(gridSize));
    const [turns, setTurns] = useState(0);
    const [points, setPoints] = useState([0, 0]);
    const [lineCount, setLineCount] = useState(0);

    useEffect(() => {
        console.log(`player 1: ${points[0]} points, player 2: ${points[1]} points`)
        console.log("player " + (turns % 2 + 1) + " turn");
        if (lineCount === gridSize * (gridSize + 1) + (gridSize + 1) * gridSize) {
            if (points[0] > points[1]) {
                console.log("player 1 won!")
            }
            else if (points[1] > points[0]) {
                console.log("player 2 won!")
            }
            else {
                console.log("it's a draw.")
            }
        }
    }, [lineCount])

    // test with useCallback
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
        setLineCount(0)
    }

    return (
        <>
            <div className="Grid">
                {//draws boxes (squares)
                    boxes.map(box => (
                        <div className={`box ${box.color}`} key={Math.random() * 1000} style={{
                            top: `${box.y * gridSize * 2 + gridSize / 2 + 0.375}rem`,
                            left: `${box.x * gridSize * 2 + gridSize / 2 + 0.7}rem`
                        }}></div>
                    ))
                }
                {//draws lines
                    lines.map(row => (row.map(line => (
                        < div className={`line ${line.isHorisontal ? "h-line" : "v-line"} ${line.colors[line.isTaken]}`} style={{
                            top: `${gridSize * line.y + gridSize / 2 + 0.375}rem`,
                            left: `${gridSize * 2 * line.x + gridSize / 2 + 0.7}rem`,
                            width: `${gridSize * 2}rem`
                        }}
                            onClick={() => handleClick(line)}
                            key={Math.random() * 10000}></div>
                    ))))
                }
                {drawDots(gridSize)}
            </div >
            <button onClick={restart}>restart</button> {/*this is a temporary thing*/}
        </>
    )
}

export default Grid;