import { IS_Effect } from "../../../node_modules/infinitesibling";

export class ModulatingStereoDelay extends IS_Effect
{
    constructor(siblingContext)
    {
        super(siblingContext);

        let IS = siblingContext;

        let delay = IS.createStereoDelay();

        let delayModulatorBuffer = IS.createBuffer();
        delayModulatorBuffer.noise().amplitude(0.001).add();

        let delayModulatorBuffer2 = IS.createBuffer();
        delayModulatorBuffer2.noise().amplitude(0.001).add();

        let delayModulator = IS.createBufferSource(delayModulatorBuffer);
        delayModulator.connect(delay.delayLeft.node.delayTime);
        delayModulator.playbackRate = IS.randomFloat(0.00025, 0.000125);
        delayModulator.loop = true;

        let delayModulator2 = IS.createBufferSource(delayModulatorBuffer);
        delayModulator2.connect(delay.delayRight.node.delayTime);
        delayModulator2.playbackRate = IS.randomFloat(0.00025, 0.000125);
        delayModulator2.loop = true;

        this.delay = delay;
        this.delayModulator = delayModulator;
        this.delayModulator2 = delayModulator2;

        this.connectInputTo(this.delay);
        this.connectToOutput(this.delay);
    }

    start()
    {
        this.delayModulator.start();
        this.delayModulator2.start();
    }

    set gain(value)
    {
        this.output.gain = value;
    }

    set volume(value)
    {
        this.output.volume = value;
    }
}