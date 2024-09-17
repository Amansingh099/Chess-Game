// Save the current game state to localStorage
function saveGame() {
    const gameState = [];
    // Save the current board state
    for (let i = 0; i < boardSize * boardSize; i++) {
        const square = document.querySelector(`div[data-index="${i}"]`);
        const piece = square.querySelector('span');
        if (piece) {
            const pieceData = {
                id: piece.id, // E.g., 'king', 'rook', etc.
                color: piece.classList.contains('pieces-white') ? 'white' : 'black',
                index: i // Save the position of the piece
            };
            console.log(pieceData);
            gameState.push(pieceData);
        } else {
            gameState.push(null); // No piece on this square
        }
    }

    localStorage.setItem('chessGame', JSON.stringify(gameState));
    alert("Game saved successfully!");
}

// Load the saved game state from localStorage
function loadGame() {
    const savedState = JSON.parse(localStorage.getItem('chessGame'));

    if (savedState) {
        boardElement.innerHTML = '';
        for (let i = 0; i < boardSize * boardSize; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.index = i;

            // Set square color
            if (Math.floor(i / boardSize) % 2 === 0) {
                square.classList.add(i % 2 === 0 ? 'white' : 'black');
            } else {
                square.classList.add(i % 2 === 0 ? 'black' : 'white');
            }
             square.addEventListener('dragover', handleDragOver);
             square.addEventListener('drop', handleDrop);
            boardElement.appendChild(square);
        } 

        savedState.forEach((pieceData, index) => {
            const square = document.querySelector(`div[data-index="${index}"]`);
            if (pieceData) {
                // Create a new piece element
                switch (pieceData.id) {
                    case 'pawn':
                        square.innerHTML = pawn;
                        break;
                    case 'rook':
                        square.innerHTML = rook;
                        break;
                    case 'knight':
                        square.innerHTML = knight;
                        break;
                    case 'king':
                        square.innerHTML = king;
                        break;
                    case 'queen':
                        square.innerHTML = queen;
                        break;
                    case 'bishop':
                        square.innerHTML = bishop;
                        break;
                }
                const piece = square.querySelector('span');
                piece.classList.add(pieceData.color === 'white' ? 'pieces-white' : 'pieces-black');
                // Ad event listeners for drag and drop
                piece.draggable = true;
                piece.dataset.index = index;
                piece.addEventListener('dragstart', handleDragStart);
            }
        });

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
