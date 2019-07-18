// Axon extends THREE.Line ------------------------------------------------------------------
/* exported Active Axon, Connection */


function ActiveAxon(neuronA, controlPointA, controlPointB, neuronB, bezierSubdivision, interval) {
    var curve = new THREE.CubicBezierCurve3(
        neuronA,
        controlPointA,
        controlPointB,
        neuronB
    );
    var points = curve.getPoints(bezierSubdivision);
    var axonNextPositionsIndex = 0;
    this.startNeuronIdx = neuronB.idx;
    this.endNeuronIdx = neuronA.idx;
    this.axonLength = 0;
    if (points.length >= 2) {
        this.axonLength = points[0].distanceTo(points[1]) * bezierSubdivision;
    }
    this.interval = interval;
    this.currentDis = 0;
    this.currentSegmentIdx = 0;
    this.segmentLength = this.axonLength / bezierSubdivision;
    this.division = bezierSubdivision;
    this.speed = this.axonLength / interval;
    this.axonGeometry = new THREE.BufferGeometry();
    this.axonColor = parseInt("0x" + neuronB.color.substring(1));

    this.uniforms = {
        color: {
            type: 'c',
            value: new THREE.Color(this.axonColor)
        },
        opacityMultiplier: {
            type: 'f',
            value: 1
        }
    };

    this.attributes = {
        opacity: {
            type: 'f',
            value: []
        }
    };

    this.axonPositions = [];
    this.axonIndices = [];

    for (var i = 0; i < points.length; i++) {

        this.axonPositions.push(points[i].x, points[i].y, points[i].z);

        if (i < points.length - 1) {
            var idx = axonNextPositionsIndex;
            this.axonIndices.push(idx, idx + 1);

            var opacity = 0.0;
            this.attributes.opacity.value.push(opacity, opacity);

        }

        axonNextPositionsIndex += 1;
    }


    var axonIndices = new Uint32Array(this.axonIndices);
    var axonPositions = new Float32Array(this.axonPositions);
    var axonOpacities = new Float32Array(this.attributes.opacity.value);

    this.axonGeometry.addAttribute('index', new THREE.BufferAttribute(axonIndices, 1));
    this.axonGeometry.addAttribute('position', new THREE.BufferAttribute(axonPositions, 3));
    this.axonGeometry.addAttribute('opacity', new THREE.BufferAttribute(axonOpacities, 1));
    this.axonGeometry.computeBoundingSphere();

    this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        attributes: this.attributes,
        vertexShader: SHADER_CONTAINER.axonVert,
        fragmentShader: SHADER_CONTAINER.axonFrag,
        blending: currentBlendingMode,
        depthTest: false,
        transparent: true
    });

    this.component = new THREE.Line(this.axonGeometry, this.material, THREE.LinePieces);
}

ActiveAxon.prototype.update = function (deltaTime) {
    this.component.geometry.attributes.opacity.needsUpdate = true;
    // var opacity = this.component.geometry.attributes.opacity.array;
    // this.currentDis += deltaTime * this.speed;
    // if (this.currentDis > this.axonLength) {
    //     this.currentDis = 0;
    //     for (var i = 0; i < opacity.length; i++) {
    //         //invisible segment
    //         opacity[i] = 0.0;
    //     }
    // }
    // this.currentSegmentIdx = Math.floor(this.currentDis / this.segmentLength);
    // for (var i = 0; i < this.division; i++) {
    //     if (this.currentSegmentIdx === i) {
    //         //visible segment
    //         opacity[ (this.division + 1 - i) * 2] = 1;
    //         opacity[(this.division + 1 - i) * 2 + 1] = 1;
    //         break;
    //     }
    // }
}; 