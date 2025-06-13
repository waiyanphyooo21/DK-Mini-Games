class RockPaperScissors {
    constructor() {
        this.playerWins = parseInt(localStorage.getItem('rps_playerWins')) || 0;
        this.computerWins = parseInt(localStorage.getItem('rps_computerWins')) || 0;
        this.gameActive = true;
        this.initializeGame();
        this.addEventListeners();
    }

    initializeGame() {
        this.gameActive = true;
        document.querySelector('.status').textContent = 'Choose your move!';
        document.getElementById('result').textContent = '';
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.updateScore();
    }

    addEventListeners() {
        const choiceBtns = document.querySelectorAll('.choice-btn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        const backBtn = document.getElementById('backBtn');

        choiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.gameActive) {
                    this.handleChoice(btn.dataset.choice);
                }
            });
        });

        playAgainBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.initializeGame();
        });

        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'easy.html';
        });
    }

    handleChoice(playerChoice) {
        const computerChoice = this.getComputerChoice();
        const result = this.determineWinner(playerChoice, computerChoice);
        this.updateResultDisplay(playerChoice, computerChoice, result);
        this.updateScore(result);
        this.gameActive = false;
    }

    getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * 3)];
    }

    determineWinner(player, computer) {
        if (player === computer) return 'draw';
        
        const rules = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        return rules[player] === computer ? 'win' : 'lose';
    }

    updateResultDisplay(player, computer, result) {
        const resultElement = document.getElementById('result');
        const status = document.querySelector('.status');

        status.textContent = `You chose ${player}, Computer chose ${computer}`;

        let message = '';
        if (result === 'win') {
            message = 'You Win!';
        } else if (result === 'lose') {
            message = 'Computer Wins!';
        } else {
            message = 'It\'s a Draw!';
        }

        resultElement.textContent = message;
        resultElement.className = `result ${result}`;

        // Highlight selected choice
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-choice="${player}"]`).classList.add('selected');
    }

    updateScore(result) {
        if (result === 'win') {
            this.playerWins++;
            localStorage.setItem('rps_playerWins', this.playerWins);
        } else if (result === 'lose') {
            this.computerWins++;
            localStorage.setItem('rps_computerWins', this.computerWins);
        }
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        document.getElementById('playerWins').textContent = this.playerWins;
        document.getElementById('computerWins').textContent = this.computerWins;
    }
}

// Initialize the game when the page loads
window.onload = function() {
    new RockPaperScissors();
};
