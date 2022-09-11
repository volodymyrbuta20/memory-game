
let newGameButton = document.querySelector("#newGameBtn");
let score = document.querySelector("#atemptNumOutput");
let board = document.querySelector("#board");
let overlay = document.querySelector("#overlay");
let endGameModal = document.querySelector("#endGameModal")
let result = document.querySelector("#result");
let time = document.querySelector("#time");
let sec = 0;
let min = 0;
let timerID;

// Create new Card and choose image depends of flipping
class Card {

    isFlipped = false;

    constructor (image) {

        this.image = image;
        this.element = document.createElement("div");
        this.element.classList.add("card");
        this.element.style.backgroundImage = `url('images/card-cover.png')`;
        this.element.card = this;

    }

    get imagePath () {
        return `images/${this.image}`;
    }

    set imagePath (imagePath) {
        this.image = this.image;
    }

    flip () {
        if (!this.isFlipped) {
            this.element.style.backgroundImage = `url('${this.imagePath}')`;
        } else {
            this.element.style.backgroundImage = `url('images/card-cover.png')`;
        }
        
        this.isFlipped = !this.isFlipped;
    }

}

// Creating deck of cards with the massive
class Deck {
    cardsImages = ["apple.png", "cake.png", "car.png", "cat.png", "cherry.png", "factory.png",
        "house.png", "plane.png", "ship.png", "train.png"];
    
    constructor () {
        this.cards = [];
        this.cardsImages.forEach (image => {
            this.cards.push(new Card (image));
            this.cards.push(new Card (image));
        });
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    removeCard (card) {
        let index = this.cards.findIndex(item => {
            item.imagePath = card.imagePath;
        });

        if (index != -1) {
            this.cards.splice(index, 1);
            card = null;
        }
    }
}

// Control of game. Here we making new deck with random shuffled cards and compare two flipped cards by the route and name of it
class GameManager {
    firstCard  = null;
    secondCard = null;
    attemptNumber = 1;

    constructor (board, score) {
        this.board = board;
        this.score = score;
    }

    startGame () {
        this.score.innerHTML = 0;
        this.attemptNumber = 1;
        this.deck = new Deck();
        this.board.innerHTML = "";
        this.deck.shuffle();
        this.deck.cards.forEach(card => {
            this.board.append(card.element);
        });
    }

    startTimer () {
        timerID = setInterval(this.tick, 1000)
    }

    tick () {
        sec++;
        if (sec >= 60) {
            sec = 0;
            min++;
        }

        document.querySelector("#sec").textContent = (sec > 9 ? sec : "0" + sec);
        document.querySelector("#min").textContent = (min > 9 ? min : "0" + min);
    }

    stopTimer () {
        clearInterval(timerID);
    }

    resetTimer() {
        min = 0;
        sec = 0;
    }

    addModal () {
        overlay.style.display = 'block';
        endGameModal.style.display = "block";
        document.querySelector("#result").textContent = `Your attempts - ${this.attemptNumber - 1}`;
        document.querySelector("#time").textContent = `Your time - ${min}:${sec}`;
    }

    selectCard (card) {
        if (card === this.firstCard) return;
        card.flip();

        if (this.firstCard && this.secondCard) {
            this.firstCard.flip();
            this.secondCard.flip();

            this.firstCard = this.secondCard = null;
        }

        if (this.firstCard == null) {
            this.firstCard = card;
        }
        else if (this.secondCard == null) {
            this.score.innerHTML = this.attemptNumber++;
            this.secondCard = card;


            if (this.firstCard.imagePath === card.imagePath) { //if route to clicked cards is the same
                this.deck.removeCard(this.firstCard);//removing cards from massive but leaving it in DOM
                this.deck.removeCard(this.secondCard);

                this.firstCard = this.secondCard = null;

                let flipped = this.deck.cards.filter(item => item.isFlipped == false)
                if (flipped.length < 1) {
                    this.stopTimer();
                    this.addModal();
                }

                this.firstCard = this.secondCard = null;
            }
        }
    }
}

let gm = new GameManager(board, score);
gm.startGame();

board.addEventListener("click", function (e) {
    let clickedCard = e.target.card;
    if (clickedCard) {
        gm.selectCard(clickedCard);
    }
});

newGameButton.addEventListener("click", function () {
    gm.startGame();
    gm.stopTimer();
    gm.resetTimer();
    gm.startTimer();
});

overlay.addEventListener("click", function(e) {
    if (e.target.classList.contains("tryBtn")) {
        overlay.style.display = "none";
        gm.startGame();
        gm.resetTimer();
        gm.startTimer();
    } else if (e.target.classList.contains("startBtn")) {
        overlay.style.display = "none";
        document.querySelector("#startGameModal").style.display = "none";
        gm.startGame();
        gm.startTimer();
    }
});

overlay.addEventListener("click", function(e) {
    if (e.target.classList.contains("tryBtn")) {
        overlay.style.display = "none";
        gm.startGame();
    }
});

