class WhackAMole {
    constructor() {
        this.timeLeft = 30;
        this.score = 0;
        this.gameActive = false;
        this.moles = [];
        this.timer = null;
        this.gameOver = document.getElementById('gameOver');
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
            mole.style.display = 'none';
            
            const bomb = document.createElement('div');
            bomb.className = 'bomb';
            bomb.textContent = '💣';
            bomb.style.display = 'none';
            
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

        // Find all holes that don't have anything
        const availableHoles = this.moles.filter(moleObj => !moleObj.hasMole && !moleObj.hasBomb);
        
        if (availableHoles.length === 0) return; // No holes available

        // Only spawn one mole at a time
        const randomIndex = Math.floor(Math.random() * availableHoles.length);
        const moleObj = availableHoles[randomIndex];
        
        moleObj.hasMole = true;
        moleObj.mole.style.display = 'flex';
        
        setTimeout(() => {
            moleObj.mole.style.display = 'none';
            moleObj.hasMole = false;
        }, 1000);
    }

    spawnBomb() {
        if (!this.gameActive) return;

        // Find all holes that don't have anything
        const availableHoles = this.moles.filter(moleObj => !moleObj.hasMole && !moleObj.hasBomb);
        
        if (availableHoles.length === 0) return; // No holes available

        // Only spawn one bomb at a time
        const randomIndex = Math.floor(Math.random() * availableHoles.length);
        const moleObj = availableHoles[randomIndex];

        moleObj.hasBomb = true;
        moleObj.bomb.style.display = 'flex';
        
        setTimeout(() => {
            moleObj.bomb.style.display = 'none';
            moleObj.hasBomb = false;
        }, 1000);
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

    startCountdown() {
        let countdown = 5;
        
        this.countdownTimer = setInterval(() => {
            this.countdownElement.textContent = `Game starts in ${countdown}...`;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(this.countdownTimer);
                this.countdownElement.style.display = 'none';
                this.gameActive = true;
                this.startTimer();
                this.statusElement.textContent = 'Click the moles! Avoid the bombs!';
            }
        }, 1000);
    }

    clearCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
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

    updateTimer() {
        this.timerElement.textContent = this.timeLeft;
    }

    updateUI() {
        this.scoreElement.textContent = this.score;
        this.bestScoreElement.textContent = this.bestScore;
    }

    spawnMole() {
        if (!this.gameActive) return;

        // Find all holes that don't have anything
        const availableHoles = this.moles.filter(moleObj => !moleObj.hasMole && !moleObj.hasBomb);
        
        if (availableHoles.length === 0) return; // No holes available

        // Only spawn one mole at a time
        const randomIndex = Math.floor(Math.random() * availableHoles.length);
        const moleObj = availableHoles[randomIndex];
        
        moleObj.hasMole = true;
        moleObj.mole.classList.add('appear');
        moleObj.mole.style.display = 'flex';
        
        requestAnimationFrame(() => {
            setTimeout(() => {
                moleObj.mole.classList.remove('appear');
                moleObj.mole.classList.add('disappear');
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        moleObj.hasMole = false;
                        moleObj.mole.classList.remove('disappear');
                        moleObj.mole.style.display = 'none';
                    }, 300); 
                });
            }, 1000);
        });
    }

    spawnBomb() {
        if (!this.gameActive) return;

        // Find all holes that don't have anything
        const availableHoles = this.moles.filter(moleObj => !moleObj.hasMole && !moleObj.hasBomb);
        
        if (availableHoles.length === 0) return; // No holes available

        // Only spawn one bomb at a time
        const randomIndex = Math.floor(Math.random() * availableHoles.length);
        const moleObj = availableHoles[randomIndex];

        moleObj.hasBomb = true;
        moleObj.bomb.classList.add('appear');
        moleObj.bomb.style.display = 'flex';
        
        requestAnimationFrame(() => {
            setTimeout(() => {
                moleObj.bomb.classList.remove('appear');
                moleObj.bomb.classList.add('disappear');
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        moleObj.hasBomb = false;
                        moleObj.bomb.classList.remove('disappear');
                        moleObj.bomb.style.display = 'none';
                    }, 300); 
                });
            }, 1000);
        });
    }

    endGame() {
        this.gameActive = false;
        this.clearTimer();
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('whack_bestScore', this.score);
        }
        
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';
        this.statusElement.textContent = 'Game Over!';
    }

    addEventListeners() {
        const newGameBtn = document.getElementById('newGameBtn');
        const backBtn = document.getElementById('backBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');

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
            this.gameOverElement.style.display = 'none';
        });

        // Add click handlers to holes after they're created
        this.gameGrid.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const hole = e.target.closest('.hole');
            if (hole) {
                this.handleHoleClick(hole);
            }
        });
    }

    onload() {
        new WhackAMole();
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
