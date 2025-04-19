import * as main from "../script.js";
import { IS } from "../script.js";
import { SIBLING_OPTIONS_ARRAY } from "./siblings/SiblingOptions.js";
import { PIECE_STATS, DOWNLOAD_BUTTON, UPLOAD_BUTTON } from "./configs.js";

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

const TITLE_DIV = document.querySelector('.TITLE_DIV');
let TITLE = "";

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

export function handleSiblingSelection()
{
	requestSiblingScript();
	setTitle();
}

export async function requestSiblingScript()
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

export function loadOnline()
{
	SIBLING_SELECTION_DROPDOWN.disabled = true;
	SIBLING_SCRIPT.src = SCRIPT_SRC;
	SIBLING_SELECTION_DROPDOWN.remove();
	TITLE_DIV.innerHTML = TITLE;
	setStartButton(LOADING_STRING, true);

	hideUploadButton();

	IS.onReady(hideProgressBar);
	IS.onReady(setStartButtonReady);
	IS.onReady(showDownloadButton);

	// TODO: this is currently making sure load doesn't happen before the SCRIPT_SRC is loaded -> FIX IT!!!
	setTimeout(()=>
	{
		main.load();
	}, 500);

}

function loadOffline()
{
	SIBLING_SELECTION_DROPDOWN.disabled = true;
	SIBLING_SCRIPT.src = SCRIPT_SRC;
	setStartButton(LOADING_STRING, true);
	IS.onReady(setStartButtonReady);
	main.load();
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
	main.start();
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
	main.stop();
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
	let amplitudeToDecibels = IS.Utility.AmplitudeToDecibels(amplitudeScaler);
	IS.outputVolume = amplitudeToDecibels;
	VOLUME_SLIDER_DISPLAY.innerHTML = parseInt(amplitudeToDecibels) + " dB";
}

function initializeProgressBar()
{
	IS.MessageBus.addListener.BufferOperationQueue.Progress = new ValueListener(PROGRESS_BAR);
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

initializeUI();

