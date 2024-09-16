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
            square.innerHTML=board[i];
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
    if (isvalidmove(fromIndex, toIndex))
    {
        movePiece(fromIndex, toIndex);
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
                // White pawns move up (row decreases)
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
    alert("wrong move");
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
    // const targetpiece = toSquare.querySelector('span');
    // if (targetpiece) {
    //     const color1 = piece.classList.contains("pieces-white") ? 1 : 0;
    //     const color2 = targetpiece.classList.contains("pieces-white") ? 1 : 0;
    //     if (color1 == color2) return;
    // }
    if (!piece) {
        return;
    } // No piece to move
    
    // Move the piece in the DOM
    toSquare.innerHTML = '';
    toSquare.appendChild(piece);

    // Update the board array
    board[toIndex] = board[fromIndex];
    board[fromIndex] = '';
    piece.dataset.index = toIndex;
    // Clear the original square's inner HTML
    fromSquare.innerHTML = '';
}

// Initialize the chessboard when the page loads
document.addEventListener('DOMContentLoaded', initializeBoard);
