import { InfiniteSibling } from "./infinitesibling/modules/InfiniteSibling.js";
export const IS = new InfiniteSibling();
import * as UI from "./scripts/UI/UI.js"

UI.initialize();

export function load()
{
	IS.load();
}

export function start()
{
	IS.start();
}

export function stop()
{
	IS.stop();
}