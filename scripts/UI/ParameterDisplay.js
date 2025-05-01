import * as MAIN from "../../script.js";
import * as TITLE from "./Title.js";

const PARAMETER_DISPLAY_DIV = document.querySelector('.CONTROL_PARAMETER_DISPLAY_DIV');

export function displayControlParameters()
{
	if(MAIN.IS.SiblingName === null)
	{
		MAIN.IS.SiblingName = TITLE.TITLE;
	}

	let siblingConfig = MAIN.IS.SiblingConfig;

	for(const [key, value] of Object.entries(siblingConfig))
	{
		if(key.toLowerCase() === "name")
		{
			continue;
		}

		let roundedValue = value;

		if(Number(value) === value && value % 1 !== 0)
		{
			roundedValue = Math.round(value * 100) / 100;
		}

		let parameterElement = document.createElement('p');
		parameterElement.innerHTML = key + ": " + roundedValue.toString();
		PARAMETER_DISPLAY_DIV.appendChild(parameterElement);
	}
}