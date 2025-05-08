import * as MAIN from "../../script.js";
import * as SIBLING_SELECTION_DROPDOWN from "./SelectionDropdown.js";
import * as BUTTONS from "./Buttons.js";
import * as VOLUME_SLIDER from "./VolumeSlider.js";
import * as PROGRESS_BAR from "./ProgressBar.js";
import * as PARAMETER_DISPLAY from "./ParameterDisplay.js";
import * as TITLE from "./Title.js";
import * as DRAG_AND_DROP from "./DragAndDrop.js";

export let UPLOADED_CONFIG = null;

const SELECTION_DIV = document.querySelector('.SELECTION_DIV');
const PLAYBACK_CONTROLS_DIV = document.querySelector('.PLAYBACK_CONTROLS_DIV');
export const PROGRESS_DIV = document.querySelector('.PROGRESS_DIV');

const SIBLING_PATH = './scripts/siblings'
export let SCRIPT_SRC = ""
let SCRIPT_ELEMENT = null;

export function initialize()
{
	SIBLING_SELECTION_DROPDOWN.initialize();
	BUTTONS.initialize();
	DRAG_AND_DROP.initialize();
	VOLUME_SLIDER.initialize();
	PROGRESS_BAR.initialize();
}

export function handleConfigLoaded(configJSON)
{
	UPLOADED_CONFIG = configJSON;

	handleSiblingSelection();
	handleLoad();
}

export function handleSiblingSelection()
{
	requestSiblingScript();
	TITLE.getTitleFromDropdown();
}

export function handleLoad()
{
	loadScript();
	loadMain();
}

function loadScript()
{
	SIBLING_SELECTION_DROPDOWN.disable();
	SIBLING_SELECTION_DROPDOWN.remove();
	SELECTION_DIV.hidden = true;

	TITLE.setTitle("...loading sibling...");

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
	PROGRESS_BAR.hide();
	TITLE.setTitle();

	PARAMETER_DISPLAY.displayControlParameters();

	PLAYBACK_CONTROLS_DIV.hidden = false;
	BUTTONS.setStartButtonReady();
}

export function handleStart()
{
	start();
	BUTTONS.setStartButton(BUTTONS.STOP_STRING, false);
}

export function handleStop()
{
	MAIN.stop();
	BUTTONS.START_BUTTON.hidden = true;
}

function start()
{
	BUTTONS.setStartButton(BUTTONS.STOP_STRING, false);
	MAIN.start();
}

export async function requestSiblingScript()
{
	SCRIPT_SRC = SIBLING_PATH + "/" + SIBLING_SELECTION_DROPDOWN.DROPDOWN.value + "/script.js";

	let isSelectSibling =
		SIBLING_SELECTION_DROPDOWN.DROPDOWN.value === SIBLING_SELECTION_DROPDOWN.DROPDOWN[0].value;

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

