import { IS } from "../../../script.js";
import { UPLOADED_CONFIG } from "../../UI/UI.js";

// TODO: Seems likely this can be refactored to be a bit less janky
export const Parameters = UPLOADED_CONFIG !== null ? UPLOADED_CONFIG :
{
	NHarmonics: 2,
	Fundamental: IS.Random.Float(210, 230),
	TimeLimit: IS.Random.Float(60, 100),
	NDelayChains: IS.Random.Int(4, 9),
	Rate: IS.Random.Float(0.75, 1.25),
	NChords: IS.Random.Int(4, 8),

	get ChordLength()
	{
		return this.TimeLimit / this.NChords;
	}
}

IS.ControlParameters.createParametersFromObject(Parameters);
