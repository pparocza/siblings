import { IS_Visualizer } from "../../visualizer/IS_Visualizer";

let visualizer = IS_Visualizer.visualizer.Network;

visualizer.yPosition = 1.6;
visualizer.showConnections = false;
visualizer.nodeHeight = 1;
visualizer.nodeWidth = 1;
visualizer.nodeScale = 0.8;
visualizer.columnSpacing *= 0.35;
visualizer.rowSpacing *= 1.5;

IS_Visualizer.visualizer = visualizer.visualize;