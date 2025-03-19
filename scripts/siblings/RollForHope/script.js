import { IS } from "../../../script.js";
import { Parameters } from "./Parameters.js";
import { OutputBus } from "./OutputBus.js";
import { Pads } from "./Pads.js";
import { Grid } from "./Grid.js";
import { Keys } from "./Keys.js";

IS.onLoad(roll);

function roll()
{
    OutputBus.Initialize();

    let nLayers = Parameters.Structure.nLayers;
    let Fundamental = Parameters.Tuning.Fundamental;
    let Chord = Parameters.Tuning.Chord;

    console.log(Fundamental, Parameters.Tuning.Tonic, Parameters.Tuning.Mode);

    Pads(nLayers, Fundamental, Chord);
    Keys(nLayers, Fundamental, Chord);

    Grid(Fundamental * 2, Chord);
}
