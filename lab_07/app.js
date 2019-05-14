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

const lineColor = document.querySelector('#lineColor')
const x1Holder = document.querySelector('#x1')
const y1Holder = document.querySelector('#y1')
const x2Holder = document.querySelector('#x2')
const y2Holder = document.querySelector('#y2')

const cutColor = document.querySelector('#cutColor')

document.querySelector('#clean').addEventListener('click', (e) => ctx.clearRect(0, 0, width, height))

document.querySelector('#drawRect').addEventListener('click', (e) => {
    ctx.strokeStyle = rectColor.value
    console.log(rectColor.value)
    let x = convertToInt(xHolder.value)
    let y = convertToInt(yHolder.value)
    let a = convertToInt(aHolder.value)
    let b = convertToInt(bHolder.value)
    if (x && y && a && b) {
        console.log(x, y, a, b)
        ctx.beginPath()
        ctx.rect(x, y, a, b)
        ctx.stroke()
        ctx.closePath()
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
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
        console.log(x1, y1, x2, y2)
    }
    else {
        alert('input error')
    }    
})

document.querySelector('#cut').addEventListener('click', (e) => {
    ctx.strokeStyle = cutColor.value
    console.log('cut')
})

function convertToInt(x) {
    if (isNaN(x) || x == '') {
        return NaN
    }
    else return parseInt(x)
}