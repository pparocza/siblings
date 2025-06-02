import { IS_Visualizer } from "../IS_Visualizer.js";

export class IS_VisualElement
{
	constructor()
	{
		this._visualizerContext = IS_Visualizer;
		this._isRegistered = false;
		this._isAnimated = false;
	}

	get visualizerContext() { return this._visualizerContext; };
	get three() { return this._visualizerContext.three; }
	get isRegistered() { return this._visualizerContext.isRegistered(this); };
	get isAnimated() { return this._isAnimated; };

	register()
	{
		this.visualizerContext.registerVisualElement(this);
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