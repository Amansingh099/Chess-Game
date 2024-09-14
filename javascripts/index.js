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
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];
let selectedPiece = null;

function initializeBoard() {
    board = [];
    for (let row = 0; row < boardSize; row++) {
        const boardRow = [];
        for (let col = 0; col < boardSize; col++) {
            const square = document.createElement('div');
            square.classList.add('square', (row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            // Add pieces (simplified, just pawns for now)
            if (row === 1) square.textContent = '♟';  // Black Pawn
            if (row === 6) square.textContent = '♙';  // White Pawn

            square.addEventListener('click', onSquareClick);
            boardRow.push(square);
            boardElement.appendChild(square);
        }
        board.push(boardRow);
    }
}

// Handle piece selection and movement
function onSquareClick(event) {
    const square = event.target;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = square.textContent;

    // If no piece is selected, select the clicked piece
    if (selectedPiece === null && piece) {
        selectedPiece = { row, col, piece };
        square.classList.add('selected');
    } else if (selectedPiece) {
        // Move selected piece to the new square
        movePiece(selectedPiece.row, selectedPiece.col, row, col);
        selectedPiece = null;
        clearSelection();
    }
}

// Move the selected piece to the target square
function movePiece(fromRow, fromCol, toRow, toCol) {
    const fromSquare = board[fromRow][fromCol];
    const toSquare = board[toRow][toCol];

    // Move the piece
    toSquare.textContent = fromSquare.textContent;
    fromSquare.textContent = '';
}

// Clear selected piece highlighting
function clearSelection() {
    document.querySelectorAll('.selected').forEach(square => {
        square.classList.remove('selected');
    });
}

// Initialize the chessboard when the page loads
document.addEventListener('DOMContentLoaded', initializeBoard);
