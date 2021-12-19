const cards = document.querySelectorAll('.cards');

let flipped = false;
let firstCard;
let secondCard;
let lock = false;
let matches = 0;
let counts = 0;
let timerOn = false;
let currentTime = 0;

function shuffle() {
    cards.forEach(card => {
        let random = Math.floor(Math.random() * 10);
        card.style.order = random;
        card.addEventListener('click', flipCard)
    });
};

shuffle();

function counter() {
    timerOn = true;
};

setInterval(() => {
    if (!timerOn) {
        return;
    }
    currentTime++;
    timer();
}, 1000);

function timer() {
    let minutes = Math.floor(currentTime / 60);
    let seconds = currentTime % 60;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    document.querySelector('.timer').textContent =
        `${minutes}:${seconds}`;
}

function flipCard() {
    if (lock) return;
    if (this === firstCard) return;

    const reset = () => {
        flipped = false;
        lock = false;
        firstCard = null;
        secondCard = null;
    }

    this.classList.add('flip');

    if (!flipped) {
        flipped = true;
        firstCard = this;
    } else {
        flipped = false;
        secondCard = this;

        if (firstCard.dataset.image === secondCard.dataset.image) {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            reset();
            matches += 1;
            console.log(matches);
        } else {
            lock = true;
            setTimeout(() => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
                reset();
            }, 1500);
        }
    }

    if (matches === 5) {
        setTimeout(() => {
            cards.forEach(card => card.classList.remove('flip'));
            cards.forEach(card => card.addEventListener('click', flipCard));
            shuffle();
            matches = 0;
            counts = 0;
            timerOn = false;
            currentTime = 0;
        }, 5000);
    }
}

cards.forEach(card => card.addEventListener('click', flipCard));
cards.forEach(card => card.addEventListener('click', counter));