import { IS } from "../../../script.js";
import { Piece } from "./parts.js";

const piece = new Piece();

IS.onLoad(load);
IS.onStart(runPatch);

import { IS_Visualizer } from "../../visualizer/IS_Visualizer.js";
IS.onReady(IS_Visualizer.visualize);

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