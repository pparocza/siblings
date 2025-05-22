import { IS_VisualNetwork } from "../elements/IS_VisualNetwork.js";
import { SIBLING_CONTEXT } from "../IS_VisualizerContext.js";

// TODO: figure out what's going on with "this" not existing in the context
let COLUMN_SPACING = 0.5 * 0.75 * 1.25;
let ROW_SPACING = -0.35 * 0.8 * 2;
let X_POSITION = -0.15;
let Y_POSITION = 1.5;

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

	visualize()
	{
		let networkRegistry = SIBLING_CONTEXT.NetworkRegistry;

		for(let networkIndex = 0; networkIndex < networkRegistry.nNetworks; networkIndex++)
		{
			let iSNetwork = networkRegistry.getNetwork(networkIndex);
			let visualNetwork = new IS_VisualNetwork(iSNetwork, X_POSITION, Y_POSITION);

			visualNetwork.columnSpacing = COLUMN_SPACING;
			visualNetwork.rowSpacing = ROW_SPACING;

			visualNetwork.draw();
		}
	}
}