import opentype from 'opentype.js';
import { processText } from "./utils";

const font = await opentype.load('font/云烟体.ttf');

let fontsize = 30
let Horizontal = 10
let Vertical = 10
let x = 10
let y = 10
let str = "你好，我是kzer,我现在在测试这个程序，现在程序已经做到了对汉字笔画（指字体中联通的区域）进行随机扰动，上下位移，支持自定义行间距，字间距等，意图产生更加真实的手写字来应付我的手写作业"


const rotateT = (x0, y0, x, y, a) => {
    let _x = (x - x0) * Math.cos(a) - (y - y0) * Math.sin(a) + x0
    let _y = (y - y0) * Math.cos(a) + (x - x0) * Math.sin(a) + y0
    return [_x, _y]
}

const draw = (path, ctx, points) => {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(1000, 0)
    // ctx.moveTo(0, 0)
    // ctx.lineTo(0, 1000)
    ctx.stroke()
    ctx.closePath()
    let index = 0
    let distence = []
    let a = 0
    ctx.beginPath();
    for (let i = 0; i < path.commands.length; i += 1) {
        const cmd = path.commands[i];
        if (cmd.type === 'M') {

            a = -Math.PI / 20 * Math.random() * (Math.random() > 0.5 ? 1 : -1)
            distence = rotateT(points[index][0], points[index][1], 0, 0, -a)
            ctx.translate(distence[0], distence[1])
            ctx.rotate(-a)

            ctx.moveTo(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            ctx.lineTo(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            ctx.rotate(a)
            ctx.translate(-distence[0], -distence[1])
            index += 1
            ctx.closePath();
        }
    }
    if (path.fill) {
        ctx.fillStyle = path.fill;
        ctx.fill();
    }
    if (path.stroke) {
        ctx.strokeStyle = path.stroke;
        ctx.lineWidth = path.strokeWidth;
        ctx.stroke();
    }

}

const getGlypes = (path) => {
    let glypes = []
    let tempGlype = []
    for (let i = 0; i < path.commands.length; i++) {
        tempGlype.push(path.commands[i])
        if (path.commands[i].type == "Z") {
            glypes.push(tempGlype)
            tempGlype = []
        }
    }
    return glypes
}

const getPoints = (glypes) => {
    let minx = 10000
    let maxx = 0
    let points = []

    for (let i = 0; i < glypes.length; i++) {
        let temppath = new opentype.Path()
        temppath.commands = glypes[i]
        let box = temppath.getBoundingBox()

        if(box.x1 > maxx){
            maxx = box.x1
        }
        if(box.x1 < minx){
            minx = box.x1
        }
        if(box.x2 > maxx){
            maxx = box.x2
        }
        if(box.x2 < minx){
            minx = box.x2
        }

        points.push([(box.x1 + box.x2) / 2, (box.y1 + box.y2) / 2])
    }

    return [points,maxx-minx+Horizontal]
}

let text = document.getElementById("text")
let canvas = document.createElement('canvas')
canvas.width = text.style.width.replace("px","")
canvas.height = text.style.height.replace("px","")
text.appendChild(canvas)
let ctx = canvas.getContext('2d')

let words = processText(str)
let widthCount = 0
for (let i = 0; i < words.length; i++) {
    let path = font.getPath(words[i], 0, fontsize, fontsize)
    let glypes = getGlypes(path)
    let [points,width] = getPoints(glypes)
    if(widthCount + width > parseInt(canvas.width)){
        ctx.translate(-widthCount,fontsize+Vertical)
        widthCount = 0
    }
    draw(path,ctx,points)
    ctx.translate(width,0)
    widthCount += width
}