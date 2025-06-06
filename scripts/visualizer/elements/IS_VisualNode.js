import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS_NodeStyles } from "../styles/IS_NodeStyles.js";
import { IS } from "../../../script.js";

export class IS_VisualNode extends IS_VisualElement
{
	constructor
	(
		audioNode, xPosition = 0, yPosition = 0
	)
	{
		super();

		this._audioNode = audioNode;

		this._style = IS_NodeStyles.getNodeStyle(audioNode);
		let height = this._style.height;
		let width = this._style.width;

		const geometry = new this.three.BoxGeometry(width, height, 0);
		const material = new this.three.MeshBasicMaterial();
		material.transparent = true;
		material.opacity = 0;

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

		this.register(this, [xPosition, yPosition]);

		this.animate = this._animationCallback;

		this._mesh = nodeIcon;
		this._geometry = geometry;
		this._material = material;
		this._colorBase = colorBase;
		this._width = width;
		this._height = height;
		this._scale = 1;

		this._xPosition = xPosition;
		this._yPosition = yPosition;

		this._transparencyAmplitudeThreshold = 0;

		this.colorAmplitude = 1;
	}

	addToScene()
	{
		this.visualizerContext.addToScene(this._mesh);
	}

	get audioNode() { return this._audioNode; }
	get nodeIcon() { return this._mesh; };

	get xPosition() { return this._xPosition; }
	get yPosition() { return this._yPosition; }

	get transparencyAmplitudeThreshold() { return this._transparencyAmplitudeThreshold; }
	set transparencyAmplitudeThreshold(value) { this._transparencyAmplitudeThreshold = value; }

	get scale() { return this._scale; };
	set scale(value)
	{
		this._scale = value;
		this._height = this._height * this._scale;
		this._width = this._width * this._scale;

		this._mesh.scale.y = this._height;
		this._mesh.scale.x = this._width;
	};

	get height() { return this._height; };
	set height(value)
	{
		this._height = value * this._scale;

		this._mesh.scale.y = this._height;
	};

	get width() { return this._width; };
	set width(value)
	{
		this._width = value * this._scale;
		this._mesh.scale.x = this._width;
	};

	set colorAmplitude(value)
	{
		this._material.color.setRGB
		(
			this._colorBase[0] * value,
			this._colorBase[1] * value,
			this._colorBase[2] * value
		);
	};

	set RGB(rbgArray)
	{
		this._material.color.setRGB(...rbgArray);
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
		this._spectrumRGB();

		if(this.randomRotate)
		{
			this._randomRotate();
		}

	}

	_spectrumRGB()
	{
		if(this.audioNode.frequencyBins)
		{
			let frequencyArray = this.audioNode.frequencyBins;

			let rArray = frequencyArray.slice(0, 5);
			let gArray = frequencyArray.slice(5, 10);
			let bArray = frequencyArray.slice(10, 16);

			let r = rArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
			let g = gArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
			let b = bArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

			r /= rArray.length;
			g /= gArray.length;
			b /= bArray.length;

			let rAmplitude = IS.Utility.DecibelsToAmplitude(r);
			let gAmplitude = IS.Utility.DecibelsToAmplitude(g);
			let bAmplitude = IS.Utility.DecibelsToAmplitude(b);

			let averageAmplitude = (rAmplitude + gAmplitude + bAmplitude) / 3;

			this._material.opacity = averageAmplitude > this._transparencyAmplitudeThreshold ? 1 : 0;

			let rValue = rAmplitude * 100;
			let gValue = gAmplitude * 10000;
			let bValue = bAmplitude * 100000

			this.RGB = [rValue, gValue, bValue];
		}
	}

	randomRotate = false;
	randomRotateInit = false;
	randomRotateRateY = null;
	randomRotateRateX = null;
	randomRotateRateZ = null;

	_randomRotate()
	{
		if(!this.randomRotateInit)
		{
			this.randomRotateRateX = IS.Random.Float(1000, 3000);
			this.randomRotateRateY = IS.Random.Float(5000, 10000);
			this.randomRotateRateZ = IS.Random.Float(5000, 10000);

			this.randomRotateInit = true;
		}

		const time = performance.now();

		// this._nodeIcon.rotation.y = time / this.randomRotateRateY;
		// this._nodeIcon.rotation.x = time / this.randomRotateRateX;
		this._mesh.rotation.z = time / this.randomRotateRateZ;

		this._mesh.scale.x = Math.abs(Math.sin(time / this.randomRotateRateY)) * this._scale;
		this._mesh.scale.y = Math.abs(Math.sin(time / this.randomRotateRateY)) * this._scale;
	}
}