const BASE_NUMBER = 0
let started = false
let stateMatrix = [
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER]
]

function drawMatrix () {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let level = stateMatrix[i][j]
      level = level === BASE_NUMBER ? '' : level
      $(`.item[data-row=${i}][data-col=${j}]`)
        .attr('class', `item level-${level}`)
        .text(level)
    }
  }

  let failed = true
  let success = false
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (stateMatrix[i][j] === 2048) success = true
      if (stateMatrix[i][j] === stateMatrix[i + 1][j] ||
        stateMatrix[i][j] === stateMatrix[i][j + 1] ||
        stateMatrix[i + 1][j] === BASE_NUMBER ||
        stateMatrix[i][j + 1] === BASE_NUMBER ||
        stateMatrix[i + 1][j + 1] === BASE_NUMBER
      ) failed = false
    }
  }

  for (let i = 0; i < 4; i++) {
    if (stateMatrix[i][3] === 2048 || stateMatrix[3][i] === 2048) {
      success = true
      break
    }
  }

  if (failed) alert('Failed!')
  if (success) alert('Succeed!!')

  console.log(stateMatrix)
}

function getRandomNumber () {
  let row = parseInt(Math.random() * 4)
  let col = parseInt(Math.random() * 4)
  while (stateMatrix[row][col] !== BASE_NUMBER) {
    row = parseInt(Math.random() * 4)
    col = parseInt(Math.random() * 4)
  }
  return [row, col]
}

function addRandomPosition () {
  let [row, col] = getRandomNumber()
  stateMatrix[row][col] = 2
  drawMatrix()
}

$(document).ready(() => {
  function gameFactory (row, col, number) {
    let display = number === BASE_NUMBER ? '' : number
    return `<div class="item level-${number}" data-row="${row}" data-col="${col}">${display}</div>`
  }

  let result = ''

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result += gameFactory(i, j, stateMatrix[i][j])
    }
  }
  $('.game-view').html(result)
})

$('.restart-button').click(() => {
  started = true

  stateMatrix = [
    [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
    [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
    [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
    [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER]
  ]

  addRandomPosition()

  $('.restart-button').text('Restart!')
})

$(document).keydown((e) => {
  if (!started) return

  let originState = JSON.stringify(stateMatrix)

  switch (e.keyCode) {
    // Left
    case 37:
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
          if (stateMatrix[i][j - 1] === stateMatrix[i][j] ||
            stateMatrix[i][j - 1] === BASE_NUMBER) {
            stateMatrix[i][j - 1] += stateMatrix[i][j]
            stateMatrix[i][j] = BASE_NUMBER
          }
        }
      }

      if (originState !== JSON.stringify(stateMatrix)) addRandomPosition()
      break
    //  Up
    case 38:
      for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (stateMatrix[i - 1][j] === stateMatrix[i][j]
            || stateMatrix[i - 1][j] === BASE_NUMBER) {
            stateMatrix[i - 1][j] += stateMatrix[i][j]
            stateMatrix[i][j] = BASE_NUMBER
          }
        }
      }

      if (originState !== JSON.stringify(stateMatrix)) addRandomPosition()
      break
    //  Right
    case 39:
      for (let i = 0; i < 4; i++) {
        for (let j = 2; j > -1; j--) {
          if (stateMatrix[i][j + 1] === stateMatrix[i][j]
            || stateMatrix[i][j + 1] === BASE_NUMBER) {
            stateMatrix[i][j + 1] += stateMatrix[i][j]
            stateMatrix[i][j] = BASE_NUMBER
          }
        }
      }

      if (originState !== JSON.stringify(stateMatrix)) addRandomPosition()
      break
    //  Down
    case 40:
      for (let i = 2; i > -1; i--) {
        for (let j = 0; j < 4; j++) {
          if (stateMatrix[i + 1][j] === stateMatrix[i][j]
            || stateMatrix[i + 1][j] === BASE_NUMBER) {
            stateMatrix[i + 1][j] += stateMatrix[i][j]
            stateMatrix[i][j] = BASE_NUMBER
          }
        }
      }

      if (originState !== JSON.stringify(stateMatrix)) addRandomPosition()
      break
  }
})
