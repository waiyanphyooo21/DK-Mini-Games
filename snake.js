class SnakeGame {
    constructor() {
        this.gridSize = 20;
        this.cellSize = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.food = null;
        this.direction = 'right';
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('snake_bestScore')) || 0;
        this.gameActive = false;
        this.gameLoop = null;
        this.gameGrid = document.getElementById('gameGrid');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('bestScore');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameOver = document.getElementById('gameOver');
        this.statusElement = document.querySelector('.status');
        this.initializeGame();
        this.addEventListeners();
    }

    initializeGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.food = null;
        this.direction = 'right';
        this.score = 0;
        this.gameActive = true;
        this.clearGameLoop();
        this.createGrid();
        this.spawnFood();
        this.updateUI();
        this.gameOver.style.display = 'none';
        this.statusElement.textContent = 'Use arrow keys to move!';
    }

    createGrid() {
        this.gameGrid.innerHTML = '';
        this.cells = [];

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = `${this.cellSize}px`;
                cell.style.height = `${this.cellSize}px`;
                this.gameGrid.appendChild(cell);
                this.cells.push(cell);
            }
        }
    }

    addEventListeners() {
        const newGameBtn = document.getElementById('newGameBtn');
        const backBtn = document.getElementById('backBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        newGameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.initializeGame();
        });

        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'hard.html';
        });

        playAgainBtn.addEventListener('click', () => {
            this.initializeGame();
            this.gameOver.style.display = 'none';
        });
    }

    handleKeyPress(e) {
        if (!this.gameActive) return;

        switch (e.key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }

        if (!this.gameLoop) {
            this.gameLoop = setInterval(() => this.updateGame(), 200);
        }
    }

    updateGame() {
        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }

        // Check for wall collision
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            this.endGame();
            return;
        }

        // Check for self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check if we ate food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.updateUI();
    }

    spawnFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

        this.food = newFood;
    }

    updateUI() {
        this.cells.forEach(cell => {
            cell.className = 'cell';
        });

        this.snake.forEach(segment => {
            const cellIndex = segment.y * this.gridSize + segment.x;
            this.cells[cellIndex].classList.add('snake');
        });

        if (this.food) {
            const foodIndex = this.food.y * this.gridSize + this.food.x;
            this.cells[foodIndex].classList.add('food');
        }

        this.scoreElement.textContent = this.score;
        this.bestScoreElement.textContent = this.bestScore;
    }

    endGame() {
        this.gameActive = false;
        this.clearGameLoop();
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('snake_bestScore', this.score);
        }
        
        this.finalScoreElement.textContent = this.score;
        this.gameOver.style.display = 'block';
        this.statusElement.textContent = 'Game Over!';
    }

    clearGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
}

// Initialize the game when the page loads
window.onload = function() {
    new SnakeGame();
};
