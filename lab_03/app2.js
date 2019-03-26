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

function getLength(xn, yn, xk, yk) {
    return Math.abs(xn - xk) > Math.abs(yn - yk) ? Math.abs(xn - xk) : Math.abs(yn - yk)
  }

function cda(xn, yn, xk, yk) {

    const length = getLength(xn, yn, xk, yk)
    const dx = (xk - xn) / length
    const dy = (yk - yn) / length

    let x = xn
    let y = yn
    for (let i = 0; i <= length; i += 1) {
        //console.log(`dot: ${x}, ${y}`)
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
        x += dx
        y += dy
    }
}

function brezenR(xn, yn, xk, yk) {
    let dx = xk - xn
    let dy = yk - yn
    const sx = Math.sign(dx)
    const sy = Math.sign(dy)
    dx = Math.abs(dx)
    dy = Math.abs(dy)
    let swapFlag
    if (dy > dx) {
        let t = dx
        dx = dy
        dy = t 
        swapFlag = 1
    }
    else {
        swapFlag = 0
    }
    let m = dy / dx
    
    let er = m - 0.5

    let x = xn
    let y = yn
    for (let i = 1; i < dx + 1; i++) {
        ctx.fillRect(x, y, 1, 1)
        if (er >= 0) {
            if (!swapFlag) { y += sy} 
            else {x += sx}
            er -= 1
        }
        if (swapFlag == 1) { y += sy}
        else {x += sx}
        er += m
    }
}

function brezenInt(xn, yn, xk, yk) {
    console.log(xn, yn, xk, yk)
    let dx = xk - xn
    let dy = yk - yn
    const sx = Math.sign(dx)
    const sy = Math.sign(dy)
    dx = Math.abs(dx)
    dy = Math.abs(dy)
    let m = dy / dx
    let swapFlag
    if (m > 1) {
        m = 1 / m
        //swap
        let t = dx
        dx = dy
        dy = t 
        swapFlag = 1
    }
    if (m < 1) {
        swapFlag = 0
    }
    let er = 2 * dy - dx

    let x = xn
    let y = yn
    for (let i = 1; i < dx + 1; i++) {
        ctx.fillRect(x, y, 1, 1)
        if (er >= 0) {
            if (!swapFlag) { y += sy} 
            else {x += sx}
            er = er - 2 * dx
        }
        else {
            if (swapFlag == 1) { y += sy}
            else {x += sx}
        }
        er += 2 * dy
    }
}

function bibl(xn, yn, xk, yk, lineColor) {
    ctx.beginPath();
    ctx.moveTo(xn, yn);
    ctx.lineTo(xk, yk);
    ctx.strokeStyle = lineColor
    ctx.stroke();
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