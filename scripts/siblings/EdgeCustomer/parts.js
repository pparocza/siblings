function pT(){

  var output = new MyGain(0.1);

  var fund = 432*0.5;

  var b = new BufferPreset();
  b.playbackRate = fund;
  b.loop = true;
  b.preset17();

  var e = new BufferPreset();
  e.playbackRate = 1;
  e.ramp(0.1, 0.15, 4);
  var eG = new MyGain(0);

  b.connect(eG); e.connect(eG.gain.gain);
  eG.connect(output);
  output.connect(masterGain);

  b.start();
  e.startAtTime(globalNow+1);

  bufferGraph(b.buffer);
  bufferGraph(e.buffer);

}

function addSine(startTime, stopTime, fund, pArray, playbackRate, gainVal){

  var startTime = startTime;
  var stopTime = stopTime;
  var fund = fund;
  var pArray = pArray;
  var playbackRate = playbackRate;
  var gainVal = gainVal;

  var output = new MyGain(gainVal);

  var b = new MyBuffer(1, 1, audioCtx.sampleRate);
  var b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

  b.playbackRate = playbackRate;
  b.loop = true;
  b.addSine(fund, 1);
  b.applyRamp(randomFloat(0.45, 0.55), randomFloat(0.9, 1.1), randomFloat(0.9, 1.1));

  for(var i=0; i<3; i++){

    b2.makeConstant(0);
    b2.addSine(fund*randomArrayValue(pArray)*randomArrayValue([1, 2, 2]), randomFloat(0.3, 1));
    b2.addSine(fund*randomArrayValue(pArray)*randomArrayValue([1, 2, 2])+randomFloat(1, 10), randomFloat(0.3, 1));
    b2.applyRamp(randomFloat(0.1, 0.9), randomFloat(0.1, 2), randomFloat(0.1, 4));

    b.addBuffer(b2.buffer);

  }

  b.normalize(-1, 1);
  b.applyRamp(randomFloat(0.45, 0.55), randomFloat(0.7, 0.9), randomFloat(2, 3));

  var aB = new MyBuffer(1, 1, audioCtx.sampleRate);
  aB.makeAm(randomFloat(0.1, 0.2), randomFloat(0.1, 3), 1);
  aB.applyRamp(randomFloat(0.3, 0.6), randomFloat(0.9, 1.5), randomFloat(0.9, 1.5));
  aB.playbackRate = randomFloat(0.5, 3);
  aB.loop = true;
  var aG = new MyGain(0);

  var d = new Effect();
  d.randomEcho();
  d.on();
  d.output.gain.value = 0.25;

  b.connect(aG); aB.connect(aG.gain.gain);

  aG.connect(d);

  aG.connect(output);
  d.connect(output);

  output.connect(masterGain);

  b.startAtTime(globalNow+startTime);
  aB.startAtTime(globalNow+startTime);

  b.stopAtTime(globalNow+stopTime);
  aB.stopAtTime(globalNow+stopTime);

}

function addSine2(startTime, stopTime, fund, pArray, playbackRate, gainVal){

  var startTime = startTime;
  var fund = fund;
  var pArray = pArray;
  var playbackRate = playbackRate;
  var gainVal = gainVal;

  var output = new MyGain(gainVal);

  var b = new MyBuffer(1, 1, audioCtx.sampleRate);
  var b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

  b.playbackRate = playbackRate;
  b.loop = true;
  b.addSine(fund, 1);
  b.applyRamp(randomFloat(0.45, 0.55), randomFloat(0.9, 1.1), randomFloat(0.9, 1.1));

  for(var i=0; i<3; i++){

    b2.makeConstant(0);
    b2.addSine(fund*randomArrayValue(pArray)*randomArrayValue([1, 2, 2, 4]), randomFloat(0.3, 1));
    b2.addSine(fund*randomArrayValue(pArray)*randomArrayValue([1, 2, 2, 4])+randomFloat(1, 10), randomFloat(0.3, 1));
    b2.applyRamp(randomFloat(0.1, 0.9), randomFloat(0.1, 2), randomFloat(0.1, 4));

    b.addBuffer(b2.buffer);

  }

  b.normalize(-1, 1);
  b.applyRamp(randomFloat(0.45, 0.55), randomFloat(0.7, 0.9), randomFloat(2, 3));

  var aB = new MyBuffer(1, 1, audioCtx.sampleRate);
  aB.makeAm(randomFloat(0.1, 0.2), randomFloat(0.1, 3), 1);
  aB.applyRamp(randomFloat(0.3, 0.6), randomFloat(0.9, 1.5), randomFloat(0.9, 1.5));

  aB.playbackRate = randomFloat(0.1, 0.25);
  aB.loop = true;
  var aG = new MyGain(0);

  var d = new Effect();
  d.randomEcho();
  d.on();
  d.output.gain.value = 0.25;

  var f = new MyBiquad("lowshelf", 500, 1);
  f.biquad.gain.value = -6;

  b.connect(aG); aB.connect(aG.gain.gain);

  aG.connect(d);

  aG.connect(output);
  d.connect(output);

  output.connect(f);
  f.connect(masterGain);

  b.startAtTime(globalNow+startTime);
  aB.startAtTime(globalNow+startTime);

  b.stopAtTime(globalNow+stopTime);
  aB.stopAtTime(globalNow+stopTime);

}

function addSine3(startTime, stopTime, fund, pArray, playbackRate, gainVal){

  var startTime = startTime;
  var stopTime = stopTime;
  var fund = fund;
  var pArray = pArray;
  var playbackRate = playbackRate;
  var gainVal = gainVal;

  var output = new MyGain(gainVal);

  var b = new MyBuffer(1, 1, audioCtx.sampleRate);
  var b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

  b.playbackRate = playbackRate;
  b.loop = true;
  b.addSine(fund, 1);

  for(var i=0; i<3; i++){

    b2.makeConstant(0);
    b2.addSine(fund*randomArrayValue(pArray)*randomArrayValue([1]), randomFloat(0.3, 1));
    b2.addSine(fund*randomArrayValue(pArray)*randomArrayValue([1])+randomFloat(1, 10), randomFloat(0.3, 1));
    b2.applyRamp(randomFloat(0.05, 0.1), randomFloat(0.01, 0.1), randomFloat(4, 10));

    b.addBuffer(b2.buffer);

  }

  b.normalize(-1, 1);

  var aB = new MyBuffer(1, 1, audioCtx.sampleRate);
  aB.makeAm(randomFloat(0.1, 0.2), randomFloat(0.1, 3), 1);
  aB.applyRamp(randomFloat(0.3, 0.6), randomFloat(0.9, 1.5), randomFloat(0.9, 1.5));
  aB.playbackRate = randomFloat(0.5, 3);
  aB.loop = true;
  var aG = new MyGain(0);

  var d = new Effect();
  d.randomEcho();
  d.on();
  d.output.gain.value = 0.25;

  b.connect(aG); aB.connect(aG.gain.gain);

  aG.connect(d);

  aG.connect(output);
  d.connect(output);

  output.connect(masterGain);

  b.startAtTime(globalNow+startTime);
  aB.startAtTime(globalNow+startTime);

  b.stopAtTime(globalNow+stopTime);
  aB.stopAtTime(globalNow+stopTime);

}
