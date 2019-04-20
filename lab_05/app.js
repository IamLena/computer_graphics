let pencilAction = true
let lineAction = false
let fillAction = false
let speed = 15
let mouseDown = false
let first
let last = [0, 0]
let dots = []

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

$('input[id="color"]').on('change', function(e) {
    const color = e.target.value;
    ctx.strokeStyle = color
    ctx.fillStyle = color
});
$('input[id="bgcolor"]').on('change', function(e) {
    const color = e.target.value;
    canvas.style.backgroundColor = color
});

console.log(canvas.offsetLeft)

canvas.addEventListener('mousedown', (e) => {
    if (e.which === 1) {
        if (lineAction) {
            let x = e.offsetX
            let y = e.offsetY;
            if (first == undefined) {
                dots = []
                first = [x, y]
                ctx.fillRect(x, y, 1, 1)
                last = [x, y]
            }
            else {
                ctx.beginPath()
                ctx.moveTo(last[0], last[1])
                ctx.lineTo(x, y)
                ctx.stroke()
                last = [x, y]
            }
            dots.push([x, y])
        }
        if (pencilAction) {
            mouseDown = true
        }
        if (fillAction) {
            console.log(findMaxMinY(dots))
            console.log(dots)
        }
    }
    if (e.which === 3) {
        if (first) {
            ctx.beginPath()
            ctx.moveTo(last[0], last[1])
            ctx.lineTo(first[0], first[1])
            ctx.stroke()
            first = undefined
        }
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (mouseDown && pencilAction) {
        let x = e.offsetX
            let y = e.offsetY;
            if (first == undefined) {
                first = [x, y]
                ctx.fillRect(x, y, 1, 1)
                last = [x, y]
            }
            ctx.beginPath()
            ctx.moveTo(last[0], last[1])
            ctx.lineTo(x, y)
            ctx.stroke()
            last = [x, y]
    }
});
document.addEventListener('mouseup', (e) => {
    mouseDown = false
});

function findMaxMinY(dots) {
    let max = dots[0][1]
    let min = dots[0][1]

    dots.forEach((dot) => {
        if (dot[1] > max) {max = dot[1]}
        if (dot[1] < min) {min = dot[1]}
    })
    return [min, max]
}