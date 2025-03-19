import { IS } from "../../../script.js";

export class Organ
{
	constructor(fundamental, chord)
	{
		const possibleOctaves = IS.array(4, 8, 16, 32);

		const bufferLength = IS.Random.Float(1.5, 2);

		const convolverBuffer = IS.createBuffer(2, bufferLength);
		const nHarmonics = 20;

		fundamental *= bufferLength;

		// TODO: this is why you need a channel argument
		for(let channel = 0; channel < convolverBuffer.numberOfChannels; channel++)
		{
			convolverBuffer.operationChannel = channel;
			for(let harmonicIndex = 0; harmonicIndex < nHarmonics; harmonicIndex++)
			{
				let carrierFrequency = fundamental * chord.urn() * possibleOctaves.random();

				convolverBuffer.suspendOperations();

					convolverBuffer.frequencyModulatedSine
					(
						carrierFrequency * IS.Random.Float(0.995, 1.005) * 2,
						carrierFrequency * IS.Random.Float(0.995, 1.005),
						IS.Random.Float(0.1, 5)
					).add();

					convolverBuffer.frequencyModulatedSine
					(
						carrierFrequency * IS.Random.Float(0.995, 1.005) * 4,
						carrierFrequency * IS.Random.Float(0.995, 1.005),
						IS.Random.Float(0.1, 5)
					).add();

					let rampStart = IS.Random.Float(0, 0.75);
					let rampEnd = IS.Random.Float(rampStart, 1);
					let rampPeak = IS.Random.Float(0.3, 0.7);

					convolverBuffer.ramp
					(
						rampStart, rampEnd, rampPeak, rampPeak
					).multiply();

					let squareStart = IS.Random.Float(0, 0.75);
					let squareEnd = squareStart + IS.Random.Float(0.05, 0.1);

					convolverBuffer.pulse
					(
						squareStart, squareEnd
					).multiply();

				convolverBuffer.applySuspendedOperations().add();
			}

			convolverBuffer.constant(1 / nHarmonics).multiply();
		}

		/*
		convolverBuffer.frequencyModulatedSine
		(
			IS.randomFloat(0.0625, 0.25),
			IS.randomFloat(0.0625, 1),
			1
		).channelMerge();
		 */

		let buffer = IS.createBuffer(1, 1);
		buffer.noise().add();
		buffer.inverseSawtooth(3).multiply();

		let bufferSource = IS.createBufferSource(buffer);
		bufferSource.playbackRate = 1;
		bufferSource.loop = true;

		bufferSource.gain = 0.125;

		let bufferOscBuffer = IS.createBuffer(1, 1);
		bufferOscBuffer.noise().add();

		let bufferOsc = IS.createBufferSource(bufferOscBuffer);
		bufferOsc.gain = 0.9;
		bufferOsc.playbackRate = 1 / 100000;
		bufferOsc.loop = true;

		bufferOsc.connect(bufferSource.playbackRate);
		bufferOsc.scheduleStart(0);

		let filter = IS.createFilter("bandpass", 1000, 10);

		let filterOscBuffer = IS.createBuffer(1, 1);
		filterOscBuffer.noise().add();

		let filterOsc = IS.createBufferSource(filterOscBuffer);
		filterOsc.gain = 900;
		filterOsc.playbackRate = 1 / 100000;
		filterOsc.loop = true;

		filterOsc.connect(filter.frequency);
		filterOsc.scheduleStart(0);

		bufferSource.scheduleStart(0);

		this._convolver = IS.createConvolver(convolverBuffer);

		IS.connect.series(bufferSource, filter, this._convolver);

		return this.convolver;
	}

	connect(audioNode)
	{
		this.convolver.connect(audioNode);
	}

	get convolver()
	{
		return this._convolver;
	}

	set gain(value)
	{
		this._convolver.gain.value = value;
	}
}