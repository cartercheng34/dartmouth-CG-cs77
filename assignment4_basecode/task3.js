// TODO: Task 3 - Skinning a custom mesh.
//
// In this task you will be skinning a given 'arm' mesh with multiple bones.
// We have already provided the initial locations of the two bones for your convenience
// You will have to add multiple bones to do a convincing job.
var Task3 = function(gl)
{
	this.pitch = 0;
    this.yaw = 0;
	
	// Create a skin mesh
	this.skin = new SkinMesh(gl);
	this.skin.createArmSkin();
	
	// Create an empty skeleton for now.
	this.skeleton = new Skeleton();
	
	// TODO: Task-3
	// Create additional joints as required.
	this.mJoint1 = new Joint ( 	      null, new Vector( -15, 0, 0), new Vector(0, 0,  1), 6.5, "Upper Arm", gl);
	this.mJoint2 = new Joint (this.mJoint1, new Vector(   7, 0, 0), new Vector(0, 0, -1), 5.5, "Forearm", gl);
	this.mJoint3 = new Joint (this.mJoint2, new Vector(   5.75, 0, 0), new Vector(0, 0, -1), 1.5, "Wrist", gl);
	
	this.mJoint20 = new Joint (this.mJoint3, new Vector(   1.0, -0.4, -0.95), new Vector(0, 0, -1), 0.3, "Wrist-thumb", gl);
	this.mJoint4 = new Joint (this.mJoint3, new Vector(   1.5, -0.2, -0.6), new Vector(0, 0, -1), 0.5, "Wrist-index", gl);
	this.mJoint5 = new Joint (this.mJoint3, new Vector(   1.6, 0, 0), new Vector(0, 0, -1), 0.5, "Wrist-middle", gl);
	this.mJoint6 = new Joint (this.mJoint3, new Vector(   1.5, -0.2, 0.6), new Vector(0, 0, -1), 0.5, "Wrist-ring", gl);
	this.mJoint7 = new Joint (this.mJoint3, new Vector(   1.5, -0.3, 0.95), new Vector(0.2, 0, -1), 0.3, "Wrist-little", gl);

	this.mJoint21 = new Joint (this.mJoint20, new Vector(   0.4, -0.2, -0.22), new Vector(0, 0, -1), 0.2, "thumb-bot", gl);
	this.mJoint22 = new Joint (this.mJoint21, new Vector(   0.4, -0.2, -0.12), new Vector(0, 0, -1), 0.2, "thumb-top", gl);
	
	this.mJoint8 = new Joint (this.mJoint4, new Vector(   0.65, 0, 0), new Vector(0, 0, -1), 0.3, "index-bot", gl);
	this.mJoint9 = new Joint (this.mJoint8, new Vector(   0.4, -0.2, -0.1), new Vector(0, 0, -1), 0.3, "index-mid", gl);
	this.mJoint10 = new Joint (this.mJoint9, new Vector(   0.4, -0.2, -0.1), new Vector(0, 0, -1), 0.3, "index-top", gl);

	this.mJoint11 = new Joint (this.mJoint5, new Vector(   0.8, -0.1, 0), new Vector(0, 0, -1), 0.3, "middle-bot", gl);
	this.mJoint12 = new Joint (this.mJoint11, new Vector(   0.4, -0.2, -0.1), new Vector(0, 0, -1), 0.3, "middle-mid", gl);
	this.mJoint13 = new Joint (this.mJoint12, new Vector(   0.5, -0.2, -0), new Vector(0, 0, -1), 0.3, "middle-top", gl);

	this.mJoint14 = new Joint (this.mJoint6, new Vector(   0.8, -0.1, 0), new Vector(0, 0, -1), 0.3, "ring-bot", gl);
	this.mJoint15 = new Joint (this.mJoint14, new Vector(   0.4, -0.1, -0), new Vector(0, 0, -1), 0.3, "ring-mid", gl);
	this.mJoint16 = new Joint (this.mJoint15, new Vector(   0.4, -0.1, -0), new Vector(0, 0, -1), 0.3, "ring-top", gl);

	this.mJoint17 = new Joint (this.mJoint7, new Vector(   0.45, -0.1, 0), new Vector(0, 0, -1), 0.25, "little-bot", gl);
	this.mJoint18 = new Joint (this.mJoint17, new Vector(   0.3, -0.2, 0.06), new Vector(0, 0, -1), 0.25, "little-mid", gl);
	this.mJoint19 = new Joint (this.mJoint18, new Vector(   0.3, -0.2, 0.07), new Vector(0, 0, -1), 0.25, "little-top", gl);



	// Add your joints to the skeleton here
	this.skeleton.addJoint(this.mJoint1);
	this.skeleton.addJoint(this.mJoint2);
	this.skeleton.addJoint(this.mJoint3);
	this.skeleton.addJoint(this.mJoint20);
	this.skeleton.addJoint(this.mJoint4);
	this.skeleton.addJoint(this.mJoint5);
	this.skeleton.addJoint(this.mJoint6);
	this.skeleton.addJoint(this.mJoint7);
	this.skeleton.addJoint(this.mJoint21);
	this.skeleton.addJoint(this.mJoint22);
	this.skeleton.addJoint(this.mJoint8);
	this.skeleton.addJoint(this.mJoint9);
	this.skeleton.addJoint(this.mJoint10);
	this.skeleton.addJoint(this.mJoint11);
	this.skeleton.addJoint(this.mJoint12);
	this.skeleton.addJoint(this.mJoint13);
	this.skeleton.addJoint(this.mJoint14);
	this.skeleton.addJoint(this.mJoint15);
	this.skeleton.addJoint(this.mJoint16);
	this.skeleton.addJoint(this.mJoint17);
	this.skeleton.addJoint(this.mJoint18);
	this.skeleton.addJoint(this.mJoint19);
	
	// set the skeleton
	this.mShowWeights = false;

	this.skin.setSkeleton(this.skeleton, "linear");
	
	gl.enable(gl.DEPTH_TEST);
}

Task3.prototype.render = function(gl, w, h, timepassed) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projection = Matrix.perspective(60, w/h, 0.1, 100);
    var view =
        Matrix.translate(0, 0, -10).multiply(
        Matrix.rotate(this.pitch, 1, 0, 0)).multiply(
        Matrix.rotate(this.yaw, 0, 1, 0)).multiply(
        Matrix.translate(8, 0, 0)).multiply(
		Matrix.rotate(30, 1, 0, 0));
		
	
    
	if(this.skin)
		this.skin.render(gl, view, projection, false);

	
	
	if(this.skeleton)
	{
		gl.clear(gl.DEPTH_BUFFER_BIT);
		this.skeleton.render(gl, view, projection);
	}

	// animation
	if(this.skeleton.mJoints){
		
		// this.skeleton.mJoints[0].setJointAngle(deltaT/14);
		var t0 = 0;
		var t1 = 2500;
		var t2 = 3000;
		var t3 = 4000;

		var deltaT = timepassed;

		if(deltaT <= t1){
			this.skeleton.mJoints[0].setJointAngle(75/t1*deltaT);
			this.skeleton.mJoints[1].setJointAngle(105/t1*deltaT);
			this.skeleton.mJoints[2].setJointAngle(11/t1*deltaT);
			this.skeleton.mJoints[9].setJointAngle(77/t1*deltaT);
			for(var i = 10 ; i < 22; i++){
				this.skeleton.mJoints[i].setJointAngle(84/t1*deltaT);
			}
		}
		if(deltaT >= t2 && deltaT <= t3){
			this.skeleton.mJoints[0].setJointAngle(75 - 165/(t3-t2)*(deltaT-t2));
			this.skeleton.mJoints[1].setJointAngle(105 - 105/(t3-t2)*(deltaT-t2));
		}
		this.skin.updateSkin();
		
	}

	
}

Task3.prototype.setJointAngle = function(id, value)
{
	if(this.skeleton && id < this.skeleton.getNumJoints())
	{
		this.skeleton.getJoint(id).setJointAngle(value);
		this.skin.updateSkin();
	}
}

Task3.prototype.dragCamera = function(dx, dy) {
    this.pitch = Math.min(Math.max(this.pitch + dy*0.5, -90), 90);
    this.yaw = this.yaw + dx*0.5;
}

Task3.prototype.showJointWeights = function(idx)
{
	this.skin.showJointWeights(idx);
    this.skin.updateSkin();
}
