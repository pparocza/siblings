import { IS } from "../../../script.js";

IS.onLoad(rollingSines);

function rollingSines()
{
    let rollingFundamental = 110;
    let endTime = 30;

    let rollingSine = new RollingSine(rollingFundamental * 4);
    rollingSine.schedule(0, endTime);

    let rollingSine2 = new RollingSine(rollingFundamental * 1);
    rollingSine2.schedule(0, endTime);

    let rollingSine3 = new RollingSine(rollingFundamental * 2);
    rollingSine3.schedule(0, endTime);

    let rollingSine4 = new RollingSine(rollingFundamental * 4, true);
    rollingSine4.schedule(10, endTime);

    let rollingSine5 = new RollingSine(rollingFundamental * 1, true);
    rollingSine5.schedule(15, endTime);

    let rollingSine6 = new RollingSine(rollingFundamental * 2, true);
    rollingSine6.schedule(20, endTime);
}

class RollingSine
{
    constructor(fundamental, invertEnvelope = false)
    {
        let buffer = IS.createBuffer(1, 1);

        let harmonics = [1, 0.5, 0.25];
        let harmonicVolume = [-6, -6, -6];

        for(let i = 0; i < harmonics.length; i++)
        {
            buffer.frequencyModulatedSine
            (
                fundamental,
                fundamental * IS.randomFloat(0.5, 2),
                IS.randomFloat(0.5, 10)
            ).amplitude(1 / harmonics.length).add();

            buffer.noise().volume(IS.randomFloat(-64, -48)).add();
        }

        if(invertEnvelope)
        {
            buffer.sawtooth(16).multiply();
        }
        else
        {
            buffer.inverseSawtooth(16).multiply();
        }

        this.node = IS.createBufferSource();
        this.node.buffer = buffer;
        this.node.playbackRate = IS.randomFloat(1.11, 1.3);
        this.node.loop = true;

        this.amplitudeModulator = IS.createAmplitudeModulator();
        this.amplitudeModulator.buffer.frequencyModulatedSine(10, 15, 1).add();
        this.amplitudeModulator.buffer.frequencyModulatedSine(8, 13.221, 0.75).multiply();
        this.amplitudeModulator.modulatorPlaybackRate = 0.133;

        let reverb = IS.createConvolver();
        let reverbBuffer = IS.createBuffer(2, 3);
        reverbBuffer.noise().add(0);
        reverbBuffer.noise().add(1);
        reverbBuffer.inverseSawtooth(IS.randomFloat(0.5, 2)).multiply(0);
        reverbBuffer.frequencyModulatedSine(110, 220, 150).volume(-16).add(0);
        reverbBuffer.amplitudeModulatedSine(10, 5, 1).multiply(0);
        reverbBuffer.inverseSawtooth(IS.randomFloat(0.5, 2)).multiply(1);
        reverb.wetMix = 0.3;

        let delay = IS.createStereoDelay(1.25, 0.75, 0.5, 0.5, 2);

        let delayModulatorBuffer = IS.createBuffer();
        delayModulatorBuffer.noise().amplitude(0.001).add();

        let delayModulatorBuffer2 = IS.createBuffer();
        delayModulatorBuffer2.noise().amplitude(0.001).add();

        this.delayModulator = IS.createBufferSource(delayModulatorBuffer);
        this.delayModulator.connect(delay.delayLeft.node.delayTime);
        this.delayModulator.playbackRate = IS.randomFloat(0.00025, 0.000125);
        this.delayModulator.loop = true;

        this.delayModulator2 = IS.createBufferSource(delayModulatorBuffer);
        this.delayModulator2.connect(delay.delayRight.node.delayTime);
        this.delayModulator2.playbackRate = IS.randomFloat(0.00025, 0.000125);
        this.delayModulator2.loop = true;

        this.node.connect(this.amplitudeModulator);
        this.amplitudeModulator.connect(delay);
        delay.connect(reverb);
        reverb.connectToMainOutput();
    }

    schedule(startTime = 0, duration = 0)
    {
        IS.scheduleStart(this.node, startTime, duration);
        IS.scheduleStart(this.amplitudeModulator, startTime + 1, duration);
        IS.scheduleStart(this.delayModulator, startTime + 4, duration);
        IS.scheduleStart(this.delayModulator2, startTime + 4, duration);
    }
}