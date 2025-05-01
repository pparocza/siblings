import * as MAIN from "../../script";
import * as UI from "./UI";

export const BAR = document.querySelector('.PROGRESS_BAR');

export function initialize()
{
	MAIN.IS.MessageBus.addListener.BufferOperationQueue.Progress = new ValueListener(BAR);
}

class ValueListener
{
	constructor(progressBar)
	{
		this._progressBar = progressBar;
	}

	getValue(value)
	{
		if(UI.PROGRESS_DIV.hidden)
		{
			UI.PROGRESS_DIV.hidden = false;
		}

		this._progressBar.value = value * 100;
	}
}

export function hide()
{
	UI.PROGRESS_DIV.hidden = true;
}

export function unhide()
{
	UI.PROGRESS_DIV.hidden = false;
}