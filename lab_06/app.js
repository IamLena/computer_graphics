let pencilAction = false
let lineAction = true
let fillAction = false
let speed = 15

let backgroundColor = [255, 255, 255]
let strokeColor = [0, 0,0]

let mouseDown = false

let first, last

let stack = []

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
    first = undefined
    last = undefined
    ctx.fillStyle = rgbSTR(backgroundColor)
    ctx.fillRect(0, 0, width, height)
})

$('input[type="radio"]').on('change', function(e) {
    const action = e.target.id
    if (action === 'pencil') {
        pencilAction = true
        lineAction = false
        fillAction = false
        first = undefined
        last = undefined
    }
    else if (action === 'line') {
        pencilAction = false
        lineAction = true
        fillAction = false
        first = undefined
        last = undefined
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
    strokeColor = colorRGB
});
$('input[id="bgcolor"]').on('change', function(e) {
    const colorRGB = HEXtoRGB(e.target.value)
    color = rgbSTR(colorRGB)
    backgroundColor = colorRGB
});

function rgbSTR(colorRGB) {
    return "rgb(" + colorRGB[0] + "," + colorRGB[1] + "," + colorRGB[2] + ")"
}

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
                ctx.beginPath()
                ctx.moveTo(last[0], last[1])
                ctx.lineTo(x, y)
                ctx.stroke()
                last = [x, y]
            }
        }
        if (pencilAction) {
            mouseDown = true
        }
        if (fillAction) {
            fillArea([x, y])
        }
    }
    if (e.which === 3) {
        if (first != undefined) {
            ctx.beginPath()
            ctx.moveTo(last[0], last[1])
            ctx.lineTo(first[0], first[1])
            ctx.stroke()
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
            ctx.beginPath()
            ctx.moveTo(last[0], last[1])
            ctx.lineTo(x, y)
            ctx.stroke()
            last = [x, y]
        }
    }
});
document.addEventListener('mouseup', (e) => {
    mouseDown = false
});

async function fillArea (pixel) {
    stack.push(pixel)
    while (stack.length != 0) {
        let zatr = stack.pop()
        let x = zatr[0]
        let y = zatr[1]
        ctx.fillStyle = rgbSTR(strokeColor)
        let border = fillLine(x, y)
        await sleep(speed)
        findZart(border, y + 1, stack)
        findZart(border, y - 1, stack)
    }
}

function notFilled(x, y, bgColor) {
    const curColor = ctx.getImageData(x, y, 1, 1).data
    return (curColor[0] == bgColor[0] && curColor[1] == bgColor[1] && curColor[2] == bgColor[2])
}

function fillLine(x, y) {
    let border = []
    let xz = x
    while (notFilled(x, y, backgroundColor)) {
        ctx.fillRect(x, y, 1, 1)
        x --
    }
    border.push(x + 1)
    x = xz + 1
    while (notFilled(x, y, backgroundColor)) {
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
        if (notFilled(xn, y, backgroundColor) && !notFilled(xn + 1, y, backgroundColor)) {
            stack.push([xn, y])
        }
        xn ++
    }
    if (!stack.includes([xe, y]) && notFilled(xe, y, backgroundColor))
    {
        stack.push([xe, y])
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
