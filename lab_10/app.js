//z - x^2/ 4 - y^2/ 9 = 0
const a = 2
const b = 3

const xn = -30
const xk = 30
const xstep = 1
const yn = -30
const yk = 30
const ystep = 1
const zn = -30
const zk = 30
const zstep = -5

let High = []
let Low = []


const ctx = document.querySelector('canvas').getContext('2d')

function F(x, y) {
    return x^2 / a^2 + y^2 / b^2
}
function f(x, z) {
    return x^2 - z^2
}

function draw(arr) {
    const koef = 5
    const widthHalf = 250
    const heightHalf = 250
    ctx.beginPath()
    ctx.moveTo(widthHalf + koef * xn, heightHalf - koef * arr[0])
    let i = 1
    for (let x = xn; x < xk; x += xstep) {
        ctx.lineTo(widthHalf + koef * x, heightHalf - koef * arr[i])
        ctx.stroke()
        i ++;
    }
    ctx.closePath()
}

for (x = xn; x < xk; x += xstep) {
    y = f(x, zk)
    High.push(y)
    Low.push(y)
}

for (let z = zk; z > zn; z += zstep) {
    let prev = [xn, f(xn, z)]
    i = 0
    for (let x = xn; x < xk; x += xstep) {
        y = f(x, z)
        if (High[i] <= y) {
            High[i] = y
        }
        else if (Low[i] >= y) {
            Low[i] = y
        }
        prev = [x, y]
        i ++
    }
    draw(High)
    draw(Low)
}