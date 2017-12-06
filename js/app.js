const BASE_NUMBER = 0
let started = false
let stateMatrix = [
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER],
  [BASE_NUMBER, BASE_NUMBER, BASE_NUMBER, BASE_NUMBER]
]

function range (start, end, step) {
  let _end = end || start
  let _start = end ? start : 0
  let _step = step || 1
  return Array((_end - _start) / _step).fill(0).map((v, i) => _start + (i * _step))
}

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

  const positionController = (rowCoeff, colCoeff) => {
    let rowRange = rowCoeff < 0 ? range(0, 4) : range(0, 4).reverse()
    let colRange = colCoeff < 0 ? range(0, 3) : range(1, 4).reverse()

    let edge = colCoeff < 0 ? 0 : 3
    let adjacent = colCoeff < 0 ? 1 : 2

    console.log(colRange, edge, adjacent)
    for (let row of rowRange) {
      let edgeValue = stateMatrix[row][edge]
      let adjacentValue = stateMatrix[row][adjacent]
      let isEqual = edgeValue === adjacentValue && edgeValue !== 0 && adjacentValue !== 0
      let hasZero = edgeValue === 0 || adjacentValue === 0

      if (isEqual || hasZero) {
        for (let col of colRange) {
          if (col === edge) {
            stateMatrix[row][edge] += stateMatrix[row][adjacent]
            continue
          }
          stateMatrix[row][col] = stateMatrix[row - rowCoeff][col - colCoeff]

          $(`.active[data-row=${row}][data-col=${col}]`)
            .attr({
              style: `transform: translate3d(${(col + colCoeff) * 125 + 12.5}%, ${(row + rowCoeff) * 125 + 12.5}%, 0);`,
              'data-row': row + rowCoeff,
              'data-col': col + colCoeff
            })
        }
        stateMatrix[row][edge] = BASE_NUMBER

        if (isEqual) {
          drawPoint(row, 0)
        }
      }
    }
  }

  switch (e.keyCode) {
    case 37:
      positionController(0, -1)
      break
    case 38:
      positionController(-1, 0)
      break
    case 39:
      positionController(0, 1)
      break
    case 40:
      positionController(1, 0)
      break
  }
  console.log(JSON.stringify(stateMatrix))

})
