var cone = (function() {

    function createVertexData() {
        var n = 32;
        var m = 16;
        // Positions.
        this.vertices = new Float32Array(3 * (n+1) * (m+1));
        var vertices = this.vertices;
        // Normals.
        this.normals = new Float32Array(3 * (n+1) * (m+1));
        var normals = this.normals;
        // Index data.
        this.indicesLines = new Uint16Array(2 * 2 * n * m);
        var indicesLines = this.indicesLines;
        this.indicesTris = new Uint16Array(3 * 2 * n * m);
        var indicesTris= this.indicesTris;

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
                vertices[iVertex * 3] = x - 1.25;
                vertices[iVertex * 3 + 1] = y;
                vertices[iVertex * 3 + 2] = z + 0.35;

                // Calc and set normals
                var factor = 1 / Math.sqrt(2);
                var nx = factor * Math.cos(u);
                var nz = factor * Math.sin(u);
                var ny = factor;
                normals[iVertex * 3] = nx;
                normals[iVertex * 3 + 1] = nz;
                normals[iVertex * 3 + 2] = ny;

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
                    indicesTris[iTris++] = iVertex - (m+1);
                    indicesTris[iTris++] = iVertex - 1;

                    indicesTris[iTris++] = iVertex - 1;
                    indicesTris[iTris++] = iVertex - (m+1);
                    indicesTris[iTris++] = iVertex - (m+1) - 1;
                }
            }
        }
    }

    return {
        createVertexData : createVertexData
    }
}());
