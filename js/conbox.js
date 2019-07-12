// Context box ----------------------------------------------------------------

function Conbox(id, pos, visible, label) {
	this.id = id;
	this.component = new THREE.Object3D();
	this.component.position.set(pos.x, pos.y, pos.z);
	this.component.visible = visible;

	//label
	this.comment = new CommentLabel(label, this.component);
    
}



