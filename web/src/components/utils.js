
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

export function makeGrid(gridSize) {
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

export function makeBoxes(gridSize) {
    const boxes = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            boxes.push(new Box(j, i))
        }
    }
    return boxes;
}

export function drawDots(gridSize) {
    const circles = [];
    for (let i = 0; i < gridSize + 1; i++) {
        for (let j = 0; j < gridSize + 1; j++) {
            circles.push((<div className="circle" style={{
                top: `${gridSize * 2 * i + 2.5}em`,
                left: `${gridSize * 2 * j + 2.5}em`
            }} key={Math.random() * 10000}></div>))
        }
    }
    return circles;
}