// ActiveSignal extends THREE.Vector3 ----------------------------------------------------------------

function ActiveSignal(particlePool, axonLength) {
	this.speed = axonLength / (2 * Math.log10(axonLength * 10) * particlePool.interval);
	this.alive = true;
	this.t = null;
	this.startingPoint = null;
	this.axon = null;
	this.activeAxon = null;
	this.particle = particlePool.getParticle();
	THREE.Vector3.call(this);
}

ActiveSignal.prototype = Object.create(THREE.Vector3.prototype);

ActiveSignal.prototype.setConnection = function (Connection) {

	this.startingPoint = Connection.startingPoint;
	this.axon = Connection.axon;
	if (this.startingPoint === 'A') this.t = 0;
	else if (this.startingPoint === 'B') this.t = 1;

	//Find active axon
	for (var i = 0; i < g_ActiveAxons.length; i++) {
		if (g_ActiveAxons[i].startNeuronIdx === this.axon.startNeuronIdx && g_ActiveAxons[i].endNeuronIdx === this.axon.endNeuronIdx) {
			this.activeAxon = g_ActiveAxons[i];
			break;
		}
	}

};

ActiveSignal.prototype.travel = function (deltaTime) {
	var pos;
	if (this.startingPoint === 'A') {
		this.t += this.speed * deltaTime;
		if (this.t >= 1) {
			this.t = 1;
			this.alive = false;
			this.axon.neuronA.activeSignalCount--;
			this.axon.neuronB.receivedSignal = true;
			this.axon.neuronB.prevReleaseAxon = this.axon;
		}

	} else if (this.startingPoint === 'B') {
		this.t -= this.speed * deltaTime;
		if (this.t <= 0) {
			this.t = 0;
			this.alive = false;
			this.axon.neuronB.activeSignalCount--;
			this.axon.neuronA.receivedSignal = true;
			this.axon.neuronA.prevReleaseAxon = this.axon;
		}
	}

	pos = this.axon.getPoint(this.t);
	// pos = this.axon.getPointAt(this.t);	// uniform point distribution but slower calculation

	this.particle.set(pos.x, pos.y, pos.z);


	//Control active axon
	if (this.activeAxon != null) {
		var opacity = this.activeAxon.component.geometry.attributes.opacity.array;
		var position = this.activeAxon.component.geometry.attributes.position.array;

		if (this.alive) {
			//visible segment
			for (var i = 0; i < opacity.length / 2; i++) {
				//pos1
				var pos1 = new THREE.Vector3(position[i * 6 + 0], position[i * 6 + 1], position[i * 6 + 2]);
				if (pos.distanceTo(pos1) < 0.5) {
					opacity[i * 2] = 0.7;
					break;
				}
				var pos2 = new THREE.Vector3(position[i * 6 + 3], position[i * 6 + 4], position[i * 6 + 5]);
				if (pos.distanceTo(pos2) < 0.5) {
					opacity[i * 2 + 1] = 0.7;
					break;
				}
			}
		}
		else {
			//invisible segment
			// for (var i = 0; i < opacity.length; i++) {
			// 	opacity[i] = 0.0;
			// }
			this.activeAxon.disappear = true;
		}
	}

};
