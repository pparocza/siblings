import * as SIBLING_SELECTION_DROPDOWN from "./SelectionDropdown";

const TITLE_DIV = document.querySelector('.TITLE_DIV');
export let TITLE = "";

export function getTitleFromDropdown()
{
	let selectedIndex = SIBLING_SELECTION_DROPDOWN.DROPDOWN.selectedIndex;
	TITLE = SIBLING_SELECTION_DROPDOWN.DROPDOWN.options[selectedIndex].text;
}

export function setTitle(text = TITLE)
{
	TITLE_DIV.innerHTML = text;
}
