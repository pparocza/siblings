import { IS_Visualizer } from "../../visualizer/IS_Visualizer";

let networkVisualizer = IS_Visualizer.visualizer.Network;

IS_Visualizer.visualizer = networkVisualizer.visualize;