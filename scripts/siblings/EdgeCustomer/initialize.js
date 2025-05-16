var audioCtx;
var offlineAudioCtx;

var pieceLength;

var playbackRate;
var fund;

var s1;
var s2;
var s3;
var s4;
var s5;
var s6;
var s7;
var s8;
var s9;
var s10;

initPieceParameters();

function initPieceParameters(){

	playbackRate = randomFloat(0.2, 0.25);
	fund = randomFloat(400, 470); // 432;

	var bar = 1/playbackRate;

	s1 = 0*4*bar;
	s2 = s1+(4*bar);
	s3 = s2+(4*bar);
	s4 = s3+(4*bar);
	// s5 = s4+(4*bar);

	s6 = s4+(4*bar);
	s7 = s6+(2*bar);
	s8 = s7+(2*bar);
	s9 = s8+(4*bar);
	s10 = s9+(8*bar);

	pieceLength = s10+3;

}

function init(){

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	audioCtx = new AudioContext();
	audioCtx.latencyHint = "playback";
	onlineButton.disabled = true;

	// initUtilities();
	// initBuffers();
	initInstrumentsAndFX();
	initParts();
	initSections();
	initScript();

};

function initOffline(){

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	onlineCtx = new AudioContext();
	audioCtx = new OfflineAudioContext(2, onlineCtx.sampleRate*pieceLength, onlineCtx.sampleRate);
	audioCtx.latencyHint = "playback";
	onlineButton.disabled = true;

	// initUtilities();
	// initBuffers();
	initInstrumentsAndFX();
	initParts();
	initSections();
	initScript();

};

/*
// INITIALIZE UTILITIES

var includeUtilities;

function initUtilities(){

	includeUtilities = document.createElement('script');
	includeUtilities.src = "scripts/utilities.js"
	document.head.appendChild(includeUtilities);

}
*/

// INITIALIZE BUFFERS

var includeBufferLoader;
var includeLoadBuffers;

function initBuffers(){

	includeBufferLoader = document.createElement('script');
	includeBufferLoader.src = "scripts/buffer_loader.js"
	document.head.appendChild(includeBufferLoader);

	includeLoadBuffers = document.createElement('script');
	includeLoadBuffers.src = "scripts/load_buffers.js"
	document.head.appendChild(includeLoadBuffers);

}

// INITIALIZE INSTRUMENTS AND EFFECTS

var includeInstrumentsAndFX;

function initInstrumentsAndFX(){

	includeInstrumentsAndFX = document.createElement('script');
	includeInstrumentsAndFX.src = "scripts/instruments_and_fx.js"
	document.head.appendChild(includeInstrumentsAndFX);

	includeInstrumentsAndFX_L = document.createElement('script');
	includeInstrumentsAndFX_L.src = "scripts/instruments_and_fx_library.js"
	document.head.appendChild(includeInstrumentsAndFX_L);

}

// INITIALIZE PARTS

var includeParts;

function initParts(){

	includeParts = document.createElement('script');
	includeParts.src = "scripts/parts.js"
	document.head.appendChild(includeParts);

}

// INITIALIZE SECTIONS

var includeSections;

function initSections(){

	includeSections = document.createElement('script');
	includeSections.src = "scripts/sections.js"
	document.head.appendChild(includeSections);

}

// INITIALIZE SCRIPT

var includeScript;

function initScript(){

	includeScript = document.createElement('script');
	includeScript.src = "script.js"
	document.head.appendChild(includeScript);

}
