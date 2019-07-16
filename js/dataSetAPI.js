//Old signals that move along axon
var SignalData = [
	{ idx: 0, neuron_id: 23691, interval: 0.5, size: 1 },
	// { idx: 1, neuron_id: 2000, interval: 3, size: 0.1 },
	// { idx: 2, neuron_id: 3000, interval: 4, size: 1.5 },
	// { idx: 3, neuron_id: 4000, interval: 4.7, size: 0.7 },
	// { idx: 4, neuron_id: 5000, interval: 6, size: 0.6 },
	// { idx: 5, neuron_id: 6000, interval: 3.5, size: 0.2 },
	// { idx: 6, neuron_id: 8540, interval: 1.7, size: 0.9 }
]

//Real signal's data
var DATASET = [
	{
		id: 0, 
		x: 12, 
		y: 22, 
		z: 15, 
		visible: false,
		label: { visible: true, text: "Top_Box", size: '18px', color: '#ff00ffff' },
		signals: [
			{ visible: false, position: { x: 0, y: 0, z: 0 }, interval: 4000, color: '#ffff00', size: 1 }
		]
	}
	// {
	// 	id: 1, 
	// 	x: 12, 
	// 	y: 5, 
	// 	z: 15, 
	// 	visible: false,
	// 	label: { visible: true, text: "Bottom_Box", size: '18px', color: '#ff0000ff' },
	// 	signals: [
	// 		{ visible: true, position: { x: 10, y: 22, z: 10 }, interval: 2000, color: '#00ff00', size: 1.2 },
	// 		{ visible: true, position: { x: 88, y: 88, z: 88 }, interval: 3000, color: '#0000ff', size: 1 }
	// 	]
	// },
	// {
	// 	id: 2, 
	// 	x: 2, 
	// 	y: 11, 
	// 	z: 15, 
	// 	visible: true,
	// 	label: { visible: true, text: "Right_Box", size: '18px', color: '#ffff00ff' },
	// 	signals: [
	// 		{ visible: true, position: { x: 88, y: 88, z: 88 }, interval: 1500, color: '#ff00ff', size: 1 },
	// 		{ visible: true, position: { x: 44, y: 44, z: 44 }, interval: 2500, color: '#ff0000', size: 1.5 }
	// 	]
	// },
	// {
	// 	id: 3, 
	// 	x: 22, 
	// 	y: 11, 
	// 	z: 15, 
	// 	visible: true,
	// 	label: { visible: true, text: "Left_Box", size: '18px', color: '#00ffffee' },
	// 	signals: [
	// 		{ visible: true, position: { x: 10, y: 22, z: 10 }, interval: 5000, color: '#ddff22', size: 1 }
	// 	]
	// },
	// {
	// 	id: 4, 
	// 	x: 12, 
	// 	y: 11, 
	// 	z: 0, 
	// 	visible: true,
	// 	label: { visible: true, text: "Back_Box", size: '18px', color: '#ffffffee' },
	// 	signals: [
	// 		{ visible: true, position: { x: 10, y: 22, z: 10 }, interval: 3500, color: '#00ffff', size: 1 }
	// 	]
	// },
	// {
	// 	id: 5, 
	// 	x: 12, 
	// 	y: 11, 
	// 	z: 28, 
	// 	visible: true,
	// 	label: { visible: true, text: "Front_Box", size: '18px', color: '#ffffffee' },
	// 	signals: [
	// 		{ visible: true, position: { x: 10, y: 22, z: 10 }, interval: 3500, color: '#00ffff', size: 1 }
	// 	]
	// }

]