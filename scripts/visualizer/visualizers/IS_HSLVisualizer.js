import * as THREE from "https://cdn.skypack.dev/three@0.152.0";
import { IS_Visualizer } from "../IS_Visualizer.js";
import { IS } from "../../../script.js";
import { IS_Light } from "../elements/IS_Light.js";
import { IS_BufferCircle } from "../elements/IS_BufferCircle.js";
import { IS_BufferGeometry } from "../elements/IS_BufferGeometry.js";

// TODO: sort out addons with CDN: https://threejs.org/manual/#en/fundamentals <- at the botttom

export const IS_HSLVisualizer =
{
	visualize() {},

	initialize()
	{
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

		this._createBufferCircles(bufferSources);
		this._createBufferGeometries(bufferSources);

	},

	_createBufferCircles(bufferSources)
	{
		let scaleArray = [0.6, 16, 0.4];
		let denominatorArray = [1, 2, 3];

		for(let bufferIndex = 0; bufferIndex < bufferSources.length; bufferIndex++)
		{
			let bufferSource = bufferSources[bufferIndex];

			let scaleIndex = Math.floor(scaleArray.length * (bufferIndex / bufferSources.length));
			let scaleFactor = scaleArray[scaleIndex];

			new IS_BufferCircle
			(
				bufferSource.buffer,
				bufferSource,
				scaleFactor / denominatorArray[bufferIndex % 3]
			);
		}
	},

	_createBufferGeometries(bufferSources)
	{
		let nCircles = 30;

		for(let bufferIndex = 0; bufferIndex < bufferSources.length; bufferIndex++)
		{
			let bufferSource = bufferSources[bufferIndex];
			let bufferArray = bufferSource.buffer.getChannelData(0);
			let nSamples = bufferArray.length;
			let circleNPoints = bufferArray.length / nCircles ;

			let bufferGeometry = new IS_BufferGeometry(bufferSource);

			for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
			{
				let sampleValue = bufferArray[sampleIndex];

				let xPosition = Math.sin(2 * Math.PI * (sampleIndex / circleNPoints)) + sampleValue * 0.025;
				let yPosition = Math.cos(2 * Math.PI * (sampleIndex / circleNPoints)) + sampleValue * 0.025;
				let zPosition = 0;

				let position = [xPosition, yPosition, zPosition];

				bufferGeometry.createVertex(position, [0, 0, 1], [0, 0]);
			}

			let shape = bufferGeometry.createInstance();

			let xScale = 1;
			let yScale = 1;
			let zScale = 1;

			shape.scale.set(xScale, yScale, zScale);
			shape.position.set(0, 0 , 0);

			bufferGeometry.animate = new IS_HSL_Animation
			(
				bufferSource, bufferGeometry._material, bufferGeometry._mesh
			);

			IS_Visualizer.addToScene(shape);
		}
	}
}

class IS_HSL_Animation
{
	constructor(audioNode, mesh, material)
	{
		this._audioNode = audioNode;
		this._mesh = mesh;
		this._material = material;

		this._animationXRotationRate = IS.Random.Float(5, 10);
		this._animationYRotationRate = IS.Random.Float(5, 10);
		this._animationZRotationRate = IS.Random.Float(5, 10);

		return this._animationCallback;
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

