const gameBoard = document.querySelector('#board');
const startButton = document.querySelector('#start');
const scoreOne = document.querySelector('#scoreOne');
const scoreTwo = document.querySelector('#scoreTwo');
const result = document.querySelector('#result');

let board = [];
let choosenCards = [];
let foundCards = [];
let isRunning = false;
let gameTime = 0;
let sec = 0;
const characters = [
  {
    value: 'A',
    piece: 0
  },
  {
    value: 'B',
    piece: 0
  },
  {
    value: 'C',
    piece: 0
  },
  {
    value: 'D',
    piece: 0
  },
  {
    value: 'E',
    piece: 0
  },
  {
    value: 'F',
    piece: 0
  },
  {
    value: 'G',
    piece: 0
  },
  {
    value: 'H',
    piece: 0
  }
];

startButton.addEventListener('click', () => {
  isRunning = true;
  setInterval(timer, 1000)
  console.log('Start game');
  generateTable(4,4);
  console.log(board);
  console.log('Drawing board');
  drawBoard();
});

/**
 * Egyszeru timer
 */
function timer() {
  if(isRunning) {
    sec++;
    console.log(sec);
  }

}/**
 * Az allapot visszaallitasa. 
 */
function cleareState() {
  board = [];
  foundCards = [];
  gameTime = 0;
  sec = 0
  scoreOne.innerHTML = foundCards.length;
  scoreTwo.innerHTML = 8;
  result.innerHTML = '';
  isRunning = false;
  removeDivFromDisplay();
  for (let i = 0; i < characters.length; i++) {
    characters[i].piece = 0
  }
}

/**
 * A div-ek letorlese a kepernyorol
 */
function removeDivFromDisplay() {
  const child = gameBoard.childNodes;
  for (let i = 0; i <= child.length; i++) {
    if(i === child.length) {
      for (let j = child.length-1; j >= 0 ; j--) {
        gameBoard.removeChild(child[j]) 
      }
    }
    if(i < child.length / 2) {
      gameBoard.removeChild(child[i])
    }
  }
}

/**
 * Ha a megtalat kartyak tombje egyezik a megadott ertekkel akkor 
 * kiirja, hogy a felhasznalo nyert.
 */
function drawWin() {
  if(foundCards.length === 8) {
    gameTime = sec;
    isRunning = false;
    result.innerHTML = `Gratulalok nyertel! Az idod: ${gameTime} masodperc`;
    const button = document.createElement('button');
    button.innerHTML = 'Uj Jatek';
    button.addEventListener('click', cleareState);
    result.appendChild(button)
  }
}

/**
 * Megtalat lapokat es a megnem talalt lapokat szamolja
 */
function scoreCounter() {
  scoreOne.innerHTML = foundCards.length;
  scoreTwo.innerHTML = 8 -foundCards.length;
}

/**
 * Megvizsgalja, hogy ket kartya egyezik vagy nem.
 * Ha egyeznek akkor belerakja a megtalat kartyak tombbe.
 * Ha nem egyeznek visszaforditja a kartyakat.
 */
function matchCard() {
  const cards = document.querySelectorAll('.card');
  if(choosenCards[0].getAttribute('value') === choosenCards[1].getAttribute('value')) {
    console.log('Match');
    foundCards.push(choosenCards);
    cards[choosenCards[0].getAttribute('data-id')].innerHTML = '';
    cards[choosenCards[0].getAttribute('data-id')].classList.add('foundCard');
    cards[choosenCards[1].getAttribute('data-id')].innerHTML = '';
    cards[choosenCards[1].getAttribute('data-id')].classList.add('foundCard');
  } else {
    console.log('Unmatch');
    cards[choosenCards[0].getAttribute('data-id')].innerHTML = '';
    cards[choosenCards[1].getAttribute('data-id')].innerHTML = '';
  }
  choosenCards = []; 
  scoreCounter();
  drawWin();
}

/**
 * Amikor megforditom a kartyat beszurom innerHTML segitsegevel az erteket, 
 * ekkor megjeleni az erteke. A felforditott lapot egy tombbe rakom amit addig tudok 
 * feltolteni amig a hossza elnem eri a kettot. Ekkor meghivom a matchCard metodust
 */
function flipCard() {
  console.log('Flip card');
  this.innerHTML = this.getAttribute('value');
  choosenCards.push(this);
  if(choosenCards.length === 2){
    if(choosenCards[0].getAttribute('data-id') === choosenCards[1].getAttribute('data-id')) {
      this.innerHTML = '';
      choosenCards = [];
    } else {
      setTimeout(matchCard, 500)
    }
  } 
}

/**
 * Legeneralok egy allapotot, ami a memori jatek alapja lesz
 * A 2d tomb generalasa kozben random kivalasztok egy szamot 0-7 kozott,
 * ezt a szamot arra hasznalom fel, hogy a karaterek tombben kivalasztok egy 
 * karaktert es azt belerakom a board[h][w] pontra.
 * Kozben szamolom, hogy hanyszor valasztottm ki a karaktert, ha 2=szer
 * akkor a for ciklus szamlalojat visszaleptetem eggyel.
 * 
 * Nem a legjobb megoldas lehetne rajta finomitani
 * Pledaul:
 * - a karakter kivalasztason
 * - else reszen is
 */
function generateTable(weight, height) {
  for(let h = 0; h < height; h++){
    board[h] = [];
    for(let w = 0; w < weight; w++) {
      let randomNumber = Math.floor(Math.random() * 8);
      if(characters[randomNumber].piece != 2) {
        board[h][w] = characters[randomNumber].value;
        characters[randomNumber].piece++;
      } else {
        w--;
      }
    }
  }
}

/**
 * A board tomb segitsegevel megtudom jeleniteni a kartyakat
 */
function drawBoard() {
  let id = 0;
  for (let i = 0; i < board.length; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    gameBoard.appendChild(row);
    for (let j = 0; j < board[i].length; j++) {
      const card = document.createElement('div');
      card.setAttribute('value', board[i][j]);
      card.setAttribute('data-id',id);
      id++;
      card.innerHTML = '';
      card.addEventListener('click', flipCard);
      card.classList.add('card');
      row.appendChild(card);
    }
  }
  scoreOne.innerHTML = foundCards.length;
  scoreTwo.innerHTML = 8;
}