import { IS } from "../../../script.js";

export class SparkModulator
{
	constructor(fundamental, chord)
	{
		const sparkBuffer = IS.createBuffer(1, 1);
		sparkBuffer.inverseSawtooth(3).add();

		const sparkBufferSource = IS.createBufferSource(sparkBuffer);
		sparkBufferSource.playbackRate = 1;

		const envelopeFilter = IS.createParallelEffect
		(
			IS.createFilter("lowpass", 1000, 1),
			IS.createFilter("highpass", 100, 1)
		);

		const outputFilter = IS.createParallelEffect();
		outputFilter.volume = 0;

		const nFilters = 5;

		const possibleOctaves = IS.array(1, 2, 4);

		for(let filterIndex = 1; filterIndex < nFilters; filterIndex++)
		{
			let filter = IS.createFilter
			(
				"bandpass",
				fundamental * chord.urn(), possibleOctaves.random() * IS.randomFloat(0.99, 1.01),
				IS.randomFloat(10, 20), 1
			);

			outputFilter.insert
			(
				filter,
				IS.createStereoPanner(IS.randomFloat(-1, 1))
			);
		}

		const inputGain = IS.createGain();
		const sparkGain = IS.createGain(0);
		const outputGain = IS.createGain(5);

		IS.connectSeries
		(
			sparkBufferSource,
			envelopeFilter,
			sparkGain.gain
		);

		IS.connectSeries
		(
			inputGain,
			sparkGain,
			outputFilter,
			outputGain
		);

		let onsetSequence = IS.sequenceArray();
		let rateSequence = IS.sequenceArray();
		let speed = 0.5;

		onsetSequence.timeSequence
		(
			[1, 1/2, 1/3, 1/4, 1/5], 0, true,
			speed,
			0.1, 1, 100
		);

		rateSequence.valueSequence
		(
			[1, 2, 3, 4, 5, 0.5, 0.75], onsetSequence.length, true
		);

		sparkBufferSource.scheduleSequence(onsetSequence);
		sparkBufferSource.playbackRate.scheduleValueSequence(rateSequence, onsetSequence);

		this.inputGain = inputGain;
		this.outputGain = outputGain;
	}

	get input()
	{
		return this.inputGain;
	}

	get output()
	{
		return this.outputGain;
	}
}