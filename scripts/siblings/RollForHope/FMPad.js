import { BufferPresets } from "../../presets/BufferPresets.js";
import { IS_Node } from "../../../infinitesibling";
import { ConvolverVoice } from "./ConvolverVoice.js";

export class FMPad extends IS_Node
{
    constructor(siblingContext, nLayers, fundamental, chord)
    {
        super(siblingContext);

        let fmPadSource = siblingContext.createBufferSource
        (
            BufferPresets.randomFMPad(siblingContext)
        );

        fmPadSource.playbackRate = 0.25;
        fmPadSource.loopEnd = 20; // fmPadSource.buffer.duration;
        fmPadSource.volume = 6;

        let convolver = siblingContext.createConvolver
        (
            new ConvolverVoice(siblingContext, nLayers, fundamental, chord)
        );

        this._fmPadSourceOutput = siblingContext.createGain();
        this._convolverOutput = siblingContext.createGain();

        this._fmPadSource = fmPadSource;

        fmPadSource.connect(convolver);
        fmPadSource.connect(this._fmPadSourceOutput);

        convolver.connect(this._convolverOutput);
    }

    scheduleStart(time, duration)
    {
        this._fmPadSource.scheduleStart(time, duration);
    }

    scheduleStop(time)
    {
        this._fmPadSource.scheduleStop(time);
    }

    get sourceOutput()
    {
        return this._fmPadSourceOutput;
    }

    get convolverOutput()
    {
        return this._convolverOutput;
    }
}