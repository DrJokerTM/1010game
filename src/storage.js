// Funkce pro práci s IndexedDB nebo localStorage

export function saveGameState(gameState) {
    localStorage.setItem("currentGame", JSON.stringify(gameState));
}

export function loadGameState() {
    return JSON.parse(localStorage.getItem("currentGame"));
}
