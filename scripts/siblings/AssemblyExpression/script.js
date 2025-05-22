import { IS } from "../../../script.js";
import { Piece } from "./parts.js";
import * as Visualizer from "./visualizer.js";

IS.onLoad(load);

function load()
{
	const piece = new Piece();
	piece.initMainChannel();
	piece.initFXChannels();
	piece.load();
	piece.schedule();
}