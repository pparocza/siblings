// https://threejs.org/examples/?q=line#svg_lines
import * as THREE from "https://cdn.skypack.dev/three@0.152.0";
import { IS_Visualizer } from "../IS_Visualizer.js";
import { IS } from "../../../script.js";
import { IS_VisualElement } from "../elements/IS_VisualElement.js";
import { IS_VisualNetwork } from "../elements/IS_VisualNetwork.js";

export const IS_LineVisualizer =
{
	visualize()
	{
		let networkRegistry = IS.NetworkRegistry;
		let nodeIndex = 0;

		let bufferSources = [];
		let gains = [];
		let filters = [];
		let convolvers = [];
		let other = [];

		for(const [audioNodeUUID, audioNode] of Object.entries(IS.NodeRegistry._registry))
		{
			console.log(audioNode.iSType);

			if(audioNode.isISBufferSource)
			{
				bufferSources.push(audioNode);
			}

			if(audioNode.isISGain)
			{
				gains.push(audioNode);
			}

			if(audioNode.isISBiquadFilter)
			{
				filters.push(audioNode);
			}

			if(audioNode.isISConvolver)
			{
				convolvers.push(audioNode);
			}

			if(audioNode.isISStereoPanner || audioNode.isISDelay || audioNode.isISStereoDelay)
			{
				other.push(audioNode);
			}
		}

		for(let bufferSourceIndex = 0; bufferSourceIndex < bufferSources.length; bufferSourceIndex++)
		{
			let audioNode = bufferSources[bufferSourceIndex];

			let line = new NodeLine(audioNode);
			let zRotation = Math.PI * bufferSourceIndex / bufferSources.length;
			line.rotation = [0, 0, zRotation];

			line.amplitudeYScaling = true;

			let rotationRate = IS.Random.Float(2, 15);
			line.rotationRate = IS.Random.CoinToss() ? rotationRate : -rotationRate;

			line.colorRGB = [0, 1, 0];

			nodeIndex++;
		}

		for(let gainIndex = 0; gainIndex < gains.length; gainIndex++)
		{
			let audioNode = gains[gainIndex];

			let line = new NodeLine(audioNode);
			let zRotation = Math.PI * gainIndex / gains.length;
			line.rotation = [0, 0, zRotation];

			line.amplitudeYScaling = audioNode.gain.value > 5;

			line.colorRGB = [0, 0, 1];
			line.yScale = 0.6;

			let rotationRate = IS.Random.Float(2, 15);
			line.rotationRate = IS.Random.CoinToss() ? rotationRate : -rotationRate;

			nodeIndex++;
		}

		for(let filterIndex = 0; filterIndex < filters.length; filterIndex++)
		{
			let audioNode = filters[filterIndex];

			let line = new NodeLine(audioNode);
			let zRotation = Math.PI * filterIndex / filters.length;
			line.rotation = [0, 0, zRotation];

			line.colorRGB = [1, 0, 0];
			line.yScale = 0.7;

			let rotationRate = IS.Random.Float(2, 15);
			line.rotationRate = IS.Random.CoinToss() ? rotationRate : -rotationRate;

			nodeIndex++;
		}

		for(let convolverIndex = 0; convolverIndex < convolvers.length; convolverIndex++)
		{
			let audioNode = convolvers[convolverIndex];

			let line = new NodeLine(audioNode);
			let zRotation = Math.PI * convolverIndex / convolvers.length;
			line.rotation = [0, 0, zRotation];

			line.colorRGB = [0.9, 0.7, 0.9];
			line.yScale = 0.3;

			let rotationRate = IS.Random.Float(2, 15);
			line.rotationRate = IS.Random.CoinToss() ? rotationRate : -rotationRate;

			nodeIndex++;
		}

		for(let otherIndex = 0; otherIndex < other.length; otherIndex++)
		{
			let audioNode = other[otherIndex];

			let line = new NodeLine(audioNode);
			let zRotation = Math.PI * otherIndex / other.length;
			line.rotation = [0, 0, zRotation];

			line.colorRGB = [0.2, 0.8, 1];
			line.yScale = 0.4;

			let rotationRate = IS.Random.Float(2, 15);
			line.rotationRate = IS.Random.CoinToss() ? rotationRate : -rotationRate;

			nodeIndex++;
		}

		//////// Doing this with buffer arrays?

		const geometry = new THREE.BufferGeometry();

		// create a simple square shape. We duplicate the top left and bottom right
		// vertices because each vertex needs to appear once per triangle.
		const vertices = new Float32Array( [
			-1.0, -1.0,  IS.Random.Float(-1, 1), // v0
			1.0, -1.0,  IS.Random.Float(-1, 1), // v1
			1.0,  1.0,  IS.Random.Float(-1, 1), // v2
			-1.0,  1.0,  IS.Random.Float(-1, 1), // v3
		] );

		// itemSize = 3 because there are 3 values (components) per vertex
		geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		const mesh = new THREE.Mesh( geometry, material );

		IS_Visualizer.addToScene(mesh);
	},
}

class NodeLine extends IS_VisualElement
{
	constructor(audioNode)
	{
		super();

		this._audioNode = audioNode;

		const geometry = new THREE.BoxGeometry(0.03125, 5, 0);
		const material = new THREE.MeshBasicMaterial();
		material.transparent = true;
		material.opacity = 0;

		let line = new THREE.Mesh(geometry, material);
		line.position.x = 0;
		line.position.y = 0;

		IS_Visualizer.addToScene(line);

		this._rotationRate = 1;
		this._material = material;
		this._line = line;
		this._amplitudeYScaling = true;

		this.animate = this._animationCallback;
	}

	set amplitudeYScaling(value) { this._amplitudeYScaling = value; }

	set yScale(value) { this._line.scale.set(1, value, 1); }

	set rotation(vector3Array) { this._line.rotation.set(...vector3Array); }
	set rotationRate(value) { this._rotationRate = value; }

	set colorRGB(rgbArray) { this._material.color.setRGB(...rgbArray)}

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

			this._material.opacity = averageAmplitude > 0.0 ? 1 : 0;

			let rValue = rAmplitude * 100;
			let gValue = gAmplitude * 10000;
			let bValue = bAmplitude * 100000

			this.colorRGB = [rValue, gValue, bValue];

			this._line.rotation.z = (time / this._rotationRate);
		}
	}
}

