var CatmullRomSpline = function(canvasId)
{
	// Set up all the data related to drawing the curve
	this.cId = canvasId;
	this.dCanvas = document.getElementById(this.cId);
	this.ctx = this.dCanvas.getContext('2d');
	this.dCanvas.addEventListener('resize', this.computeCanvasSize());
	this.computeCanvasSize();

	// Setup all the data related to the actual curve.
	this.nodes = new Array();
	this.showControlPolygon = true;
	this.showTangents = true;

	// Assumes a equal parametric split strategy
	this.numSegments = 16;

	// Global tension parameter
	this.tension = 0.5;

	// Setup event listeners
	this.cvState = CVSTATE.Idle;
	this.activeNode = null;

	// closure
	var that = this;

	// Event listeners
	this.dCanvas.addEventListener('mousedown', function(event) {
        that.mousePress(event);
    });

	this.dCanvas.addEventListener('mousemove', function(event) {
		that.mouseMove(event);
	});

	this.dCanvas.addEventListener('mouseup', function(event) {
		that.mouseRelease(event);
	});

	this.dCanvas.addEventListener('mouseleave', function(event) {
		that.mouseRelease(event);
	});
}

CatmullRomSpline.prototype.setShowControlPolygon = function(bShow)
{
	this.showControlPolygon = bShow;
}

CatmullRomSpline.prototype.setShowTangents = function(bShow)
{
	this.showTangents = bShow;
}

CatmullRomSpline.prototype.setTension = function(val)
{
	this.tension = val;
}

CatmullRomSpline.prototype.setNumSegments = function(val)
{
	this.numSegments = val;
}

CatmullRomSpline.prototype.mousePress = function(event)
{
	if (event.button == 0) {
		this.activeNode = null;
		var pos = getMousePos(event);

		// Try to find a node below the mouse
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].isInside(pos.x,pos.y)) {
				this.activeNode = this.nodes[i];
				break;
			}
		}
	}

	// No node selected: add a new node
	if (this.activeNode == null) {
		this.addNode(pos.x,pos.y);
		this.activeNode = this.nodes[this.nodes.length-1];
	}

	this.cvState = CVSTATE.SelectPoint;
	event.preventDefault();
}

CatmullRomSpline.prototype.mouseMove = function(event) {
	if (this.cvState == CVSTATE.SelectPoint || this.cvState == CVSTATE.MovePoint) {
		var pos = getMousePos(event);
		this.activeNode.setPos(pos.x,pos.y);
	} else {
		// No button pressed. Ignore movement.
	}
}

CatmullRomSpline.prototype.mouseRelease = function(event)
{
	this.cvState = CVSTATE.Idle; this.activeNode = null;
}

CatmullRomSpline.prototype.computeCanvasSize = function()
{
	var renderWidth = Math.min(this.dCanvas.parentNode.clientWidth - 20, 820);
    var renderHeight = Math.floor(renderWidth*9.0/16.0);
    this.dCanvas.width = renderWidth;
    this.dCanvas.height = renderHeight;
}

CatmullRomSpline.prototype.drawControlPolygon = function()
{
	for (var i = 0; i < this.nodes.length-1; i++)
		drawLine(this.ctx, this.nodes[i].x, this.nodes[i].y,
					  this.nodes[i+1].x, this.nodes[i+1].y);
}

CatmullRomSpline.prototype.drawControlPoints = function()
{
	for (var i = 0; i < this.nodes.length; i++)
		this.nodes[i].draw(this.ctx);
}

CatmullRomSpline.prototype.drawTangents = function()
{

// ################ Edit your code below
	// TODO: Task 4
    // Compute tangents at the nodes and draw them using drawLine(this.ctx, x0, y0, x1, y1);
	// Note: Tangents are available only for 2,..,n-1 nodes. The tangent is not defined for 1st and nth node.
    // The tangent of the i-th node can be computed from the (i-1)th and (i+1)th node
    // Normalize the tangent and compute a line with a length of 50 pixels from the current control point.
// ################
	
	for(var i = 1 ; i < this.nodes.length - 1 ;i++){
		
		var x0 = this.nodes[i-1].x;
		var x1 = this.nodes[i].x;
		var x2 = this.nodes[i+1].x;

		var y0 = this.nodes[i-1].y;
		var y1 = this.nodes[i].y;
		var y2 = this.nodes[i+1].y;

		// var d01 = Math.sqrt((x0-x1)*(x0-x1) + (y0-y1)*(y0-y1));
		// var d12 = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));

		// var v10 = [(x1-x0)/d01, (y1-y0)/d01];
		// var v21 = [(x2-x1)/d12, (y2-y1)/d12];

		// var tangent = [v10[0] + v21[0], v10[1] + v21[1]];
		// var tangent_len = Math.sqrt(tangent[0]*tangent[0] + tangent[1]*tangent[1]);

		var tangent = [x2-x0, y2-y0];
		var tangent_len = Math.sqrt(tangent[0]*tangent[0] + tangent[1]*tangent[1]);
		tangent[0] /= tangent_len;
		tangent[1] /= tangent_len;

		var endP = [x1 + tangent[0]*50, y1 + tangent[1]*50];
		setColors(this.ctx, 'red');
		drawLine(this.ctx, x1, y1, endP[0], endP[1]);
	}
}

CatmullRomSpline.prototype.draw = function()
{

// ################ Edit your code below
	// TODO: Task 5: Draw the Catmull-Rom curve (see the assignment for more details)
    // Hint: You should use drawLine to draw lines, i.e.
	// setColors(this.ctx,'black');
	// .....
	// drawLine(this.ctx, x0, y0, x1, y1);
	// ....
// ################

	for(var i = 1 ; i < this.nodes.length-2 ; i++){
		var x0 = this.nodes[i-1].x;
		var x1 = this.nodes[i].x;
		var x2 = this.nodes[i+1].x;
		var x3 = this.nodes[i+2].x;

		var y0 = this.nodes[i-1].y;
		var y1 = this.nodes[i].y;
		var y2 = this.nodes[i+1].y;
		var y3 = this.nodes[i+2].y;

		var startP_x = x1;
		var startP_y = y1;
		for(var j = 0 ; j <= 1 ; j += 1 / this.numSegments){
			// console.log(j);
			var c0 = [x1, y1];
			var c1 = [-this.tension*x0 + this.tension*x2, -this.tension*y0 + this.tension*y2];
			var c2 = [2*this.tension*x0 + (this.tension-3)*x1 + (3-2*this.tension)*x2 - this.tension*x3, 2*this.tension*y0 + (this.tension-3)*y1 + (3-2*this.tension)*y2 - this.tension*y3];
			var c3 = [-this.tension*x0 + (2-this.tension)*x1 + (this.tension-2)*x2 + this.tension*x3, -this.tension*y0 + (2-this.tension)*y1 + (this.tension-2)*y2 + this.tension*y3];

			var endP_x = c0[0]+c1[0]*j+c2[0]*j*j+c3[0]*j*j*j;
			var endP_y = c0[1]+c1[1]*j+c2[1]*j*j+c3[1]*j*j*j;

			setColors(this.ctx,'black');
			drawLine(this.ctx, startP_x, startP_y, endP_x, endP_y);
			startP_x = endP_x;
			startP_y = endP_y;
		}
	}
}

// NOTE: Task 4 code.
CatmullRomSpline.prototype.drawTask4 = function()
{
	// clear the rect
	this.ctx.clearRect(0, 0, this.dCanvas.width, this.dCanvas.height);

    if (this.showControlPolygon) {
		// Connect nodes with a line
        setColors(this.ctx,'rgb(10,70,160)');
        for (var i = 1; i < this.nodes.length; i++) {
            drawLine(this.ctx, this.nodes[i-1].x, this.nodes[i-1].y, this.nodes[i].x, this.nodes[i].y);
        }
		// Draw nodes
		setColors(this.ctx,'rgb(10,70,160)','white');
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].draw(this.ctx);
		}
    }

	// We need atleast 4 points to start rendering the curve.
    if(this.nodes.length < 4) return;

	// draw all tangents
	if(this.showTangents)
		this.drawTangents();
}

// NOTE: Task 5 code.
CatmullRomSpline.prototype.drawTask5 = function()
{
	// clear the rect
	this.ctx.clearRect(0, 0, this.dCanvas.width, this.dCanvas.height);

    if (this.showControlPolygon) {
		// Connect nodes with a line
        setColors(this.ctx,'rgb(10,70,160)');
        for (var i = 1; i < this.nodes.length; i++) {
            drawLine(this.ctx, this.nodes[i-1].x, this.nodes[i-1].y, this.nodes[i].x, this.nodes[i].y);
        }
		// Draw nodes
		setColors(this.ctx,'rgb(10,70,160)','white');
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].draw(this.ctx);
		}
    }

	// We need atleast 4 points to start rendering the curve.
    if(this.nodes.length < 4) return;

	// Draw the curve
	this.draw();

	if(this.showTangents)
		this.drawTangents();
}


// Add a control point to the curve
CatmullRomSpline.prototype.addNode = function(x,y)
{
	this.nodes.push(new Node(x,y));
}
