const player1 = 'X';
const player2 = 'O';
let currentPlayer = player1;
let isComputerPlayer = false;
let gameOver = false;

const cells = Array.from(document.getElementsByClassName('cell'));

// Add event listeners to the cells
cells.forEach((cell) => {
  cell.addEventListener('click', makeMove);
});

// Reset the game
function resetGame() {
  currentPlayer = player1;
  gameOver = false;
  cells.forEach((cell) => {
    cell.innerText = '';
    cell.classList.remove('highlight');
  });
  setMessage('');
}

// Toggle between playing against a computer or another player
function togglePlayer() {
  isComputerPlayer = !isComputerPlayer;
  resetGame();
}

// Make a move
function makeMove(cellIndex) {
  if (gameOver || cells[cellIndex].innerText !== '') {
    return;
  }

  cells[cellIndex].innerText = currentPlayer;
  cells[cellIndex].classList.add('highlight');

  if (checkWin(currentPlayer)) {
    gameOver = true;
    highlightWinningCells();
    setMessage(`${currentPlayer} wins!`);
    return;
  }

  if (checkDraw()) {
    gameOver = true;
    setMessage('It\'s a draw!');
    return;
  }

  currentPlayer = currentPlayer === player1 ? player2 : player1;

  if (isComputerPlayer && currentPlayer === player2) {
    makeComputerMove();
  }
}

// Make a move for the computer player using Minimax algorithm
function makeComputerMove() {
  const bestMove = getBestMove();
  makeMove(bestMove.index);
}

// Get the best move using Minimax algorithm
function getBestMove() {
  const emptyCells = cells.filter((cell) => cell.innerText === '');
  let bestMove = null;
  let bestScore = -Infinity;

  emptyCells.forEach((cell) => {
    const cellIndex = cells.indexOf(cell);
    cells[cellIndex].innerText = player2;
    const score = minimax(cells, 0, false);
    cells[cellIndex].innerText = '';

    if (score > bestScore) {
      bestScore = score;
      bestMove = { index: cellIndex, score };
    }
  });

  return bestMove;
}

// Minimax algorithm
function minimax(board, depth, isMaximizingPlayer) {
  if (checkWin(player1)) {
    return -10 + depth;
  } else if (checkWin(player2)) {
    return 10 - depth;
  } else if (checkDraw()) {
    return 0;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    board.forEach((cell, index) => {
      if (cell.innerText === '') {
        board[index].innerText = player2;
        const score = minimax(board, depth + 1, false);
        board[index].innerText = '';
        bestScore = Math.max(bestScore, score);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((cell, index) => {
      if (cell.innerText === '') {
        board[index].innerText = player1;
        const score = minimax(board, depth + 1, true);
        board[index].innerText = '';
        bestScore = Math.min(bestScore, score);
      }
    });
    return bestScore;
  }
}

// Check if a player has won
function checkWin(player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  return winningCombinations.some((combination) => {
    return combination.every((index) => cells[index].innerText === player);
  });
}

// Check if it's a draw
function checkDraw() {
  return cells.every((cell) => cell.innerText !== '');
}

// Highlight the winning cells
function highlightWinningCells() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  winningCombinations.forEach((combination) => {
    if (
      cells[combination[0]].innerText === cells[combination[1]].innerText &&
      cells[combination[0]].innerText === cells[combination[2]].innerText
    ) {
      combination.forEach((index) => {
        cells[index].classList.add('highlight');
      });
    }
  });
}

// Set the game message
function setMessage(message) {
  document.getElementById('message').innerText = message;
}
