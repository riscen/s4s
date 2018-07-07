const right = 2;
const left = 0;
const scale = 40;

var inputData = [];
var perceptron = new Perceptron;

function updateCanvasSize() {
    let canvasContainer = document.getElementById("perceptron-canvas-container");
    let canvas = document.getElementById("work-area-canvas");
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    drawPlane();
}

function addPoint(evt) {
    if(perceptron.trained) {
        let click = getMousePos(this, evt);
        let output = perceptron.calculateOutput([click.x, click.y])==1?right:left;
        let point = {
                y: output,
                x: [click.x, click.y],
            };
        addValueToTable(point);
        let canvasCoords = cartesian2CanvasCoord([click.x, click.y], this);
        point = {
                y: output,
                x: [canvasCoords[0], canvasCoords[1]],
            };
        drawCircle(point);
    }
    else {
        let click = getMousePos(this, evt);
        let point = {
                y: evt.button,
                x: [click.x, click.y],
            };
        inputData.push(point);
        addValueToTable(point);
        let canvasCoords = cartesian2CanvasCoord(point.x, this);
        point = {
                y: evt.button,
                x: [canvasCoords[0], canvasCoords[1]],
            };
        drawCircle(point);
    }
}

function getMousePos(canvas, e) {
    let coords = canvas2CartesianCoord([e.clientX, e.clientY], canvas);
    return {
      x: coords[0],
      y: coords[1]
    };
};

function canvas2CartesianCoord(pos, canvas) {
    return [(pos[0] - canvas.offsetLeft - (canvas.width * .5))/scale, 
    (-(pos[1] - canvas.offsetTop - (canvas.height * .5)))/scale];
}

function cartesian2CanvasCoord(pos, canvas) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY =  canvas.height / rect.height;
    let x = scale*pos[0] + canvas.offsetLeft + (canvas.width * .5);
    let y = -scale*pos[1] + canvas.offsetTop + (canvas.height * .5);
    return [(x - rect.left)*scaleX, (y - rect.top)*scaleY];
}

function addValueToTable(point) {
    let table = document.getElementById('input-data-table');
    let row = table.insertRow();
    row.className = (point.y === right)?'r-click':'l-click';
    row.insertCell(0).innerHTML = (point.y === right)?'Right':'Left';
    row.insertCell(1).innerHTML = point.x[0];
    row.insertCell(2).innerHTML = point.x[1];
};

function drawCircle(point) {
    let canvas = document.getElementById("work-area-canvas");
    let rect = canvas.getBoundingClientRect();
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(point.x[0], point.x[1], 4, 0, 2*Math.PI);
    ctx.fillStyle = (point.y === right)?'red':'blue';
    ctx.fill();
}

function restart() {
    let table = document.getElementById('input-data-table');
    let canvas = document.getElementById("work-area-canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    while(table.rows.length > 0){
        table.deleteRow(0);
    }
    inputData = [];
    drawPlane();
    document.getElementById("control-panel-inputs").disabled = false;
    document.getElementById("train-btn").disabled = false;
    perceptron = new Perceptron();
}

function beginTraining() {
    let learningRate = document.getElementById("learning-rate").value;
    let epochs = document.getElementById("epochs").value;
    let x = [], y = [];
    for(let i = 0; i < inputData.length; i++) {
        x.push(inputData[i].x);
        y.push(inputData[i].y === right?1:0);
    }
    if(!perceptron.train(x, y, learningRate, epochs)) {
    }
    else {
        let canvas = document.getElementById("work-area-canvas");
        let xi = canvas2CartesianCoord([canvas.offsetLeft, 0], canvas)[0];
        let xf = canvas2CartesianCoord([canvas.width+canvas.offsetLeft, 0], canvas)[0];
        let yi = slopeFuction(xi);
        let yf = slopeFuction(xf); 
        drawLine(yi, yf);
        document.getElementById("control-panel-inputs").disabled = true;
        document.getElementById("train-btn").disabled = true;
    }

}

function drawPlane() {
    let canvas = document.getElementById("work-area-canvas");
    let ctx = canvas.getContext("2d");
    let xm = canvas.width/2;
    let ym = canvas.height/2;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xm, 0);
    ctx.lineTo(xm, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, ym);
    ctx.lineTo(canvas.width, ym);
    ctx.stroke();
    if(inputData.length > 0) {
        let canvasCoords;
        for(let i = 0; i < inputData.length; i++) {
            canvasCoords = cartesian2CanvasCoord(inputData[i].x, canvas);
            point = {
                    y: inputData[i].y,
                    x: [canvasCoords[0], canvasCoords[1]],
                };
            drawCircle(point);
        }
    }
}

function drawLine(yi, yf) {
    let canvas = document.getElementById("work-area-canvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cartesian2CanvasCoord([0, yi], canvas)[1]);
    ctx.lineTo(canvas.width, cartesian2CanvasCoord([0, yf], canvas)[1]);
    ctx.stroke();
    let yci = cartesian2CanvasCoord([0, yi], canvas)[1];
    let ycf = cartesian2CanvasCoord([0, yf], canvas)[1];
}

function slopeFuction(x) {
    let weights = perceptron.weights;
    return (-(weights[1]*x)-weights[0])/weights[2]
}
