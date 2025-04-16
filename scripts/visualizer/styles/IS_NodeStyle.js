import { IS_VisualizerParameters } from "../IS_VisualizerParameters.js";

const NodeDefaultSize =
{
	width: IS_VisualizerParameters.Node.Width,
	height: IS_VisualizerParameters.Node.Height,
	scale: IS_VisualizerParameters.Node.Scale
};

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

		this._size = NodeDefaultSize;
	};

	get size() { return this._size; };
	get scale() { return this._size.scale };
	get width() { return this._size.width * this.scale };
	get height() { return this._size.height * this.scale };

	get text() { return this._text };
	get colorRGB() { return this._colorRGB };
	get abbreviatedText() { return this._abbreviatedText; };
}