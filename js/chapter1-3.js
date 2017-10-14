
var gl;
var shaderProgram;
var vertexBuffer; // буфер вершин
var colorBuffer; //буфер цветов
// установка шейдеров
function initShaders1() {
    var fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs-2');
    var vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs-2');

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
    var сolors = [
        0.11, 0.73, 0.86,
        0.11, 0.73, 0.86,
        0.11, 0.73, 0.86,
        0.11, 0.73, 0.86,
        0.11, 0.73, 0.86,
        0.11, 0.73, 0.86
    ];
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(сolors), gl.STATIC_DRAW);
}
// отрисовка
function draw1() {

    gl.clearColor(0.92, 0.18, 0.48, 1.0);
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

function load3(){

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

        initBuffers1();

        draw1();
    }
};