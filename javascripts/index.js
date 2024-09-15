// Create a chess board and set up pieces
const boardElement = document.getElementById('game-board');
const boardSize = 8;
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
let selectedPiece = null;

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
            const piece = document.createElement('span');
            piece.innerHTML = board[i];
            piece.draggable = true;
            if (i > 47) {
                piece.classList.add("pices-white");
            }
            piece.dataset.index = i;
            piece.addEventListener('dragstart', handleDragStart);
            square.appendChild(piece);
        }

        square.addEventListener('dragover', handleDragOver);
        square.addEventListener('drop', handleDrop);

        boardElement.appendChild(square);
    }
}

function handleDragStart(event) {
    
    const pieceIndex = event.target.dataset.index;
    event.dataTransfer.setData('text/plain', pieceIndex);
}

function handleDragOver(event) {
    event.preventDefault();  // Allow the drop event
}

function handleDrop(event) {
    event.preventDefault();
    const fromIndex = event.dataTransfer.getData('text');
    const toIndex = event.target.dataset.index;
    
    movePiece(fromIndex, toIndex);
}

function movePiece(fromIndex, toIndex) {
    
    const fromSquare = document.querySelector(`div[data-index="${fromIndex}"]`);
    const toSquare = document.querySelector(`div[data-index="${toIndex}"]`);
    
    const piece = fromSquare.querySelector('span');
    if (!piece) return; // No piece to move

    // Move the piece in the DOM
    toSquare.innerHTML = '';
    toSquare.appendChild(piece);

    // Update the board array
    board[toIndex] = board[fromIndex];
    board[fromIndex] = '';

    // Clear the original square's inner HTML
    fromSquare.innerHTML = '';
}

// Initialize the chessboard when the page loads
document.addEventListener('DOMContentLoaded', initializeBoard);
