document.addEventListener("DOMContentLoaded", function() {
  var canvas = document.querySelector("canvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  drawLine([])
}, false);


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

function notValid(x) {
  return x == '' || isNaN(x)
}

function getLength(xn, yn, xk, yk) {
  return Math.abs(xn - xk) > Math.abs(yn - yk) ? Math.abs(xn - xk) : Math.abs(yn - yk)
}

let dots = []

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  let xn = e.target.elements.xn.value;
  let yn = e.target.elements.yn.value;

  let xk = e.target.elements.xk.value;
  let yk = e.target.elements.yk.value;

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
  const length = getLength(xn, yn, xk, yk)
  const dx = (xk - xn) / length
  const dy = (yk - yn) / length
  
  console.log(dx, dy)
  let x = xn
  let y = yn
  dots.push([x, y])
  for (let i = 0; i < length; i += 1) {
    x += dx
    y += dy
    console.log(`dot: ${x}, ${y}`)
    dots.push([round(x), round(y)])
  }
})

document.querySelector('#op1').addEventListener('click', (e) => {
  drawLine(dots)
})

function round(x) {
  console.log(x)
  x /= 1
  x = Math.round(x)
  x *= 1
  console.log(x)
  return x
}

function drawLine(dots) {
  const canvas = document.querySelector('canvas')
  if (canvas.getContext) {
      ctx = canvas.getContext('2d')
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(110, 200);
      ctx.stroke();
      

      console.log(dots.length)
      for (let i = 0; i < dots.length; i++) {
        ctx.rect(dots[i][0], dots[i][1], 1, 1)
        ctx.fillRect(dots[i][0], dots[i][1], 1, 1)
        ctx.stroke()
      }
  }
  else {console.log('can not get context')}
}

drawLine([])

//event.target.value for color picking