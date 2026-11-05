'use strict';

// Get the WebGL context.
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('experimental-webgl');

// Pipeline setup.
gl.clearColor(.95, .95, .95, 1);
// Backface culling.
gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

// Compile vertex shader.
const vsSource = '' +
    'attribute vec3 pos;' +
    'attribute vec4 col;' +
    'varying vec4 color;' +
    'void main(){' + 'color = col;' +
    'gl_Position = vec4(pos, 1);' +
    '}';
const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile fragment shader.
const fsSouce = 'precision mediump float;' +
    'varying vec4 color;' +
    'void main() {' +
    'gl_FragColor = color;' +
    '}';
const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSouce);
gl.compileShader(fs);

// Link shader together into a program.
const prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.bindAttribLocation(prog, 0, "pos");
gl.linkProgram(prog);
gl.useProgram(prog);

// Vertex data.
// Positions, index data, colors.
let vertices, indicesLines, indicesTris, colors;

// Setup position vertex buffer object.
const vboPos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);

// Bind vertex buffer to attribute variable.
const posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 3,
    gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);

// Setup color
const colAttrib = gl.getAttribLocation(prog, 'col');
const vboCol = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colAttrib);

// Setup lines index buffer object.
const iboLines = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

// Setup tris index buffer object.
const iboTris = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

function createSchnecke() {
    createShape(
        2, 3, 0.13,
        0, 0, 6 * Math.PI, 2 * Math.PI,
        (u) => Math.exp(u / (6 * Math.PI)),
        (a, b, u, v, h) => a * (1 - h) * Math.cos(u) * Math.cos(0.5 * v) * Math.cos(0.5 * v),
        (a, b, u, v, h) => 1 - Math.exp(u / (b * Math.PI)) - Math.sin(v) + h * Math.sin(v) + 0.9,
        (a, b, u, v, h) => a * (-1 + h) * Math.sin(u) * Math.cos(0.5 * v) * Math.cos(0.5 * v),
        (u, v) => 0.5  + 0.5 * Math.sin(u),
        (u, v) => 0.5  + 0.5 * Math.cos(v),
        (u, v) => 0.8
    );
}

function createTranguloidTrefoil() {
    createShape(
        null, null, 0.17,
        -Math.PI, -Math.PI, 2 * Math.PI, 2 * Math.PI,
        (u) => null,
        (a, b, u, v, h) => 2 * Math.sin(3 * u) / (2 + Math.cos(v)),
        (a, b, u, v, h) => 2 * (Math.sin(u) + 2 * Math.sin(2 * u)) / (2 + Math.cos(v + 2 * Math.PI / 3)),
        (a, b, u, v, h) => (Math.cos(u) - 2 * Math.cos(2 * u)) * (2 + Math.cos(v)) * (2 + Math.cos(v + 2 * Math.PI / 3)) / 4,
        (u, v) => 0.5  + 0.5 * Math.cos(v),
        (u, v) => 0.8,
        (u, v) => 0.5  + 0.5 * Math.sin(u)
    );
}

function createCustomShape() {
    createShape(
        2, 0.8, 0.3,
        0, 0, 2 * Math.PI, 2 * Math.PI,
        (u) => null,
        (a, b, u, v, h) => b * Math.sin(v) + 0.5 * Math.sin(4 * u),
        (a, b, u, v, h) => (a + b * Math.cos(v) + 0.5 * Math.sin(4 * u)) * Math.cos(u),
        (a, b, u, v, h) => (a + b * Math.cos(v) + 0.5 * Math.sin(4 * u)) * Math.sin(u),
        (u, v) => 0.8,
        (u, v) => 0.5  + 0.5 * Math.sin(u),
        (u, v) => 0.5  + 0.5 * Math.cos(v)
        );
}

function createShape(a, b, c,
                     u_min, v_min, u_max, v_max,
                     h_func, x_func, y_func, z_func,
                     color_r_func, color_g_func, color_b_func) {
    const n = 48;
    const m = 18;

    // Positions.
    vertices = new Float32Array(3 * (n + 1) * (m + 1));
    // Index data for Line.
    indicesLines = new Uint16Array(2 * 2 * n * m);
    // Index data for tris.
    indicesTris = new Uint16Array(3 * 2 * n * m);
    // Index data for colors.
    colors = new Float32Array(4 * (n + 1) * (m + 1));

    const du = u_max / n;
    const dv = v_max / m;

    // Counter for entries in index array.
    let iLines = 0;
    let iTris = 0;

    // Loop parameter u.
    for (let i = 0, u = u_min; i <= n; i++, u += du) {

        // Loop parameter v.
        for (let j = 0, v = v_min; j <= m; j++, v += dv) {

            const iVertex = i * (m + 1) + j;

            const h = h_func(u);

            const x = x_func(a, b, u, v, h);
            const y = y_func(a, b, u, v, h);
            const z = z_func(a, b, u, v, h);

            // Set vertex positions.
            vertices[iVertex * 3] = x * c;
            vertices[iVertex * 3 + 1] = y * c;
            vertices[iVertex * 3 + 2] = z * c;

            // Set index.
            // Line on beam.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }

            // Line on ring.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - (m + 1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two triangles.
            if (j > 0 && i > 0) {
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1);

                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1) - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
            }

            // Set colors
            const color_r = color_r_func(u, v);
            const color_g = color_g_func(u, v);
            const color_b = color_b_func(u, v);

            colors[iVertex * 4] = color_r;
            colors[iVertex * 4 + 1] = color_g;
            colors[iVertex * 4 + 2] = color_b;
            colors[iVertex * 4 + 3] = 1;
        }
    }
}

let i = 0;
const surface = ['snail', 'tranguloid trefoil', 'own']

function nextSurface() {
    if (i >= surface.length-1) {
        i = 0;
    } else {
        i++;
    }

    renderCurrentSurface();
}

function renderCurrentSurface() {
    let description = document.getElementById('canvas-description');
    let source = document.getElementById('formula-source');
    let formulas = document.getElementById('formulas');

    const currentSurface = surface[i];
    if (currentSurface === 'snail') {
        createSchnecke();
        description.textContent = "Schnecke";
        source.innerHTML = "<a href='http://www.3d-meier.de/tut3/Seite17.html' target='_blank'>Quelle</a>";
        formulas.textContent = "";
    } else if (currentSurface === 'tranguloid trefoil') {
        createTranguloidTrefoil();
        description.textContent = "Tranguloid Trefoil";
        source.innerHTML = "<a href='http://www.3d-meier.de/tut3/Seite57.html' target='_blank'>Quelle</a>";
        formulas.textContent = "";
    } else if (currentSurface === 'own') {
        createCustomShape();
        description.textContent = "Eigene parametrisierte Fläche";
        source.textContent = "Eigenkreation";
        formulas.innerHTML = "<b>Formel:</b><br>" +
            "x = b sin(v) + 0,5 sin(4u)<br>" +
            "y = (a + b cos(v) + 0.5 sin(4u)) cos(u)<br>" +
            "z = (a + b cos(v) + 0.5 sin(4u)) sin(u)";
    }

    updateSurface();
}

function updateSurface() {
    // Setup colors
    gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Setup position vertex buffer object.
    gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
    gl.bufferData(gl.ARRAY_BUFFER,
        vertices, gl.STATIC_DRAW);

    // Setup lines index buffer object.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        indicesLines, gl.STATIC_DRAW);
    iboLines.numberOfElements = indicesLines.length;

    // Setup tris index buffer object.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        indicesTris, gl.STATIC_DRAW);
    iboTris.numberOfElements = indicesTris.length;

    // Clear framebuffer and render primitives.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Setup rendering tris
    gl.enableVertexAttribArray(colAttrib);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.drawElements(gl.TRIANGLES,
        iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);

    // Setup rendering lines
    gl.disableVertexAttribArray(colAttrib);
    gl.vertexAttrib4f(colAttrib, 0, 0, 0, 1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.drawElements(gl.LINES,
        iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);

    gl.enableVertexAttribArray(colAttrib);
}

window.onkeydown = function(event) {
    const key = event.which ? event.which : event.keyCode;
    switch (String.fromCharCode(key)) {
        case ('B'):
            nextSurface();
            break;
    }
}