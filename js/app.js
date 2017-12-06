const BASE_NUMBER = 0
let started = false
let stateMatrix = [
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER]
]

function drawPoint (i, j) {
  let level = stateMatrix[i][j]

  let element = $('<div></div>').attr({
    class: `item active level-${level}`,
    style: `transform: translate3d(${j * 125 + 12.5}%,
                ${i * 125 + 12.5}%, 0) scale(0.01); z-index: ${level}`,
    'data-row': i,
    'data-col': j,
  })
    .text(stateMatrix[i][j])

  setTimeout(() => {
    element.attr({
      class: `item active level-${level}`,
      style: `transform: translate3d(${j * 125 + 12.5}%,
                ${i * 125 + 12.5}%, 0) scale(1); z-index: ${level}`,
      'data-row': i,
      'data-col': j
    })
  }, 100)

  $(`.game-view`).append(element)

  // let failed = true
  // let success = false
  // for (let i = 0; i < 3; i++) {
  //   for (let j = 0; j < 3; j++) {
  //     if (stateMatrix[i][j] === 2048) success = true
  //     if (stateMatrix[i][j] === stateMatrix[i + 1][j] ||
  //       stateMatrix[i][j] === stateMatrix[i][j + 1] ||
  //       stateMatrix[i + 1][j] === BASE_NUMBER ||
  //       stateMatrix[i][j + 1] === BASE_NUMBER ||
  //       stateMatrix[i + 1][j + 1] === BASE_NUMBER
  //     ) failed = false
  //   }
  // }
  //
  // for (let i = 0; i < 4; i++) {
  //   if (stateMatrix[i][3] === 2048 || stateMatrix[3][i] === 2048) {
  //     success = true
  //     break
  //   }
  // }
  //
  // if (failed) alert('Failed!')
  // if (success) alert('Succeed!!')

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
  drawPoint(row, col)
}

$(document).ready(() => {
  function initFactory (row, col) {
    return (
      `<div class="item level-1"
          style="left: ${col * 25 + 2.5}%; top: ${row * 25 + 2.5}%" 
          data-row="${row}" 
          data-col="${col}">
      </div>`
    )
  }

  let result = ''

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result += initFactory(i, j)
    }
  }
  $('.game-view').html(result)
})

$('.restart-button').click(() => {
  started = true

  // stateMatrix = [
  //   [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  //   [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  //   [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  //   [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER]
  // ]

  addRandomPosition()

  $('.restart-button').text('Restart!')
})

$(document).keydown((e) => {
  if (e.keyCode < 37 && e.keyCode > 40) return
  if (!started) return

  $('.active').each(function (index) {
    let row = parseInt($(this).attr('data-row'))
    let col = parseInt($(this).attr('data-col'))
    let value = parseInt($(this).text())

    // Maintain State Machine
    switch (e.keyCode) {
      case 37:
        if (col === 0) return
        stateMatrix[row][col] = BASE_NUMBER
        col -= 1
        break
      case 38:
        if (row === 0) return
        stateMatrix[row][col] = BASE_NUMBER
        row -= 1
        break
      case 39:
        if (col === 3) return
        stateMatrix[row][col] = BASE_NUMBER
        col += 1
        break
      case 40:
        if (row === 3) return
        stateMatrix[row][col] = BASE_NUMBER
        row += 1
        break
    }

    // Maintain UI
    $(this).attr({
      style: `transform: translate3d(${col * 125 + 12.5}%,
                  ${row * 125 + 12.5}%, 0);`,
      'data-row': row,
      'data-col': col
    })

    stateMatrix[row][col] += value

    if (stateMatrix[row][col] !== value) {
      drawPoint(row, col)
    }

    console.log(stateMatrix)
  })
})
