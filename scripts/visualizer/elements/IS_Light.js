import { IS_VisualElement } from "./IS_VisualElement.js";
import { IS } from "../../../script.js";
// TODO: Manage the "Three context"
import * as THREE from "https://cdn.skypack.dev/three@0.152.0";

export class IS_Light extends IS_VisualElement
{
	constructor(position = [0, 0, 2])
	{
		super();

		this._color = 0xFFFFFF;
		this._intensity = 1;
		this._light = new THREE.DirectionalLight(this._color, this._intensity);
		this._light.position.set(...position);
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
}