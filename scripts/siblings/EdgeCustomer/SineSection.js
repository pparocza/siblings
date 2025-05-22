import { IS } from "../../../script.js";
import { MAIN_GAIN } from "./script.js";
import { s1, s2, s3, s4, s5, s6, s7, s8, s9, s10 } from "./script.js";

let m2 = 25/24;
let M2 = 9/8;
let m3 = 6/5;
let M3 = 5/4;
let P4 = 4/3;
let d5 = 45/32;
let P5 = 3/2;
let m6 = 8/5;
let M6 = 5/3;
let m7 = 9/5;
let M7 = 15/8;

export function addSineSection(playbackRate, fund)
{
	let pArray = [P5, M3, P4, M6, 2, M2*2, M3*2, P4*2];

	for(let i= 0; i < 4; i++)
	{
		addSine3
		(
			s1 + i +IS.Random.Float(0.5, 1),  s6 + 1,
			fund * 4, pArray, playbackRate,
			0.125
		);

		addSine
		(
			s2 + i + IS.Random.Float(0.5, 1), s6 + 1,
			fund * 2, pArray, playbackRate,
			0.175
		);

		addSine2
		(
			s3 + i + IS.Random.Float(0.5, 1),  s6 + 1,
			fund,   pArray, playbackRate,
			0.15
		);

		addSine3
		(
			s4 + i + IS.Random.Float(0.5, 1),  s6 + 1,
			fund * 4, pArray, playbackRate * 2,
			0.03125 * 0.5
		);

		addSine3
		(
			s4 + i + IS.Random.Float(0.5, 1),  s6 + 1,
			fund * 1, pArray, playbackRate * 8,
			0.03125 * 0.5
		);
	}

	for(let i= 0; i < 4; i++)
	{
		addSine3
		(
			s6 + i + IS.Random.Float(0.5, 1), s10 + 1,
			fund * 4, pArray, playbackRate,
			0.125
		);

		addSine
		(
			s7 + i + IS.Random.Float(0.5, 1), s10 + 1,
			fund * 2, pArray, playbackRate,
			0.175
		);

		addSine3
		(
			s8 + i + IS.Random.Float(0.5, 1), s10 + 1,
			fund * 4, pArray, playbackRate * 2,
			0.0625
		);

		addSine3
		(
			s8 + i + IS.Random.Float(0.5, 1), s10 + 1,
			fund * 1, pArray, playbackRate * 4,
			0.0625
		);

		addSine2
		(
			s9 + i + IS.Random.Float(0.5, 1), s10 + 1,
			fund,   pArray, playbackRate,
			0.2
		);
	}
}

function addSine(startTime, stopTime, fund, pArray, playbackRate, gainVal)
{
	let output = IS.createGain(gainVal);

	let bufferPeakPercent = IS.Random.Float(0.45, 0.55);

	let buffer = IS.createBuffer(1, 1);

	buffer.sine(fund).add();
	buffer.ramp
	(
		0, 1,
		bufferPeakPercent, bufferPeakPercent,
		IS.Random.Float(0.9, 1.1), IS.Random.Float(0.9, 1.1)
	).multiply();

	for(let i=0; i < 3; i++)
	{
		let rampPeakPercent = IS.Random.Float(0.1, 0.9);

		buffer.suspendOperations();

			buffer.sine
			(
				fund * IS.Random.Select(...pArray) * IS.Random.Select(1, 2),
			).add();

			buffer.constant(IS.Random.Float(0.3, 1)).multiply();

			buffer.ramp
			(
				0, 1,
				rampPeakPercent, rampPeakPercent,
				IS.Random.Float(0.1, 2), IS.Random.Float(0.1, 4)
			).multiply();

		buffer.applySuspendedOperations().add();

		rampPeakPercent = IS.Random.Float(0.1, 0.9);

		buffer.suspendOperations();
			
			buffer.sine
			(
				fund * IS.Random.Select(...pArray) * IS.Random.Select(1, 2) + IS.Random.Float(1, 10)
			).add();

			buffer.constant(IS.Random.Float(0.3, 1)).multiply();

			buffer.ramp
			(
				0, 1,
				rampPeakPercent, rampPeakPercent,
				IS.Random.Float(0.1, 2), IS.Random.Float(0.1, 4)
			).multiply();

		buffer.applySuspendedOperations().add();
	}

	buffer.normalize();

	let bufferRampPeakPercent = IS.Random.Float(0.45, 0.55);

	buffer.ramp
	(
		0, 1,
		bufferRampPeakPercent, bufferRampPeakPercent,
		IS.Random.Float(0.7, 0.9), IS.Random.Float(2, 3)
	).multiply();

	let amplitudeModulationBuffer = IS.createBuffer(1, 1);
	amplitudeModulationBuffer.amplitudeModulatedSine
	(
		IS.Random.Float(0.1, 0.2), IS.Random.Float(0.1, 3), 1
	).add();

	let rampPeakPercent = IS.Random.Float(0.3, 0.6);

	amplitudeModulationBuffer.ramp
	(
		0, 1,
		rampPeakPercent, rampPeakPercent,
		IS.Random.Float(0.9, 1.5), IS.Random.Float(0.9, 1.5)
	).multiply();

	let amplitudeModulator = IS.createBufferSource(amplitudeModulationBuffer);
	amplitudeModulator.playbackRate = IS.Random.Float(0.5, 3);
	amplitudeModulator.loop = true;

	let amplitudeModulationGain = IS.createGain(0);

	let delay = IS.createStereoDelay
	(
		IS.Random.Float(0.35, 0.6), IS.Random.Float(0.35, 0.6), IS.Random.Float(0, 0.2), 1
	);
	delay.gain = 0.25;

	let bufferSource = IS.createBufferSource(buffer);
	bufferSource.playbackRate = playbackRate;
	bufferSource.loop = true;

	bufferSource.connect(amplitudeModulationGain); amplitudeModulator.connect(amplitudeModulationGain.gain);

	amplitudeModulationGain.connect(delay);

	amplitudeModulationGain.connect(output);
	delay.connect(output);

	output.connect(MAIN_GAIN);

	bufferSource.scheduleStart(startTime);
	amplitudeModulator.scheduleStart(startTime);

	bufferSource.scheduleStop(stopTime);
	amplitudeModulator.scheduleStop(stopTime);
}

function addSine2(startTime, stopTime, fund, pArray, playbackRate, gainVal)
{
	let output = IS.createGain(gainVal);

	let bufferPeakPercent = IS.Random.Float(0.45, 0.55);

	let buffer = IS.createBuffer(1, 1);

	buffer.sine(fund).add();
	buffer.ramp
	(
		0, 1,
		bufferPeakPercent, bufferPeakPercent,
		IS.Random.Float(0.9, 1.1), IS.Random.Float(0.9, 1.1)
	).multiply();

	for(let i= 0; i < 3; i++)
	{
		let rampPeakPercent = IS.Random.Float(0.1, 0.9);

		buffer.suspendOperations();

			buffer.sine
			(
				fund * IS.Random.Select(...pArray) * IS.Random.Select(1, 2, 2, 4)
			).add();

			buffer.constant(IS.Random.Float(0.3, 1)).multiply();

			buffer.ramp
			(
				0, 1,
				rampPeakPercent, rampPeakPercent,
				IS.Random.Float(0.1, 2), IS.Random.Float(0.1, 4)
			).multiply();

		buffer.applySuspendedOperations().add();

		rampPeakPercent = IS.Random.Float(0.1, 0.9);

		buffer.suspendOperations();

			buffer.sine
			(
				fund * IS.Random.Select(...pArray) * IS.Random.Select(1, 2, 2, 4) + IS.Random.Float(1, 10)
			).add();

			buffer.constant(IS.Random.Float(0.3, 1)).multiply();

			buffer.ramp
			(
				0, 1,
				rampPeakPercent, rampPeakPercent,
				IS.Random.Float(0.1, 2), IS.Random.Float(0.1, 4)
			).multiply();

		buffer.applySuspendedOperations().add();
	}

	let bufferRampPeakPercent = IS.Random.Float(0.45, 0.55);

	buffer.normalize();
	buffer.ramp
	(
		0, 1,
		bufferRampPeakPercent, bufferRampPeakPercent,
		IS.Random.Float(0.7, 0.9), IS.Random.Float(2, 3)
	).multiply();

	let amplitudeModulatorPeakPercent = IS.Random.Float(0.3, 0.6);

	let amplitudeModulationBuffer = IS.createBuffer(1, 1);

	amplitudeModulationBuffer.amplitudeModulatedSine
	(
		IS.Random.Float(0.1, 0.2), IS.Random.Float(0.1, 3), 1
	).add();

	amplitudeModulationBuffer.ramp
	(
		0, 1,
		amplitudeModulatorPeakPercent, amplitudeModulatorPeakPercent,
		IS.Random.Float(0.9, 1.5), IS.Random.Float(0.9, 1.5)
	).multiply();

	let amplitudeModulator = IS.createBufferSource(amplitudeModulationBuffer);
	amplitudeModulator.playbackRate = IS.Random.Float(0.1, 0.25);
	amplitudeModulator.loop = true;

	let amplitudeModulationGain = IS.createGain(0);

	let delay = IS.createStereoDelay
	(
		IS.Random.Float(0.35, 0.6), IS.Random.Float(0.35, 0.6), IS.Random.Float(0, 0.2), 1
	);
	delay.gain = 0.25;

	let filter = IS.createFilter("lowshelf", 500, 1);
	filter.gain = -6;

	let bufferSource = IS.createBufferSource(buffer);
	bufferSource.playbackRate = playbackRate;
	bufferSource.loop = true;

	bufferSource.connect(amplitudeModulationGain); amplitudeModulator.connect(amplitudeModulationGain.gain);

	amplitudeModulationGain.connect(delay);

	amplitudeModulationGain.connect(output);
	delay.connect(output);

	output.connect(filter);
	filter.connect(MAIN_GAIN);

	bufferSource.scheduleStart(startTime);
	amplitudeModulator.scheduleStart(startTime);

	bufferSource.scheduleStop(stopTime);
	amplitudeModulator.scheduleStop(stopTime);
}

function addSine3(startTime, stopTime, fund, pArray, playbackRate, gainVal)
{
	let output = IS.createGain(gainVal);

	let buffer = IS.createBuffer(1, 1);
	buffer.sine(fund).add();

	for(let i= 0; i < 3; i++)
	{
		let peakPercent = IS.Random.Float(0.05, 0.1);

		buffer.suspendOperations();

			buffer.sine(fund * IS.Random.Select(...pArray)).add();
			buffer.constant(IS.Random.Float(0.3, 1)).multiply();
			buffer.ramp
			(
				0, 1,
				peakPercent, peakPercent,
				IS.Random.Float(0.01, 0.1), IS.Random.Float(4, 10)
			).multiply();

		buffer.applySuspendedOperations().add();

		peakPercent = IS.Random.Float(0.05, 0.1);

		buffer.suspendOperations();

			buffer.sine(fund * IS.Random.Select(...pArray) + IS.Random.Float(1, 10)).add();
			buffer.constant(IS.Random.Float(0.3, 1)).multiply();
			buffer.ramp
			(
				0, 1,
				peakPercent, peakPercent,
				IS.Random.Float(0.01, 0.1), IS.Random.Float(4, 10)
			).multiply();

		buffer.applySuspendedOperations().add();
	}

	buffer.normalize();

	let amplitudeModulationBuffer = IS.createBuffer(1, 1);
	amplitudeModulationBuffer.amplitudeModulatedSine
	(
		IS.Random.Float(0.1, 0.2), IS.Random.Float(0.1, 3), 1
	).add();

	let rampPeakPercent = IS.Random.Float(0.3, 0.6);

	amplitudeModulationBuffer.ramp
	(
		0, 1,
		rampPeakPercent, rampPeakPercent,
		IS.Random.Float(0.9, 1.5), IS.Random.Float(0.9, 1.5)
	).multiply();

	let amplitudeModulator = IS.createBufferSource(amplitudeModulationBuffer);
	amplitudeModulator.playbackRate = IS.Random.Float(0.5, 3);
	amplitudeModulator.loop = true;

	let amplitudeModulationGain = IS.createGain(0);

	let delay = IS.createStereoDelay
	(
		IS.Random.Float(0.35, 0.6), IS.Random.Float(0.35, 0.6), IS.Random.Float(0, 0.2), 1
	);
	delay.gain = 0.25;

	let bufferSource = IS.createBufferSource(buffer);
	bufferSource.playbackRate = playbackRate;
	bufferSource.loop = true;

	bufferSource.connect(amplitudeModulationGain); amplitudeModulator.connect(amplitudeModulationGain.gain);

	amplitudeModulationGain.connect(delay);

	amplitudeModulationGain.connect(output);
	delay.connect(output);

	output.connect(MAIN_GAIN);

	bufferSource.scheduleStart(startTime);
	amplitudeModulator.scheduleStart(startTime);

	bufferSource.scheduleStop(stopTime);
	amplitudeModulator.scheduleStop(stopTime);
}

