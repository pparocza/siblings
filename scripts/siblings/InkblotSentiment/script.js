import { IS } from "../../../script.js";

IS.onLoad(inkblotSentiment);
console.log("testing change");

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