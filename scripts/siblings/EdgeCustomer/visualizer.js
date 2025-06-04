import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";
import {IS} from "../../../script";

let networkVisualizer = IS_Visualizer.visualizer.Network;

IS.onReady(initialize);

networkVisualizer.nodeScale = 4;

networkVisualizer.showConnections = false;

networkVisualizer.xPosition = 0;
networkVisualizer.yPosition = 0;

networkVisualizer.columnSpacing = 0;
networkVisualizer.rowSpacing = 0;

IS_Visualizer.visualizer = networkVisualizer.visualize;
IS_Visualizer.rotate = true;

function initialize()
{
	networkVisualizer.initialize();
}
