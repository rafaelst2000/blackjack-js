let allCards = []

fetch('https://deckofcardsapi.com/api/deck/new/')
  .then(response => response.json())
  .then(result => {
    const { deck_id } = result
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=52`)
      .then(response => response.json())
      .then(result => {
        allCards = result.cards
        drawCards()
      })
  })


function drawCards() {
  const container = document.querySelector('.player-1-cards')
  const cards = [allCards[0], allCards[1], allCards[2], allCards[3], allCards[3] ,allCards[3]]
  for(let i = 0; i < cards.length; i++) {
    const newCardImg = document.createElement('img')
    newCardImg.src = cards[i].images.png
    newCardImg.classList.add('absolute-card')
    newCardImg.style.left = `${i*40}px`

    container.appendChild(newCardImg)
  }
}
