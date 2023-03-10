import opentype from 'opentype.js';
import { processText } from "./utils";

const rotateT = (x0, y0, x, y, a) => {
    let _x = (x - x0) * Math.cos(a) - (y - y0) * Math.sin(a) + x0
    let _y = (y - y0) * Math.cos(a) + (x - x0) * Math.sin(a) + y0
    return [_x, _y]
}

const drawCoordinate = (ctx) => {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, 100)
    ctx.moveTo(0, 0)
    ctx.lineTo(100, 0)
    ctx.stroke()
    ctx.closePath()
}

const drawText = (path, ctx, points, route, offset,fontsize) => {
    let index = 0
    let distence = []
    let a = 0
    let vd = 0
    let hd = 0
    ctx.beginPath();
    for (let i = 0; i < path.commands.length; i += 1) {
        const cmd = path.commands[i];
        if (cmd.type === 'M') {

            a = -1 * route * Math.PI / 150 * Math.random() * (Math.random() > 0.5 ? 1 : -1)
            vd = offset * fontsize / 250 * Math.random() * (Math.random() > 0.5 ? 1 : -1)
            hd = offset * fontsize / 250 * Math.random() * (Math.random() > 0.5 ? 1 : -1)

            distence = rotateT(points[index][0], points[index][1], 0, 0, -a)
            ctx.translate(distence[0]+hd, distence[1]+vd)
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
            ctx.translate(-distence[0]-hd, -distence[1]-vd)
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


export const saveState = (canvas, history) => {
    history.push(canvas.toDataURL());
}

export const saveImg = (canvas) => {
    canvas.toBlob((blob) => {
        const timestamp = Date.now().toString();
        const a = document.createElement('a');
        document.body.append(a);
        a.download = `${timestamp}.png`;
        a.href = URL.createObjectURL(blob);
        a.click();
        a.remove();
    });
}

export const undo = (ctx, canvas, history) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let canvasPic = new Image();
    canvasPic.src = history.pop();
    canvasPic.addEventListener('load', () => {
        ctx.drawImage(canvasPic, 0, 0);
    });
}

export const clearArea = (ctx, boundary) => {
    let [leftBoundary, rightBoundary, topBoundary, buttomBoundary] = boundary
    ctx.clearRect(leftBoundary,
        topBoundary,
        rightBoundary - leftBoundary,
        buttomBoundary - topBoundary)
}


export function write(words, ctx, font, fontsize, space, boundary, route, offset) {
    let [Horizontal, Vertical] = space
    let [leftBoundary, rightBoundary, topBoundary, buttomBoundary] = boundary
    //???????????????
    ctx.translate(leftBoundary, topBoundary)
    let Vlimit = rightBoundary - leftBoundary
    let Hlimit = buttomBoundary - topBoundary
    //????????????
    let widths = 0
    let heights = fontsize
    for (let i = 0; i < words.length; i++) {
        if (words[i] == " ") {
            let width = fontsize / 2
            if (widths + width + Horizontal > Vlimit) {
                ctx.translate(-widths, fontsize + Vertical)
                widths = 0
                heights = heights + fontsize + Vertical
                if (heights > Hlimit) {
                    console.log("???????????????")
                    ctx.translate(-widths, -(heights - fontsize))
                    ctx.translate(-leftBoundary, -topBoundary)
                    return words.slice(i)
                }
            }
            ctx.translate(width + Horizontal, 0)
            widths += (width + Horizontal)

        } else if (words[i] == "\n") {
            ctx.translate(-widths, fontsize + Vertical)
            widths = 0
            heights = heights + fontsize + Vertical
            if (heights > Hlimit) {
                console.log("???????????????")
                ctx.translate(-widths, -(heights - fontsize))
                ctx.translate(-leftBoundary, -topBoundary)
                return words.slice(i)
            }

        } else {
            let path = font.getPath(words[i], 0, fontsize, fontsize)
            if (path.commands.length == 0) {
                path = font.getPath("#", 0, fontsize, fontsize)
                path.fill = "red"
            }
            let [points, width] = getPoints(path)
            if (widths + width + Horizontal > Vlimit) {
                ctx.translate(-widths, fontsize + Vertical)
                widths = 0
                heights = heights + fontsize + Vertical
                if (heights > Hlimit) {
                    console.log("???????????????")
                    ctx.translate(-widths, -(heights - fontsize))
                    ctx.translate(-leftBoundary, -topBoundary)
                    return words.slice(i)
                }
            }
            drawText(path, ctx, points, route , offset ,fontsize)
            ctx.translate(width + Horizontal, 0)
            widths += (width + Horizontal)
        }
    }

    ctx.translate(-widths, -(heights - fontsize))
    ctx.translate(-leftBoundary, -topBoundary)
    return ""
}