import * as MAIN from "../script.js";
import * as CONFIG_HANDLER from "./siblingConfigs.js";
import { SIBLING_OPTIONS_ARRAY } from "./siblings/SiblingOptions.js";
export let UPLOADED_CONFIG = null;

const LOAD_BUTTON = document.querySelector('.LOAD_BUTTON');
LOAD_BUTTON.disabled = true;
LOAD_BUTTON.onclick = handleLoad;

const SELECTION_DIV = document.querySelector('.SELECTION_DIV');
const PLAYBACK_CONTROLS = document.querySelector('.PLAYBACK_CONTROLS');

const DRAG_AND_DROP = document.querySelector('.DRAG_AND_DROP');
DRAG_AND_DROP.ondrop = function (event)
{
	event.preventDefault();
	CONFIG_HANDLER.configUploadCallback(event, SIBLING_SELECTION_DROPDOWN);
};

DRAG_AND_DROP.ondragover = function (event)
{
	// TODO: color change on drag-over
	event.preventDefault();
	DRAG_AND_DROP.style.background = "rgba(100, 100, 100, 0.6)";
}

DRAG_AND_DROP.ondragleave = function (event)
{
	// TODO: color change on drag-over
	event.preventDefault();
	DRAG_AND_DROP.style.background = "rgba(100, 100, 100, 0)";
}

export const UPLOAD_BUTTON = document.querySelector('.UPLOAD_BUTTON');
UPLOAD_BUTTON.addEventListener('change', function (event)
{
	CONFIG_HANDLER.configUploadCallback(event, SIBLING_SELECTION_DROPDOWN);
});

export const DOWNLOAD_BUTTON = document.querySelector('.DOWNLOAD_BUTTON');
DOWNLOAD_BUTTON.addEventListener('click', function (event)
{
	CONFIG_HANDLER.downloadButtonCallback(TITLE_DIV.innerHTML);
});
DOWNLOAD_BUTTON.hidden = true;

export const TITLE_DIV = document.querySelector('.TITLE_DIV');
let TITLE = "";

const START_BUTTON = document.querySelector('.START_BUTTON');
const START_STRING = "start";
const STOP_STRING = "stop";
const LOAD_STRING = "load";
const LOADING_STRING = "...loading";
const RESET_STRING = "reset";

const VOLUME_SLIDER = document.querySelector('.VOLUME_SLIDER');
const VOLUME_SLIDER_INITIAL_VALUE = 0.7;
const VOLUME_SLIDER_DISPLAY = document.querySelector('.VOLUME_DISPLAY');

export const SIBLING_SELECTION_DROPDOWN = document.querySelector('.SIBLING_SELECTION_MENU');
const SIBLING_SCRIPT = document.querySelector('.SIBLING_SCRIPT');
const SIBLING_PATH = './scripts/siblings'
let SCRIPT_SRC = "";

const PARAMETER_DISPLAY_DIV = document.querySelector('.CONTROL_PARAMETER_DISPLAY_DIV');

const PROGRESS_DIV = document.querySelector('.PROGRESS_DIV');
const PROGRESS_BAR = document.querySelector('.PROGRESS_BAR');

function initializeUI()
{
	initializePieceSelectionDropdown();
	initializeStartButton();
	initializeVolumeSlider()
	initializeProgressBar();
}

async function initializePieceSelectionDropdown()
{
	for (let siblingOptionIndex = 0; siblingOptionIndex < SIBLING_OPTIONS_ARRAY.length; siblingOptionIndex++)
	{
		let option = document.createElement('option');
		let siblingOption = SIBLING_OPTIONS_ARRAY[siblingOptionIndex];
		option.value = siblingOption.directory;
		option.innerHTML = siblingOption.title;
		SIBLING_SELECTION_DROPDOWN.appendChild(option);
	}

	SIBLING_SELECTION_DROPDOWN.oninput = handleSiblingSelection;
}

export function handleConfigLoaded(configJSON)
{
	UPLOADED_CONFIG = configJSON;

	handleSiblingSelection();
	handleLoad();
}

function handleSiblingSelection()
{
	requestSiblingScript();
	setTitle();
}

export async function requestSiblingScript()
{
	SCRIPT_SRC = SIBLING_PATH + "/" + SIBLING_SELECTION_DROPDOWN.value + "/script.js";

	let isSelectSibling = SIBLING_SELECTION_DROPDOWN.value === SIBLING_SELECTION_DROPDOWN[0].value;

	if(isSelectSibling)
	{
		LOAD_BUTTON.disabled = true;
		return;
	}

	const scriptRequest = await fetch(SCRIPT_SRC);
	scriptRequest.async = false;

	if (scriptRequest.ok)
	{
		LOAD_BUTTON.disabled = false;
	}
	else
	{
		LOAD_BUTTON.disabled = true;
	}
}

function setTitle()
{
	let selectedIndex = SIBLING_SELECTION_DROPDOWN.selectedIndex;
	TITLE = SIBLING_SELECTION_DROPDOWN.options[selectedIndex].text;
}

function initializeStartButton()
{
	START_BUTTON.disabled = true;

	START_BUTTON.onclick = function()
	{
		switch (START_BUTTON.innerHTML)
		{
			case (START_STRING):
				handleStart();
				break;
			case (RESET_STRING):
				handleReset();
				break;
			case (STOP_STRING):
				handleStop();
				break;
			default:
				break;
		}
	}
}

function initializeVolumeSlider()
{
	VOLUME_SLIDER.value = VOLUME_SLIDER_INITIAL_VALUE;
	setVolume(VOLUME_SLIDER_INITIAL_VALUE);

	VOLUME_SLIDER.oninput = function()
	{
		setVolume(VOLUME_SLIDER.value);
	}
}

function handleLoad()
{
	loadOnline();
}

function loadOnline()
{
	SIBLING_SELECTION_DROPDOWN.disabled = true;
	SIBLING_SCRIPT.src = SCRIPT_SRC;
	SIBLING_SELECTION_DROPDOWN.remove();
	TITLE_DIV.innerHTML = TITLE;

	SELECTION_DIV.hidden = true;
	PLAYBACK_CONTROLS.hidden = false;

	setStartButton(LOADING_STRING, true);

	MAIN.IS.onReady(hideProgressBar);
	MAIN.IS.onReady(setStartButtonReady);
	MAIN.IS.onReady(showDownloadButton);

	// TODO: this is currently making sure load doesn't happen before the SCRIPT_SRC is loaded -> FIX IT!!!
	setTimeout(()=>
	{
		displayControlParameters();
		MAIN.load();
	}, 500);

}

function handleStart()
{
	startOnline();
	setStartButton(STOP_STRING, false);
}

function startOnline()
{
	setStartButton(STOP_STRING, false);
	MAIN.start();
}

function handleReset()
{
	location.reload();
}

function handleStop()
{
	MAIN.stop();
	setStartButton(RESET_STRING, false);
}

function setStartButton(label, disabled)
{
	START_BUTTON.innerHTML = label;
	START_BUTTON.disabled = disabled;
}

function setStartButtonReady()
{
	setStartButton(START_STRING, false);
}

function showDownloadButton()
{
	DOWNLOAD_BUTTON.hidden = false;
}

function hideUploadButton()
{
	UPLOAD_BUTTON.hidden = true;
}

function setVolume(volumeSliderValue)
{
	let amplitudeScaler = Math.pow(volumeSliderValue, 2);
	let amplitudeToDecibels = MAIN.IS.Utility.AmplitudeToDecibels(amplitudeScaler);
	MAIN.IS.outputVolume = amplitudeToDecibels;
	VOLUME_SLIDER_DISPLAY.innerHTML = parseInt(amplitudeToDecibels) + " dB";
}

function initializeProgressBar()
{
	MAIN.IS.MessageBus.addListener.BufferOperationQueue.Progress = new ValueListener(PROGRESS_BAR);
}

function hideProgressBar()
{
	PROGRESS_DIV.hidden = true;
}

class ValueListener
{
	constructor(progressBar)
	{
		this._progressBar = progressBar;
	}

	getValue(value)
	{
		if(PROGRESS_DIV.hidden)
		{
			PROGRESS_DIV.hidden = false;
		}

		this._progressBar.value = value * 100;
	}
}

function displayControlParameters()
{
	let siblingConfig = MAIN.IS.SiblingConfig;

	for(const [parameterDisplayName, parameterValue] of Object.entries(siblingConfig))
	{
		if(parameterDisplayName === "Name")
		{
			continue;
		}

		let displayValue = parameterValue;

		if(typeof parameterValue === "number")
		{
			displayValue = Math.round(displayValue * 100);
			displayValue /= 100;
		}

		let parameterElement = document.createElement('p');
		parameterElement.innerHTML = parameterDisplayName + ": " + displayValue.toString();
		PARAMETER_DISPLAY_DIV.appendChild(parameterElement);
	}
}

initializeUI();

