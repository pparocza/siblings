import { IS_Node } from "../../../node_modules/infinitesibling";

export class ToneLoop extends IS_Node
{
    constructor
    (
        siblingContext, loopLength,
        carrierFrequency = 440, modulatorFrequency = 220, modulationGain = 10
    )
    {
        super(siblingContext);

        let IS = siblingContext;

        let adjustedCarrierFrequency = carrierFrequency * loopLength;
        let adjustedModulatorFrequency = modulatorFrequency * loopLength;

        let toneBuffer = IS.createBuffer(1, 1);
        toneBuffer.frequencyModulatedSine(adjustedCarrierFrequency, adjustedModulatorFrequency, modulationGain).fill();

        let rampUpEnd = IS.randomFloat(0.05, 0.15);
        let rampDownExponent = IS.randomFloat(2, 5);
        let rampUpExponent = IS.randomFloat(0.05, 0.1);
        toneBuffer.ramp(0, 1, rampUpEnd, rampUpEnd, rampUpExponent, rampDownExponent).multiply();

        let toneBufferSource = IS.createBufferSource(toneBuffer);
        toneBufferSource.playbackRate = 1 / loopLength;
        toneBufferSource.loop = true;

        this.connectToOutput(toneBufferSource);

        this.IS = IS;
        this.toneBufferSource = toneBufferSource;
    }

    scheduleStart(time)
    {
        this.IS.scheduleStart(this.toneBufferSource, time);
    }

    scheduleStop(time)
    {
        this.IS.scheduleStop(this.toneBufferSource, time);
    }
}