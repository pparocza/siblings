import * as MAIN from "../../script.js";
import * as BUTTONS from "./Buttons.js";
import * as CONFIG_HANDLER from "../siblingConfigs.js";
import { SIBLING_OPTIONS_ARRAY } from "../siblings/SiblingOptions.js";
export let UPLOADED_CONFIG = null;
let SCRIPT_ELEMENT = null;

const SELECTION_DIV = document.querySelector('.SELECTION_DIV');
const PLAYBACK_CONTROLS = document.querySelector('.PLAYBACK_CONTROLS_DIV');

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

export const TITLE_DIV = document.querySelector('.TITLE_DIV');
let TITLE = "";

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
	BUTTONS.initializeStartButton();
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
		BUTTONS.LOAD_BUTTON.disabled = true;
		return;
	}

	const scriptRequest = await fetch(SCRIPT_SRC);
	scriptRequest.async = false;

	if (scriptRequest.ok)
	{
		BUTTONS.LOAD_BUTTON.disabled = false;
	}
	else
	{
		BUTTONS.LOAD_BUTTON.disabled = true;
	}
}

function setTitle()
{
	let selectedIndex = SIBLING_SELECTION_DROPDOWN.selectedIndex;
	TITLE = SIBLING_SELECTION_DROPDOWN.options[selectedIndex].text;
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

export function handleLoad()
{
	loadScript();
}

function loadScript()
{
	SIBLING_SELECTION_DROPDOWN.disabled = true;
	SIBLING_SELECTION_DROPDOWN.remove();
	SELECTION_DIV.hidden = true;

	TITLE_DIV.innerHTML = "...loading sibling...";

	let script  = document.createElement('script'),
		head = document.head || document.getElementsByTagName('head')[0];
	script.src = SCRIPT_SRC;
	script.type = "module";
	script.async = false;
	script.defer = true;
	script.onload = loadMain;

	SCRIPT_ELEMENT = script;

	head.insertBefore(script, head.firstChild);
}

function loadMain()
{
	MAIN.load();
	MAIN.IS.onReady(onSiblingLoaded);
}

function onSiblingLoaded()
{
	TITLE_DIV.innerHTML = TITLE;

	hideProgressBar();
	displayControlParameters();

	PLAYBACK_CONTROLS.hidden = false;
	BUTTONS.setStartButtonReady();
}

export function handleStart()
{
	startOnline();
	BUTTONS.setStartButton(BUTTONS.STOP_STRING, false);
}

export function startOnline()
{
	BUTTONS.setStartButton(BUTTONS.STOP_STRING, false);
	MAIN.start();
}

export function handleReset()
{
	location.reload();
}

export function handleStop()
{
	MAIN.stop();
	BUTTONS.START_BUTTON.hidden = true;
	// setStartButton(RESET_STRING, false);
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
	if(MAIN.IS.SiblingName === null)
	{
		MAIN.IS.SiblingName = TITLE;
	}

	let siblingConfig = MAIN.IS.SiblingConfig;

	if(Object.keys(siblingConfig).length === 1)
	{
		return;
	}

	BUTTONS.showDownloadButton();

	for(const [key, value] of Object.entries(siblingConfig))
	{
		if(key.toLowerCase() === "name")
		{
			continue;
		}

		let roundedValue = value;

		if(Number(value) === value && value % 1 !== 0)
		{
			roundedValue = Math.round(value * 100) / 100;
		}

		let parameterElement = document.createElement('p');
		parameterElement.innerHTML = key + ": " + roundedValue.toString();
		PARAMETER_DISPLAY_DIV.appendChild(parameterElement);
	}
}

initializeUI();

