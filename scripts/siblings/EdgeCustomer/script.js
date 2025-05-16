var masterGain;
var fadeFilter;
var offlineBuffer;
var globalNow;
var dB;

setTimeout(function(){bufferLoaded();}, 1000);

function bufferLoaded(){

	var gain = audioCtx.createGain();
	gain.gain.value = 5;

	var d = new Effect();
	d.stereoDelay(randomFloat(0.25, 0.7), randomFloat(0.25, 0.7), 0.3);
	d.on();
	d.output.gain.value = 0;

	var dF = new MyBiquad("highpass", 200, 1);

	dB = new LFO(0, 0.5, 0.00001);
	dB.buffer.makeNoise();
	dB.connect(d.output.gain);

	var f = new MyBiquad("highpass", 20, 1);

	var dG = new MyGain(0);

	fadeFilter = new FilterFade(0);

	masterGain = audioCtx.createGain();
	masterGain.gain.value = 0;

	masterGain.connect(gain);
	masterGain.connect(dF.input);

	dF.connect(d);
	d.connect(gain);

	gain.connect(f.input);
	f.connect(fadeFilter);
	fadeFilter.connect(audioCtx.destination);

	// INITIALIZATIONS

	if(onlineButton.innerHTML == "online"){
		setTimeout(function(){onlineBufferLoaded();}, 1000);
	}

	else if(onlineButton.innerHTML == "offline"){
		offlineBufferLoaded();
	}


}

//--------------------------------------------------------------

function runPatch(){

		fadeFilter.start(1, 50);
		globalNow = audioCtx.currentTime;
		dB.start();

		masterGain.gain.setValueAtTime(1, 1+globalNow);

		// pT();

		console.log("playbackRate: ", playbackRate);
		console.log("fund: ", fund);
		console.log("length: ", pieceLength);

		addSineSection(playbackRate, fund);

}

//--------------------------------------------------------------

function stopPatch(){

	var now = audioCtx.currentTime;
	fadeFilter.start(0, 20);
	setTimeout(function(){masterGain.disconnect();}, 100);
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
