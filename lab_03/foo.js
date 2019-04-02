// let xn = 5, yn = 5, xk = 15, yk = 30
// const pixelsize = 5


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
    let xn = 5, yn = 5, xk = 15, yk = 30
    const pixelsize = 5
    const intensity = 100 //levels of intensity
    let dx = xk - xn
    let dy = yk - yn
    const sx = Math.sign(dx) * pixelsize
    const sy = Math.sign(dy) * pixelsize
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
    dx *= pixelsize
    dy *= pixelsize

    let m = dy / dx * intensity
    let w = intensity - m
    let er = intensity / 2
    let x = xn
    let y = yn
    for (let i = 0; i <= dx; i += pixelsize) {
        let newColor = changeColor(color, er)
        ctx.fillStyle = newColor
        ctx.fillRect(x, y, pixelsize, pixelsize)

        newColor = changeColor(color, intensity - er)
        ctx.fillStyle = newColor
        if (er > intensity / 2) {
            ctx.fillRect(x, y + pixelsize, pixelsize, pixelsize)
        }
        else {
            ctx.fillRect(x, y - pixelsize, pixelsize, pixelsize)
        }

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