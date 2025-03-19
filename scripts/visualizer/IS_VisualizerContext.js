import * as THREE from "three";
import { IS } from "../../script";
import { CSS2DRenderer } from "three/addons";
import { IS_VisualNetwork } from "./elements/IS_VisualNetwork.js";
import { IS_VisualizerParameters } from "./IS_VisualizerParameters";

let SIBLING_CONTEXT = IS;
let WAITING_FOR_READY = {}
let MASTER_PARAMETERS = IS_VisualizerParameters;
let SCENE = null;
let CAMERA = null;
let RENDERER = null;
let LABEL_RENDERER = null;
const ANIMATION_REGISTRY = [];
let VISUALIZER_FUNCTION = null;

function READY_CALLBACK(audioNodeUuid)
{
	let nodeData = WAITING_FOR_READY[audioNodeUuid];
	let audioNodeRegistryData = nodeData.audioNodeRegistryData;

	new IS_VisualNetwork
	(
		nodeData.audioNodeRegistryData, nodeData.xPosition, nodeData.yPosition
	);

	delete WAITING_FOR_READY[audioNodeUuid];
}

export class IS_VisualizerContext
{
	constructor(showLabels = false)
	{
		this._createScene();
		this._createCamera();
		this._createRenderer();

		this.showLabels = showLabels;

		this._configureWindow();

		this._visualElementRegistry = [];

		VISUALIZER_FUNCTION = this.gridVisualizer;
	}

	get three() { return THREE; };
	get scene() { return SCENE };
	get camera() { return CAMERA; };
	get renderer() { return RENDERER };
	get labelRenderer() { return LABEL_RENDERER; };
	get siblingContext() { return SIBLING_CONTEXT };

	get showLabels() { return this._showLabels; };
	set showLabels(value)
	{
		if(value === true)
		{
			if(this._labelRenderer === null)
			{
				this._createLabelRenderer();
			}
		}
		else
		{
			this._labelRenderer = null;
		}

		this._showLabels = value;
	};

	visualize()
	{
		VISUALIZER_FUNCTION();
	}

	gridVisualizer()
	{
		let nodeRegistry = SIBLING_CONTEXT.NodeRegistry;

		let horizontalOffset = MASTER_PARAMETERS.Context.HorizontalOffset;
		let verticalOffset = MASTER_PARAMETERS.Context.VerticalOffset;

		let horizontalFactor = MASTER_PARAMETERS.Context.HorizontalFactor;
		let verticalFactor = MASTER_PARAMETERS.Context.VerticalFactor;

		let nodesPerRow = MASTER_PARAMETERS.Context.NodesPerRow;
		let rowNumber = 0;

		let nodeCount = 0;

		for(let registryIndex = 0; registryIndex < nodeRegistry.nNodes; registryIndex++)
		{
			let audioNodeRegistryData = nodeRegistry.getNodeData(registryIndex);

			let columnNumber = nodeCount % nodesPerRow;
			let xPosition = columnNumber * horizontalFactor + horizontalOffset;
			let yPosition = -rowNumber * verticalFactor + verticalOffset;

			let audioNode = audioNodeRegistryData.audioNode;
			if(audioNode.isISBufferSource)
			{
				audioNode.onReady(READY_CALLBACK);
				WAITING_FOR_READY[audioNode.uuid] =
				{
					audioNodeRegistryData: audioNodeRegistryData,
					xPosition: xPosition,
					yPosition: yPosition
				}

				rowNumber = columnNumber === nodesPerRow - 1 ? rowNumber + 1 : rowNumber;
				nodeCount++;
			}
			else
			{
				// new IS_VisualNetwork(audioNodeRegistryData, xPosition, yPosition);
			}


		}
	}

	networkVisualizer()
	{
		let nodeRegistry = SIBLING_CONTEXT.NodeRegistry;

		for(let registryIndex = 0; registryIndex < nodeRegistry.nNodes; registryIndex++)
		{
			let audioNodeRegistryData = nodeRegistry.getNodeData(registryIndex);
			new IS_VisualNetwork(audioNodeRegistryData, 0, 3.25);
		}
	}

	addToScene(visualElement)
	{
		SCENE.add(visualElement)
	}

	_createScene()
	{
		SCENE = new THREE.Scene();
	}

	_createCamera()
	{
		CAMERA = new THREE.PerspectiveCamera
		(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		CAMERA.position.z = 5;
	};

	_createRenderer()
	{
		RENDERER = new THREE.WebGLRenderer();
		RENDERER.setSize(window.innerWidth, window.innerHeight);
		RENDERER.setAnimationLoop(this._animate);
		document.body.appendChild(RENDERER.domElement);
	};

	_setAnimationLoop()
	{
		RENDERER.setAnimationLoop(this._animate);

		if(this.showLabels)
		{
			LABEL_RENDERER.setAnimationLoop(this._animateLabels);
		}
	}

	_createLabelRenderer()
	{
		LABEL_RENDERER = new CSS2DRenderer();

		LABEL_RENDERER.setSize(window.innerWidth, window.innerHeight);
		LABEL_RENDERER.domElement.style.position = 'absolute';
		LABEL_RENDERER.domElement.style.top = '0px';
		document.body.appendChild(LABEL_RENDERER.domElement);
	};

	// TODO: toAnimate array of IS_Animation objects each with animation callbacks
	_animate()
	{
		for(let animationIndex = 0; animationIndex < ANIMATION_REGISTRY.length; animationIndex++)
		{
			ANIMATION_REGISTRY[animationIndex].animate();
		}

		RENDERER.render(SCENE, CAMERA);
	};

	_animateLabels()
	{
		LABEL_RENDERER.render(SCENE, CAMERA);
	}

	_configureWindow()
	{
		window.addEventListener('resize', this._onWindowResize, false);
	};

	_onWindowResize()
	{
		CAMERA.aspect = window.innerWidth / window.innerHeight;
		CAMERA.updateProjectionMatrix();

		RENDERER.setSize(window.innerWidth, window.innerHeight);

		// this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
	};

	registerVisualElement(audioNodeRegistryData, position)
	{
		if(!this.isRegistered(audioNodeRegistryData))
		{
			this._visualElementRegistry[audioNodeRegistryData.hash] = position;
		}
	};

	registerAnimation(visualElement)
	{
		ANIMATION_REGISTRY.push(visualElement);
	}

	isRegistered(audioNodeRegistryData)
	{
		return this._visualElementRegistry[audioNodeRegistryData.hash] !== undefined;
	}

	getElementPosition(audioNodeRegistryData)
	{
		// TODO: make .position an explicit property of an IS_VisualizationRegistryData object
		return this._visualElementRegistry[audioNodeRegistryData.hash];
	}
}