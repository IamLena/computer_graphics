//deep coping when appending to ohistory array

function getCenter(M = []) {
    let x = 0
    let y = 0
    M.forEach((item) => {
        x += item[0]
        y += item[1]
    })
    x /= M.length
    y /= M.length
    return [x, y]
}

function getEpicDots(a, b, center) {
    let t = 0
    dots = []
    while (t < 2 * a * Math.PI) {
        x = (a + b)* Math.cos(t) - a * Math.cos ((a+b) * t / a) + center[0]
        y = (a + b) * Math.sin(t) - a * Math.sin((a + b) * t / a) + center[1]
        dots.push([x, y])
        t += 0.1
    }
    return dots
}

function get_b(x, y, angle) {
    return y - Math.tan(angle * Math.PI / 180) * x
}

function get_y(x_border, angle, b) {
    return Math.tan(angle * Math.PI / 180 ) * x_border + b
}

function get_x(y_border, angle, b) {
    return (y_border - b) / Math.tan(angle * Math.PI / 180)
}

function getHashLines (rect, hashAngle, hashStep) {
    let lines = []
    lu = rect[0]
    ru = rect[1]
    rd = rect[2]
    ld = rect[3]
    if(hashAngle % 90 == 0 & hashAngle / 90 % 2 == 1) {
        let i = lu[0]
        while (i < ru[0]) {
            let y_from = lu[1]
            let x_from = i
            let y_to = rd[1]
            let x_to = i
            lines.push([x_from, y_from, x_to, y_to])
            i += hashStep
        }
    }
    else if (Math.abs(Math.tan(hashAngle * Math.PI / 180) - 0) < 0.000001 ) {
        let i = lu[1]
        while (i > rd[1]) {
            let x_from = lu[0]
            let y_from = i
            let x_to = rd[0]
            let y_to = i
            lines.push([x_from, y_from])
            lines.push([x_to, y_to])
            i -= hashStep
        }
    }
    else if (Math.tan(hashAngle * Math.PI / 180) > 0) {
        i = lu[0]
        height = lu[1] -  rd[1]
        add_width = height / Math.tan(hashAngle * Math.PI / 180)
        while (i < rd[0] + add_width){
            const b = get_b(i, lu[1], hashAngle)
            let x_from = i
            let y_from = lu[1]
            let x_to = lu[0]
            let y_to = get_y(x_to, hashAngle, b)

            if (i > rd[0]) {
                x_from = rd[0]
                y_from =  get_y(rd[0], hashAngle, b)
            }
                
            if (y_to < rd[1]) {
                y_to = rd[1]
                x_to = get_x(y_to, hashAngle, b)
            }

            if (y_to > lu[1]) {
                y_to = rd[1]
                x_to = get_x(y_to, hashAngle, b)
            }

            lines.push([x_from, y_from])
            lines.push([x_to, y_to])
            i += hashStep
        }
    }
    else {
        height = lu[1] -  rd[1]
        add_width = - height / Math.tan(hashAngle * Math.PI / 180)
        let i = lu[0]
        while (i < rd[0] + add_width) {
            const b = get_b(i, rd[1], hashAngle)

            let y_to = get_y(lu[0], hashAngle, b)
            let x_to = lu[0]
            let x_from = i
            let y_from = rd[1]

            if (i > rd[0]) {
                x_from = rd[0]
                y_from = get_y(x_from, hashAngle, b)
            }

            if (y_to > lu[1]) {
                y_to = lu[1]
                x_to = get_x(y_to, hashAngle, b)
            }
            lines.push([x_from, y_from])
            lines.push([x_to, y_to])
            i += hashStep
        }
    }
    return lines
}

historyArray = []

curImage = {
    lu: [260, 628],
    ru: [740, 628],
    rd: [740, 372],
    ld: [260, 372],
    center: function() {
        return getCenter([this.lu, this.ru, this.rd, this.ld])
    },
    a: 2,
    b: 3,
    epicDots: function() {
        let dots = getEpicDots(this.a, this.b, this.center())
        for (let i = 0; i < dots.length; i++) {
            dots[i] = scale(dots[i], 16, 16, [500, 500])
        }
        return dots
    },
    
    dots: [],
    hashAngle: -45,
    hashStep: 40,
    hashLines: function() {
        return getHashLines([this.lu, this.ru, this.rd, this.ld], this.hashAngle, this.hashStep)
    },
    hash: [],

    setArrays: function() {
        this.dots = this.epicDots()
        this.hash = this.hashLines()
    },

    moveImage: function(dx, dy) {
        this.lu = move(this.lu, dx, dy)
        this.ru = move(this.ru, dx, dy)
        this.rd = move(this.rd, dx, dy)
        this.ld = move(this.ld, dx, dy)

        for (let i = 0; i < this.hash.length - 1; i += 2) {
            this.hash[i] = move( this.hash[i], dx, dy)
            this.hash[i+1] = move( this.hash[i+1], dx, dy)
        }

        for (let i = 0; i < this.dots.length; i++)
            this.dots[i] = move(this.dots[i], dx, dy)

        historyArray.push([this.lu.slice(), this.ru.slice(), this.rd.slice(), this.ld.slice(), this.dots.slice(), this.hash.slice()])
    },

    scaleImage: function(kx, ky, xm, ym) {
        this.lu = scale(this.lu, kx, ky, [xm, ym])
        this.ru = scale(this.ru, kx, ky, [xm, ym])
        this.rd = scale(this.rd, kx, ky, [xm, ym])
        this.ld = scale(this.ld, kx, ky, [xm, ym])

        for (let i = 0; i < this.hash.length - 1; i += 2) {
            this.hash[i] = scale( this.hash[i], kx, ky, [xm, ym])
            this.hash[i+1] = scale( this.hash[i+1], kx, ky, [xm, ym])
        }

        for (let i = 0; i < this.dots.length; i++)
            this.dots[i] = scale(this.dots[i], kx, ky, [xm, ym])

        historyArray.push([this.lu.slice(), this.ru.slice(), this.rd.slice(), this.ld.slice(), this.dots.slice(), this.hash.slice()])
    },

    rotateImage: function(angle, xm, ym) {
        this.lu = rotate(this.lu, angle, [xm, ym])
        this.ru = rotate(this.ru, angle, [xm, ym])
        this.rd = rotate(this.rd, angle, [xm, ym])
        this.ld = rotate(this.ld, angle, [xm, ym])

        for (let i = 0; i < this.hash.length - 1; i += 2) {
            this.hash[i] = rotate( this.hash[i], angle, [xm, ym])
            this.hash[i+1] = rotate( this.hash[i+1], angle, [xm, ym])
        }

        let dots = this.dots
        for (let i = 0; i < dots.length; i++)
            dots[i] = rotate(dots[i], angle, [xm, ym])

        this.dots = dots

        historyArray.push([this.lu.slice(), this.ru.slice(), this.rd.slice(), this.ld.slice(), this.dots.slice(), this.hash.slice()])

    },

    draw: function() {
        const canvas = document.querySelector('canvas')
        if (canvas.getContext) {
            const  ctx = canvas.getContext('2d')
            
            ctx.clearRect(0, 0, 1000, 1000);

            //draw rectangle
            ctx.beginPath()
            ctx.moveTo(this.lu[0], this.lu[1])
            ctx.lineTo(this.ru[0], this.ru[1])
            ctx.lineTo(this.rd[0], this.rd[1])
            ctx.lineTo(this.ld[0], this.ld[1])
            ctx.closePath();
            ctx.stroke();

            //hash rectangle
            for (let i = 0; i < this.hash.length - 1; i += 2) {
                ctx.beginPath()
                ctx.moveTo(this.hash[i][0], this.hash[i][1])
                ctx.lineTo(this.hash[i + 1][0], this.hash[i + 1][1])
                ctx.stroke()
            }

            //fill epic
            ctx.moveTo(this.dots[0][0], this.dots[0][1])
            ctx.beginPath();
            
            for (let i = 1; i < this.dots.length - 1; i++){
                ctx.lineTo(this.dots[i][0], this.dots[i][1])
                ctx.lineTo(this.dots[i + 1][0], this.dots[i + 1][1])
                ctx.lineTo(this.center[0], this.center[1])
                ctx.closePath();
                ctx.strokeStyle = 'green'
                ctx.stroke();
                ctx.fillStyle = 'green'
                ctx.fill();
            }

            //draw epic
            ctx.moveTo(this.dots[0][0], this.dots[0][1])
            ctx.beginPath();
            ctx.strokeStyle = 'black'
            for (let i = 1; i < this.dots.length; i++){
                ctx.lineTo(this.dots[i][0], this.dots[i][1])
                ctx.stroke();
            }
        }
    },
    initial: function() {
        this.lu = [260, 628]
        this.ru = [740, 628]
        this.rd = [740, 372]
        this.ld = [260, 372]
        
        this.setArrays()
        historyArray.push([this.lu.slice(), this.ru.slice(), this.rd.slice(), this.ld.slice(), this.dots.slice(), this.hash.slice()])
    },
    prev: function() {
        debugger
        historyArray.pop()
        operation = historyArray[historyArray.length - 1]
        this.lu = operation[0].slice()
        this.ru = operation[1].slice()
        this.rd = operation[2].slice()
        this.ld = operation[3].slice()

        this.dots = operation[4].slice()
        this.hash = operation[5].slice()
    }
}

curImage.initial()
curImage.draw()

function move (dot, dx, dy) {
    return [dot[0] + dx, dot[1] + dy]
}

function scale(dot, kx, ky, center) {
    const x = kx * dot[0] + (1 - kx) * center[0]
    const y = ky * dot[1] + (1 - ky) * center[1]
    return [x, y]
}

function rotate(dot, angle, center) {
    const newx = center[0] + (dot[0] - center[0]) * Math.cos(angle * Math.PI / 180) + (dot[1] - center[1]) * Math.sin(angle * Math.PI / 180)
    const newy = center[1] - (dot[0] - center[0]) * Math.sin(angle * Math.PI / 180) + (dot[1] - center[1]) * Math.cos(angle * Math.PI / 180)
    return [newx, newy]
}

document.querySelector('.scale').addEventListener('submit', (e) => {
    e.preventDefault();
    kx = e.target.elements.kx.value;
    ky = e.target.elements.ky.value;
    
    xm = e.target.elements.xmScale.value;
    ym = e.target.elements.ymScale.value;
    
    e.target.elements.kx.value = '';
    e.target.elements.ky.value = '';
    e.target.elements.xmScale.value = '';
    e.target.elements.ymScale.value = '';
    if (isNaN(kx) || (kx == '') || isNaN(ky) || (ky == '')
    || isNaN(xm) || (xm == '') || isNaN(ym) || (ym == '')) {
        console.log('invalid')
        alert('invalid input')
    }
    else {
        kx = parseFloat(kx)
        ky = parseFloat(ky)
        xm = parseFloat(xm)
        ym = parseFloat(ym)
    
        console.log(kx, ky, xm, ym)
        curImage.scaleImage(kx, ky, xm, ym)
        curImage.draw()  
    }
})

document.querySelector('.move').addEventListener('submit', (e) => {
    e.preventDefault();
    dx = e.target.elements.dx.value;
    dy = e.target.elements.dy.value;

    e.target.elements.dx.value = '';
    e.target.elements.dy.value = '';
    if (isNaN(dx) || (dx == '') || isNaN(dy) || (dy == '')) {
        console.log('invalid')
        alert('invalid input')
    }
    else {
        dx = parseFloat(dx)
        dy = parseFloat(dy)
    
        curImage.moveImage(dx, dy)
        curImage.draw()
    }
})

document.querySelector('.rotate').addEventListener('submit', (e) => {
    e.preventDefault();
    angle = e.target.elements.angle.value;
    xm = e.target.elements.xmRotate.value;
    ym = e.target.elements.ymRotate.value;
    
    e.target.elements.angle.value = '';
    e.target.elements.xmRotate.value = '';
    e.target.elements.ymRotate.value = '';
    if (isNaN(angle) || (angle == '')
    || isNaN(xm) || (xm == '') || isNaN(ym) || (ym == '')) {
        console.log('invalid')
        alert('invalid input')
    }
    else {
        angle = parseFloat(angle)
        xm = parseFloat(xm)
        ym = parseFloat(ym)
    
        curImage.rotateImage(angle, xm, ym)
        curImage.draw()
    }
})

document.querySelector('#back').addEventListener('click', (e) => {
    if (historyArray.length > 1) {
        curImage.prev()
        curImage.draw()
    }
})

document.querySelector('#initial').addEventListener('click', (e) => {
    curImage.initial()
    curImage.draw()
})