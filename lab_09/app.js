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

let polygon = []
let lenP = 0
let cutter = []
let lenC = 0

const polyActive = document.querySelector('#polyActive')
const addP= document.querySelector('#addVertexP')
const closeP = document.querySelector('#closeP')
const addC = document.querySelector("#addVertexC")
const closeC = document.querySelector('#closeC')
const vertListP = document.querySelector("#vertlistP")
const vertListC = document.querySelector("#vertlistC")

const PxHolder = document.querySelector("#Px")
const PyHolder = document.querySelector("#Py")
const CxHolder = document.querySelector("#Cx")
const CyHolder = document.querySelector("#Cy")

document.querySelector('#clean').addEventListener('click', (e) => {
    ctx.clearRect(0, 0, width, height)
    polygon = []
    lenP = 0
    cutter = []
    lenC = 0
    addP.disabled = false;
    closeP.disabled = false;
    addC.disabled = false;
    closeC.disabled = false;

    vertListP.innerText = ''
    vertListC.innerText = ''
})

function addDot(len, array, color, list, x, y) {
    if (len == 0) {
        ctx.fillStyle = color
        ctx.fillRect(x, y, 1, 1)
    }
    else {
        drawLine(array[len - 1][0], array[len - 1][1], x, y, color)
    }
    array.push([x, y])
    len += 1
    list.innerText += ` (${x}, ${y});`
    return len
}

function close(len, array, addBut, closeBut, color) {
    if (len != 0) {
        drawLine(array[len - 1][0], array[len - 1][1], array[0][0], array[0][1], color)
        array.push([array[0][0], array[0][1]])
        addBut.disabled = true;
        closeBut.disabled = true;
    }
}

addP.addEventListener('click', (e) => {
    let x = convertToInt(PxHolder.value)
    let y = convertToInt(PyHolder.value)
    if (x && y) {
        lenP = addDot(lenP, polygon, RectColor, vertListP, x, y)
    }
})

addC.addEventListener('click', (e) => {
    let x = convertToInt(CxHolder.value)
    let y = convertToInt(CyHolder.value)
    if (x && y) {
        lenC = addDot(lenC, cutter, LineColor, vertListC, x, y)
    }
})

closeP.addEventListener('click', (e) => {
    close(lenP, polygon, addP, closeP, RectColor)
})

closeC.addEventListener('click', (e) => {
    close(lenC, cutter, addC, closeC, LineColor)
})

canvas.addEventListener('mousedown', (e) => {
    if (e.which === 1) {
        let x = e.offsetX
        let y = e.offsetY;
        if (polyActive.classList.length) {
            lenP = addDot(lenP, polygon, RectColor, vertListP, x, y)
        }
        else {
            lenC = addDot(lenC, cutter, LineColor, vertListC, x, y)
        }
    }
    else if (e.which === 3) {
        if (polyActive.classList.length) {
            close(lenP, polygon, addP, closeP, RectColor)
        }
        else {
            close(lenC, cutter, addC, closeC, LineColor)
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

function getCode(x, y) {
    let code = 0
    if (y > borders[3]) {code += 8}//top
    if (y < borders[1]) {code += 4}//bottom
    if (x > borders[2]) {code += 2}//right
    if (x < borders[0]) {code += 1}//left
    return code
}

function inOut(line) {
    const code1 = getCode(line[0], line[1])
    const code2 = getCode(line[2], line[3])
    if ((code1 == code2) && (code1 == 0)) {
        return 0 // inside
    }
    if ((code1 & code2) != 0) {
        return 2 //outside
    }
    return 1 //cut
}

function findCut(line) {
    let x1 = line[0]
    let y1 = line[1]
    let x2 = line[2]
    let y2 = line[3]

    const left = borders[0]
    const bottom = borders[1]
    const right = borders[2]
    const top = borders[3]

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