import { IS } from "../../../script.js";
import { UPLOADED_CONFIG } from "../../UI/UI.js";

// TODO: Seems likely this can be refactored to be a bit less janky
export const Parameters = UPLOADED_CONFIG !== null ? UPLOADED_CONFIG :
{
	Fundamental: IS.Random.Float(400, 470),
	Rate: IS.Random.Float(0.2, 0.25)
}

IS.ControlParameters.createParametersFromObject(Parameters);
