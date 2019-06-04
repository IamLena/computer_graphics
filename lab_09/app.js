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
const lineActive = document.querySelector('#lineActive')
const addP= document.querySelector('#addVertexP')
const closeP = document.querySelector('#closeP')
const addC = document.querySelector("#addVertexC")
const closeC = document.querySelector('#closeC')
const vertListP = document.querySelector("#vertlistP")
const vertListC = document.querySelector("#vertlistC")
const vertListR = document.querySelector("#vertlistR")

let canPoly = true
let canLine = true

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
    vertListR.innerText = ''

    canPoly = true
    canLine = true
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
    canPoly = false
})

closeC.addEventListener('click', (e) => {
    close(lenC, cutter, addC, closeC, LineColor)
    canLine = false
})

canvas.addEventListener('mousedown', (e) => {
    if (e.which === 1) {
        let x = e.offsetX
        let y = e.offsetY;
        if (polyActive.classList.length && canPoly) {
            lenP = addDot(lenP, polygon, RectColor, vertListP, x, y)
        }
        else if (lineActive.classList.length && canLine){
            lenC = addDot(lenC, cutter, LineColor, vertListC, x, y)
        }
    }
    else if (e.which === 3) {
        if (polyActive.classList.length && canPoly) {
            close(lenP, polygon, addP, closeP, RectColor)
            canPoly = false
        }
        else if (lineActive.classList.length && canLine){
            close(lenC, cutter, addC, closeC, LineColor)
            canLine = false
        }
    }
});

document.querySelector('#cut').addEventListener('click', (e) => {
    let result = cutPolygon(polygon, cutter)
    if (result == undefined) {return;}
    for (let i =0; i < result.length - 1; i++) {
        vertListR.innerText += ` (${result[i][0]}, ${result[i][1]});`
    }
    let len = result.length
    for (let i = 0; i < len - 1; i++) {
        drawLine(result[i][0], result[i][1], result[i + 1][0], result[i+1][1], CutColor)
    }
})

function cutPolygon(polygon, cutter) {
    let lenP = polygon.length
    let lenC = cutter.length

    if (lenP > 3 && lenC > 3) {
        let obhod = convex(cutter);
        if (obhod == 0) {return;}
        for (let i = 0; i < lenC - 1; i++) {//for cutter edges
            lenP = polygon.length
            let cEdge = getVector(cutter[i], cutter[i + 1])
            let n = normal(cEdge, obhod)
            let cutResult = []
            for (let j = 0; j < lenP - 1; j++) {//for polygon edges
                let tn = 0
                let tv = 1
                let pLine = getVector(polygon[j], polygon[j + 1])
                let w = getVector(cutter[i], polygon[j])

                let Ds = scalProVect(n, pLine)             
                let Ws = scalProVect(w, n)

                if (Ds == 0) { // параллельный или вырожденный
                    if (Ws >= 0) {
                        cutResult.push(polygon[j+1]) // видимый
                    }
                    else {
                        continue // невидимый
                    }
                }
                let t = - Ws / Ds // пересечение
                if (Ds > 0) { // направлен внутрь (P2 - внутри)
                    if (t > 1) {
                        continue // невидимый
                    }
                    else {
                        if (t > 0 && t < 1) {
                            let dot1 = P(polygon[j], polygon[j+1], t)
                            cutResult.push(dot1)
                        }
                        let dot2 = P(polygon[j], polygon[j+1], tv)
                        cutResult.push(dot2)
                    }
                }
                else { // направлен наружу (Р1 - внутри)
                    if (t < 0) {
                        continue // невидимый
                    }
                    else {
                        tv = tv < t ? tv : t // перенесем P2 (если она вне области)
                        if (tn <= tv) {
                            let dot2 = P(polygon[j], polygon[j+1], tv)
                            cutResult.push(dot2)
                        }
                    }
                }
            }
            cutResult.push(cutResult[0])
            // let len = cutResult.length
            // for (let i = 0; i < len - 1; i++) {
            //     drawLine(cutResult[i][0], cutResult[i][1], cutResult[i + 1][0], cutResult[i+1][1], '#f442f4')
            // }
            polygon = cutResult
        }
    }
    return polygon
}

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

function P(dot1, dot2, t) {
    //x1, y1, x2, y2
    let x = dot1[0] + (dot2[0] - dot1[0]) * t
    let y = dot1[1] + (dot2[1] - dot1[1]) * t
    x = Math.round(x)
    y = Math.round(y)
    return [x, y]
}

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
    let tmpSign, sign
    let v1 = getVector(polygon[0], polygon[1])
    let v2 = getVector(polygon[length - 2], polygon[0])
    sign = getSign(v1, v2)
    for (let i = 1; i < length - 2; i++) {
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