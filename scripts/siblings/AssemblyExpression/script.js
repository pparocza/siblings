import { IS } from "../../../script.js";
import { Piece } from "./parts.js";
import { IS_Visualizer } from "../../visualizer/IS_Visualizer";
IS_Visualizer.visualizer = IS_Visualizer.visualizer.Network.visualize;

IS.onLoad(load);

function load()
{
	const piece = new Piece();
	piece.initMasterChannel();
	piece.initFXChannels();
	piece.load();
	piece.schedule();
}