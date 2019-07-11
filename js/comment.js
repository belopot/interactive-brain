function CommentLabel(label, targetObj) {
  this.div = document.createElement('div');
  this.div.style.position = 'absolute';
  this.div.innerHTML = label.text;
  this.div.style.top = -1000;
  this.div.style.left = -1000;
  this.div.style.color = label.color;
  this.div.style.visibility = label.visible ? 'visible' : 'hidden';
  this.div.style.fontSize = label.size;
  this.div.classList.add('comment-label');
  this.parent = targetObj;
  this.position = new THREE.Vector3(0, 0, 0);
  container.appendChild(this.div);

}

CommentLabel.prototype.setHTML = function (html) {
  this.div.innerHTML = html;
}

CommentLabel.prototype.setParent = function (threejsobj) {
  this.parent = threejsobj;
}

CommentLabel.prototype.updatePosition = function () {
  if (this.parent) {
    this.position.copy(this.parent.position);
  }

  var coords2d = this.get2DCoords();
  this.div.style.left = coords2d.x + 'px';
  this.div.style.top = coords2d.y + 'px';
}

CommentLabel.prototype.get2DCoords = function () {
  var vector = this.position.project(camera);
  vector.x = (vector.x + 1) / 2 * window.innerWidth;
  vector.y = -(vector.y - 1) / 2 * window.innerHeight;
  return vector;
}