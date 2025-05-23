import { IS } from "../../../script.js";
import { UPLOADED_CONFIG } from "../../UI/UI.js";

// TODO: Seems likely this can be refactored to be a bit less janky
export const Parameters = UPLOADED_CONFIG !== null ? UPLOADED_CONFIG :
{
	Fundamental: 0.5 * IS.Random.Float( 350 , 450 ),
	Rate: IS.Random.Float(0.124, 0.126)
}

IS.ControlParameters.createParametersFromObject(Parameters);
