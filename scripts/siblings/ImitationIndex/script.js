import { IS } from "../../../script.js";
import { BufferPresets } from "../../presets/BufferPresets.js";
import { FMPadSource } from "./FMPadSource.js";
import { ConvolverVoice } from "./ConvolverVoice.js";

IS.onLoad(imitation);

// TODO: 1. can't hear fmPadSources - 2. compare to original screencaps

let imitationOutput = IS.createGain();
imitationOutput.connectToMainOutput();
imitationOutput.volume = -12;

let delay = IS.createStereoDelay();
delay.gain = 0.125;
delay.connectToMainOutput();

let reverb = IS.createConvolver();
reverb.gain = 0.5;
reverb.connectToMainOutput();

function imitation()
{
    let delayHighPass = IS.createFilter("highpass", 1000);

    IS.connectSeries(reverb, delayHighPass, imitationOutput);
    IS.connectSeries(delayHighPass, delay, imitationOutput);

    // STRUCTURE
    let nLayers = 50;

    let tonicOptions = IS.array("A", "B", "Bb", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#");
    let modeOptions = IS.array("minor", "major", "dorian", "phrygian", "lydian", "mixolydian");
    let scale = IS.ratioScale(tonicOptions.random(), modeOptions.random());
    const fundamental = IS.randomFloat(25, 35);

    let chord = IS.array
    (
        scale.value[0], scale.value[2], scale.value[3], scale.value[4],
        scale.value[5], scale.value[6], scale.value[7]
    );

    pads(nLayers, fundamental, chord);
    keys(nLayers, fundamental, chord);
}

function pads(nLayers, fundamental, chord)
{
    let fmPadSource = new FMPadSource(IS, nLayers, fundamental, chord);
    let fmPadSource2 = new FMPadSource(IS, nLayers, fundamental, chord);
    let fmPadSource3 = new FMPadSource(IS, nLayers, fundamental, chord);

    fmPadSource.sourceOutput.volume = -16;
    fmPadSource2.sourceOutput.volume = -16;
    fmPadSource3.sourceOutput.volume = -16;

    fmPadSource.convolverOutput.volume = 0;
    fmPadSource2.convolverOutput.volume = 0;
    fmPadSource3.convolverOutput.volume = 0;

    let fmPadFilter = IS.createFilter("lowpass", 1000);
    fmPadFilter.connect(delay, reverb);
    fmPadFilter.connect(imitationOutput);

    IS.connectMatrix
    (
        [fmPadSource.convolverOutput, fmPadSource2.convolverOutput, fmPadSource3.convolverOutput],
        [fmPadFilter]
    );

    IS.connectMatrix
    (
        [fmPadSource.sourceOutput, fmPadSource.sourceOutput, fmPadSource.sourceOutput],
        [fmPadFilter]
    )

    fmPadSource.scheduleStart(0);
    fmPadSource2.scheduleStart((20 * 4) - 10);
    fmPadSource3.scheduleStart((20 * 4 * 2) - 10);
}

function keys(nLayers, fundamental, chord)
{
    let possibleDurations = [1, 1.5, 2, 3, 1.33, 1.7];
    let possibleDurations2 = [1, 1.5, 2, 0.25, 0.75, 1.25];

    let startTimes = [0, 80, 160];
    let timeLimits = [80, 160, 240];

    for (let sectionIndex = 0; sectionIndex < startTimes.length; sectionIndex++)
    {
        let startTime = startTimes[sectionIndex];
        let timeLimit = timeLimits[sectionIndex];

        for(let i = 0; i < 10; i++)
        {
            let fmKeyCarrier = fundamental;
            let fmKeyBuffer = BufferPresets.randomFMKey(IS, fmKeyCarrier);
            let fmKeyBufferSource = IS.createBufferSource(fmKeyBuffer);
            fmKeyBufferSource.playbackRate = IS.array(1, 2, 0.25, 0.5, 4).random();

            fmKeyBufferSource.volume = -6;

            let highpass = IS.createFilter("highpass", 1000);

            let convolution = IS.createConvolver
            (
                new ConvolverVoice(IS, nLayers, fundamental, chord)
            );

            let panValue = i % 2 === 0 ? IS.randomFloat(0.6, 1) : -1 * IS.randomFloat(0.6, 1);
            let convolutionPanner = IS.createStereoPanner(panValue);
            IS.connectSeries(fmKeyBufferSource, highpass, convolution, convolutionPanner, imitationOutput);
            convolution.connect(delay, reverb);

            let sequence = IS.array()
            sequence.timeSequence
            (
                100, possibleDurations, startTime, i === 0,
                0.133, 0.001, 1, timeLimit
            );

            for(let sequenceIndex = 0; sequenceIndex < sequence.length; sequenceIndex++)
            {
                fmKeyBufferSource.scheduleStart(sequence.value[sequenceIndex]);
            }
        }
    }
}
