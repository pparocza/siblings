import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS_VisualNode } from "./IS_VisualNode.js";
import { IS_VisualConnection } from "./IS_VisualConnection.js";
import { IS_VisualizerParameters } from "../IS_VisualizerParameters";

let MASTER_PARAMETERS = IS_VisualizerParameters;

export class IS_VisualNetwork extends IS_VisualElement
{
	constructor
	(
		audioNodeRegistryData, xPosition = 0, yPosition = 0
	)
	{
		super();

		this._xPosition = xPosition;
		this._yPosition = yPosition;

		if (this.visualizerContext.isRegistered(audioNodeRegistryData))
		{
			let currentPosition = this.visualizerContext.getElementPosition(audioNodeRegistryData);
			this._xPosition = currentPosition[0];
			this._yPosition = currentPosition[1];
		}

		let connections = audioNodeRegistryData.connections;

		let horizontalSpacing = MASTER_PARAMETERS.VisualNetwork.HorizontalSpacing;
		let verticalSpacing = MASTER_PARAMETERS.VisualNetwork.VerticalSpacing;

		let nConnections = connections.length;

		let offsetMultiplier =  nConnections === 1 ? 0 : nConnections - Math.ceil(nConnections / 2);
		offsetMultiplier -= nConnections % 2 === 0 ? 0.5 : 0;

		let xOffset = this._xPosition - (horizontalSpacing * offsetMultiplier);
		let yOffset = this._yPosition + verticalSpacing;

		this._nodeRegistryData = audioNodeRegistryData;
		this._connections = connections;
		this._nConnections = nConnections;

		this._xOffset = xOffset;
		this._yOffset = yOffset;
		this._verticalSpacing = verticalSpacing;
		this._horizontalSpacing = horizontalSpacing;

		if(!this.visualizerContext.isRegistered(audioNodeRegistryData))
		{
			this.drawBaseNode();
		}

		this.drawConnectedNodes();
		this.drawConnections();
	}

	drawBaseNode()
	{
		this._baseNode = new IS_VisualNode
		(
			this._nodeRegistryData, this._xPosition, this._yPosition
		);

		this._baseNode.addToScene();
	}

	drawConnectedNodes()
	{
		for(let connectionIndex = 0; connectionIndex < this._nConnections; connectionIndex++)
		{
			let connectionRegistryData = this._connections[connectionIndex];

			if(connectionRegistryData === undefined || this.visualizerContext.isRegistered(connectionRegistryData))
			{
				continue;
			}

			let nodeXPosition = (connectionIndex * this._horizontalSpacing) + this._xOffset;
			let nodeYPosition = this._yOffset;

			let visualNode = new IS_VisualNode
			(
				connectionRegistryData, nodeXPosition, nodeYPosition
			);

			new IS_VisualNetwork(connectionRegistryData, nodeXPosition, nodeYPosition);

			visualNode.addToScene();
		}
	}

	drawConnections()
	{
		let startPoint = [this._xPosition, this._yPosition];

		for(let connectionIndex = 0; connectionIndex < this._nConnections; connectionIndex++)
		{
			let connectionRegistryData = this._connections[connectionIndex];

			if(connectionRegistryData === undefined)
			{
				continue;
			}

			let connectionCoordinate = this.visualizerContext.getElementPosition(connectionRegistryData);

			let visualConnection = new IS_VisualConnection
			(
				startPoint[0], startPoint[1], connectionCoordinate[0], connectionCoordinate[1]
			)

			visualConnection.addToScene();
		}
	}
}