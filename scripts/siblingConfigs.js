import * as MAIN from "../script.js";
import * as UI from "./UI.js";

export function configUploadCallback(event, siblingSelectionDropdown)
{
	let reader = new FileReader();
	let file = null;

	if (event.dataTransfer && event.dataTransfer.items)
	{
		[...event.dataTransfer.items].forEach((item, i) =>
		{
			if (item.kind === "file")
			{
				file = item.getAsFile();
			}
		});
	}
	else if(event.target.files[0])
	{
		file = event.target.files[0]
	}

	reader.onload = function (event)
	{
		let config = event.target.result.toString();
		const json = JSON.parse(config);
		const siblingName = json.Name;

		for(let optionIndex = 0; optionIndex < siblingSelectionDropdown.length; optionIndex++)
		{
			let option = siblingSelectionDropdown[optionIndex];

			if(option.value.toLowerCase() === siblingName.toLowerCase())
			{
				// TODO: managing these values through UI is janky
				siblingSelectionDropdown.value = option.value;
				UI.handleConfigLoaded(json);
				break;
			}
		}
	}

	reader.readAsText(file);

	return true;
}

export function downloadButtonCallback(siblingTitle)
{
	if(MAIN.IS.SiblingName === null)
	{
		MAIN.IS.SiblingName = siblingTitle;
	}

	let text = JSON.stringify(MAIN.IS.SiblingConfig, null, 1);

	let filename = MAIN.IS.SiblingName + ".sibling";

	downloadSiblingConfig(filename, text);
}

function downloadSiblingConfig(file, text)
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
