import { IS } from "../../../script.js";
import { UPLOADED_CONFIG } from "../../UI/UI.js";

// TODO: Seems likely this can be refactored to be a bit less janky
export const Parameters = UPLOADED_CONFIG !== null ? UPLOADED_CONFIG :
{
	Fundamental: 2 * IS.Random.Float(160, 180),
	Division: IS.Random.Int(5, 11),
	Rate: IS.Random.Float(0.2, 0.3),

	get EndTime()
	{
		return this.Division * 14;
	}
}

IS.ControlParameters.createParametersFromObject(Parameters);
