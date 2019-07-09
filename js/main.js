// Main --------------------------------------------------------
/* exported main, updateGuiInfo */

var gui, gui_info, gui_settings;

function main() {

	var neuralNet = window.neuralNet = new NeuralNetwork();
	scene.add(neuralNet.meshComponents);

	var geometry = new THREE.PlaneGeometry(180, 180, 1);
	var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, map: TEXTURES.mark, combine: THREE.AdditiveBlending, transparent: true, opacity:0.1 });
	var marker = new THREE.Mesh(geometry, material);
	marker.rotation.set(-Math.PI / 2, 0, 0);
	marker.position.set( 0, -80, 0);
	scene.add(marker);

	initGui();
	run();
	// $(gui.domElement).attr("hidden", true);
}


var SignalData = [
	{ idx: 0, neuron_id: 100, interval: 0.5, size: 1 },
	{ idx: 1, neuron_id: 2000, interval: 3, size: 0.1 },
	{ idx: 2, neuron_id: 3000, interval: 4, size: 1.5 },
	{ idx: 3, neuron_id: 4000, interval: 4.7, size: 0.7 },
	{ idx: 4, neuron_id: 5000, interval: 6, size: 0.6 },
	{ idx: 5, neuron_id: 6000, interval: 3.5, size: 0.2 },
	{ idx: 6, neuron_id: 8540, interval: 1.7, size: 0.9 }
]