import { IS } from "../../../script.js";
import { SalineImpulse } from "./SalineImpulse.js";
import { ModulatingStereoDelay } from "./ModulatingStereoDelay.js";

// TODO: presets framework (extensions of effects classes? - base class includes a preset instance?)
// TODO: progression / next sound

IS.onLoad(load);

function load()
{
    let fundamental = IS.randomFloat(18, 21);

    let tonicOptions = IS.array(["A", "B", "Bb", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#"]);
    let modeOptions = IS.array(["major", "minor", "phrygian", "dorian", "lydian", "mixolydian"]);
    let scale = IS.ratioScale(tonicOptions.random(), modeOptions.random());

    let impulseGain = IS.createGain();

    let impulse1 = new SalineImpulse(IS, IS.randomFloat(0.0625, 0.125), fundamental, scale, 0, 25, impulseGain);
    let impulse2 = new SalineImpulse(IS, IS.randomFloat(0.0625, 0.125), fundamental, scale, 0, 35, impulseGain);
    let impulse3 = new SalineImpulse(IS, IS.randomFloat(0.0625, 0.125), fundamental, scale, 0, 45, impulseGain);

    let impulse4 = new SalineImpulse(IS, IS.randomFloat(0.0625, 0.125), fundamental, scale, 20, 120, impulseGain);
    let impulse5 = new SalineImpulse(IS, IS.randomFloat(0.0625, 0.125), fundamental, scale, 30, 120, impulseGain);
    let impulse6 = new SalineImpulse(IS, IS.randomFloat(0.0625, 0.125), fundamental, scale, 40, 120, impulseGain);

    let filter = IS.createFilter("highshelf", 1000, 1, -18);

    let reverb = IS.createConvolver();
    reverb.stereoNoiseReverb(4);

    let modulatingStereoDelay = new ModulatingStereoDelay(IS);
    modulatingStereoDelay.volume = -8;

    impulseGain.connect(filter, reverb);

    reverb.connect(modulatingStereoDelay.delay);

    filter.connectToMainOutput();
    reverb.connectToMainOutput();
    modulatingStereoDelay.connect(IS.output);
}