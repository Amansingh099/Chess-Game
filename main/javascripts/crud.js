// Save the current game state to localStorage
function saveGame() {
    const gameState = [];

    // Save the position of each square (row, col, piece)
    for (let row = 0; row < boardSize; row++) {
        const rowState = [];
        for (let col = 0; col < boardSize; col++) {
            rowState.push(board[row][col].textContent);
        }
        gameState.push(rowState);
    }

    localStorage.setItem('chessGame', JSON.stringify(gameState));
    alert("Game saved successfully!");
}

// Load the saved game state from localStorage
function loadGame() {
    const savedState = JSON.parse(localStorage.getItem('chessGame'));

    if (savedState) {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                board[row][col].textContent = savedState[row][col];
            }
        }
        alert("Game loaded successfully!");
    } else {
        alert("No saved game found.");
    }
}

// Delete the saved game state from localStorage
function deleteGame() {
    localStorage.removeItem('chessGame');
    alert("Saved game deleted.");
}
