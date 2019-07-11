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

// { context_box: [                     //brain total size {x : 125, y: 115, z: 155} (Based on the size of 3D model)
// id: int            				    // ID of box
// x:  int			           	        // index value (0 to 24)
// y:  int   	         				// index value (0 to 22)
// z:  int   	         				// index value (0 to 30)
// visible: boolean,			        // border of the box visible
// label:  {  
// 	  visible: boolean		            // label visible
//    text: string,                    	// label text
// 	  size: int                         // font size
// 	  color: #ffffffaa                 	// font color and alpha
// }
// signals: [signal1, signal2...]
// ] }


var DATASET = [
	{
		id: 0, 
		x: 12, 
		y: 22, 
		z: 15, 
		visible: true,
		label: { visible: true, text: "Top part", size: '18px', color: '#ffffffff' },
		signals: [
			{ visible: true, position: { x: 10, y: 22, z: 10 }, interval: 4000, color: '#ff0000', size: 1 }	//first signal
		]
	}

]