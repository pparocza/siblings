import { IS } from "../../../script.js";

export class FMShaper
{
	constructor(carrierFrequency, modulatorFrequency, bandwidth, modulatorGain)
	{
		this.carrierFrequency = carrierFrequency;
		this.modulatorFrequency = modulatorFrequency;
		this.bandwidth = bandwidth;
		this.modulatorGain = modulatorGain;

		this.input = IS.createGain();
		this.output = IS.createGain();
		this.waveShaper = IS.AudioContext.createWaveShaper();

		this.makeFm(this.carrierFrequency, this.modulatorFrequency, this.bandwidth);
		this.waveShaperGain = IS.createGain(this.modulatorGain);

		this.filter = IS.createFilter("highpass", 10, 1);

		this.input.connect(this.waveShaperGain);
		this.waveShaperGain.connect(this.waveShaper);
		this.waveShaper.connect(this.filter.input);
		this.filter.connect(this.output);
	}

	makeFm(carrierFrequency, modulatorFrequency, modulatorGain)
	{
		this.twoPi = Math.PI*2;
		this.p;
		this.v;
		this.t;
		this.carrierFrequency = carrierFrequency;
		this.modulatorFrequency = modulatorFrequency;
		this.modulatorGain = modulatorGain;

		this.nSamples = IS.sampleRate;
		this.curve = new Float32Array(this.nSamples);

		for (var i=0 ; i < this.nSamples; ++i)
		{
			this.p = i/this.nSamples;
			this.t = this.p*this.twoPi
			this.a2 = this.modulatorGain*(Math.sin(this.modulatorFrequency*this.t));
			this.v = Math.sin((this.carrierFrequency+this.a2)*this.t);
			if(Math.abs(this.v) <= 0.0001308996870648116){
				this.curve[i] = 0;
			}
			else if(Math.abs(this.v) > 0.0001308996870648116){
				this.curve[i] = this.v
			}
		}
		this.waveShaper.curve = this.curve;
	}
}