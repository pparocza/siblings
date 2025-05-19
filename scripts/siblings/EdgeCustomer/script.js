import { IS } from "../../../script.js";

let masterGain;
let fadeFilter;
let dB;

IS.onLoad(load);

function load()
{
	var gain = audioCtx.createGain();
	gain.gain.value = 5;

	var d = new Effect();
	d.stereoDelay(randomFloat(0.25, 0.7), randomFloat(0.25, 0.7), 0.3);
	d.on();
	d.output.gain.value = 0;

	var dF = new MyBiquad("highpass", 200, 1);

	dB = new LFO(0, 0.5, 0.00001);
	dB.buffer.makeNoise();
	dB.connect(d.output.gain);

	var f = new MyBiquad("highpass", 20, 1);

	var dG = new MyGain(0);

	fadeFilter = new FilterFade(0);

	masterGain = audioCtx.createGain();
	masterGain.gain.value = 0;

	masterGain.connect(gain);
	masterGain.connect(dF.input);

	dF.connect(d);
	d.connect(gain);

	gain.connect(f.input);
	f.connect(fadeFilter);
	fadeFilter.connect(audioCtx.destination);

	dB.start();
	addSineSection(playbackRate, fund);
}
