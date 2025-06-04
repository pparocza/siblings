import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";
import { IS } from "../../../script.js";

IS.onReady(initialize);

let visualizer = IS_Visualizer.visualizer.Flower;
IS_Visualizer.visualizer = visualizer.visualize;

function cool()
{
	visualizer.showConnections = false;
	visualizer.nodeHeight = 1;
	visualizer.nodeWidth = 1;
	visualizer.nodeScale = 0.3;

	visualizer.yPosition = 0;
	visualizer.xPosition = 0;

	visualizer.randomRotate = false;
}

cool();

function initialize()
{
	visualizer.initialize();
}

// TODO: Network flower? push everything out from a radius and rotate a bit, then rotate around radius as well?