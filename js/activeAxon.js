// Axon extends THREE.Line ------------------------------------------------------------------
/* exported Active Axon, Connection */

function ActiveAxon(neuronA, controlPointA, controlPointB, neuronB, bezierSubdivision) {
    var curve = new THREE.CubicBezierCurve3(
        neuronA,
        controlPointA,
        controlPointB,
        neuronB
    );
    var points = curve.getPoints(bezierSubdivision);
    this.geometry = new THREE.Geometry();
    this.geometry.vertices = points;
    this.material = new THREE.LineBasicMaterial( { color : parseInt("0x" + neuronB.color.substring(1)) } );
    this.component = new THREE.Line( this.geometry, this.material );
}
