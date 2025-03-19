import { IS_Type } from "/node_modules/infinitesibling";
import { IS_RGB } from "./IS_RGB.js";
import { IS_NodeStyle } from "./IS_NodeStyle.js";

const	EffectDefaultStyle = new IS_NodeStyle("Effect", IS_RGB.EffectDefault, "FX");
const	SourceDefaultStyle = new IS_NodeStyle("Source", IS_RGB.SourceDefault, "Src");

const	BiquadFilterStyle = new IS_NodeStyle("BiquadFilter", IS_RGB.BiquadFilter, "F");
const 	ConvolverStyle = new IS_NodeStyle("Convolver", IS_RGB.Convolver, "Cn");
const	DelayStyle = new IS_NodeStyle("Delay", IS_RGB.Delay, "D");
const 	GainStyle = new IS_NodeStyle("Gain", IS_RGB.Gain, "G");
const	StereoPannerStyle = new IS_NodeStyle("StereoPanner", IS_RGB.StereoPanner, "P");
const	WaveShaperStyle = new IS_NodeStyle("WaveShaper", IS_RGB.WaveShaper, "W");

export const IS_NodeStyles =
{
	getNodeStyle(audioNode)
	{
		let nodeType = audioNode.iSType;

		switch(nodeType)
		{
			case(IS_Type.IS_Effect):
				return this.getEffectStyle(audioNode.effectType);
			case(IS_Type.IS_SourceType.IS_BufferSource):
			case(IS_Type.IS_SourceType.IS_Oscillator):
			case(IS_Type.IS_SourceType.IS_ConstantSource):
				return this.getSourceStyle(audioNode);
			default:
				break;
		}
	},

	getSourceStyle(audioNode)
	{
		return SourceDefaultStyle;
	},

	getEffectStyle(effectType)
	{
		let effectTypes = IS_Type.IS_EffectType;

		switch(effectType)
		{
			case(effectTypes.IS_BiquadFilter):
				return BiquadFilterStyle;
			case(effectTypes.IS_Convolver):
				return ConvolverStyle;
			case(effectTypes.IS_Delay):
				return DelayStyle;
			case(effectTypes.IS_Gain):
				return GainStyle;
			case(effectTypes.IS_StereoPanner):
				return StereoPannerStyle;
			case(effectTypes.IS_WaveShaper):
				return WaveShaperStyle;
			default:
				return EffectDefaultStyle;
		}
	},
}
