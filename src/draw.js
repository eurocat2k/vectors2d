// 2D Vectors Video
// https://youtu.be/nzyOCd9FcCA

const myCanvas = document.getElementById('canvas')
const ctx = myCanvas.getContext("2d");
canvas.width = document.body.offsetWidth
canvas.height = document.body.offsetHeight

let isPressed = false

const offset = [
    Math.round(canvas.width * .5),
    Math.round(canvas.height * .5)
]

const point=[90, 120]
const A = [-160, -30]
const B = [110, 50]

ctx.translate(offset[0], offset[1]);

window.onresize = (ev) => {
    console.log(`window resized`)
    canvas.width = document.body.offsetWidth
    canvas.height = document.body.offsetHeight
    offset[0] = Math.round(canvas.width * .5)
    offset[1] = Math.round(canvas.height * .5)
    ctx.translate(offset[0], offset[1])
    requestAnimationFrame(update)
    update()
}


// document.body.onresize = ev => {
//     // console.log(`body resized`)
//     canvas.width = document.body.offsetWidth
//     canvas.height = document.body.offsetHeight
//     offset[0] = Math.round(canvas.width * .5)
//     offset[1] = Math.round(canvas.height * .5)
//     ctx.translate(offset[0], offset[1])
//     requestAnimationFrame(update)
// }


document.body.onmousemove=(event)=>{
    point[0] = event.x - offset[0]
    point[1] = event.y - offset[1]
    requestAnimationFrame(update)
}

document.body.oncontextmenu = ((event) => {
    if (isPressed) isPressed = false
    event.preventDefault()
})

document.body.onclick = ((event) => {
    if (!isPressed) {
        isPressed = true
    } else {
        isPressed = false
    }
})

requestAnimationFrame(update)


// helpers
function update() {

    if (!isPressed) {
        clear()
        drawCoordinateSystem()
        // draw point at mouse pointer' position
        drawDot(point, `M = [ ${point[0]}, ${-point[1]} ]`)
        drawDot(A, `A = [ ${A[0]}, ${-A[1]} ]`)
        drawDot(B, `B = [ ${B[0]}, ${-B[1]} ]`)
        // segment AB
        drawSegment(A, B)
        // vector from A->M
        drawSegment(A, point, "rgb(201 42 206)")
        // draw dot AB + AP
        let BA = subtract(B, A)
        let mBA = magnitude(BA)
        let uBA = normalize(BA)
        let ABAP = add(BA, point)
        drawDot(ABAP, `AB + AP = [ ${ABAP[0]}, ${-ABAP[1]} ]`)
        // draw vector AB + AP
        drawArrow(add(BA, point), A, "rgb(0 192 16)")
        // draw vector from B to AB+AP
        drawSegment(add(point, BA), B, "rgb(201 42 206)")
        // draw vector from B, P representing vectors subtratcion
        let p0 = B, p1 = point, diff = subtract(p1, p0)
        drawArrow(B, add(B, diff), "rgb(0 206 221)")
        // now draw a point on AB as P moves around - result: normalize(AB) dot P => scale AB
        // 1st: get AB component of P and AB (as normalized) - it will produce the distance from A toward B
        //  regarding X component of P, which means the point on AB segment is the dotproduct of P and normalized AB scaled the original AB segment
        let AP = subtract(point, A)
        let dotAPBA = dot(AP, normalize(BA))
        let mPA = magnitude(AP)
        let t = dotAPBA / magnitude(BA)
        let PA = lerp2D(A, B, t)
        if (t >= 0 && t <= 1) {
            drawSegment(A, PA, "orange", [], 3)
            drawSegment(PA, point, "rgb(187 187 187)", [5, 6], 1)
        }
        drawDot(PA, `PA = [ ${Math.round(PA[0])}, ${Math.round(-PA[1])} ]`)
        // draw legends
        drawText(`AM vector`, [-offset[0] + 10, -offset[1] + 10])
        drawSegment([-offset[0] + 120, -offset[1] + 16], [-offset[0] + 240, -offset[1] + 16], "rgb(201 42 206)", [], 4)

        drawText(`AB vector`, [-offset[0] + 10, -offset[1] + 40])
        drawSegment([-offset[0] + 120, -offset[1] + 16 + 30], [-offset[0] + 240, -offset[1] + 16 + 30], "rgb(255 255 255)", [], 4)

        drawText(`AB + AM vector`, [-offset[0] + 10, -offset[1] + 70])
        drawSegment([-offset[0] + 120, -offset[1] + 16 + 60], [-offset[0] + 240, -offset[1] + 16 + 60], "rgb(0 192 16)", [], 4)

        drawText(`AM - AB vector`, [-offset[0] + 10, -offset[1] + 100])
        drawSegment([-offset[0] + 120, -offset[1] + 16 + 90], [-offset[0] + 240, -offset[1] + 16 + 90], "rgb(0 206 221)", [], 4)

        drawText(`MPA vector`, [-offset[0] + 10, -offset[1] + 130])
        drawSegment([-offset[0] + 120, -offset[1] + 16 + 120], [-offset[0] + 240, -offset[1] + 16 + 120], "rgb(200, 200, 200)", [5, 4], 4)

        drawText(`APA vector`, [-offset[0] + 10, -offset[1] + 160])
        drawSegment([-offset[0] + 120, -offset[1] + 16 + 150], [-offset[0] + 240, -offset[1] + 16 + 150], "orange", [], 4)

        //
        drawText('where PA = lerp2D(A, B, t)', [10, -offset[1] + 10])
        drawText('       t equals with the dot product of AM and unit vector of AB', [10, -offset[1] + 30])
        drawText('       divided by the magnitude of AB', [10, -offset[1] + 50])
        drawText('APA displayed only if (t >= 0 && t <= 1)', [10, -offset[1] + 80])


        // dynamic values
        drawText(`mag AM = ${magnitude(subtract(point, A)).toFixed(5)}`, [-offset[0] + 270, -offset[1] + 10])
        drawText(`mag APA = ${magnitude(subtract(PA, A)).toFixed(5)}`, [-offset[0] + 270, -offset[1] + 30])
        drawText(`mag MPA = ${magnitude(subtract(point, PA)).toFixed(5)}`, [-offset[0] + 270, -offset[1] + 50])
        drawText(`uBA = [ ${uBA[0].toFixed(5)}, ${uBA[1].toFixed(5)} ]`, [-offset[0] + 270, -offset[1] + 70])
        drawText(`mag BA = ${magnitude(subtract(B, A)).toFixed(5)}`, [-offset[0] + 270, -offset[1] + 90])
        drawText(`${String.fromCharCode(0x03b8)} = MA ${String.fromCharCode(0x2022)} uBA / mAP`, [-offset[0] + 270, -offset[1] + 110])
        drawText(`   = ${(dot(subtract(point, A), uBA) / mPA).toFixed(5)}`, [-offset[0] + 270, -offset[1] + 130])
        drawText(`   = ${(Math.acos((dot(subtract(point, A), uBA) / mPA)) * 180. / Math.PI).toFixed(5)}`, [-offset[0] + 270, -offset[1] + 150])
    }
}

function clear() {
    ctx.save()
    ctx.translate(-offset[0], -offset[1])
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
}

function drawArrow(tip, tail = [0, 0], color = "white", size = 20) {
    ctx.save();
    const { dir, mag } = toPolar(subtract(tip, tail));
    const v1 = { dir: dir + Math.PI * 0.8, mag: size / 2 };
    const p1 = toXY(v1);
    const t1 = add(p1, tip);
    const v2 = { dir: dir - Math.PI * 0.8, mag: size / 2 };
    const p2 = toXY(v2);
    const t2 = add(p2, tip);
    ctx.beginPath();
    ctx.moveTo(tail[0], tail[1]);
    ctx.lineTo(tip[0], tip[1]);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tip[0], tip[1]);
    ctx.lineTo(t1[0], t1[1]);
    ctx.lineTo(t2[0], t2[1]);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function drawCoordinateSystem(){
   ctx.beginPath();
   ctx.moveTo(-offset[0],0);
   ctx.lineTo(myCanvas.width-offset[0],0);
   ctx.moveTo(0,-offset[1]);
   ctx.lineTo(0,myCanvas.height-offset[1]);
   ctx.setLineDash([5,4]);
   ctx.lineWidth=1;
   ctx.strokeStyle="red";
   ctx.stroke();
   ctx.setLineDash([]);
}

// Videos like: Segment Intersection, Trigonometry and Distance without Pythagoras
// https://youtu.be/fHOLQJo0FjQ
// https://youtu.be/xK3vKWMFVgw
// https://youtu.be/fEq-edH2iYE

function drawDot(pos, label) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(pos[0], pos[1], 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "14px Arial";
    ctx.textBaseline = "hanging";
    ctx.textAlign = "center";
    ctx.fillText(label, pos[0] - 10, pos[1] + 10);
    ctx.restore();
}

function drawSegment(A, B, color = "white", dash = [], lw = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw || 1;
    if (!!dash && dash instanceof Array) {
        ctx.setLineDash(dash);
    }
    ctx.moveTo(A[0], A[1]);
    ctx.lineTo(B[0], B[1]);
    ctx.stroke();
    if (!!dash && dash instanceof Array) {
        ctx.setLineDash([]);
    }
    ctx.restore();
}

function drawText(text, xy = [10,10]) {
    ctx.save();
    ctx.textBaseline = "hanging";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(text, xy[0], xy[1]);
    ctx.restore();
}
