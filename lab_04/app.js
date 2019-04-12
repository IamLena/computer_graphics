document.querySelector('#butCircle').click()

document.querySelector('#color-alg-input').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e)

    const active = document.querySelector('button.active')
    console.log(active.id)
    if (active.id === 'butCircle') {
        const input = document.querySelector('#ccx')
        console.log(input.value)
    }
    if (active.id === 'butEllips') {
        const input = document.querySelector('#ecx')
        console.log(input.value)
    }
})

