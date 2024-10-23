import { PRINT_TO_PAGE } from "../PrintToPage.js";

// TODO: InfiniteSibling integration? IS.bufferPreset.presetName

export const BufferPresets =
{
    printToPage(string)
    {
      PRINT_TO_PAGE("[BufferPreset] " + string);
    },

    printPresetLoadingToPage(presetName)
    {
        this.printToPage("Loading: " + presetName);
    },

    fmKey(siblingContext, carrierFrequency, modulatorFrequency, modulationGain)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(1, 1);

        buffer.frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulationGain).fill();

        let rampUpEnd = IS.randomFloat(0.05, 0.15);
        let rampDownExponent = IS.randomFloat(2, 5);
        let rampUpExponent = IS.randomFloat(0.05, 0.1);

        // TODO: envelope presets? (keyStrike for something like inverseSine, pad for something slow)
        buffer.ramp(0, 1, rampUpEnd, rampUpEnd, rampUpExponent, rampDownExponent).multiply();

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

    oceanWaves(siblingContext)
    {
        let IS = siblingContext;

        let buffer = IS.createBuffer(1, 1);

        // Create noiseBuffer
        let noiseBuffer = IS.createBuffer(1, 1);

        noiseBuffer.noise().fill();
        noiseBuffer.inverseSawtooth(4).multiply();

        // Create fmBuffer
        let fmBuffer = IS.createBuffer(1, 1);
        fmBuffer.frequencyModulatedSine(5, 3.5, 2.13).fill();

        let rampUpEnd = IS.randomFloat(0.05, 0.15);
        let rampDownExponent = IS.randomFloat(2, 5);
        let rampUpExponent = IS.randomFloat(0.05, 0.1);

        // TODO: envelope presets? (keyStrike for something like inverseSine, pad for something slow)
        fmBuffer.ramp(0, 1, rampUpEnd, rampUpEnd, rampUpExponent, rampDownExponent).multiply();

        // Amplitude modulate noise buffer by fmBuffer
        fmBuffer.multiplyBuffer(noiseBuffer);

        // Create lowNoise
        let lowNoise = IS.createBuffer(1, 1);
        lowNoise.noise().fill();
        lowNoise.ramp(0, 1, 0.3, 0.4, 3, 3).multiply();
        lowNoise.constant(0.125).multiply();

        buffer.addBuffer(fmBuffer);
        buffer.addBuffer(lowNoise);

        return buffer;
    }
}
