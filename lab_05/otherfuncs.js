
function getLine(dots) {
    const x1 = dots[0][0]
    const y1 = dots[0][1]
    const x2 = dots[1][0]
    const y2 = dots[1][1]
    const m = (y1 - y2)/(x1 - x2)
    const b = y1 - m * x1
    return [m, b]
}

function findIntersection(m, b, y) {
    return (y - b) / m
}

function fillLine(x1, x2, y) {
    for (let x = x1; x < x2; x++) {
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
    }
}

// var timerId  = setTimeout(async function run() {
//     if (y === yend) {clearTimeout(timerId);}
//     else {
//         //fillLine(x, 500, y)
//         fillLineReverse(x, 500, y)
//         x += dx
//         y += 1
//         setTimeout(run, speed);
//     }
//     //await sleep()
// }, speed);
// await sleep(speed * (yend - yn) + 1000)