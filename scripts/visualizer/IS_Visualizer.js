import { IS_VisualizerContext } from "./IS_VisualizerContext.js";
import { IS } from "../../script";

export const IS_Visualizer = new IS_VisualizerContext();
console.log("Loaded Visualizer Context!");
IS.onReady(IS_Visualizer.visualize);

// TODO: Interactions: floating display on hover, amplitude response
// TODO: Class, config, enable
