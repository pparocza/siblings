import { IS } from "../../../script.js";

export class ConvolverVoice
{
    constructor(siblingContext, nLayers, fundamental, scaleArray)
    {
        let convolutionBuffer = siblingContext.createBuffer(1, 1);
        let scale = IS.array(...scaleArray);

        const octaveOptions = siblingContext.array(1, 0.5, 2, 4, 8);

        let detuneRangeMin = 1.001;
        let detuneRangeMax = 1.007;

        for (let layer = 0; layer < nLayers; layer++)
        {
            let octave = octaveOptions.random();

            let carrierFrequency = fundamental * scale.urn() * octave;
            let modulatorFrequency = siblingContext.Random.Float(5, 10);
            let modulationGain = siblingContext.Random.Float(0.125, 0.25);

            convolutionBuffer.suspendOperations();

                convolutionBuffer.frequencyModulatedSine
                (
                    carrierFrequency, modulatorFrequency, modulationGain
                ).add();

                convolutionBuffer.frequencyModulatedSine
                (
                    carrierFrequency * siblingContext.Random.Float(detuneRangeMin, detuneRangeMax),
                    modulatorFrequency * siblingContext.Random.Float(detuneRangeMin, detuneRangeMax),
                    modulationGain * siblingContext.Random.Float(detuneRangeMin, detuneRangeMax)
                ).add();

                if(octave === 4)
                {
                    convolutionBuffer.constant(0.5).multiply();
                }

                if(octave === 8)
                {
                    convolutionBuffer.constant(0.25).multiply();
                }

            convolutionBuffer.applySuspendedOperations().add();
        }

        convolutionBuffer.constant(1 / nLayers).multiply();

        return convolutionBuffer;
    }
}