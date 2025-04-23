import { IS } from "../../../script.js";
import { Parameters } from "./Parameters.js";
import { OutputBus } from "./OutputBus.js";
import { Memory } from "./Memory.js";

export function Grid(fundamental, chord)
{
	let sectionStartTimes = Parameters.Structure.SectionStartTime.Grid;
	let speeds = Parameters.Structure.Grid.Speed;

	let possibleDurations = Parameters.Structure.Grid.PossibleDurations;
	let possibleOctaves = Parameters.Structure.Grid.PossibleOctaves;
	let nVoices = Parameters.Structure.Grid.nVoices;
	let densities = Parameters.Structure.Grid.Density;
	let densityRamps = Parameters.Structure.Grid.DensityRamp;

	pitchedSections
	(
		sectionStartTimes, speeds, possibleDurations,
		nVoices,
		fundamental, chord, possibleOctaves,
		densities, densityRamps
	);

	percussionSections
	(
		sectionStartTimes, speeds, possibleDurations,
		nVoices,
		fundamental, chord, possibleOctaves,
		densities, densityRamps
	);
}

function pitchedSections
(
	sectionStartTimes, speeds, possibleDurations,
	nVoices,
	fundamental, chord, possibleOctaves,
	densities, densityRamps
)
{

	gridSection
	(
		sectionStartTimes.One, sectionStartTimes.Two,
		speeds.One, possibleDurations.One,
		nVoices,
		fundamental, chord, possibleOctaves.One,
		densities.One, densityRamps.One, true, true, false
	);

	gridSection
	(
		sectionStartTimes.Two, sectionStartTimes.Three,
		speeds.Two, possibleDurations.Two,
		nVoices,
		fundamental, chord, possibleOctaves.Two,
		densities.Two, densityRamps.Two, false, true, true
	);

	gridSection
	(
		sectionStartTimes.Three, sectionStartTimes.Four,
		speeds.Three, possibleDurations.Three,
		nVoices,
		fundamental, chord, possibleOctaves.Three,
		densities.Three, densityRamps.Three, true, true, false
	);
}

function percussionSections
(
	sectionStartTimes, speeds, possibleDurations,
	nVoices,
	fundamental, chord, possibleOctaves,
	densities, densityRamps
)
{
	gridSection
	(
		sectionStartTimes.One, sectionStartTimes.Two,
		speeds.One, possibleDurations.One,
		nVoices,
		fundamental, chord, possibleOctaves.One,
		densities.One, densityRamps.Zero, true, false, false
	);

	gridSection
	(
		sectionStartTimes.Two, sectionStartTimes.Three,
		speeds.One, possibleDurations.One,
		nVoices,
		fundamental, chord, possibleOctaves.Two,
		densities.One, densityRamps.Zero, false, false, false
	);
}

function gridSection
(
	startTime, timeLimit, speed, possibleDurations,
	nVoices,
	fundamental, chord, possibleOctaves,
	density, densityRamp,
	playAtStart,
	pitched, referenceMemory
)
{
	for(let voice = 0; voice < nVoices; voice++)
	{
		let octave = possibleOctaves.random();

		// Create Buffer
		let fmKeyBuffer = IS.createBuffer(1, 1);
		fmKeyBuffer.sine(fundamental * chord.random() * octave).add();
		fmKeyBuffer.inverseSawtooth(IS.Random.Float(3, 8)).multiply();

		let fmKeyBufferSource = IS.createBufferSource(fmKeyBuffer);

		// TODO: pan "width" - .4 means panned within -0.2 to 0.2, -0.4 means [-1.0:-0.4]/[0.4-1.0]
		let panValue = voice % 2 === 0 ? IS.Random.Float(0.6, 1) : -1 * IS.Random.Float(0.6, 1);
		let panner = IS.createStereoPanner(panValue);

		IS.connect.series(fmKeyBufferSource, panner, OutputBus.GridOutput);

		fmKeyBufferSource.playbackRate = 1;

		if(playAtStart)
		{
			// TODO: not intentional but it ended up being a nice start
			fmKeyBufferSource.scheduleStart(0);
		}

		let sequence = IS.sequenceArray();

		if(pitched && referenceMemory)
		{
			let rememberedVoice = Memory.PitchedGridSequences[0];
			startTime = rememberedVoice[rememberedVoice.length - 1];
		}

		sequence.timeSequence
		(
			possibleDurations, startTime, false,
			speed, 0.001, densityRamp === 0 ? density : 1, timeLimit
		);

		if(pitched)
		{
			Memory.PitchedGridSequences.push(sequence.value);
		}
		else
		{
			Memory.PercussionGridSequences.push(sequence.value);
		}

		let onset = 0;
		let rampedDensity = density;
		let densityRampProgress = 0;

		for(let sequenceIndex = 0; sequenceIndex < sequence.length; sequenceIndex++)
		{
			if(densityRamp > 0 && densityRampProgress < 1)
			{
				densityRampProgress = sequenceIndex / (sequence.length * densityRamp);
				rampedDensity = density * densityRampProgress;
			}
			else
			{
				rampedDensity = density;
			}

			if(!IS.coinToss(rampedDensity))
			{
				continue;
			}

			if(pitched)
			{
				onset = sequence.value[sequenceIndex];
				fmKeyBufferSource.scheduleStart(onset);
				/*
				 NOTE THAT THE ARGUMENTS FOR setValueAtTime HERE ARE BACKWARDS, BUT SOMEHOW THIS IS THE SECRET
				 SAUCE OF THESE SOUNDS, HENCE SUBTRACTION OF IS.now FROM THE possibleOctaves.random() "startTime"
				 TO COMPENSATE FOR THE ADDITION OF this.siblingContext.now TO IS_AudioParameter.setValueAtTime()
				 */
				fmKeyBufferSource.playbackRate.setValueAtTime(onset, possibleOctaves.random() - IS.now);
			}
			else
			{
				onset = sequence.value[sequenceIndex];
				fmKeyBufferSource.scheduleStart(onset);
				/*
				 REVERSING THE FIX FROM gridSection IN THE COMMENT ABOVE CREATES AN AMAZING HIGH PERCUSSION SOUND
				 */
				fmKeyBufferSource.playbackRate.setValueAtTime(onset, possibleOctaves.random() * 0.25);
			}
		}
	}
}