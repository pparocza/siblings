import { IS } from "../../../script.js";

export class OscillatingStereoReverb
{
	constructor(length = 3)
	{
		this._input = IS.createGain();
		this._output = IS.createGain();

		this._length = length

		this._schedulables = [];

		this.createChannel(-1);
		this.createChannel(1);
	}

	connect(audioNode)
	{
		this._output.connect(audioNode);
	}

	get input()
	{
		return this._input;
	}

	set gain(value)
	{
		this._output.gain.value = value;
	}

	schedule(time = 0)
	{
		for(let schedulableIndex = 0; schedulableIndex < this._schedulables.length; schedulableIndex++)
		{
			this._schedulables[schedulableIndex].scheduleStart(time);
		}
	}

	createChannel(panValue)
	{
		let buffer = this.createReverbBuffer(this._length);

		let convolver = IS.createConvolver(buffer);

		let pan = IS.createStereoPanner(panValue)
		let delay = IS.createDelay(IS.Random.Float(0.0625, 0.25), 0.25, 1, 0.5);

		let delayOscillatorBuffer = IS.createBuffer(1, 1);
		delayOscillatorBuffer.noise().add();

		let delayOscillatorSource = IS.createBufferSource(delayOscillatorBuffer);
		delayOscillatorSource.playbackRate = IS.Random.Float(1, 2) / 1000000 * 0.125;
		delayOscillatorSource.loop = true;
		delayOscillatorSource.gain = IS.Random.Float(0.0125, 0.125) / 10;

		let delayOscillatorFilter = IS.createFilter("lowpass", 1.5, 1);

		delayOscillatorSource.connect(delayOscillatorFilter);
		delayOscillatorFilter.connect(delay.delayTime);

		this._input.connect(convolver);
		convolver.connect(delay);
		delay.connect(pan);

		convolver.connect(pan);

		pan.connect(this._output);

		this._schedulables.push(delayOscillatorSource);
	}

	createReverbBuffer(length = 1)
	{
		let reverbBuffer = IS.createBuffer(1, length);
		reverbBuffer.noise().add();
		reverbBuffer.inverseSawtooth(2).multiply();

		return reverbBuffer;
	}
}