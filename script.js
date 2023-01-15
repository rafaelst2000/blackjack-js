let deck = []
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
.then(response => response.json())
.then(result => {
  const { deck_id } = result
  fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=52`)
  .then(response => response.json())
  .then(result => {
    deck = result.cards
  })
})

function Player(name, count, cards) {
  this.name = name;
  this.count = count;
  this.cards = cards;
}
const name1 = prompt('Digite o nome do Jogador 1')
const name2 = prompt('Digite o nome do Jogador 2')
const name3 = prompt('Digite o nome do Jogador 3')

const deckImgBtn = document.querySelector('.deck-img')
const stopBtn = document.querySelector('.stop-button')
const continueBtn = document.querySelector('.continue-button')
const newGameBtn = document.querySelector('.new-game-button')
const explodeTxt = document.querySelector('.explode')


let playerTurn = 1
let isGameFinished = false
let isExploded = false

let player1 = new Player(name1, 0, [])
let player2 = new Player(name2, 0, [])
let player3 = new Player(name3, 0, [])

drawPlayerName(player1.name)
drawPlayersScore()

function drawPlayerName(name) {
  const container = document.querySelector('h3')
  if(isExploded) container.textContent = ``
  else container.textContent = `Vez de: ${name}`
}

function clearPlayerName() {
  const container = document.querySelector('h3')
  container.textContent = ''
}

function makePlay(player) {
  if(player.count > 21 || isGameFinished || isExploded) return
  const newCard = deck[0]

  player.cards.push(newCard);
  deck.shift()

  drawCards(player, newCard)
  player.count += getCardValue(newCard)
  showPlayerScoreAtScreen(player)

  if(player.count == 21) verifyScore()
  if(player.count > 21) handleClickStopOrExplode()
}

function drawCards(player, newCard) {
  const container = document.querySelector('.cards')
  const length = player.cards.length
  const newCardImg = document.createElement('img')
  
  newCardImg.src = player.cards[length - 1].images.png
  newCardImg.classList.add('absolute-card')
  container.appendChild(newCardImg)
}

function getCardValue(card) {
  const { value } = card
  if(['ACE', 'JACK', 'QUEEN', 'KING'].includes(value)) {
    const cards = {
      ACE: 1,
      JACK: 11,
      QUEEN: 12,
      KING: 13
    }
    return cards[value]
  }
  return Number(value)
}

function showPlayerScoreAtScreen(player) {
  const container = document.querySelector('.total-score')
  container.textContent = `Total: ${player.count}`

  if(player.count > 21) {
    isExploded = true
    explodeTxt.innerHTML = `${player.name} ESTOUROU`
    stopBtn.classList.add('hidden')
    continueBtn.classList.remove('hidden')
    clearPlayerName()
  }
}

function handleClickStop() {
  clearScreen()
  handleClickStopOrExplode()
}

function handleClickStopOrExplode() {
  playerTurn++
  drawPlayersScore()
  if(playerTurn < 4) {
    const players = { 1: player1.name, 2: player2.name, 3: player3.name }
    drawPlayerName(players[playerTurn])
  } else {
    verifyScore()
  }
}

function clearScreen() {
  explodeTxt.innerHTML = ''
  const score = document.querySelector('.total-score')
  score.textContent = `Total: 0`

  const cards = document.querySelector('.cards')
  while (cards.firstChild) {
    cards.removeChild(cards.firstChild)
  }
}

function drawPlayersScore() {
  const p1 = document.querySelector('.player-1-score')
  const p2 = document.querySelector('.player-2-score')
  const p3 = document.querySelector('.player-3-score')

  p1.textContent = `${player1.name}: ${player1.count}`
  p2.textContent = `${player2.name}: ${player2.count}`
  p3.textContent = `${player3.name}: ${player3.count}`
}

function verifyScore() {
  const container = document.querySelector('h3')
  const players = [player1, player2, player3]
  const orderedValidScorePlayers = players.filter(player => player.count < 22).sort((a,b) => b.count - a.count)

  isGameFinished = true

  continueBtn.classList.add('hidden')
  stopBtn.classList.add('hidden')
  newGameBtn.classList.remove('hidden')
  if(!orderedValidScorePlayers.length) container.textContent = 'Nenhum jogador venceu :('
  else {
    if(orderedValidScorePlayers.length === 3 && orderedValidScorePlayers[0].count === orderedValidScorePlayers[1].count && orderedValidScorePlayers[0].count === orderedValidScorePlayers[2].count) container.textContent = 'Empate dos 3!'
    else if(orderedValidScorePlayers.length === 2 && (orderedValidScorePlayers[0].count === orderedValidScorePlayers[1].count)) container.textContent = `Empate de ${orderedValidScorePlayers[0].name} e ${orderedValidScorePlayers[1].name}!`
    else container.textContent = `Vitória de ${orderedValidScorePlayers[0].name}!!!`
  }
}

function newGame() {
  isGameFinished = false
  isExploded = false
  player1 = new Player(name1, 0, [])
  player2 = new Player(name2, 0, [])
  player3 = new Player(name3, 0, [])
  playerTurn = 0

  clearScreen()
  handleClickStopOrExplode()
  stopBtn.classList.remove('hidden')
  newGameBtn.classList.add('hidden')
}

function changeNextPlayer() {
  clearScreen()
  if(playerTurn <= 3) {
    isExploded = false
    playerTurn--
    explodeTxt.innerHTML = ``
    continueBtn.classList.add('hidden')
    stopBtn.classList.remove('hidden')
    handleClickStopOrExplode()
  }
  else {
    isExploded = false
    explodeTxt.innerHTML = ''
    verifyScore()
  }
}

deckImgBtn.addEventListener('click', () => {
  if(playerTurn === 1) makePlay(player1)
  else if(playerTurn === 2) makePlay(player2)
  else if(playerTurn === 3) makePlay(player3)
})

stopBtn.addEventListener('click', handleClickStop)
newGameBtn.addEventListener('click', newGame)
continueBtn.addEventListener('click', changeNextPlayer)
