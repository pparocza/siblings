import { IS_Visualizer } from "../../visualizer/IS_Visualizer";

let networkVisualizer = IS_Visualizer.visualizer.Network;
IS_Visualizer.visualizer = networkVisualizer.visualize;

function cool()
{
	networkVisualizer.showConnections = false;
	networkVisualizer.nodeHeight = 1;
	networkVisualizer.nodeWidth = 1;
	networkVisualizer.nodeScale = 2.5;

	networkVisualizer.columnSpacing = 1.15;

	networkVisualizer.yPosition = 1.5;
}

cool();