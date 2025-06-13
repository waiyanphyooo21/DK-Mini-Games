class SnakeGame {
    constructor() {
        this.gridSize = 20;
        this.cellSize = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.food = null;
        this.direction = null;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('snake_bestScore')) || 0;
        this.gameActive = false;
        this.gameLoop = null;
        this.initializeGame();
        this.addEventListeners();
    }

    initializeGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.food = null;
        this.direction = null;
        this.score = 0;
        this.gameActive = true;
        this.clearGameLoop();
        this.createGrid();
        this.spawnFood();
        this.updateUI();
        this.gameOver.style.display = 'none';
    }

    createGrid() {
        const gameGrid = document.getElementById('gameGrid');
        gameGrid.innerHTML = '';

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = `${this.cellSize}px`;
                cell.style.height = `${this.cellSize}px`;
                gameGrid.appendChild(cell);
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
            this.gameLoop = setInterval(() => this.updateGame(), 100);
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

        if (this.checkCollision(head)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        if (this.checkFood()) {
            this.score += 10;
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.updateUI();
    }

    checkCollision(head) {
        return (
            head.x < 0 ||
            head.x >= this.gridSize ||
            head.y < 0 ||
            head.y >= this.gridSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    checkFood() {
        return this.snake[0].x === this.food.x && this.snake[0].y === this.food.y;
    }

    spawnFood() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.gridSize);
            y = Math.floor(Math.random() * this.gridSize);
        } while (this.snake.some(segment => segment.x === x && segment.y === y));

        this.food = { x, y };
    }

    updateUI() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.className = 'cell';
        });

        this.snake.forEach(segment => {
            const cell = cells[segment.y * this.gridSize + segment.x];
            cell.className = 'cell snake';
        });

        if (this.food) {
            const cell = cells[this.food.y * this.gridSize + this.food.x];
            cell.className = 'cell food';
        }

        document.getElementById('score').textContent = this.score;
        document.getElementById('bestScore').textContent = this.bestScore;
        
        if (this.gameActive) {
            document.querySelector('.status').textContent = 'Use arrow keys to move!';
        }
    }

    endGame() {
        this.gameActive = false;
        this.clearGameLoop();

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('snake_bestScore', this.score.toString());
        }

        this.gameOver.style.display = 'block';
        document.getElementById('finalScore').textContent = this.score;
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
