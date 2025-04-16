import { IS } from "../../../script.js";
import { OscillatingStereoReverb } from "./OscillatingStereoReverb.js";
import { FMSynth } from "./FMSynth.js";

import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";
IS.onReady(IS_Visualizer.visualize);

IS.onLoad(roseSequence);

function roseSequence()
{
	let fundamental = IS.Random.Float(160, 180) * 0.6;
	const possibleChordLengths = IS.array(20);
	// const chordOverlap = 0;

	const mode = IS.array
	(
		IS.Utility.Mode.Minor
	).random();

	let reverb = new OscillatingStereoReverb(3);
	reverb.connect(IS.output);
	reverb.schedule(0);
	reverb.gain = 0.25;

	let reverbFilter = IS.createFilter("highpass", 500, 1);

	reverb.connect(reverbFilter);
	reverbFilter.connectToMainOutput();

	const possibleScaleDegrees = IS.array(1, 4, 5, 6, 1);
	const nChords = possibleScaleDegrees.length;
	const densityMinimum = 0.6;

	let previousStop = 0;

	for(let chordIndex = 0; chordIndex < nChords; chordIndex++)
	{
		let lastChord = chordIndex === nChords - 1;
		let chordOverlap = IS.Random.Float(2, 6);

		// TODO: IS_Random Object, so that you can specify random parameters that are held in a variable, and then call
		//  that variable -> randomLengthValue = IS.Random.Float(20, 30) -> randomLengthValue.next;
		let chordLength = lastChord ? 5 : IS.Random.Float(20, 30);
		let startTime = previousStop > 0 ? previousStop - chordOverlap : 0;
		let stopTime = startTime + chordLength;

		let nNotes = lastChord ? 1 : IS.Random.Float(3, 5);
		let inversion =  lastChord ? 0 : IS.Random.Int(0, 2);

		fundamental *= lastChord ? 0.5 : 1;

		theRose
		(
			startTime,
			stopTime,
			fundamental,
			IS.ratioScale(mode).chord
			(
				possibleScaleDegrees.value[chordIndex % possibleScaleDegrees.length],
				inversion,
				nNotes,
				3
			),
			densityMinimum + (chordIndex / nChords),
			reverb
		)

		previousStop = stopTime;
	}
}

function theRose(startTime, endTime, chordFundamental, chord, density, reverb)
{
	let synthBufferSource = new FMSynth(chordFundamental, chord);
	let synthBufferSource2 = new FMSynth(chordFundamental, chord);

	// TODO: Probability table
	let octaves = IS.array(4, 2, 1, 0.5, 0.25);

	for (let timeIndex = 0; timeIndex < 40; timeIndex++)
	{
		let start = timeIndex + startTime;
		let startInterval = timeIndex + IS.Random.Float(0, 3) + start;

		if (timeIndex !== 0 && !IS.Random.CoinToss(density))
		{
			continue;
		}

		if (start >= endTime)
		{
			break;
		}

		let octave1 = octaves.random();
		let octave2 = octaves.random();

		let note1 = chord.random() * octave1;
		let note2 = chord.random() * octave2;

		let rate1Time = IS.Random.Float(start, startInterval);
		let rate2Time = IS.Random.Float(start, startInterval);

		let gain1 = octave1 >= 1 ? 1 / 0.6 : 1;
		let gain2 = octave2 >= 1 ? 1 / 0.6 : 1;

		synthBufferSource.scheduleStart(IS.Random.Float(start, startInterval));
		synthBufferSource2.scheduleStart(IS.Random.Float(start, startInterval));

		synthBufferSource.scheduleRate(note1, rate1Time);
		synthBufferSource2.scheduleRate(note2, rate2Time);

		synthBufferSource.schedulePan(IS.Random.Float(-1, 1), IS.Random.Float(start, startInterval), 0.01);
		synthBufferSource2.schedulePan(IS.Random.Float(-1, 1), IS.Random.Float(start, startInterval), 0.01);

		synthBufferSource.output.gain.scheduleValue(gain1, rate1Time, 0.01);
		synthBufferSource2.output.gain.scheduleValue(gain2, rate2Time, 0.01);

		if (IS.Random.CoinToss(0.33))
		{
			let octave1 = octaves.random();
			let octave2 = octaves.random();

			let note1 = chord.random() * octave1;
			let note2 = chord.random() * octave2;

			let rate1Time = IS.Random.Float(start, startInterval);
			let rate2Time = IS.Random.Float(start, startInterval);

			let gain1 = octave1 >= 1 ? 0.6 : 1;
			let gain2 = octave1 >= 1 ? 0.6 : 1;

			let transitionTime = IS.Random.CoinToss() ? null : IS.Random.Float(0.02, 0.05);

			synthBufferSource.scheduleRate(note1, rate1Time, transitionTime);
			synthBufferSource2.scheduleRate(note2, rate2Time, transitionTime);

			synthBufferSource.output.gain.scheduleValue(gain1, rate1Time, 0.01);
			synthBufferSource2.output.gain.scheduleValue(gain2, rate2Time, 0.01);

			if (IS.Random.CoinToss())
			{
				let octave1 = octaves.random();
				let octave2 = octaves.random();

				let note1 = chord.random() * octave1;
				let note2 = chord.random() * octave2;

				let rate1Time = IS.Random.Float(start, startInterval);
				let rate2Time = IS.Random.Float(start, startInterval);

				let gain1 = octave1 >= 1 ? 0.6 : 1;
				let gain2 = octave1 >= 1 ? 0.6 : 1;

				let transitionTime = IS.Random.CoinToss() ? null : IS.Random.Float(0.01, 0.05);

				synthBufferSource.scheduleRate(note1, rate1Time, transitionTime);
				synthBufferSource2.scheduleRate(note2, rate2Time, transitionTime);

				synthBufferSource.output.gain.scheduleValue(gain1, rate1Time, 0.01);
				synthBufferSource2.output.gain.scheduleValue(gain2, rate2Time, 0.01);
			}

			synthBufferSource.schedulePan(IS.Random.Float(-1, 1), IS.Random.Float(start, startInterval), IS.Random.Float(0.1, 0.2));
			synthBufferSource2.schedulePan(IS.Random.Float(-1, 1), IS.Random.Float(start, startInterval), IS.Random.Float(0.1, 0.2));
		}
	}

	let output = IS.createFilter("lowshelf", 500, 1, -8)

	output.connectToMainOutput();

	IS.connect.series(synthBufferSource, output);
	IS.connect.series(synthBufferSource2, output);

	IS.connect.series(synthBufferSource, reverb.input);
	IS.connect.series(synthBufferSource2, reverb.input);
}

