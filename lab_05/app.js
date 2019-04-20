let pencilAction = true
let lineAction = false
let fillAction = false
let speed = 15
let mouseDown = false
let firstdot
let dot = [0, 0]

const slider = document.getElementById("myRange");
let output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
  speed = this.value
}

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height
ctx.strokeStyle = 'black'
ctx.fillStyle = 'black'


document.querySelector('#clean').addEventListener('click', (e) => {
    ctx.clearRect(0, 0, width, height)
})

$('input[type="radio"]').on('click change', function(e) {
    console.log(e.target.id);
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

$('input[type="color"]').on('change', function(e) {
    const color = e.target.value;
    ctx.strokeStyle = color
    ctx.fillStyle = color
});

console.log(canvas.offsetLeft)

canvas.addEventListener('mousedown', (e) => {
    if (e.which === 1) {
        if (lineAction) {
            let x = e.offsetX
            let y = e.offsetY;
            if (firstdot == undefined) {
                firstdot = [x, y]
                ctx.fillRect(x, y, 1, 1)
                dot = [x, y]
            }
            ctx.beginPath()
            ctx.moveTo(dot[0], dot[1])
            ctx.lineTo(x, y)
            ctx.stroke()
            dot = [x, y]
            console.log(x)
            console.log(y)
        }
        if (pencilAction) {
            mouseDown = true
        }
    }
    if (e.which === 3) {
        console.log('close')
        ctx.beginPath()
        ctx.moveTo(dot[0], dot[1])
        ctx.lineTo(firstdot[0], firstdot[1])
        ctx.stroke()
        firstdot = undefined
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (mouseDown && pencilAction) {
        let x = e.offsetX
            let y = e.offsetY;
            if (firstdot == undefined) {
                firstdot = [x, y]
                ctx.fillRect(x, y, 1, 1)
                dot = [x, y]
            }
            ctx.beginPath()
            ctx.moveTo(dot[0], dot[1])
            ctx.lineTo(x, y)
            ctx.stroke()
            dot = [x, y]
    }
});
document.addEventListener('mouseup', (e) => {
    mouseDown = false
});