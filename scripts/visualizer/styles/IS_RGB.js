export const IS_RGB =
{
	Red: [1, 0, 0],
	Green: [0, 1, 0],
	Blue: [0, 0, 1],

	Black: [0, 0, 0],
	White: [1, 1, 1],

	get EffectDefault() { return this.Blue; },
	get SourceDefault() { return this.Red; },

	get BiquadFilter() { return [0, 0.1, 1]; },
	get Convolver() { return [0, 0.2, 1]; },
	get Delay() { return [0, 0.2, 1]; },
	get Gain() { return [0.6, 0.1, 1]; },
	get StereoPanner() { return [0, 0.3, 1]; },
	get WaveShaper() { return [0.1, 0.1, 1.]; },
}