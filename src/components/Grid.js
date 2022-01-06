import { useEffect, useState } from 'react';

class Line {
    constructor(x, y, h) {
        this.x = x;
        this.y = y;
        this.isHorisontal = h;
        this.neighbours = [];
        this.isOccupied = 0; // 0 - no, 1 - player1, 2 - player2
        this.color = ["lightgray", "darkred", "black"]
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
                //checking for bottom square
                if (gridLines[i + 1]) {
                    gridLines[i][j].neighbours.push([gridLines[i + 1][j + 1], gridLines[i + 1][j], gridLines[i + 2][j]])
                }
                //checking for top square
                if (gridLines[i - 1]) {
                    gridLines[i][j].neighbours.push([gridLines[i - 1][j + 1], gridLines[i - 1][j], gridLines[i - 2][j]])
                }
            }
            else {
                //left square
                if (gridLines[i][j - 1]) {
                    gridLines[i][j].neighbours.push([gridLines[i][j - 1], gridLines[i - 1][j - 1], gridLines[i + 1][j - 1]])
                }
                //right square
                if (gridLines[i][j + 1]) {
                    gridLines[i][j].neighbours.push([gridLines[i][j + 1], gridLines[i - 1][j], gridLines[i + 1][j]])
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

function Grid({ gridSize }) {
    const [lines, setLines] = useState([])
    const [turns, setTurns] = useState(0)

    useEffect(() => {
        setLines(makeGrid(gridSize))
    }, [gridSize])

    function handleClick(line) {
        console.log(line, line.neighbours);
        // check if it's a box; if box => +1 point.
        // line.isOccupied = 1; <- doesn't work. copy the whole array, change value, update array in setLines. Immer?
    }

    return (
        <div className="Grid">
            {//draws lines
                lines.map(row => (row.map(line => (
                    < div className={`line ${line.isHorisontal ? "h-line" : "v-line"}`} style={{
                        top: `${gridSize * line.y + 2.5}rem`,
                        left: `${gridSize * 2 * line.x + 2.5}rem`,
                        width: `${gridSize * 2}rem`,
                        backgroundColor: line.color[line.isOccupied]
                    }}
                        onClick={() => handleClick(line)}
                        key={Math.random() * 10000}></div>
                ))))
            }
            {drawDots(gridSize)}

        </div >
    )
}

export default Grid;