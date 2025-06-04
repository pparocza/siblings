import * as THREE from "https://cdn.skypack.dev/three@0.152.0";
import { IS_VisualNode } from "../elements/IS_VisualNode.js";
import { SIBLING_CONTEXT } from "../IS_VisualizerContext.js";
import { IS_VisualizerParameters } from "../IS_VisualizerParameters.js";
import { IS } from "../../../script";
import { IS_Visualizer } from "../IS_Visualizer.js";
import { IS_VisualElement } from "../elements/IS_VisualElement.js";
import { IS_Light } from "../elements/IS_Light.js";
import { IS_BufferGeometry } from "../elements/IS_BufferGeometry.js";

// TODO: figure out what's going on with "this" not existing in the context
let COLUMN_SPACING = 0.5 * 0.75 * 1.25;
let ROW_SPACING = -0.35 * 0.8 * 2;

let PETALS_PER_CIRCLE = 25;
let RADIUS_BASE = 0.5;
let RADIUS_MIN = 0.3;

let X_POSITION = 0;
let Y_POSITION = 0;

let SHOW_CONNECTIONS = true;
let VISUAL_NETWORKS = [];

let RANDOM_ROTATE = false;

export const IS_FlowerNetworkVisualizer =
{
	get xPosition() { return X_POSITION; },
	set xPosition(value) { X_POSITION = value; },

	get yPosition() { return Y_POSITION; },
	set yPosition(value) { Y_POSITION = value; },

	get columnSpacing() { return COLUMN_SPACING; },
	set columnSpacing(value) { COLUMN_SPACING = value; },

	get rowSpacing() { return ROW_SPACING; },
	set rowSpacing(value) { ROW_SPACING = value; },

	get showConnections() { return SHOW_CONNECTIONS; },
	set showConnections(value) { SHOW_CONNECTIONS = value; },

	get nodeHeight() { return IS_VisualizerParameters.Node.Height; },
	set nodeHeight(value) { IS_VisualizerParameters.Node.Height = value; },

	get nodeWidth() { return IS_VisualizerParameters.Node.Width; },
	set nodeWidth(value) { IS_VisualizerParameters.Node.Width = value; },

	get nodeScale() { return IS_VisualizerParameters.Node.Scale; },
	set nodeScale(value) { IS_VisualizerParameters.Node.Scale = value; },

	get randomRotate() { return RANDOM_ROTATE; },
	set randomRotate(value) { RANDOM_ROTATE = value; },

	visualize() {},

	initialize()
	{
		let networkRegistry = SIBLING_CONTEXT.NetworkRegistry;

		let petalSources = [];
		let delaySources = [];
		let convolverSources = [];
		let backgroundNoise = [];

		for(const [audioNodeUUID, audioNode] of Object.entries(IS.NodeRegistry._registry))
		{
			if(audioNode.isISBufferSource)
			{
				if(audioNode.isISBufferSource && audioNode.buffer.duration > 10)
				{
					backgroundNoise.push(audioNode);
				}

				petalSources.push(audioNode);
			}
			else if(audioNode.isISConvolver && audioNode.buffer.duration <= 1)
			{
				convolverSources.push(audioNode);
			}
			else if(audioNode.isISDelay || audioNode.isISStereoDelay)
			{
				delaySources.push(audioNode);
			}
		}

		this._createCirlces(petalSources);
		this._createConvolverSources(convolverSources);
		// this._createDelaySources(delaySources);
		// this._createConvolverSources(convolverSources);
		this._createBackgroundNoise(backgroundNoise);
	},

	_createCirlces(sources)
	{
		let nSources = sources.length;

		let radiusBase = 0.05;
		let radiusMin = 0.025;
		let radiusWrap = 100;

		for(let sourceIndex = 0; sourceIndex < nSources; sourceIndex++)
		{
			let source = sources[sourceIndex];
			let radiusScaler = (sourceIndex % radiusWrap) + 1;
			let radius = (radiusBase * radiusScaler);
			let line = new IS_Line(source);
			line.circle(radius, source.buffer.length);
		}
	},

	_createConvolverSources(sources)
	{
		let nSources = sources.length;

		let radiusBase = 0.5;
		let radiusMin = 0.025;
		let radiusWrap = 100;

		let backgroundNoiseConvolvers = [];

		for(let sourceIndex = 0; sourceIndex < nSources; sourceIndex++)
		{
			let source = sources[sourceIndex];

			let radiusScaler = (sourceIndex % radiusWrap) + 1;
			let radius = (radiusBase * radiusScaler);
			let line = new IS_Line(source);

			if(sourceIndex < 2)
			{
				// line.bufferCircle(7, source.buffer, source);
			}
			else
			{
				line.twistedCircle(radius, source.buffer);
			}
		}
	},

	_createBackgroundNoise(sources)
	{
		let nSources = sources.length;

		for(let sourceIndex = 0; sourceIndex < nSources; sourceIndex++)
		{
			let source = sources[sourceIndex];
			let line = new IS_Line(source);
			line.bufferGeometry(source);
		}
	}
}

class IS_PetalNode extends IS_VisualNode
{
	constructor(audioNode, nodeXPosition, nodeYPosition)
	{
		super(audioNode, nodeXPosition, nodeYPosition);

		this.animate = this._animationCallback;
	}

	_animationCallback()
	{
		if(this.audioNode.frequencyBins)
		{
			let frequencyArray = this.audioNode.frequencyBins;

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

			this._material.opacity = averageAmplitude > 0 ? 1 : 0;

			let rValue = rAmplitude * 100;
			let gValue = gAmplitude * 10000;
			let bValue = bAmplitude * 100000

			this.RGB = [rValue, gValue, bValue];
		}

		// if(this.audioNode.outputValue)
		// {
		// 	this._material.opacity = this.audioNode.outputValue;
		// }
	}
}

// class IS_AudioAnalyzer
class IS_Line extends IS_VisualElement
{
	constructor(audioNode = null)
	{
		super();

		if(audioNode !== null)
		{
			this._audioNode = audioNode;
		}
	}

	// instead IS_Circle extends IS_Line?
	circle(radius = 1, nPoints = 100)
	{
		let points = [];

		for(let pointIndex = 0; pointIndex < nPoints; pointIndex++)
		{
			let theta = 2 * Math.PI * (pointIndex / nPoints);
			let x = Math.sin(theta);
			let y = Math.cos(theta);

			let point = new THREE.Vector3(x, y, 0);

			points.push(point);
		}

		let material = new THREE.LineBasicMaterial();
		let geometry = new THREE.BufferGeometry().setFromPoints(points);
		let line = new THREE.Line(geometry, material);

		material.transparent = true;
		material.opacity = 0;

		line.scale.x *= radius;
		line.scale.y *= radius;

		IS_Visualizer.addToScene(line);

		this._material = material;
		this._line = line;

		if(this._audioNode !== null)
		{
			this.animate = this._spectrumRGB;
		}
	}

	bufferCircle(radius = 0.125, audioBuffer, audioNode)
	{
		let points = [];
		let sourceBuffer = audioBuffer.getChannelData(0);
		let nPoints = sourceBuffer.length;
		let originalRadius = radius;

		let circleWrap = nPoints / 5;
		console.log(nPoints);

		for(let pointIndex = 0; pointIndex < nPoints; pointIndex++)
		{
			let sampleValue = sourceBuffer[pointIndex];

			let theta = 2 * Math.PI * ((pointIndex % circleWrap) / circleWrap);
			let x = Math.sin(theta) * radius;
			let y = Math.cos(theta) * radius;

			let point = new THREE.Vector3(x, y, sourceBuffer[pointIndex]);

			points.push(point);

			if(pointIndex % circleWrap === 0)
			{
				radius += originalRadius;
			}
		}

		let material = new THREE.LineBasicMaterial();
		let geometry = new THREE.BufferGeometry().setFromPoints(points);
		let line = new THREE.Line(geometry, material);

		material.transparent = true;
		material.opacity = 0;

		line.scale.x = 0.25;
		line.scale.y = 0.25;

		IS_Visualizer.addToScene(line);

		this._material = material;
		this._line = line;

		this.animate = this._spectrumAndRotate;
	}

	twistedCircle(radius = 1, audioBuffer)
	{
		let points = [];
		let sourceBuffer = audioBuffer.getChannelData(0);
		let nPoints = sourceBuffer.length;

		for(let pointIndex = 0; pointIndex < nPoints; pointIndex++)
		{
			let sampleValue = sourceBuffer[pointIndex];

			let theta = 2 * Math.PI * (pointIndex / nPoints);
			let x = Math.sin(theta) * sampleValue;
			let y = Math.cos(theta) * sampleValue;

			let point = new THREE.Vector3(x, y, sourceBuffer[pointIndex]);

			points.push(point);
		}

		let material = new THREE.LineBasicMaterial();
		let geometry = new THREE.BufferGeometry().setFromPoints(points);
		let line = new THREE.Line(geometry, material);

		material.transparent = true;
		material.opacity = 0;

		line.scale.x *= radius;
		line.scale.y *= radius;

		IS_Visualizer.addToScene(line);

		this._material = material;
		this._line = line;

		this.animate = this._spectrumRGB;
	}

	bufferPlane(height, width, buffer)
	{
		let sampleArray = buffer.getChannelData(0);
		let points = [];
		let nSamples = sampleArray.length;

		for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
		{
			let sampleValue = sampleArray[sampleIndex];
			let progress = sampleIndex / nSamples;
			let theta = (Math.PI * 2 * progress);
			let point = new THREE.Vector3
			(
				sampleIndex / nSamples,
				sampleValue,
				0
			);

			points.push(point);
		}

		let material = new THREE.LineBasicMaterial();
		let geometry = new THREE.BufferGeometry().setFromPoints(points);
		let line = new THREE.Line(geometry, material);

		line.scale.y = 5;
		line.scale.x = 5;

		line.rotation.z = Math.PI * 0.5;
		line.scale.x = 8;
		line.scale.y = 4;

		line.position.y = -line.scale.x * 0.5;

		IS_Visualizer.addToScene(line);

		this._material = material;
		this._line = line;

		this.animate = this._spectrumAndRotate;
	}

	bufferGeometry(bufferSource)
	{
		let sampleArray = bufferSource.buffer.getChannelData(0);
		let points = [];
		let nSamples = sampleArray.length;

		for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
		{
			let sampleValue = sampleArray[sampleIndex];
			let progress = sampleIndex / nSamples;
			let theta = (Math.PI * 2 * progress);

			let point = new THREE.Vector3
			(
				sampleIndex / nSamples,
				sampleValue,
				0
			);

			points.push(point);
		}

		let bufferGeometry = new IS_BufferGeometry(THREE, bufferSource);
		bufferGeometry.material = new THREE.MeshNormalMaterial();

		bufferGeometry.createVertex([0, 4, 0], [0, 0, 1], [0, 0]);
		bufferGeometry.createVertex([-4, 0, 0], [0, 0, 1], [0, 0]);
		bufferGeometry.createVertex([4, 0, 0], [0, 0, 1], [0, 0]);

		bufferGeometry.createBufferGeometry();

		let material = new THREE.LineBasicMaterial();
		let geometry = bufferGeometry.createInstance();
		geometry._material = new THREE.MeshNormalMaterial();

		bufferGeometry.shouldAnimate = false;

		IS_Visualizer.addToScene(geometry);

		// this.animate = this._spectrumAndRotate;
	}

	// TODO: AudioReaction(audioNode, visualNode)
	// _spectrumRGB(material) <- applies the RGB rules to the material
	// or _spectrum01 <- returns frequency bins normalized to 0-1
	_spectrumRGB()
	{
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

			let rValue = rAmplitude * 100;
			let gValue = gAmplitude * 10000;
			let bValue = bAmplitude * 100000;

			this._material.opacity = averageAmplitude > 0.00005 ? 1 : 0;
			this._material.color.setRGB(rValue, gValue, bValue);
		}
	}

	rotateRate = null;

	_randomRotateZ()
	{
		if(!this.rotateRate)
		{
			this.rotateRate = IS.Random.Float(5000, 7000);
		}

		this._line.rotation.z = performance.now() / this.rotateRate;
	}

	_spectrumAndRotate()
	{
		this._spectrumRGB();
		this._randomRotateZ();
	}

	_scaleOverTime()
	{
		this._line.scale.y = performance.now() / 20000;
	}
}