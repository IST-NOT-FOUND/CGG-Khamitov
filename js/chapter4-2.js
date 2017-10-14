var gl;
var shaderProgram;
var vertexBuffer; // буфер вершин
var colorBuffer; //буфер цветов

var v1r=1, v1g=0, v1b=1,
    v2r=0, v2g=1, v2b=0,
    v3r=1, v3g=1, v3b=0,
    v4r=1, v4g=0, v4b=0;

var tempV1R, tempV1G, tempV1B,
    tempV2R, tempV2G, tempV2B,
    tempV3R, tempV3G, tempV3B,
    tempV4R, tempV4G, tempV4B, k = 0;


// установка шейдеров
function initShaders1() {
    var fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');
    var vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');

    shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Не удалось установить шейдеры");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
}
// Функция создания шейдера
function getShader(type,id) {
    var source = document.getElementById(id).innerHTML;

    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
// установка буферов вершин и индексов
function initBuffers1() {

    var vertices = [
        -0.5,  0.5,  0.0,
        0.5, 0.5,  0.0,
        0.5, -0.5,  0.0,
        0.5, -0.5,  0.0,
        -0.5, -0.5,  0.0,
        -0.5,  0.5,  0.0
    ];
    // установка буфера вершин
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    vertexBuffer.numberOfItems = 6;

    if (k % 100 == 0) {
        tempV1R = v1r;
        tempV2R = v2r;
        tempV3R = v3r;
        tempV4R = v4r;

        tempV1G = v1g;
        tempV2G = v2g;
        tempV3G = v3g;
        tempV4G = v4g;

        tempV1B = v1b;
        tempV2B = v2b;
        tempV3B = v3b;
        tempV4B = v4b;
        k = 1;
    }

    v1r += changeCol(v1r, tempV4R);
    v2r += changeCol(v2r, tempV1R);
    v3r += changeCol(v3r, tempV2R);
    v4r += changeCol(v4r, tempV3R);
    v1g += changeCol(v1g, tempV4G);
    v2g += changeCol(v2g, tempV1G);
    v3g += changeCol(v3g, tempV2G);
    v4g += changeCol(v4g, tempV3G);
    v1b += changeCol(v1b, tempV4B);
    v2b += changeCol(v2b, tempV1B);
    v3b += changeCol(v3b, tempV2B);
    v4b += changeCol(v4b, tempV3B);

    k++;

    var сolors = [
        v1r, v1g, v1b,
        v2r, v2g, v2b,
        v3r, v3g, v3b,
        v3r, v3g, v3b,
        v4r, v4g, v4b,
        v1r, v1g, v1b
    ];
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(сolors), gl.STATIC_DRAW);
}
// отрисовка
function draw1() {

    gl.clearColor(0, 0, 0, 1.0);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
        vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems);
}

function load2(){

    var canvas = document.getElementById("canvas3D-2");
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    if (!gl) {
        alert("Ваш браузер не поддерживает WebGL");
    }
    if(gl){
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        initShaders1();

        setInterval(initBuffers1, 50);

        setInterval(draw1, 50);
    }
};

function changeCol(v, tempV) {
    if (v > tempV){
        return -0.01;
    } else if (v == tempV) {
        return 0;
    } else {
        return 0.01;
    }
}