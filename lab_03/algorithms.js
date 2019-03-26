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
        console.log(x, y)
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
    while (x < xk) {
    // for (let i = 1; i < dx + 1; i++) {
        console.log(x, y)
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