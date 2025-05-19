import { IS } from "../../../script.js";
import { Piece } from "./parts.js";

IS.onLoad(load);

function load()
{
	const piece = new Piece();
	piece.initMasterChannel();
	piece.initFXChannels();
	piece.load();
	piece.schedule();
}