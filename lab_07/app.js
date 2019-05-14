const colorPickRect = document.querySelector('#rectColor')
const wrapperRect = document.querySelector('#color-wrapper-rect')
colorPickRect.onchange = function() {
    wrapperRect.style.backgroundColor = colorPickRect.value
    RectColor = colorPickRect.value
}
wrapperRect.style.backgroundColor = colorPickRect.value

const colorPickLine = document.querySelector('#lineColor')
const wrapperLine = document.querySelector('#color-wrapper-line')
colorPickLine.onchange = function() {
    wrapperLine.style.backgroundColor = colorPickLine.value
    LineColor = colorPickLine.value
}
wrapperLine.style.backgroundColor = colorPickLine.value

const colorPickcut = document.querySelector('#cutColor')
const wrappercut = document.querySelector('#color-wrapper-cut')
colorPickcut.onchange = function() {
    wrappercut.style.backgroundColor = colorPickcut.value
    cutColor = colorPickcut.value
}
wrappercut.style.backgroundColor = colorPickcut.value

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

const rectColor = document.querySelector('#rectColor')
const xHolder = document.querySelector('#x')
const yHolder = document.querySelector('#y')
const aHolder = document.querySelector('#a')
const bHolder = document.querySelector('#b')

let rectangle = []

const lineColor = document.querySelector('#lineColor')
const x1Holder = document.querySelector('#x1')
const y1Holder = document.querySelector('#y1')
const x2Holder = document.querySelector('#x2')
const y2Holder = document.querySelector('#y2')
let lines = []


const cutColor = document.querySelector('#cutColor')

document.querySelector('#clean').addEventListener('click', (e) => {
    ctx.clearRect(0, 0, width, height)
    rectangle = []
    lines = []
})

document.querySelector('#drawRect').addEventListener('click', (e) => {
    ctx.strokeStyle = rectColor.value
    let x = convertToInt(xHolder.value)
    let y = convertToInt(yHolder.value)
    let a = convertToInt(aHolder.value)
    let b = convertToInt(bHolder.value)
    if (x && y && a && b) {
        ctx.beginPath()
        ctx.rect(x, y, a, b)
        ctx.stroke()
        ctx.closePath()
        rectangle.push(x, y, a, b)
        console.log(rectangle)
    }
    else {
        alert('input error')
    }
})

document.querySelector('#drawLine').addEventListener('click', (e) => {
    ctx.strokeStyle = lineColor.value
    let x1 = convertToInt(x1Holder.value)
    let y1 = convertToInt(y1Holder.value)
    let x2 = convertToInt(x2Holder.value)
    let y2 = convertToInt(y2Holder.value)
    if (x1 && y1 && x2 && y2) {
        lines.push([x1, y1, x2, y2])
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
    }
    else {
        alert('input error')
    }    
})

document.querySelector('#cut').addEventListener('click', (e) => {
    ctx.strokeStyle = cutColor.value
    lines.forEach((line) => {
        const lineCode = inOut(line)
        if (lineCode == 0) {//inside
            ctx.beginPath()
            ctx.moveTo(line[0], line[1])
            ctx.lineTo(line[2], line[3])
            ctx.stroke()
            ctx.closePath()
        }
        else if (lineCode == 1) {//cut
            console.log('culc cut')
            findCut(line)
            ctx.beginPath()
            ctx.moveTo(line[0], line[1])
            ctx.lineTo(line[2], line[3])
            ctx.stroke()
            ctx.closePath()
        }
        else {
            console.log('out')//outside
        }
    })
})

function convertToInt(x) {
    if (isNaN(x) || x == '') {
        return NaN
    }
    else return parseInt(x)
}

function getCode(x, y, left, right, top, bottom) {
    let code = 0
    if (y > top) {code += 8}
    if (y < bottom) {code += 4}
    if (x > right) {code += 2}
    if (x < left) {code += 1}
    return code
}

function inOut(line) {
    const x1 = line[0]
    const y1 = line[1]
    const x2 = line[2]
    const y2 = line[3]

    const left = rectangle[0]
    const bottom = rectangle[1]
    const right = left + rectangle[2]
    const top = bottom + rectangle[3]

    let code1 = getCode(x1, y1, left, right, top, bottom)
    let code2 = getCode(x2, y2, left, right, top, bottom)

    console.log(code1, code2)

    if ((code1 == code2) && (code1 == 0)) {
        return 0 // inside
    }
    if ((code1 & code2) != 0) {
        return 2 //outside
    }
    return 1 //cut
}

function culcLine(x1, y1, x2, y2) {
    const m = (y1 - y2) / (x1 - x2)
    const b = y1 - m * x1
    return [m, b]
}

function findCut(line) {
    let x1 = line[0]
    let y1 = line[1]
    let x2 = line[2]
    let y2 = line[3]
    const mb = culcLine(x1, y1, x2, y2)
    const m = mb[0]
    const b = mb[1]

    const left = rectangle[0]
    const bottom = rectangle[1]
    const right = left + rectangle[2]
    const top = bottom + rectangle[3]

    let code = getCode(x1, y1, left, right, top, bottom)
    if ((code & 8) === 8) {
        x1 = (top - b ) / m
        y1 = top
    }
    if ((code & 4) === 4) {
        x1 = (bottom - b) / m
        y1 = bottom
    }
    if ((code & 2) === 2) {
        y1 = m * right + b
        x1 = right
    }
    if ((code & 1) === 1) {
        y1 = m * left + b
        x1 = left
    }

    code = getCode(x2, y2, left, right, top, bottom)
    if ((code & 8) === 8) {
        x2 = (top - b ) / m
        y2 = top
    }
    if ((code & 4) === 4) {
        x2 = (bottom - b) / m
        y2 = bottom
    }
    if ((code & 2) === 2) {
        y2 = m * right + b
        x2 = right
    }
    if ((code & 1) === 1) {
        y2 = m * left + b
        x2 = left
    }

    line[0] = x1
    line[1] = y1
    line[2] = x2
    line[3] = y2
}