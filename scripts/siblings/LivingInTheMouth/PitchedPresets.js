import { IS } from "../../../script.js";

export class PitchedPresets
{
	constructor()
	{
		this.input = IS.createGain();
		this.output = IS.createGain();
		this.startArray = [];
	}

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

		this.b1 = IS.createBuffer(1, 1);

		for(var i= 0; i < this.cFA.length; i++)
		{
			this.b1.suspendOperations();

				this.b1.frequencyModulatedSine
				(
					this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]
				).add();

				this.b1.ramp
				(
					0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]
				).multiply();

				this.b1.constant(this.mGA[i]).multiply();

			this.b1.applySuspendedOperations().add();
		}

		this.b1.normalize();
	}

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

		this.b1 = IS.createBuffer(1, 1);

		for(var i= 0; i < this.cFA.length; i++)
		{
			this.b1.suspendOperations();

				this.b1.frequencyModulatedSine
				(
					this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]
				).add();

				this.b1.ramp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]).multiply();

				this.b1.constant(this.mGA[i]).multiply();

			this.b1.applySuspendedOperations().add();
		}

		this.b1.normalize();
	}

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

		this.b1 = IS.createBuffer(1, 1);

		for(var i= 0; i < this.cFA.length; i++)
		{
			this.b1.suspendOperations();

				this.b1.frequencyModulatedSine
				(
					this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]
				).add();

				this.b1.ramp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]).multiply();

				this.b1.constant(this.mGA[i]).multiply();

			this.b1.applySuspendedOperations().add();
		}

		this.b1.normalize();
	}

	// preset 9 (short key)
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

		this.b1 = IS.createBuffer(1, 1);

		for(var i= 0; i < this.cFA.length; i++)
		{
			this.b1.suspendOperations();

				this.b1.frequencyModulatedSine
				(
					this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]
				).add();

				this.b1.ramp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]).multiply();

				this.b1.constant(this.mGA[i]).multiply();

			this.b1.applySuspendedOperations().add();
		}

		this.b1.normalize();
	}

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

		this.b1 = IS.createBuffer(1, 1);

		for(let i= 0; i < this.cFA.length; i++)
		{
			this.b1.applySuspendedOperations();

				this.b1.frequencyModulatedSine
				(
					this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]
				).add();

				this.b1.ramp
				(
					0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]
				).multiply();

				this.b1.constant(this.mGA[i]).multiply();

			this.b1.applySuspendedOperations().add();
		}

		this.b1.normalize();
	}

	// preset 12 (fm horn)
	pitch12(fund)
	{
		this.duration = 1;

		this.fund = fund;

		this.b1 = IS.createBuffer(1, 1);

		this.b1.frequencyModulatedSine(this.fund, this.fund, 1 * 0.25).add();
		this.b1.ramp(0, 1, 0.1, 0.1, 4, 8).multiply();
	}

	// preset13 (cloud bowl)
	pitch13(fund)
	{
		this.duration = 1;

		this.fund = fund;

		this.b1 = IS.createBuffer(1, 1);

		this.b1.suspendOperations();

			this.b1.frequencyModulatedSine(this.fund, this.fund, 1 * 0.25).add();
			this.b1.ramp(0, 1, 0.01, 0.01, 4, 8).multiply();

		this.b1.applySuspendedOperations().add();

		this.b1.suspendOperations();

			this.b1.amplitudeModulatedSine
			(
				this.fund * 1, 10, 1
			).add();
			this.b1.ramp(0, 1, 0.01, 0.01, 0.1, 16).multiply();
			this.b1.constant(0.125).multiply();

		this.b1.applySuspendedOperations().add();
	}

	// preset 20 (am chord)
	pitch20(fund)
	{
		this.fund = fund;

		this.b1 = IS.createBuffer(1, 1);

		this.octaveArray = [1, 2, 4];

		for(let octaveIndex= 0; octaveIndex < this.octaveArray.length; octaveIndex++)
		{
			this.b1.sine(this.fund * this.octaveArray[octaveIndex], 1).add();
		}

		for(let octaveIndex= 0; octaveIndex < this.octaveArray.length; octaveIndex++)
		{
			this.b1.sine(this.fund * this.octaveArray[octaveIndex] * IS.Random.Float(0.99, 1.01), 1).subtract();
		}

		this.b1.ramp(0, 1, 0.5, 0.5, 1, 1).multiply();

		this.b1.normalize();
	}

	// preset 23
	pitch23(fund)
	{
		this.b1 = IS.createBuffer(1, 1);

		this.fund = fund;

		this.intervalArray = [1, 1.5];
		this.nHarmonicsArray =  [1, 4];

		for(let intervalIndex= 0; intervalIndex < this.intervalArray.length; intervalIndex++)
		{
			for(let harmonicIndex= 0; harmonicIndex < this.nHarmonicsArray[intervalIndex] + 1; harmonicIndex++)
			{
				this.b1.suspendOperations();

					this.b1.sine
					(
						this.fund * this.intervalArray[intervalIndex] * harmonicIndex
					).add();

					this.b1.constant(1 / (harmonicIndex + 1)).multiply();

				this.b1.applySuspendedOperations().add();
			}
		}

		this.b1.normalize();
		this.b1.ramp(0, 1, 0.01, 0.02, 0.1, 1).multiply();
	}

	// preset 27 (warm pad 2)
	pitch27(fund)
	{
		this.duration = 4;

		this.rate = 0.25;

		this.b1 = IS.createBuffer(1, 1);
		this.b1.playbackRate = this.rate;

		this.fund = fund;

		this.intervalArray = [1, 1.5];
		this.nHarmonicsArray =  [3, 5];

		for(let intervalIndex= 0; intervalIndex < this.intervalArray.length; intervalIndex++)
		{
			for(let harmonicIndex= 0; harmonicIndex < this.nHarmonicsArray[intervalIndex] + 1; harmonicIndex++)
			{
				this.b1.suspendOperations();

					this.b1.sine
					(
						this.fund * this.intervalArray[intervalIndex] * harmonicIndex
					).add();

					this.b1.constant(1 / (harmonicIndex + 1)).multiply();

				this.b1.applySuspendedOperations().add();

				this.b1.suspendOperations();

					this.b1.sine
					(
						this.fund * this.intervalArray[intervalIndex] * harmonicIndex * IS.Random.Float(0.99, 1.01)
					).add();

					this.b1.constant(1 / (harmonicIndex + 1)).multiply();

				this.b1.applySuspendedOperations().add();
			}
		}

		this.b1.normalize();
		this.b1.ramp(0, 1, 0.5, 0.5, 1, 1).multiply();
	}
}