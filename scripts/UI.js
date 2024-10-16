import * as main from "../script.js";

const START_BUTTON = document.querySelector('.START_BUTTON');
const START_STRING = "start";
const STOP_STRING = "stop";
const LOAD_STRING = "load";
const LOADING_STRING = "...loading";
const RESET_STRING = "reset";

const ONLINE_BUTTON = document.querySelector('.ONLINE_BUTTON');
const ONLINE_STRING = "online";
const OFFLINE_STRING = "offline";

const GAIN_SLIDER = document.querySelector('.GAIN_SLIDER');

const GAIN_DISPLAY = document.querySelector('.GAIN_VALUE_DISPLAY');

ONLINE_BUTTON.onclick = function()
{
	ONLINE_BUTTON.innerHTML === ONLINE_STRING ?
		ONLINE_BUTTON.innerHTML = OFFLINE_STRING :
		ONLINE_BUTTON.innerHTML = ONLINE_STRING;
}

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

	setStartButton(START_STRING, false);
}

function loadOnline()
{
	setStartButton(LOADING_STRING, true);
	main.load();
}

function loadOffline()
{
	setStartButton(LOADING_STRING, true);
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


GAIN_SLIDER.oninput = function()
{
	GAIN_DISPLAY.innerHTML = parseInt(volume * 100) + "%";
}
