import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS } from "../../../script.js";

export class IS_BufferGeometry extends IS_VisualElement
{
	constructor(threeContext, audioNode)
	{
		super();

		this._audioNode = audioNode;

		this._vertices = new Vertices();

		this._animationXRotationRate = IS.Random.Float(5, 10);
		this._animationYRotationRate = IS.Random.Float(5, 10);
		this._animationZRotationRate = IS.Random.Float(5, 10);

		this.animate = this._animationCallback;
	}

	createBufferAttribute(array, numComponents)
	{
		return new this.three.BufferAttribute(new Float32Array(array), numComponents);
	}

	createVertex(positionArray, normalArray, uvArray)
	{
		this._vertices.createVertex(positionArray, normalArray, uvArray);
	}

	_createGeometry()
	{
		this._geometry = new Geometry(this._vertices);
	}

	createBufferGeometry()
	{
		this._createGeometry();

		let geometry = this._geometry;

		const bufferGeometry = new this.three.BufferGeometry();
		const positionAttribute = this.createBufferAttribute(this._geometry.positions, geometry.positionNumComponents);
		const normalAttribute = this.createBufferAttribute(geometry.normals, geometry.normalNumComponents);

		bufferGeometry.setAttribute('position', positionAttribute);
		bufferGeometry.setAttribute('normal', normalAttribute);

		this._bufferGeometry = bufferGeometry;
	}

	createInstance()
	{
		const material = new this.three.MeshLambertMaterial();
		material.transparent = true;
		material.opacity = 1;

		const mesh = new this.three.Mesh(this._bufferGeometry, material);

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
				rValue * 1.25,
				gValue * 1.25,
				bValue * 1.25,
			);
		}

		this._mesh.rotation.set
		(
			time / this._animationXRotationRate,
			time / this._animationYRotationRate,
			time / this._animationZRotationRate
		);
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