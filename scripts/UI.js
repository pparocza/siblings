import * as MAIN from "../script.js";
import * as CONFIG_HANDLER from "./siblingConfigs.js";
import { SIBLING_OPTIONS_ARRAY } from "./siblings/SiblingOptions.js";
export let UPLOADED_CONFIG = null;

export const UPLOAD_BUTTON = document.querySelector('.UPLOAD_BUTTON');
UPLOAD_BUTTON.addEventListener('change', function (event)
{
	CONFIG_HANDLER.uploadButtonCallback(event, SIBLING_SELECTION_DROPDOWN);
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

const ONLINE_BUTTON = document.querySelector('.ONLINE_BUTTON');
const ONLINE_STRING = "online";
const OFFLINE_STRING = "offline";

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
	initializeOnlineButton();
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

export async function requestSiblingScript(siblingName)
{
	SCRIPT_SRC = SIBLING_PATH + "/" + SIBLING_SELECTION_DROPDOWN.value + "/script.js";

	const scriptRequest = await fetch(SCRIPT_SRC);
	scriptRequest.async = false;

	if (scriptRequest.ok)
	{
		setStartButton(LOAD_STRING, false);
	}
	else
	{
		setStartButton(LOAD_STRING, true);
	}
}

function setTitle()
{
	let selectedIndex = SIBLING_SELECTION_DROPDOWN.selectedIndex;
	TITLE = SIBLING_SELECTION_DROPDOWN.options[selectedIndex].text;
}

function initializeOnlineButton()
{
	ONLINE_BUTTON.onclick = function()
	{
		ONLINE_BUTTON.innerHTML === ONLINE_STRING ?
			ONLINE_BUTTON.innerHTML = OFFLINE_STRING :
			ONLINE_BUTTON.innerHTML = ONLINE_STRING;
	}
}

function initializeStartButton()
{
	START_BUTTON.disabled = true;

	START_BUTTON.onclick = function()
	{
		switch (START_BUTTON.innerHTML)
		{
			case (LOAD_STRING):
				handleLoad();
				break;
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
	switch(ONLINE_BUTTON.innerHTML)
	{
		case (ONLINE_STRING):
			loadOnline();
			break;
		case (OFFLINE_STRING):
			loadOffline();
			break;
		default:
			break;
	}
}

function loadOnline()
{
	SIBLING_SELECTION_DROPDOWN.disabled = true;
	SIBLING_SCRIPT.src = SCRIPT_SRC;
	SIBLING_SELECTION_DROPDOWN.remove();
	TITLE_DIV.innerHTML = TITLE;

	setStartButton(LOADING_STRING, true);

	hideUploadButton();

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

function loadOffline()
{
	SIBLING_SELECTION_DROPDOWN.disabled = true;
	SIBLING_SCRIPT.src = SCRIPT_SRC;
	setStartButton(LOADING_STRING, true);
	MAIN.IS.onReady(setStartButtonReady);
	MAIN.load();
}

function handleStart()
{
	switch(ONLINE_BUTTON.innerHTML)
	{
		case (ONLINE_STRING):
			startOnline();
			break;
		case (OFFLINE_STRING):
			startOffline();
			break;
		default:
			break;
	}

	setStartButton(STOP_STRING, false);
}

function startOnline()
{
	setStartButton(STOP_STRING, false);
	MAIN.start();
}

function startOffline()
{
	setStartButton(STOP_STRING, false);
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

