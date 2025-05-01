import * as UI from "./UI.js";
import { SIBLING_OPTIONS_ARRAY } from "../siblings/SiblingOptions.js";

export const DROPDOWN = document.querySelector('.SIBLING_SELECTION_MENU');

export async function initialize()
{
	for (let siblingOptionIndex = 0; siblingOptionIndex < SIBLING_OPTIONS_ARRAY.length; siblingOptionIndex++)
	{
		let option = document.createElement('option');
		let siblingOption = SIBLING_OPTIONS_ARRAY[siblingOptionIndex];
		option.value = siblingOption.directory;
		option.innerHTML = siblingOption.title;
		DROPDOWN.appendChild(option);
	}

	DROPDOWN.oninput = UI.handleSiblingSelection;
}

export function enable()
{
	DROPDOWN.disabled = false;
}

export function disable()
{
	DROPDOWN.disabled = true;
}

export function remove()
{
	DROPDOWN.remove();
}