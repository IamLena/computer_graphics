let pencilAction = true
let lineAction = false
let fillAction = false
let speed = 15
let mouseDown = false
let first
let last
let dots = [[200, 100], [200, 200], [100, 200], [100, 100]]
// [[240, 127], [402, 339], [266, 257], [119, 349], [62, 266]]


const slider = document.getElementById("myRange");
let output = document.getElementById("demo");
output.innerHTML = `${slider.value} ms`;

slider.oninput = function() {
  output.innerHTML = `${this.value} ms`;
  speed = this.value
}

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height
ctx.strokeStyle = 'black'
ctx.fillStyle = 'black'

ctx.beginPath()
ctx.moveTo(dots[0], dots[1])
dots.forEach((dot) => { 
    ctx.lineTo(dot[0], dot[1])
    ctx.stroke()
})
ctx.lineTo(dots[0][0], dots[0][1])
ctx.stroke()

// ctx.moveTo(0, 257)
// ctx.lineTo(500, 257)
// ctx.stroke()

// fillLine(0, 500, 257)
// fillLine(81.20863309352522, 334.75471698113205, 251)


document.querySelector('#clean').addEventListener('click', (e) => {
    ctx.clearRect(0, 0, width, height)
    first = undefined
    last = undefined
    dots = []
})

$('input[type="radio"]').on('click change', function(e) {
    console.log(e.target.id);
    const action = e.target.id
    if (action === 'pencil') {
        pencilAction = true
        lineAction = false
        fillAction = false
    }
    else if (action === 'line') {
        pencilAction = false
        lineAction = true
        fillAction = false
    }
    else {
        pencilAction = false
        lineAction = false
        fillAction = true
    }
});

$('input[id="color"]').on('change', function(e) {
    const color = e.target.value;
    ctx.strokeStyle = color
    ctx.fillStyle = color
});
$('input[id="bgcolor"]').on('change', function(e) {
    const color = e.target.value;
    canvas.style.backgroundColor = color
});


canvas.addEventListener('mousedown', (e) => {
    if (e.which === 1) {
        if (lineAction) {
            let x = e.offsetX
            let y = e.offsetY;
            if (first == undefined) {
                dots = []
                first = [x, y]
                ctx.fillRect(x, y, 1, 1)
                last = [x, y]
            }
            else {
                ctx.beginPath()
                ctx.moveTo(last[0], last[1])
                ctx.lineTo(x, y)
                ctx.stroke()
                last = [x, y]
            }
            dots.push([x, y])
        }
        if (pencilAction) {
            mouseDown = true
        }
        if (fillAction) {
            fillArea(dots)
        }
    }
    if (e.which === 3) {
        if (first) {
            ctx.beginPath()
            ctx.moveTo(last[0], last[1])
            ctx.lineTo(first[0], first[1])
            ctx.stroke()
            first = undefined
        }
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (mouseDown && pencilAction) {
        let x = e.offsetX
            let y = e.offsetY;
            if (first == undefined) {
                first = [x, y]
                ctx.fillRect(x, y, 1, 1)
                last = [x, y]
            }
            ctx.beginPath()
            ctx.moveTo(last[0], last[1])
            ctx.lineTo(x, y)
            ctx.stroke()
            last = [x, y]
    }
});
document.addEventListener('mouseup', (e) => {
    mouseDown = false
});

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
    
            for (let y = ymin; y <= ymax; y += 1) {
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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