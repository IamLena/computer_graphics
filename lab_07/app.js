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

document.querySelector('#clean').addEventListener('click', (e) => ctx.clearRect(0, 0, width, height))

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
        if (lineCode == 0) {
            ctx.beginPath()
            ctx.moveTo(line[0], line[1])
            ctx.lineTo(line[2], line[3])
            ctx.stroke()
            ctx.closePath()
        }
        else if (lineCode == 1) {
            console.log('culc cut')
        }
    })
})

function convertToInt(x) {
    if (isNaN(x) || x == '') {
        return NaN
    }
    else return parseInt(x)
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

    let code1 = 0
    if (y1 > top) {code1 += 8}
    if (y1 < bottom) {code1 += 4}
    if (x1 > right) {code1 += 2}
    if (x1 < left) {code1 += 1}

    let code2 = 0
    if (y2 > top) {code2 += 8}
    if (y2 < bottom) {code2 += 4}
    if (x2 > right) {code2 += 2}
    if (x2 < left) {code2 += 1}

    if (code1 == code2 && code1 == 0) {
        return 0
    }
    if (code1 & code2 != 0) {
        return 1
    }
    return 2
}