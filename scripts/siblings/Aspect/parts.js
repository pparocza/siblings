import { IS } from "../../../script.js";

export class Piece
{
	constructor(){}

	load()
	{
		this.buffer = IS.createBuffer(1, 1);
		this.buffer.noise().add();
		this.buffer.ramp
		(
			0, 1, 0.01, 0.01, 0.5, 15
		).multiply();

		this.buffer.printOnOperationsComplete = true;

		this.bufferSource = IS.createBufferSource(this.buffer);
		this.bufferSource.playbackRate = 4;

		this.convolverBuffer = IS.createBuffer(1, 3);
		this.convolverBuffer.printOnOperationsComplete = true;

		const nFrequencies = 100;

		// the idea here is to create a resonator
		for(let frequencyIndex = 0; frequencyIndex < nFrequencies; frequencyIndex++)
		{
			this.convolverBuffer.suspendOperations();

			this.convolverBuffer.sine(IS.Random.Int(110, 2200)).add();
			this.convolverBuffer.constant(IS.Random.Float(0.25, 1)).multiply();

			let rampEnd = IS.Random.Float(0.1, 1);
			let peakPercent =  IS.Random.Float(0.1, 0.5);
			let upExponent =  IS.Random.Float(0.5, 1.5);
			let downExponent =  IS.Random.Float(8, 17);

			this.convolverBuffer.ramp
			(
				0, 1, 0.01, 0.01, 0.5, 15
			).multiply();

			this.convolverBuffer.applySuspendedOperations().add();
		}

		this.convolverBuffer.constant(1 / nFrequencies).multiply();

		this.convolverBuffer.ramp
		(
			0, 1, 0.01, 0.01, 0.5, 15
		).multiply();

		this.convolver = IS.createConvolver(this.convolverBuffer);
		// TODO: wetMix = 0 still has wet
		this.convolver.wetMix = 1;

		this.output = IS.createGain();

		IS.connect.series(this.bufferSource, this.convolver, this.output);

		this.output.connectToMainOutput();
	}

	schedule()
	{
		this.globalNow = 0;

		let sequence = IS.sequenceArray();
		let possibleDurations = [0.25, 0.1, 0.5, 0.4, 0.33, 1, 1.25, 0.075];
		let startTime = 0;
		let includeStart = true;
		let speed = 1;
		let drunk = 0;
		let density = 1;
		let timeLimit = 100;

		sequence.timeSequence(possibleDurations, startTime, includeStart, speed, drunk, density, timeLimit);

		this.bufferSource.scheduleSequence(sequence);
	}

	stop()
	{
		this.fadeFilter.start(0, 20);
		startButton.innerHTML = "reset";
	}
}

var m2 = 25/24;
var M2 = 9/8;
var m3 = 6/5;
var M3 = 5/4;
var P4 = 4/3;
var d5 = 45/32;
var P5 = 3/2;
var m6 = 8/5;
var M6 = 5/3;
var m7 = 9/5;
var M7 = 15/8;