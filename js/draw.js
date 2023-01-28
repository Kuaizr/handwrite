import opentype from 'opentype.js';
import { processText } from "./utils";

const rotateT = (x0, y0, x, y, a) => {
    let _x = (x - x0) * Math.cos(a) - (y - y0) * Math.sin(a) + x0
    let _y = (y - y0) * Math.cos(a) + (x - x0) * Math.sin(a) + y0
    return [_x, _y]
}

const drawText = (path, ctx, points) => {
    let index = 0
    let distence = []
    let a = 0
    ctx.beginPath();
    for (let i = 0; i < path.commands.length; i += 1) {
        const cmd = path.commands[i];
        if (cmd.type === 'M') {

            a = -Math.PI / 15 * Math.random() * (Math.random() > 0.5 ? 1 : -1)
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

const getPoints = (path) => {
    let glypes = []
    let tempGlype = []
    for (let i = 0; i < path.commands.length; i++) {
        tempGlype.push(path.commands[i])
        if (path.commands[i].type == "Z") {
            glypes.push(tempGlype)
            tempGlype = []
        }
    }
    let minx = 10000
    let maxx = 0
    let points = []

    for (let i = 0; i < glypes.length; i++) {
        let temppath = new opentype.Path()
        temppath.commands = glypes[i]
        let box = temppath.getBoundingBox()

        if (box.x1 > maxx) {
            maxx = box.x1
        }
        if (box.x1 < minx) {
            minx = box.x1
        }
        if (box.x2 > maxx) {
            maxx = box.x2
        }
        if (box.x2 < minx) {
            minx = box.x2
        }

        points.push([(box.x1 + box.x2) / 2, (box.y1 + box.y2) / 2])
    }

    return [points, maxx - minx]
}


export const write = (text,ctx,font,fontsize,space,boundary) => {
    let [Horizontal, Vertical] = space
    let [leftBoundary, rightBoundary, topBoundary, buttomBoundary] = boundary
    //初始化边界
    ctx.translate(leftBoundary,topBoundary)
    let Vlimit = rightBoundary - leftBoundary
    let Hlimit = buttomBoundary - topBoundary
    //处理文字
    let words = processText(text)
    let widths = 0
    let heights = fontsize
    for (let i = 0; i < words.length; i++) {
        let path = font.getPath(words[i], 0, fontsize, fontsize)
        let [points, width] = getPoints(path)
        if (widths + width + Horizontal > Vlimit) {
            ctx.translate(-widths, fontsize + Vertical)
            widths = 0
            heights = heights + fontsize + Vertical
            if(heights > Hlimit){
                console.log("文字超过了")
                return words.slice(i)
            }
        }
        drawText(path, ctx, points)
        ctx.translate(width + Horizontal, 0)
        widths += (width + Horizontal)
    }

}