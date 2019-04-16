let data = {
    strokeColor: 'black',
    bgColor: 'white',
    algorithm: undefined,
    cx: undefined,
    cy: undefined,

    r: undefined,
    a: undefined,
    b: undefined,
    shape: undefined,
    step: undefined,
    quantity: undefined
}

function findChecked(item) {
    return item.checked
}

document.querySelector('#butCircle').click()

document.querySelector('#clear').addEventListener('click', (e) => {
    e.preventDefault()
    console.log('clean')
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

document.querySelector('#color-alg-input').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e)

    data.bgColor = e.target.elements.bgcolor.value
    data.strokeColor = e.target.elements.scolor.value
    const radios = e.target.elements.algorithm
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            data.algorithm = radios[i].id
            break
        }
    }
    const active = document.querySelector('button.active')
    console.log(active.id)
    if (active.id === 'butCircle') {
        data.cx = document.querySelector('#ccx').value
        data.cy = document.querySelector('#ccy').value
        data.r = document.querySelector('#cr').value
        data.step = document.querySelector('#cstep').value
        data.quantity = document.querySelector('#cn').value
        data.shape = 'circle'
    }
    if (active.id === 'butEllips') {
        data.cx = document.querySelector('#ecx').value
        data.cy = document.querySelector('#ecy').value
        data.a = document.querySelector('#a').value
        data.b = document.querySelector('#b').value
        data.step = document.querySelector('#estep').value
        data.quantity = document.querySelector('#en').value
        data.shape = 'ellips'
    }

    try {
        valid(data);
        console.log(data)
        draw(data);
        console.log(data)
    }
    catch(e) {
        alert(e.message)
    }
})

function valid(data) {
    if (data.algorithm == undefined) {
        throw Error ('Выберете алгоритм')
    }
    if (data.shape === 'circle') {
        if (data.cx == undefined || data.cy == undefined || data.r == undefined || data.quantity == undefined || data.step == undefined)  {
            throw Error ('Введите все необходимые для построения параметры')
        }
        else {
            if (validINput(data.cx) && validINput(data.cy) && validINput(data.r)) {
                data.cx = parseFloat(data.cx)
                data.cy = parseFloat(data.cy)
                data.r = parseFloat(data.r)
                data.quantity = parseInt(data.quantity)
                data.step = parseInt(data.step)
            }
            else {
                throw Error ('Некорректный ввод')
            }
        }
    }
    else if (data.shape === 'ellips') {
        if (data.cx == undefined || data.cy == undefined || data.b == undefined || data.a == undefined || data.quantity == undefined || data.step == undefined) {
            throw Error ('Введите все необходимые для построения параметры')
        }
        else {
            if (validINput(data.cx) && validINput(data.cy) && validINput(data.a) && validINput(data.b)) {
                data.cx = parseFloat(data.cx)
                data.cy = parseFloat(data.cy)
                data.a = parseFloat(data.a)
                data.b = parseFloat(data.b)
                data.quantity = parseInt(data.quantity)
                data.step = parseInt(data.step)
            }
            else {
                throw Error ('Некорректный ввод')
            }
        }
    }
    else {
        throw Error ('undefined shape')
    }
}

function validINput(x) {
    return (!isNaN(x) && x != '')
}

function draw(data) {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    canvas.style.backgroundColor = data.bgColor
    ctx.fillStyle = data.strokeColor
    ctx.strokeStyle = data.strokeColor
    if (data.shape === 'circle') {
        const cx = data.cx
        const cy = data.cy
        let r = data.r
        const step = data.step
        const N = data.quantity

        if (data.algorithm == 'canon') {
            for (let i = 0; i <= N; i++) {
                canon_circle(cx, cy, r, ctx)
                r += step
            }
        }
        else if (data.algorithm == 'param') {
            for (let i = 0; i <= N; i++) {
                param_circle(cx, cy, r, ctx)
                r += step
            }
        }
        else if (data.algorithm == 'brez') {
            for (let i = 0; i <= N; i++) {
                bre_circle(cx, cy, r, ctx)
                r += step
            }
        }
        else if (data.algorithm == 'midpoint') {
            for (let i = 0; i <= N; i++) {
                midpoint_circle(cx, cy, r, ctx)
                r += step
            }
        }
        else {
            for (let i = 0; i <= N; i++) {
                lib_circle(cx, cy, r, ctx)
                r += step
            }
        }
    }
    else {
        const cx = data.cx
        const cy = data.cy
        let a = data.a
        let b = data.b
        let coef = b / a
        const step = data.step
        const N = data.quantity

        if (data.algorithm == 'canon') {
            for (let i = 0; i <= N; i++) {
                canon_ellipse(cx, cy, a, b, ctx)
                a += step
                b = coef * a
            }
        }
        else if (data.algorithm == 'param') {
            for (let i = 0; i <= N; i++) {
                param_ellipse(cx, cy, a, b, ctx)
                a += step
                b = coef * a
            }
        }
        else if (data.algorithm == 'brez') {
            for (let i = 0; i <= N; i++) {
                bre_ellipse(cx, cy, a, b, ctx)
                a += step
                b = coef * a
            }
        }
        else if (data.algorithm == 'midpoint') {
            for (let i = 0; i <= N; i++) {
                midpoint_ellipse(cx, cy, a, b, ctx)
                a += step
                b = coef * a
            }
        }
        else {
            for (let i = 0; i <= N; i++) {
                lib_ellipse(cx, cy, a, b, ctx)
                a += step
                b = coef * a
            }
        }
    }
}