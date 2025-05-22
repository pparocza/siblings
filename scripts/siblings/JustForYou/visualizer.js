import { IS_Visualizer } from "../../visualizer/IS_Visualizer";

let visualizer = IS_Visualizer.visualizer.Network;

visualizer.yPosition = 2.5;
IS_Visualizer.visualizer = visualizer.visualize;