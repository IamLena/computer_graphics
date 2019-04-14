function canon_circle(xc, yc, r, ctx) {
    console.log('canon')
    let x, y;
    let x_rounded, y_rounded;
    let r2 = r * r;
    for (let x = 0; x <= r; x++)
    {
        y = Math.sqrt(r2 - x * x);
        y_rounded = (Math.round(y));
        ctx.fillRect(xc + x, yc + y_rounded, 1, 1);
        ctx.fillRect(xc - x, yc + y_rounded, 1, 1);
        ctx.fillRect(xc + x, yc - y_rounded, 1, 1);
        ctx.fillRect(xc - x, yc - y_rounded, 1, 1);
    }
    for (let y = 0; y <= r; y++)
    {
        x = Math.sqrt(r2 - y * y);
        x_rounded = (Math.round(x));
        ctx.fillRect(xc + x_rounded, yc + y, 1, 1);
        ctx.fillRect(xc - x_rounded, yc + y, 1, 1);
        ctx.fillRect(xc + x_rounded, yc - y, 1, 1);
        ctx.fillRect(xc - x_rounded, yc - y, 1, 1);
    }
}

function param_circle(xc, yc, r, ctx) {
    console.log('param')
    let d = 1 / r;
    let x, y;
    let tmp = 0;
    //M_PI_2
    while (tmp <= Math.PI + d)
    {
        x = (Math.round(r * Math.cos(tmp)));
        y = (Math.round(r * Math.sin(tmp)));
        ctx.fillRect(xc + x, yc + y, 1, 1);
        ctx.fillRect(xc - x, yc + y, 1, 1);
        ctx.fillRect(xc + x, yc - y, 1, 1);
        ctx.fillRect(xc - x, yc - y, 1, 1);
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

// function midpoint_circle(xc, yc, r, ctx)
// {
//     int x = 0;
//     int y = r;
//     int df = 0;
//     int delta = -2 * y;


//     int x_bound = r / sqrt(2);
//     int f = 1.25 - r;

//     for (; x <= x_bound; x++)
//     {
//         painter.drawPoint(xc + x, yc + y);
//         painter.drawPoint(xc - x, yc + y);
//         painter.drawPoint(xc + x, yc - y);
//         painter.drawPoint(xc - x, yc - y);

//         if (f >= 0)
//         {
//             y -= 1;
//             delta += 2;
//             f += delta;
//         }
//         df += 2;
//         f += df + 1;
//     }

//     delta = 2 * x;
//     df = -2 * y;
//     f += -x - y;
//     for (; y >= 0; y--)
//     {
//         painter.drawPoint(xc + x, yc + y);
//         painter.drawPoint(xc - x, yc + y);
//         painter.drawPoint(xc + x, yc - y);
//         painter.drawPoint(xc - x, yc - y);
//         if (f < 0)
//         {
//             x += 1;
//             delta += 2;
//             f += delta;
//         }
//         df += 2;
//         f += 1 + df;
//     }
// }