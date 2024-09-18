// Create a chess board and set up pieces
const boardElement = document.getElementById('game-board');
const boardSize = 8;
let currentPlayer = 'white';
let timerWhite = 600; 
let timerBlack = 600; 
let timerInterval; 

const whiteTimerElement = document.getElementById('white-timer');
const blackTimerElement = document.getElementById('black-timer');
let board = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];

function initializeBoard() {
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

        // Set piece if present
        if (board[i] !== '') {
            square.innerHTML = board[i];
            const piece=square.querySelector('span');
            
            piece.draggable = true;
            if (i > 47) {
                piece.classList.add("pieces-white");
            }
            if (i < 16) {
                piece.classList.add("pieces-black");
            }
            piece.dataset.index = i;
            piece.addEventListener('dragstart', handleDragStart);
            
        }

        square.addEventListener('dragover', handleDragOver);
        square.addEventListener('drop', handleDrop);

        boardElement.appendChild(square);
    }
}

function handleDragStart(event) {
    const piece = event.target;
    const pieceColor = piece.classList.contains('pieces-white') ? 'white' : 'black';

    if (pieceColor !== currentPlayer) {
        event.preventDefault();
        return;
    }

    const pieceIndex = piece.dataset.index;
    event.dataTransfer.setData('text/plain', pieceIndex);
}


function handleDragOver(event) {
    event.preventDefault();  // Allow the drop event
}

function handleDrop(event) {
    event.preventDefault();
    const fromIndex = event.dataTransfer.getData('text');
    const toIndex = event.target.dataset.index;
    if (isvalidmove(fromIndex, toIndex)) {
        movePiece(fromIndex, toIndex);
        if (isInCheck(currentPlayer)) {
            movePiece(toIndex, fromIndex);
            alert(still in check);
        }
        switchTurn(); 
    } else {
        alert("wrong move");
    }
}

// to check if the move is valid or not
function isvalidmove(fromIndex, toIndex) {
    const fromSquare = document.querySelector(`div[data-index="${fromIndex}"]`);
    const toSquare = document.querySelector(`div[data-index="${toIndex}"]`);
    const piece = fromSquare.querySelector('span');
    const targetPiece = toSquare.querySelector('span');

    if (!piece) return false; // No piece to move
    const pieceId = piece.id;
    const pieceColor = piece.classList.contains("pieces-white") ? 'white' : 'black';
    const targetColor = targetPiece ? (targetPiece.classList.contains("pieces-white") ? 'white' : 'black') : null;

    // Ensure the target square does not contain a piece of the same color
    if (targetColor === pieceColor) return false;

    // Calculate the row and column of the squares
    const fromRow = Math.floor(fromIndex / boardSize);
    const fromCol = fromIndex % boardSize;
    const toRow = Math.floor(toIndex / boardSize);
    const toCol = toIndex % boardSize;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (pieceId) {
        case "pawn":
            // Pawn moves (not including en passant or promotion for simplicity)
            if (pieceColor === 'white') {
               
                if (fromCol === toCol && rowDiff === 1 && !targetPiece) return true; // Move one step forward
                if (fromCol === toCol && rowDiff === 2 && !targetPiece && fromRow === 6) return true; // Move two steps forward from start
                if (rowDiff === 1 && colDiff === 1 && targetPiece && targetColor === 'black') return true; // Capture diagonally
            } else {
                // Black pawns move down (row increases)
                if (fromCol === toCol && rowDiff === 1 && !targetPiece) return true; // Move one step forward
                if (fromCol === toCol && rowDiff === 2 && !targetPiece && fromRow === 1) return true; // Move two steps forward from start
                if (rowDiff === 1 && colDiff === 1 && targetPiece && targetColor === 'white') return true; // Capture diagonally
            }
            break;

        case "rook":
            // Rook moves (straight lines)
            if ((rowDiff === 0 && colDiff > 0) || (rowDiff > 0 && colDiff === 0)) return !isRookPathBlocked(fromRow, fromCol, toRow, toCol);
            break;

        case "bishop":
            // Bishop moves (diagonals)
            if (rowDiff === colDiff) return !isBishopPathBlocked(fromRow, fromCol, toRow, toCol);
            break;

        case "queen":
            // Queen moves (straight lines and diagonals)
            if ((rowDiff === 0 && colDiff > 0) || (rowDiff > 0 && colDiff === 0) || (rowDiff === colDiff)) {
                return !(
                    (rowDiff === 0 && colDiff > 0 && isRookPathBlocked(fromRow, fromCol, toRow, toCol)) ||
                    (rowDiff === colDiff && isBishopPathBlocked(fromRow, fromCol, toRow, toCol))
                );
            }
            break;

        case "king":
            // King moves (one step in any direction)
            if (rowDiff <= 1 && colDiff <= 1) return true;
            break;

        case "knight":
            // Knight moves (L-shape)
            if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) return true;
            break;

        default:
            return false; 
    }
    // alert("wrong move");
    return false;
}
function isRookPathBlocked(fromRow, fromCol, toRow, toCol) {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // Ensure the move is either horizontal or vertical
    if (rowDiff !== 0 && colDiff !== 0) return true;

    const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        const currentSquare = document.querySelector(`div[data-index="${currentRow * boardSize + currentCol}"]`);
        if (currentSquare.querySelector('span')) return true; 
        currentRow += rowStep;
        currentCol += colStep;
    }

    return false; // Path is clear
}

function isBishopPathBlocked(fromRow, fromCol, toRow, toCol) {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // Ensure the move is diagonal
    if (Math.abs(rowDiff) !== Math.abs(colDiff)) return true;

    const rowStep = rowDiff / Math.abs(rowDiff);
    const colStep = colDiff / Math.abs(colDiff);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        const currentSquare = document.querySelector(`div[data-index="${currentRow * boardSize + currentCol}"]`);
        if (currentSquare.querySelector('span')) return true; // Path blocked
        currentRow += rowStep;
        currentCol += colStep;
    }

    return false; 
}


function movePiece(fromIndex, toIndex) {
    if (fromIndex === toIndex) {
        return;
    }
    const fromSquare = document.querySelector(`div[data-index="${fromIndex}"]`);
    const toSquare = document.querySelector(`div[data-index="${toIndex}"]`);
    const piece = fromSquare.querySelector('span');
    toSquare.innerHTML = '';
    toSquare.appendChild(piece);

    // Update the board array
    board[toIndex] = board[fromIndex];
    board[fromIndex] = '';
    piece.dataset.index = toIndex;
    // Clear the original square's inner HTML
    fromSquare.innerHTML = '';
}
function switchTurn() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';

    if (isInCheck(currentPlayer)) {
        if (isCheckmate(currentPlayer)) {
            alert(`${currentPlayer === 'white' ? 'Black' : 'White'} wins by checkmate!`);
        } else {
            alert(`${currentPlayer} is in check!`);
        }
    }

    startTimer();  // Restart the timer for the current player
}


function startTimer() {
    clearInterval(timerInterval);  // Clear the existing timer

    timerInterval = setInterval(() => {
        if (currentPlayer === 'white') {
            timerWhite--;
            whiteTimerElement.textContent = `${formatTime(timerWhite)}`;
            if (timerWhite === 0) {
                clearInterval(timerInterval);
                alert('White ran out of time! Black wins.');
                return;
            }
        } else {
            timerBlack--;
            blackTimerElement.textContent = `${formatTime(timerBlack)}`;
            if (timerBlack === 0) {
                clearInterval(timerInterval);
                alert('Black ran out of time! White wins.');
                return;
            }
        }
    }, 1000);  // Decrement timer every second
}

// Function to format time as mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
// checkmate logic
function isInCheck(playerColor) {
    const kingSquare = findKingPosition(playerColor);  // Get king's current position
    const opponentColor = playerColor === 'white' ? 'black' : 'white';

    for (let i = 0; i < boardSize * boardSize; i++) {
        const square = document.querySelector(`div[data-index="${i}"]`);
        const piece = square.querySelector('span');

        if (piece && piece.classList.contains(`pieces-${opponentColor}`)) {
            // Check if this piece can move to the king's square (threatening the king)
            if (isvalidmove(i, kingSquare)) {
                return true;  // King is in check
            }
        }
    }
    return false;  // King is not in check
}

// Helper function to find the king's position on the board
function findKingPosition(playerColor) {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const square = document.querySelector(`div[data-index="${i}"]`);
        const piece = square.querySelector('span');

        if (piece && piece.id === 'king' && piece.classList.contains(`pieces-${playerColor}`)) {
            return i;  // Return the index of the king
        }
    }
}

function isCheckmate(playerColor) {
    const kingSquare = findKingPosition(playerColor);

    // Try moving the king to all adjacent squares
    const possibleMoves = [
        kingSquare - boardSize - 1, kingSquare - boardSize, kingSquare - boardSize + 1,  // Upper row
        kingSquare - 1, kingSquare + 1,                        // Left and right
        kingSquare + boardSize - 1, kingSquare + boardSize, kingSquare + boardSize + 1   // Lower row
    ];

    for (const move of possibleMoves) {
        if (move >= 0 && move < boardSize * boardSize && isvalidmove(kingSquare, move)) {
            const originalBoardState = [...board];  // Save the original board state
            movePiece(kingSquare, move);  // Try to move the king
            if (!isInCheck(playerColor)) {
                // Restore the board and return false (not checkmate)
                // board = originalBoardState;
                // movePiece(move, kingSquare);
                switchTurn() //temporary
                return false;
            }
            movePiece(move, kingSquare);
            // Restore the board after checking
            board = originalBoardState;
        }
    }

    // No valid king moves, check if any piece can block or capture the threat
    for (let i = 0; i < boardSize * boardSize; i++) {
        const square = document.querySelector(`div[data-index="${i}"]`);
        const piece = square.querySelector('span');

        if (piece && piece.classList.contains(`pieces-${playerColor}`)) {
            for (let j = 0; j < boardSize * boardSize; j++) {
                if (isvalidmove(i, j)) {
                    const originalBoardState = [...board];  // Save the original board state
                    movePiece(i, j);  // Try the move
                    if (!isInCheck(playerColor)) {
                        // Restore the board and return false (not checkmate)
                        // board = originalBoardState;
                        // movePiece(j,i);
                        switchTurn() //temporary
                        return false;
                    }
                    // Restore the board after checking
                    movePiece(j, i);
                    board = originalBoardState;
                }
            }
        }
    }

    return true;  // Checkmate if no valid moves were found
}

// Initialize the timers on page load
document.addEventListener('DOMContentLoaded', () => {
    whiteTimerElement.textContent = `${formatTime(timerWhite)}`;
    blackTimerElement.textContent = `${formatTime(timerBlack)}`;
    initializeBoard();
});
