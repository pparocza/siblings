export class SA_FMReverb
{
    constructor(siblingContext, fundamental, scale)
    {
        let IS = siblingContext;

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
        fmReverb.buffer = fmReverbBuffer;

        this.node = fmReverb;
        this.fmReverb = fmReverb;
        this.wetMix = fmReverb.wetMix;
        this.gain = fmReverb.gain;
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