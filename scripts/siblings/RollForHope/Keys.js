import { IS } from "../../../script.js";
import { Parameters } from "./Parameters.js";
import { BufferPresets } from "../../presets/BufferPresets.js";
import { ConvolverVoice } from "./ConvolverVoice.js";
import { OutputBus } from "./OutputBus.js";

export function Keys(nLayers, fundamental, chord)
{
	let possibleDurations = [1, 1.5, 2, 3, 1.33, 1.7];
	let density = Parameters.Structure.Keys.Density;

	let sectionStartTimes = Parameters.Structure.SectionStartTime.Keys;

	let startTimes =
	[
		sectionStartTimes.One,
		sectionStartTimes.Two + 15
	];

	let timeLimits =
	[
		sectionStartTimes.Two,
		sectionStartTimes.Three
	];

	for (let sectionIndex = 0; sectionIndex < startTimes.length; sectionIndex++)
	{
		let startTime = startTimes[sectionIndex];
		let timeLimit = timeLimits[sectionIndex];

		for(let i = 0; i < 10; i++)
		{
			let fmKeyBuffer = BufferPresets.randomFMKey(IS, fundamental);
			let fmKeyBufferSource = IS.createBufferSource(fmKeyBuffer);
			fmKeyBufferSource.playbackRate = IS.array(1, 2, 0.25, 0.5, 4, 8).random();

			fmKeyBufferSource.volume = -3;

			let convolution = IS.createConvolver
			(
				new ConvolverVoice(IS, nLayers, fundamental, chord)
			);

			let keyFilter = IS.createFilter("lowshelf", 500, 1, -8);

			let panValue = i % 2 === 0 ? IS.Random.Float(0.6, 1) : -1 * IS.Random.Float(0.6, 1);
			let convolutionPanner = IS.createStereoPanner(panValue);
			IS.connect.series(fmKeyBufferSource, convolution, keyFilter, convolutionPanner, OutputBus.KeyOutput);
			keyFilter.connect(OutputBus.Delay, OutputBus.Reverb);
			convolutionPanner.connectToMainOutput();

			let sequence = IS.sequenceArray()
			sequence.timeSequence
			(
				possibleDurations, startTime, i === 0,
				0.133, 0.001, density, timeLimit
			);

			for(let sequenceIndex = 0; sequenceIndex < sequence.length; sequenceIndex++)
			{
				fmKeyBufferSource.scheduleStart(sequence.value[sequenceIndex]);
			}
		}
	}
}