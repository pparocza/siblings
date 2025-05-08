import { IS_Node } from "../../../infinitesibling";

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
        toneBuffer.frequencyModulatedSine(adjustedCarrierFrequency, adjustedModulatorFrequency, modulationGain).add();

        let rampUpEnd = IS.Random.Float(0.05, 0.15);
        let rampDownExponent = IS.Random.Float(2, 5);
        let rampUpExponent = IS.Random.Float(0.05, 0.1);
        toneBuffer.ramp(0, 1, rampUpEnd, rampUpEnd, rampUpExponent, rampDownExponent).multiply();

        let toneBufferSource = IS.createBufferSource(toneBuffer);
        toneBufferSource.playbackRate = 1 / loopLength;
        toneBufferSource.loop = true;

        this.configureOutput(toneBufferSource);

        this.IS = IS;
        this.toneBufferSource = toneBufferSource;
    }

    scheduleStart(time)
    {
        this.toneBufferSource.scheduleStart(time);
    }

    scheduleStop(time)
    {
        this.toneBufferSource.scheduleStop(time);
    }
}