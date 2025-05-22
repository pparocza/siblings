import { IS } from "../../../script.js";
import { Piece } from "./sections.js";
import * as Visualizer from "./visualizer.js";

IS.onLoad(load);

function load()
{
	const piece = new Piece();
	piece.initializeMainChannel();
	piece.initializeParameters();
	piece.schedule();
}