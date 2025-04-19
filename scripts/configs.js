const STATS_DIV = document.querySelector('.STATS_DIV');
const TITLE_DIV = document.querySelector('.TITLE_DIV');
export const UPLOAD_BUTTON = document.querySelector('.UPLOAD_BUTTON');
export const DOWNLOAD_BUTTON = document.querySelector('.DOWNLOAD_BUTTON');
export const LOADED_STATS = [];
DOWNLOAD_BUTTON.hidden = true;
DOWNLOAD_BUTTON.addEventListener('click', clickCallback);

import { SIBLING_SELECTION_DROPDOWN, loadOnline, handleSiblingSelection } from "./UI.js";

UPLOAD_BUTTON.addEventListener('change', function (event)
{
	let file = event.target.files[0];

	let reader = new FileReader();

	reader.onload = function (event)
	{
		let config = 	event.target.result.toString();
		const json = JSON.parse(config);
		const NAME = json.NAME;

		LOADED_STATS.push(json);

		for(let optionIndex = 0; optionIndex < SIBLING_SELECTION_DROPDOWN.length; optionIndex++)
		{
			let option = SIBLING_SELECTION_DROPDOWN[optionIndex];
			if(option.value.toLowerCase() === json.NAME.toLowerCase())
			{
				SIBLING_SELECTION_DROPDOWN.value = option.value;
				handleSiblingSelection();
				loadOnline();
				break;
			}
		}
	}

	reader.readAsText(file);
});

// TODO: Page Stats -> IS.DisplayPageStats -> iterates everything in the stats and puts it in an element
export const PIECE_STATS =
{
	_stats: {},

	addStat(name, value)
	{
		this._stats[name] = [value, false];
		this.displayStats(this._stats);
	},

	displayStats(stats)
	{
		for(const [statName, statValue] of Object.entries(stats))
		{
			let statIsDisplayed = statValue[1];

			if(statIsDisplayed)
			{
				continue;
			}

			let value = statValue[0];
			let statElement = document.createElement('p');
			statElement.innerHTML = statName + ": " + value.toString();
			STATS_DIV.appendChild(statElement);

			statValue[1] = true;
		}
	},

	get value() { return this._stats; },

	get toJSON()
	{
		let json = {}

		json["NAME"] = TITLE_DIV.innerHTML;

		for(const [statName, statValue] of Object.entries(this._stats))
		{
			json[statName] = statValue[0];
		}

		return json;
	}
};

// TODO: hoist values into this, and then have a "remember" button on the page that writes it to a file
//  and allows you to re-use those parameters...perhaps even re-generate the piece?
//  -> should be able to do this with a combination of the network and scheduler
const PARAM_MEMORY =
{

}

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

function clickCallback()
{
	let text = JSON.stringify(PIECE_STATS.toJSON, null, 1);
	let filename = TITLE_DIV.innerHTML + ".sibling";

	download(filename, text);
}