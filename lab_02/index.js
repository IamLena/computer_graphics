// update cur when initial
// back function

function Operation(action = 'initial', dx = 0, dy = 0, kx = 1, ky = 1, centerScale = [0, 0], angle = 0, centerRotate = [0,0]) {
    this.action = action
    this.dx = dx
    this.dy = dy
    this.kx = kx
    this.ky = ky
    this.centerScale = centerScale
    this.angle = angle
    this.centerRotate = centerRotate
}

operations = []
operation = new Operation()
operations.push(operation)
console.log(operations)

function getCenter(M = []) {
    let x = 0
    let y = 0
    console.log(M)
    M.forEach((item) => {
        console.log(item)
        x += item[0]
        y += item[1]
    })
    x /= M.length
    y /= M.length
    return [x, y]
}

function getEpicDots(a, b, center) {
    console.log(a, b, center)
    let t = 0
    dots = []
    while (t < 2 * a * Math.PI) {
        x = (a + b)* Math.cos(t) - a * Math.cos ((a+b) * t / a) + center[0]
        y = (a + b) * Math.sin(t) - a * Math.sin((a + b) * t / a) + center[1]
        dots.push([x, y])
        t += 0.1
    }
    console.log(dots)
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
            lines.push([x_from, y_from, x_to, y_to])
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

            lines.push([x_from, y_from, x_to, y_to])
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
            lines.push([x_from, y_from, x_to, y_to])
            i += hashStep
        }
    }
    return lines
}

curImage = {
    lu: [200, 660],
    ru: [800, 660],
    rd: [800, 340],
    ld: [200, 340],
    center: function() {
        return getCenter([this.lu, this.ru, this.rd, this.ld])
    },
    a: 2,
    b: 3,
    epicDots: function() {
        let dots = getEpicDots(this.a, this.b, this.center())
        for (let i = 0; i < dots.length; i++) {
            dots[i] = scale(dots[i], 20, 20, [500, 500])
        }
        console.log(dots)
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

    draw: function(operation) {
        console.log('dots')
        console.log(this.dots)
        console.log('hash')
        console.log(this.hash)
        const canvas = document.querySelector('canvas')

        if (canvas.getContext) {
            const  ctx = canvas.getContext('2d')
            
            ctx.clearRect(0, 0, 1000, 1000);

            let lines = this.hash
            let dots = this.dots

            if (operation.action === 'move') {
                this.lu = move(this.lu, dx, dy)
                this.ru = move(this.ru, dx, dy)
                this.rd = move(this.rd, dx, dy)
                this.ld = move(this.ld, dx, dy)

                for (let i = 0; i < lines.length; i++) {
                    lines[i][0] += dx
                    lines[i][1] += dy
                    lines[i][2] += dx
                    lines[i][3] += dy
                }
                this.hash = lines

                for (let i = 0; i < dots.length; i++)
                    dots[i] = move(dots[i], dx, dy)

                this.dots = dots
            }

            if (operation.action === 'scale') {
                this.lu = scale(this.lu, kx, ky, operation.centerScale)
                this.ru = scale(this.ru, kx, ky, operation.centerScale)
                this.rd = scale(this.rd, kx, ky, operation.centerScale)
                this.ld = scale(this.ld, kx, ky, operation.centerScale)

                for (let i = 0; i < lines.length; i++) {
                    console.log(`was ${lines[i]}`)
                    scaled1 = scale( [lines[i][0], lines[i][1]], kx, ky, operation.centerScale)
                    scaled2 = scale( [lines[i][2], lines[i][3]], kx, ky, operation.centerScale)
                    lines[i][0] = scaled1[0]
                    lines[i][1] = scaled1[1]
                    lines[i][2] = scaled2[0]
                    lines[i][3] = scaled2[1]
                    console.log(lines[i])
                }
                this.hash = lines

                for (let i = 0; i < dots.length; i++)
                    dots[i] = scale(dots[i], kx, ky, operation.centerScale)

                this.dots = dots
            }

            if (operation.action === 'rotate') {
                this.lu = rotate(this.lu, operation.angle, operation.centerRotate)
                this.ru = rotate(this.ru, operation.angle, operation.centerRotate)
                this.rd = rotate(this.rd, operation.angle, operation.centerRotate)
                this.ld = rotate(this.ld, operation.angle, operation.centerRotate)

                for (let i = 0; i < lines.length; i++) {
                    console.log(`was ${lines[i]}`)
                    rotated1 = rotate( [lines[i][0], lines[i][1]], operation.angle, operation.centerRotate)
                    rotated2 = rotate( [lines[i][2], lines[i][3]], operation.angle, operation.centerRotate)
                    lines[i][0] = rotated1[0]
                    lines[i][1] = rotated1[1]
                    lines[i][2] = rotated2[0]
                    lines[i][3] = rotated2[1]
                }
                this.hash = lines

                for (let i = 0; i < dots.length; i++)
                    dots[i] = rotate(dots[i], operation.angle, operation.centerRotate)

                this.dots = dots
                console.log('done')
            }

            //draw rectangle
            console.log(this.lu, this.ru, this.rd, this.ld)
            ctx.beginPath()
            ctx.moveTo(this.lu[0], this.lu[1])
            ctx.lineTo(this.ru[0], this.ru[1])
            ctx.lineTo(this.rd[0], this.rd[1])
            ctx.lineTo(this.ld[0], this.ld[1])
            ctx.closePath();
            ctx.stroke();

            //hash rectangle
            lines.forEach((item) => {
                ctx.beginPath()
                ctx.moveTo(item[0], item[1])
                ctx.lineTo(item[2], item[3])
                ctx.stroke()
            })

            //fill epic
            ctx.moveTo(dots[0][0], dots[0][1])
            ctx.beginPath();
            
            for (let i = 1; i < dots.length - 1; i++){
                ctx.lineTo(dots[i][0], dots[i][1])
                ctx.lineTo(dots[i + 1][0], dots[i + 1][1])
                ctx.lineTo(this.center[0], this.center[1])
                ctx.closePath();
                ctx.strokeStyle = 'green'
                ctx.stroke();
                ctx.fillStyle = 'green'
                ctx.fill();
            }

            //draw epic
            ctx.moveTo(dots[0][0], dots[0][1])
            ctx.beginPath();
            ctx.strokeStyle = 'black'
            for (let i = 1; i < dots.length; i++){
                ctx.lineTo(dots[i][0], dots[i][1])
                ctx.stroke();
            }
        }
    }
}

origin = {
    lu: [200, 660],
    ru: [800, 660],
    rd: [800, 340],
    ld: [200, 340],
    center: function() {
        return getCenter([this.lu, this.ru, this.rd, this.ld])
    },
    a: 2,
    b: 3,
    epicDots: function() {
        console.log(`center ${this.center()}`)
        let dots = getEpicDots(this.a, this.b, this.center())
        for (let i = 0; i < dots.length; i++) {
            dots[i] = scale(dots[i], 20, 20, [500, 500])
        }
        console.log(dots)
        return dots
    },
    dots: [],
    hashAngle: -45,
    hashStep: 40,
    hashLines: function() {
        return getHashLines([this.lu, this.ru, this.rd, this.ld], this.hashAngle, this.hashStep)
    },
    hash: [],

    draw: function(operation) {
        ctx.clearRect(0, 0, 1000, 1000);
        const canvas = document.querySelector('canvas')
        if (canvas.getContext) {
            const  ctx = canvas.getContext('2d')
            
            let rect = [this.lu, this.ru, this.rd, this.ld]
            let lines = this.hashLines()
            this.lines = lines
            let dots = this.epicDots()
            this.dots = dots
            let center = this.center()

            //draw rectangle
            ctx.beginPath()
            ctx.moveTo(this.lu[0], this.lu[1])
            ctx.lineTo(this.ru[0], this.ru[1])
            ctx.lineTo(this.rd[0], this.rd[1])
            ctx.lineTo(this.ld[0], this.ld[1])
            ctx.closePath();
            ctx.stroke();

            //hash rectangle
            lines.forEach((item) => {
                ctx.beginPath()
                ctx.moveTo(item[0], item[1])
                ctx.lineTo(item[2], item[3])
                ctx.stroke()
            })

            //fill epic
            ctx.moveTo(dots[0][0], dots[0][1])
            ctx.beginPath();
            
            for (let i = 1; i < dots.length - 1; i++){
                ctx.lineTo(dots[i][0], dots[i][1])
                ctx.lineTo(dots[i + 1][0], dots[i + 1][1])
                ctx.lineTo(center[0], center[1])
                ctx.lineTo(dots[i][0], dots[i][1])
                ctx.closePath();
                ctx.strokeStyle = 'white'
                ctx.stroke();
                ctx.fillStyle = 'white'
                ctx.fill();
            }

            //draw epic
            ctx.moveTo(dots[0][0], dots[0][1])
            ctx.beginPath();
            ctx.strokeStyle = 'black'
            for (let i = 1; i < dots.length; i++){
                ctx.lineTo(dots[i][0], dots[i][1])
                ctx.stroke();
            }
        }
    }
}
origin.draw(operations[0])
curImage.setArrays()

function move (dot, dx, dy) {
    return [dot[0] + dx, dot[1] + dy]
}

function scale(dot, kx, ky, center) {
    const x = kx * dot[0] + (1 - kx) * center[0]
    const y = ky * dot[1] + (1 - ky) * center[1]
    return [x, y]
}

function rotate(dot, angle, center) {
    // console.log(dot, angle, center)
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

    kx = parseFloat(kx)
    ky = parseFloat(ky)
    xm = parseFloat(xm)
    ym = parseFloat(ym)

    operation = new Operation('scale', undefined, undefined, kx, ky, [xm, ym])
    operations.push(operation)
    curImage.draw(operation)
    console.log(operations)
    // try {
    // }
    // catch {
    //     alert('invalid input')
    // }
})

document.querySelector('.move').addEventListener('submit', (e) => {
    e.preventDefault();
    dx = e.target.elements.dx.value;
    dy = e.target.elements.dy.value;

    e.target.elements.dx.value = '';
    e.target.elements.dy.value = '';

    dx = parseFloat(dx)
    dy = parseFloat(dy)

    operation = new Operation('move', dx, dy)
    operations.push(operation)
    console.log(operations)
    curImage.draw(operation)
    // try {
    // }
    // catch {
    //     alert('invalid input')
    // }
})


document.querySelector('.rotate').addEventListener('submit', (e) => {
    e.preventDefault();
    angle = e.target.elements.angle.value;
    xm = e.target.elements.xmRotate.value;
    ym = e.target.elements.ymRotate.value;
    
    e.target.elements.angle.value = '';
    e.target.elements.xmRotate.value = '';
    e.target.elements.ymRotate.value = '';

    angle = parseFloat(angle)
    xm = parseFloat(xm)
    ym = parseFloat(ym)

    operation = new Operation('rotate', undefined, undefined, undefined, undefined, undefined, angle, [xm, ym])
    operations.push(operation)
    curImage.draw(operation)
    console.log(operations)
    // try {
    // }
    // catch {
    //     alert('invalid input')
    // }
})

document.querySelector('#initial').addEventListener('click', (e) => {
    origin.draw(operations[0])
})