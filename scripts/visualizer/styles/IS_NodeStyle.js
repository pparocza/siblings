const NodeDefaultSize = { width: 1.3, height: 0.5, scale: 0.1 * 1.25 };

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