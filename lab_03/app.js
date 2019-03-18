console.log('hey')

function calcStraightLine (startCoordinates, endCoordinates) {
    var coordinatesArray = new Array();
    // Translate coordinates
    var x1 = startCoordinates[0];
    var y1 = startCoordinates[1];
    var x2 = endCoordinates[0];
    var y2 = endCoordinates[1];
    // Define differences and error check
    var dx = Math.Math.abs(x2 - x1);
    var dy = Math.Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    // Set first coordinates
    coordinatesArray.push([y1, x1]);
    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      // Set coordinates
      coordinatesArray.push([y1, x1]);
    }
    // Return the result
    return coordinatesArray;
  }

//const canvas = document.querySelector('canvas')
// if (canvas.getContext) {
//     context = canvas.getContext('2d')

//     const step = 40
//     for (let i = 0; i <= 2000; i += step) {
//         context.beginPath()
//         context.strokeStyle = 'black'
//         context.moveTo(i, 0)
//         context.lineTo(i, 1500)
//         context.stroke()
//     }

//     for (let i = 0; i <= 2000; i += step) {
//         context.beginPath()
//         context.strokeStyle = 'black'
//         context.moveTo(0, i)
//         context.lineTo(2000, i)
//         context.stroke()
//     }


//     const dots = calcStraightLine([10, 10], [50, 70])
//     console.log(dots)

//     context.rect(40, 20, 1, 1)
//     context.stroke()
// }
// else {console.log('can not get context')}

function notValid(x) {
  return x == '' || isNaN(x)
}

function getLength(xn, yn, xk, yk) {
  return Math.abs(xn - xk) > Math.abs(yn - yk) ? Math.abs(xn - xk) : Math.abs(yn - yk)

}

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  let xn = e.target.elements.xn.value;
  let yn = e.target.elements.yn.value;

  let xk = e.target.elements.xk.value;
  let yk = e.target.elements.yk.value;

  e.target.elements.xn.value = ''
  e.target.elements.yn.value = ''
  e.target.elements.xk.value = ''
  e.target.elements.yk.value = ''

  console.log(xn, yn, xk, yk)
  if (notValid(xn) || notValid(yn) || notValid(xk) || notValid(yk)) {
    alert('not valid input')
    return
  }
  xn = parseFloat(xn)
  yn = parseFloat(yn)
  xk = parseFloat(xk)
  yk = parseFloat(yk)
  if (xn == xk && yn == yk) {
    alert('that is a dot')
    return
  }
  let dots = []
  const length = getLength(xn, yn, xk, yk)
  const dx = (xk - xn) / length * 10
  const dy = (yk - yn) / length * 10
  
  console.log(dx, dy)
  let x = xn
  let y = yn
  dots.push([x, y])
  for (let i = 0; i < length; i += 10) {
    x += dx
    y += dy
    console.log(`dot: ${x}, ${y}`)
    dots.push([round(x), round(y)])
  }
  drawLine(dots)
})

function round(x) {
  console.log(x)
  x /= 10
  x = Math.round(x)
  x *= 10
  console.log(x)
  return x
}

function drawLine(dots) {
  const canvas = document.querySelector('canvas')
  if (canvas.getContext) {
      ctx = canvas.getContext('2d')

      console.log(dots.length)
      for (let i = 0; i < dots.length; i++) {
        ctx.rect(dots[i][0], dots[i][1], 10, 10)
        ctx.fillRect(dots[i][0], dots[i][1], 10, 10)
        ctx.stroke()
      }
  }
  else {console.log('can not get context')}
}

round(120)
round(180)