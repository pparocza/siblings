import { Piece } from "./sections.js";

function bufferLoaded()
{
	piece = new Piece();
	piece.initMasterChannel();
}

//--------------------------------------------------------------

function runPatch(){
	piece.initParams();
	piece.start();
}

//--------------------------------------------------------------

function stopPatch(){

	piece.fadeFilter.start(0, 20);
	setTimeout(function(){piece.masterGain.disconnect();}, 100);
	startButton.innerHTML = "reset";

	if(onlineButton.innerHTML=="offline"){
		offlineBuffer.stop();
	}

}

//--------------------------------------------------------------

function onlineBufferLoaded(){

	startButton.disabled = false;
	startButton.innerHTML = "start";

}

//--------------------------------------------------------------

function offlineBufferLoaded(){

	runPatch();

	audioCtx.startRendering().then(function(renderedBuffer){

		offlineBuffer = onlineCtx.createBufferSource();
		offlineBuffer.buffer = renderedBuffer

		startButton.disabled = false;
		startButton.innerHTML = "start";

		offlineBuffer.connect(onlineCtx.destination);

	})

}
