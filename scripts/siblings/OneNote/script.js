import { IS } from "../../../script.js";

IS.onLoad(oneNote);

function oneNote()
{
    let nNotes = 200;
    let fundamental = 150;
    let baseRate = 1;
    let baseDuration = 1;

    let connectArray =
        [
            new OneNote(fundamental, nNotes, baseDuration * 0.125, baseRate, 0, "sine", -7),
            new OneNote(fundamental, nNotes, baseDuration * 0.125, baseRate, 0, "sine", -13),
            new OneNote(fundamental, nNotes * 0.33, baseDuration * 0.375, baseRate * 0.125, 0, "fm", -6),
            new OneNote(fundamental, nNotes * 0.25, baseDuration * 0.5, baseRate * 0.0625, 0, "fm", -3),
        ]

    let reverb = IS.createConvolver();
    reverb.wetMix = 0.5;

    let stereoDelay = new ModulatingStereoDelay();
    stereoDelay.delay.wetMix = 0.125;

    stereoDelay.start();

    for(let i = 0; i < connectArray.length; i++)
    {
        connectArray[i].connect(reverb);
        connectArray[i].connect(stereoDelay.delay);
    }

    let oneNoteGain = IS.createGain(IS.decibelsToAmplitude(0));
    reverb.connect(oneNoteGain);
    stereoDelay.delay.connect(oneNoteGain);
    oneNoteGain.connectToMainOutput();

    IS.outputVolume = 3;
}

class OneNote
{
    constructor(fundamental = 110, nNotes = 10, noteDuration = 1,
                noteRate = 1, noteStartOffset = 0, type = "sine", volume = 0)
    {
        let noteBuffer = IS.createBuffer();

        switch(type)
        {
            case ("sine"):
                noteBuffer.sine(fundamental).fill();
                break;
            case ("fm"):
                let array = IS.array([2, 1]);
                noteBuffer.frequencyModulatedSine(fundamental, fundamental * array.random(), IS.randomFloat(0.25, 0.5)).fill();
                break;
        }

        noteBuffer.inverseSawtooth(4).volume(-18).multiply();

        this.noteBuffer = noteBuffer;

        this.nNotes = nNotes;
        this.noteStartOffset = noteStartOffset;
        this.noteDuration = noteDuration;
        this.noteRate = noteRate;
        /**
         * TO DO: Ratio Scale
         */
        this.scale = IS.ratioScale("C", "major");

        this.output = IS.createGain(IS.decibelsToAmplitude(volume));

        this.notes = [];
        this.schedule();
    }

    connect(audioNode)
    {
        this.output.connect(audioNode);
    }

    schedule()
    {
        let drunkScaler = 0.33;

        for(let i = 0; i < this.nNotes; i++)
        {
            let note = IS.createBufferSource();
            note.buffer = this.noteBuffer;
            note.playbackRate = this.noteRate * this.scale.random();
            note.connect(this.output);

            this.notes.push(note);

            let progressPercent = i / this.nNotes;
            let drunkPercent = Math.pow(1 - progressPercent, 2);
            let tryDrunk = drunkScaler * drunkPercent * IS.randomFloat(-1, 1);
            let drunk = i === 0 ? 0 : tryDrunk;
            let startTime = (i + this.noteStartOffset) + drunk;
            let noteDuration = this.noteDuration;
            IS.scheduleStart(note, startTime * noteDuration);
        }
    }
}

class ModulatingStereoDelay
{
    constructor()
    {
        let delay = IS.createStereoDelay();

        let delayModulatorBuffer = IS.createBuffer();
        delayModulatorBuffer.noise().amplitude(0.001).add();

        let delayModulatorBuffer2 = IS.createBuffer();
        delayModulatorBuffer2.noise().amplitude(0.001).add();

        let delayModulator = IS.createBufferSource(delayModulatorBuffer);
        delayModulator.connect(delay.delayLeft.node.delayTime);
        delayModulator.playbackRate = IS.randomFloat(0.00025, 0.000125);
        delayModulator.loop = true;

        let delayModulator2 = IS.createBufferSource(delayModulatorBuffer);
        delayModulator2.connect(delay.delayRight.node.delayTime);
        delayModulator2.playbackRate = IS.randomFloat(0.00025, 0.000125);
        delayModulator2.loop = true;

        this.delay = delay;
        this.delayModulator = delayModulator;
        this.delayModulator2 = delayModulator2;
    }

    connect(audioNode)
    {
        this.delay.connect(audioNode);
    }

    start()
    {
        this.delayModulator.start();
        this.delayModulator2.start();
    }
}