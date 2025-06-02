import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";
import { IS } from "../../../script.js";

IS.onReady(initialize);

// let visualizer = IS_Visualizer.visualizer.Line;
let visualizer = IS_Visualizer.visualizer.HSL;

IS_Visualizer.visualizer = visualizer.visualize;
IS_Visualizer.cameraPosition = [0, 0, 2];

function initialize()
{
	visualizer.initialize();
}