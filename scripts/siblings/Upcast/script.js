import { IS } from "../../../script.js";
import { Piece } from "./parts.js";

const piece = new Piece();

IS.onLoad(load);

function load()
{
	piece.initMainChannel();
	piece.initFXChannels();
	piece.load();
	piece.schedule();
}