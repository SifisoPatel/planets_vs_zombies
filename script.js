const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
let numberOfResources = 300;

// mouse
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function (e) {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function () {
    mouse.x = undefined;
    mouse.y = undefined;
})

// game board
const controlsBar = {
    width: canvas.width,
    height: cellSize,
}

class Cell { // Blueprint for custom cell object
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw() {
        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

    }
}

function createGrid() { // Fill game grid array with cell objects
    for (let y = cellSize; y < canvas.height; y += cellSize) {
        for (let x = 0; x < canvas.width; x += cellSize) {
            gameGrid.push(new Cell(x, y));
        }
    }
}

createGrid();

function handleGameGrid() { // Cycling through the array and drawing each individual game cell
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}
// projectiles
// defenders
class Defender {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.shooting = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '30px Arial';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
    }
}

canvas.addEventListener('click', function () {
    const gridPositionX = mouse.x - (mouse.x % cellSize);
    const gridPositionY = mouse.y - (mouse.y % cellSize);
    if (gridPositionY < cellSize) return; // If someone clicks on the menubar
    for (let i = 0; i < defenders.length; i++) { // Check if there is a defender already
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY)
            return;
    }
    let defenderCost = 100;
    if (numberOfResources >= defenderCost) {
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    }
});

function handleDefenders() {
    for (let i = 0; i < defenders.length; i++) {
        defenders[i].draw();
    }
}
// enemies
// resources
// utilities
function handleGameStatus() {
    ctx.fillStyle = 'gold';
    ctx.font = '30px Arial';
    ctx.fillText('Resources: ' + numberOfResources, 20, 55);
}

function animate() { //Game loop. Draws and redraws game to mimic movement (recursive function)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleGameStatus();
    requestAnimationFrame(animate);
}

animate();

function collision(first, second) { //Reusable collision detection function
    if (!(first.x > second.x + second.width ||  //If any of these are true, there is no collision
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)
    ) {
        return true;
    };
};