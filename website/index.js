let canvasSize
let model
let grid
const outerGridSize = 28
const innerGridSize = 5
const drawRadius = 7

async function loadModel() {
  model = await tf.loadLayersModel('../model/model.json');
}

loadModel()

function setup() {
  createCanvas(innerWidth, innerHeight)
  canvasSize = innerWidth
  noStroke()
  document.getElementsByTagName('main')[0].style.height = innerHeight + 'px'
  background(0)

  textSize(30)
  textAlign(CENTER, CENTER)

  grid = createEmptyGrid()
  console.log(grid)
}

function windowResized() {
  createCanvas(innerWidth, innerHeight)
  canvasSize = innerWidth
  noStroke()
  document.getElementsByTagName('main')[0].style.height = innerHeight + 'px'
  background(0)
}

function draw() {
  if (mouseIsPressed) {
    drawCircle(mouseX / innerWidth, mouseY / innerWidth)
  }

  // console.log(prediction().map(a => a.toFixed(2)))

  drawPrediction()

  clearButton()

  textAlign(LEFT, TOP)
  fill(251, 255, 41)
  text('Made by Maicon !', 5, 5)
}

function clearButton() {
  textAlign(RIGHT, TOP)
  fill(46, 203, 255)
  textSize(15)
  text('LIMPAR', innerWidth - 5, 5)
}

function mousePressed() {

  if (dist(mouseX, mouseY, innerWidth - 5, 5) < 50) {
    grid = createEmptyGrid()
    background(0)
  }
}

function drawPrediction() {
  textSize(40)
  textAlign(CENTER, CENTER)
  const pred = prediction()

  const rectWidth = innerWidth / 5
  const rectHeight = (innerHeight - innerWidth) / 2


  for (let num = 0; num < 5; num++) {
    stroke(0)
    fill(255)
    rect(num * rectWidth, innerWidth, rectWidth, rectHeight)

    fill(255, 0, 0)
    numPred = pred[num]
    rect(num * rectWidth, innerWidth, rectWidth, rectHeight * numPred)

    noStroke()
    fill(0)
    text(num, num * rectWidth + rectWidth / 2, innerWidth + rectHeight / 2)

  }

  for (let num = 5; num < 10; num++) {
    stroke(0)
    fill(255)
    rect((num - 5) * rectWidth, innerWidth + rectHeight, rectWidth, rectHeight)

    fill(255, 0, 0)
    numPred = pred[num]
    rect((num - 5) * rectWidth, innerWidth + rectHeight, rectWidth, rectHeight * numPred)

    noStroke()
    fill(0)
    text(num, (num - 5) * rectWidth + rectWidth / 2, innerWidth + 3 * rectHeight / 2)
  }
}

function prediction() {
  const x = getOuterGrid()

  y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  if (model)
    y = model.predict(tf.tensor4d([x])).arraySync()[0]

  return y
}

function getOuterGrid() {
  const outerGrid = []

  for (let outerX = 0; outerX < outerGridSize; outerX++) {
    outerGrid[outerX] = []
    for (let outerY = 0; outerY < outerGridSize; outerY++) {
      outerGrid[outerX][outerY] = [0]
      for (let innerX = 0; innerX < innerGridSize; innerX++) {
        for (let innerY = 0; innerY < innerGridSize; innerY++) {
          if (grid[outerY * innerGridSize + innerY][outerX * innerGridSize + innerX]) {
            outerGrid[outerX][outerY][0]++
          }
        }
      }
      outerGrid[outerX][outerY][0] = outerGrid[outerX][outerY][0] / (innerGridSize ** 2)
    }
  }

  return outerGrid
}

function drawCircle(x, y) {
  noStroke()
  fill(255)


  if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
    // circle(x * innerWidth, y * innerWidth, 2 * drawRadius)
    for (let dx = -drawRadius; dx <= drawRadius; dx++) {
      for (let dy = -drawRadius; dy <= drawRadius; dy++) {
        const realX = x * innerGridSize * outerGridSize + dx
        const realY = y * innerGridSize * outerGridSize + dy

        if (
          realX >= 0 &&
          realY >= 0 &&
          realX < innerGridSize * outerGridSize &&
          realY < innerGridSize * outerGridSize &&
          dist(
            x * innerGridSize * outerGridSize,
            y * innerGridSize * outerGridSize,
            realX,
            realY
          ) < drawRadius
        ) {
          grid[floor(realX)][floor(realY)] = true
          rect(
            realX / innerGridSize / outerGridSize * innerWidth,
            realY / innerGridSize / outerGridSize * innerWidth,
            5, 5
          )
        }
      }
    }
  }
}

function createEmptyGrid() {
  const grid = []

  for (let x = 0; x < outerGridSize * innerGridSize; x++) {
    grid[x] = []
    for (let y = 0; y < outerGridSize * innerGridSize; y++) {
      grid[x][y] = false
    }
  }

  return grid
}