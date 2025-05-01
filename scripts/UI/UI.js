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
const SIBLING_SCRIPT_ELEMENT = document.querySelector('.SIBLING_SCRIPT');
export let SCRIPT_SRC = ""

function initializeUI()
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
	load();
}

function load()
{
	SIBLING_SELECTION_DROPDOWN.disable();
	SIBLING_SCRIPT_ELEMENT.src = SCRIPT_SRC;
	SIBLING_SELECTION_DROPDOWN.remove();
	TITLE.setTitle();

	SELECTION_DIV.hidden = true;
	PLAYBACK_CONTROLS_DIV.hidden = false;

	BUTTONS.setStartButton(BUTTONS.LOADING_STRING, true);

	MAIN.IS.onReady(PROGRESS_BAR.hide);
	MAIN.IS.onReady(BUTTONS.setStartButtonReady);
	MAIN.IS.onReady(BUTTONS.showDownloadButton);

	// TODO: this is currently making sure load doesn't happen before the SCRIPT_SRC is loaded -> FIX IT!!!
	setTimeout(()=>
	{
		PARAMETER_DISPLAY.displayControlParameters();
		MAIN.load();
	}, 500);

}

export function handleStart()
{
	start();
	BUTTONS.setStartButton(BUTTONS.STOP_STRING, false);
}

export function handleStop()
{
	MAIN.stop();
	BUTTONS.setStartButton(BUTTONS.RESET_STRING, false);
}

export function handleReset()
{
	location.reload();
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

initializeUI();

