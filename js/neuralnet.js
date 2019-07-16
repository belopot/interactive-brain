// Neural Network --------------------------------------------------------

function NeuralNetwork() {

	this.initialized = false;

	this.settings = {
		/*default
		verticesSkipStep       : 2,
		maxAxonDist            : 10,
		maxConnectionsPerNeuron: 6,
		signalMinSpeed         : 1.75,
		signalMaxSpeed         : 3.25,
		currentMaxSignals      : 3000,
		limitSignals           : 10000
		*/

		verticesSkipStep: 2,
		maxAxonDist: 10,
		maxConnectionsPerNeuron: 8,
		signalMinSpeed: 0.35,
		signalMaxSpeed: 0.85,
		currentMaxSignals: 1000,
		limitSignals: 3000

	};

	this.meshComponents = new THREE.Object3D();

	this.particlePools = [];
	for (var ii = 0; ii < SignalData.length; ii++) {
		var pp = new ParticlePool(this.settings.limitSignals, SignalData[ii].size);
		this.meshComponents.add(pp.meshComponents);
		this.particlePools.push(pp);
	}

	// NN component containers
	this.components = {
		neurons: [],
		allSignals: [],
		allAxons: [],
		allComments: []
	};

	// axon
	this.axonOpacityMultiplier = 0.1;
	this.axonColor = '#ffffff';
	this.axonGeom = new THREE.BufferGeometry();
	this.axonPositions = [];
	this.axonIndices = [];
	this.axonNextPositionsIndex = 0;

	this.axonUniforms = {
		color: {
			type: 'c',
			value: new THREE.Color(this.axonColor)
		},
		opacityMultiplier: {
			type: 'f',
			value: this.axonOpacityMultiplier
		}
	};

	this.axonAttributes = {
		opacity: {
			type: 'f',
			value: []
		}
	};

	// neuron
	this.neuronSizeMultiplier = 0.4;
	this.spriteTextureNeuron = TEXTURES.electric;
	this.neuronColor = '#ffffff';
	this.neuronOpacity = 0.5;
	this.neuronsGeom = new THREE.Geometry();

	this.neuronUniforms = {
		sizeMultiplier: {
			type: 'f',
			value: this.neuronSizeMultiplier
		},
		opacity: {
			type: 'f',
			value: this.neuronOpacity
		},
		texture: {
			type: 't',
			value: this.spriteTextureNeuron
		}
	};

	this.neuronAttributes = {
		color: {
			type: 'c',
			value: []
		},
		size: {
			type: 'f',
			value: []
		}
	};

	this.neuronShaderMaterial = new THREE.ShaderMaterial({

		uniforms: this.neuronUniforms,
		attributes: this.neuronAttributes,
		vertexShader: null,
		fragmentShader: null,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthTest: false

	});

	//Context box
	var conboxMaterial = new THREE.LineBasicMaterial({
		color: 0x009faf,
		linewidth: 1,

	});
	this.conboxRoot = new THREE.Object3D();
	var conboxGeometry = new THREE.Geometry();
	//
	// Cube geometry
	//
	//   4+--------+7
	//   /|       /|
	// 5+--------+6|
	//  | |      | |
	//  |0+------|-+3
	//  |/       |/
	// 1+--------+2
	//
	var cube_vertices = [
		[-contextBoxSize/2, -contextBoxSize/2, -contextBoxSize/2],
		[contextBoxSize/2, -contextBoxSize/2, -contextBoxSize/2],
		[contextBoxSize/2, contextBoxSize/2, -contextBoxSize/2],
		[-contextBoxSize/2, contextBoxSize/2, -contextBoxSize/2],
		[-contextBoxSize/2, -contextBoxSize/2, contextBoxSize/2],
		[contextBoxSize/2, -contextBoxSize/2, contextBoxSize/2],
		[contextBoxSize/2, contextBoxSize/2, contextBoxSize/2],
		[-contextBoxSize/2, contextBoxSize/2, contextBoxSize/2]
	];
	var cube_edges = [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 0],
		[0, 4],
		[4, 5],
		[5, 6],
		[6, 7],
		[7, 4],
		[4, 7],
		[7, 3],
		[3, 2],
		[2, 6],
		[6, 5],
		[5, 1]
	];
	for (var ii = 0; ii < cube_edges.length; ii++) {
		// Add first vertex of edge
		conboxGeometry.vertices.push(new THREE.Vector3(
			cube_vertices[cube_edges[ii][0]][0],
			cube_vertices[cube_edges[ii][0]][1],
			cube_vertices[cube_edges[ii][0]][2]
		)
		);
		// Add second vertex of edge
		conboxGeometry.vertices.push(new THREE.Vector3(
			cube_vertices[cube_edges[ii][1]][0],
			cube_vertices[cube_edges[ii][1]][1],
			cube_vertices[cube_edges[ii][1]][2]
		)
		);
	}
	this.conboxMesh = new THREE.Line(conboxGeometry, conboxMaterial);

	//Static Signal
	this.staticSignals = [];


	// info api
	this.numNeurons = 0;
	this.numAxons = 0;
	this.numSignals = 0;

	this.numPassive = 0;


	// initialize NN
	this.initNeuralNetwork();

}

NeuralNetwork.prototype.initNeuralNetwork = function () {

	this.initConboxes();
	this.initNeurons(OBJ_MODELS.brain.geometry.vertices);
	this.initAxons();

	this.neuronShaderMaterial.vertexShader = SHADER_CONTAINER.neuronVert;
	this.neuronShaderMaterial.fragmentShader = SHADER_CONTAINER.neuronFrag;

	this.axonShaderMaterial.vertexShader = SHADER_CONTAINER.axonVert;
	this.axonShaderMaterial.fragmentShader = SHADER_CONTAINER.axonFrag;

	this.initialized = true;

};

NeuralNetwork.prototype.initNeurons = function (inputVertices) {

	//Make neuron from model data
	for (var i = 0; i < inputVertices.length; i += this.settings.verticesSkipStep) {
		var pos = inputVertices[i];
		var n = new Neuron(i, pos.x, pos.y, pos.z);
		this.components.neurons.push(n);
		this.neuronsGeom.vertices.push(n);
		// dont set neuron's property here because its skip vertices
	}
	//Make neuron from dataset
	for (var i = 0; i < this.staticSignals.length; i++) {
		var pos = this.staticSignals[i].meshComponents.position;
		var n = new Neuron(i, pos.x, pos.y, pos.z);
		this.components.neurons.push(n);
		this.neuronsGeom.vertices.push(n);
	}
	console.log(this.components.neurons.length)

	// set neuron attributes value
	for (var i = 0; i < this.components.neurons.length; i++) {
		this.neuronAttributes.color.value[i] = new THREE.Color('#ffffff'); // initial neuron color
		this.neuronAttributes.size.value[i] = THREE.Math.randFloat(0.75, 3.0); // initial neuron size
	}


	// neuron mesh
	this.neuronParticles = new THREE.PointCloud(this.neuronsGeom, this.neuronShaderMaterial);
	this.meshComponents.add(this.neuronParticles);

	this.neuronShaderMaterial.needsUpdate = true;

};

NeuralNetwork.prototype.initAxons = function () {

	var allNeuronsLength = this.components.neurons.length;
	for (var j = 0; j < allNeuronsLength; j++) {
		var n1 = this.components.neurons[j];
		for (var k = j + 1; k < allNeuronsLength; k++) {
			var n2 = this.components.neurons[k];
			// connect neuron if distance is within threshold and limit maximum connection per neuron
			if (n1 !== n2 && n1.distanceTo(n2) < this.settings.maxAxonDist &&
				n1.connection.length < this.settings.maxConnectionsPerNeuron &&
				n2.connection.length < this.settings.maxConnectionsPerNeuron) {
				var connectedAxon = n1.connectNeuronTo(n2);
				this.constructAxonArrayBuffer(connectedAxon);
			}
		}
	}

	// enable WebGL 32 bit index buffer or get an error
	if (!renderer.getContext().getExtension("OES_element_index_uint")) {
		console.error("32bit index buffer not supported!");
	}

	var axonIndices = new Uint32Array(this.axonIndices);
	var axonPositions = new Float32Array(this.axonPositions);
	var axonOpacities = new Float32Array(this.axonAttributes.opacity.value);

	this.axonGeom.addAttribute('index', new THREE.BufferAttribute(axonIndices, 1));
	this.axonGeom.addAttribute('position', new THREE.BufferAttribute(axonPositions, 3));
	this.axonGeom.addAttribute('opacity', new THREE.BufferAttribute(axonOpacities, 1));
	this.axonGeom.computeBoundingSphere();

	this.axonShaderMaterial = new THREE.ShaderMaterial({
		uniforms: this.axonUniforms,
		attributes: this.axonAttributes,
		vertexShader: null,
		fragmentShader: null,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true
	});

	this.axonMesh = new THREE.Line(this.axonGeom, this.axonShaderMaterial, THREE.LinePieces);
	this.meshComponents.add(this.axonMesh);


	var numNotConnected = 0;
	for (i = 0; i < allNeuronsLength; i++) {
		if (!this.components.neurons[i].connection[0]) {
			numNotConnected += 1;
		}
	}
	// console.log( 'numNotConnected =', numNotConnected );

};


NeuralNetwork.prototype.initConboxes = function () {

	for (var i = 0; i < DATASET.length; i++) {
		//Context box
		var boxPos = new THREE.Vector3(DATASET[i].x * contextBoxSize - brainSizeX / 2 + contextBoxSize/2, DATASET[i].y * contextBoxSize - brainSizeY / 2 + contextBoxSize/2, DATASET[i].z * contextBoxSize - brainSizeZ / 2 + contextBoxSize/2);
		var conbox = new Conbox(i, boxPos, DATASET[i].visible, DATASET[i].label);
		var box = this.conboxMesh.clone();
		conbox.component.add(box);
		this.conboxRoot.add(conbox.component);
		this.components.allComments.push(conbox.comment);

		//Static signals
		for(var j=0; j<DATASET[i].signals.length; j++){
			var signalInfo = DATASET[i].signals[j];
			var spos = new THREE.Vector3(boxPos.x - contextBoxSize/2 + signalInfo.position.x * contextBoxSize / 100, boxPos.y - contextBoxSize/2 + signalInfo.position.y * contextBoxSize / 100, boxPos.z - contextBoxSize/2 + signalInfo.position.z * contextBoxSize / 100);
			var s = new StaticSignal(signalInfo.visible, spos, signalInfo.size, signalInfo.color, signalInfo.interval);
			this.staticSignals.push(s);
			this.conboxRoot.add(s.meshComponents);
		}
	}
	this.meshComponents.add(this.conboxRoot);
};         

NeuralNetwork.prototype.update = function (deltaTime) {

	if (!this.initialized) return;

	var n, ii;
	var currentTime = Date.now();

	// update neurons state and release signal
	// for (ii = 0; ii < this.components.neurons.length; ii++) {

	// 	n = this.components.neurons[ii];

	// 	if (this.components.allSignals.length < this.settings.currentMaxSignals - this.settings.maxConnectionsPerNeuron) { // limit total signals currentMaxSignals - maxConnectionsPerNeuron because allSignals can not bigger than particlePool size

	// 		if (n.receivedSignal) { // Traversal mode
	// 			// if (n.receivedSignal && (currentTime - n.lastSignalRelease > n.releaseDelay) && n.firedCount < 8)  {	// Random mode
	// 			// if (n.receivedSignal && !n.fired )  {	// Single propagation mode
	// 			n.fired = true;
	// 			n.lastSignalRelease = currentTime;
	// 			n.releaseDelay = THREE.Math.randInt(100, 1000);
	// 			this.releaseSignalAt(n);
	// 		}

	// 	}

	// 	n.receivedSignal = false; // if neuron recieved signal but still in delay reset it
	// }

	// reset all neurons and when there is no signal and trigger release signal at random neuron
	// if (this.components.allSignals.length === 0) {
	// 	this.resetAllNeurons();
	// 	this.releaseSignalAt( this.components.neurons[ THREE.Math.randInt( 0, this.components.neurons.length ) ] );
	// }


	for (var ii = 0; ii < SignalData.length; ii++) {
		this.components.neurons[SignalData[ii].neuron_id].signalTimer += deltaTime;
		if (this.components.neurons[SignalData[ii].neuron_id].signalCount === 0 && this.components.neurons[SignalData[ii].neuron_id].signalTimer > SignalData[ii].interval) {
			this.components.neurons[SignalData[ii].neuron_id].reset();
			this.releaseSignalAt(SignalData[ii].idx, this.components.neurons[SignalData[ii].neuron_id]);
		}
	}


	// update and remove dead signals
	for (var j = this.components.allSignals.length - 1; j >= 0; j--) {
		var s = this.components.allSignals[j];
		s.travel(deltaTime);

		if (!s.alive) {
			s.particle.free();
			for (var k = this.components.allSignals.length - 1; k >= 0; k--) {
				if (s === this.components.allSignals[k]) {
					this.components.allSignals.splice(k, 1);
					break;
				}
			}
		}

	}

	// update position of comment
	for (var ii = 0; ii < this.components.allComments.length; ii++) {
		this.components.allComments[ii].updatePosition();
	}

	// update particle pool vertices
	for (var ii = 0; ii < this.particlePools.length; ii++) {
		this.particlePools[ii].update();
	}

	// update Static signals
	for (var ii = 0; ii < this.staticSignals.length; ii++) {
		this.staticSignals[ii].update(deltaTime);
	}

	// update info for GUI
	this.updateInfo();

};

NeuralNetwork.prototype.constructAxonArrayBuffer = function (axon) {
	this.components.allAxons.push(axon);
	var vertices = axon.vertices;

	for (var i = 0; i < vertices.length; i++) {

		this.axonPositions.push(vertices[i].x, vertices[i].y, vertices[i].z);

		if (i < vertices.length - 1) {
			var idx = this.axonNextPositionsIndex;
			this.axonIndices.push(idx, idx + 1);

			var opacity = THREE.Math.randFloat(0.005, 0.2);
			this.axonAttributes.opacity.value.push(opacity, opacity);

		}

		this.axonNextPositionsIndex += 1;
	}
};

NeuralNetwork.prototype.releaseSignalAt = function (signal_idx, neuron) {
	var signals = neuron.createSignal(this.particlePools[signal_idx], this.settings.signalMinSpeed, this.settings.signalMaxSpeed);
	for (var ii = 0; ii < signals.length; ii++) {
		var s = signals[ii];
		this.components.allSignals.push(s);
	}
};

NeuralNetwork.prototype.resetAllNeurons = function () {

	this.numPassive = 0;
	for (var ii = 0; ii < this.components.neurons.length; ii++) { // reset all neuron state
		n = this.components.neurons[ii];

		if (!n.fired) {
			this.numPassive += 1;
		}

		n.reset();

	}
	// console.log( 'numPassive =', this.numPassive );

};

NeuralNetwork.prototype.updateInfo = function () {
	this.numNeurons = this.components.neurons.length;
	this.numAxons = this.components.allAxons.length;
	this.numSignals = this.components.allSignals.length;
};

NeuralNetwork.prototype.updateSettings = function () {

	this.neuronUniforms.opacity.value = this.neuronOpacity;

	for (i = 0; i < this.components.neurons.length; i++) {
		this.neuronAttributes.color.value[i].setStyle(this.neuronColor); // initial neuron color
	}
	this.neuronAttributes.color.needsUpdate = true;

	this.neuronUniforms.sizeMultiplier.value = this.neuronSizeMultiplier;

	this.axonUniforms.color.value.set(this.axonColor);
	this.axonUniforms.opacityMultiplier.value = this.axonOpacityMultiplier;

	for (i = 0; i < this.particlePools.length; i++) {
		this.particlePools[i].updateSettings();
	}


};

NeuralNetwork.prototype.testChangOpcAttr = function () {

	var opcArr = this.axonGeom.attributes.opacity.array;
	for (var i = 0; i < opcArr.length; i++) {
		opcArr[i] = THREE.Math.randFloat(0, 0.5);
	}
	this.axonGeom.attributes.opacity.needsUpdate = true;
};
