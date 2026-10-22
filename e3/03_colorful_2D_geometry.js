"use strict";

const color_palette = {
    green: [168/255, 213/255, 186/255, 1.0],
    blue: [142/255, 202/255, 230/255, 1.0],
    purple: [184/255, 161/255, 227/255, 1.0],
    yellow: [255/255, 224/255, 138/255, 1.0],
    orange: [244/255, 165/255, 130/255, 1.0],
    pink: [239/255, 167/255, 200/255, 1.0]
};

// Get the WebGL context.
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('experimental-webgl');

// Pipeline setup.
gl.clearColor(0, 0, 0, 0);
// Backface culling.
gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

// Compile vertex shader.
const vsSource = '' +
    'attribute vec3 pos;' +
    'attribute vec4 col;' +
    'varying vec4 color;' +
    'void main(){' +
    'color = col;' +
    'gl_Position = vec4(pos.xy*0.03, 0, 1);' +
    '}';
const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile fragment shader.
const fsSource = 'precision mediump float;' +
    'varying vec4 color;' +
    'void main() {' +
    'gl_FragColor = color;' +
    '}';
const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

// Link shader together into a program.
const prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

// Vertex data.
const vertices = new Float32Array([
    // shape 1
    -27, 29, 0,   // 0
    -24, 25, 0,   // 1
    -23, 25, 0,   // 2
    -23, 27, 0,   // 3
    -19, 27, 0,   // 4
    -20, 26, 0,   // 5
    // shape 2
    -22, 22, 0,   // 6
    -23, 25, 0,   // 7
    -24, 25, 0,   // 8
    -25, 23, 0,   // 9
    // shape 3
    -20, 26, 0,   // 10
    -23, 27, 0,   // 11
    -23, 25, 0,   // 12
    -22, 22, 0,   // 13
    -17, 25, 0,   // 14
    // shape 4
    -19, 27, 0,   // 15
    -20, 26, 0,   // 16
    -17, 25, 0,   // 17
    -14, 27, 0,   // 18
    // shape 5
    -25, 23, 0,   // 19
    -25, 17, 0,   // 20
    -22, 22, 0,   // 21
    // shape 6
    -22, 22, 0,   // 22
    -16, 20, 0,   // 23
    -17, 25, 0,   // 24
    // shape 7
    -17, 25, 0,   // 25
    -16, 20, 0,   // 26
    -14, 27, 0,   // 27
    // shape 8
    -16, 20, 0,   // 28
    -8, 22, 0,    // 29
    -14, 27, 0,   // 30
    -18, 14, 0,   // 31
    // shape 9
    -22, 22, 0,   // 32
    -18, 14, 0,   // 33
    -16, 20, 0,   // 34
    // shape 10
    -22, 22, 0,   // 35
    -25, 17, 0,   // 36
    -18, 14, 0,   // 37
    -24, 15, 0,   // 38
    -22, 12, 0,   // 39
    //shape 11
    -25, 17, 0,   // 40
    -26, 14, 0,   // 41
    -24, 15, 0,   // 42
    // shape 12
    -26, 14, 0,   // 43
    -22, 12, 0,   // 44
    -24, 15, 0,   // 45
    // shape 13
    -18, 14, 0,   // 46
    -7, 15, 0,    // 47
    -8, 22, 0,    // 48
    // shape 14
    -18, 14, 0,   // 49
    -20, 6, 0,    // 50
    -7, 15, 0,    // 51
    // shape 15
    -20, 6, 0,    // 52
    -14, -4, 0,   // 53
    -7, 15, 0,    // 54
    // shape 16
    -7, 15, 0,    // 55
    -14, -4, 0,   // 56
    -1, 9, 0,     // 57
    // shape 17
    -14, -4, 0,   // 58
    1, -2, 0,     // 59
    -1, 9, 0,     // 60
    // shape 18
    9, 4, 0,      // 61
    -1, 9, 0,     // 62
    1, -2, 0,     // 63
    2, -14, 0,    // 64
    // shape 19
    2, -14, 0,    // 65
    14, -10, 0,   // 66
    9, 4, 0,      // 67
    // shape 20
    1, -2, 0,     // 68
    -14, -4, 0,   // 69
    -9, -7, 0,    // 70
    2, -14, 0,    // 71
    // shape 21
    -9, -7, 0,    // 72
    -14, -4, 0,   // 73
    -17, -16, 0,  // 74
    -12, -13, 0,  // 75
    // shape 22
    -9, -7, 0,    // 76
    -12, -13, 0,  // 77
    2, -14, 0,    // 78
    // shape 23
    -17, -23, 0,  // 79
    -12, -13, 0,  // 80
    -17, -16, 0,  // 81
    -10, -17, 0,  // 82
    -12, -24, 0,  // 83
    -15, -25, 0,  // 84
    -18, -27, 0,  // 85
    -19, -24, 0,  // 86
    -14, -27, 0,  // 87
    // shape 24
    2, -14, 0,    // 88
    -12, -13, 0,  // 89
    -10, -17, 0,  // 90
    -7, -23, 0,   // 91
    // shape 25
    -12, -24, 0,  // 92
    -15, -25, 0,  // 93
    -14, -27, 0,  // 94
    -12, -29, 0,  // 95
    -7, -23, 0,   // 96
    // shape 26
    -7, -23, 0,   // 97
    -12, -29, 0,  // 98
    -1, -29, 0,   // 99
    // shape 27
    2, -14, 0,    // 100
    -7, -23, 0,   // 101
    2, -29, 0,    // 102
    -1, -29, 0,   // 103
    // shape 28
    2, -14, 0,    // 104
    14, -22, 0,   // 105
    14, -10, 0,   // 106
    // shape 29
    2, -14, 0,    // 107
    2, -29, 0,    // 108
    14, -22, 0,   // 109
    // shape 30
    2, -29, 0,    // 110
    10, -29, 0,   // 111
    14, -22, 0,   // 112
    // shape 31
    14, -22, 0,   // 113
    10, -29, 0,   // 114
    17, -24, 0,   // 115
    22, -29, 0,   // 116
    // shape 32
    17, -24, 0,   // 117
    22, -29, 0,   // 118
    22, -23, 0,   // 119
    27, -22, 0,   // 120
    // shape 33
    19, -8, 0,    // 121
    19, -14, 0,   // 122
    22, -13, 0,   // 123
    22, -23, 0,   // 124
    27, -22, 0,   // 125
    // shape 34
    19, -8, 0,    // 126
    22, -13, 0,   // 127
    26, -5, 0     // 128
]);

// Color data.
const colors = new Float32Array([
    // shape 1 (green)
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    // shape 2 (blue)
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    // shape 3 (purple)
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    // shape 4 (yellow)
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    // shape 5 (orange)
    ...color_palette.orange,
    ...color_palette.orange,
    ...color_palette.orange,
    // shape 6 (green)
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    // shape 7 (orange)
    ...color_palette.orange,
    ...color_palette.orange,
    ...color_palette.orange,
    // shape 8 (pink)
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    // shape 9 (yellow)
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    // shape 10 (blue)
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    // shape 11 (pink)
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    // shape 12 (orange)
    ...color_palette.orange,
    ...color_palette.orange,
    ...color_palette.orange,
    // shape 13 (purple)
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    // shape 14 (orange)
    ...color_palette.orange,
    ...color_palette.orange,
    ...color_palette.orange,
    // shape 15 (pink)
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    // shape 16 (blue)
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    // shape 17 (green)
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    // shape 18 (orange)
    ...color_palette.orange,
    ...color_palette.orange,
    ...color_palette.orange,
    ...color_palette.orange,
    // shape 19 (yellow)
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    // shape 20 (purple)
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    // shape 21 (yellow)
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    // shape 22 (orange)
    ...color_palette.orange,
    ...color_palette.orange,
    ...color_palette.orange,
    // shape 23 (pink)
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    // shape 24 (blue)
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    // shape 25 (green)
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    // shape 26 (yellow)
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    // shape 27 (purple)
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    // shape 28 (pink)
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
    // shape 29 (orange)
    ...color_palette.orange,
    ...color_palette.orange,
    ...color_palette.orange,
    // shape 30 (purple)
    ...color_palette.purple,
    ...color_palette.purple,
    ...color_palette.purple,
    // shape 31 (yellow)
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    ...color_palette.yellow,
    // shape 32 (blue)
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    ...color_palette.blue,
    // shape 33 (green)
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    ...color_palette.green,
    // shape 34 (pink)
    ...color_palette.pink,
    ...color_palette.pink,
    ...color_palette.pink,
]);

// Index data.
const indices = new Uint16Array([
    // shape 1
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    3, 5, 4,
    // shape 2
    6, 7, 8,
    6, 8, 9,
    // shape 3
    10, 11, 12,
    10, 12, 13,
    10, 13, 14,
    // shape 4
    15, 16, 17,
    15, 17, 18,
    // shape 5
    19, 20, 21,
    // shape 6
    22, 23, 24,
    // shape 7
    25, 26, 27,
    // shape 8
    28, 29, 30,
    28, 31, 29,
    // shape 9
    32, 33, 34,
    // shape 10
    35, 36, 37,
    36, 38, 37,
    38, 39, 37,
    // shape 11
    40, 41, 42,
    // shape 12
    43, 44, 45,
    // shape 13
    46, 47, 48,
    // shape 14
    49, 50, 51,
    // shape 15
    52, 53, 54,
    // shape 16
    55, 56, 57,
    // shape 17
    58, 59, 60,
    // shape 18
    61, 62, 63,
    61, 63, 64,
    // shape 19
    65, 66, 67,
    // shape 20
    68, 69, 70,
    68, 70, 71,
    // shape 21
    72, 73, 74,
    72, 74, 75,
    // shape 22
    76, 77, 78,
    // shape 23
    79, 80, 81,
    79, 82, 80,
    79, 83, 82,
    79, 84, 83,
    79, 85, 84,
    79, 86, 85,
    84, 85, 87,
    // shape 24
    88, 89, 90,
    88, 90, 91,
    // shape 25
    92, 93, 94,
    92, 94, 95,
    92, 95, 96,
    // shape 26
    97, 98, 99,
    // shape 27
    100, 101, 102,
    101, 103, 102,
    // shape 28
    104, 105, 106,
    // shape 29
    107, 108, 109,
    // shape 30
    110, 111, 112,
    // shape 31
    113, 114, 115,
    115, 114, 116,
    // shape 32
    117, 118, 119,
    119, 118, 120,
    // shape 33
    121, 122, 123,
    122, 124, 125,
    122, 125, 123,
    // shape 34
    126, 127, 128
]);

// Setup position vertex buffer object.
const vboPos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Bind vertex buffer to attribute variable.
const posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);

// Setup color vertex buffer object.
const vboCol = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

// Bind vertex buffer to attribute variable.
const colAttrib = gl.getAttribLocation(prog, 'col');
gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colAttrib);

// Setup index buffer object.
const ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices,
    gl.STATIC_DRAW);

// Clear framebuffer and render primitives.
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES, indices.length,
    gl.UNSIGNED_SHORT, 0);