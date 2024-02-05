document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const turnElement = document.getElementById('turn');
    const statusElement = document.getElementById('status');
    const playerXScoreElement = document.getElementById('playerXScore');
    const playerOScoreElement = document.getElementById('playerOScore');
    const modalElement = document.getElementById('modal');
    const modalMessageElement = document.getElementById('modal-message');
    const playAgainButton = document.getElementById('play-again');

    let board = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',];
    let currentPlayer = 'X';
    let gameActive = true;
    let playerMode = modeSelector;
    let playerXScore = 0;
    let playerOScore = 0;

    let winPatterns;

    winPatterns = [
        // VERTICAL
        [0, 6, 12, 18, 24],
        [1, 7, 13, 19, 25],
        [2, 8, 14, 20, 26],
        [3, 9, 15, 21, 27],
        [4, 10, 16, 22, 28],
        [5, 11, 17, 23, 29],

        // HORIZONTAL
        [0, 1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17],
        [18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29],

        // LEFT TO RIGHT DIAGONAL (TOP)
        [0, 7, 14, 21, 28],
        [1, 8, 15, 22, 29],
        [2, 9, 16, 23],
        [3, 10, 17],
        [4, 11],
        [6, 13, 20, 27],
        [12, 19, 26],
        [18, 25],

        // RIGHT TO LEFT DIAGONAL (TOP)
        [4, 9, 14, 19, 24],
        [5, 10, 15, 20, 25],
        [11, 16, 21, 26],
        [17, 22, 27],
        [23, 28],
        [3, 8, 13, 18],
        [2, 7, 12],
        [1, 6]
    ];

    const renderBoard = () => {
        boardElement.innerHTML = '';
        board.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            // cell.textContent = index;
            if (value === 'X' || value === 'O') {
                cell.textContent = value;
            }
            cell.addEventListener('click', () => handleCellClick(index));
            boardElement.appendChild(cell);
        });
        updateBoardColors();
    };


    const handleCellClick = (index) => {
        console.log('Clicked cell index:', index);
        console.log('Board state after click:', board);
        console.log('Current player:', currentPlayer);

        if (gameActive && board[index] === '') {
            board[index] = currentPlayer;
            renderBoard();

            if (checkWinner()) {
                endGame(`${currentPlayer} Wins!`);
            } else if (board.every(cell => cell !== '')) {
                endGame('Draw!');
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurn();
                if (playerMode !== 'pvp' && currentPlayer === 'O') {
                    makeAIMove();
                }
            }
        }
    };

    const updateTurn = () => {
        turnElement.textContent = `Turn: Player ${currentPlayer}`;
    };

    const checkWinner = () => {
        for (const pattern of winPatterns) {
            const [a, b, c, d, e, f] = pattern;
            console.log('Checking pattern:', pattern);
            console.log('Cells:', board[a], board[b], board[c], board[d], board[e], board[f]);

            // if (playerMode === 'pvc') {
            //     if (pattern.length === 6) {
            //         if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d] && board[a] === board[e] && board[a] === board[f]) {
            //             highlightWinningCells(pattern);
            //             return board[a];
            //         }
            //     } else if (pattern.length === 5) {
            //         if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d] && board[a] === board[e]) {
            //             highlightWinningCells(pattern);
            //             return board[a];
            //         }
            //     }
            // }

            if (pattern.length === 6) {
                if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d] && board[a] === board[e] && board[a] === board[f]) {
                    highlightWinningCells(pattern);
                    return board[a];
                }
            } else if (pattern.length === 5) {
                if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d] && board[a] === board[e]) {
                    highlightWinningCells(pattern);
                    return board[a];
                }
            } else if (pattern.length === 4) {
                if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
                    highlightWinningCells(pattern);
                    return board[a];
                }
            } else if (pattern.length === 3) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    highlightWinningCells(pattern);
                    return board[a];
                }
            } else if (pattern.length === 2) {
                if (board[a] && board[a] === board[b]) {
                    highlightWinningCells(pattern);
                    return board[a];
                }
            }
        }
        return null;
    };

    const highlightWinningCells = (pattern) => {
        pattern.forEach((index) => {
            const cellElement = boardElement.children[index];
            cellElement.classList.add('winner');
        });
    };

    const endGame = (message) => {
        console.log('Game ended with message:', message);
        console.log('Player X score:', playerXScore);
        console.log('Player O score:', playerOScore);

        gameActive = false;
        statusElement.textContent = message;

        if (message.includes('Wins')) {
            currentPlayer === 'X' ? playerXScore++ : playerOScore++;
            if (playerXScore === 5) {
                showModal('Player X won the game');
                document.getElementById('play-again1').style.display = 'inline';
                playerXScore = 0;
                playerOScore = 0;
                resetGame();
                updateScore();
            }
            else if (playerOScore === 5) {
                showModal('Player O won the game');
                playerXScore = 0;
                playerOScore = 0;
                resetGame();
                updateScore();
            }
            else {
                updateScore();
                showModal(message);
            }
        } else {
            updateScore();
            showModal(message);
        }


    };

    const updateScore = () => {
        playerXScoreElement.textContent = `Player X: ${playerXScore}`;
        playerOScoreElement.textContent = `Player O: ${playerOScore}`;
    };

    const showModal = (message) => {
        modalMessageElement.textContent = message;
        modalElement.style.display = 'flex';
    };

    const hideModal = () => {
        modalElement.style.display = 'none';
    };

    const makeAIMove = () => {
        let bestMove;
        if (playerMode === 'pvc') {
            bestMove = getBlockingMove();
        } else {
            bestMove = getRandomMove();
        }
        handleCellClick(bestMove);
    };

    const getBlockingMove = () => {
        for (const pattern of winPatterns) {
            const [a, b, c, d, e] = pattern;
            const playerCells = [board[a], board[b], board[c], board[d], board[e]];
            const emptyIndex = playerCells.findIndex(cell => cell === '');

            if (emptyIndex !== -1 && playerCells.filter(cell => cell === 'X').length === 2) {
                return pattern[emptyIndex];
            }
        }

        return getRandomMove();
    };

    const getRandomMove = () => {
        const emptyCells = board.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    };

    const getBestMove = () => {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 29; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    };

    const minimax = (board, depth, isMaximizing) => {
        const scores = {
            X: -1,
            O: 1,
            tie: 0
        };

        const winner = checkWinner();
        if (winner !== null) {
            return scores[winner] / depth;
        }

        if (isTerminal()) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 29; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 29; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const updateBoardColors = () => {
        for (let i = 0; i < 29; i++) {
            const cellElement = boardElement.children[i];
            cellElement.classList.remove('winner');
        }
    };

    const isTerminal = () => {
        return checkWinner() !== null || board.every(cell => cell !== '');
    };

    playAgainButton.addEventListener('click', () => {
        hideModal();
        resetGame();
    });

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',];

        currentPlayer = 'X';
        gameActive = true;
        statusElement.textContent = '';
        renderBoard();

        if (currentPlayer === 'O') {
            makeAIMove();
        }
    };

    resetGame();
});

document.addEventListener("DOMContentLoaded", function () {
    const chatBubble = document.querySelector('.chat-bubble');
    const spinner = document.querySelector('.spinner');
    const container = document.querySelector('.container1');

    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        container.style.display = 'flex';
        container.classList.add('fade-in');
        chatBubble.style.display = 'flex';
        document.body.style.backgroundColor = 'lightpink';
    }, 2000);

    chatBubble.addEventListener('click', function () {
        Swal.fire({
            title: 'Forfeit Match?',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No',
            showCloseButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'tictactoe-menu.html';
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    });
});

const gameMode = localStorage.getItem('gameMode');
const difficulty = localStorage.getItem('difficulty');
if (gameMode) {
    document.title = `DREAMY DUEL | ${gameMode.toUpperCase()}`;

    if (difficulty) {
        document.title += ` | ${difficulty.toUpperCase()}`;
    }
}

let modeSelector;

if (gameMode) {
    document.title = `DREAMY DUEL | ${gameMode.toUpperCase()}`;

    if (difficulty) {
        document.title += ` | ${difficulty.toUpperCase()}`;
    }
}
gamemodelabel.textContent = `${gameMode.toUpperCase()}`;
if (difficulty) {
    gamemodelabel.textContent += ` |  ${difficulty.toUpperCase()}`;
}

if (gameMode.toLowerCase() === 'player vs player') {
    modeSelector = 'pvp';
} else if (gameMode.toLowerCase() === 'player vs ai' && difficulty.toLowerCase() === 'easy') {
    modeSelector = 'pva';
} else if (gameMode.toLowerCase() === 'player vs ai' && difficulty.toLowerCase() === 'normal') {
    modeSelector = 'pvb';
} else if (gameMode.toLowerCase() === 'player vs ai' && difficulty.toLowerCase() === 'hard') {
    modeSelector = 'pvc';
}