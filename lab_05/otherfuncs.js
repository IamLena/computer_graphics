
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


async function fillArea (dots) {
    let copyDots = dots.slice()
    copyDots.sort(function(a, b) {
        return a[1] - b[1]
    })
    // const tmp = ctx.fillStyle
    // ctx.fillStyle = 'red';
    // copyDots.forEach((dot) => {
    //     fillLine(0, 500, dot[1])
    // })
    // ctx.fillStyle = tmp

    for (let i = 0; i < copyDots.length - 1; i++) {
        const ymin = copyDots[i][1]
        const ymax = copyDots[i+1][1]
        if (ymin != ymax)
        {
            const borderMB = getLine([ymin, ymax])
            const borderM = borderMB[0]
    
            let interEdges = []
            for (let j = 0; j < dots.length - 1; j++) {
                if ((dots[j][1] <= ymin && dots[j + 1][1] >= ymax) || (dots[j][1] >= ymax && dots[j + 1][1] <= ymin)) {
                    interEdges.push([dots[j], dots[j+1]])
                }
            }
            if ((dots[dots.length - 1][1] <= ymin && dots[0][1] >= ymax) || (dots[dots.length - 1][1] >= ymax && dots[0][1] <= ymin)) {
                interEdges.push([dots[dots.length - 1], dots[0]])
            }
    
            for (let y = ymin; y < ymax; y += 1) {
                let interX = []
                for (let j = 0; j < interEdges.length; j++) {
                    if (interEdges[j][0][0] == interEdges[j][1][0]) {
                        interX.push(interEdges[j][0][0])
                    }
                    else {
                        const interMB = getLine(interEdges[j])
                        interX.push((y - interMB[1]) / interMB[0])
                    }
                }
                let sortedX = interX.sort(function(a,b) { return a - b;})
                for (let j = 0; j < sortedX.length - 1; j += 2) {
                    fillLine(sortedX[j], sortedX[j + 1], y)
                    if (speed != 0) {
                        await sleep(speed);
                    }
                }
            }
        }

    }
}