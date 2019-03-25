document.querySelector('#input').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e)
    let xn = e.target.elements.xn.value
    let yn = e.target.elements.yn.value
    let xk = e.target.elements.xk.value
    let yk = e.target.elements.yk.value

    if (notValid(xn) || notValid(yn) || notValid(xk) || notValid(yk)) {
        alert('invalid line coordinates input!')
    }
    else {
        xn = parseFloat(xn)
        yn = parseFloat(yn)
        xk = parseFloat(xk)
        yk = parseFloat(yk)

        if (xn == xk && yn == yk) {
            alert('it is a dot!')
        }
        else {
            const lineColor = e.target.elements.line.value
            const bgColor = e.target.elements.background.value
        
            const radios = document.getElementsByName('algorithm');
            const alg = findOp(radios) //a string op1/op2...
            if (alg) {
                solve(alg, xn, yn, xk, yk, lineColor, bgColor)
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

function solve(alg, xn, yn, xk, yk, lineColor, bgColor) {
    const canvas = document.querySelector('canvas')
    if (canvas.getContext) {
        ctx = canvas.getContext('2d')
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, 700, 450)

        ctx.fillStyle = lineColor

        if (alg == 'op1'){
            cda(xn, yn, xk, yk)
        }else if (alg == 'op2') {
            //brezenR(xn, yn, xk, yk, lineColor)
        }else if (alg == 'op3') {
            //brezenInt(xn, yn, xk, yk, lineColor)
        }else if (alg == 'op4') {
            //brezenStep(xn, yn, xk, yk, lineColor)
        }else if (alg == 'op5') {
            //By(xn, yn, xk, yk, lineColor)
        }else if (alg == 'op6') {
            //bibl(xn, yn, xk, yk, lineColor)
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

    // ctx.beginPath();
    // ctx.moveTo(xn, yn);
    // ctx.lineTo(xk, yk);
    // ctx.stroke();
    

    // console.log(dots.length)
    // for (let i = 0; i < dots.length; i++) {
    //     ctx.rect(dots[i][0], dots[i][1], 1, 1)
    //     ctx.fillRect(dots[i][0], dots[i][1], 1, 1)
    //     ctx.stroke()
    // }
}