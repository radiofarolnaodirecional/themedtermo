var themTggl = false
const btnTheme = document.querySelector('.btn-theme').addEventListener('click', () => {
    if (themTggl) {
        document.querySelector('.container-theme-list').style.display = 'none'
    } else {
        document.querySelector('.container-theme-list').style.display = 'block'
    }
    themTggl = !themTggl
})
const spanThemetxt = document.querySelector('.span-themetxt')
var themef = `tudo`
document.querySelectorAll('.li-theme').forEach((el) => {
    el.addEventListener('click', () => {
        themef = el.textContent
        spanThemetxt.textContent = themef
        document.querySelector('.li-theme.li-active')?.classList.remove('li-active')
        el.classList.add('li-active')
    })
})
document.querySelector('.btn-play').addEventListener('click', () => {
    window.location.href = `/${themef}`
})