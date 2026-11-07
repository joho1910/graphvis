var recursiveSphere = (function() {
    var recursionLevel = 2;

    function getRecursionLevel() {
        return recursionLevel;
    }

    function setRecursionLevel(newRecursionLevel) {
        recursionLevel = newRecursionLevel;
    }

    function createVertexData() {
        var vertices = [];
        var indicesLines = [];
        var indicesTris = [];

        var middlePointIndexCache = new Map();
        var index = 0;

        // add vertices to mesh, fix position to be on unit sphere, return index
        function addVertex(x, y, z) {
            var length = Math.sqrt(x * x + y * y + z * z);
            vertices.push(x/length, y/length, z/length);
            return index++;
        }

        // return index of point in the middle of p1 and p2
        function getMiddlePoint(p1, p2) {
            // check if middle point is already in cache
            var firstIsSmaller = p1 < p2;
            var smallerIndex = firstIsSmaller ? p1 : p2;
            var greaterIndex = firstIsSmaller ? p2 : p1;
            var key = smallerIndex + "_" + greaterIndex;

            if (middlePointIndexCache.has(key)) {
                return middlePointIndexCache.get(key);
            }

            // if middle point is not in cache: calculate it
            var x1 = vertices[p1 * 3];
            var y1 = vertices[p1 * 3 + 1];
            var z1 = vertices[p1 * 3 + 2];

            var x2 = vertices[p2 * 3];
            var y2 = vertices[p2 * 3 + 1];
            var z2 = vertices[p2 * 3 + 2];

            var middle = addVertex(
                (x1 + x2) / 2,
                (y1 + y2) / 2,
                (z1 + z2) / 2,
            );

            middlePointIndexCache.set(key, middle);
            return middle;
        }

        // create 12 vertices of an icosahedron
        var t = (1 + Math.sqrt(5)) / 2;

        addVertex(-1, t, 0);
        addVertex(1, t, 0);
        addVertex(-1, -t, 0);
        addVertex(1, -t, 0);

        addVertex(0, -1, t);
        addVertex(0, 1, t);
        addVertex(0, -1, -t);
        addVertex(0, 1, -t);

        addVertex(t, 0, -1);
        addVertex(t, 0, 1);
        addVertex(-t, 0, -1);
        addVertex(-t, 0, 1);

        // create 20 triangles of the icosahedron
        var faces = [
            [0, 11, 5],
            [0, 5, 1],
            [0, 1, 7],
            [0, 7, 10],
            [0, 10, 11],

            [1, 5, 9],
            [5, 11, 4],
            [11, 10, 2],
            [10, 7, 6],
            [7, 1, 8],

            [3, 9, 4],
            [3, 4, 2],
            [3, 2, 6],
            [3, 6, 8],
            [3, 8, 9],

            [4, 9, 5],
            [2, 4, 11],
            [6, 2, 10],
            [8, 6, 7],
            [9, 8, 1]
        ];

        // refine triangles
        for (var i = 0; i < recursionLevel; i++) {
            var faces2 = [];

            for (var triangle of faces) {
                // replace triangle by 4 triangles
                var a = getMiddlePoint(triangle[0], triangle[1]);
                var b = getMiddlePoint(triangle[1], triangle[2]);
                var c = getMiddlePoint(triangle[2], triangle[0]);

                faces2.push([triangle[0], a, c]);
                faces2.push([triangle[1], b, a]);
                faces2.push([triangle[2], c, b]);
                faces2.push([a, b, c]);
            }

            faces = faces2;
        }

        for (var tri of faces) {
            var v1 = tri[0];
            var v2 = tri[1];
            var v3 = tri[2];

            indicesTris.push(v1, v2, v3);

            indicesLines.push(
                v1, v2,
                v2, v3,
                v3, v1
            );
        }

        this.vertices = new Float32Array(vertices);
        this.normals = new Float32Array(vertices);
        this.indicesLines = new Uint16Array(indicesLines);
        this.indicesTris = new Uint16Array(indicesTris);
    }

    return {
        createVertexData : createVertexData,
        getRecursionLevel : getRecursionLevel,
        setRecursionLevel : setRecursionLevel
    }
}());
