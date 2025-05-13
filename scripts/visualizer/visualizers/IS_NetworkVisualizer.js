import { IS_VisualNetwork } from "../elements/IS_VisualNetwork.js";
import { SIBLING_CONTEXT } from "../IS_VisualizerContext.js";

export const IS_NetworkVisualizer =
{
	visualize()
	{
		let networkRegistry = SIBLING_CONTEXT.NetworkRegistry;

		for(let networkIndex = 0; networkIndex < networkRegistry.nNetworks; networkIndex++)
		{
			let iSNetwork = networkRegistry.getNetwork(networkIndex);
			new IS_VisualNetwork(iSNetwork, -0.15, 1.5);
		}
	}
}