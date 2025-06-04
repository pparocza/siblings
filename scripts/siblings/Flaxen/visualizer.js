import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";
import { IS } from "../../../script.js";

IS.onReady(initialize);

let visualizer = IS_Visualizer.visualizer.Network;
IS_Visualizer.visualizer = visualizer.visualize;

function cool()
{
	visualizer.showConnections = false;
	visualizer.nodeHeight = 1;
	visualizer.nodeWidth = 1;
	visualizer.nodeScale = 2.5;

	visualizer.columnSpacing = 1.15;

	visualizer.yPosition = 1.5;
}

cool();

function initialize()
{
	visualizer.initialize();
}