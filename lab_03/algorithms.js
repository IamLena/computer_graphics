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
    let er = 2 * dy - dx

    let x = xn
    let y = yn
    for (let i = 1; i < dx + 1; i++) {
        ctx.fillRect(x, y, 1, 1)
        if (er >= 0) {
            if (!swapFlag) { y += sy} 
            else {x += sx}
            er -= 2 * dx
        }
        if (swapFlag == 1) { y += sy}
        else {x += sx}
        
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

function brezenStep(xn, yn, xk, yk, color) {
    const intensity = 100 //levels of intensity
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
    let m = dy / dx * intensity
    let w = intensity - m
    let er = intensity / 2
    let x = xn
    let y = yn
    for (let i = 0; i <= dx; i++) {
        const newColor = changeColor(color, er)
        ctx.fillStyle = newColor
        ctx.fillRect(x, y, 1, 1)
        if (er < w) {
            if (!swapFlag) { x += sx }
            else { y += sy }
            er += m
        }
        else {
            x += sx
            y += sy
            er -= w
        }
    }

}

function changeColor(color, intensity) {
    const hsv= HEXtoHSV (color);
    hsv[1] *= intensity / 100;
    const hex = HSVtoHEX(hsv)
    return hex
}

HEXtoHSV = function(hex) {
    hex = hex.split('')
    
    var r,g,b,h,s,v;
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];

    min = Math.min( r, g, b );
    max = Math.max( r, g, b );


    v = Math.round(max * 100 / 255)
    delta = max - min;
    if( max != 0 )
        s = delta / max;
    else {
        // r = g = b = 0        // s = 0, v is undefined
        s = 0;
        h = 0;
        return [h, s, v];
    }
    if( r == max )
        h = ( g - b ) / delta;      // between yellow & magenta
    else if( g == max )
        h = 2 + ( b - r ) / delta;  // between cyan & yellow
    else
        h = 4 + ( r - g ) / delta;  // between magenta & cyan
    h *= 60;                // degrees
    if( h < 0 )
        h += 360;
    if ( isNaN(h) )
        h = 0;
    
    s *= 100
    s = Math.round(s)
    return [h,s,v];
};

function HSVtoHEX (hsv) {
    let r, g, b
    let h = hsv[0]
    let s = hsv[1] / 100
    let v = hsv[2] / 100

    let c = s * v
    let x = c * (1 - Math.abs((h / 60) % 2 - 1))
    let m = v - c

    if (h < 60) {
        r = c
        g = x
        b = 0
    }
    else if (h < 120) {
        r = x
        g = c
        b = 0
    }
    else if (h < 180) {
        r = 0; g = c; b = x
    }
    else if (h < 240) {
        r = 0; g = x; b = c
    }
    else if (h < 300) {
        r = x; g = 0; b = c
    }
    else {
        r = c; g = 0; b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    //return [r, g, b]
}

function By(xn, yn, xk, yk, color) {
    const intensity = 100 //levels of intensity
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
    let m = dy / dx * intensity
    let w = intensity - m
    let er = intensity / 2
    let x = xn
    let y = yn
    for (let i = 0; i <= dx; i++) {
        let newColor = changeColor(color, er)
        ctx.fillStyle = newColor
        ctx.fillRect(x, y, 1, 1)

        newColor = changeColor(color, intensity - er)
        ctx.fillStyle = newColor
        ctx.fillRect(x, y + 1, 1, 1)

        if (er < w) {
            if (!swapFlag) { x += sx }
            else { y += sy }
            er += m
        }
        else {
            x += sx
            y += sy
            er -= w
        }
    }

}