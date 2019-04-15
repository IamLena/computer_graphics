function drawDot(x, y, ctx) {
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

function canon_circle(xc, yc, r, ctx) {
    console.log('canon')
    let x, y;
    let x_rounded, y_rounded;
    let r2 = r * r;
    let endR = Math.sqrt(2) / 2 * r

    for (let x = 0; x <= r; x+=0.01)
    {
        y = Math.sqrt(r2 - x * x);
        
        drawDot(xc + x, yc + y, ctx);
        drawDot(xc - x, yc + y, ctx);
        drawDot(xc + x, yc - y, ctx);
        drawDot(xc - x, yc - y, ctx);
    }
    for (let y = 0; y <= r; y+=0.01)
    {
        x = Math.sqrt(r2 - y * y);

        drawDot(xc + x, yc + y, ctx);
        drawDot(xc - x, yc + y, ctx);
        drawDot(xc + x, yc - y, ctx);
        drawDot(xc - x, yc - y, ctx);
    }
}

function param_circle(xc, yc, r, ctx) {
    console.log('param')
    let d = 1 / r / 10;
    let x, y;
    let tmp = Math.PI / 2;
    while (tmp <= Math.PI)
    {
        x = (r * Math.cos(tmp));
        y = (r * Math.sin(tmp));

        drawDot(xc + x, yc + y, ctx);
        drawDot(xc - x, yc + y, ctx);
        drawDot(xc + x, yc - y, ctx);
        drawDot(xc - x, yc - y, ctx);

        tmp += d;
    }
}

function bre_circle(xc, yc, r, ctx)
{
    console.log('bre')
    let x = 0, y = r;
    let d = 2 * (1 - r);
    let d1 = 0, d2 = 0;
    let y_end = 0;
    while (y >= y_end)
    {
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc - x, yc + y, 1, 1);
        ctx.fillRect(xc + x, yc - y, 1, 1);
        ctx.fillRect(xc - x, yc - y, 1, 1);
        if (d < 0)
        {
           d1 = 2 * (d + y) - 1;
           x += 1;
           if (d1 < 0)
               d = d + 2 * x + 1;
           else
           {
               y -= 1;
               d = d + 2 * (x - y + 1);
           }
        }
        else if (d == 0)
        {
            x += 1;
            y -= 1;
            d = d + 2 * (x - y + 1);
        }
        else
        {
            d2 = 2 * (d - x) - 1;
            y -= 1;
            if (d2 < 0)
            {
                x += 1;
                d = d + 2 * (x - y + 1);
            }
            else
                d = d - 2 * y + 1;
        }
    }
}

function midpoint_circle(xc, yc, r, ctx)
{
    console.log('midpoint')
    let x = 0;
    let y = r;
    let df = 0;
    let delta = -2 * y;


    let x_bound = r / Math.sqrt(2);
    let f = 1.25 - r;

    for (; x <= x_bound; x++)
    {
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc - x, yc + y, 1, 1);
        ctx.fillRect(xc + x, yc - y, 1, 1);
        ctx.fillRect(xc - x, yc - y, 1, 1);

        if (f >= 0)
        {
            y -= 1;
            delta += 2;
            f += delta;
        }
        df += 2;
        f += df + 1;
    }

    delta = 2 * x;
    df = -2 * y;
    f += -x - y;
    for (; y >= 0; y--)
    {
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc - x, yc + y, 1, 1);
        ctx.fillRect(xc + x, yc - y, 1, 1);
        ctx.fillRect(xc - x, yc - y, 1, 1);
        if (f < 0)
        {
            x += 1;
            delta += 2;
            f += delta;
        }
        df += 2;
        f += 1 + df;
    }
}

function lib_circle(xc, yc, r, ctx) {
    ctx.beginPath();
    ctx.arc(xc, yc, r, 0, 2 * Math.PI);
    ctx.stroke();
}

function canon_ellipse(xc, yc, a, b, ctx)
{
    console.log('canon')
    let x, y;
    let x_rounded, y_rounded;
    let a2 = a * a;
    let b2 = b * b;
    if (a != 0)
    {
        for (let x = 0; x <= a; x++)
        {
            y = b * Math.sqrt(1.0 - x * x / a2);
            y_rounded = Math.round(y);
            ctx.fillRect(xc + x, yc + y_rounded, 1, 1);
            ctx.fillRect(xc - x, yc + y_rounded, 1, 1);
            ctx.fillRect(xc + x, yc - y_rounded, 1, 1);
            ctx.fillRect(xc - x, yc - y_rounded, 1, 1);
        }
    }
    if (b != 0)
    {
        for (let y = 0; y <= b; y++)
        {
            x = a * Math.sqrt(1.0 - y * y / b2);
            x_rounded = Math.round(x);
            ctx.fillRect(xc + x_rounded, yc + y, 1, 1);
            ctx.fillRect(xc - x_rounded, yc + y, 1, 1);
            ctx.fillRect(xc + x_rounded, yc - y, 1, 1);
            ctx.fillRect(xc - x_rounded, yc - y, 1, 1);
        }
    }
}

function param_ellipse(xc, yc, a, b, ctx)
{    
    console.log('param')
    let max_r = (a > b) ? a : b;
    let d = 1.0 / max_r;
    let x, y;
    let tmp = 0;
    while (tmp <= Math.PI + d)
    {
        x = (Math.round(a * Math.cos(tmp)));
        y = (Math.round(b * Math.sin(tmp)));
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc - x, yc + y, 1, 1);
        ctx.fillRect(xc + x, yc - y, 1, 1);
        ctx.fillRect(xc - x, yc - y, 1, 1);
        tmp += d;
    }
}

function bre_ellipse(xc, yc, a, b, ctx)
{
    let x = 0;
    let y = b; // при b = 0 и a != 0 отрисовывает точку (а не прямую)
    let a2 = a * a;
    let b2 = b * b;
    let da2 = 2 * a2;
    let db2 = 2 * b2;
    let d = b2 - da2 * b + a2;
    let d1 = 0, d2 = 0;
    let y_end = 0;
    while (y >= y_end)
    {
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc - x, yc + y, 1, 1);
        ctx.fillRect(xc + x, yc - y, 1, 1);
        ctx.fillRect(xc - x, yc - y, 1, 1);
        if (d < 0)
        {
           d1 = 2 * d + da2 * y - a2;
           x += 1;
           if (d1 < 0)
               d = d + db2 * x + b2;
           else
           {
               y -= 1;
               d = d + db2 * x - da2 * y + a2 + b2;
           }
        }
        else if (d == 0)
        {
            x += 1;
            y -= 1;
            d = d + db2 * x - da2 * y + a2 + b2;
        }
        else
        {
            d2 = 2 * d - db2 * x - b2;
            y -= 1;
            if (d2 < 0)
            {
                x += 1;
                d = d + db2 * x - da2 * y + a2 + b2;
            }
            else
                d = d - da2 * y + a2;
        }
    }
}

function midpoint_ellipse(xc, yc, a, b, ctx)
{
    let a2 = a * a;
    let b2 = b * b;
    let da2 = 2 * a2;
    let db2 = 2 * b2;
    let x = 0;
    let y = b;
    let df = 0;
    let delta = -da2 * y;


    let x_bound = a2 / Math.sqrt(a2 + b2);
    let f = b2 - a2 * b + 0.25 * a2;

    if (b == 0)
        f = -1;

    for (; x <= x_bound; x++)
    {
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc - x, yc + y, 1, 1);
        ctx.fillRect(xc + x, yc - y, 1, 1);
        ctx.fillRect(xc - x, yc - y, 1, 1);
        if (f >= 0)
        {
            y -= 1;
            delta += da2;
            f += delta;
        }
        df += db2;
        f += df + b2;
    }

    if (a == 0)
        x = 0;

    delta = db2 * x;
    df = -da2 * y;
    f += 0.75 * (a2 - b2) - a2 * y - b2 * x;
    for (; y >= 0; y--)
    {
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc - x, yc + y, 1, 1);
        ctx.fillRect(xc + x, yc - y, 1, 1);
        ctx.fillRect(xc - x, yc - y, 1, 1);
        if (f < 0)
        {
            x += 1;
            delta += db2;
            f += delta;
        }
        df += da2;
        f += a2 + df;
    }
}

function lib_ellipse(cx, cy, a, b, ctx) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, a, b, 0, 0,  2 * Math.PI);
    ctx.stroke()
}