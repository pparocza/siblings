import * as THREE from "https://cdn.skypack.dev/three@0.152.0";
import { IS_Visualizer } from "../IS_Visualizer.js";
import { IS } from "../../../script.js";
import { IS_VisualElement } from "../elements/IS_VisualElement.js";

// TODO: sort out addons with CDN: https://threejs.org/manual/#en/fundamentals <- at the botttom

export const IS_BufferGeometryVisualizer =
{
	visualize() {},

	initialize(visualizerGain)
	{
		const X_OFFSET = -0.5;
		const X_SCALE = 5;

		const Y_SCALE = 1;
		const Y_OFFSET = 0.5;
		let ROW = 0;
		const ROW_WIDTH = -0.125;
		let COLUMN = 0;
		let COLUMN_WIDTH = 0.125 * 0.75;
		let COLUMN_OFFSET = -0.925;

		let bufferSources = [];

		let light = new IS_Light([0, 0, 2]);
		IS_Visualizer.addToScene(light.light);

		for(const [audioNodeUUID, audioNode] of Object.entries(IS.NodeRegistry._registry))
		{
			if(audioNode.isISBufferSource)
			{
				bufferSources.push(audioNode);
			}
		}

		let moduloBase = 16;
		let modulo = moduloBase;
		let scaleArray = [0.6, 16, 0.4];
		let denominatorArray = [1, 2, 3];

		for(let bufferIndex = 0; bufferIndex < bufferSources.length; bufferIndex++)
		{
			let bufferSource = bufferSources[bufferIndex];

			let buffer = bufferSource.buffer;

			let bufferArray = buffer.getChannelData(0);
			let nSamples = bufferArray.length;

			let scaleIndex = Math.floor(scaleArray.length * (bufferIndex / bufferSources.length));
			let scaleFactor = scaleArray[scaleIndex];

			let bufferCircle = new BufferCircle
			(
				buffer.getChannelData(0),
				bufferSource,
				scaleFactor / denominatorArray[bufferIndex % 3]
			);

			continue;

			for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
			{
				let sampleValue = bufferArray[sampleIndex];

				let xPosition = sampleIndex / nSamples; // IS.Random.Float(-1, 1); // X_SCALE * ((sampleIndex / nSamples) + X_OFFSET);
				let yPosition = sampleValue;
				let zPosition = -Math.abs(sampleValue);

				let xNormal = sampleIndex % 1 === 0 ? 1 : 0;
				let yNormal = sampleIndex % 2 === 0 ? 1 : 0;
				let zNormal = sampleIndex % 3 === 0 ? 1 : 0;

				let position = [xPosition, yPosition, zPosition];
				// for a MeshNormalMaterial() this is kinda sorta RGB
				let normal = [xNormal, yNormal, zNormal];
				let uv = [0, 0]; // < ???

				vertices.createVertex(position, normal, uv);

				if(sampleIndex % modulo === 0)
				{
					let geometry = new Geometry(vertices);
					let bufferGeometry = new IS_BufferGeometry(THREE, geometry, bufferSource);
					// bufferGeometry.radius = radii[ROW % radii.length];
					let shape = bufferGeometry.createInstance();
					//
					// shape.scale.set
					// (
					// 	IS.Random.Float(0.25, 0.5),
					// 	IS.Random.Float(0.25, 0.5),
					// 	IS.Random.Float(0.1, 0.25)
					// );

					let xScale = 1;
					let yScale = 1;
					let zScale = 1;

					shape.scale.set(xScale, yScale, zScale);
					shape.position.set(0, /*COLUMN * COLUMN_WIDTH + COLUMN_OFFSET*/ 0 , 0);
					// shape.rotation.set(0, (Math.PI * (ROW / bufferSources.length)), 0);

					IS_Visualizer.addToScene(shape);

					modulo = moduloBase *  IS.Random.Select(1, 2, 4, 8);

					COLUMN++;

					if(COLUMN % 20 === 0)
					{
						ROW++;
						COLUMN = 0;
					}
				}
			}
		}
	}
}

class BufferCircle extends IS_VisualElement
{
	constructor(bufferArray, audioNode, scale)
	{
		super();

		this._material = new THREE.LineBasicMaterial();

		let points = [];
		let lines = [];

		let circle = new THREE.Object3D();

		let nSamples = bufferArray.length;
		let row = 0;
		let samplesPerRow = 50;
		let nCircles = 30;
		let circleNPoints = 48000 / nCircles ;
		let currentCircle = 0;

		let vertices = new Vertices();

		for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
		{
			let sampleValue = bufferArray[sampleIndex];

			let xPosition = Math.sin(2 * Math.PI * (sampleIndex / circleNPoints)) + sampleValue * 0.025;
			let yPosition = Math.cos(2 * Math.PI * (sampleIndex / circleNPoints)) + sampleValue * 0.025;
			let zPosition = 0;

			let position = [xPosition, yPosition, zPosition];

			points.push(new THREE.Vector3(...position));

			if(sampleIndex % circleNPoints === 0)
			{
				let geometry = new THREE.BufferGeometry().setFromPoints(points);
				let line = new THREE.Line(geometry, this._material);

				line.scale.set(scale, scale, scale);
				line.rotation.set(0, Math.PI * 2 * (currentCircle / nCircles), 0);

				circle.add(line);

				points = [];

				currentCircle++;
			}

			vertices.createVertex(position, [0, 0, 1], [0, 0]);
		}

		let geometry = new Geometry(vertices);
		let bufferGeometry = new IS_BufferGeometry(THREE, geometry, audioNode);
		// bufferGeometry.radius = radii[ROW % radii.length];
		let shape = bufferGeometry.createInstance();

		let xScale = 1;
		let yScale = 1;
		let zScale = 1;

		shape.scale.set(xScale, yScale, zScale);
		shape.position.set(0, 0 , 0);

		IS_Visualizer.addToScene(shape);

		this._circle = circle;

		IS_Visualizer.addToScene(this._circle);

		this._rotationXRate = IS.Random.Float(6000, 10000);
		this._rotationYRate = IS.Random.Float(6000, 10000);
		this._rotationZRate = IS.Random.Float(6000, 10000);

		this._rotationXDirection = IS.Random.CoinToss() ? 1 : -1;
		this._rotationYDirection = IS.Random.CoinToss() ? 1 : -1;
		this._rotationZDirection = IS.Random.CoinToss() ? 1 : -1;

		this._audioNode = audioNode;

		this.animate = this._animationCallback;
	}

	_animationCallback()
	{
		let time = performance.now();

		this._circle.rotation.set
		(
			this._rotationXDirection * (time / this._rotationXRate),
			this._rotationYDirection * (time / this._rotationYRate),
			this._rotationZDirection * (time / this._rotationZRate)
		)

		if (this._audioNode.frequencyBins)
		{
			let frequencyArray = this._audioNode.frequencyBins;

			let rArray = frequencyArray.slice(0, 5);
			let gArray = frequencyArray.slice(5, 10);
			let bArray = frequencyArray.slice(10, 16);

			let r = rArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
			let g = gArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
			let b = bArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

			r /= rArray.length;
			g /= gArray.length;
			b /= bArray.length;

			let rAmplitude = IS.Utility.DecibelsToAmplitude(r);
			let gAmplitude = IS.Utility.DecibelsToAmplitude(g);
			let bAmplitude = IS.Utility.DecibelsToAmplitude(b);

			let rValue = rAmplitude * 5 * 1.5;
			let gValue = gAmplitude * 750 * 2;
			let bValue = bAmplitude * 12000; // * 15000 * 0.5;

			this._material.color.setRGB(rValue, gValue, bValue);
		}
	}
}

class Vertex
{
	constructor
	(
		position = [0, 0, 0],
		normal = [0, 0, 1],
		uv = [0, 0]
	)
	{
		this._position = position;
		this._normal = normal;
		this._uv = uv;
	}

	get position() { return this._position; }
	set position(position) { this._position = position; }

	get normal() { return this._normal; }
	set normal(normal) { this._normal = normal; }

	get uv() { return this._uv; }
	set uv(uv) { this._uv = uv; }
}

class Vertices
{
	constructor()
	{
		this._vertices = [];
	}

	addVertex(vertex) { this._vertices.push(vertex); }
	createVertex(position, normal, uv) { this._vertices.push(new Vertex(position, normal, uv)); }

	get vertices() { return this._vertices; }
}

class Geometry
{
	constructor(vertices)
	{
		this._positions = [];
		this._normals = [];
		this._uvs = [];

		this._positionNumComponents = vertices.vertices[0].position.length;
		this._normalNumComponents = vertices.vertices[0].normal.length;
		this._uvNumComponents = vertices.vertices[0].uv.length;

		for(const vertex of vertices.vertices)
		{
			this._positions.push(...vertex.position);
			this._normals.push(...vertex.normal);
			this._uvs.push(...vertex.uv);
		}
	}

	get positions() { return this._positions; }
	get normals() { return this._normals; }
	get uvs() { return this._uvs; }

	get positionNumComponents() { return this._positionNumComponents; }
	get normalNumComponents() { return this._normalNumComponents; }
	get uvNumComponents() { return this._uvNumComponents; }
}

class IS_BufferGeometry extends IS_VisualElement
{
	constructor(threeContext, geometry, audioNode)
	{
		super();

		this._audioNode = audioNode;

		const bufferGeometry = new this._visualizerContext.three.BufferGeometry();

		const positionAttribute = this.createBufferAttribute(geometry.positions, geometry.positionNumComponents);
		const normalAttribute = this.createBufferAttribute(geometry.normals, geometry.normalNumComponents);

		bufferGeometry.setAttribute('position', positionAttribute);
		bufferGeometry.setAttribute('normal', normalAttribute);

		this._bufferGeometry = bufferGeometry;

		this.animate = this._animationCallback;

		this._animationXRate = IS.Random.Float(5, 20);
		this._animationYRate = IS.Random.Float(5, 20);
		this._animationZRate = IS.Random.Float(5, 20);

		this._animationXScaleRate = IS.Random.Float(5, 20);
		this._animationYScaleRate = IS.Random.Float(5, 20);
		this._animationZScaleRate = IS.Random.Float(5, 20);

		this._animationXRotationRate = IS.Random.Float(5, 10);
		this._animationYRotationRate = IS.Random.Float(5, 10);
		this._animationZRotationRate = IS.Random.Float(5, 10);

		this._radiusRate = IS.Random.Float(5, 20);

		this._radius = IS.Random.Float(0.2, 0.8);
	}

	set radius(value)
	{
		this._radius = value;
	}

	createBufferAttribute(array, numComponents)
	{
		return new this._visualizerContext.three.BufferAttribute(new Float32Array(array), numComponents);
	}

	createInstance()
	{
		const material = new this._visualizerContext.three.MeshLambertMaterial();
		material.transparent = true;
		material.opacity = 1;

		const mesh = new this._visualizerContext.three.Mesh(this._bufferGeometry, material);

		this._material = material;
		this._mesh = mesh;

		return mesh;
	}

	_animationCallback()
	{
		let time = performance.now() / 1000;

		if(this._audioNode.frequencyBins)
		{
			let frequencyArray = this._audioNode.frequencyBins;

			let rArray = frequencyArray.slice(0, 5);
			let gArray = frequencyArray.slice(5, 10);
			let bArray = frequencyArray.slice(10, 16);

			let r = rArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
			let g = gArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
			let b = bArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

			r /= rArray.length;
			g /= gArray.length;
			b /= bArray.length;

			let rAmplitude = IS.Utility.DecibelsToAmplitude(r);
			let gAmplitude = IS.Utility.DecibelsToAmplitude(g);
			let bAmplitude = IS.Utility.DecibelsToAmplitude(b);

			let averageAmplitude = (rAmplitude + gAmplitude + bAmplitude) / 3;

			this._material.opacity = 1;

			let rValue = rAmplitude; // * 10 * 0.25;
			let gValue = gAmplitude * 100;
			let bValue = bAmplitude * 1000; // * 15000 * 0.5;

			this._material.color.setRGB
			(
				rValue,
				gValue,
				bValue,
			);
		}

		// this._mesh.scale.set
		// (
		// 	Math.sin(time / this._animationXRate) * 0.5,
		// 	Math.sin(time / this._animationYRate) * 0.5,
		// 	Math.sin(time / this._animationZRate) * 0.5,
		// );
		//
		this._mesh.rotation.set
		(
			time / this._animationXRotationRate,
			time / this._animationYRotationRate,
			time / this._animationZRotationRate
		);

		// this._radius = this._radiusScale * Math.abs(Math.sin(time / this._radiusRate));
	}
}

class IS_Light extends IS_VisualElement
{
	constructor(position = [0, 0, 2])
	{
		super();

		this._color = 0xFFFFFF;
		this._intensity = 10;
		this._light = new THREE.DirectionalLight(this._color, this._intensity);
		this._light.position.set(...position);

		this.animate = this._animationCallback;
	}

	get light() { return this._light; }

	set position(xyz) { this._light.position.set(...xyz); }

	set intensity(value)
	{
		this._intensity = value;
		this._light.intensity = this._intensity;
	}

	set color(value)
	{
		this._color = value;
		this._light.color = this._color;
	}

	_animationCallback()
	{
		let time = performance.now();

		this._light.position.set
		(
			Math.sin(time / X_TIME),
			Math.cos(time / Y_TIME),
			Math.abs(Math.sin(time / Z_TIME))
		);

		Y_TIME *= IS.Random.Float(0.999, 1.001);
		X_TIME *= IS.Random.Float(0.999, 1.001);
		Z_TIME *= IS.Random.Float(0.999, 1.001);
	}
}

let Y_TIME = 1250;
let Z_TIME = 1500;
let X_TIME = 1000;