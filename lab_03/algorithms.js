function cda(xn, yn, xk, yk) {
    let dx = (xk - xn)
    let dy = (yk - yn)
    const length = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy)

    const sx = dx / length
    const sy = dy /length

    let x = xn
    let y = yn
    let m = dy / dx
    for (let i = 0; i <= length; i += 1) {
        //console.log(`dot: ${x}, ${y}`)
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
        x += sx
        y += sy
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
    for (let i = 0; i < dx + 1; i++) {
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

function HSLtoRGB(hsl) {
    let h = hsl[0]
    let s = hsl[1]
    let l = hsl[2]
    // Must be fractions of 1
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

    return "rgb(" + r + "," + g + "," + b + ")";
}

HEXtoRGB = function(hex, intensity) {
    hex = hex.split('')
    
    var r,g,b,h,s,v;
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
    console.log(intensity)
    console.log(r, g, b)

    r = Math.round(r * (100 - intensity) / 100)
    g = Math.round(g * (100 - intensity) / 100)
    b = Math.round(b * (100 - intensity) / 100)
    
    console.log(r, g, b)
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
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

function HEXtoHSL(hex) {
    hex = hex.split('')
    
    var r,g,b,h,s,v;
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];

    min = Math.min( r, g, b );
    max = Math.max( r, g, b );

    let l = 1/ 2 * (max + min)
    l = Math.round(max * 100 / 255)
    delta = max - min;
    if( max != 0 )
        s = delta / max;
    else {
        // r = g = b = 0        // s = 0, l is undefined
        s = 0;
        h = 0;
        return [h, s, l];
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
    return [h,s,l];
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

function changeColor(color, intensity) {
    if (color === '#ffffff') {
        return color
    }
    const hsv= HEXtoHSV (color);
    if (hsv[1] == 0) {
        hsv[2] = 100 - intensity
    }
    else {
        hsv[1] *= intensity / 100;
    }
    const hex = HSVtoHEX(hsv)
    return hex

    // debugger
    // const hsl = HEXtoHSL(color);
    // hsl[2] = 100 - intensity
    // const rgb = HSLtoRGB(hsl)
    // return rgb
}

//foo
function By1(xn, yn, xk, yk, color) {
    // xn = 10 
    // yn = 300
    // xk = 30
    // yk = 305
    const pixelsize = 20

    let m
    let xi
    let yi    
    const intensity = 100 //levels of intensity
    let dx = (xk - xn) * pixelsize
    let dy = (yk - yn) * pixelsize

    ctx.fillStyle = color
    ctx.fillRect(xn, yn, pixelsize, pixelsize)
    ctx.fillRect(xn + dx, yn + dy, pixelsize, pixelsize)

    
    if (Math.abs(dy) < Math.abs(dx)) { //m < 1
        if (dx < 0) {
            let t = xk
            xk = xn
            xn = t

            t = yk
            yk = yn
            yn = t
            dx = -dx
            dy = -dy
        }

        m = dy / dx

        yi = yn + m *pixelsize
        for (let x = xn + pixelsize; x < xn + dx; x += pixelsize) {
            let curInt = intensity - (yi % pixelsize) / pixelsize * 100
            let newColor = changeColor(color, curInt)
            ctx.fillStyle = newColor
            ctx.fillRect(x, yi - yi % pixelsize, pixelsize, pixelsize)
            curInt = intensity - curInt
            newColor = changeColor(color, curInt)
            ctx.fillStyle = newColor
            ctx.fillRect(x, yi - yi % pixelsize + pixelsize, pixelsize, pixelsize)
            yi = yi + m * pixelsize
        }
    }
    else {
        if (dy < 0) {
            let t = xn
            xn = xk
            xk = t

            t = yn
            yn = yk
            yk = t
            dy = -dy
            dx = -dx
        }
        m = dx / dy
        console.log(`m = ${m}, dx = ${dx}, dy = ${dy}, xn = ${xn}`)

        xi = xn + m * pixelsize
        //ctx.fillRect(xn, yn - pixelsize, pixelsize, pixelsize)
        for (let y = yn + pixelsize; y < yn + dy; y += pixelsize) {
            let curInt =  intensity - (xi % pixelsize) / pixelsize * 100
            let newColor = changeColor(color, curInt)
            ctx.fillStyle = newColor
            ctx.fillRect(xi - xi % pixelsize, y, pixelsize, pixelsize)
            curInt = intensity - curInt
            newColor = changeColor(color, curInt)
            ctx.fillStyle = newColor
            ctx.fillRect(xi - xi % pixelsize + pixelsize, y, pixelsize, pixelsize)
            xi = xi + m * pixelsize
        }
    }

    bibl(xn, yn, xn + (xk - xn) * pixelsize, yn + (yk - yn)* pixelsize, 'red')    
}

//sizepixel = 1
function By(xn, yn, xk, yk, color) {
    let m
    let xi
    let yi    
    const intensity = 100 //levels of intensity
    let dx = (xk - xn)
    let dy = (yk - yn)

    ctx.fillStyle = color
    ctx.fillRect(xn, yn, 1, 1)
    ctx.fillRect(xk, yk, 1, 1)

    if (dx == 0) {
        const sy = Math.sign(yk - yn)
        let y = yn
        while (y != yk) {
            ctx.fillRect(xn, y, 1, 1)
            y += sy
        }
    }
    else if (dy == 0) {
        const sx = Math.sign(xk - xn)
        let x = xn
        while (x != xk) {
            ctx.fillRect(x, yn, 1, 1)
            x += sx
        }
    }
    else if (Math.abs(dy) <= Math.abs(dx)) { //m < 1
        if (dx < 0) {
            let t = xk
            xk = xn
            xn = t

            t = yk
            yk = yn
            yn = t
            dx = -dx
            dy = -dy
        }

        m = dy / dx

        yi = yn + m
        for (let x = xn + 1; x < xk; x += 1) {
            let curInt = intensity - (yi % 1) * 100
            let newColor = changeColor(color, curInt)
            ctx.fillStyle = newColor
            ctx.fillRect(x, Math.floor(yi), 1, 1)
            if (curInt != 100) {
                curInt = intensity - curInt
                newColor = changeColor(color, curInt)
                ctx.fillStyle = newColor
                ctx.fillRect(x, Math.ceil(yi), 1, 1)
            }
            yi = yi + m
        }
    }
    else {
        if (dy < 0) {
            let t = xn
            xn = xk
            xk = t

            t = yn
            yn = yk
            yk = t
            dy = -dy
            dx = -dx
        }
        m = dx / dy
        console.log(`m = ${m}, dx = ${dx}, dy = ${dy}, xn = ${xn}`)

        xi = xn + m
        for (let y = yn + 1; y < yk; y += 1) {
            let curInt =  intensity - (xi % 1) * 100
            let newColor = changeColor(color, curInt)
            ctx.fillStyle = newColor
            ctx.fillRect(Math.floor(xi), y, 1, 1)
            if (curInt != 100) {
                curInt = intensity - curInt
                newColor = changeColor(color, curInt)
                ctx.fillStyle = newColor
                ctx.fillRect(Math.ceil(xi), y, 1, 1)
            }
            xi = xi + m
        }
    }
}