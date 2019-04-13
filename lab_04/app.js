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
        //draw(data);
    }
    catch(e) {
        alert(e.message)
    }
})

function valid(data) {
    // strokeColor: 'black',
    // bgColor: 'white',
    // algorithm: undefined,
    // cx: undefined,
    // cy: undefined,
    // r: undefined,
    // a: undefined,
    // b: undefined

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
