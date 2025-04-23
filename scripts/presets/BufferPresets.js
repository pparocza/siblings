import { IS } from "../../script.js";

export const BufferPresets =
{
    fmKey(siblingContext, carrierFrequency, modulatorFrequency, modulationGain)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(1, 1);

        buffer.frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulationGain).fill();

        let rampUpEnd = IS.Random.Float(0.05, 0.15);
        let rampDownExponent = IS.Random.Float(2, 5);
        let rampUpExponent = IS.Random.Float(0.05, 0.1);

        // TODO: envelope presets? (keyStrike for something like inverseSine, pad for something slow)
        buffer.ramp(0, 1, rampUpEnd, rampUpEnd, rampUpExponent, rampDownExponent).multiply();

        return buffer;
    },

    randomFMPercussion(siblingContext)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(1, IS.Random.Float(1, 2));

        let carrierFrequency = IS.Random.Float(100, 5000);
        let modulatorFrequency = IS.Random.Float(20, 1000);
        let modulationGain = IS.Random.Float(1, 10);

        buffer.frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulationGain).fill();

        let rampPeakPercent = IS.Random.Float(0.005, 0.015);
        let upExp = IS.Random.Float(0.005, 0.2);
        let downExp = IS.Random.Float(3, 6);
        buffer.ramp(0, 1, rampPeakPercent, rampPeakPercent, upExp, downExp).multiply();

        return buffer;
    },

    randomFMKey(siblingContext, fundamental)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(1, 1);

        let carrierFrequency = fundamental;
        let modulatorFrequency = carrierFrequency * IS.array(1, 2, 3, 4, 8).random();
        let modulationGain = carrierFrequency * IS.array(1, 2, 3, 4, 0.125, 0.25).random();

        buffer.frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulationGain).fill();

        let rampPeakPercent = IS.Random.Float(0.005, 0.015);
        let upExp = IS.Random.Float(0.005, 0.2);
        let downExp = IS.Random.Float(3, 6);
        buffer.ramp(0, 1, rampPeakPercent, rampPeakPercent, upExp, downExp).multiply();

        return buffer;
    },

    randomFMPad(siblingContext, nLayers = 10)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(1, 20);
        let tempBuffer = IS.createBuffer(1, 20);

        for(let layer = 0; layer < nLayers; layer++)
        {
            let carrierFrequency = IS.Random.Float(500, 7000);
            let modulatorFrequency = IS.Random.Float(500, 7000);
            let modulationGain = IS.Random.Float(1, 300);

            tempBuffer.frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulationGain).fill();

            let rampPeakPercent = IS.Random.Float(0.3, 0.8);
            let upExp = IS.Random.Float(1, 2);
            let downExp = IS.Random.Float(1, 2);
            let startPercent = IS.Random.Float(0, 0.4);
            let endPercent = IS.Random.Float(startPercent, 1);
            tempBuffer.ramp(startPercent, endPercent, rampPeakPercent, rampPeakPercent, upExp, downExp).multiply();

            tempBuffer.constant(1 / nLayers).multiply();

            buffer.addBuffer(tempBuffer);
        }

        return buffer;
    },

    tonalFMPad(siblingContext, nLayers = 10, carrier)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(1, 20);
        let tempBuffer = IS.createBuffer(1, 20);

        let carrierFrequency = carrier;

        for(let layer = 0; layer < nLayers; layer++)
        {
            let modulatorFrequency = carrierFrequency * IS.array(1, 2, 3, 4, 8).random();
            let modulationGain = carrierFrequency * IS.array(1, 2, 3, 4, 0.125, 0.25).random();

            tempBuffer.frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulationGain).fill();

            let rampPeakPercent = IS.Random.Float(0.3, 0.8);
            let upExp = IS.Random.Float(1, 2);
            let downExp = IS.Random.Float(1, 2);
            let startPercent = IS.Random.Float(0, 0.4);
            let endPercent = IS.Random.Float(startPercent, 1);
            tempBuffer.ramp(startPercent, endPercent, rampPeakPercent, rampPeakPercent, upExp, downExp).multiply();

            tempBuffer.constant(1 / nLayers).multiply();

            buffer.addBuffer(tempBuffer);
        }

        return buffer;
    },

    noiseStrike(siblingContext)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(1, 1);

        buffer.noise().fill();
        buffer.inverseSawtooth(4).multiply();

        return buffer;
    },

    oceanWaves(siblingContext, nChannels = 1, length = 1)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(nChannels, length);

        // Create noiseBuffer
        let noiseBuffer = IS.createBuffer(nChannels, length);

        noiseBuffer.noise().fill();
        noiseBuffer.inverseSawtooth(4).multiply();

        // Create fmBuffer
        let fmBuffer = IS.createBuffer(nChannels, length);
        fmBuffer.frequencyModulatedSine(IS.Random.Float(2, 6), IS.Random.Float(2, 6), IS.Random.Float(1, 3)).fill();

        let rampUpEnd = IS.Random.Float(0.05, 0.15);
        let rampDownExponent = IS.Random.Float(2, 5);
        let rampUpExponent = IS.Random.Float(0.05, 0.1);

        // TODO: envelope presets? (keyStrike for something like inverseSine, pad for something slow)
        fmBuffer.ramp(0, 1, rampUpEnd, rampUpEnd, rampUpExponent, rampDownExponent).multiply();

        // Amplitude modulate noise buffer by fmBuffer
        fmBuffer.multiplyBuffer(noiseBuffer);

        // Create lowNoise
        let lowNoise = IS.createBuffer(nChannels, length);
        lowNoise.noise().fill();
        lowNoise.ramp(0, 1, 0.3, 0.4, 3, 3).multiply();
        lowNoise.constant(0.125).multiply();

        buffer.addBuffer(fmBuffer);
        buffer.addBuffer(lowNoise);

        return buffer;
    }
}
