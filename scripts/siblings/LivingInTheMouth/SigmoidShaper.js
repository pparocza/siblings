import { IS } from "../../../script.js";

export class SigmoidShaper
{
	constructor()
	{
		this._input = IS.createGain();
		this._output = IS.createGain();

		this.waveShaper = IS.AudioContext.createWaveShaper();

		this.input.connect(this.waveShaper);
		this.waveShaper.connect(this.output.input);
	}

	sigmoid(amount)
	{
		let k = amount;
		let nSamples = IS.sampleRate;
		let curve = new Float32Array(nSamples);
		let deg = Math.PI / 180;
		let x;

		for (let sampleIndex= 0; sampleIndex < nSamples; sampleIndex++)
		{
			x = sampleIndex * 2 / nSamples - 1;
			curve[sampleIndex] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
		}

		this.waveShaper.curve = curve;
	}

	get output() { return this._output; }
	get input() { return this._input; }
}