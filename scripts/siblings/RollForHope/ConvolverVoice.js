export class ConvolverVoice
{
    constructor(siblingContext, nLayers, fundamental, scale)
    {
        let convolutionBuffer = siblingContext.createBuffer(1, 1);

        const octaveOptions = siblingContext.array(1, 0.5, 2);

        let carrierFrequencyArray = [];
        let modulatorFrequencyArray = [];
        let modulatorGainArray = [];

        let detuneRangeMin = 1.001;
        let detuneRangeMax = 1.007;

        for (let layer = 0; layer < nLayers; layer++)
        {
            let octave = octaveOptions.random();

            let carrierFrequency = fundamental * scale.urn() * octave;
            let modulatorFrequency = siblingContext.randomFloat(5, 10);
            let modulationGain = siblingContext.randomFloat(0.125, 0.25);

            carrierFrequencyArray.push
            (
                carrierFrequency, carrierFrequency * siblingContext.randomFloat(detuneRangeMin, detuneRangeMax)
            );

            modulatorFrequencyArray.push
            (
                modulatorFrequency, modulatorFrequency * siblingContext.randomFloat(detuneRangeMin, detuneRangeMax)
            );

            modulatorGainArray.push
            (
                modulationGain, modulationGain * siblingContext.randomFloat(detuneRangeMin, detuneRangeMax)
            );
        }

        convolutionBuffer.frequencyModulatedSine
        (
            carrierFrequencyArray, modulatorFrequencyArray, modulatorGainArray
        ).add();

        this._convolutionBuffer = convolutionBuffer;

        return this._convolutionBuffer;
    }
}