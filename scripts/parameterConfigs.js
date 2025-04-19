import { IS } from "../script.js";
import * as SiblingUI from "./UI.js";

const UploadButton = SiblingUI.UPLOAD_BUTTON;
const SiblingSelectionDropdown = SiblingUI.SIBLING_SELECTION_DROPDOWN;
const TitleDiv = SiblingUI.TITLE_DIV;

export const LOADED_STATS = [];

UploadButton.addEventListener('change', function (event)
{
	let file = event.target.files[0];

	let reader = new FileReader();

	reader.onload = function (event)
	{
		let config = event.target.result.toString();
		const json = JSON.parse(config);
		const NAME = json.NAME;

		LOADED_STATS.push(json);

		for(let optionIndex = 0; optionIndex < SiblingSelectionDropdown.length; optionIndex++)
		{
			let option = SiblingSelectionDropdown[optionIndex];
			if(option.value.toLowerCase() === json.NAME.toLowerCase())
			{
				SiblingSelectionDropdown.value = option.value;
				SiblingUI.handleConfigLoaded();
				break;
			}
		}
	}

	reader.readAsText(file);
});


function download(file, text)
{
	let element = document.createElement('a');

	element.setAttribute
	(
		'href',
		'data:text/plain;charset=utf-8, ' + encodeURIComponent(text)
	);

	element.setAttribute('download', file);
	document.body.appendChild(element);
	element.click();

	document.body.removeChild(element);
}

export function downloadButtonCallback()
{
	let text = JSON.stringify(IS.SiblingConfig, null, 1);

	console.log(text);

	if(IS.SiblingName === null)
	{
		IS.SiblingName = TitleDiv.innerHTML;
	}

	let filename = IS.SiblingName + ".sibling";

	download(filename, text);
}