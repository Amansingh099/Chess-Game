function saveGame() {
    const gameState = [];
    for (let i = 0; i < boardSize * boardSize; i++) {
        const square = document.querySelector(`div[data-index="${i}"]`);
        const piece = square.querySelector('span');
        if (piece) {
            const pieceData = {
                id: piece.id, // E.g., 'king', 'rook', etc.
                color: piece.classList.contains('pieces-white') ? 'white' : 'black',
                index: i 
            };
            gameState.push(pieceData);
        } else {
            gameState.push(null);
        }
    }

    const gameName = prompt("Enter a name for this saved game:");
    if (gameName) {
        let savedGames = JSON.parse(localStorage.getItem('chessGames')) || {};
        savedGames[gameName] = gameState;
        localStorage.setItem('chessGames', JSON.stringify(savedGames));
        alert("Game saved successfully!");

        populateSavedGamesList();
    } else {
        alert("Game save canceled.");
    }
}


function loadGame(gameName) {
    const savedGames = JSON.parse(localStorage.getItem('chessGames'));

    if (savedGames && savedGames[gameName]) {
        const savedState = savedGames[gameName];

        boardElement.innerHTML = '';
        for (let i = 0; i < boardSize * boardSize; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.index = i;

 
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
                piece.draggable = true;
                piece.dataset.index = index;
                piece.addEventListener('dragstart', handleDragStart);
            }
        });

        alert(`Game "${gameName}" loaded successfully!`);
    } else {
        alert("Game not found.");
    }
}



function deleteGame() {
    const savedGames = JSON.parse(localStorage.getItem('chessGames'));

    if (savedGames) {
        const gameNames = Object.keys(savedGames);
        if (gameNames.length === 0) {
            alert("No saved games to delete.");
            return;
        }

        const gameName = prompt(`Enter the name of the game to delete:\n${gameNames.join('\n')}`);
        if (gameName && savedGames[gameName]) {
            delete savedGames[gameName];
            localStorage.setItem('chessGames', JSON.stringify(savedGames));
            alert("Game deleted successfully.");

            // Update the list of saved games
            populateSavedGamesList();
        } else {
            alert("Game not found.");
        }
    } else {
        alert("No saved games found.");
    }
}
function populateSavedGamesList() {
    const savedGamesList = document.getElementById('savedGamesList');
    savedGamesList.innerHTML = ''; // Clear the list before populating

    const savedGames = JSON.parse(localStorage.getItem('chessGames')) || {};

    Object.keys(savedGames).forEach(gameName => {
        const li = document.createElement('li');
        li.textContent = gameName;

        // Add click event to load the selected game
        li.addEventListener('click', () => loadGame(gameName));

        savedGamesList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateSavedGamesList(); // Populate the saved games list when the page loads
});

