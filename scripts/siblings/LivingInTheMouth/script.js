import { IS } from "../../../script.js";
import { Piece } from "./sections.js";

IS.onLoad(runPatch);

function runPatch()
{
	const gain = IS.createGain();
	gain.gain = 1;

	const convolverBuffer = IS.createBuffer(2, 3);
	convolverBuffer.noise().add();
	convolverBuffer.ramp
	(
		0, 1, 0.01, 0.015, 0.5, 4
	).multiply();

	const convolver = IS.createConvolver(convolverBuffer);
	convolver.gain = 0.0625;

	const delayLength = IS.Random.Float(0.25, 0.4);
	let delay = IS.createStereoDelay
	(
		delayLength * 2, delayLength, 0.2, 1
	);
	delay.gain = 0.0625;

	const highpass = IS.createFilter("highpass" , 10 , 1 );
	const lowpass = IS.createFilter("lowpass" , 20000, 1 );

	IS.output.connect(convolver.input);
	IS.output.connect(delay.input);

	IS.output.connect(gain.input);
	convolver.connect(gain);
	delay.connect(gain);

	gain.connect(highpass.input);
	highpass.connect(lowpass);

	lowpass.connectToAudioDestination();

	const piece = new Piece();
	piece.start();
}
