import { SA_FMReverb } from "./SA_FMReverb.js";
import { IS_Node } from "../../../node_modules/infinitesibling";

export class SalineImpulse extends IS_Node
{
    constructor(siblingContext, rate, fundamental, scale, startTime = 0, stopTime = 0)
    {
        super(siblingContext);

        this.IS = siblingContext;

        let buffer = this.IS.createBuffer(1, 1);
        buffer.impulse().fill();

        let bufferSource = this.IS.createBufferSource(buffer);
        bufferSource.playbackRate = rate;
        bufferSource.loop = true;

        let fmReverb1 = new SA_FMReverb(this.IS, fundamental, scale);
        let fmReverb2 = new SA_FMReverb(this.IS, fundamental * 0.5, scale);

        bufferSource.connect(fmReverb1.node);
        bufferSource.connect(fmReverb2.node);

        fmReverb1.node.connect(this.output);
        fmReverb2.node.connect(this.output);

        this.buffer = buffer;
        this.bufferSource = bufferSource;

        this.scheduleStart(startTime);
        this.scheduleStop(stopTime);
    }

    start()
    {
        this.bufferSource.start();
    }

    scheduleStart(time, duration = 0)
    {
        if(duration > 0)
        {
            this.IS.scheduleStart(this.bufferSource, time, duration);
        }

        this.IS.scheduleStart(this.bufferSource, time);
    }

    scheduleStop(time)
    {
        this.IS.scheduleStop(this.bufferSource, time);
    }
}