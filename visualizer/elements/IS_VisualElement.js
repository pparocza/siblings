import { IS_Visualizer } from "../IS_Visualizer.js";

export class IS_VisualElement
{
	constructor(audioNodeRegistryData)
	{
		this._visualizerContext = IS_Visualizer;
		this._audioNodeRegistryData = audioNodeRegistryData;
		this._isRegistered = false;
		this._isAnimated = false;
	}

	get visualizerContext() { return this._visualizerContext; };
	get audioNodeRegistryData() { return this._audioNodeRegistryData; };
	get isRegistered() { return this._visualizerContext.isRegistered(this.audioNodeRegistryData); };
	get isAnimated() { return this._isAnimated; };

	register(audioNodeRegistryData, position)
	{
		this.visualizerContext.registerVisualElement(audioNodeRegistryData, position);
		this._isRegistered = true;
	}

	registerAnimation()
	{
		this.visualizerContext.registerAnimation(this);
		this._isAnimated = true;
	}

	get animate()
	{
		return this._animate;
	}

	set animate(animationCallback)
	{
		this._animate = animationCallback;
		this.registerAnimation();
	}
}