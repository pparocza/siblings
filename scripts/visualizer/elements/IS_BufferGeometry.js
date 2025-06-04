import { IS_VisualElement } from "./IS_VisualElement.js";

export class IS_BufferGeometry extends IS_VisualElement
{
	constructor(audioNode)
	{
		super();

		this._audioNode = audioNode;

		this._vertices = new Vertices();
	}

	set material(material)
	{
		this._material = material;
		this._mesh.material = this._material;
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
		this._geometry = new IS_Geometry(this._vertices);
	}

	// TODO: move this into createInstance and make private
	_createBufferGeometry()
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
		this._createBufferGeometry();

		const material = new this.three.MeshLambertMaterial();
		material.transparent = true;
		material.opacity = 1;

		const mesh = new this.three.Mesh(this._bufferGeometry, material);

		this._material = material;
		this._mesh = mesh;

		return mesh;
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

	createVertex(position, normal, uv) { this._vertices.push(new Vertex(position, normal, uv)); }

	get vertices() { return this._vertices; }
}

class IS_Geometry
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