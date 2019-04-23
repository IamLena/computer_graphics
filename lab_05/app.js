let pencilAction = false
let lineAction = true
let fillAction = false
let speed = 15
let backgroundColor = [255, 255, 255]
let strokeColor = [0, 0,0]
let mouseDown = false
let first
let last
let dots = []

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
ctx.strokeStyle = rgbSTR(strokeColor)
ctx.fillStyle = rgbSTR(backgroundColor)

ctx.fillRect(0, 0, width, height)

document.querySelector('#clean').addEventListener('click', (e) => {
    ctx.clearRect(0, 0, width, height)
    first = undefined
    last = undefined
    dots = []
    ctx.fillStyle = rgbSTR(backgroundColor)
    ctx.fillRect(0, 0, width, height)
})

$('input[type="radio"]').on('change', function(e) {
    console.log(e.target.id);
    const action = e.target.id
    if (action === 'pencil') {
        pencilAction = true
        lineAction = false
        fillAction = false
        first = undefined
        last = undefined
        dots = []
    }
    else if (action === 'line') {
        pencilAction = false
        lineAction = true
        fillAction = false
        first = undefined
        last = undefined
        dots = []
    }
    else {
        pencilAction = false
        lineAction = false
        fillAction = true
    }
});

$('input[id="color"]').on('change', function(e) {
    const colorRGB = HEXtoRGB(e.target.value)
    color = rgbSTR(colorRGB)
    ctx.strokeStyle = color
    ctx.fillStyle = color
    strokeColor = colorRGB
});
$('input[id="bgcolor"]').on('change', function(e) {
    const colorRGB = HEXtoRGB(e.target.value)
    color = rgbSTR(colorRGB)
    canvas.style.backgroundColor = color
    backgroundColor = colorRGB
});

function rgbSTR(colorRGB) {
    return "rgb(" + colorRGB[0] + "," + colorRGB[1] + "," + colorRGB[2] + ")"
}

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
            //fillArea(dots)
            fillAreaEdges(dots)
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
            dots.push([x, y])
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

async function fillAreaEdges (dots) {
    let edges = makeEdges(dots)
    for (let i = 0; i < edges.length; i++) {
        await fillEdge(edges[i])
    }
}

async function fillEdge(edge) {
    if (edge[0][1] != edge[1][1]) {
        let y = edge[0][1]
        let yn = y
        let yend = edge[1][1]
        let x = edge[0][0]
        let dx

        if (edge[0][0] == edge[1][0]) {
            dx = 0
        }
        else {
            const mb = getLine(edge)
            m = mb[0]
            dx = 1 / m
            b = mb[1]
        }

        while (y != yend) {
            fillLineReverse(x, 500, y)
            x += dx
            y += 1
            await sleep(speed)
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
    }
}

function fillLineReverse(x1, x2, y) {
    for (let x = x1; x < x2; x++) {
        reverseColor(Math.round(x), Math.round(y))
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
    }
}

function reverseColor(x, y) {
    // let curColor = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data
    // let newColor = [255 - curColor[0], 255 - curColor[1], 255 - curColor[2]]
    // ctx.fillStyle = rgbSTR(newColor)

    if (curColor[0] === strokeColor[0] && curColor[1] === strokeColor[1] && curColor[2] === strokeColor[2]) {
        ctx.fillStyle = rgbSTR(backgroundColor)
    }
    else {
        ctx.fillStyle = rgbSTR(strokeColor)
    }
}

function makeEdges(dots) {
    let edges = []
    for (let i = 0; i < dots.length -1; i++) {
        if (dots[i][1] < dots[i + 1][1]) {
            edges.push([dots[i], dots[i+1]])
        }
        else {edges.push([dots[i+1], dots[i]])}
    }
    if (dots[dots.length - 1] < dots[0][1]) {
        edges.push([dots[dots.length - 1], dots[0]])
    }
    else {edges.push([dots[0], dots[dots.length - 1]])}

    return edges
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

HEXtoRGB = function(hex, intensity) {
    hex = hex.split('')
    
    var r,g,b,h,s,v;
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];

    r = parseInt(r)
    g = parseInt(g)
    b = parseInt(b)
    
    return [r, g, b]
}
