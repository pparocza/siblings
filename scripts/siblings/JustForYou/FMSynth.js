import { IS } from "../../../script.js";
import { Organ } from "./Organ.js";

export class FMSynth
{
	constructor(chordFundamental, chord)
	{
		const synthBuffer = IS.createBuffer(1, 3);
		const nVoices = 20;
		const octaveArray = IS.array(1, 2, 0.5, 4);

		chordFundamental *= synthBuffer.duration;

		// NOISE

		for(let voiceIndex = 0; voiceIndex < nVoices; voiceIndex++)
		{
			synthBuffer.suspendOperations();

				synthBuffer.noise().add();

				synthBuffer.constant(0.0625).multiply();

				synthBuffer.frequencyModulatedSine
				(
					chordFundamental * IS.Random.Select(1, 0.5, 0.25) * IS.Random.Float(0.99, 1.01),
					chordFundamental * IS.Random.Float(0.99, 1.01),
					IS.Random.Float(0.1, 1)
				).add();

				let rampStart = IS.Random.Float(0, 0.75);
				let rampEnd = rampStart + IS.Random.Float(0.025, 0.1);

				synthBuffer.pulse
				(
					rampStart, rampEnd
				).multiply();

				synthBuffer.constant(IS.Random.Float(0.0625, 0.125)).multiply();

			synthBuffer.applySuspendedOperations().add();
		}

		// PRIMARY VOICE
		for(let voiceIndex = 0; voiceIndex < nVoices; voiceIndex++)
		{
			synthBuffer.suspendOperations();

				let octave = octaveArray.random();

				let modulationFrequency = IS.Random.CoinToss() ?
					chordFundamental * IS.Random.Float(0.99, 1.01)
					: IS.Random.Float(0.25, 5);

				synthBuffer.frequencyModulatedSine
				(
					chordFundamental * octave * IS.Random.Float(0.99, 1.01),
					modulationFrequency,
					IS.Random.Float(0.125, 0.2)
				).add();

				synthBuffer.frequencyModulatedSine
				(
					IS.Random.Float(0.25, 1),
					IS.Random.Float(0.25, 2),
					IS.Random.Float(0.125, 0.25)
				).multiply();

				let rampStart = IS.Random.Float(0, 0.75);
				let rampEnd = IS.Random.Float(rampStart, 1);
				let rampPeak = IS.Random.Float(0.3, 0.7);

				synthBuffer.ramp
				(
					rampStart, rampEnd, rampPeak, rampPeak
				).multiply();

				if(octave >= 4)
				{
					synthBuffer.constant(IS.Random.Float(0.25, 0.35)).multiply();
				}
				else
				{
					synthBuffer.constant(IS.Random.Float(0.75, 1)).multiply();
				}

			synthBuffer.applySuspendedOperations().add();
		}

		synthBuffer.constant(0.5).multiply();

		let rampPeak = IS.Random.Float(0.3, 0.7);

		synthBuffer.ramp
		(
			0, 1, rampPeak, rampPeak
		).multiply();

		const synthBufferSource = IS.createBufferSource(synthBuffer);
		synthBufferSource.playbackRate = 1;

		let output = IS.createGain(0.75);
		let pan = IS.createStereoPanner(0);
		let filter = IS.createFilter("notch", chordFundamental, 1);

		const organ = new Organ(chordFundamental, chord);
		const organDelay = IS.createStereoDelay
		(
			IS.Random.Float(0.125, 0.25), IS.Random.Float(0.125, 0.25)
		);

		const organOscBuffer = IS.createBuffer(1, 1);
		organOscBuffer.noise().add();
		const organOsc = IS.createBufferSource(organOscBuffer);
		organOsc.playbackRate = 0.000125;
		organOsc.loop = true;
		organOsc.gain.value = 0.00125;
		organOsc.connect(organDelay.delayTimeLeft);
		organOsc.scheduleStart(0);

		const organOscBuffer2 = IS.createBuffer(1, 1);
		organOscBuffer2.noise().add();
		const organOsc2 = IS.createBufferSource(organOscBuffer);
		organOsc2.playbackRate = 0.000125;
		organOsc2.loop = true;
		organOsc2.gain.value = 0.00125;
		organOsc2.connect(organDelay.delayTimeRight);
		organOsc2.scheduleStart(0);

		organDelay.feedbackPercent = 0.5;
		const delayFilter = IS.createFilter("highpass", 100, 1);

		const synthGain = IS.createGain(0.25);
		const organOutput = IS.createGain(1);

		IS.connect.series(synthBufferSource, pan, synthGain, output);
		IS.connect.series(synthBufferSource, organDelay, organ, delayFilter, filter, output);

		organ.gain = 2;

		this._synthBufferSource = synthBufferSource;
		this._output = output;
		this._organOutput = organOutput;
		this._synthGain = synthGain;
		this._pan = pan;
		this._filter = filter;

		this._chordFundamental = chordFundamental;
	}

	connect(audioNode)
	{
		this._output.connect(audioNode);
	}

	get output()
	{
		return this._output;
	}

	get organOutput()
	{
		return this._organOutput;
	}

	scheduleStart(time = 0)
	{
		this._synthBufferSource.scheduleStart(time);
	}

	scheduleRate(value = 1, time = 0, transitionTime = null)
	{
		if(transitionTime !== null && transitionTime !== 0)
		{
			this._synthGain.gain.scheduleValue(0, time, 0.01);
			this._synthGain.gain.scheduleValue(1, time + transitionTime, IS.Random.Float(0.01, 0.1));
		}

		this._synthBufferSource.playbackRate.scheduleValue(value, time, transitionTime);
		this._filter.frequency.scheduleValue(this._chordFundamental * value, time, transitionTime);
	}

	schedulePan(value = 1, time = 0, transitionTime = null)
	{
		this._pan.pan.scheduleValue(value, time, transitionTime);
	}

	get source()
	{
		return this._synthBufferSource;
	}
}