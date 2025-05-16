import { IS } from "../../../script.js";
import { Piece } from "./parts.js";

const piece = new Piece();

IS.onLoad(load);
IS.onStart(runPatch);

function load()
{
	piece.initMainChannel();
	piece.initFXChannels();
	piece.load();
	piece.start();
}

function runPatch()
{
	// piece.start();
}