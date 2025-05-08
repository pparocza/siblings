let audioCtx;
let pieceLength = 200;

function init()
{
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	audioCtx = new AudioContext();
	audioCtx.latencyHint = "playback";
	onlineButton.disabled = true;

	// initBuffers();
	initInstrumentsAndFX();
	initParts();
	initSections();
	initScript();
}

// INITIALIZE BUFFERS

var includeBufferLoader;
var includeLoadBuffers;

function initBuffers()
{

	includeBufferLoader = document.createElement('script');
	includeBufferLoader.src = "scripts/buffer_loader.js"
	document.head.appendChild(includeBufferLoader);

	includeLoadBuffers = document.createElement('script');
	includeLoadBuffers.src = "scripts/load_buffers.js"
	document.head.appendChild(includeLoadBuffers);

}

// INITIALIZE PARTS

var includeParts;

function initParts()
{

	includeParts = document.createElement('script');
	includeParts.src = "scripts/parts.js"
	document.head.appendChild(includeParts);

}

// INITIALIZE SECTIONS

var includeSections;

function initSections()
{

	includeSections = document.createElement('script');
	includeSections.src = "scripts/sections.js"
	document.head.appendChild(includeSections);

}

// INITIALIZE SCRIPT

var includeScript;

function initScript()
{

	includeScript = document.createElement('script');
	includeScript.src = "script.js"
	document.head.appendChild(includeScript);

}
