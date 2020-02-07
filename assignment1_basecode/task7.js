// TODO: Implement a shader program to do Lambert and Phong shading
//       in the fragment shader. How you do this exactly is left up to you.

//       You may need multiple uniforms to get all the required matrices
//       for transforming points, vectors and normals.

var PhongVertexSource = `
    uniform mat4 ModelViewProjection;
    
    
    attribute vec3 Position;
    attribute vec3 Normal;

    varying vec3 vertPos;
    varying vec3 surface_N;
    
    
    void main() {

// ################ Edit your code below
        gl_Position = ModelViewProjection * vec4(Position, 1.0);
        vertPos = Position;
        surface_N = Normal;
// ################

    }
`;
var PhongFragmentSource = `
    precision highp float;
    uniform mat4 NormalTransform;
    uniform mat4 ModelView;
    uniform mat4 View;

    varying vec3 vertPos;
    varying vec3 surface_N;
    
    const vec3 LightPosition = vec3(4, 1, 4);
    const vec3 LightIntensity = vec3(20);
    const vec3 ka = 0.3*vec3(1, 0.5, 0.5);
    const vec3 kd = 0.7*vec3(1, 0.5, 0.5);
    const vec3 ks = vec3(0.4);
    const float n = 60.0;
    
    
    void main() {

// ################ Edit your code below
// ################
        vec4 trans_v = ModelView * vec4(vertPos, 1.0);
        vec4 tmp_N = NormalTransform * vec4(surface_N, 0.0);
        vec4 trans_L = View * vec4(LightPosition, 1.0);

        vec3 N = normalize(vec3(tmp_N[0], tmp_N[1], tmp_N[2]));
        vec3 L = normalize(vec3(trans_L[0], trans_L[1], trans_L[2]) - vec3(trans_v[0], trans_v[1], trans_v[2]));
        vec3 E = normalize(-vec3(trans_v[0], trans_v[1], trans_v[2]));
        vec3 R = reflect(-L, N);

        vec3 H = normalize(L + E);
        float distance = length(vec3(trans_L[0], trans_L[1], trans_L[2]) - vec3(trans_v[0], trans_v[1], trans_v[2]));

        vec3 La = ka;
        vec3 Ld = kd * LightIntensity * max(dot(N, L), 0.0);
        vec3 Ls = ks * pow(max(dot(N, H), 0.0), n) * LightIntensity;

        gl_FragColor = vec4(La + (Ld+Ls)/(distance*distance), 1);
    }
`;

ShadedTriangleMesh.prototype.renderPhong = function(gl, model, view, projection) {
    gl.useProgram(this.shaderProgram);
    
    // TODO: Assemble a model-view-projection matrix from the specified matrices. You can copy your code from task 5

// ################ Edit your code below
    var modelViewProjection = new SimpleMatrix();
    var tmp = view.inverse(view);
    modelViewProjection = modelViewProjection.multiply(projection).multiply(tmp).multiply(model);
    
    var MV = new SimpleMatrix();
    MV = MV.multiply(tmp).multiply(model);
    var MV_inverse = MV.inverse(MV);
    var normal_transform = MV_inverse.transpose();
// ################

    
    // TODO: Implement a render method to do Lambert+Phong shading.
    //       Currently the code only passes the model-view-projection matrix. You may need additional
    //       matrices to solve the problem. Use the existing code as a template and pass however many matrices you need.

// ################ Edit your code below
// ################

    
    // Pass matrix to shader uniform
    // IMPORTANT: OpenGL has different matrix conventions than our JS program. We need to transpose the matrix before passing it
    // to OpenGL to get the correct matrix in the shader.
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "ModelViewProjection"), false, modelViewProjection.transpose().m);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "ModelView"), false, MV.transpose().m);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "NormalTransform"), false, normal_transform.transpose().m);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "View"), false, tmp.transpose().m);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexIbo);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionVbo);
    var positionAttrib = gl.getAttribLocation(this.shaderProgram, "Position");
    if (positionAttrib >= 0) {
        gl.enableVertexAttribArray(positionAttrib);
        gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalVbo);
    var normalAttrib = gl.getAttribLocation(this.shaderProgram, "Normal");
    if (normalAttrib >= 0) {
        gl.enableVertexAttribArray(normalAttrib);
        gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);
    }
    
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
}

var Task7 = function(canvas, gl) {
    this.cameraAngle = 0;
    this.sphereMesh = new ShadedTriangleMesh(gl, SpherePositions, SphereNormals, SphereTriIndices, PhongVertexSource, PhongFragmentSource);
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, PhongVertexSource, PhongFragmentSource);
    
    gl.enable(gl.DEPTH_TEST);
}

Task7.prototype.render = function(canvas, gl, w, h) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projection = SimpleMatrix.perspective(45, w/h, 0.1, 100);
    var view = SimpleMatrix.rotate(this.cameraAngle, 1, 0, 0).multiply(
        SimpleMatrix.translate(0, 0, 6));
    
    var rotation = SimpleMatrix.rotate(Date.now()/25, 0, 1, 0);
    var cubeModel = SimpleMatrix.translate(-1.8, 0, 0).multiply(rotation);
    var sphereModel = SimpleMatrix.translate(1.8, 0, 0).multiply(rotation).multiply(SimpleMatrix.scale(1.2, 1.2, 1.2));

    this.sphereMesh.renderPhong(gl, sphereModel, view, projection);
    this.cubeMesh.renderPhong(gl, cubeModel, view, projection);
}

Task7.prototype.dragCamera = function(dy) {
    this.cameraAngle = Math.min(Math.max(this.cameraAngle - dy*0.5, -90), 90);
}
