import { IS } from "../../../script.js";
import { SequenceBufferSection } from "./SequenceBufferSection.js";

IS.onLoad(load);

function load()
{
    let fundamental = IS.Random.Float(15, 20);
    let baseDuration = 0.25;

    let scale = IS.ratioScale("C", "Major");
    let density = IS.Random.Float(0.5, 1.1);

    let section1 = new SequenceBufferSection
    (
        IS,
        0,
        fundamental, baseDuration, scale, density,
        true
    );

    let section2 = new SequenceBufferSection
    (
        IS,
        section1.fullCycleDuration,
        fundamental, baseDuration, scale, density * 0.25,
        false
    );

    let section3 = new SequenceBufferSection
    (
        IS,
        section1.fullCycleDuration,
        fundamental, baseDuration, scale, density * 0.5,
        true
    );

    IS.outputVolume = -12;
}