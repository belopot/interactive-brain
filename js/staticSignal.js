// Static Signal ---------------------------------------------------------

function StaticSignal(signalVisible, signalPos, signalSize, signalColor, signalInterval) {

	this.spriteTextureSignal = TEXTURES.electric;

	this.pGeom = new THREE.Geometry();
	this.particles = this.pGeom.vertices;


	this.pColor = signalColor;
	this.pSize = 4 * signalSize;

	this.particles[0] = new THREE.Vector3(0,0,0);

	this.meshComponents = new THREE.Object3D();
	this.meshComponents.visible = signalVisible;
	this.meshComponents.position.set(signalPos.x, signalPos.y, signalPos.z);

	// inner particle
	this.pMat = new THREE.PointCloudMaterial({
		map: this.spriteTextureSignal,
		size: this.pSize,
		color: this.pColor,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true
	});

	this.pMesh = new THREE.PointCloud(this.pGeom, this.pMat);
	this.pMesh.frustumCulled = false;

	this.meshComponents.add(this.pMesh);


	// outer particle glow
	this.pMat_outer = this.pMat.clone();
	this.pMat_outer.size = this.pSize * 10;
	this.pMat_outer.opacity = 0.1;

	this.pMesh_outer = new THREE.PointCloud(this.pGeom, this.pMat_outer);
	this.pMesh_outer.frustumCulled = false;

	this.meshComponents.add(this.pMesh_outer);

	this.interval = signalInterval;
	this.timer = 0;
}

StaticSignal.prototype.getAvgExecutionTime = function () {
	return this.profTime / this.itt;
};

StaticSignal.prototype.getParticle = function () {

	var p = this.particles[0];
	return p;
};

StaticSignal.prototype.update = function (deltaTime) {
	this.timer += deltaTime * 6 / (this.interval / 1000);
	this.pMat.size = this.pSize * Math.sin(this.timer);
	this.pMat_outer.size = this.pSize * 10 * Math.sin(this.timer);
	this.pGeom.verticesNeedUpdate = true;
};

StaticSignal.prototype.updateSettings = function () {

	// inner particle
	this.pMat.color.setStyle(this.pColor);
	this.pMat.size = this.pSize;
	// outer particle
	this.pMat_outer.color.setStyle(this.pColor);
	this.pMat_outer.size = this.pSize * 10;

};
