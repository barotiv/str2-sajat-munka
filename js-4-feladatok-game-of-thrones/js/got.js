const chars = document.querySelector('.characters');
const desc = document.querySelector('.description');
const form = document.querySelector('.form');
const input = document.querySelector('.input');

async function fetchData() {
    const response = await fetch('./json/got.json');
    const result = await response.json();
    const aliveChars = result.filter(char => !char.dead);
    aliveChars.sort((char1, char2) => char1.name.localeCompare(char2.name));
    createCards(aliveChars);
}

fetchData()

function createCards(characters) {
    characters.forEach(char => {
        const cards = document.createElement('div');
        cards.classList.add('card');
        cards.innerHTML =
            `<div class="card-image">
                <img src="${char.portrait}" alt="missing">
            </div>
            <div class="card-description">${char.name}</div>`
        chars.appendChild(cards);

        cards.addEventListener('click', () => {
            createDescription(char);
        })
    });
}

function createDescription(char) {
    if (char) {
        desc.innerHTML =
            `<div class="description-img">
                ${(char.picture) ? `<img src="${char.picture}" alt="missing">` : `<img src="./assets/pictures/missing.jpg">`}
            </div>
            <div>
            <span class="description-name">${char.name}</span>
                ${(char.house || char.organization) ? 
                `<img src="./assets/houses/${char.house ? char.house : char.organization}.png" alt="missing">` :
                `<img src="./assets/pictures/missing2.jpg">`}
            </div>
            <div class="description-details">${char.bio}</div>`
    } else {
        desc.innerHTML = `<h3>Character not found</h3>`
    }
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchForName = input.value;
    fetch('./json/got.json')
        .then(response => response.json())
        .then(names => {
            const getName = names.filter(char => char.name.toLocaleUpperCase() === searchForName.toLocaleUpperCase());
            const getNameAlive = getName.filter(char => !char.dead);
            createDescription(getNameAlive[0]);
        });
});