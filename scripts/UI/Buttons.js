import * as UI from "./UI.js";

export const LOAD_BUTTON = document.querySelector('.LOAD_BUTTON');
LOAD_BUTTON.disabled = true;
LOAD_BUTTON.onclick = UI.handleLoad;

export const RESET_BUTTON = document.querySelector('.RESET_BUTTON');
RESET_BUTTON.onclick = UI.handleReset;