import { IS } from "../../../script.js";
import { SalineImpulse } from "./SalineImpulse.js";
import { ModulatingStereoDelay } from "../../presets/ModulatingStereoDelay.js";
import { ToneLoop } from "./ToneLoop.js";

import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";
IS.onReady(IS_Visualizer.visualize);
IS.outputVolume = 6;


// TODO: presets framework (extensions of effects classes? - base class includes a preset instance?)

let reverbBuffer = IS.createBuffer(2, 4);
reverbBuffer.noise().add();
reverbBuffer.inverseSawtooth().multiply();

let reverb = IS.createConvolver(reverbBuffer);

let modulatingStereoDelay = new ModulatingStereoDelay(IS);
modulatingStereoDelay.volume = 0;

let stereoDelay = IS.createStereoDelay();
stereoDelay.connectToMainOutput();
stereoDelay.wetMix = 1;

IS.onLoad(load);

function load()
{
    let fundamental = IS.Random.Float(180, 280);

    let mode = IS.Mode;
    let modeOptions = IS.array(mode.Major, mode.Minor, mode.Phrygian, mode.Dorian, mode.Mixolydian);
    let scale = IS.ratioScale(modeOptions.random());

    impulseSection(fundamental, scale);
    toneLoopSection(45, 125, 10, fundamental, scale);
}

function toneLoopSection(startTime = 0, stopTime, nTones, fundamental, scale)
{

    let startOffsetMin = 5;
    let startOffsetMax = 10;

    let baseLoopLength = IS.Random.Float(3, 5);
    let baseLoopLengthMultipliers = IS.array(0.25, 0.5, 0.75, 1, 1.25, 1.5);

    let octaveOptions = IS.array(1, 2);

    let toneLoopLowpass = IS.createFilter("lowpass", 1000, 1, 1);
    let toneLoopHighpass = IS.createFilter("highpass", 100, 1, 1);
    let toneLoopOutput = IS.createGain();
    toneLoopOutput.volume = -38;

    toneLoopOutput.connect(toneLoopLowpass);
    toneLoopLowpass.connect(toneLoopHighpass);
    toneLoopHighpass.connect(reverb, modulatingStereoDelay, stereoDelay);
    toneLoopHighpass.connectToMainOutput();

    for(let toneIndex = 0; toneIndex < nTones; toneIndex++)
    {
        let frequency = fundamental * scale.random() * octaveOptions.random();
        let startOffset = IS.Random.Float(startOffsetMin, startOffsetMax);
        let rate = baseLoopLength * baseLoopLengthMultipliers.random();

        let toneLoop = new ToneLoop
        (
            IS, rate, frequency, frequency * 2, IS.Random.Float(0.125, 0.25)
        )

        toneLoop.scheduleStart(startTime + (toneIndex * startOffset));
        toneLoop.scheduleStop(stopTime);

        toneLoop.connect(toneLoopOutput);
    }
}

function impulseSection(fundamental, scale)
{
    // TODO: start/stop lengths based on "cycle", which is determined by the length of one loop of a bufferSource for example
    // (basically, how to define timing methods that make more sense in terms of the lifecycle of a given source
    let impulse1 = new SalineImpulse(IS, IS.Random.Float(0.0625, 0.125), fundamental, scale, 0, 25);
    let impulse2 = new SalineImpulse(IS, IS.Random.Float(0.0625, 0.125), fundamental, scale, 0, 35);
    let impulse3 = new SalineImpulse(IS, IS.Random.Float(0.0625, 0.125), fundamental, scale, 0, 45);

    let impulse4 = new SalineImpulse(IS, IS.Random.Float(0.0625, 0.125), fundamental, scale, 20, 120);
    let impulse5 = new SalineImpulse(IS, IS.Random.Float(0.0625, 0.125), fundamental, scale, 28, 120);
    let impulse6 = new SalineImpulse(IS, IS.Random.Float(0.0625, 0.125), fundamental, scale, 36, 120);

    let impulse7 = new SalineImpulse(IS, IS.Random.Float(0.0625, 0.125), fundamental * 0.5, scale, 60, 90);
    let impulse8 = new SalineImpulse(IS, IS.Random.Float(0.0625, 0.125), fundamental * 0.5, scale, 80, 100);

    let filter = IS.createFilter("highshelf", 1000, 1, -18);
    let reverbFilter = IS.createFilter("highshelf", 5000, 1, -9);

    let impulseGain = IS.createGain();

    impulseGain.connectToInput(impulse1, impulse2, impulse3, impulse4, impulse5, impulse6);

    impulseGain.connect(filter, reverb);

    impulse7.connectToMainOutput();
    impulse8.connectToMainOutput();

    impulse7.volume = -3;
    impulse8.volume = -3;

    reverb.connect(reverbFilter);

    filter.connectToMainOutput();
    reverbFilter.connectToMainOutput();
    modulatingStereoDelay.connectToMainOutput();
}