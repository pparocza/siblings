export class IS_VisualizationData
{
	constructor(registryData, xPosition, yPosition)
	{
		this._registryData = registryData;
		this._xPosition = xPosition;
		this._yPosition = yPosition;
	}

	get registryData() { return this._registryData };
	get xPosition() { return this._xPosition };
	get yPosition() { return this._yPosition };
}