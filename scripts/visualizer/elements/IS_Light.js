import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS } from "../../../script.js";
// TODO: Manage the "Three context"
import * as THREE from "https://cdn.skypack.dev/three@0.152.0";

let Y_TIME = 1250;
let Z_TIME = 1500;
let X_TIME = 1000;

export class IS_Light extends IS_VisualElement
{
	constructor(position = [0, 0, 2])
	{
		super();

		this._color = 0xFFFFFF;
		this._intensity = 10;
		this._light = new THREE.DirectionalLight(this._color, this._intensity);
		this._light.position.set(...position);

		this.animate = this._animationCallback;
	}

	get light() { return this._light; }

	set position(xyz) { this._light.position.set(...xyz); }

	set intensity(value)
	{
		this._intensity = value;
		this._light.intensity = this._intensity;
	}

	set color(value)
	{
		this._color = value;
		this._light.color = this._color;
	}

	_animationCallback()
	{
		let time = performance.now();

		this._light.position.set
		(
			Math.sin(time / X_TIME),
			Math.cos(time / Y_TIME),
			Math.abs(Math.sin(time / Z_TIME))
		);

		Y_TIME *= IS.Random.Float(0.999, 1.001);
		X_TIME *= IS.Random.Float(0.999, 1.001);
		Z_TIME *= IS.Random.Float(0.999, 1.001);
	}
}