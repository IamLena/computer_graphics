let pencilAction = false
let lineAction = true
let fillAction = false
let speed = 15
let backgroundColor = [255, 255, 255]
let strokeColor = [0, 0,0]
let mouseDown = false
let first
let last
let edges = []
let dots = []

const slider = document.getElementById("myRange");
let output = document.getElementById("demo");
output.innerHTML = `${slider.value} мс`;

slider.oninput = function() {
  output.innerHTML = `${this.value} мс`;
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
    first = undefined
    last = undefined
    dots = []
    edges = []
    ctx.fillStyle = rgbSTR(backgroundColor)
    ctx.fillRect(0, 0, width, height)
})

$('input[type="radio"]').on('change', function(e) {
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
    const colorRGB = HEXtoRGB(e.target.value)
    strokeColor = colorRGB

    const color = rgbSTR(colorRGB)
    ctx.strokeStyle = color
});
$('input[id="bgcolor"]').on('change', function(e) {
    const colorRGB = HEXtoRGB(e.target.value)
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
            if (first === undefined) {
                first = [x, y]
                ctx.fillRect(x, y, 1, 1)
                last = [x, y]
            }
            else {
                ctx.beginPath()
                ctx.moveTo(last[0], last[1])
                ctx.lineTo(x, y)
                ctx.stroke()
                if (last[1] > y) {
                    edges.push([[x, y], [last[0], last[1]]])
                }
                else {
                    edges.push([[last[0], last[1]], [x, y]])
                }
                last = [x, y]
            }
            dots.push([x, y])
        }
        if (pencilAction) {
            mouseDown = true
        }
        if (fillAction) {
            fillAreaEdges(edges, backgroundColor, strokeColor)
        }
    }
    if (e.which === 3) {
        if (first) {
            ctx.beginPath()
            ctx.moveTo(last[0], last[1])
            ctx.lineTo(first[0], first[1])
            if (last[1] > first[1]) {
                edges.push([[first[0], first[1]], [last[0], last[1]]])
            }
            else {
                edges.push([[last[0], last[1]], [first[0], first[1]]])
            }
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
            // dots = []
            first = [x, y]
            ctx.fillRect(x, y, 1, 1)
            last = [x, y]
        }
        else {
            ctx.beginPath()
            ctx.moveTo(last[0], last[1])
            ctx.lineTo(x, y)
            ctx.stroke()
            if (last[1] > y) {
                edges.push([[x, y], [last[0], last[1]]])
            }
            else {
                edges.push([[last[0], last[1]], [x, y]])
            }
            last = [x, y]
        }
        dots.push([x, y])
    }
});
document.addEventListener('mouseup', (e) => {
    mouseDown = false
});

async function fillAreaEdges (edges, backgroundColor, strokeColor) {
    for (let i = 0; i < edges.length; i++) {
        await fillEdge(edges[i], backgroundColor, strokeColor)
    }
}

async function fillEdge(edge, backgroundColor, strokeColor) {
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
            const m = (edge[1][1] - edge[0][1]) / (edge[1][0] - edge[0][0])
            dx = 1 / m
        }

        while (y != yend) {
            fillLineReverse(x, width, y, backgroundColor, strokeColor)
            x += dx
            y += 1
            await sleep(speed)
        }
    }
}

function fillLineReverse(x1, x2, y, backgroundColor, strokeColor) {
    for (let x = x1 + 1; x < x2; x++) {
        reverseColor(Math.round(x), Math.round(y), backgroundColor, strokeColor)
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
    }
}

function reverseColor(x, y, backgroundColor, strokeColor) {
    const curColor = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data

    if (curColor[0] === strokeColor[0] && curColor[1] === strokeColor[1] && curColor[2] === strokeColor[2]) {
        ctx.fillStyle = rgbSTR(backgroundColor)
    }
    else if (curColor[0] === backgroundColor[0] && curColor[1] === backgroundColor[1] && curColor[2] === backgroundColor[2]){
        ctx.fillStyle = rgbSTR(strokeColor)
    }
    else {
        ctx.fillStyle = rgbSTR(curColor)
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
