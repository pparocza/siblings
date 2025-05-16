// template for an instrument or effect object
function InstrumentConstructorTemplate(){

	this.output = audioCtx.createGain();

}

InstrumentConstructorTemplate.prototype = {

	output: this.output,

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

// EFFECT

//--------------------------------------------------------------

// object within which to design signal-processing chains, which are
// stored as methods
function Effect(){

	this.input = audioCtx.createGain();
	this.filterFade = new FilterFade(0);
	this.output = audioCtx.createGain();
	this.startArray = [];

	this.input.connect(this.filterFade.input);

}

Effect.prototype = {

	input: this.input,
	output: this.output,
	filterFade: this.filterFade,
	startArray: this.startArray,

	// effect preset template
	effectMethod: function(){
		this.startArray = [];
	},

	// preset 1
	thru: function(){

		this.filterFade.connect(this.output);

	},

	// preset 2
	stereoDelay: function(delayL, delayR, fb){

		this.delayL = delayL;
		this.delayR = delayR;
		this.fb = fb;

		this.dly = new MyStereoDelay(this.delayL, this.delayR, this.fb, 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	// preset 3
	noiseAM: function(min, max, rate, lpFreq){

		this.min = min;
		this.max = max;
		this.rate = rate;
		this.lpFreq = lpFreq;

		this.l = new LFO(this.min, this.max, this.rate);
		this.l.buffer.makeUnipolarNoise();
		this.lp = new MyBiquad("lowpass", this.lpFreq, 1);
		this.g = new MyGain(0);

		this.filterFade.connect(this.g); this.l.connect(this.g.gain.gain);
		this.g.connect(this.output);

		this.startArray = [this.l];

	},

	// preset 4
	fmShaper: function(cFreq, mFreq, mGain){

		this.cFreq = cFreq;
		this.mFreq = mFreq;
		this.mGain = mGain;

		this.w = new MyWaveShaper();
		this.w.makeFm(this.cFreq, this.mFreq, 1);
		this.wG = new MyGain(this.mGain);

		this.filterFade.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.output);

	},

	// preset 5
	amShaper: function(cFreq, mFreq, mGain){

		this.cFreq = cFreq;
		this.mFreq = mFreq;
		this.mGain = mGain;

		this.w = new MyWaveShaper();
		this.w.makeAm(this.cFreq, this.mFreq, 1);
		this.wG = new MyGain(this.mGain);

		this.filterFade.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.output);

	},

	// presett 6
	randomShortDelay: function(){

		this.dly = new MyStereoDelay(randomFloat(0.01, 0.035), randomFloat(0.01, 0.035), randomFloat(0, 0.1), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	// preset 7
	randomEcho: function(){

		this.dly = new MyStereoDelay(randomFloat(0.35, 0.6), randomFloat(0.35, 0.6), randomFloat(0, 0.2), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	// preset 8
	randomSampleDelay: function(){

		this.s = 1/audioCtx.sampleRate;

		this.dly = new MyStereoDelay(randomInt(this.s, this.s*100), randomInt(this.s, this.s*100), randomFloat(0.3, 0.4), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	// preset 9
	filter: function(type, freq, Q){

		this.type = type;
		this.freq = freq;
		this.Q = Q;

		this.f = new MyBiquad(this.type, this.freq, this.Q);
		this.filterFade.connect(this.f);

		this.f.connect(this.output);

	},

	// filterFade to switchVal
	switch: function(switchVal){

		this.switchVal = switchVal;

		this.filterFade.start(this.switchVal, 30);

	},

	// filterFade to switchVal at specified time (in seconds)
	switchAtTime: function(switchVal, time){

		this.switchVal = switchVal;
		this.time = time;

		this.filterFade.startAtTime(this.switchVal, 20, this.time);


	},

	// specify a sequence of values to filterFade to
	switchSequence: function(valueSequence, timeSequence){

		this.valueSequence = valueSequence;
		this.timeSequence = timeSequence;
		this.v;
		this.j=0;

		for(var i=0; i<timeSequence.length; i++){
			this.v = this.valueSequence[this.j%this.valueSequence.length];
			this.filterFade.startAtTime(this.v, 20, this.timeSequence[i]);
			this.j++;
		}

	},

	// turn the effect on immdiately
	on: function(){

		this.filterFade.start(1, 30);

	},

	// turn the effect off immediately
	off: function(){

		this.filterFade.start(0, 20);

	},

	// turn the effect on at the specified time (in seconds)
	onAtTime: function(time){

		this.time = time;

		this.filterFade.startAtTime(1, 20, this.time);

	},

	// turn the effect off at the specified time (in seconds)
	offAtTime: function(time){

		this.time = time;

		this.filterFade.startAtTime(0, 20, this.time);

	},

	// start the effect immediately
	start: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}

	},

	// stop the effect immediately
	stop: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}

	},

	// start the effect at the specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

			for(var i=0; i<startArray.length; i++){
				this.startArray[i].startAtTime(this.time);
			}

	},

	// stop the effect at the specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

			for(var i=0; i<startArray.length; i++){
				this.startArray[i].stopAtTime(this.time);
			}

	},

	// connect the output node of this object to the input of another
	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

// INSTRUMENT

//--------------------------------------------------------------

// object within which to design signal-generating chains, which are
// stored as methods
function Instrument(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];

}

Instrument.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	// instrument preset template
	instrumentMethod: function(){
		this.startArray = [];
	},

	// preset 1
	bPS: function(rate, tArray, gainVal){

		this.rate = rate;
		this.tArray = tArray;
		this.gainVal = gainVal;

		this.output.gain.value = gainVal;

		// BREAKPOINT ENVELOPE ARRAY

			this.sL = this.tArray.length*2;

			this.tS = new Sequence();
			this.tS.loop(this.sL, this.tArray);
			this.tS.palindrome();
			this.tS.bipolar();
			this.tS.join([0]);

			this.dS = new Sequence();
			this.dS = this.dS.duplicates(this.tS.sequence.length, 1/this.tS.sequence.length,);

			this.eArray = this.tS.lace(this.dS);

		// BREAKPOINT EXPONENT ARRAY

			this.expArray1 = new Sequence();
			this.expArray1.randomInts(this.eArray.length/2, 14, 54);
			this.expArray2 = new Sequence();
			this.expArray2.randomFloats(this.eArray.length/2, 0.1, 0.991);

			this.expArray = this.expArray1.lace(this.expArray2.sequence);

		// BREAKPOINT

			this.bP = new BreakPoint(this.eArray, this.expArray);
			this.bP.loop = true;
			this.bP.playbackRate = this.rate;

		// SHAPER

			this.s = new MyWaveShaper();
			this.s.makeFm(107, 20, 1);
			this.sG = new MyGain(0.1);

		// FILTERS

			this.f1 = new MyBiquad("highshelf", 3000, 1);
			this.f1.biquad.gain.value = -8;
			this.f2 = new MyBiquad("lowpass", 3000, 1);
			this.f3 = new MyBiquad("highpass", 5, 1);

		// SHAPER

			this.w = new MyWaveShaper();
			this.w.makeSigmoid(5);
			this.wD = new MyStereoDelay(randomFloat(0.001, 0.01), randomFloat(0.001, 0.01), 0.1, 1);
			this.wD.output.gain.value = 0.2;

		// CONNECTIONS
			/*
			this.bP.connect(this.sG);

			this.sG.connect(this.s);
			this.s.connect(this.f1);
			this.f1.connect(this.f2);
			this.f2.connect(this.f3);

			this.f2.connect(this.w);
			this.w.connect(this.wD);
			this.wD.connect(this.f3);

			this.f3.connect(this.output);
			*/

			this.bP.connect(this.output);

		// STARTS

			this.startArray = [this.bP];

	},

	// preset 2
	lTone: function(fund){

		this.fund = fund;

		this.d2O = new LFO(0, 1, this.fund);
		this.d2O.buffer.makeUnipolarSine();
		this.d2OF = new MyBiquad("lowpass", 20000, 1);
		this.d2OF.output.gain.value = 0.5;
		this.d2OW = new Effect();
		this.d2OW.fmShaper(this.fund, this.fund*2, 0.0006);
		this.d2OW.on();

		this.p = new MyPanner2(randomFloat(-0.25, 0.25));
		this.p.output.gain.value = 1;

		this.t = new Effect();
		this.t.thru();

		this.dR = new Effect();
		this.dR.randomShortDelay();
		this.dR.output.gain.value = 0.3;
		this.dR.on();

		this.dE = new Effect();
		this.dE.randomEcho();
		this.dE.output.gain.value = 0.3;
		this.dE.on();

		this.d2O.connect(this.d2OF);
		this.d2OF.connect(this.d2OW);
		this.d2OW.connect(this.p);
		this.p.connect(this.t);

		this.t.connect(this.output);

		this.t.connect(this.dR);
		this.dR.connect(this.output);

		this.dR.connect(this.dE);
		this.dE.connect(this.output);

		this.d2O.start();

	},

	// start instrument immediately
	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},

	// stop instrument immediately
	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	// start instrument at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].startAtTime(this.time);
		}

	},

	// stop instrument at specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stopAtTime(this.time);
		}

	},

	// connect the output node of this object to the input of another
	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

// PRESETS (3)
//  - objects for storing commonly used configurations of certain nodes

//--------------------------------------------------------------

// collection of commonly used configurations of MyBuffer
function BufferPreset(){

	this.output = audioCtx.createGain();

}

BufferPreset.prototype = {

	output: this.output,
	myBuffer: this.myBuffer,
	buffer: this.buffer,
	playbackRate: this.playbackRate,
	loop: this.loop,

	// preset 1
	preset1: function(){

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeAm(1, 4, 1);
		// this.myBuffer.applyFm(2.1, 10, 1);

	},

	// preset 2
	cBP1: function(){

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeAm(1, 4, 1);
		this.myBuffer.applyFm(2.1, 10, 1);

	},

	// preset 3
	preset3: function(){

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
	  this.myBuffer.applySine(100);
	  this.myBuffer.applyFm(432, 432*2.1, 1);
	  this.myBuffer.applyAm(432*0.25, 432*0.5, 1);
	  this.myBuffer.applyFm(433*0.25, 632*0.3, 1);
	  this.myBuffer.applyRamp(0.01, 0.01, 8);

	},

	// preset 4
	majorPad: function(fund){

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.sL = 5;
		this.s = new Sequence();
		this.s.randomMultiples(this.sL, this.fund, [1, M2, M3, P4, P5, M6, M7, 2]);
		this.s = this.s.sequence;

		this.myBuffer.makeConstant(1);

		for(var i=0; i<this.s.length; i++){
			this.myBuffer.applySine(this.s[i]);
		}

		this.myBuffer.applyRamp(0.5, 1, 1);

	},

	// preset 5
	strangePad: function(fund){

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.sL = 5;
		this.s = new Sequence();
		this.s.randomFloats(this.sL, this.fund, 0.99999, 1.001);
		this.s = this.s.sequence;

		this.myBuffer.makeConstant(1);

		for(var i=0; i<this.s.length; i++){
			this.myBuffer.applySine(this.s[i]);
		}

		this.myBuffer.applyRamp(0.5, 1, 1);

	},

	// preset 6
	preset6: function(fund){

		// struck metal - fund = 2000, playbackRate = 8

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.sL = 5;
		this.s = new Sequence();
		this.s.randomFloats(this.sL, this.fund, 0.5, 2);
		this.s = this.s.sequence;

		this.myBuffer.makeConstant(1);

		for(var i=0; i<this.s.length; i++){
			this.myBuffer.applySine(this.s[i]);
		}

		this.myBuffer.applyRamp(0.1, 0.1, 8);

	},

	// preset 7
	preset7: function(fund){

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.sL = 5;
		this.s = new Sequence();
		this.s.randomFloats(this.sL, this.fund, 0.5, 2);
		this.s = this.s.sequence;
		this.s2 = [];

		this.myBuffer.makeConstant(1);

		for(var i=0; i<this.s.length; i++){
			this.s2[i] = this.s[i]*randomFloat(0.25, 2);
			this.myBuffer.applyFm(this.s[i], this.s2[i], 1);
		}

		console.log("s: ", this.s);
		console.log("s2: ", this.s2);

		this.myBuffer.applyRamp(0.1, 0.1, 8);

	},

	// preset 8
	hat1: function(){

		// playbackRate = 10

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.s = [764.1580050681816, 906.8923949520084, 880.5961440718867, 575.75451215258, 512.1937958264547];
		this.s2 = [367.1243073831619, 736.990408794432, 313.15466925330884, 1145.7957454436598, 678.8725528192126]

		this.myBuffer.makeConstant(1);

		for(var i=0; i<this.s.length; i++){
			this.myBuffer.applyFm(this.s[i], this.s2[i], 1);
		}

		this.myBuffer.applyRamp(0.1, 0.1, 8);

	},

	// preset 9
	kick: function(){

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
		this.myBuffer.applySine(20);
		this.myBuffer.applyRamp(0.1, 0.1, 2);

	},

	// preset 10
	snare: function(){

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
		this.myBuffer.applyNoise(1);
		this.myBuffer.applyRamp(0.1, 0.1, 2);

	},

	// preset 11
	struckMetal: function(fund){

		// playbackRate = 8;

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.sL = 5;
		this.s = new Sequence();
		this.s.randomFloats(this.sL, 2000, 0.5, 2);
		this.s = this.s.sequence;

		this.myBuffer.makeConstant(1);

		for(var i=0; i<this.s.length; i++){
			this.myBuffer.applySine(this.s[i]);
		}

		this.myBuffer.applyRamp(0.1, 0.1, 8);

	},

	// preset 12
	block: function(){

		// playbackRate = 99.9-100.1;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
		this.myBuffer.applyFm(432, 432*2.3, 1);

		this.myBuffer.applyRamp(0.1, 0.01, 4);

	},

	// preset13
	harmonicSound: function(fund){

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
		this.myBuffer.applySine(this.fund);
		this.myBuffer.applySine(this.fund*1.001);
		this.myBuffer.applySine(this.fund*1.999);
		this.myBuffer.applySine(this.fund*1.5);
		// this.myBuffer.applySine(10);

		this.myBuffer.applyRamp(0.1, 0.01, 4);

	},

	// preset14
	harmonicPad: function(fund){

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
		this.myBuffer.applySine(this.fund);
		this.myBuffer.applySine(this.fund*M3);
		this.myBuffer.applySine(this.fund*P5);
		this.myBuffer.applyFm(this.fund*0.25, this.fund*0.5, 1);
		this.myBuffer.applyFm(this.fund*0.251, this.fund*0.51, 1);
		this.myBuffer.applySine(this.fund*M3*2);
		// this.myBuffer.applySine(10);

		this.myBuffer.applyRamp(0.8, 2, 0.1);

	},

	// preset15
	harmonicChime: function(fund){

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
		this.myBuffer.applySine(this.fund);
		this.myBuffer.applySine(this.fund*M3);
		this.myBuffer.applySine(this.fund*P5);
		// this.myBuffer.applyAm(this.fund*0.5, this.fund*0.25, 1);
		// this.myBuffer.applySine(10);

		this.myBuffer.applyRamp(0.1, 0.01, 8);

	},

	// preset16
	dot: function(fund){

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
		this.myBuffer.applySine(this.fund);
		this.myBuffer.applySine(this.fund*2);
		this.r;

		for(var i=0; i<10; i++){
			this.r = randomFloat(0, 0.9);
			this.myBuffer.applyFloatingCycleSquare(this.r, this.r+randomFloat(0.05, 0.1));
		}
		// this.myBuffer.applySine(this.fund*0.5);
		// this.myBuffer.applyAm(this.fund*0.5, this.fund*0.25, 1);
		// this.myBuffer.applySine(10);

		this.myBuffer.applyRamp(0.9, 4, 0.1);

	},

	// preset17
	preset17: function(fund){

		this.fund = fund;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeConstant(1);
		this.myBuffer.applySine(M2);
		this.myBuffer.applySine(M3);
		this.myBuffer.applySine(M7);
		this.myBuffer.applySine(0.5);
		this.myBuffer.applyRamp(0.5, 0.7, 0.3);

	},

	// preset18
	ramp: function(peakPoint, upExp, downExp){

		this.peakPoint = peakPoint;
		this.upExp = upExp;
		this.downExp = downExp;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

		this.myBuffer.makeRamp(this.peakPoint, this.upExp, this.downExp);

	},

	// preset 19
	harmonicSeries: function(nHarmonics){

		this.nHarmonics = nHarmonics;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;
		this.myBuffer.makeConstant(0);

		for(var i=0; i<this.nHarmonics; i++){
			this.myBuffer.addSine(i+1, 1/(i+1));
		}

		this.myBuffer.normalize(-1, 1);

	},

	// preset 20
	additiveSynth: function(hArray, gArray){

		this.hArray = hArray;
		this.gArray = gArray;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;
		this.myBuffer.makeConstant(0);

		for(var i=0; i<this.hArray.length; i++){
			this.myBuffer.addSine(this.hArray[i], this.gArray[i]);
		}

		this.myBuffer.normalize(-1, 1);

	},

	// start buffer immediately
	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = this.loop;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	// stop buffer immediately
	stop: function(){
		this.bufferSource.stop();
	},

	// start buffer at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = this.loop;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	// stop buffer at specified time (in  seconds)
	stopAtTime: function(time){

		this.time = time;

		this.bufferSource.stop(this.time);

	},

	// connect the output node of this object to the input of another
	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

// collection of commonly used configurations of MyConvolver
function ConvolverPreset(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

}

ConvolverPreset.prototype = {

	input: this.input,
	output: this.output,
	convolver: this.convolver,

	// preset 1
	noiseReverb: function(length, decayExp){

		this.length = length;
		this.decayExp = decayExp;

		this.convolver = new MyConvolver(2, this.length, audioCtx.sampleRate);
		this.convolver.makeNoise();
		this.convolver.applyDecay(this.decayExp);

		this.input.connect(this.convolver.input);
		this.convolver.connect(this.output);

		this.buffer = this.convolver.buffer;

	},

	// preset 2
	preset2: function(){

		this.convolver = new MyConvolver(1, 0.25, audioCtx.sampleRate);
		this.convolver.makeAm(432, 432*2, 1);

		this.input.connect(this.convolver.input);
		this.convolver.connect(this.output);

		this.buffer = this.convolver.buffer;

	},

	// connect the output node of this object to the input of another
	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

// collection of commonly used Envelopes
function EnvelopePreset(){

	this.output = audioCtx.createGain();
	this.envelopeBuffer = new EnvelopeBuffer();

}

EnvelopePreset.prototype = {

	output: this.output,
	envelopeBuffer: this.envelopeBuffer,
	loop: this.loop,

	// preset 1
	evenRamp: function(length){

		this.length = length;

		this.envelopeBuffer.makeExpEnvelope(
			[1, this.length*0.5, 0, this.length*0.5],
			[1, 1],
		);

		this.buffer = this.envelopeBuffer.buffer;

	},

	// preset 2
	customRamp: function(length, peakPoint, upExp, downExp){

		this.length = length;
		this.peakPoint = peakPoint;
		this.upExp = upExp;
		this.downExp = downExp;

		this.envelopeBuffer.makeExpEnvelope(
			[1, this.length*this.peakPoint, 0, this.length*(1-this.peakPoint)],
			[this.upExp, this.downExp]
		);

		this.buffer = this.envelopeBuffer.buffer;

	},

	// preset 3
	ee_pr1_pluck1: function(){

		this.envelopeBuffer.makeExpEnvelope(
			[1, 0.01, 0.5, 0.05, 0.1, 0.25, 0, 0.25],
			[0.1, 1, 1.5, 2],
		);

		this.buffer = this.envelopeBuffer.buffer;

	},

	// preset 4
	ee_pr2_pluck2: function(){

		this.envelopeBuffer.makeEnvelope(
			[1, 0.01, 0.5, 0.05, 0.1, 0.25, 0, 0.25]
		);

		this.buffer = this.envelopeBuffer.buffer;

	},

	// start envelope immediately
	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer.buffer;
		this.bufferSource.loop = this.loop;
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	// stop envelope immediately
	stop: function(){
		this.bufferSource.stop();
	},

	// start envelope at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.loop = this.loop;
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	// stop envelope at specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

		this.bufferSource.stop(this.time);

	},

	// connect the output node of this object to the input of another
	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

	// create an envelope with exponential curves applied to each line segment
	makeExpEnvelope: function(eArray, expArray){

		this.eArray,
		this.expArray,

		this.envelopeBuffer.makeExpEnvelope(this.eArray, this.expArray);

		this.buffer = this.envelopeBuffer.buffer;

	},

	// create an envelope
	makeEnvelope: function(eArray){

		this.eArray = eArray;

		this.envelopeBuffer.makeEnvelope(this.eArray);

		this.buffer = this.envelopeBuffer.buffer;

	},

}
