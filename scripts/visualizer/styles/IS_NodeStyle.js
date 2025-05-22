import { IS_VisualizerParameters } from "../IS_VisualizerParameters.js";

export class IS_NodeStyle
{
	constructor
	(
		text = "",
		colorRGB = [],
		abbreviatedText = ""
	)
	{
		this._text = text;
		this._colorRGB = colorRGB;
		this._abbreviatedText = abbreviatedText;
	};

	get scale() { return IS_VisualizerParameters.Node.Scale; };
	get width() { return IS_VisualizerParameters.Node.Width * this.scale };
	get height() { return IS_VisualizerParameters.Node.Height * this.scale };

	get text() { return this._text };
	get colorRGB() { return this._colorRGB };
	get abbreviatedText() { return this._abbreviatedText; };
}