document.querySelector('#input').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e)
    let xm = e.target.elements.xm.value
    let ym = e.target.elements.ym.value
    let len = e.target.elements.len.value
    let step = e.target.elements.step.value

    if (notValid(xm) || notValid(ym) || notValid(len) || notValid(step)) {
        alert('invalid line coordinates input!')
    }
    else {
        xm = parseFloat(xm)
        ym = parseFloat(ym)
        len = parseFloat(len)
        step = parseFloat(step)

        if (len <= 0) {
            alert('invalid legth!')
        }
        else {
            const lineColor = e.target.elements.line.value
            const bgColor = e.target.elements.background.value
        
            const radios = document.getElementsByName('algorithm');
            const alg = findOp(radios) //a string op1/op2...
            if (alg) {
                solve(alg, xm, ym, len, step, lineColor, bgColor)
            }
        }
    }
})

function findOp(radios) {
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].id
        }
    }
    alert('chose an algorithm!')
}

function notValid(x) {
    return x == '' || isNaN(x)
}

function solve(alg, xm, ym, len, step, lineColor, bgColor) {
    const canvas = document.querySelector('canvas')   
    canvas.style.backgroundColor = bgColor
    if (canvas.getContext) {
        ctx = canvas.getContext('2d')
        ctx.fillStyle = lineColor

        let angle = 0
        let xn = xm + len
        let yn = ym
        
        if (alg == 'op1'){
            while (angle <= 360) {
                const dot = rotate([xm + len, ym], angle, [xm, ym])
                xn = dot[0]
                yn = dot[1]
                cda(xn, yn, xm, ym)
                angle += step
            }
        }else if (alg == 'op2') {
            while (angle <= 360) {
                const dot = rotate([xm + len, ym], angle, [xm, ym])
                xn = dot[0]
                yn = dot[1]
                console.log(xn, yn, xm, ym)
                brezenR(xn, yn, xm, ym)
                angle += step
            }   
        }else if (alg == 'op3') {
            brezenInt(xn, yn, xk, yk)
        }else if (alg == 'op4') {
            //brezenStep(xn, yn, xk, yk, lineColor)
        }else if (alg == 'op5') {
            //By(xn, yn, xk, yk, lineColor)
        }else if (alg == 'op6') {
            bibl(xn, yn, xk, yk, lineColor)
        }else {
            alert('invalid parameters')
        }
    }
    else {console.log('can not get context')}
}

document.querySelector('#clean').addEventListener('click', (e) => {
    const canvas = document.querySelector('canvas')   
    if (canvas.getContext) {
        ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, 700, 450)
    }
    else {
        console.log('not available get context')
    }
})

function rotate(dot, angle, center) {
    const newx = center[0] + (dot[0] - center[0]) * Math.cos(angle * Math.PI / 180) + (dot[1] - center[1]) * Math.sin(angle * Math.PI / 180)
    const newy = center[1] - (dot[0] - center[0]) * Math.sin(angle * Math.PI / 180) + (dot[1] - center[1]) * Math.cos(angle * Math.PI / 180)
    return [newx, newy]
}