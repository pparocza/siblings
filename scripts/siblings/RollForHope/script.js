import { IS } from "../../../script.js";
import { Parameters } from "./Parameters.js";
import { OutputBus } from "./OutputBus.js";
import { Pads } from "./Pads.js";
import { Grid } from "./Grid.js";
import { Keys } from "./Keys.js";

IS.onLoad(roll);

import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";
IS.onReady(IS_Visualizer.visualize);

function roll()
{
    OutputBus.Initialize();

    let nLayers = Parameters.Structure.nLayers;
    let Fundamental = Parameters.Tuning.Fundamental;
    let Chord = Parameters.Tuning.Chord;

    Pads(nLayers, Fundamental, Chord);
    Keys(nLayers, Fundamental, Chord);

    Grid(Fundamental * 2, Chord);
}
