class Line {
    constructor(x, y, h) {
        this.x = x;
        this.y = y;
        this.isHorisontal = h;
        this.neighbours = [];
    }
}

function Grid({ gridSize }) {
    let gridCells = [];
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
        gridCells.push(row)
    }

    function drawDots() {
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

    return (
        <div className="Grid">
            {
                gridCells.map(row => (row.map(cell => (
                    < div className={`line ${cell.isHorisontal ? "h-line" : "v-line"}`} style={{
                        top: `${gridSize * cell.y + 2.5}rem`,
                        left: `${gridSize * 2 * cell.x + 2.5}rem`,
                        width: `${gridSize * 2}rem`
                    }} key={Math.random() * 10000}> </div>
                ))))
            }
            {drawDots()}

        </div >
    )
}

export default Grid;