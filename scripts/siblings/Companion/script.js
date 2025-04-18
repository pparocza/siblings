import { IS } from "../../../script.js";
import { BufferPresets } from "../../presets/BufferPresets.js";

let convolutionBuffer = IS.createBuffer(1, 1);

IS.onLoad(companionStandard);

function companionStandard()
{
    let companionOutput = IS.createGain();
    companionOutput.volume = -32;
    companionOutput.connectToMainOutput();

    let delay = IS.createStereoDelay();
    delay.gain = 0.125;
    delay.connectToMainOutput();

    let reverb = IS.createConvolver();
    reverb.gain = 0.5;
    reverb.connectToMainOutput();

    let modulatingDelay = new C_ModulatingStereoDelay(IS);
    let delayHighPass = IS.createFilter("highpass", 1000);

    IS.connectSeries(reverb, modulatingDelay, delayHighPass, IS.output);
    IS.connectSeries(delayHighPass, delay, IS.output);
    modulatingDelay.start();
    modulatingDelay.volume = 12;

    // STRUCTURE

    let nSections = 4;
    let sectionLength = 40;
    let nVoices = 5;
    let nPitches = 20;

    let tonicOptions = IS.array("A", "B", "Bb", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#");
    let modeOptions = IS.array("minor");
    let scale = IS.ratioScale(tonicOptions.random(), modeOptions.random());
    const fundamental = IS.randomFloat(25, 35);
    let divArray = IS.array(1, 0.5, 1.5);

    let speed = IS.randomFloat(2, 2);

    let chords =
    [
        // 1
        IS.array(scale.value[0], scale.value[2], scale.value[4]),
        IS.array(scale.value[0], scale.value[2], scale.value[5]),

        // 2
        IS.array(scale.value[0], scale.value[2], scale.value[4]),
        IS.array(scale.value[3], scale.value[4], scale.value[6], scale.value[6] * 2),
        IS.array(scale.value[3], scale.value[4], scale.value[5], scale.value[5] * 2),

        // 3
        IS.array(scale.value[0], scale.value[2], scale.value[4], scale.value[4] * 2),
        IS.array(scale.value[3], scale.value[4], scale.value[6], scale.value[6] * 2, scale.value[7], scale.value[7] * 2),
        IS.array(scale.value[3], scale.value[4], scale.value[5], scale.value[5] * 2),

        // 4
        IS.array(scale.value[0], scale.value[2], scale.value[4], scale.value[4] * 2),
        IS.array(scale.value[0], scale.value[2], scale.value[4]),
        IS.array(scale.value[6] * 0.5, scale.value[1], scale.value[5]),
        IS.array(scale.value[0], scale.value[2], scale.value[5], scale.value[5] * 2),

        // 5
        IS.array(scale.value[0], scale.value[2], scale.value[4], scale.value[4] * 2),
        IS.array(scale.value[3], scale.value[4], scale.value[6], scale.value[6] * 2),
        IS.array(scale.value[3], scale.value[4], scale.value[5], scale.value[5] * 2),

        // 6
        IS.array(scale.value[0], scale.value[2], scale.value[4], scale.value[4] * 2),
        IS.array(scale.value[3], scale.value[4], scale.value[6], scale.value[6] * 2, scale.value[7], scale.value[7] * 2),
        IS.array(scale.value[3], scale.value[4], scale.value[5], scale.value[5] * 2),

        // 7
        IS.array(scale.value[0], scale.value[2], scale.value[4], scale.value[4] * 2),
        IS.array(scale.value[0], scale.value[2], scale.value[4]),
    ];

    let sectionProportions =
    [
        // 1
        1, 0.5,
        // 2
        1, 0.5, 0.5,
        // 3
        1, 0.5, 0.5,
        // 4
        0.5, 0.5, 0.5, 0.5,
        // 5
        1, 0.5, 0.5,
        // 6
        1, 0.5, 0.5,
        // 7
        1, 0.5
    ];

    let startOffset = 0;

    // PITCH
    for(let i = 0; i < chords.length; i++)
    {
        let voiceSectionLength = (sectionLength * sectionProportions[i]) / speed;

        let pitchVoice = pitchSource
        (
            // TODO: Parameter scheduling, so that you don't have to create an individual "voice" for each pitch
            nVoices,
            nPitches,
            fundamental,
            chords[i % chords.length],
            voiceSectionLength,
            speed,
            divArray,
            startOffset
        );

        pitchVoice.connect(reverb);
        pitchVoice.connect(delay);

        IS.connectSeries(pitchVoice, IS.output);

        // Playing indeterminately noisey sources (gnarly fm) through tuned convolvers

        startOffset += voiceSectionLength;
    }

    IS.outputVolume = -32;

/*  let fmPadSource = IS.createBufferSource();
    fmPadSource.playbackRate = 0.25;
    fmPadSource.buffer = BufferPresets.randomFMPad(IS);
    fmPadSource.loopEnd = fmPadSource.buffer.length;
    fmPadSource.loop = true;
    fmPadSource.volume = 6;
    let fmPadFilter = IS.createFilter("lowpass", 1000);
    fmPadSource.connect(fmPadFilter);
    fmPadFilter.connect(delay, reverb);

    fmPadSource.scheduleStart(0);

    // THE IDEA IS FOR THIS CONVOLVER TO ACCENTUATE TONES FROM THE PITCHES IN THE BACKGROUND BASED ON THE NOISE OF
    // THE FMPADSOURCE, BUT I REALLY LIKE HOW IT TURNED OUT WITH JUST THE CONVOLVER IN MONO

    convolutionBuffer.constant(0.0025).multiply();

    let convolver = IS.createConvolver(convolutionBuffer);
    fmPadSource.connect(convolver);
    convolver.connectToMainOutput();
    convolver.connect(delay, reverb);
*/
}

function pitchSource(nVoices, nPitches, fundamental, scale, nOnsets, speed, divArray, startOffset = 0)
{
    let voiceArray = IS.array();
    let voiceOutput = IS.createGain();

    const octaveOptions = IS.array(1, 2);

    for (let pitch = 0; pitch < nPitches; pitch++)
    {
        let voiceBuffer = IS.createBuffer(1, 1);

        let octave = octaveOptions.random();

        let carrierFrequency = fundamental * scale.urn();
        let modulatorFrequency = IS.randomFloat(5, 10);
        let modulationGain = IS.randomFloat(0.125, 0.25);
        voiceBuffer.frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulationGain).add();
        voiceBuffer.frequencyModulatedSine
        (
            carrierFrequency * IS.randomFloat(1.001, 1.007),
            modulatorFrequency * IS.randomFloat(1.001, 1.007),
            modulationGain * IS.randomFloat(1.001, 1.007)
        ).add();

        let rampPeakPercent = IS.randomFloat(0.001, 0.003);

        if (IS.coinToss())
        {
            voiceBuffer.frequencyModulatedSine
            (
                carrierFrequency * IS.randomFloat(0.000625, 0.0003125),
                modulatorFrequency * IS.randomFloat(0.000625, 0.0003125),
                modulationGain * IS.randomFloat(0.000625, 0.0003125),
            ).multiply();

            if(IS.coinToss())
            {
                rampPeakPercent = 1 - rampPeakPercent;
                voiceBuffer.attenuate(-6);
            }
            else
            {
                voiceBuffer.attenuate(6);
            }
        }

        let upExp = IS.randomFloat(0.005, 0.02);
        let downExp = IS.randomFloat(3, 6);
        voiceBuffer.ramp(0, 1, rampPeakPercent, rampPeakPercent, upExp, downExp).multiply();

        let voiceSource = IS.createBufferSource(voiceBuffer);
        voiceSource.playbackRate = 1 / octave;

        let panner = IS.createStereoPanner(IS.randomFloat(-1, 1));

        IS.connectSeries(voiceSource, panner, voiceOutput);

        voiceArray.push(voiceSource);

        convolutionBuffer.addBuffer(voiceBuffer);
    }

    let speedFactor = 1 / speed;

    let previousOnsetTime = speedFactor * startOffset;

    // TODO: Here is where having a separate sequence data type would be helpful
    for (let onset = 0; onset < nOnsets; onset++)
    {
        let onsetTime = previousOnsetTime + (divArray.random() * speedFactor);

        for (let voice = 0; voice < nVoices; voice++)
        {
            if(IS.coinToss(0.7))
            {
                let voiceSource = voiceArray.urn();
                voiceSource.scheduleStart(onsetTime + IS.randomFloat(-0.02, 0.02));
            }
        }

        previousOnsetTime = onsetTime;
    }

    return voiceOutput;
}
