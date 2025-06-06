import { IS } from "../../../script.js";
import { Piece } from "./parts.js";
import * as Visualizer from "./visualizer.js";


if (!navigator.mediaDevices?.enumerateDevices) {
	console.log("enumerateDevices() not supported.");
} else {
	console.log("Enumerate devices!");
	// List cameras and microphones.
	navigator.mediaDevices
		.enumerateDevices()
		.then((devices) => {
			devices.forEach((device) => {
				console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
			});
		})
		.catch((err) => {
			console.error(`${err.name}: ${err.message}`);
		});
}

IS.onLoad(load);


function load()
{
	const piece = new Piece();
	piece.initMainChannel();
	piece.initFXChannels();
	piece.load();
	piece.schedule();
}