/*

version 0.0.2

*/

const FlBxMain = (()=>{
    document.addEventListener('DOMContentLoaded', () => {
        
        var moveTransMs = 0
        var autoAdj = true

        /*
        in html tag params:

        data-flying_box = "1"                default=1
        data-flbx_text = "some info"
        data-flbx_offset_x = "0"
        data-flbx_offset_y = "0"
        data-flbx_move_trans_ms = "70"
        data-flbx_fontfamily = "sans-serif"
        data-flbx_auto_adj = "true"          default=true
        data-flbx_remove_std_style = "true"  default=false
        data-flbx_box_id = "bx1"
        data-flbx_box2_pos = "bottom/top"    default=top
        */

        /* for all elements with data-fling_box */
        elements = document.querySelectorAll("[data-flying_box]")
        elements.forEach(e => {
            //init vars
            var box2position = 'top'
            var cliOffX = 0
            var cliOffY = 0
            var fontFamily = 'Trebuchet MS, sans-serif'
            var box2widh = null
            var removeStdStyle = false
            if (e.dataset.flbx_offset_x) {
                cliOffX = parseInt(e.dataset.flbx_offset_x)
            }
            if(e.dataset.flbx_offset_y){
                cliOffY = parseInt(e.dataset.flbx_offset_y)
            }
            if (e.dataset.flbx_fontfamily) {
                fontFamily = e.dataset.flbx_fontfamily
            }
            if (e.dataset.flbx_remove_std_style) {
                if(e.dataset.flbx_remove_std_style=='false'){removeStdStyle=false}else if(e.dataset.flbx_remove_std_style=='true'){removeStdStyle=true}else{removeStdStyle=false}
            }
            if (e.dataset.flbx_box2_pos){
                box2position = e.dataset.flbx_box2_pos
            }

            //create the el
            var fbValue = 1; if(parseInt(e.dataset.flying_box)==2){fbValue=2}else{fbValue=1}
            const boxText = e.dataset.flbx_text
            const inTxt = document.createTextNode(boxText)
            const newBox = document.createElement('div')

            box2widh = inTxt.length

            // add id to the box
            if (e.dataset.flbx_box_id) {
                newBox.setAttribute("id", e.dataset.flbx_box_id)
            }

            // add class to the box
            if (fbValue==1){
                document.body.appendChild(newBox)
                newBox.classList.add('flbx-1')
            }else if (fbValue==2){
                // 'e' needs to have a position style (relative, absolute..)
                e.appendChild(newBox)
                newBox.classList.add('flbx-2')
                box2triangle = document.createElement('div')
                box2triangle.classList.add('flbx-2-triangle')
                newBox.appendChild(box2triangle)
                setBox2triangleStyle(box2triangle, box2position, removeStdStyle)
            }
            newBox.appendChild(inTxt)

            setClientVars(e)

            /* posision adjustment based on text char count */
            var offsetX = -boxText.length * 4
            var offsetY = boxText.length * 4
            if (!autoAdj==true) {
                offsetX = 0
                offsetY = 0
            }

            setBoxStyle(newBox, fbValue, cliOffX, cliOffY, fontFamily, removeStdStyle, box2position, box2widh)
            addListeners(e, newBox, offsetX, offsetY, cliOffX, cliOffY, fbValue)
        })

        /* set client variables */
        function setClientVars(e) {
            if (e.dataset.flbx_move_trans_ms) {
                moveTransMs = e.dataset.flbx_move_trans_ms
            }
            if (e.dataset.flbx_auto_adj) {
                if(e.dataset.flbx_auto_adj=="true"){autoAdj=true}else if(e.dataset.flbx_auto_adj=="false"){autoAdj=false}else{autoAdj=true}
            }
        }

        /* add the show/hide and move listeners */
        function addListeners(e, box, offsetX, offsetY, cliOffX, cliOffY, value) {
            e.addEventListener('mouseover', () => {
                box.style.opacity = '1'
            })
            e.addEventListener('mouseleave', () => {
                box.style.opacity = '0'
            })
            if (value==1){
                e.addEventListener('mousemove', (evt) => {

                    // screen border limit ajdust --( just horizontally)
                    var newX = evt.pageX + offsetX + cliOffX - box.clientWidth / 2
                    //var newY = evt.pageY + offsetY + cliOffY - box.clientHeight / 2

                    /* standard Y *///////////////
                    box.style.top = evt.pageY + offsetY + cliOffY - box.clientWidth / 2 + 'px'

                    const boxWidth = box.clientWidth
                    //const boxHeight = box.clientHeight
                    const screenWidth = window.innerWidth
                    //const screenHeight = window.innerHeight

                    if (newX < 0) {
                        newX = 0
                    } else if (newX + boxWidth > screenWidth) {
                        newX = screenWidth - boxWidth
                    }

                    // if (newY < 0) {
                    //     newY = 0
                    // } else if (newY + boxHeight > screenHeight) {
                    //     newY = screenHeight - boxHeight
                    // }

                    box.style.left = `${newX}px`
                    // box.style.top = `${newY}px`
                })
            }
        }

        /* stylize the box created according to parameter */
        function setBoxStyle(e, n, cliOffX, cliOffY, fontFamily, removeStdStyle, box2position, box2widh) {

            if (removeStdStyle) {return}

            if(n==1){
                e.style.fontFamily = `${fontFamily}`
                e.style.fontSize = '0.9rem'
                e.style.backgroundColor = '#505050'
                e.style.padding = '0.1rem'
                e.style.border = '1px solid #999999'
                e.style.borderRadius = '3px'
                e.style.position = 'absolute'
                e.style.top = '0%'
                e.style.left = '0%'
                e.style.zIndex = '999'
                e.style.color = '#e4e4e4'
                e.style.pointerEvents = 'none'
                e.style.opacity = '0'
                e.style.transition = `${moveTransMs}ms`
            }

            if(n==2){
                e.style.fontFamily = `${fontFamily}`
                e.style.fontSize = '0.9rem'
                e.style.backgroundColor = 'grey'
                e.style.padding = '0.1rem'
                e.style.border = 'none'
                e.style.borderRadius = '3px'
                e.style.position = 'absolute'
                e.style.left = `calc(50% + ${cliOffY}px)`
                e.style.transform = 'translateX(-50%)'
                e.style.zIndex = '999'
                e.style.color = '#e4e4e4'
                e.style.pointerEvents = 'none'
                e.style.opacity = '0'
                e.style.width = `${box2widh + 3}ch`
                e.style.height = '3ch'
                e.style.textAlign = 'center'
                e.style.transition = `${moveTransMs}ms`
                if (box2position=='top') {
                    e.style.top = `calc(-25px + ${cliOffX}px)`
                }else if (box2position=='bottom') {
                    e.style.bottom = `calc(-25px + ${cliOffX}px)`
                }else{
                    e.style.top = `calc(-25px + ${cliOffX}px)`
                }
            }
        }
        function setBox2triangleStyle(e, box2position, removeStdStyle) {
            if (removeStdStyle) {return}
            e.style.position = 'absolute'
            e.style.left = '50%'
            e.style.transform = 'rotate(45deg) translateY(50%)'
            e.style.width = '5px'
            e.style.height = '5px'
            e.style.backgroundColor = 'grey'
            e.style.zIndex = '9'
            if (box2position=='top'){
                e.style.bottom = '0px'
            }else if (box2position=='bottom'){
                e.style.top = '-3px'
            }else{
                e.style.bottom = '0px'
            }
        }

    })
})()

// implement by function

/*
<div class="myinfobox"> Info </div>
<div onmouseover="bxappear('.myinfobox')" onmouseleave="bxdisappear('.myinfobox')"> Element </div>
*/

var mouseMoveHdl = null
function bxappear(boxSelector, offsetX = 45, offsetY = 35) {
    const box = document.querySelector(boxSelector);
    if (!box) return;
    
    box.style.display = "block";

    mouseMoveHdl = (e) => {
        box.style.left = e.pageX + offsetX - box.clientWidth / 2 + "px";
        box.style.top = e.pageY + offsetY - box.clientHeight / 2 + "px";
    }
    
    document.addEventListener('mousemove', mouseMoveHdl)
}

function bxdisappear(boxSelector) {
    const box = document.querySelector(boxSelector);
    if (!box) return;

    box.style.display = "none";

    if (mouseMoveHdl) {
        document.removeEventListener('mousemove', mouseMoveHdl)
        mouseMoveHdl = null
    }
}
