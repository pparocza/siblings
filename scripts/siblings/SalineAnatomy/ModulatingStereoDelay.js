export class ModulatingStereoDelay
{
    constructor(siblingContext)
    {
        let IS = siblingContext;

        let input = IS.createGain();
        let delay = IS.createStereoDelay();
        let output = IS.createGain();

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

        this.input = input;
        this.delay = delay;
        this.output = output;
        this.delayModulator = delayModulator;
        this.delayModulator2 = delayModulator2;

        this.input.connect(this.delay);
        this.delay.connect(this.output);
    }

    connect(audioNode)
    {
        this.output.connect(audioNode);
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