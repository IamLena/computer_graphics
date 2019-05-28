function random(min, max) {
    let x = Math.random() * (max - min) + min;
    let y = Math.random() * (max - min) + min;
    x = Math.round(x)
    y = Math.round(y)
    return [x, y]
}

const generatePlus = function (x, y) {
    return `${x} + ${y} = `  
}

const generateMinus = function (x, y) {
    return `${x} - ${y} = `  
}

function generateMult (x, y) {
    return `${x} * ${y} = ` 
}

function generateDOM(i, func, min, max) {
    let element = document.createElement("label");
    let xy = random(min, max);
    element.innerText = func(xy[0], xy[1])
    let input = document.createElement("input");
    input.id = `in${i}`
    let res = xy[0] + xy[1]
    input.name = `${res}`
    element.appendChild(input)
    return element;
}

let num = 5
let index = 0
const col1 = document.querySelector('#col1')
const col2 = document.querySelector('#col2')

function fillCol (col, func, min, max, num) {
    for (let i = 0; i < num; i++) {
        let element = generateDOM(index, func, min, max);
        col.appendChild(element)
        index += 1;
    }
}

fillCol(col1, generatePlus, 0, 10, 5)
fillCol(col2, generatePlus, 0, 10, 5)
fillCol(col3, generatePlus, 0, 10, 5)
fillCol(col4, generatePlus, 0, 10, 5)
fillCol(col5, generatePlus, 0, 10, 5)

document.querySelector('form').addEventListener('submit', (e) => {
    var end = new Date().getTime();
    var time = ((end - start) * 0.001 / 60).toFixed(3);
    let errors = 0
    e.preventDefault();
    let inputs = e.target.elements
    let len = inputs.length - 1
    for (let i = 0; i < len; i++) {
        let edit = inputs[i]
        let data = convertToInt(edit.value)
        let res = convertToInt(edit.name)
        if (data != NaN) {
            if (res == data) {
                edit.style.backgroundColor = 'green'
            }
            else {
                edit.style.backgroundColor = 'red'
                errors += 1
            }
        }
        else {
            edit.style.backgroundColor = 'red'
            errors += 1
        }
    }
    pRes.innerText = `${len - errors} of ${len} are correct. You have done ${errors} mistakes. Your time is ${time} mins.`
})

function convertToInt(x) {
    if (x == '' || isNaN(x)) {
        return NaN
    }
    if (x - Math.round(x) != 0) {
        return NaN
    }
    return parseInt(x)
}

var start = new Date().getTime();
const pRes = document.querySelector('#result')