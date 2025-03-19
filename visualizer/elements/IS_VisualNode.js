import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS_NodeStyles } from "../styles/IS_NodeStyles.js";
import { CSS2DObject } from "three/addons";

export class IS_VisualNode extends IS_VisualElement
{
	constructor
	(
		audioNodeRegistryData, xPosition = 0, yPosition = 0
	)
	{
		super(audioNodeRegistryData);

		let audioNode = this.audioNodeRegistryData.audioNode;

		this._style = IS_NodeStyles.getNodeStyle(audioNode);
		let height = this._style.height;
		let width = this._style.width;

		const geometry = new this.visualizerContext.three.BoxGeometry(width, height, 0);
		const material = new this.visualizerContext.three.MeshBasicMaterial();

		// TODO: generalize to getters and setters for IS_VisualElement
		let colorBase = this._style.colorRGB;
		material.color.set(...colorBase);

		let nodeIcon = new this.visualizerContext.three.Mesh(geometry, material);
		nodeIcon.position.x = xPosition;
		nodeIcon.position.y = yPosition;

		if(this.visualizerContext.showLabels)
		{
			this._displayLabel(nodeIcon);
		}

		this.register(audioNodeRegistryData, [xPosition, yPosition]);

		this.animate = this._animationCallback;

		this._nodeIcon = nodeIcon;
		this._geometry = geometry;
		this._material = material;
		this._colorBase = colorBase;

		this.colorAmplitude = 1;
	}

	addToScene()
	{
		this.visualizerContext.addToScene(this._nodeIcon);
	}

	get nodeIcon() { return this._nodeIcon; };

	get scale() { return this._scale; };
	set scale(value)
	{
		this._scale = value;
		this._height *= this._scale;
		this._width *= this._scale;
	};

	get height() { return this._height; };
	set height(value)
	{
		this._height = value * this._scale;
	};

	get width() { return this._width; };
	set width(value)
	{
		this._width = value * this._scale;
	};

	set colorAmplitude(value)
	{
		this._material.color.setRGB
		(
			this._colorBase[0] * value,
			this._colorBase[1] * value,
			this._colorBase[2] * value
		);
	}

	_displayLabel(nodeIcon)
	{
		let nodeDiv = document.createElement( 'nodeDiv' );
		nodeDiv.className = 'NODE_LABEL';
		nodeDiv.textContent = this._style.abbreviatedText;
		nodeDiv.style.backgroundColor = 'transparent';

		let nodeLabel = new CSS2DObject( nodeDiv );
		nodeLabel.position.set(-(this.width * 0.21), nodeIcon.position.y - (this.height * 0.5), 0);
		nodeLabel.layers.set( 0 );

		nodeIcon.add(nodeLabel);
	}

	_animationCallback()
	{
		if(this.audioNodeRegistryData.audioNode.outputValue)
		{
			let value = this.audioNodeRegistryData.audioNode.outputValue;
			this.colorAmplitude = Math.abs(value);
		}
	}
}