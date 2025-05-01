export class SA_FMReverb
{
    constructor(siblingContext, fundamental, scale)
    {
        let IS = siblingContext;

        let fmReverbBuffer = IS.createBuffer(2, 8);
        let reverbFundamental = fundamental * 16;
        let nReverbTones = 5;

        for (let i = 0; i < nReverbTones; i++)
        {
            let randomRampCenter = IS.Random.Float(0.25, 0.75);
            let carrierFrequency = reverbFundamental * scale.random();
            let modulatorFrequency = carrierFrequency * IS.Random.Float(0.99, 1.001)

            fmReverbBuffer.suspendOperations();

                fmReverbBuffer.operationChannel = 0;

                fmReverbBuffer.frequencyModulatedSine
                (
                    carrierFrequency,
                    modulatorFrequency,
                    IS.Random.Float(0.25, 8)
                ).add();

                fmReverbBuffer.ramp
                (
                    0, 1,
                    randomRampCenter, randomRampCenter,
                    IS.Random.Float(1, 3), IS.Random.Float(1, 3)
                ).multiply();

                fmReverbBuffer.constant(1 / nReverbTones).multiply();
                fmReverbBuffer.sine(IS.Random.Float(1, 10)).multiply();

                carrierFrequency = reverbFundamental * scale.random();
                modulatorFrequency = carrierFrequency * IS.Random.Float(0.99, 1.001)

                fmReverbBuffer.operationChannel = 1;

                fmReverbBuffer.frequencyModulatedSine
                (
                    carrierFrequency,
                    modulatorFrequency,
                    IS.Random.Float(0.25, 8)
                ).add();

                fmReverbBuffer.ramp
                (
                    0, 1,
                    randomRampCenter, randomRampCenter,
                    IS.Random.Float(1, 3), IS.Random.Float(1, 3)
                ).multiply();

                fmReverbBuffer.constant(1 / nReverbTones).multiply();
                fmReverbBuffer.sine(IS.Random.Float(1, 10)).multiply();

            fmReverbBuffer.applySuspendedOperations().add();
        }

        let fmReverb = IS.createConvolver(fmReverbBuffer);
        fmReverb.wetMix = 1;

        this.node = fmReverb;
        this.fmReverb = fmReverb;
        this.wetMix = fmReverb.wetMix;
        this.gain = fmReverb.gain.value;
    }

    set wetMix(value)
    {
        this.fmReverb.wetMix = value;
    }

    get wetMix()
    {
        return this.fmReverb.wetMix;
    }

    set gain(value)
    {
        this.fmReverb.gain = value;
    }

    get gain()
    {
        return this.fmReverb.gain;
    }

    get buffer()
    {
        return this.fmReverb.buffer;
    }
}