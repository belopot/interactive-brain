// Context box ----------------------------------------------------------------

function Conbox(id, pos, visible, label, signals) {
	this.id = id;

	this.visible = visible;
	this.component = new THREE.Object3D();
	this.component.position.set(pos.x, pos.y, pos.z);
	this.component.visible = visible;

	//label
	this.comment = new CommentLabel(label, this.component);
    
}



