import { IS } from "../../../script.js";

export class PitchedPresets
{
	constructor()
	{
		this.input = IS.createGain();
		this.output = IS.createGain();
		this.startArray = [];
	}

	// instrument preset template
	instrumentMethod()
	{
		this.startArray = [];
	};

	// preset 1
	pitch1(fund)
	{
		this.duration = 2;

		this.fund = fund;
		this.rate = 0.5;
		this.cFA = [1];
		this.mFA = [2];
		this.gVA = [1];
		this.mGA = [1];
		this.pPA = [0.0001];
		this.uEA = [0.1];
		this.dEA = [8];

		let buffer = IS.createBuffer(1, 1);
		let bufferSource = IS.createBufferSource();
		bufferSource.playbackRate = this.rate;

		for(let i= 0; i < this.cFA.length; i++)
		{
			buffer.suspendOperations();

				buffer.frequencyModulatedSine
				(
					this.fund * this.cFA[i],
					this.fund*this.mFA[i],
					this.gVA[i]
				).add();

				buffer.ramp
				(
					0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]
				).multiply();

				buffer.constant(this.mGA[i]).multiply();

			buffer.applySuspendedOperations().add();
		}

		buffer.constant(1 / this.cFA.length).multiply();

		bufferSource.connect(this.output);

		this.b1Buffer = buffer;
		this.b1 = bufferSource;
		this.startArray = [this.b1];

	};

	// preset 3
	pitch3(fund)
	{
		this.duration = 2;

		this.fund = fund;
		this.rate = 0.5;
		this.cFA = [1, 1, 5];
		this.mFA = [2, 3, 7];
		this.gVA = [1, 1, 0.5];
		this.mGA = [0.5, 1, 0.5];
		this.pPA = [0.5, 0.6, 0.7];
		this.uEA = [1, 2, 4];
		this.dEA = [1.1, 2.1, 1.7];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];
	};

	// preset 7 (pad)
	pitch7(fund)
	{
		this.duration = 8;

		this.fund = fund;
		this.rate = 0.125;
		this.cFA = [1, 3, 5, 4];
		this.mFA = [1, 3, 5, 4];
		this.gVA = [0.3, 0.3, 0.3, 0.3];
		this.mGA = [1, 1, 1, 1];
		this.pPA = [0.5, 0.5, 0.5, 0.5];
		this.uEA = [1, 1, 1, 1];
		this.dEA = [1, 1, 1, 1];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.f = new MyBiquad("lowpass", 5000, 1);

		this.b1.connect(this.f);
		this.f.connect(this.output);

		this.startArray = [this.b1];
	};

	pitch9(fund)
	{
		this.duration = 1;

		this.fund = fund;
		this.rate = 2;
		this.cFA = [1, 4.75, 6.375];
		this.mFA = [1, 9.10714286, 10.3571429];
		this.gVA = [1, 1, 1];
		this.mGA = [1, 0.025, 0.05];
		this.pPA = [0.01, 0.01, 0.01];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(let i=0; i<this.cFA.length; i++)
		{
			this.b2.makeFm(this.fund * this.cFA[i], this.fund * this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];
	};

	// preset 10 ("I" bell)
	pitch10(fund)
	{
		this.duration = 1;

		this.fund = fund;
		this.rate = 1;
		this.cFA = [1, 4.75, 6.375];
		this.mFA = [1, 4.75, 6.375];
		this.gVA = [0.25, 0.25, 0.25];
		this.mGA = [1, 1, 1];
		this.pPA = [0.01, 0.01, 0.01];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];
	};

	// preset 12 (fm horn)
	pitch12(fund)
	{
		this.duration = 1;

		this.fund = fund;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 1;

		this.b2.makeFm(this.fund, this.fund, 1*0.25);
		this.b2.applyRamp(0, 1, 0.1, 0.1, 4, 8);

		this.b1.addBuffer(this.b2.buffer);

		this.b1.connect(this.output);

		this.startArray = [this.b1];
	};

	// preset13 (cloud bowl)
	pitch13(fund)
	{
		this.duration = 1;

		this.fund = fund;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 1;

		this.b2.addSine(this.fund*4, 1);
		this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 8);
		this.b2.multiply(0.125);

		// this.b1.addBuffer(this.b2.buffer);

		this.b2.addSine(this.fund*8, 1);
		this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 8);
		this.b2.multiply(0);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeFm(this.fund, this.fund, 1*0.25);
		this.b2.applyRamp(0, 1, 0.01, 0.01, 4, 8);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeAm(this.fund*1, 10, 1);
		this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 16);
		this.b2.multiply(0.125);

		this.b1.addBuffer(this.b2.buffer);

		this.b1.connect(this.output);

		this.startArray = [this.b1];
	};

	// preset 20 (am chord)
	pitch20(fund)
	{
		this.duration = 1;

		this.fund = fund;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = this.rate;

		this.iArray = [1, 2, 4];

		for(var i=0; i<this.iArray.length; i++){
			this.b1.addSine(this.fund*this.iArray[i], 1);
		}

		for(var i=0; i<this.iArray.length; i++){
			this.b2.addSine(this.fund*this.iArray[i]*randomFloat(0.99, 1.01), 1);
		}

		this.b1.subtractBuffer(this.b2.buffer);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];
	};

	// preset 23
	pitch23(fund)
	{
		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = fund;

		this.intA = [1, 1.5];
		this.nHA =  [1, 4];

		for(var i=0; i<this.intA.length; i++){

			for(var j=0; j<this.nHA[i]+1; j++){

				this.b1.addSine(this.fund*(this.intA[i]*j), 1/j);

			}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];
	};

	// preset 27 (warm pad 2)
	pitch27(fund)
	{
		this.duration = 4;

		this.rate = 0.25;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = fund;

		this.intA = [1, 1.5];
		this.nHA =  [3, 5];
		this.gA =   [1, 1];

		for(let i=0; i<this.intA.length; i++)
		{
			for(let j=0; j<this.nHA[i]+1; j++)
			{
				this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
				this.b1.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);
			}
		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];
	};

	// start instrument immediately
	start()
	{
		for(let i=0; i < this.startArray.length; i++)
		{
			this.startArray[i].start();
		}
	};

	// stop instrument immediately
	stop()
	{
		for(let i=0; i < this.startArray.length; i++)
		{
			this.startArray[i].stop();
		}
	};

	// start instrument at specified time (in seconds)
	startAtTime(time)
	{
		this.time = time;

		for(let i=0; i < this.startArray.length; i++)
		{
			this.startArray[i].scheduleStart(this.time);
		}
	};

	// stop instrument at specified time (in seconds)
	stopAtTime(time)
	{
		this.time = time;

		for(let i= 0; i < this.startArray.length; i++)
		{
			this.startArray[i].scheduleStop(this.time);
		}
	};

	// connect the output node of this object to the input of another
	connect(audioNode)
	{
		if (audioNode.hasOwnProperty('input'))
		{
			this.output.connect(audioNode.input);
		}
		else
		{
			this.output.connect(audioNode);
		}
	};
}