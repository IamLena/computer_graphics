let pencilAction = false
let lineAction = true
let fillAction = false
let speed = 15

let backgroundColor = '#ffffff'
let borderColor = '#000000'
let fillColor = '#000000'

let mouseDown = false

let first, last
let stack = []

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

const colorPickBorder = document.querySelector('#colorBorder')
const wrapperBorder = document.querySelector('#color-wrapper-border')
colorPickBorder.onchange = function() {
    wrapperBorder.style.backgroundColor = colorPickBorder.value
    borderColor = colorPickBorder.value
}
wrapperBorder.style.backgroundColor = colorPickBorder.value

const colorPickFill = document.querySelector('#colorFill')
const wrapperFill = document.querySelector('#color-wrapper-fill')
colorPickFill.onchange = function() {
    wrapperFill.style.backgroundColor = colorPickFill.value
    fillColor = colorPickFill.value
}
wrapperFill.style.backgroundColor = colorPickFill.value

const colorPickBg = document.querySelector('#colorBg')
const wrapperBG = document.querySelector('#color-wrapper-bg')
colorPickBg.onchange = function() {
    wrapperBG.style.backgroundColor = colorPickBg.value
    canvas.style.backgroundColor = colorPickBg.value
}
wrapperBG.style.backgroundColor = colorPickBg.value

document.querySelector('#clean').addEventListener('click', (e) => {
    first = undefined
    last = undefined
    ctx.clearRect(0, 0, width, height)
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

canvas.addEventListener('mousedown', (e) => {
    if (e.which === 1) {
        let x = e.offsetX
        let y = e.offsetY;
        if (lineAction) {
            if (first === undefined) {
                ctx.fillRect(x, y, 1, 1)
                first = [x, y]
                last = [x, y]
            }
            else {
                drawLine(last[0], last[1], x, y, borderColor)
                last = [x, y]
            }
        }
        if (pencilAction) {
            mouseDown = true
        }
        if (fillAction) {
            fillArea([x, y], fillColor, borderColor)
        }
    }
    if (e.which === 3) {
        if (first != undefined) {
            drawLine(last[0], last[1], first[0], first[1], borderColor)
            first = undefined
            last = undefined
        }
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (mouseDown && pencilAction) {
        let x = e.offsetX
        let y = e.offsetY;
        if (first === undefined) {
            ctx.fillRect(x, y, 1, 1)
            first = [x, y]
            last = [x, y]
        }
        else {
            drawLine(last[0], last[1], x, y, borderColor)
            last = [x, y]
        }
    }
});
document.addEventListener('mouseup', (e) => {
    mouseDown = false
});

async function fillArea (pixel, fillColor, borderColor) {
    stack.push(pixel)
    while (stack.length != 0) {
        let zatr = stack.pop()
        let x = zatr[0]
        let y = zatr[1]
        let border = fillLine(x, y, fillColor, borderColor)
        await sleep(speed)
        findZart(border, y + 1, stack)
        findZart(border, y - 1, stack)
    }
}

function notFilled(x, y, fillColor, borderColor) {
    const curColor = ctx.getImageData(x, y, 1, 1).data
    console.log(curColor)
    const empty = curColor[0] == 0 && curColor[1] == 0 && curColor[2] == 0 && curColor[3] == 0
    if (empty) return empty
    const filled = curColor[0] == fillColor[0] && curColor[1] == fillColor[1] && curColor[2] == fillColor[2]
    const border = curColor[0] == borderColor[0] && curColor[1] == borderColor[1] && curColor[2] == borderColor[2]
    return !filled && !border
}

function fillLine(x, y, fillColor, borderColor) {
    ctx.fillStyle = fillColor
    let border = []
    let xz = x
    fillColorrgb = HEXtoRGB(fillColor)
    borderColorrgb = HEXtoRGB(borderColor)
    while (notFilled(x, y, fillColorrgb, borderColorrgb)) {
        ctx.fillRect(x, y, 1, 1)
        x --
    }
    border.push(x + 1)
    x = xz + 1
    while (notFilled(x, y, fillColorrgb, borderColorrgb)) {
        ctx.fillRect(x, y, 1, 1)
        x ++
    }
    border.push(x - 1)
    return border
}

function findZart(border, y, stack) {
    let xn = border[0]
    const xe = border[1]
    while (xn <= xe) {
        if (notFilled(xn, y, fillColorrgb, borderColorrgb) && !notFilled(xn + 1, y, fillColorrgb, borderColorrgb)) {
            stack.push([xn, y])
        }
        xn ++
    }
    if (!stack.includes([xe, y]) && notFilled(xe, y, fillColorrgb, borderColorrgb))
    {
        stack.push([xe, y])
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

HEXtoRGB = function(hex) {
    hex = hex.split('')
    
    var r,g,b
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];

    r = parseInt(r)
    g = parseInt(g)
    b = parseInt(b)
    
    console.log(hex, r, g, b)
    return [r, g, b]
}

function drawLine(xn, yn, xk, yk, color) {
    ctx.fillStyle = color
    let dx = (xk - xn)
    let dy = (yk - yn)
    const length = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)

    const sx = dx / length
    const sy = dy /length

    let x = xn
    let y = yn
    let m = dy / dx
    for (let i = 0; i <= length; i += 1) {
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
        x += sx
        y += sy
    }
}

$('body').on('contextmenu', 'canvas', function(e){ return false; });