function calcStraightLine (startCoordinates, endCoordinates) {
    var coordinatesArray = new Array();
    // Translate coordinates
    var x1 = startCoordinates[0];
    var y1 = startCoordinates[1];
    var x2 = endCoordinates[0];
    var y2 = endCoordinates[1];
    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
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

const canvas = document.querySelector('canvas')
if (canvas.getContext) {
    context = canvas.getContext('2d')

    const step = 40
    for (let i = 0; i <= 2000; i += step) {
        context.beginPath()
        context.strokeStyle = 'black'
        context.moveTo(i, 0)
        context.lineTo(i, 1500)
        context.stroke()
    }

    for (let i = 0; i <= 2000; i += step) {
        context.beginPath()
        context.strokeStyle = 'black'
        context.moveTo(0, i)
        context.lineTo(2000, i)
        context.stroke()
    }


    const dots = calcStraightLine([10, 10], [50, 70])
    console.log(dots)

    context.rect(40, 20, 1, 1)
    context.stroke()
}
else {console.log('can not get context')}


