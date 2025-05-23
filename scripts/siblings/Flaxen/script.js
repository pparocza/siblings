import { IS } from "../../../script.js";
import { Parameters } from "./parameters.js";
import * as Visualizer from "./visualizer.js";

IS.onLoad(test);

function test()
{
	delayTap();
}

function replay()
{
	// console.log("SCHEDULE:", IS.Scheduler.contextSchedule);
}

function delayTap()
{
	let buffer = IS.createBuffer(1, 1);
	buffer.printOnOperationsComplete = true;

	let reverbBuffer = IS.createBuffer(2, 3);
	reverbBuffer.noise().add();
	reverbBuffer.inverseSawtooth(4).multiply();

	let filter = IS.createFilter("highpass", 100);
	filter.connectToMainOutput();

	let reverb = IS.createConvolver(reverbBuffer);
	IS.output.connect(reverb.input);
	reverb.connectToAudioDestination();

	for(let harmonicIndex = 0; harmonicIndex < Parameters.NHarmonics; harmonicIndex++)
	{
		let harmonicRatio = harmonicIndex + 1;
		let harmonicGain = (Parameters.NHarmonics - harmonicIndex) / Parameters.NHarmonics;
		let frequency = Parameters.Fundamental * harmonicRatio * IS.Random.Float(1, 1.001);

		buffer.suspendOperations();

		buffer.noise().add();
		buffer.constant(IS.Random.Float(0.001, 0.01)).multiply();
		buffer.frequencyModulatedSine(frequency, IS.Random.Float(1, 5), IS.Random.Float(0.1, 0.3)).add();
		buffer.constant(harmonicGain).multiply();
		buffer.ramp
		(
			0, 1,
			0.075, 0.05,
			0.25, 3
		).multiply();

		buffer.applySuspendedOperations().add();
	}

	buffer.constant(1 / Parameters.NHarmonics).multiply();

	let bufferSource = IS.createBufferSource(buffer);
	bufferSource.playbackRate = 1;
	bufferSource.connectToMainOutput();
	bufferSource.gain = 0.75;

	let possibleDelayLengthRatios = [1, 0.5, 2.5, 1.5, 1.75, 2];

	let chains = [];

	for(let chainIndex = 0; chainIndex < Parameters.NDelayChains; chainIndex++)
	{
		let delayLengthRatio = IS.Random.Select(...possibleDelayLengthRatios) * IS.Random.Float(0.999, 1.001);
		let delayAmount = delayLengthRatio * Parameters.Rate;
		let nDelays = IS.Random.Int(3, 8);

		let chain = new DelayChain(delayAmount, nDelays);
		bufferSource.connect(chain.input);
		chain.connect(IS.output);

		chains.push(chain);
	}

	let possibleModes = [IS.Mode.Major/*, IS.Mode.Minor*/];
	let mode = IS.Random.Select(...possibleModes);
	let ratioScale = IS.ratioScale(mode);
	// no seventh
	ratioScale.value.pop();
	let possibleOctaves = [1, 2, 0.5];
	let previousOnset = 0;
	let firstNote = true;
	let previousRatioIndex = 0;

	const possibleNoteLengthRatios = [2, 1, 1.5, 0.5, 2.5];

	let currentChord = 1;
	let currentChordDuration = 0;
	let changeChord = false;
	let tonicOffset = 0;

	while(previousOnset < Parameters.TimeLimit)
	{
		let noteLengthRatio = firstNote ? 0 : IS.Random.Select(...possibleNoteLengthRatios);
		let noteLength = noteLengthRatio * Parameters.Rate;
		let onset = previousOnset + noteLength;
		let ratioIndex = IS.Random.Int(0, ratioScale.value.length);

		let melodicInterval = Math.abs(previousRatioIndex - ratioIndex);

		let isSecond = melodicInterval === 1;
		let isSeventh = melodicInterval === 6;

		if(isSecond)
		{
			ratioIndex++;
		}
		if(isSeventh)
		{
			ratioIndex--;
		}

		if(changeChord)
		{
			let nextTonic = 0;

			if(currentChord !== Parameters.NChords)
			{
				nextTonic = IS.Random.Int(0, ratioScale.value.length);

				if(Math.abs(nextTonic - tonicOffset) === 1)
				{
					nextTonic++;
				}

				tonicOffset = Math.max(0, nextTonic);
			}
		}

		ratioIndex = Math.max(0, ratioIndex + tonicOffset) % ratioScale.value.length ;

		let ratio = ratioScale.value[ratioIndex];
		let octave = IS.Random.Select(...possibleOctaves);
		let playbackRate = ratio * octave * IS.Random.Float(0.999, 1.001);

		bufferSource.scheduleStart(onset);
		bufferSource.playbackRate.scheduleValue(playbackRate, onset);
		bufferSource.gain = IS.Random.Float(0.25, 1);

		for(let chainIndex = 0; chainIndex < chains.length; chainIndex++)
		{
			let chain = chains[chainIndex];

			let gainValue = IS.Random.CoinToss() ? IS.Random.Float(0.25, 1.0) : 0;
			chain.scheduleInputGainValue(gainValue, onset);
			chain.scheduleAllInputValues(onset);
		}

		previousOnset = onset;
		previousRatioIndex = ratioIndex;
		firstNote = false;

		currentChordDuration += noteLength;

		if(currentChordDuration > Parameters.ChordLength)
		{
			currentChordDuration = 0;
			changeChord = true;
			currentChord++;
		}
	}
}

class DelayChain
{
	constructor(delayAmount, nDelays = 1)
	{
		let input = IS.createDelay(delayAmount);
		input.feedbackPercent = 0;
		let output = null;

		this._delays = [];

		if(nDelays === 1)
		{
			output = input;
		}

		if(nDelays >= 2)
		{
			output = IS.createDelay(delayAmount);
			output.feedbackPercent = 0;
			output.gain = 1 / nDelays;

			input.connectToMainOutput();

			if(nDelays === 2)
			{
				input.connect(output);
			}
		}

		if(nDelays > 2)
		{
			let previousDelay = input;

			for(let  delayIndex = 2; delayIndex < nDelays; delayIndex++)
			{
				let delay = IS.createDelay(delayAmount);
				delay.feedbackPercent = 0;
				delay.connectToMainOutput();

				previousDelay.connect(delay);

				if(delayIndex === nDelays - 1)
				{
					delay.connect(output);
				}

				this._delays.push(delay);

				previousDelay = delay;
			}
		}

		this._input = input;
		this._output = output;
		this._delays.push(this._input, this._output);
	}

	get input() { return this._input; }
	get output() { return this._output; }

	connect(audioNode)
	{
		this._output.connect(audioNode);
	}

	scheduleInputGainValue(value, time)
	{
		this._input.gain.scheduleValue(value, time);
	}

	scheduleAllInputValues(time)
	{
		for(let delayIndex = 0; delayIndex < this._delays.length; delayIndex++)
		{
			let delay = this._delays[delayIndex];
			delay.gain.scheduleValue(IS.Random.Float(0.25, 1), time);
		}
	}
}

