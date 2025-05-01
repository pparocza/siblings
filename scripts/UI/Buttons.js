import * as CONFIG_HANDLER from "../siblingConfigs.js";
import * as UI from "./UI.js";
import * as TITLE from "./Title.js";

export const START_BUTTON = document.querySelector('.START_BUTTON');

export const LOAD_BUTTON = document.querySelector('.LOAD_BUTTON');
LOAD_BUTTON.disabled = true;
LOAD_BUTTON.onclick = UI.handleLoad;

export const UPLOAD_BUTTON = document.querySelector('.UPLOAD_BUTTON');
UPLOAD_BUTTON.addEventListener('change', function (event)
{
	CONFIG_HANDLER.configUploadCallback(event, UI.SIBLING_SELECTION_DROPDOWN);
});

export const DOWNLOAD_BUTTON = document.querySelector('.DOWNLOAD_BUTTON');
DOWNLOAD_BUTTON.addEventListener('click', function (event)
{
	CONFIG_HANDLER.downloadButtonCallback(TITLE.TITLE);
});
DOWNLOAD_BUTTON.hidden = true;

export const START_STRING = "start";
export const STOP_STRING = "stop";
export const LOADING_STRING = "...loading";
export const RESET_STRING = "reset";

export function showDownloadButton()
{
	DOWNLOAD_BUTTON.hidden = false;
}

export function hideUploadButton()
{
	UPLOAD_BUTTON.hidden = true;
}

export function initialize()
{
	START_BUTTON.disabled = true;

	START_BUTTON.onclick = function()
	{
		switch (START_BUTTON.innerHTML)
		{
			case (START_STRING):
				UI.handleStart();
				break;
			case (RESET_STRING):
				UI.handleReset();
				break;
			case (STOP_STRING):
				UI.handleStop();
				break;
			default:
				break;
		}
	}
}

export function setStartButton(label, disabled)
{
	START_BUTTON.innerHTML = label;
	START_BUTTON.disabled = disabled;
}

export function setStartButtonReady()
{
	setStartButton(START_STRING, false);
}