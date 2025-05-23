import { IS_VisualizerContext } from "./IS_VisualizerContext.js";
import { IS } from "../../script.js";

export const IS_Visualizer = new IS_VisualizerContext();
console.log("Loaded Visualizer Context!");
IS.onReady(IS_Visualizer.visualize);
