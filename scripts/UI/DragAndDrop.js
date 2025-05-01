import * as CONFIG_HANDLER from "../siblingConfigs";
import { DROPDOWN } from "./SelectionDropdown.js";

export function initialize()
{
	const DRAG_AND_DROP = document.querySelector('.DRAG_AND_DROP');
	DRAG_AND_DROP.ondrop = function (event)
	{
		event.preventDefault();
		CONFIG_HANDLER.configUploadCallback(event, DROPDOWN);
	};

	DRAG_AND_DROP.ondragover = function (event)
	{
		// TODO: color change on drag-over
		event.preventDefault();
		DRAG_AND_DROP.style.background = "rgba(100, 100, 100, 0.6)";
	}

	DRAG_AND_DROP.ondragleave = function (event)
	{
		// TODO: color change on drag-over
		event.preventDefault();
		DRAG_AND_DROP.style.background = "rgba(100, 100, 100, 0)";
	}
}

