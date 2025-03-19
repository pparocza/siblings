export class SequenceBuffer
{
    constructor(siblingContext, numberOfSegments, segmentDuration, fundamental, scale, densityPercent = 1)
    {
        let IS = siblingContext;
        this.IS = IS;

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
        this.IS.scheduleStart(this.bufferSource, startTime);
    }

    scheduleStop(stopTime)
    {
        this.IS.scheduleStop(this.bufferSource, stopTime);
    }

    print()
    {
        this.buffer.print();
    }
}