class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.playerXWins = parseInt(localStorage.getItem('tictactoe_playerXWins')) || 0;
        this.playerOWins = parseInt(localStorage.getItem('tictactoe_playerOWins')) || 0;
        this.initializeGame();
        this.addEventListeners();
    }

    initializeGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateBoard();
        this.updateStatus();
        this.updateScore();
    }

    addEventListeners() {
        const board = document.getElementById('board');
        const restartBtn = document.getElementById('restartBtn');
        const backBtn = document.getElementById('backBtn');

        // Cell click handler
        board.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && !cell.textContent && this.gameActive) {
                const index = Array.from(board.children).indexOf(cell);
                this.makeMove(index);
            }
        });

        // Restart button
        restartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.initializeGame();
        });

        // Back button
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'easy.html';
        });
    }

    makeMove(index) {
        if (this.board[index] || !this.gameActive) return;

        this.board[index] = this.currentPlayer;
        this.updateBoard();

        if (this.checkWinner()) {
            this.gameActive = false;
            this.updateScore(this.currentPlayer);
            this.updateStatus(`Player ${this.currentPlayer} wins!`);
            return;
        }

        if (this.isBoardFull()) {
            this.gameActive = false;
            this.updateStatus("It's a Draw!");
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    updateBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';
        this.board.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = value || '';
            if (value) {
                cell.classList.add(value.toLowerCase());
            }
            board.appendChild(cell);
        });
    }

    checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    isBoardFull() {
        return this.board.every(cell => cell !== null);
    }

    updateStatus(message = `Player ${this.currentPlayer}'s turn`) {
        document.querySelector('.status').textContent = message;
    }

    updateScore(winner) {
        if (winner === 'X') {
            this.playerXWins++;
            localStorage.setItem('tictactoe_playerXWins', this.playerXWins);
        } else if (winner === 'O') {
            this.playerOWins++;
            localStorage.setItem('tictactoe_playerOWins', this.playerOWins);
        }
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        document.getElementById('playerXWins').textContent = this.playerXWins;
        document.getElementById('playerOWins').textContent = this.playerOWins;
    }
}

// Initialize the game when the page loads
window.onload = function() {
    new TicTacToe();
};