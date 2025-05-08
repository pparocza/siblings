import { SequenceBuffer } from "./SequenceBuffer.js";
import { FMReverb } from "./FMReverb.js";

export class SequenceBufferSection
{
    constructor(siblingContext, startTime, fundamental, baseDuration, scale, density, sequential = false)
    {
        this.IS = siblingContext;

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
        let sequenceBuffer1 = new SequenceBuffer(this.IS, this.IS.Random.Int(25, 34), baseDuration, fundamental, scale, density);
        sequenceBuffer1.scheduleStart(startTime);

        let sequenceBuffer2 = new SequenceBuffer(this.IS, this.IS.Random.Int(19, 27), baseDuration, fundamental * 0.25, scale, density);
        sequenceBuffer2.scheduleStart(startTime + sequenceBuffer1.length);

        let sequenceBuffer3 = new SequenceBuffer(this.IS, this.IS.Random.Int(21, 30), baseDuration, fundamental * 0.125, scale, density);
        sequenceBuffer3.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length);

        let sequenceBuffer4 = new SequenceBuffer(this.IS, this.IS.Random.Int(15, 24), baseDuration * 3, fundamental * 0.375, scale, density);
        sequenceBuffer4.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length);

        let sequenceBuffer5 = new SequenceBuffer(this.IS, this.IS.Random.Int(23, 32), baseDuration * 6, fundamental * 0.75, scale, density);
        sequenceBuffer5.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length + sequenceBuffer4.length);

        let sequenceBuffer6 = new SequenceBuffer(this.IS, this.IS.Random.Int(18, 27), baseDuration * 1.5, fundamental * 0.75, scale, density);
        sequenceBuffer6.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length + sequenceBuffer4.length);

        let sequenceBuffer7 = new SequenceBuffer(this.IS, this.IS.Random.Int(18, 27) * 3, baseDuration * 0.5, fundamental * 0.5, scale, density * 0.5);
        sequenceBuffer7.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length + sequenceBuffer4.length + sequenceBuffer6.length);

        let sequenceBuffer8 = new SequenceBuffer(this.IS, this.IS.Random.Int(18, 27) * 4, baseDuration * 0.5, fundamental * 1, scale, density * 0.25);
        sequenceBuffer8.scheduleStart(startTime + sequenceBuffer1.length + sequenceBuffer2.length + sequenceBuffer3.length + sequenceBuffer4.length + sequenceBuffer6.length);

        this.sequenceBuffers =
            [
                sequenceBuffer1, sequenceBuffer2, sequenceBuffer3, sequenceBuffer4,
                sequenceBuffer5, sequenceBuffer6, sequenceBuffer7, sequenceBuffer8
            ]
    }

    createSequenceBuffersSimultaneous(startTime, fundamental, baseDuration, scale, density)
    {
        let sequenceBuffer1 = new SequenceBuffer(this.IS, this.IS.Random.Int(25, 34), baseDuration, fundamental, scale, density);
        sequenceBuffer1.scheduleStart(startTime);

        let sequenceBuffer2 = new SequenceBuffer(this.IS, this.IS.Random.Int(19, 27), baseDuration, fundamental * 0.25, scale, density);
        sequenceBuffer2.scheduleStart(startTime);

        let sequenceBuffer3 = new SequenceBuffer(this.IS, this.IS.Random.Int(21, 30), baseDuration, fundamental * 0.125, scale, density);
        sequenceBuffer3.scheduleStart(startTime);

        let sequenceBuffer4 = new SequenceBuffer(this.IS, this.IS.Random.Int(15, 24), baseDuration * 3, fundamental * 0.375, scale, density);
        sequenceBuffer4.scheduleStart(startTime);

        let sequenceBuffer5 = new SequenceBuffer(this.IS, this.IS.Random.Int(23, 32), baseDuration * 6, fundamental * 0.75, scale, density);
        sequenceBuffer5.scheduleStart(startTime);

        let sequenceBuffer6 = new SequenceBuffer(this.IS, this.IS.Random.Int(18, 27), baseDuration * 1.5, fundamental * 0.75, scale, density);
        sequenceBuffer6.scheduleStart(startTime);

        let sequenceBuffer7 = new SequenceBuffer(this.IS, this.IS.Random.Int(18, 27) * 3, baseDuration * 0.5, fundamental * 0.5, scale, density * 0.5);
        sequenceBuffer7.scheduleStart(startTime);

        let sequenceBuffer8 = new SequenceBuffer(this.IS, this.IS.Random.Int(18, 27) * 4, baseDuration * 0.5, fundamental * 1, scale, density * 0.25);
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
        let stereoDelay = this.IS.createStereoDelay();
        stereoDelay.delayRight = baseDuration * 0.25;
        stereoDelay.delayLeft = baseDuration * 0.33;
        stereoDelay.wetMix = 0.25;

        let reverb = this.IS.createConvolver();
        reverb.wetMix = 1;
        reverb.volume = -8;

        let fmReverb = new FMReverb(this.IS, fundamental, scale);

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