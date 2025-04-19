import { IS } from "../../../script.js";

export const Parameters =
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
