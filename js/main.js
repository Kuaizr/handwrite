import opentype from 'opentype.js'

const ctx = document.getElementById('canvas').getContext('2d');
const font = await opentype.load('font/hy.ttf');


const write = (text,ctx) => {
    let path = font.getPath(text, 0, 100, 72);
    draw(path,ctx)
}


const draw = (path,ctx) => {

    let rotate = Math.random() / 50
    ctx.rotate(rotate)

    ctx.beginPath();
    for (let i = 0; i < path.commands.length; i += 1) {
        const cmd = path.commands[i];
        if (cmd.type === 'M') {
            ctx.moveTo(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            ctx.lineTo(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            ctx.rotate(-1*rotate)
            ctx.closePath();
            rotate = Math.random() / 50
            ctx.rotate(rotate)
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

write("你好你好你好?",ctx)