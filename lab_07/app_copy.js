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

let borders = []

const lineColor = document.querySelector('#lineColor')
const x1Holder = document.querySelector('#x1')
const y1Holder = document.querySelector('#y1')
const x2Holder = document.querySelector('#x2')
const y2Holder = document.querySelector('#y2')
let lines = []

const cutColor = document.querySelector('#cutColor')

document.querySelector('#clean').addEventListener('click', (e) => {
    ctx.clearRect(0, 0, width, height)
    borders = [] //left, bottom, right, top
    lines = []
    rectBut.disabled = false
})

const rectBut = document.querySelector('#drawRect')
rectBut.addEventListener('click', (e) => {
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
        let left, right, bottom, top
        if (a > 0) {
            left = x
            right = x + a
        }
        else {
            left = x + a
            right = x
        }
        if (b > 0) {
            bottom = y
            top = y + b
        }
        else {
            bottom = y + b
            top = y
        }
        borders.push(left, right, bottom, top)
        rectBut.disabled = true
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
        const drawFlag = newCut(line)
        if (drawFlag) {
            ctx.beginPath()
            ctx.moveTo(line[0], line[1])
            ctx.lineTo(line[2], line[3])
            ctx.stroke()
            ctx.closePath()
        }
    })
})

function getCodeArr(x, y) {
    let code = [0, 0, 0, 0]
    //left, right, bottom, top
    if (x < borders[0]) {code[0] = 1}
    if (x > borders[1]) {code[1] = 1}
    if (y < borders[2]) {code[2] = 1}
    if (y > borders[3]) {code[3] = 1}
    return code
}

function inOut(code1, code2) {
    let mult = 0
    let flag = 0
    for (let i = 0; i < 4; i++) {
        if (code1[i] == code2[i] == 0) {
            flag = 0
        }
        if (code1[i] != code2[i]) {
            flag = 1
        }
        mult = mult || code1[i] * code2[i]
    }

    if (mult != 0) {
        flag = -1
    }
    return flag
}

function newCut(line) {
    let x1 = line[0]
    let y1 = line[1]
    let x2 = line[2]
    let y2 = line[3]
    
    let flag
    let m
    if (x1 == x2) {flag = -1} // vert
    else if (y1 == y2) {
        flag == 1
        m = 0
    } // hor
    else {
        flag = 0
        m = (y2 - y1)/(x2 - x1)
    }

    let code1 = getCodeArr(x1, y1)
    let code2 = getCodeArr(x2, y2)

    let draw = inOut(code1, code2)
    if (draw == -1) {
        return false
    }
    if (draw == 0) {
        return true
    }

    //left, right, bottom, top
    for (let i = 0; i < 4; i++) {
        let code1 = getCodeArr(x1, y1)
        let code2 = getCodeArr(x2, y2)
        if (i < 2) {
            if (code1[i] ^ code2[i] == 1) {
                if (code1[i] == 1) {
                    y1 = m * (borders[i] - x1) + y1
                    x1 = borders[i]
                }
                else {
                    y2 = m * (borders[i] - x2) + y2
                    x2 = borders[i]
                }
            }
        }
        else {
            if (code1[i] ^ code2[i] == 1) {
                if (code1[i] == 1) {
                    if (flag != -1){x1 = (borders[i] - y1) / m + x1}
                    y1 = borders[i]
                }
                else {
                    if (flag != -1){x2 = (borders[i] - y2) / m + x2}
                    y2 = borders[i]
                }
            }
        }
    }
    line[0] = x1
    line[1] = y1
    line[2] = x2
    line[3] = y2
    return true
}

function convertToInt(x) {
    if (isNaN(x) || x == '') {
        return NaN
    }
    else return parseInt(x)
}

function getCode(x, y) {
    let code = 0
    if (y > borders[3]) {code += 8}//top
    if (y < borders[1]) {code += 4}//bottom
    if (x > borders[2]) {code += 2}//right
    if (x < borders[0]) {code += 1}//left
    return code
}

// function inOut(line) {
//     const code1 = getCode(line[0], line[1])
//     const code2 = getCode(line[2], line[3])
//     if ((code1 == code2) && (code1 == 0)) {
//         return 0 // inside
//     }
//     if ((code1 & code2) != 0) {
//         return 2 //outside
//     }
//     return 1 //cut
// }

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

    let flag
    if (x1 == x2) {flag = 1}
    else if (y1 == y2) {flag == -1}
    else {flag = 0}

    const left = borders[0]
    const bottom = borders[1]
    const right = borders[2]
    const top = borders[3]

    let code1 = getCode(x1, y1)
    let code2 = getCode(x2, y2)

    for (let i = 0; i < 4; i++) {
        if (code1[i] == 1) {

        }
        if (code2[i] == 1) {

        }
    }

    if (x1 == x2) {//vertical
        if (y1 > top) {y1 = top}
        else if (y1 < bottom) {y1 = bottom}

        if (y2 > top) {y2 = top}
        else if (y2 < bottom) {y2 = bottom}
    }

    else if (y1 == y2) {//horizontal
        if (x1 < left) {x1 = left}
        else if (x1 > right) {x1 = right}

        if (x2 < left) {x2 = left}
        else if (x2 > right) {x2 = right}
    }

    else {
        const mb = culcLine(x1, y1, x2, y2)
        const m = mb[0]
        const b = mb[1]

        if (y1 > top) {
            x1 = (top - b ) / m
            y1 = top
        }
        else if (y1 < bottom) {
            x1 = (bottom - b) / m
            y1 = bottom
        }
        if (x1 > right) {
            y1 = m * right + b
            x1 = right
        }
        else if (x1 < left) {
            y1 = m * left + b
            x1 = left
        }

        if (y2 > top) {
            x2 = (top - b ) / m
            y2 = top
        }
        else if (y2 < bottom) {
            x2 = (bottom - b) / m
            y2 = bottom
        }
        if (x2 > right) {
            y2 = m * right + b
            x2 = right
        }
        else if (x2 < left) {
            y2 = m * left + b
            x2 = left
        }
    }

    line[0] = x1
    line[1] = y1
    line[2] = x2
    line[3] = y2
}