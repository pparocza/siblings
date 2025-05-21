import { IS_VisualNetwork } from "../elements/IS_VisualNetwork.js";
import { SIBLING_CONTEXT } from "../IS_VisualizerContext.js";

// TODO: figure out what's going on with "this" not existing in the context
let COLUMN_SPACING = 0.5 * 0.75 * 1.25;
let ROW_SPACING = -0.35 * 0.8 * 2;

export const IS_NetworkVisualizer =
{
	set columnSpacing(value) { console.log(value); COLUMN_SPACING = value; },
	set rowSpacing(value) { ROW_SPACING = value; },

	get columnSpacing() { return COLUMN_SPACING; },
	get rowSpacing() { return ROW_SPACING; },

	visualize()
	{
		let networkRegistry = SIBLING_CONTEXT.NetworkRegistry;

		for(let networkIndex = 0; networkIndex < networkRegistry.nNetworks; networkIndex++)
		{
			let iSNetwork = networkRegistry.getNetwork(networkIndex);
			let visualNetwork = new IS_VisualNetwork(iSNetwork, -0.15, 1.5);

			visualNetwork.columnSpacing = COLUMN_SPACING;
			visualNetwork.rowSpacing = ROW_SPACING;

			visualNetwork.draw();
		}
	}
}