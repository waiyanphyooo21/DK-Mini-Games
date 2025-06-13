class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.timer = null;
        this.timeElapsed = 0;
        this.bestTime = localStorage.getItem('memory_bestTime');
        this.initializeGame();
        this.addEventListeners();
    }

    initializeGame() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.timeElapsed = 0;
        this.clearTimer();
        this.createCards();
        this.shuffleCards();
        this.renderGame();
        this.startTimer();
        this.updateUI();
    }

    createCards() {
        const symbols = ['😀', '😂', '🥰', '😎', '🤩', '🥳', '🚀', '🌟'];
        symbols.forEach(symbol => {
            this.cards.push({ symbol, matched: false });
            this.cards.push({ symbol, matched: false });
        });
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderGame() {
        const gameGrid = document.getElementById('gameGrid');
        gameGrid.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.textContent = card.symbol;
            
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);
            gameGrid.appendChild(cardElement);
        });
    }

    addEventListeners() {
        const cards = document.querySelectorAll('.card');
        const newGameBtn = document.getElementById('newGameBtn');
        const backBtn = document.getElementById('backBtn');

        cards.forEach(card => {
            card.addEventListener('click', () => this.handleCardClick(card));
        });

        newGameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.initializeGame();
        });

        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'medium.html';
        });
    }

    handleCardClick(card) {
        if (this.flippedCards.length === 2 || card.classList.contains('flipped')) return;

        this.moves++;
        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }

        this.updateUI();
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const index1 = parseInt(card1.dataset.index);
        const index2 = parseInt(card2.dataset.index);

        if (this.cards[index1].symbol === this.cards[index2].symbol) {
            this.cards[index1].matched = true;
            this.cards[index2].matched = true;
            this.flippedCards = [];
            this.checkWin();
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
            }, 1000);
        }
    }

    checkWin() {
        if (this.cards.every(card => card.matched)) {
            this.stopTimer();
            const minutes = Math.floor(this.timeElapsed / 60);
            const seconds = this.timeElapsed % 60;
            const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (!this.bestTime || this.timeElapsed < parseInt(this.bestTime)) {
                localStorage.setItem('memory_bestTime', this.timeElapsed.toString());
                alert(`Congratulations! You won in ${formattedTime}! New best time!`);
            } else {
                alert(`Congratulations! You won in ${formattedTime}!`);
            }
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateTimer();
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    stopTimer() {
        this.clearTimer();
    }

    updateTimer() {
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateUI() {
        document.getElementById('moves').textContent = this.moves;
        const status = document.querySelector('.status');
        status.textContent = this.flippedCards.length === 2 ? 'Checking match...' : 'Start matching cards!';
    }
}

// Initialize the game when the page loads
window.onload = function() {
    new MemoryGame();
};
