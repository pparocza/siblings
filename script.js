import { InfiniteSibling } from "../node_modules/infinitesibling";
const IS = new InfiniteSibling();

function load()
{
    // sequenceTest();
    // oneNote();
    // rollingSines();
    inkblotSentiment();
}

function start()
{
    IS.start();
}

function stop()
{
    IS.stop();
}

function inkblotSentiment()
{
    let fundamental = IS.randomFloat(15, 20);
    let baseDuration = 0.25;

    let scale = IS.ratioScale("C", "Major");
    let density = IS.randomFloat(0.5, 1.1);

    let section1 = new SequenceBufferSection
    (
        0,
        fundamental, baseDuration, scale, density,
        true
    );

    let section2 = new SequenceBufferSection
    (
        section1.fullCycleDuration,
        fundamental, baseDuration, scale, density * 0.25,
        false
    );

    let section3 = new SequenceBufferSection
    (
        section1.fullCycleDuration,
        fundamental, baseDuration, scale, density * 0.5,
        true
    );

    IS.outputVolume = -12;
}

class SequenceBufferSection
{
    constructor(startTime, fundamental, baseDuration, scale, density, sequential = false)
    {
        if(sequential)
        {
            this.createSequenceBuffersSequential(startTime, fundamental, baseDuration, scale, density);
        }
        else
        {
            this.createSequenceBuffersSimultaneous(startTime, fundamental, baseDuration, scale, density);
        }

        this.scheduleEnd(startTime);
        this.createEffects(fundamental, scale, baseDuration);
        this.connectSequenceBuffers();
    }

    createSequenceBuffersSequential(startTime, fundamental, baseDuration, scale, density)
    {
        let sequenceBuffer1 = new SequenceBuffer(IS.randomInt(25, 34), baseDuration, fundamental, scale, density);
        sequenceBuffer1.scheduleStart(startTime);

        let sequenceBuffer2 = new SequenceBuffer(IS.randomInt(19, 27), baseDuration, fundamental * 0.25, scale, density);
        sequenceBuffer2.scheduleStart(startTime + sequenceBuffer1.length);

        let sequenceBuffer3 = new SequenceBuffer(IS.randomInt(21, 30), baseDuration, fundamental * 0.125, scale, density);
        sequenceBuffer3.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length);

        let sequenceBuffer4 = new SequenceBuffer(IS.randomInt(15, 24), baseDuration * 3, fundamental * 0.375, scale, density);
        sequenceBuffer4.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length);

        let sequenceBuffer5 = new SequenceBuffer(IS.randomInt(23, 32), baseDuration * 6, fundamental * 0.75, scale, density);
        sequenceBuffer5.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length + sequenceBuffer4.length);

        let sequenceBuffer6 = new SequenceBuffer(IS.randomInt(18, 27), baseDuration * 1.5, fundamental * 0.75, scale, density);
        sequenceBuffer6.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length + sequenceBuffer4.length);

        let sequenceBuffer7 = new SequenceBuffer(IS.randomInt(18, 27) * 3, baseDuration * 0.5, fundamental * 0.5, scale, density * 0.5);
        sequenceBuffer7.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length + sequenceBuffer4.length + sequenceBuffer6.length);

        let sequenceBuffer8 = new SequenceBuffer(IS.randomInt(18, 27) * 4, baseDuration * 0.5, fundamental * 1, scale, density * 0.25);
        sequenceBuffer8.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length + sequenceBuffer4.length + sequenceBuffer6.length);

        this.sequenceBuffers =
        [
            sequenceBuffer1, sequenceBuffer2, sequenceBuffer3, sequenceBuffer4,
            sequenceBuffer5, sequenceBuffer6, sequenceBuffer7, sequenceBuffer8
        ]
    }

    createSequenceBuffersSimultaneous(startTime, fundamental, baseDuration, scale, density)
    {
        let sequenceBuffer1 = new SequenceBuffer(IS.randomInt(25, 34), baseDuration, fundamental, scale, density);
        sequenceBuffer1.scheduleStart(startTime);

        let sequenceBuffer2 = new SequenceBuffer(IS.randomInt(19, 27), baseDuration, fundamental * 0.25, scale, density);
        sequenceBuffer2.scheduleStart(startTime);

        let sequenceBuffer3 = new SequenceBuffer(IS.randomInt(21, 30), baseDuration, fundamental * 0.125, scale, density);
        sequenceBuffer3.scheduleStart(startTime);

        let sequenceBuffer4 = new SequenceBuffer(IS.randomInt(15, 24), baseDuration * 3, fundamental * 0.375, scale, density);
        sequenceBuffer4.scheduleStart(startTime);

        let sequenceBuffer5 = new SequenceBuffer(IS.randomInt(23, 32), baseDuration * 6, fundamental * 0.75, scale, density);
        sequenceBuffer5.scheduleStart(startTime);

        let sequenceBuffer6 = new SequenceBuffer(IS.randomInt(18, 27), baseDuration * 1.5, fundamental * 0.75, scale, density);
        sequenceBuffer6.scheduleStart(startTime);

        let sequenceBuffer7 = new SequenceBuffer(IS.randomInt(18, 27) * 3, baseDuration * 0.5, fundamental * 0.5, scale, density * 0.5);
        sequenceBuffer7.scheduleStart(startTime);

        let sequenceBuffer8 = new SequenceBuffer(IS.randomInt(18, 27) * 4, baseDuration * 0.5, fundamental * 1, scale, density * 0.25);
        sequenceBuffer8.scheduleStart(startTime);

        this.sequenceBuffers =
        [
            sequenceBuffer1, sequenceBuffer2, sequenceBuffer3, sequenceBuffer4,
            sequenceBuffer5, sequenceBuffer6, sequenceBuffer7, sequenceBuffer8
        ]
    }

    scheduleEnd(startTime)
    {
        let fullCycleDuration = 0;

        for (let sequenceBufferIndex = 0; sequenceBufferIndex < this.sequenceBuffers.length; sequenceBufferIndex++)
        {
            fullCycleDuration += this.sequenceBuffers[sequenceBufferIndex].length;
        }

        this.fullCycleDuration = fullCycleDuration;

        for (let sequenceBufferIndex = 0; sequenceBufferIndex < this.sequenceBuffers.length; sequenceBufferIndex++)
        {
            this.sequenceBuffers[sequenceBufferIndex].scheduleStop(this.fullCycleDuration + startTime);
        }
    }

    createEffects(fundamental, scale, baseDuration)
    {
        let stereoDelay = IS.createStereoDelay();
        stereoDelay.delayRight = baseDuration * 0.25;
        stereoDelay.delayLeft = baseDuration * 0.33;
        stereoDelay.wetMix = 0.25;

        let reverb = IS.createConvolver();
        reverb.wetMix = 1;
        reverb.volume = -8;

        let fmReverb = new FMReverb(fundamental, scale);

        stereoDelay.connect(reverb);
        stereoDelay.connect(fmReverb.node);

        stereoDelay.connectToMainOutput();
        reverb.connectToMainOutput();
        fmReverb.node.connectToMainOutput();

        this.stereoDelay = stereoDelay;
        this.reverb = reverb;
        this.fmReverb = fmReverb;
    }

    connectSequenceBuffers(fundamental, scale, baseDuration)
    {

        for (let sequenceBufferIndex = 0; sequenceBufferIndex < this.sequenceBuffers.length; sequenceBufferIndex++)
        {
            this.sequenceBuffers[sequenceBufferIndex].connect(this.stereoDelay);
        }
    }
}

class FMReverb
{
    constructor(fundamental, scale)
    {
        let fmReverbTempBuffer = IS.createBuffer(2, 8);
        let fmReverbBuffer = IS.createBuffer(2, 8);
        let reverbFundamental = fundamental * 16;
        let nReverbTones = 5;

        for (let i = 0; i < nReverbTones; i++)
        {
            let randomRampCenter = IS.randomFloat(0.25, 0.75);
            let carrierFrequency = reverbFundamental * scale.random();
            let modulatorFrequency = carrierFrequency * IS.randomFloat(0.99, 1.001)

            fmReverbTempBuffer
                .frequencyModulatedSine
                (
                    carrierFrequency,
                    modulatorFrequency,
                    IS.randomFloat(0.25, 8)
                )
                .fill(0);
            fmReverbTempBuffer
                .ramp(0, 1, randomRampCenter, randomRampCenter, IS.randomFloat(1, 3), IS.randomFloat(1, 3))
                .multiply(0);
            fmReverbTempBuffer
                .constant(1 / nReverbTones)
                .multiply(0);
            fmReverbTempBuffer
                .sine(IS.randomFloat(1, 10))
                .multiply();

            carrierFrequency = reverbFundamental * scale.random();
            modulatorFrequency = carrierFrequency * IS.randomFloat(0.99, 1.001)

            fmReverbTempBuffer
                .frequencyModulatedSine
                (
                    carrierFrequency,
                    modulatorFrequency,
                    IS.randomFloat(0.25, 8)
                )
                .fill(1);
            fmReverbTempBuffer
                .ramp(0, 1, randomRampCenter, randomRampCenter, IS.randomFloat(1, 3), IS.randomFloat(1, 3))
                .multiply(1);
            fmReverbTempBuffer
                .constant(1 / nReverbTones)
                .multiply(1);
            fmReverbTempBuffer
                .sine(IS.randomFloat(1, 10))
                .multiply();

            fmReverbBuffer.addBuffer(fmReverbTempBuffer);
        }

        let fmReverb = IS.createConvolver();
        fmReverb.wetMix = 1;
        fmReverb.gain = 0.0625;
        fmReverb.buffer = fmReverbBuffer;

        this.node = fmReverb;
    }
}

class SequenceBuffer
{
    constructor(numberOfSegments, segmentDuration, fundamental, scale, densityPercent = 1)
    {
        let totalLengthInSeconds = numberOfSegments * segmentDuration;
        let buffer = IS.createBuffer(1, totalLengthInSeconds);

        for (let segment = 0; segment < numberOfSegments; segment++)
        {
            let randomLengthScale = IS.randomFloat(0.3, 3);
            let segmentBuffer = IS.createBuffer(1, segmentDuration * randomLengthScale);

            let frequency = fundamental * scale.random() * randomLengthScale;

            let volume = densityPercent > IS.randomFloat(0, 1) ? IS.randomInt(0, -24) : -96;

            segmentBuffer
                .frequencyModulatedSine(frequency, frequency * IS.randomFloat(0.999, 1.0001), IS.randomFloat(0.0625, 0.125))
                .volume(volume)
                .fill();

            let rampDownExponent = IS.randomFloat(2, 5);
            let rampUpExponent = IS.randomFloat(0.05, 0.1);
            let rampUpEnd = IS.randomFloat(0.05, 0.15);

            segmentBuffer.ramp(0, 1, rampUpEnd, rampUpEnd, rampUpExponent, rampDownExponent).multiply();

            let segmentPercent = segment / numberOfSegments;
            buffer.insertBuffer(segmentBuffer, segmentPercent + IS.randomFloat(-0.0003, 0.0003), 1);
        }

        let bufferSource = IS.createBufferSource();
        bufferSource.playbackRate = 1;
        bufferSource.loop = true;
        bufferSource.loopEnd = totalLengthInSeconds;
        bufferSource.buffer = buffer;

        this.buffer = buffer;
        this.bufferSource = bufferSource;

        this.lengthInSeconds = totalLengthInSeconds;
    }

    get length()
    {
        return this.lengthInSeconds;
    }

    connect(audioNode)
    {
        this.bufferSource.connect(audioNode);
    }

    start()
    {
        this.bufferSource.start();
    }

    scheduleStart(startTime)
    {
        IS.scheduleStart(this.bufferSource, startTime);
    }

    scheduleStop(stopTime)
    {
        IS.scheduleStop(this.bufferSource, stopTime);
    }

    print()
    {
        this.buffer.print();
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

class RollingSine
{
    constructor(fundamental, invertEnvelope = false)
    {
        let buffer = IS.createBuffer(1, 1);

        let harmonics = [1, 0.5, 0.25];
        let harmonicVolume = [-6, -6, -6];

        for(let i = 0; i < harmonics.length; i++)
        {
            buffer.frequencyModulatedSine
            (
                fundamental,
                fundamental * IS.randomFloat(0.5, 2),
                IS.randomFloat(0.5, 10)
            ).amplitude(1 / harmonics.length).add();

            buffer.noise().volume(IS.randomFloat(-64, -48)).add();
        }

        if(invertEnvelope)
        {
            buffer.sawtooth(16).multiply();
        }
        else
        {
            buffer.inverseSawtooth(16).multiply();
        }

        this.node = IS.createBufferSource();
        this.node.buffer = buffer;
        this.node.playbackRate = IS.randomFloat(1.11, 1.3);
        this.node.loop = true;

        this.amplitudeModulator = IS.createAmplitudeModulator();
        this.amplitudeModulator.buffer.frequencyModulatedSine(10, 15, 1).add();
        this.amplitudeModulator.buffer.frequencyModulatedSine(8, 13.221, 0.75).multiply();
        this.amplitudeModulator.modulatorPlaybackRate = 0.133;

        let reverb = IS.createConvolver();
        let reverbBuffer = IS.createBuffer(2, 3);
        reverbBuffer.noise().add(0);
        reverbBuffer.noise().add(1);
        reverbBuffer.inverseSawtooth(IS.randomFloat(0.5, 2)).multiply(0);
        reverbBuffer.frequencyModulatedSine(110, 220, 150).volume(-16).add(0);
        reverbBuffer.amplitudeModulatedSine(10, 5, 1).multiply(0);
        reverbBuffer.inverseSawtooth(IS.randomFloat(0.5, 2)).multiply(1);
        reverb.wetMix = 0.3;

        let delay = IS.createStereoDelay(1.25, 0.75, 0.5, 0.5, 2);

        let delayModulatorBuffer = IS.createBuffer();
        delayModulatorBuffer.noise().amplitude(0.001).add();

        let delayModulatorBuffer2 = IS.createBuffer();
        delayModulatorBuffer2.noise().amplitude(0.001).add();

        this.delayModulator = IS.createBufferSource(delayModulatorBuffer);
        this.delayModulator.connect(delay.delayLeft.node.delayTime);
        this.delayModulator.playbackRate = IS.randomFloat(0.00025, 0.000125);
        this.delayModulator.loop = true;

        this.delayModulator2 = IS.createBufferSource(delayModulatorBuffer);
        this.delayModulator2.connect(delay.delayRight.node.delayTime);
        this.delayModulator2.playbackRate = IS.randomFloat(0.00025, 0.000125);
        this.delayModulator2.loop = true;

        this.node.connect(this.amplitudeModulator);
        this.amplitudeModulator.connect(delay);
        delay.connect(reverb);
        reverb.connectToMainOutput();
    }

    schedule(startTime = 0, duration = 0)
    {
        IS.scheduleStart(this.node, startTime, duration);
        IS.scheduleStart(this.amplitudeModulator, startTime + 1, duration);
        IS.scheduleStart(this.delayModulator, startTime + 4, duration);
        IS.scheduleStart(this.delayModulator2, startTime + 4, duration);
    }
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

function rollingSines()
{
    let rollingFundamental = 110;
    let endTime = 30;

    let rollingSine = new RollingSine(rollingFundamental * 4);
    rollingSine.schedule(0, endTime);

    let rollingSine2 = new RollingSine(rollingFundamental * 1);
    rollingSine2.schedule(0, endTime);

    let rollingSine3 = new RollingSine(rollingFundamental * 2);
    rollingSine3.schedule(0, endTime);

    let rollingSine4 = new RollingSine(rollingFundamental * 4, true);
    rollingSine4.schedule(10, endTime);

    let rollingSine5 = new RollingSine(rollingFundamental * 1, true);
    rollingSine5.schedule(15, endTime);

    let rollingSine6 = new RollingSine(rollingFundamental * 2, true);
    rollingSine6.schedule(20, endTime);
}

function sequenceTest()
{
    let gainMultiplier = 0.33;

    let oscillator = IS.createOscillator()
    oscillator.frequency = 440;
    oscillator.connectToMainOutput();
    oscillator.gain = gainMultiplier;

    let oscillator2 = IS.createOscillator();
    oscillator2.frequency = 880;
    oscillator2.connectToMainOutput();
    oscillator2.gain = gainMultiplier;

    let oscillator3 = IS.createOscillator();
    oscillator3.frequency = 330;
    oscillator3.connectToMainOutput();
    oscillator3.gain = gainMultiplier;

    let schedule = IS.createSchedule();
    schedule.scheduleStart(oscillator, 0, 4);
    schedule.scheduleStart(oscillator2, 2, 2);

    let schedule2 = IS.createSchedule();
    schedule2.scheduleStart(oscillator3, 2);
    schedule2.scheduleStart(oscillator2, 3);
    schedule2.scheduleStart(oscillator, 4);

    let sequence = IS.createSequence();
    sequence.addSchedule(schedule, 0);
    let sequence2 = IS.createSequence();
    sequence2.addSchedule(schedule2, 2);

    sequence2.stopTime = 6;

    IS.sequence(sequence);
    IS.sequence(sequence2);

    IS.outputVolume = -24;
}

export { load, start, stop };