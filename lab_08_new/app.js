$('body').on('contextmenu', 'canvas', function(e){ return false; });

const colorPickRect = document.querySelector('#rectColor')
let RectColor = colorPickRect.value
const wrapperRect = document.querySelector('#color-wrapper-rect')
colorPickRect.onchange = function() {
    wrapperRect.style.backgroundColor = colorPickRect.value
    RectColor = colorPickRect.value
}
wrapperRect.style.backgroundColor = colorPickRect.value

const colorPickLine = document.querySelector('#lineColor')
let LineColor = colorPickLine.value
const wrapperLine = document.querySelector('#color-wrapper-line')
colorPickLine.onchange = function() {
    wrapperLine.style.backgroundColor = colorPickLine.value
    LineColor = colorPickLine.value
}
wrapperLine.style.backgroundColor = colorPickLine.value

const colorPickcut = document.querySelector('#cutColor')
let CutColor = colorPickcut.value
const wrappercut = document.querySelector('#color-wrapper-cut')
colorPickcut.onchange = function() {
    wrappercut.style.backgroundColor = colorPickcut.value
    CutColor = colorPickcut.value
}
wrappercut.style.backgroundColor = colorPickcut.value

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height

let lines = []
let line = []
let polygon = []

let drawLineAction = false
let drawPoly = false
let vertCount = 0

const polyActive = document.querySelector('#polyActive')
const addVertex = document.querySelector('#addVertex')
const closePoly = document.querySelector('#closePoly')
const addLine = document.querySelector("#addLine")
const vertList = document.querySelector("#vertlist")

const RxHolder = document.querySelector("#Rx")
const RyHolder = document.querySelector("#Ry")
const x1Holder = document.querySelector("#Lx1")
const y1Holder = document.querySelector("#Ly1")
const x2Holder = document.querySelector("#Lx2")
const y2Holder = document.querySelector("#Ly2")

document.querySelector('#clean').addEventListener('click', (e) => {
    ctx.clearRect(0, 0, width, height)
    lines = []
    polygon = []
    vertCount = 0
    addVertex.disabled = false;
    closePoly.disabled = false;
    vertList.innerText = ''
})

addVertex.addEventListener('click', (e) => {
    let x = convertToInt(RxHolder.value)
    let y = convertToInt(RyHolder.value)
    if (x && y) {
        if (vertCount == 0) {
            ctx.fillStyle = RectColor
            ctx.fillRect(x, y, 1, 1)
        }
        else {
            drawLine(polygon[vertCount - 1][0], polygon[vertCount - 1][1], x, y, RectColor)
        }
        polygon.push([x, y])
        vertCount += 1
        vertList.innerText += ` (${x}, ${y});`
    }
})

addLine.addEventListener('click', (e) => {
    let x1 = convertToInt(x1Holder.value)
    let y1 = convertToInt(y1Holder.value)
    let x2 = convertToInt(x2Holder.value)
    let y2 = convertToInt(y2Holder.value)

    if (x1 && y1 && x2 && y2) {
        if (line.length == 0) {
            lines.push([x1, y1, x2, y2])
            drawLine(x1, y1, x2, y2, LineColor)
        }
    }
})

closePoly.addEventListener('click', (e) => {
    if (vertCount != 0) {
        drawLine(polygon[vertCount - 1][0], polygon[vertCount - 1][1], polygon[0][0], polygon[0][1], RectColor)
        drawPoly = false;
        addVertex.disabled = true;
        closePoly.disabled = true;
    }
})

canvas.addEventListener('mousedown', (e) => {
    if (e.which === 1) {
        let x = e.offsetX
        let y = e.offsetY;
        if (polyActive.classList.length) {
            if (vertCount == 0) {
                ctx.fillStyle = RectColor
                ctx.fillRect(x, y, 1, 1)
            }
            else {
                drawLine(polygon[vertCount - 1][0], polygon[vertCount - 1][1], x, y, RectColor)
            }
            polygon.push([x, y])
            vertCount += 1
            vertList.innerText += ` (${x}, ${y});`
        }
        else {
            if (line.length == 0) {
                line.push(x, y)
                ctx.fillStyle = LineColor
                ctx.fillRect(x, y, 1, 1)
            }
            else {
                line.push(x, y)
                drawLine(line[0], line[1], line[2], line[3], LineColor)
                lines.push(line.slice())
                line = []
            }
        }
    }
    if (e.which === 3) {
        if (vertCount != 0) {
            drawLine(polygon[vertCount - 1][0], polygon[vertCount - 1][1], polygon[0][0], polygon[0][1], RectColor)
            addVertex.disabled = true;
            closePoly.disabled = true;
        }
    }
});

function drawLine(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
}

function scalProVect(v1, v2) {
    let res = v1[0]*v2[0] + v1[1]*v2[1]
    return res
}

function normal(vectEdge, obhod) {
    let res
    if (obhod == 1) {
        res = [vectEdge[1], -vectEdge[0]]
    }
    else {
        res = [-vectEdge[1], vectEdge[0]]
    }
    return res
    
}

function P(line, t) {
    let x = line[0] + (line[2] - line[0]) * t
    let y = line[1] + (line[3] - line[1]) * t
    return [x, y]
}

function cutLine(line, obhod) {
    const polyLen = polygon.length
    let tn = 0
    let tv = 1
    let D = getVector([line[0], line[1]], [line[2], line[3]])
    
    for (let j = 0; j < polyLen - 1; j++) {
        let vEdge = getVector(polygon[j], polygon[j+1])
        let n = normal(vEdge, obhod)
        let w = getVector(polygon[j], [line[0], line[1]])

        let Ds = scalProVect(n, D)
        let Ws = scalProVect(w, n)

        if (Ds == 0) { // параллельный или вырожденный
            if (Ws >= 0) {
                continue // видимый
            }
            else {
                return // невидимый
            }
        }
        let t = - Ws / Ds // пересечение
        if (Ds > 0) { // направлен внутрь (P2 - внутри)
            if (t > 1) {
                return // невидимый
            }
            else {
                tn = tn > t ? tn : t // переносим P1 (если она вне области)
            }
        }
        else { // направлен наружу (Р1 - внутри)
            if (t < 0) {
                return // невидимый
            }
            else {
                tv = tv < t ? tv : t // перенесем P2 (если она вне области)
            }
        }
    }

    let vEdge = getVector(polygon[polyLen - 1], polygon[0])
    let n = normal(vEdge, obhod)
    let w = getVector(polygon[polyLen - 1], [line[0], line[1]])

    let Ds = scalProVect(n, D)
    let Ws = scalProVect(w, n)

    if (Ds == 0) { // параллельный или вырожденный
        if (Ws < 0) {
           return // невидимый
        }
    }
    else {
        let t = - Ws / Ds // пересечение
        if (Ds > 0) { // направлен внутрь (P2 - внутри)
            if (t > 1) {
                return // невидимый
            }
            else {
                tn = tn > t ? tn : t // переносим P1 (если она вне области)
            }
        }
        else { // направлен наружу (Р1 - внутри)
            if (t < 0) {
                return // невидимый
            }
            else {
                tv = tv < t ? tv : t // перенесем P2 (если она вне области)
            }
        }
    }

    if (tn <= tv) {
        let dot1 = P(line, tn)
        let dot2 = P(line, tv)
        drawLine(dot1[0], dot1[1], dot2[0], dot2[1], CutColor)
    }       
}

document.querySelector('#cut').addEventListener('click', (e) => {
    const linesLen = lines.length 
    let obhod = convex(polygon)
    if (obhod != 0 && linesLen != 0) {
        for (let i = 0; i < linesLen; i++) {
            let line = lines[i]
            cutLine(line, obhod)
        }
    }
})

function getVector(dot1, dot2) {
    let res = [dot2[0]-dot1[0], dot2[1]-dot1[1]]
    return res
}

function getSign(vector1, vector2) {
    return Math.sign(vector1[0]*vector2[1] - vector1[1]*vector2[0])
    //z = ax*by - ay*bx
}

function convex(polygon) {
    const length = polygon.length
    let v1 = getVector(polygon[0], polygon[1])
    let v2 = getVector(polygon[length - 1], polygon[0])
    let sign = getSign(v1, v2)
    let tmpSign;
    for (let i = 1; i < length - 1; i++) {
        v1 = getVector(polygon[i], polygon[i+1])
        v2 = getVector(polygon[i-1], polygon[i])
        tmpSign = getSign(v1, v2)
        if (tmpSign * sign == -1) {
            return 0
        }
    }
    return sign
}

function convertToInt(x) {
    if (isNaN(x) || x == '') {
        return NaN
    }
    else return parseInt(x)
}

