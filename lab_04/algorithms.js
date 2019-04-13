function canon_circle(xc, yc, r, ctx) {
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