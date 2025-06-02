import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS_Visualizer } from "../IS_Visualizer.js";
import { IS } from "../../../script.js";

export class IS_BufferCircle extends IS_VisualElement
{
	constructor(buffer, audioNode, scale)
	{
		super();

		this._material = new this.three.LineBasicMaterial();

		// TODO: multichannel
		let bufferArray = buffer.getChannelData(0);
		let points = [];

		let circle = new this.three.Object3D();

		// TODO: props, getters, setters
		let nSamples = bufferArray.length;
		let nCircles = 30;
		let circleNPoints = bufferArray.length / nCircles ;
		let currentCircle = 0;

		for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
		{
			let sampleValue = bufferArray[sampleIndex];

			let xPosition = Math.sin(2 * Math.PI * (sampleIndex / circleNPoints)) + sampleValue * 0.025;
			let yPosition = Math.cos(2 * Math.PI * (sampleIndex / circleNPoints)) + sampleValue * 0.025;
			let zPosition = 0;

			let position = [xPosition, yPosition, zPosition];

			points.push(new this.three.Vector3(...position));

			if(sampleIndex % circleNPoints === 0)
			{
				let geometry = new this.three.BufferGeometry().setFromPoints(points);
				let line = new this.three.Line(geometry, this._material);

				line.scale.set(scale, scale, scale);
				line.rotation.set(0, Math.PI * 2 * (currentCircle / nCircles), 0);

				circle.add(line);

				points = [];

				currentCircle++;
			}
		}

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
