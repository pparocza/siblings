import { IS } from "../../../script.js";
import { BufferPresets } from "../../presets/BufferPresets.js";

IS.onLoad(companion);

function companion()
{
    let fundamental = 1200;

    let waveBuffer = BufferPresets.oceanWaves(IS);

    let bufferSource = IS.createBufferSource(waveBuffer);
    bufferSource.loop = true;
    bufferSource.playbackRate = 0.125;
    bufferSource.volume = -32;

    let reverb = IS.createConvolver();
    reverb.wetMix = 0.25;

    waveBuffer.print();

    IS.connectSeries(bufferSource, reverb, IS.output);

    IS.scheduleStart(bufferSource, 0);
}
