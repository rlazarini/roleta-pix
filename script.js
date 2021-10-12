window.onload = async () => {
  window.temporizer = 1
  window.position = 0
  var loaditems = await loadData()
  createCards(loaditems)
  window.cards = document.querySelectorAll('.card')
  document.querySelector('#actions #cta').addEventListener("click", randomizer, false);
  document.querySelector('#actions #startCards').addEventListener("click", startCards, false);
}

const createCards = (items) => {
  items = items.map(function(n){ return [Math.random(), n] }).sort().map(function(n){ return n[1] })
  let html = ''
  for (let item of items) {
    html = html + `
      <li>
        <div class="card block">
          <div class="conteudo">
            ${item.value}
          </div>
        </div>
      </li>`
  }
  document.querySelector('#content ul').innerHTML = html
}

const startCards = (ms = 0) => {
  for(let card of window.cards) {
    card.classList.add('start')
    window.setTimeout(() => {
      card.classList.remove('block')
      card.classList.remove('start')
    }, 100)
  }
  document.querySelector('#actions #startCards').remove()
  return new Promise(resolve => setTimeout(resolve, ms));
}

const randomizer = async () => {
  if (!!document.querySelector('#actions #startCards')) {
    await startCards(300);
  }
  document.querySelector('#actions #cta').removeEventListener('click', randomizer, false);
  if (window.temporizer < 177) {
    timer(temporizer)
  } else {
    window.temporizer = 1
    document.querySelector('#actions #cta').addEventListener("click", randomizer);
    document.querySelector('.card.hover:not(.block)').classList.add('block')
    window.cards = document.querySelectorAll('.card:not(.block)')
  }
}

const timer = (time) => {
  window.setTimeout(() => {
    document.querySelector('.card.hover:not(.block)')?.classList.remove('hover')

    console.log(window.position, window.cards)
    window.cards[(window.position >= window.cards.length ? 0 : window.position)].classList.add('hover')
    window.position = (window.position + 1 > window.cards.length ? 0 : window.position + 1)
    window.temporizer = time + (Math.random() * (11 - Math.random()) + 1);
    randomizer()
  }, time)
}

const loadData = () => {
  return fetch('https://roletadura-d4d9.restdb.io/rest/roleta', {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-apikey': '61639c918597142da174559c',
      'cache-control': 'no-cache'
    })
  })
  .then(response => response.json())
  .then(data => {
    return data
  })
}