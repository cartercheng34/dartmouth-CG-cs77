function getCubicSplinePoint(p0, p1, p2, p3, t, s){
    
    if(s == 1){
        var v1 = p0.multiply((1-t)*(1-t)*(1-t)/6.0);
        var v2 = p0.multiply((3*t*t*t - 6*t*t + 4)/6.0);
        var v3 = p0.multiply((-3*t*t*t + 3*t*t + 3*t + 1)/6.0);
        var v4 = p1.multiply(t*t*t/6.0);
        return v1.add(v2).add(v3).add(v4);
    }
    else if(s == 2){
        var v1 = p0.multiply((1-t)*(1-t)*(1-t)/6.0);
        var v2 = p0.multiply((3*t*t*t - 6*t*t + 4)/6.0);
        var v3 = p1.multiply((-3*t*t*t + 3*t*t + 3*t + 1)/6.0);
        var v4 = p2.multiply(t*t*t/6.0);
        return v1.add(v2).add(v3).add(v4);
    }
    else if(s == 3){
        var v1 = p0.multiply((1-t)*(1-t)*(1-t)/6.0);
        var v2 = p1.multiply((3*t*t*t - 6*t*t + 4)/6.0);
        var v3 = p2.multiply((-3*t*t*t + 3*t*t + 3*t + 1)/6.0);
        var v4 = p3.multiply(t*t*t/6.0);
        return v1.add(v2).add(v3).add(v4);
    }
    else if(s == 4){
        var v1 = p1.multiply((1-t)*(1-t)*(1-t)/6.0);
        var v2 = p2.multiply((3*t*t*t - 6*t*t + 4)/6.0);
        var v3 = p3.multiply((-3*t*t*t + 3*t*t + 3*t + 1)/6.0);
        var v4 = p3.multiply(t*t*t/6.0);
        return v1.add(v2).add(v3).add(v4);
    }
    else if(s == 5){
        var v1 = p2.multiply((1-t)*(1-t)*(1-t)/6.0);
        var v2 = p3.multiply((3*t*t*t - 6*t*t + 4)/6.0);
        var v3 = p3.multiply((-3*t*t*t + 3*t*t + 3*t + 1)/6.0);
        var v4 = p3.multiply(t*t*t/6.0);
        return v1.add(v2).add(v3).add(v4);
    }

    
}


function determine(u){
    if(u <= 2/24.0)
        return 1;
    else if(u > 2/24.0 && u <= 6/24.0)
        return 2;
    else if(u > 6/24.0 && u <= 18/24.0)
        return 3;
    else if(u > 18/24.0 && u <= 22/24.0)
        return 4;
    else if(u > 22/24.0 && u <= 1.0)
        return 5;
}

function splinePatchTesselation(patch, tesselation) {
    // TODO: Implement a function that tesselates a cubic bezier patch
    //       into `tesselation` x `tesselation` quadrilaterals.
    //
    // Input:
    //  `patch`: A 4 x 4 array of control vertices.
    //           patch[i][j] is the position of the j'th vertex of the i'th control curve
    //           Positions are given as Vectors
    //
    //           These are proper Vector objects, not arrays of three numbers - please see
    //           vector.js for more info about the vector class and what methods you can use
    //
    //  `tesselation`: Number of output quadrilaterals per side
    //
    // Output: Fill in `vertices` and `faces` with the results.
    // `vertices` should be an array of vectors, specifying the vertex positions of the tesselated patch
    // `faces` should be a list of quadrilaterals. Quadrilaterals are specified by the
    //  vertex indices of its four corners
    // For example,
    //      faces = [
    //          [quad0_index0, quad0_index1, quad0_index2, quad0_index3],
    //          [quad1_index0, quad1_index1, quad1_index2, quad1_index3],
    //          .....
    //      ];
    //
    // It should hold:
    //      vertices.length == (tesselation + 1)*(tesselation + 1)
    //      faces.length == tesselation*tesselation
    //      faces[i].length == 4, for all i


    // The following is dummy code to display the corners of the bezier patch
    // Replace this with your cubic bezier implementation
    var vertices = [];
    var faces = [];

    var num_seg = 13;
    var seg = [2,3,3,3,2];
    var coeff1 = [];
    for(var i = 0 ; i<seg.length ; i++){
        for(var j = 0 ; j<seg[i] ; j++){
            coeff1.push(j/seg[i]);
        }
    }
    coeff1.push(1.0);
    var coeff2 = coeff1;
    var counter1 = 0;
    var counter2 = 0;

    // alert(coeff1.length);

    for(var v = 0 ; v<coeff2.length ; v += 1 ){
        if(coeff2[v] == 0)
            counter2++;
            
        for(var u = 0 ; u<coeff1.length ; u += 1 ){
            if(coeff1[u] == 0)
                counter1++;
            
            var p0 = getCubicSplinePoint(patch[0][0], patch[0][1], patch[0][2], patch[0][3], coeff1[u], counter1);
            var p1 = getCubicSplinePoint(patch[1][0], patch[1][1], patch[1][2], patch[1][3], coeff1[u], counter1);
            var p2 = getCubicSplinePoint(patch[2][0], patch[2][1], patch[2][2], patch[2][3], coeff1[u], counter1);
            var p3 = getCubicSplinePoint(patch[3][0], patch[3][1], patch[3][2], patch[3][3], coeff1[u], counter1);
            var p = getCubicSplinePoint(p0, p1, p2, p3, coeff2[v], counter2);
            vertices.push(p);
            // alert(p0.x);
        }
        counter1 = 0;
    }
    
    var n = num_seg;
    for(var i = 0 ; i < n ; i++){
        for(var  j = 0 ; j < n ; j++){
            faces.push([j+i*(n+1), j+1+i*(n+1), j+1+(i+1)*(n+1), j+(i+1)*(n+1)]);
        }
    }
    
    
    // vertices.push(patch[0][0]);
    // vertices.push(patch[0][3]);
    // vertices.push(patch[3][3]);
    // vertices.push(patch[3][0]);

    // faces.push([0, 1, 2, 3]);
    // faces.push([0, 1, 11, 12]);

    // Do not remove this line
    return {'vertices': vertices, 'faces': faces};
};

var Task3 = function(gl) {
    this.pitch = 0;
    this.yaw = 0;
    this.selectedModel = 0;
    this.subdivisionLevel = 1;
    this.gl = gl;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    this.controlCages = [
        this.buildDebugPatch(),
        {'vertices': TeapotVertices, 'patches': TeapotPatches}
    ];

    this.wireCages = [];
    for (var i = 0; i < this.controlCages.length; ++i)
        this.wireCages.push(this.buildWireCage(this.controlCages[i]));
}

Task3.prototype.buildDebugPatch = function() {
    var transform = Matrix.rotate(25, 1, 0, 0).multiply(Matrix.rotate(45, 0, 1, 0));

    var vertices = [];
    var coords = [-1.5, -0.5, 0.5, 1.5];
    var height = [0, 1, 1, 0]
    for (var i = 0; i < 4; ++i)
        for (var j = 0; j < 4; ++j)
            vertices.push(transform.transformPoint(new Vector(coords[i], height[i]*height[j], coords[j])));

    var patch = [
         0,  1,  2,  3,
         4,  5,  6,  7,
         8,  9, 10, 11,
        12, 13, 14, 15
    ];

    return {'vertices': vertices, 'patches': [patch]};
}

Task3.prototype.buildWireCage = function(cage) {
    var vertices = [];
    var faces = [];
    for (var i = 0; i < cage.patches.length; ++i) {
        for (var m = 0; m < 3; ++m) {
            for (var n = 0; n < 3; ++n) {
                faces.push([
                    vertices.length + (m + 0)*4 + (n + 0),
                    vertices.length + (m + 0)*4 + (n + 1),
                    vertices.length + (m + 1)*4 + (n + 1),
                    vertices.length + (m + 1)*4 + (n + 0)
                ]);
            }
        }
        for (var j = 0; j < 16; ++j)
            vertices.push(cage.vertices[cage.patches[i][j]]);
    }

    return new Mesh(vertices, faces, false).toTriangleMesh(this.gl);
}

Task3.prototype.setSubdivisionLevel = function(subdivisionLevel) {
    this.subdivisionLevel = subdivisionLevel;
    this.computeMesh();
}

Task3.prototype.selectModel = function(idx) {
    this.selectedModel = idx;
    this.computeMesh();
}

Task3.prototype.computeMesh = function() {
    var vertices = [];
    var faces = [];

    var cage = this.controlCages[this.selectedModel];
    for (var i = 0; i < cage.patches.length; ++i) {
        var patch = [];
        for (var m = 0; m < 4; ++m) {
            patch.push([]);
            for (var n = 0; n < 4; ++n)
                patch[m].push(cage.vertices[cage.patches[i][m*4 + n]].clone());
        }

        var result = splinePatchTesselation(patch, this.subdivisionLevel);
        for (var j = 0; j < result.faces.length; ++j)
            for (var k = 0; k < result.faces[j].length; ++k)
                result.faces[j][k] += vertices.length;

        vertices = vertices.concat(result.vertices);
        faces = faces.concat(result.faces);
    }

    this.mesh = new Mesh(vertices, faces, false).toTriangleMesh(this.gl);
}

Task3.prototype.render = function(gl, w, h) {
    gl.viewport(0, 0, w, h);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projection = Matrix.perspective(35, w/h, 0.1, 100);
    var view =
        Matrix.translate(0, 0, -5).multiply(
        Matrix.rotate(this.pitch, 1, 0, 0)).multiply(
        Matrix.rotate(this.yaw, 0, 1, 0));
    var model = new Matrix();

    this.wireCages[this.selectedModel].render(gl, model, view, projection, false, true, new Vector(0.7, 0.7, 0.7));

    this.mesh.render(gl, model, view, projection);
}

Task3.prototype.dragCamera = function(dx, dy) {
    this.pitch = Math.min(Math.max(this.pitch + dy*0.5, -90), 90);
    this.yaw = this.yaw + dx*0.5;
}
