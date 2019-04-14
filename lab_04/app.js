let data = {
    strokeColor: 'black',
    bgColor: 'white',
    algorithm: undefined,
    cx: undefined,
    cy: undefined,
    r: undefined,
    a: undefined,
    b: undefined,
    shape: undefined
}

function findChecked(item) {
    return item.checked
}

document.querySelector('#butCircle').click()

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
        data.shape = 'circle'
    }
    if (active.id === 'butEllips') {
        data.cx = document.querySelector('#ecx').value
        data.cy = document.querySelector('#ecy').value
        data.a = document.querySelector('#a').value
        data.b = document.querySelector('#b').value
        data.shape = 'ellips'
    }

    try {
        valid(data);
        console.log(data)
        draw(data);
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
        if (data.cx == undefined || data.cy == undefined || data.r == undefined) {
            throw Error ('Введите все необходимые для построения параметры')
        }
        else {
            if (validINput(data.cx) && validINput(data.cy) && validINput(data.r)) {
                data.cx = parseFloat(data.cx)
                data.cy = parseFloat(data.cy)
                data.r = parseFloat(data.r)
            }
            else {
                throw Error ('Некорректный ввод')
            }
        }
    }
    else if (data.shape === 'ellips') {
        if (data.cx == undefined || data.cy == undefined || data.b == undefined || data.a == undefined) {
            throw Error ('Введите все необходимые для построения параметры')
        }
        else {
            if (validINput(data.cx) && validINput(data.cy) && validINput(data.a) && validINput(data.b)) {
                data.cx = parseFloat(data.cx)
                data.cy = parseFloat(data.cy)
                data.a = parseFloat(data.a)
                data.b = parseFloat(data.b)
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
        const r = data.r
        if (data.algorithm == 'canon') {canon_circle(cx, cy, r, ctx)}
        else if (data.algorithm == 'param') {param_circle(cx, cy, r, ctx)}
        else if (data.algorithm == 'brez') {bre_circle(cx, cy, r, ctx)}
        else if (data.algorithm == 'midpoint') {midpoint_circle(cx, cy, r, ctx)}
        else {lib_circle(cx, cy, r, ctx)}
    }
    else {
        const cx = data.cx
        const cy = data.cy
        const a = data.a
        const b = data.b
        if (data.algorithm == 'canon') {canon_ellipse(cx, cy, a, b, ctx)}
        else if (data.algorithm == 'param') {param_ellipse(cx, cy, a, b, ctx)}
        else if (data.algorithm == 'brez') {bre_ellipse(cx, cy, a, b, ctx)}
        else if (data.algorithm == 'midpoint') {midpoint_ellipse(cx, cy, a, b, ctx)}
        else {lib_ellipse(cx, cy, a, b, ctx)}
    }
}
