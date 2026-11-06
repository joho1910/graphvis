'use strict';

// Get the WebGL context.
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('experimental-webgl');

// Pipeline setup.
gl.clearColor(.95, .95, .95, 1);
// Backface culling.
gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
// Depth(Z)-Buffer.
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
// Polygon offset of rastered Fragments.
gl.enable(gl.POLYGON_OFFSET_FILL);
gl.polygonOffset(0.5, 0);

// Compile vertex shader.
var vsSource = '' +
    'attribute vec3 pos;' +
    'attribute vec4 col;' +
    'varying vec4 color;' +
    'void main(){' + 'color = col;' +
    'gl_Position = vec4(pos, 1);' +
    '}';
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile fragment shader.
var fsSouce = 'precision mediump float;' +
    'varying vec4 color;' +
    'void main() {' +
    'gl_FragColor = color;' +
    '}';
var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSouce);
gl.compileShader(fs);

// Link shader together into a program.
var prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.bindAttribLocation(prog, 0, "pos");
gl.linkProgram(prog);
gl.useProgram(prog);

// Vertex data.
// Positions, Index data.
var vertices = [];
var indicesLines = [];
var indicesTris = [];

// Fill the data arrays.
var cone = createVertexDataForCone();
var torus = createVertexDataForTorus();
addBody(cone.vertices, cone.indicesLines, cone.indicesTris);
addBody(torus.vertices, torus.indicesLines, torus.indicesTris);
vertices = new Float32Array(vertices);
indicesLines = new Uint16Array(indicesLines);
indicesTris = new Uint16Array(indicesTris);

// Setup position vertex buffer object.
var vboPos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
gl.bufferData(gl.ARRAY_BUFFER,
    vertices, gl.STATIC_DRAW);
// Bind vertex buffer to attribute variable.
var posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT,
    false, 0, 0);
gl.enableVertexAttribArray(posAttrib);

// Setup constant color.
var colAttrib = gl.getAttribLocation(prog, 'col');

// Setup lines index buffer object.
var iboLines = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    indicesLines, gl.STATIC_DRAW);
iboLines.numberOfElements = indicesLines.length;
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Setup tris index buffer object.
var iboTris = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    indicesTris, gl.STATIC_DRAW);
iboTris.numberOfElements = indicesTris.length;
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Clear framebuffer and render primitives.
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Setup rendering tris.
gl.vertexAttrib4f(colAttrib, 0, 1, 1, 1);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
gl.drawElements(gl.TRIANGLES,
    iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);

// Setup rendering lines.
gl.vertexAttrib4f(colAttrib, 0, 0, 1, 1);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
gl.drawElements(gl.LINES,
    iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);

function createVertexDataForCone() {
    var n = 32;
    var m = 16;
    // Positions.
    var vertices = new Float32Array(3 * (n+1) * (m+1));
    // Index data.
    var indicesLines = new Uint16Array(2 * 2 * n * m);
    var indicesTris  = new Uint16Array(3 * 2 * n * m);

    var du = 2*Math.PI/n;
    var dv = 1/m;
    var r = 0.6;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    // Loop angle u.
    for(var i=0, u=-Math.PI; i <= n; i++, u += du) {
        // Loop height v.
        for(var j=0, v=0; j <= m; j++, v += dv) {

            var iVertex = i*(m+1) + j;

            var x = v * Math.cos(u);
            var z = v * Math.sin(u);
            var y = -v - 0.5;

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Set index.
            // Line on beam.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - (m+1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if(j>0 && i>0){
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1) - 1;
                indicesTris[iTris++] = iVertex - (m+1);
            }
        }
    }

    return {
        vertices: vertices,
        indicesLines: indicesLines,
        indicesTris: indicesTris,
    }
}

function createVertexDataForTorus() {
    var n = 35;
    var m = 32;
    // Positions.
    var vertices = new Float32Array(3 * (n+1) * (m+1));
    // Index data.
    var indicesLines = new Uint16Array(2 * 2 * n * m);
    var indicesTris  = new Uint16Array(3 * 2 * n * m);

    var du = 2 * Math.PI / n;
    var dv = 2 * Math.PI / m;
    var r = 0.3; // inner radius
    var R = 0.5; // outer radius

    var c = 0.5;

    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    // Loop angle u.
    for(var i=0, u=-Math.PI; i <= n; i++, u += du) {
        // Loop height v.
        for(var j=0, v=0; j <= m; j++, v += dv) {

            var iVertex = i*(m+1) + j;

            var x = (R + r * Math.cos(u)) * Math.cos(v);
            var z = (R + r * Math.cos(u)) * Math.sin(v);
            var y = r * Math.sin(u);

            // Set vertex positions.
            vertices[iVertex * 3] = x * c;
            vertices[iVertex * 3 + 1] = y * c;
            vertices[iVertex * 3 + 2] = z * c;

            // Set index.
            // Line on beam.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - (m+1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if(j>0 && i>0){
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1) - 1;
                indicesTris[iTris++] = iVertex - (m+1);
            }
        }
    }

    return {
        vertices: vertices,
        indicesLines: indicesLines,
        indicesTris: indicesTris,
    }
}

function createVertexDataForSphere() {

}

function addBody(bodyVertices, bodyIndicesLines, bodyIndicesTris) {
    var offset = vertices.length / 3;

    // add vertices for body
    vertices.push(...bodyVertices);

    // add line indices
    for (var i = 0; i < bodyIndicesLines.length; i++) {
        indicesLines.push(bodyIndicesLines[i] + offset);
    }

    // add tris indices
    for (var i = 0; i < bodyIndicesTris.length; i++) {
        indicesTris.push(bodyIndicesTris[i] + offset);
    }
}

window.onkeydown = function (event) {
    const key = event.which ? event.which : event.keyCode;

    console.log(String.fromCharCode(key));
    switch (key) {
        case ('\''):
            moveLeft();
            break;
        case ('%'):
            moveRight();
            break;
        case ('N'):
            changeRadius();
            break;
    }
}

function moveLeft() {
    console.log("moveLeft()");
}

function moveRight() {
    console.log("moveRight()");
}

function changeRadius() {
    console.log("changeRadius()");
}