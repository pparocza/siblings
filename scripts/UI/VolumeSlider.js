import * as MAIN from "../../script";

export const SLIDER = document.querySelector('.VOLUME_SLIDER');
const VOLUME_SLIDER_INITIAL_VALUE = 0.7;
const VOLUME_SLIDER_DISPLAY = document.querySelector('.VOLUME_DISPLAY');

export function initialize()
{
	SLIDER.value = VOLUME_SLIDER_INITIAL_VALUE;
	setVolume(VOLUME_SLIDER_INITIAL_VALUE);

	SLIDER.oninput = function()
	{
		setVolume(SLIDER.value);
	}
}

function setVolume(volumeSliderValue)
{
	let amplitudeScaler = Math.pow(volumeSliderValue, 2);
	let amplitudeToDecibels = MAIN.IS.Utility.AmplitudeToDecibels(amplitudeScaler);
	MAIN.IS.outputVolume = amplitudeToDecibels;
	VOLUME_SLIDER_DISPLAY.innerHTML = parseInt(amplitudeToDecibels) + " dB";
}