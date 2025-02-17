document.addEventListener('DOMContentLoaded', async ( ) => {
    var themTggl = false
    document.querySelector('.btn-theme').addEventListener('click', () => {
        if (themTggl) {
            document.querySelector('.container-theme-list').style.display = 'none'
        } else {
            document.querySelector('.container-theme-list').style.display = 'block'
        }
        themTggl = !themTggl
    })
    const spanThemetxt = document.querySelector('.span-themetxt')
    var themef = `all`
    document.querySelectorAll('.li-theme').forEach((el) => {
        el.addEventListener('click', () => {
            spanThemetxt.textContent = el.textContent.replace('!', '')
            themef = el.dataset.theme
            document.querySelector('.li-theme.li-active')?.classList.remove('li-active')
            el.classList.add('li-active')
        })
    })
    var colNum = 1
    document.querySelectorAll('.columnsopt').forEach((el) => {
        el.addEventListener('click', () => {
            colNum = parseInt(el.textContent)
            document.querySelector('.columnsopt.columnsopt-active')?.classList.remove('columnsopt-active')
            el.classList.add('columnsopt-active')
        })
    })
    Array.prototype.random = function () {
        return this[Math.floor((Math.random()*this.length))];
    }
    document.querySelector('.btn-play').addEventListener('click', () => {
        var tm = themef

        if (themef == 'aleatorio') {
            tm = ['all', 'objeto', 'tecnologia'].random()
        }

        if (colNum == 1) {
            window.location.href = `/${tm}`
        } else {
            window.location.href = `/${colNum}/${tm}`
        }
    })
    // past games
    function percentWon(win, lose) {

        if (win == 0 && lose > 0) {
            return 0
        }
        if (lose == 0 && win > 0) {
            return 100
        }

        val = (win / (win + lose)) * 100
        return val
    }
    function gamesAndStat() {
        var gWon = 0
        var gLose = 0
        document.querySelector('.no-past-games').remove()
        var lIt = 0
        Object.keys(localStorage).sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })).forEach((key) => {
            lIt ++
            var value = localStorage.getItem(key).split(',')
            const newEl = document.createElement('li')
            var stat = null
            if (value[0] == 'false') {
                stat = '<span style="color: rgba(230, 35, 13, 0.8); margin: 0 5px;">:(</span>'
                gLose ++
            } else {
                stat = '<span style="color: rgb(81, 185, 72); margin: 0 5px;">vitória</span>'
                gWon ++
            }
            newEl.style.display = 'flex'
            newEl.innerHTML = ` ${stat} <div> ${value.splice(1, 6)} </div> <div style="margin-left: auto;"> ${key.split('_')[0]} </div>`
            const container = document.querySelector('.list-past-games')
            if (lIt <= 3) {
                container.appendChild(newEl)
            }
            
        })
        var walPer = percentWon(gWon, gLose)
        document.querySelector('.vic-graph-val').textContent = `${parseInt(walPer)}%`
        document.querySelector('.vic-graph').style.backgroundColor = 'rgb(145, 53, 53)'
        const walPerBar = document.querySelector('.vic-graph-bar')
        walPerBar.style.backgroundColor = 'rgb(81, 185, 72)'
        walPerBar.style.width = `${walPer}%`
    }
    if (Object.keys(localStorage).length === 0) {
        //
    } else {
        gamesAndStat()
    }
    const time = await fetch(`/date-time`).then(r => r.json())
    const initialTime = time.time
    const intervalo = setInterval( ( ) => {
        var [horas, minutos, segundos] = initialTime.split(":").map(Number)
        var segundosTotaisIniciais = horas * 3600 + minutos * 60 + segundos
        var segundosTotaisMeta = 24 * 3600
        var distancia = segundosTotaisMeta - segundosTotaisIniciais
        if (distancia <= 0) {
            document.querySelector('.time-reset').textContent = '00:00:00'
            clearInterval(intervalo)
            return
        }
        var h = Math.floor(distancia / 3600)
        var m = Math.floor((distancia % 3600) / 60)
        var s = distancia % 60
        document.querySelector('.time-reset').textContent = `${h}h ${m}m` // ${s}s`
    }, 1000)
})