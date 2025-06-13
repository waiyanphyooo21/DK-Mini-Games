class WhackAMole {
    constructor() {
        this.timeLeft = 30;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('whack_bestScore')) || 0;
        this.gameActive = false;
        this.moles = [];
        this.timer = null;
        this.initializeGame();
        this.addEventListeners();
    }

    initializeGame() {
        this.timeLeft = 30;
        this.score = 0;
        this.gameActive = true;
        this.moles = [];
        this.clearTimer();
        this.createHoles();
        this.startTimer();
        this.updateUI();
        this.gameOver.style.display = 'none';
    }

    createHoles() {
        const gameGrid = document.getElementById('gameGrid');
        gameGrid.innerHTML = '';
        
        for (let i = 0; i < 16; i++) {
            const hole = document.createElement('div');
            hole.className = 'hole';
            hole.dataset.index = i;
            
            const mole = document.createElement('div');
            mole.className = 'mole';
            mole.textContent = '🐭';
            
            const bomb = document.createElement('div');
            bomb.className = 'bomb';
            bomb.textContent = '💣';
            
            hole.appendChild(mole);
            hole.appendChild(bomb);
            gameGrid.appendChild(hole);
            
            this.moles.push({
                hole,
                mole,
                bomb,
                hasMole: false,
                hasBomb: false
            });
        }
    }

    addEventListeners() {
        const holes = document.querySelectorAll('.hole');
        const newGameBtn = document.getElementById('newGameBtn');
        const backBtn = document.getElementById('backBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');

        holes.forEach(hole => {
            hole.addEventListener('click', () => this.handleHoleClick(hole));
        });

        newGameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.initializeGame();
        });

        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'medium.html';
        });

        playAgainBtn.addEventListener('click', () => {
            this.initializeGame();
            this.gameOver.style.display = 'none';
        });
    }

    handleHoleClick(hole) {
        if (!this.gameActive) return;

        const index = parseInt(hole.dataset.index);
        const moleObj = this.moles[index];

        if (moleObj.hasMole) {
            this.score += 10;
            moleObj.hasMole = false;
            moleObj.mole.style.display = 'none';
        } else if (moleObj.hasBomb) {
            this.score -= 20;
            moleObj.hasBomb = false;
            moleObj.bomb.style.display = 'none';
        }

        this.updateUI();
    }

    spawnMole() {
        if (!this.gameActive) return;

        const randomIndex = Math.floor(Math.floor(Math.random() * this.moles.length));
        const moleObj = this.moles[randomIndex];

        if (!moleObj.hasMole && !moleObj.hasBomb) {
            moleObj.hasMole = true;
            moleObj.mole.style.display = 'flex';
            
            setTimeout(() => {
                moleObj.hasMole = false;
                moleObj.mole.style.display = 'none';
            }, 1000);
        }
    }

    spawnBomb() {
        if (!this.gameActive) return;

        const randomIndex = Math.floor(Math.floor(Math.random() * this.moles.length));
        const moleObj = this.moles[randomIndex];

        if (!moleObj.hasMole && !moleObj.hasBomb) {
            moleObj.hasBomb = true;
            moleObj.bomb.style.display = 'flex';
            
            setTimeout(() => {
                moleObj.hasBomb = false;
                moleObj.bomb.style.display = 'none';
            }, 1000);
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();

            if (this.timeLeft <= 0) {
                this.endGame();
            } else {
                this.spawnMole();
                if (Math.random() < 0.2) { // 20% chance to spawn a bomb
                    this.spawnBomb();
                }
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    endGame() {
        this.gameActive = false;
        this.clearTimer();
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('whack_bestScore', this.score.toString());
        }

        this.gameOver.style.display = 'block';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('bestScore').textContent = this.bestScore;
    }

    updateTimer() {
        document.getElementById('timer').textContent = this.timeLeft;
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('bestScore').textContent = this.bestScore;
    }
}

// Initialize the game when the page loads
window.onload = function() {
    new WhackAMole();
};
