import { IS } from "../../../script.js";
import * as SineSection from "./SineSection.js";
import { Parameters } from "./parameters.js";
import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";

let networkVisualizer = IS_Visualizer.visualizer.Network;

networkVisualizer.nodeScale = 4;

networkVisualizer.showConnections = false;

networkVisualizer.xPosition = 0;
networkVisualizer.yPosition = 0;

networkVisualizer.columnSpacing = 0;
networkVisualizer.rowSpacing = 0;

IS_Visualizer.visualizer = networkVisualizer.visualize;
IS_Visualizer.rotate = true;

export let MAIN_GAIN;
let delayAmplitudeModulator;

IS.onLoad(load);

function load()
{
	initPieceParameters();

	let gain = IS.createGain(10);

	let delay = IS.createStereoDelay
	(
		IS.Random.Float(0.25, 0.7), IS.Random.Float(0.25, 0.7), 0.3
	);
	delay.gain = 0;

	let delayFilter = IS.createFilter("highpass", 200, 1);

	let delayOscillatorBuffer = IS.createBuffer(1, 1);
	delayOscillatorBuffer.unipolarNoise().add();
	delayOscillatorBuffer.constant(0.5).multiply();

	let delayAmplitudeModulator = IS.createBufferSource(delayOscillatorBuffer);
	delayAmplitudeModulator.loop = true;
	delayAmplitudeModulator.playbackRate = 0.00001;
	delayAmplitudeModulator.connect(delay.gain);

	let highpass = IS.createFilter("highpass", 20, 1);

	MAIN_GAIN = IS.createGain();

	MAIN_GAIN.connect(gain);
	MAIN_GAIN.connect(delayFilter.input);

	delayFilter.connect(delay);
	delay.connect(gain);

	gain.connect(highpass.input);
	highpass.connectToMainOutput();

	delayAmplitudeModulator.scheduleStart();
	SineSection.addSineSection(playbackRate, fund);
}

export let s1;
export let s2;
export let s3;
export let s4;
export let s5;
export let s6;
export let s7;
export let s8;
export let s9;
export let s10;

let playbackRate;
let fund;
let pieceLength;

function initPieceParameters()
{
	playbackRate = Parameters.Rate;
	fund = Parameters.Fundamental; // 432;

	let bar = 1/playbackRate;

	s1 = 0*4*bar;
	s2 = s1+(4*bar);
	s3 = s2+(4*bar);
	s4 = s3+(4*bar);
	// s5 = s4+(4*bar);

	s6 = s4+(4*bar);
	s7 = s6+(2*bar);
	s8 = s7+(2*bar);
	s9 = s8+(4*bar);
	s10 = s9+(8*bar);

	pieceLength = s10+3;
}
