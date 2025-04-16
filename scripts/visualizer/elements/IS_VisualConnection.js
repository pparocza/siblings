import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS_VisualizerParameters } from "../IS_VisualizerParameters.js";

export class IS_VisualConnection extends IS_VisualElement
{
	constructor(startX, startY, endX, endY)
	{
		super();

		this.createArrow(startX, startY, endX, endY);
	}

	createArrow(startX, startY, endX, endY)
	{
		let parameters = IS_VisualizerParameters;

		let from = new this.visualizerContext.three.Vector3(startX, startY, 0);
		let to = new this.visualizerContext.three.Vector3(endX, endY, 0);
		let direction = to.clone().sub(from);
		let length = direction.length();

		const color = new this.visualizerContext.three.Color();
		color.setRGB(...parameters.Connection.Arrow.ColorRGB);

		let headParameters = parameters.Connection.Arrow.Head;

		const arrowHelper = new this.visualizerContext.three.ArrowHelper
		(
			direction.normalize(), from, length,
			color.getHex(),
			headParameters.Length, headParameters.Width
		);

		this.visualizerContext.addToScene(arrowHelper);
	}

	createLine(startX, startY, endX, endY)
	{
		let points =
		[
			this.createPoint(startX, startY),
			this.createPoint(endX, endY)
		];

		let geometry = new this.visualizerContext.three.BufferGeometry().setFromPoints(points);
		let line = new this.visualizerContext.three.Line(geometry, this.lineMaterial);

		this._line = line;
		this._geometry = geometry;
	}

	get lineMaterial()
	{
		if(this._lineMaterial === null)
		{
			this._lineMaterial = new this.visualizerContext.three.LineBasicMaterial();
			this._lineMaterial.color.set(0.2, 0.4, 0.2);
		}

		return this._lineMaterial;
	}

	addToScene()
	{
		this.visualizerContext.addToScene(this._line);
	}

	createPoint(xPosition, yPosition)
	{
		return new this.visualizerContext.three.Vector2(xPosition, yPosition);
	}
}