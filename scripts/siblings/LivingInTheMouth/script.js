import { IS } from "../../../script.js";
import { Piece } from "./sections.js";
import { IS_Visualizer } from "../../visualizer/IS_Visualizer";

let visualizer = IS_Visualizer.visualizer.Network;
IS_Visualizer.visualizer = visualizer.visualize;

IS.onLoad(load);

function load()
{
	const piece = new Piece();
	piece.initializeMainChannel();
	piece.initializeParameters();
	piece.schedule();
}