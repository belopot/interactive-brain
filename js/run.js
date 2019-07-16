// Run --------------------------------------------------------

function update() {

	updateHelpers();

	if (!sceneSettings.pause) {

		var deltaTime = clock.getDelta();
		// neuralNet.meshComponents.rotation.y -= Math.PI / 180 / 8;
		neuralNet.update(deltaTime);
		updateGuiInfo();
		cameraCtrl.update();
	}

}

// ----  draw loop
function run() {

	requestAnimationFrame(run);
	// renderer.setClearColor(sceneSettings.bgColor, 1);
	
	renderer.clear();
	update();
	renderer.render(scene, camera);
	// stats.update();
	FRAME_COUNT++;

}
