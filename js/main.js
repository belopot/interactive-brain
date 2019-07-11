// Main --------------------------------------------------------
/* exported main, updateGuiInfo */

var gui, gui_info, gui_settings;

function main() {

	var neuralNet = window.neuralNet = new NeuralNetwork();
	scene.add(neuralNet.meshComponents);

	var geometry = new THREE.PlaneGeometry(180, 180, 1);
	var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, map: TEXTURES.mark, combine: THREE.AdditiveBlending, transparent: true, opacity: 0.1 });
	var marker = new THREE.Mesh(geometry, material);
	marker.rotation.set(-Math.PI / 2, 0, 0);
	marker.position.set(0, -80, 0);
	scene.add(marker);

	initGui();
	run();
	// $(gui.domElement).attr("hidden", true);
}


var SignalData = [
	// { context: 0, neuron_id: 100, interval: 0.5, size: 1 },
	// { context: 1, neuron_id: 2000, interval: 3, size: 0.1 },
	// { context: 2, neuron_id: 3000, interval: 4, size: 1.5 },
]

var DATASET = [
	{
		id: 0, 
		x: 0, 
		y: 0, 
		z: 0, 
		visible: true,
		label: { visible: true, text: "box1", size: '22px', color: '#ffffff44' },
		signals: [
			{ visible: true, position: { x: 10, y: 10, z: 10 }, interval: 4000, color: '#ff0000', size: 1 }	//first signal
		]
	}

]