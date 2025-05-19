import { IS } from "../../../script.js";
import { Piece } from "./sections.js";

IS.onLoad(load);

function load()
{
	const piece = new Piece();
	piece.initMasterChannel();
	piece.initParams();
	piece.schedule();
}