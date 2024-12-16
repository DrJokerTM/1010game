// Hlavní JavaScriptový soubor

// Prvky DOM
const newGameButton = document.getElementById("newGameButton");
const continueGameButton = document.getElementById("continueGameButton");
const gameBoard = document.getElementById("gameBoard");
const menu = document.getElementById("menu");
const highScoreDisplay = document.getElementById("highScore");
const leaderboard = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboardList");
const pauseButton = document.getElementById("pauseButton");
const blocksContainer = document.getElementById("blocks");

// Stav hry
let game;

// Inicializace nové hry
function startNewGame() {
    game = new Game();
    menu.classList.add("hidden");
    gameBoard.classList.remove("hidden");
    game.start();
    updateHighScore();
}

// Obnovení předchozí hry
function continueGame() {
    menu.classList.add("hidden");
    gameBoard.classList.remove("hidden");
}

// Pauza hry
pauseButton.addEventListener("click", () => {
    alert("Hra pozastavena.");
});

// Spuštění nové hry
newGameButton.addEventListener("click", startNewGame);

// Třída hry
class Game {
    constructor() {
        this.board = this.initBoard();
        this.score = 0;
        this.blocks = [];
        this.draggingBlock = null;
    }

    initBoard() {
        return Array.from({ length: 10 }, () => Array(10).fill(null));
    }

    start() {
        this.generateBlocks();
        this.updateBoard();
    }

    generateBlocks() {
        this.blocks = [new Block(), new Block(), new Block()];
        this.displayBlocks();
    }

    displayBlocks() {
        blocksContainer.innerHTML = ""; // Vymaž staré bloky
        this.blocks.forEach((block, index) => {
            const blockElement = document.createElement("div");
            blockElement.classList.add("block");
            blockElement.dataset.index = index;
            blockElement.draggable = true;

            // Přidej reprezentaci tvaru
            block.shape.forEach(row => {
                const rowElement = document.createElement("div");
                rowElement.style.display = "flex";
                row.forEach(cell => {
                    const cellElement = document.createElement("div");
                    cellElement.classList.add("cell");
                    cellElement.style.width = "30px";
                    cellElement.style.height = "30px";
                    cellElement.style.backgroundColor = cell ? "#0077cc" : "transparent";
                    rowElement.appendChild(cellElement);
                });
                blockElement.appendChild(rowElement);
            });

            blockElement.addEventListener("dragstart", (e) => {
                this.draggingBlock = block;
                e.dataTransfer.setData("text/plain", index);
            });

            blocksContainer.appendChild(blockElement);
        });
    }

    updateBoard() {
        const boardElement = document.getElementById("board");
        boardElement.innerHTML = "";

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                if (this.board[i][j]) {
                    cell.classList.add("filled");
                }
                cell.dataset.row = i;
                cell.dataset.col = j;
                boardElement.appendChild(cell);
            }
        }

        boardElement.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        boardElement.addEventListener("drop", (e) => {
            e.preventDefault();
            const targetCell = e.target;
            const row = parseInt(targetCell.dataset.row);
            const col = parseInt(targetCell.dataset.col);

            if (this.canPlaceBlock(this.draggingBlock, row, col)) {
                this.placeBlock(this.draggingBlock, row, col);
                this.blocks.splice(this.blocks.indexOf(this.draggingBlock), 1);
                this.generateBlocks();
                this.updateBoard();
                this.score += 10;
                updateHighScore();
            }
        });
    }

    canPlaceBlock(block, row, col) {
        for (let i = 0; i < block.shape.length; i++) {
            for (let j = 0; j < block.shape[i].length; j++) {
                if (block.shape[i][j]) {
                    const boardRow = row + i;
                    const boardCol = col + j;
                    if (boardRow < 0 || boardRow >= 10 || boardCol < 0 || boardCol >= 10) {
                        return false;
                    }
                    if (this.board[boardRow][boardCol]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placeBlock(block, row, col) {
        for (let i = 0; i < block.shape.length; i++) {
            for (let j = 0; j < block.shape[i].length; j++) {
                if (block.shape[i][j]) {
                    const boardRow = row + i;
                    const boardCol = col + j;
                    this.board[boardRow][boardCol] = true;
                }
            }
        }
    }
}

// Třída bloku
class Block {
    constructor() {
        this.shape = this.generateShape();
    }

    generateShape() {
        // Náhodně generovat tvar bloku
        const shapes = [
            [[1, 1], [1, 1]], // čtverec
            [[1, 1, 1], [0, 1, 0]], // T
            [[1], [1], [1]], // čára
        ];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }
}
