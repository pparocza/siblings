import { IS_VisualNetwork } from "../elements/IS_VisualNetwork.js";
import { SIBLING_CONTEXT } from "../IS_VisualizerContext.js";
import { IS_VisualizerParameters } from "../IS_VisualizerParameters.js";

// TODO: figure out what's going on with "this" not existing in the context
let COLUMN_SPACING = 0.5 * 0.75 * 1.25;
let ROW_SPACING = -0.35 * 0.8 * 2;
let X_POSITION = -0.15;
let Y_POSITION = 1.5;

let SHOW_CONNECTIONS = true;
let VISUAL_NETWORKS = [];

let RANDOM_ROTATE = false;

let TRANSPARENCY_AMPLITUDE_THRESHOLD = 0;

export const IS_NetworkVisualizer =
{
	get xPosition() { return X_POSITION; },
	set xPosition(value) { X_POSITION = value; },

	get yPosition() { return Y_POSITION; },
	set yPosition(value) { Y_POSITION = value; },

	get columnSpacing() { return COLUMN_SPACING; },
	set columnSpacing(value) { COLUMN_SPACING = value; },

	get rowSpacing() { return ROW_SPACING; },
	set rowSpacing(value) { ROW_SPACING = value; },

	get showConnections() { return SHOW_CONNECTIONS; },
	set showConnections(value) { SHOW_CONNECTIONS = value; },

	get nodeHeight() { return IS_VisualizerParameters.Node.Height; },
	set nodeHeight(value) { IS_VisualizerParameters.Node.Height = value; },

	get nodeWidth() { return IS_VisualizerParameters.Node.Width; },
	set nodeWidth(value) { IS_VisualizerParameters.Node.Width = value; },

	get nodeScale() { return IS_VisualizerParameters.Node.Scale; },
	set nodeScale(value) { IS_VisualizerParameters.Node.Scale = value; },

	get randomRotate() { return RANDOM_ROTATE; },
	set randomRotate(value) { RANDOM_ROTATE = value; },

	get transparencyAmplitudeThreshold() { return TRANSPARENCY_AMPLITUDE_THRESHOLD; },
	set transparencyAmplitudeThreshold(value) { TRANSPARENCY_AMPLITUDE_THRESHOLD = value; },

	visualize() {},

	initialize()
	{
		let networkRegistry = SIBLING_CONTEXT.NetworkRegistry;

		for(let networkIndex = 0; networkIndex < networkRegistry.nNetworks; networkIndex++)
		{
			let iSNetwork = networkRegistry.getNetwork(networkIndex);
			let visualNetwork = new IS_VisualNetwork(iSNetwork, X_POSITION, Y_POSITION);
			visualNetwork.transparencyAmplitudeThreshold = TRANSPARENCY_AMPLITUDE_THRESHOLD;
			visualNetwork.showConnections = SHOW_CONNECTIONS;

			visualNetwork.columnSpacing = COLUMN_SPACING;
			visualNetwork.rowSpacing = ROW_SPACING;

			if(RANDOM_ROTATE)
			{
				visualNetwork.randomRotate = true;
			}

			visualNetwork.draw();

			VISUAL_NETWORKS.push(visualNetwork);
		}
	},
}

