import opentype from 'opentype.js';
import { processText, createBound, mouseBind, getStyle } from "./utils";
import { write, clearArea, saveState, undo, saveImg } from "./draw";


//初始化默认配置
let fontsize = 30
let Horizontal = 4
let Vertical = 9.5
let route = 10
let topBoundary = 60
let buttomBoundary = 700
let leftBoundary = 70
let rightBoundary = 1040

//操作各项dom元素
let saveButton = document.getElementById("save")
let undoButton = document.getElementById("undo")
let renderButton = document.getElementById("render")
let clearButton = document.getElementById("clear")
let clearAllButton = document.getElementById("clearAll")

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
let [topBound, buttomBound, leftBound, rightBound, showBound] = createBound(text)


//操作各种事件
showBound()
let showBoundTime;
text.onmouseenter = () => {
    if (!topBound.style.display || topBound.style.display == "none") {
        showBound()
    }
    if(showBoundTime){
        clearTimeout(showBoundTime);
    }
}
text.onmouseleave = () => {
    showBoundTime = setTimeout(() => {
        showBound()
        showBoundTime = null
    }, 3000);
}

mouseBind(topBound, (x, y) => {
    topBound.style.top = y + "px"
    topInput.value = y
    topBoundary = y
})

mouseBind(buttomBound, (x, y) => {
    buttomBound.style.top = y + "px"
    buttomInput.value = y
    buttomBoundary = y
})

mouseBind(leftBound, (x, y) => {
    leftBound.style.left = x + "px"
    leftInput.value = x
    leftBoundary = x
})

mouseBind(rightBound, (x, y) => {
    rightBound.style.left = x + "px"
    rightInput.value = x
    rightBoundary = x
})

topInput.oninput  = ()=>{
    topBound.style.top = topInput.value + "px"
    topBoundary = parseInt(topInput.value)
    topBound.style.display = "block"
}

buttomInput.oninput  = ()=>{
    buttomBound.style.top = buttomInput.value + "px"
    buttomBoundary = parseInt(buttomInput.value)
    buttomBound.style.display = "block"
}

leftInput.oninput  = ()=>{
    leftBound.style.left = leftInput.value + "px"
    leftBoundary = parseInt(leftInput.value)
    leftBound.style.display = "block"
}

rightInput.oninput  = ()=>{
    rightBound.style.left = rightInput.value + "px"
    rightBoundary = parseInt(rightInput.value)
    rightBound.style.display = "block"
}

fontsizeInput.oninput  = ()=>{

    fontsize = parseInt(fontsizeInput.value)
}

HorizontalInput.oninput  = ()=>{
    Horizontal = parseInt(HorizontalInput.value)
}

VerticalInput.oninput  = ()=>{
    Vertical = parseInt(VerticalInput.value)
}

routeInput.oninput  = ()=>{
    route = parseInt(routeInput.value)
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
topInput.value = topBoundary
buttomInput.value = buttomBoundary
leftInput.value = leftBoundary
rightInput.value = rightBoundary





// let str = "你好，我是kzer,我现在在测试这个程序，现在程序已经做到了对汉字笔画（指字体中联通的区域）进行随机扰动，上下位移，支持自定义行间距，字间距等，意图产生更加真实的手写字来应付我的手写作业你好，我是kzer,我现在在测试这个程序，现在程序已经做到了对汉字笔画（指字体中联通的区域）进行随机扰动，上下位移，支持自定义行间距，字间距等，意图产生更加真实的手写字来应付我的手写作业你好，我是kzer,我现在在测试这个程序，现在程序已经做到了对汉字笔画（指字体中联通的区域）进行随机扰动，上下位移，支持自定义行间距，字间距等，意图产生更加真实的手写字来应付我的手写作业你好，我是kzer,我现在在测试这个程序，现在程序已经做到了对汉字笔画（指字体中联通的区域）进行随机扰动，上下位移，支持自定义行间距，字间距等，意图产生更加真实的手写字来应付我的手写作业你好，我是kzer,我现在在测试这个程序，现在程序已经做到了对汉字笔画（指字体中联通的区域）进行随机扰动，上下位移，支持自定义行间距，字间距等，意图产生更加真实的手写字来应付我的手写作业你好，我是kzer,我现在在测试这个程序，现在程序已经做到了对汉字笔画（指字体中联通的区域）进行随机扰动，上下位移，支持自定义行间距，字间距等，意图产生更加真实的手写字来应付我的手写作业"
// let str = "你好，我是kzer,123321.333\n123"

let font = await opentype.load('font/云烟体.ttf');



let canvas = document.createElement('canvas')
canvas.width = text.style.width.replace("px", "")
canvas.height = text.style.height.replace("px", "")
text.appendChild(canvas)
let ctx = canvas.getContext('2d')
let ctxHistory = []


render.onclick = ()=>{
    saveState(canvas,ctxHistory)
    let str = textareaInput.value
    write(
        str,
        ctx,
        font,
        fontsize,
        [Horizontal, Vertical],
        [leftBoundary, rightBoundary, topBoundary, buttomBoundary],
        route
    )
}

clearButton.onclick = () => {
    saveState(canvas,ctxHistory)
    clearArea(ctx,[leftBoundary, rightBoundary, topBoundary, buttomBoundary])
}

clearAllButton.onclick = () => {
    saveState(canvas,ctxHistory)
    clearArea(ctx,[0, parseInt(getStyle(text,"width").replace("px","")), 0,  parseInt(getStyle(text,"height").replace("px",""))])
}

undoButton.onclick = () => {
    if(ctxHistory.length != 0){
        undo(ctx,canvas,ctxHistory)
    }
}

saveButton.onclick = () => {
    saveImg(canvas)
}