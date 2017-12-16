var gl;
var shaderProgram;
var wallVertexBuffer;
var wallIndexBuffer;
var wallTextureCoordsBuffer;

var wallTexture; // переменная для хранения текстуры кирпичной стены
var roofTexture; // переменная для хранения текстуры каменной крыши
var angle = 0.0; //угол вращения в радианах
var zTranslation = -1.5; // смещение по оси Z

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// установка шейдеров
function initShaders() {
    var fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs-1');
    var vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs-1');

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

    shaderProgram.vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "aVertexTextureCoords");
    gl.enableVertexAttribArray(shaderProgram.vertexTextureAttribute);

    shaderProgram.MVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.ProjMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
}
function setMatrixUniforms(){
    gl.uniformMatrix4fv(shaderProgram.ProjMatrix,false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.MVMatrix, false, mvMatrix);
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

function initWordBuffers() {

    var vertices =[
        // Х
        // лицевая часть
        -0.6, -0.2, 0.1,
        -0.5, -0.2, 0.1,
        -0.4, 0.0, 0.1,
        -0.45, 0.1, 0.1,

        -0.6, 0.2, 0.1,
        -0.5, 0.2, 0.1,
        -0.45, 0.1, 0.1,
        -0.5, 0.0, 0.1,

        -0.3, 0.2, 0.1,
        -0.4, 0.2, 0.1,
        -0.45, 0.1, 0.1,
        -0.4, 0.0, 0.1,

        -0.3, -0.2, 0.1,
        -0.4, -0.2, 0.1,
        -0.45, -0.1, 0.1,
        -0.4, 0.0, 0.1,

        // левая боковая часть
        -0.6, 0.2, 0.1,
        -0.5, 0.0, 0.1,
        -0.5, 0.0, -0.1,
        -0.6, 0.2, -0.1,

        -0.6, -0.2, 0.1,
        -0.5, 0.0, 0.1,
        -0.5, 0.0, -0.1,
        -0.6, -0.2, -0.1,

        // правая боковая часть
        -0.3, 0.2, 0.1,
        -0.4, 0.0, 0.1,
        -0.4, 0.0, -0.1,
        -0.3, 0.2, -0.1,

        -0.3, -0.2, 0.1,
        -0.4, 0.0, 0.1,
        -0.4, 0.0, -0.1,
        -0.3, -0.2, -0.1,

        // верхняя часть
        -0.6, 0.2, 0.1,
        -0.5, 0.2, 0.1,
        -0.5, 0.2, -0.1,
        -0.6, 0.2, -0.1,

        -0.3, 0.2, 0.1,
        -0.4, 0.2, 0.1,
        -0.4, 0.2, -0.1,
        -0.3, 0.2, -0.1,

        -0.5, 0.2, 0.1,
        -0.45, 0.1, 0.1,
        -0.45, 0.1, -0.1,
        -0.5, 0.2, -0.1,

        -0.4, 0.2, 0.1,
        -0.45, 0.1, 0.1,
        -0.45, 0.1, -0.1,
        -0.4, 0.2, -0.1,

        // нижняя часть
        -0.6, -0.2, 0.1,
        -0.5, -0.2, 0.1,
        -0.5, -0.2, -0.1,
        -0.6, -0.2, -0.1,

        -0.3, -0.2, 0.1,
        -0.4, -0.2, 0.1,
        -0.4, -0.2, -0.1,
        -0.3, -0.2, -0.1,

        -0.5, -0.2, 0.1,
        -0.5, -0.2, -0.1,
        -0.45, -0.1, -0.1,
        -0.45, -0.1, 0.1,

        -0.4, -0.2, 0.1,
        -0.4, -0.2, -0.1,
        -0.45, -0.1, -0.1,
        -0.45, -0.1, 0.1,

        // задняя часть
        -0.6, -0.2, -0.1,
        -0.5, -0.2, -0.1,
        -0.4, 0.0, -0.1,
        -0.45, 0.1, -0.1,

        -0.6, 0.2, -0.1,
        -0.5, 0.2, -0.1,
        -0.45, 0.1, -0.1,
        -0.5, 0.0, -0.1,

        -0.3, 0.2, -0.1,
        -0.4, 0.2, -0.1,
        -0.45, 0.1, -0.1,
        -0.4, 0.0, -0.1,

        -0.3, -0.2, -0.1,
        -0.4, -0.2, -0.1,
        -0.45, -0.1, -0.1,
        -0.4, 0.0, -0.1,

        // М
        // лицевая часть
        -0.1, -0.2, 0.1,
        -0.2, -0.2, 0.1,
        -0.2, 0.2, 0.1,
        -0.1, 0.2, 0.1,

        -0.1, 0.0, 0.1,
        0.0, -0.1, 0.1,
        0.0, 0.1, 0.1,
        -0.1, 0.2, 0.1,

        0.1, 0.0, 0.1,
        0.0, -0.1, 0.1,
        0.0, 0.1, 0.1,
        0.1, 0.2, 0.1,

        0.1, -0.2, 0.1,
        0.2, -0.2, 0.1,
        0.2, 0.2, 0.1,
        0.1, 0.2, 0.1,

        // задняя часть
        -0.1, -0.2, -0.1,
        -0.2, -0.2, -0.1,
        -0.2, 0.2, -0.1,
        -0.1, 0.2, -0.1,

        -0.1, 0.0, -0.1,
        0.0, -0.1, -0.1,
        0.0, 0.1, -0.1,
        -0.1, 0.2, -0.1,

        0.1, 0.0, -0.1,
        0.0, -0.1, -0.1,
        0.0, 0.1, -0.1,
        0.1, 0.2, -0.1,

        0.1, -0.2, -0.1,
        0.2, -0.2, -0.1,
        0.2, 0.2, -0.1,
        0.1, 0.2, -0.1,

        // левая боковая часть
        -0.2, 0.2, 0.1,
        -0.2, 0.2, -0.1,
        -0.2, -0.2, -0.1,
        -0.2, -0.2, 0.1,

        // правая боковая часть
        0.2, 0.2, 0.1,
        0.2, 0.2, -0.1,
        0.2, -0.2, -0.1,
        0.2, -0.2, 0.1,

        // верхняя часть
        -0.2, 0.2, 0.1,
        -0.1, 0.2, 0.1,
        -0.1, 0.2, -0.1,
        -0.2, 0.2, -0.1,

        0.2, 0.2, 0.1,
        0.1, 0.2, 0.1,
        0.1, 0.2, -0.1,
        0.2, 0.2, -0.1,

        -0.1, 0.2, 0.1,
        0.0, 0.1, 0.1,
        0.0, 0.1, -0.1,
        -0.1, 0.2, -0.1,

        0.1, 0.2, 0.1,
        0.0, 0.1, 0.1,
        0.0, 0.1, -0.1,
        0.1, 0.2, -0.1,

        // нижняя часть
        -0.2, -0.2, 0.1,
        -0.1, -0.2, 0.1,
        -0.1, -0.2, -0.1,
        -0.2, -0.2, -0.1,

        0.2, -0.2, 0.1,
        0.1, -0.2, 0.1,
        0.1, -0.2, -0.1,
        0.2, -0.2, -0.1,

        -0.1, 0.0, 0.1,
        0.0, -0.1, 0.1,
        0.0, -0.1, -0.1,
        -0.1, 0.0, -0.1,

        0.1, 0.0, 0.1,
        0.0, -0.1, 0.1,
        0.0, -0.1, -0.1,
        0.1, 0.0, -0.1,

        -0.1, -0.2, 0.1,
        -0.1, 0.0, 0.1,
        -0.1, 0.0, -0.1,
        -0.1, -0.2, -0.1,

        0.1, -0.2, 0.1,
        0.1, 0.0, 0.1,
        0.1, 0.0, -0.1,
        0.1, -0.2, -0.1,

        // А
        // лицевая часть
        0.3, -0.2, 0.1,
        0.35, 0.0, 0.1,
        0.45, 0.0, 0.1,
        0.4, -0.2, 0.1,

        0.6, -0.2, 0.1,
        0.55, 0.0, 0.1,
        0.45, 0.0, 0.1,
        0.5, -0.2, 0.1,

        0.35, 0.0, 0.1,
        0.4, 0.2, 0.1,
        0.5, 0.2, 0.1,
        0.55, 0.0, 0.1,

        0.4375, -0.05, 0.1,
        0.4125, -0.15, 0.1,
        0.4875, -0.15, 0.1,
        0.4625, -0.05, 0.1,

        // задняя часть
        0.3, -0.2, -0.1,
        0.35, 0.0, -0.1,
        0.45, 0.0, -0.1,
        0.4, -0.2, -0.1,

        0.6, -0.2, -0.1,
        0.55, 0.0, -0.1,
        0.45, 0.0, -0.1,
        0.5, -0.2, -0.1,

        0.35, 0.0, -0.1,
        0.4, 0.2, -0.1,
        0.5, 0.2, -0.1,
        0.55, 0.0, -0.1,

        0.4375, -0.05, -0.1,
        0.4125, -0.15, -0.1,
        0.4875, -0.15, -0.1,
        0.4625, -0.05, -0.1,

        // левая боковая часть
        0.3, -0.2, 0.1,
        0.3, -0.2, -0.1,
        0.4, 0.2, -0.1,
        0.4, 0.2, 0.1,

        // правая боковая часть
        0.6, -0.2, 0.1,
        0.6, -0.2, -0.1,
        0.5, 0.2, -0.1,
        0.5, 0.2, 0.1,

        // верхняя часть
        0.4, 0.2, 0.1,
        0.4, 0.2, -0.1,
        0.5, 0.2, -0.1,
        0.5, 0.2, 0.1,

        // нижняя часть
        0.3, -0.2, 0.1,
        0.3, -0.2, -0.1,
        0.4, -0.2, -0.1,
        0.4, -0.2, 0.1,

        0.6, -0.2, 0.1,
        0.6, -0.2, -0.1,
        0.5, -0.2, -0.1,
        0.5, -0.2, 0.1,

        0.4125, -0.15, 0.1,
        0.4125, -0.15, -0.1,
        0.4875, -0.15, -0.1,
        0.4875, -0.15, 0.1,

        0.4125, -0.15, 0.1,
        0.4125, -0.15, -0.1,
        0.4, -0.2, -0.1,
        0.4, -0.2, 0.1,

        0.4875, -0.15, 0.1,
        0.4875, -0.15, -0.1,
        0.5, -0.2, -0.1,
        0.5, -0.2, 0.1,

        // внутренняя часть
        0.4375, -0.05, 0.1,
        0.4375, -0.05, -0.1,
        0.4625, -0.05, -0.1,
        0.4625, -0.05, 0.1,

        0.4375, -0.05, 0.1,
        0.4375, -0.05, -0.1,
        0.45, 0.0, -0.1,
        0.45, 0.0, 0.1,

        0.4625, -0.05, 0.1,
        0.4625, -0.05, -0.1,
        0.45, 0.0, -0.1,
        0.45, 0.0, 0.1

    ];

    var indices = [
        // Х
        // лицевая часть
        0, 1, 2,
        2, 3, 0,
        // задняя часть
        4, 5, 6,
        6, 7, 4,
        //левая боковая часть
        8, 9, 10,
        10, 11, 8,
        // правая боковая часть
        12, 13, 14,
        14, 15, 12,

        // М
        // лицевая часть
        16, 17, 18,
        18, 19, 16,
        // задняя часть
        20, 21, 22,
        22, 23, 20,
        //левая боковая часть
        24, 25, 26,
        26, 27, 24,
        // правая боковая часть
        28, 29, 30,
        30, 31, 28,

        // А
        // лицевая часть
        16, 17, 18,
        18, 19, 16,
        // задняя часть
        20, 21, 22,
        22, 23, 20,
        //левая боковая часть
        24, 25, 26,
        26, 27, 24,
        // правая боковая часть
        28, 29, 30,
        30, 31, 28,

        32, 33, 34,
        34, 35, 32,

        36, 37, 38,
        38, 39, 36,

        40, 41, 42,
        42, 43, 40,

        44, 45, 46,
        46, 47, 44,

        48, 49, 50,
        50, 51, 48,

        52, 53, 54,
        54, 55, 52,

        56, 57, 58,
        58, 59, 56,

        60, 61, 62,
        62, 63, 50,

        64, 65, 66,
        66, 67, 64,

        68, 69, 70,
        70, 71, 68,

        72, 73, 74,
        74, 75, 72,

        76, 77, 78,
        78, 79, 76,

        80, 81, 82,
        82, 83, 80,

        84, 85, 86,
        86, 87, 84,

        88, 89, 90,
        90, 91, 88,

        92, 93, 94,
        94, 95, 92,

        96, 97, 98,
        98, 99, 96,

        100, 101, 102,
        102, 103, 100,

        104, 105, 106,
        106, 107, 104,

        108, 109, 110,
        110, 111, 108,

        112, 113, 114,
        114, 115, 112,

        116, 117, 118,
        118, 119, 116,

        120, 121, 122,
        122, 123, 120,

        124, 125, 126,
        126, 127, 124,

        128, 129, 130,
        130, 131, 128,

        132, 133, 134,
        134, 135, 132,

        136, 137, 138,
        138, 139, 136,

        140, 141, 142,
        142, 143, 140,

        144, 145, 146,
        146, 147, 144,

        148, 149, 150,
        150, 151, 148,

        152, 153, 154,
        154, 155, 152,

        156, 157, 158,
        158, 159, 156,

        160, 161, 162,
        162, 163, 160,

        164, 165, 166,
        166, 167, 164,

        168, 169, 170,
        170, 171, 168,

        172, 173, 174,
        174, 175, 172,

        176, 177, 178,
        178, 179, 176,

        180, 181, 182,
        182, 183, 180,

        184, 185, 186,
        186, 187, 184,

        188, 189, 190,
        190, 191, 188,

        192, 193, 194,
        194, 195, 192,

        196, 197, 198,
        198, 199, 196,

        200, 201, 202,
        202, 203, 200,

        204, 205, 206,
        206, 207, 204,

        208, 209, 210,
        210, 211, 208,

        212, 213, 214,
        214, 215, 212,

        216, 217, 218,
        218, 219, 216,

        220, 221, 222,
        222, 223, 220,

        224, 225, 226,
        226, 227, 224,

        228, 229, 230,
        230, 231, 228,

        232, 233, 234,
        234, 235, 232
    ];

    wallVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, wallVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    wallVertexBuffer.itemSize = 3;

    wallIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wallIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    wallIndexBuffer.numberOfItems = indices.length;

    // Координаты текстуры
    var textureCoords = [];
    for (var i=0; i<59; i++) {
        textureCoords.push(0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0);
    }
    // Создание буфера координат текстуры
    wallTextureCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, wallTextureCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    wallTextureCoordsBuffer.itemSize=2;
}



function wordDraw() {

    gl.bindBuffer(gl.ARRAY_BUFFER, wallVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        wallVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, wallTextureCoordsBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexTextureAttribute,
        wallTextureCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES, wallIndexBuffer.numberOfItems, gl.UNSIGNED_SHORT,0);
}

function setupWebGL()
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    mat4.perspective(pMatrix, 1.04, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix,mvMatrix,[0, 0, zTranslation]);
    mat4.rotate(mvMatrix,mvMatrix, angle, [0, 1, 0]);
}
function setupTextures() {
    wallTexture = gl.createTexture();
    setTexture("../img/grass.jpg", wallTexture);

}
function setTexture(url, texture){

    gl.bindTexture(gl.TEXTURE_2D, texture);
    var image = new Image();
    image.onload = function() {

        handleTextureLoaded(image, texture);
    }

    image.src = url;

    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    gl.uniform1i(shaderProgram.samplerUniform, 0);
}
function handleTextureLoaded(image, texture) {

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
window.onload=function(){

    var canvas = document.getElementById("canvas3D-1");
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    if (!gl) {
        alert("Ваш браузер не поддерживает WebGL");
    }
    if(gl){
        document.addEventListener('keydown', handleKeyDown, false);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        initShaders();
        initWordBuffers();
        setupTextures();
        (function animloop(){

            setupWebGL();
            setMatrixUniforms();
            wordDraw();
            requestAnimFrame(animloop, canvas);
        })();
    }

    // load1();
}
function handleKeyDown(e){
    switch(e.keyCode)
    {
        case 39:
            angle+=0.1;
            break;
        case 37:
            angle-=0.1;
            break;
        case 40:
            zTranslation+=0.1;
            break;
        case 38:
            zTranslation-=0.1;
            break;
    }
}
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element) {
            return window.setTimeout(callback, 1000/60);
        };

})();