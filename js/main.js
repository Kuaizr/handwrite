import opentype from 'opentype.js';
import { processText, createBound, mouseBind, getStyle, fileReader } from "./utils";
import { write, clearArea, saveState, undo, saveImg } from "./draw";


//初始化默认配置
let fontsize = 30
let Horizontal = 4
let Vertical = 9.5
let route = 10
let topBoundary = 63
let buttomBoundary = 700
let leftBoundary = 35
let rightBoundary = 1012
let offset = 0

//操作各项dom元素
let saveButton = document.getElementById("save")
let undoButton = document.getElementById("undo")
let renderButton = document.getElementById("render")
let clearButton = document.getElementById("clear")
let clearAllButton = document.getElementById("clearAll")
let confirm = document.getElementById("confirm")
let select = document.getElementById("select")

let text = document.getElementById("text")
let imgfileInput = document.getElementById("imgfile")
let fontfileInput = document.getElementById("fontfile")
let textareaInput = document.getElementById("textarea")
let routeInput = document.getElementById("route")
let fontsizeInput = document.getElementById('fontsize')
let HorizontalInput = document.getElementById('Horizontal')
let VerticalInput = document.getElementById('Vertical')
let topInput = document.getElementById('topinput')
let buttomInput = document.getElementById('buttominput')
let leftInput = document.getElementById('leftinput')
let rightInput = document.getElementById('rightinput')
let offsetInput = document.getElementById('offsetInput')
let [topBound, buttomBound, leftBound, rightBound, showBound] = createBound(text)

mouseBind(topBound, (x, y) => {
    if(y >= buttomBoundary - 50){
        y = buttomBoundary - 50
    }
    topBound.style.top = y + "px"
    topInput.value = y
    topBoundary = y
})

mouseBind(buttomBound, (x, y) => {
    if(y <= topBoundary + 50){
        y = topBoundary + 50
    }
    buttomBound.style.top = y + "px"
    buttomInput.value = y
    buttomBoundary = y
})

mouseBind(leftBound, (x, y) => {
    if(x >= rightBoundary - 50){
        x = rightBoundary - 50
    }
    leftBound.style.left = x + "px"
    leftInput.value = x
    leftBoundary = x
})

mouseBind(rightBound, (x, y) => {
    if(x <= leftBoundary + 50){
        x = leftBoundary + 50
    }
    rightBound.style.left = x + "px"
    rightInput.value = x
    rightBoundary = x
})

// canvas
let canvas
let ctx
let ctxHistory = []

const initPaper = (width,height) => {
    if(canvas){
        canvas.remove()
    }
    text.style.width = width
    text.style.height = height

    topBound.style.width = width
    buttomBound.style.width = width
    leftBound.style.height = height
    rightBound.style.height = height

    canvas = document.createElement('canvas')
    canvas.width = text.style.width.replace("px", "")
    canvas.height = text.style.height.replace("px", "")
    text.appendChild(canvas)
    ctx = canvas.getContext('2d')
    ctxHistory = []
}

initPaper("1050px","1485px")

//操作各种事件
showBound()
let showBoundTime;
text.onmouseenter = () => {
    if (!topBound.style.display || topBound.style.display == "none") {
        showBound()
    }
    if (showBoundTime) {
        clearTimeout(showBoundTime);
    }
}
text.onmouseleave = () => {
    showBoundTime = setTimeout(() => {
        showBound()
        showBoundTime = null
    }, 3000);
}

topInput.oninput = () => {
    topBound.style.top = topInput.value + "px"
    topBoundary = parseInt(topInput.value)
    topBound.style.display = "block"
}

buttomInput.oninput = () => {
    buttomBound.style.top = buttomInput.value + "px"
    buttomBoundary = parseInt(buttomInput.value)
    buttomBound.style.display = "block"
}

leftInput.oninput = () => {
    leftBound.style.left = leftInput.value + "px"
    leftBoundary = parseInt(leftInput.value)
    leftBound.style.display = "block"
}

rightInput.oninput = () => {
    rightBound.style.left = rightInput.value + "px"
    rightBoundary = parseInt(rightInput.value)
    rightBound.style.display = "block"
}

fontsizeInput.oninput = () => {

    fontsize = parseInt(fontsizeInput.value)
}

HorizontalInput.oninput = () => {
    Horizontal = parseInt(HorizontalInput.value)
}

VerticalInput.oninput = () => {
    Vertical = parseInt(VerticalInput.value)
}

routeInput.oninput = () => {
    route = parseInt(routeInput.value)
}

offsetInput.oninput = () => {
    offset = parseInt(offsetInput.value)
}

//设置各项初始值
topBound.style.top = topBoundary + "px"
buttomBound.style.top = buttomBoundary + "px"
leftBound.style.left = leftBoundary + "px"
rightBound.style.left = rightBoundary + "px"
fontsizeInput.value = fontsize
HorizontalInput.value = Horizontal
VerticalInput.value = Vertical
routeInput.value = route
offsetInput.value = offset
topInput.value = topBoundary
buttomInput.value = buttomBoundary
leftInput.value = leftBoundary
rightInput.value = rightBoundary

let font;

render.onclick = () => {
    if(font == null){
        alert("请先选择字体")
        return;
    }
    saveState(canvas, ctxHistory)
    let str = textareaInput.value
    textareaInput.value = write(
                                str,
                                ctx,
                                font,
                                fontsize,
                                [Horizontal, Vertical],
                                [leftBoundary, rightBoundary, topBoundary, buttomBoundary],
                                route,
                                offset
                            )
}

clearButton.onclick = () => {
    saveState(canvas, ctxHistory)
    clearArea(ctx, [leftBoundary, rightBoundary, topBoundary, buttomBoundary])
}

clearAllButton.onclick = () => {
    saveState(canvas, ctxHistory)
    clearArea(ctx, [0, parseInt(getStyle(text, "width").replace("px", "")), 0, parseInt(getStyle(text, "height").replace("px", ""))])
}

undoButton.onclick = () => {
    if (ctxHistory.length != 0) {
        undo(ctx, canvas, ctxHistory)
    }
}

saveButton.onclick = () => {
    saveImg(canvas)
}


imgfileInput.onchange = (e) => {
    let img = document.getElementById('img')
    let [url,name] = fileReader(imgfileInput)
    img.src = url
    imgfileInput.parentNode.firstChild.textContent = name
}

fontfileInput.onchange = (e) => {
    let [url,name] = fileReader(fontfileInput)
    fontfileInput.parentNode.firstChild.textContent = name
    opentype.load(url,(e,f) => {
        if(e){
            alert("字体文件解析错误，重试或者请换一个字体文件")
        }else{
            font = f
        }
    })
}

confirm.onclick = () => {
    let width = document.getElementById("paperwidth").value
    let height = document.getElementById("paperhight").value
    if(width == "" || height == ""){
        // 切换到A4
        select.value = "A4"
        document.getElementById("paperwidth").value = 1050
        document.getElementById("paperhight").value = 1485
        initPaper(1050+"px",1485+"px")

    }else{
        initPaper(width+"px",height+"px")
    }
}

select.oninput = () => {
    if(select.value == "A4"){
        document.getElementById("paperwidth").value = 1050
        document.getElementById("paperhight").value = 1485
    }else if(select.value == "16开"){
        document.getElementById("paperwidth").value = 930
        document.getElementById("paperhight").value = 1290
    }
}