class GuessTheNumber {
    constructor() {
        this.targetNumber = null;
        this.guessCount = 0;
        this.bestScore = parseInt(localStorage.getItem('guess_bestScore')) || null;
        this.guessHistory = [];
        this.gameActive = false;
        this.initializeGame();
        this.addEventListeners();
    }

    initializeGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.guessCount = 0;
        this.gameActive = true;
        
        // Update UI
        document.getElementById('guessCount').textContent = '0';
        document.getElementById('bestScore').textContent = this.bestScore || '-';
        document.getElementById('guessInput').value = '';
        document.getElementById('guessInput').disabled = false;
        document.getElementById('guessButton').disabled = false;
        document.getElementById('status').textContent = 'I\'m thinking of a number between 1 and 100...';
    }

    addEventListeners() {
        const guessButton = document.getElementById('guessButton');
        const guessInput = document.getElementById('guessInput');
        const newGameBtn = document.getElementById('newGameBtn');
        const backBtn = document.getElementById('backBtn');

        guessButton.addEventListener('click', () => this.handleGuess());
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGuess();
            }
        });

        newGameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.initializeGame();
        });

        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'easy.html';
        });
    }

    handleGuess() {
        if (!this.gameActive) return;

        const guess = parseInt(document.getElementById('guessInput').value);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            alert('Please enter a number between 1 and 100');
            return;
        }

        this.guessCount++;
        const result = this.checkGuess(guess);
        this.updateStatus(result, guess);
    }

    checkGuess(guess) {
        if (guess === this.targetNumber) {
            this.gameActive = false;
            if (!this.bestScore || this.guessCount < this.bestScore) {
                this.bestScore = this.guessCount;
                localStorage.setItem('guess_bestScore', this.bestScore);
            }
            return 'correct';
        } else if (guess > this.targetNumber) {
            return 'high';
        } else {
            return 'low';
        }
    }

    updateStatus(result, guess) {
        const guessCount = document.getElementById('guessCount');
        const guessInput = document.getElementById('guessInput');
        const guessButton = document.getElementById('guessButton');
        const status = document.getElementById('status');

        guessCount.textContent = this.guessCount;

        if (!this.gameActive) {
            status.textContent = `You got it! The number was ${this.targetNumber}. It took you ${this.guessCount} guesses.`;
            guessInput.disabled = true;
            guessButton.disabled = true;
        } else {
            status.textContent = `Your guess of ${guess} was ${result === 'high' ? 'too high' : 'too low'}. Try again!`;
        }
    }
}

// Initialize the game when the page loads
window.onload = function() {
    new GuessTheNumber();
};
