import { IS_VisualElement } from "./IS_VisualElement.js";

export class IS_VisualConnection extends IS_VisualElement
{
	constructor(startX, startY, endX, endY)
	{
		super();

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