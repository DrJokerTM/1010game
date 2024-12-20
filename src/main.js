// Hlavní JavaScriptový soubor
window.onload = () => {
    document.getElementById("instantEndGame").addEventListener("click", () => {
        game.endGame(); // Zavolejte metodu pro ukončení hry
    });
};

// Prvky DOM
const newGameButton = document.getElementById("newGameButton");
const continueGameButton = document.getElementById("continueGameButton");
const gameBoard = document.getElementById("gameBoard");
const menu = document.getElementById("menu");
const highScoreDisplay = document.getElementById("highScore");
const leaderboard = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboardList");
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

function updateHighScore() {
    highScoreDisplay.textContent = game.score;
}

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
        // Pokud máme všechny bloky použité, vygeneruj nové bloky pouze v tomto okamžiku
        if (this.blocks.length === 0) {
            this.blocks = [new Block(), new Block(), new Block()]; // Vygeneruj tři nové bloky
            this.displayBlocks();
        }
    }
    
    displayBlocks() {
        blocksContainer.innerHTML = ""; // Vymaž staré bloky
        this.blocks.forEach((block, index) => {
            const blockElement = document.createElement("div");
            blockElement.classList.add("block");
            blockElement.dataset.index = index;
            blockElement.draggable = true;
    
            // Nastavení vzhledu bloku
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
    
            // Zajistíme, že během přetahování bude vidět celý blok
            blockElement.addEventListener("dragstart", (e) => {
                this.draggingBlock = block;
                e.dataTransfer.setData("text/plain", index);
                setTimeout(() => {
                    blockElement.classList.add("dragging");
                }, 0);
            });
    
            blockElement.addEventListener("dragend", () => {
                blockElement.classList.remove("dragging");
            });
    
            blocksContainer.appendChild(blockElement);
        });

        // Přetahování na mobilních zařízeních
        blocksContainer.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const blockElement = touch.target.closest('.block');
            if (blockElement) {
                const index = blockElement.dataset.index;
                this.draggingBlock = this.blocks[index];

                blockElement.classList.add("dragging");

                // Blokování scrollování během přetahování
                e.preventDefault();
            }
        });

        blocksContainer.addEventListener('touchmove', (e) => {
            if (this.draggingBlock) {
                const touch = e.touches[0];
                const blockElement = document.querySelector(".dragging");

                blockElement.style.position = "absolute";
                blockElement.style.left = `${touch.pageX - blockElement.offsetWidth / 2}px`;
                blockElement.style.top = `${touch.pageY - blockElement.offsetHeight / 2}px`;

                // Blokování scrollování během pohybu
                e.preventDefault();
            }
        });

        blocksContainer.addEventListener('touchend', (e) => {
            if (this.draggingBlock) {
                const touch = e.changedTouches[0];
                
                // Získání pozice herní plochy
                const boardElement = document.getElementById("board");
                const boardRect = boardElement.getBoundingClientRect();
                
                // Získání velikosti buňky
                const cellSize = 30; // Velikost jedné buňky (např. 30px)
        
                // Získání souřadnic dotyku
                const offsetX = touch.clientX - boardRect.left;
                const offsetY = touch.clientY - boardRect.top;
        
                // Výpočet cílové buňky
                const row = Math.floor(offsetY / cellSize)-1; // Řádek
                const col = Math.floor(offsetX / cellSize)-1; // Sloupec
        
                // Ověření platnosti cílové buňky
                if (row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length) {
                    // Umístění bloku na středu buňky
                    const targetX = col * cellSize + boardRect.left + cellSize / 2;
                    const targetY = row * cellSize + boardRect.top + cellSize / 2;
        
                    // Nastavení pozice bloku ve středu vybrané buňky
                    const blockElement = document.querySelector(".dragging");
                    blockElement.style.left = `${targetX - blockElement.offsetWidth / 2}px`; // Posun do středu
                    blockElement.style.top = `${targetY - blockElement.offsetHeight / 2}px`; // Posun do středu
        
                    // Logování pro kontrolu
                    console.log("Block placed at grid:", row, col);
                    
                    // Provádění dalších herních logických operací, např. ověření, zda lze blok umístit
                    if (this.canPlaceBlock(this.draggingBlock, row, col)) {
                        this.placeBlock(this.draggingBlock, row, col); // Umístění bloku do herního plánu
                        this.blocks.splice(this.blocks.indexOf(this.draggingBlock), 1); // Odstranění bloku z pole
                        this.generateBlocks(); // Generování nových bloků
                        this.updateBoard(); // Aktualizace herního plánu
                    } else {
                        console.error("Cannot place block at this position.");
                    }
                } else {
                    console.error("Block dropped outside the board.");
                }
        
                // Odebrání třídy "dragging"
                const blockElement = document.querySelector(".dragging");
                blockElement.classList.remove("dragging");
                this.draggingBlock = null;
        
                e.preventDefault();
            }
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

    canPlaceAnyBlock() {
        for (const block of this.blocks) {
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    if (this.canPlaceBlock(block, row, col)) {
                        return true; // Našli jsme místo, kde blok může být umístěn
                    }
                }
            }
        }
        return false; // Žádný blok nelze nikam umístit
    }

    placeBlock(block, row, col) {
        // Umístění bloku na herní pole
        for (let i = 0; i < block.shape.length; i++) {
            for (let j = 0; j < block.shape[i].length; j++) {
                if (block.shape[i][j]) {
                    const boardRow = row + i;
                    const boardCol = col + j;
                    this.board[boardRow][boardCol] = true;
                }
            }
        }
    
        // Odstraň blok z pole
        const blockIndex = this.blocks.indexOf(block);
        if (blockIndex > -1) {
            this.blocks.toSpliced(blockIndex, 1);
        }
        // Zkontroluj, zda byly všechny bloky použity
        if (this.blocks.length === 0) {
            this.generateBlocks(); // Vygeneruj nové bloky až po použití všech
        }
    
        // Zobraz aktuální bloky
        setTimeout(() => {
            this.displayBlocks();
        }, 0);
        setTimeout(() => {
            this.clearFullLines(); // Zkontroluj a vymaž plné řady/sloupce po umístění bloku
        }, 0);
        setTimeout(() => {
            if (!this.canPlaceAnyBlock()) {
                this.endGame(); // Hra skončila
            }
        }, 0);
    }

    clearFullLines() {
        const rowsToClear = [];
        const colsToClear = [];

        // Zkontroluj plné řady
        for (let i = 0; i < 10; i++) {
            if (this.board[i].every(cell => cell === true)) {
                rowsToClear.push(i);
            }
        }

        // Zkontroluj plné sloupce
        for (let j = 0; j < 10; j++) {
            if (this.board.every(row => row[j] === true)) {
                colsToClear.push(j);
            }
        }

        // Vymaž plné řady
        rowsToClear.forEach(row => {
            this.board[row] = Array(10).fill(null);
        });

        // Vymaž plné sloupce
        colsToClear.forEach(col => {
            for (let i = 0; i < 10; i++) {
                this.board[i][col] = null;
            }
        });

        // Přičti body za vymazání řad a sloupců
        const cleared = rowsToClear.length + colsToClear.length;
        this.score += cleared * 10;

        // Aktualizuj zobrazení desky a skóre
        this.updateBoard();
        updateHighScore();
    }

    endGame() {
        // Zešednout zbylé bloky
        const blockElements = document.querySelectorAll(".block");
        blockElements.forEach(blockElement => {
            blockElement.classList.add("disabled");
        });
    
        // Přidat překryvné okno "Konec hry"
        const gameOverOverlay = document.createElement("div");
        gameOverOverlay.id = "gameOverOverlay";
        
        const gameOverText = document.createElement("h2");
        gameOverText.textContent = "Konec hry!";
    
        const scoreText = document.createElement("p");
        scoreText.textContent = `Vaše skóre: ${this.score}`;

        const backButton = document.createElement("button");
        backButton.textContent = "Zpět na hlavní obrazovku";
        backButton.addEventListener("click", () => {
            // Návrat na hlavní obrazovku
            document.getElementById("menu").classList.remove("hidden");
            document.getElementById("gameBoard").classList.add("hidden");
            gameOverOverlay.remove();
        });
    
        gameOverOverlay.appendChild(gameOverText);
        gameOverOverlay.appendChild(scoreText);
        gameOverOverlay.appendChild(backButton);
        document.body.appendChild(gameOverOverlay);
    }
    
    
    resetGame() {
        this.board = this.initBoard();
        this.score = 0;
        this.blocks = [];
        menu.classList.remove("hidden");
        gameBoard.classList.add("hidden");
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
            [[1, 1, 1], [1, 1, 1], [1, 1, 1]], // velký čtverec
            [[1, 1, 1], [0, 1, 0]], // T
            [[1], [1], [1]], // čára svislá
            [[1], [1]], // čára svislá krátká
            [[1, 1, 1]], // čára vodorovná
            [[1, 1]], // čára vodorovná krátká
            [[1]], // 1x1
            

        ];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }
}
