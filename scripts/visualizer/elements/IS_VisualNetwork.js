import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS_VisualNode } from "./IS_VisualNode.js";
import { IS_VisualConnection } from "./IS_VisualConnection.js";
import { IS_VisualizerParameters } from "../IS_VisualizerParameters.js";

export class IS_VisualNetwork extends IS_VisualElement
{
	constructor
	(
		iSNetwork, xPosition = 0, yPosition = 0
	)
	{
		super();

		this._iSNetwork = iSNetwork;
		this._iSNetworkAsArray = [];

		this._visualizedNodes = {};

		this._middle = xPosition;
		this._top = yPosition;

		this._iSNetworkToArray(iSNetwork);
	}

	get nRows() { return this._iSNetworkAsArray.length; }
	get top() { return this._top; }
	get middle() { return this._middle; }

	set columnSpacing(value) { this._columnSpacing = value; }
	set rowSpacing(value) { this._rowSpacing = value; }

	get nodeHeight() { return this.nRows; }
	get nodeWidth()
	{
		let width = 0;

		for (let rowIndex = 0; rowIndex < this._iSNetworkAsArray.length; rowIndex++)
		{
			let rowLength = this._iSNetworkAsArray[rowIndex].length;

			if (rowLength > width)
			{
				width = rowLength;
			}
		}

		return width;
	}

	_iSNetworkToArray(iSNetwork)
	{
		for (let rowIndex = 0; rowIndex < iSNetwork.connectionMatrix.nRows; rowIndex++)
		{
			let row = iSNetwork.connectionMatrix.getRow(rowIndex);

			this._iSNetworkAsArray.push([]);

			for(let nodeIndex = 0; nodeIndex < row.length; nodeIndex++)
			{
				let node = row.getNode(nodeIndex);
				this._iSNetworkAsArray[rowIndex].push(node);
			}
		}
	}

	draw()
	{
		this._drawNodes();
		this._drawConnections();
	}

	_drawNodes()
	{
		for(let rowIndex = 0; rowIndex < this._iSNetworkAsArray.length; rowIndex++)
		{
			let row = this._iSNetworkAsArray[rowIndex];
			let rowYPosition = this._calculateRowYPositionFromRowIndex(rowIndex);
			let rowXOffset = this._calculateRowXOffsetFromNNodesInRow(row.length);

			for(let rowPosition = 0; rowPosition < row.length; rowPosition++)
			{
				let nodeMatrixData = row[rowPosition];
				let nodeXPosition = (rowPosition * this._columnSpacing) + rowXOffset;
				this._createVisualNode(nodeMatrixData, nodeXPosition, rowYPosition);
			}
		}
	}

	_drawConnections()
	{
		for(const [matrixDataID, visualizedNode] of Object.entries(this._visualizedNodes))
		{
			let matrixData = visualizedNode.matrixData;
			let toNodes = matrixData.toNodes;

			for(let toNodeIndex = 0; toNodeIndex < toNodes.length; toNodeIndex++)
			{
				let toNodeMatrixData = toNodes[toNodeIndex];

				let visualizedToNode = this._visualizedNodes[toNodeMatrixData.uuid];
				new IS_VisualConnection(visualizedNode.x, visualizedNode.y, visualizedToNode.x, visualizedToNode.y);
			}
		}
	}

	_createVisualNode(nodeMatrixData, xPosition, yPosition)
	{
		let visualNode = new IS_VisualNode(nodeMatrixData.audioNode, xPosition, yPosition);
		visualNode.addToScene();

		this._internalRegisterVisualizedNode(nodeMatrixData, xPosition, yPosition);
	}

	_internalRegisterVisualizedNode(nodeMatrixData, xPosition, yPosition)
	{
		let visualizedNodeData =
		{
			matrixData: nodeMatrixData,
			x: xPosition,
			y: yPosition
		}

		this._visualizedNodes[nodeMatrixData.uuid] = visualizedNodeData;
	}

	_calculateRowYPositionFromRowIndex(rowIndex)
	{
		return this._top + (this._rowSpacing * rowIndex);
	}

	_calculateRowXOffsetFromNNodesInRow(nodesInRow)
	{
		let xOffsetFactor = this._calculateXOffsetFactorFromNNodesInRow(nodesInRow);
		return this._middle - (this._columnSpacing * xOffsetFactor);
	}

	_calculateXOffsetFactorFromNNodesInRow(nodesInRow)
	{
		let oneNodeInRow = nodesInRow === 1;
		let evenNodesInRow = nodesInRow % 2 === 0;
		let xOffsetFactor = 0;

		if(oneNodeInRow)
		{
			xOffsetFactor = 0;
		}
		else
		{
			let nodesToTheLeft = nodesInRow - Math.ceil(nodesInRow * 0.5);
			if(evenNodesInRow)
			{
				xOffsetFactor = nodesToTheLeft - 0.5;
			}
			else
			{
				xOffsetFactor = nodesToTheLeft;
			}
		}

		return xOffsetFactor;
	}
}