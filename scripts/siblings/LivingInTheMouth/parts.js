const pitchedPresetSequenceSplice = (startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal) => {

    const output = new MyGain(gainVal);


    // CREATE BUFFERS

    const bL = bufferLength;

    const b = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const aB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const sB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const c = new MyConvolver(1, bL, audioCtx.sampleRate);

    const impulse = new MyBuffer2(1, 1, audioCtx.sampleRate);
    impulse.impulse().add();
    impulse.constant(64).multiply();
    impulse.playbackRate = rate;
    impulse.loop = true;

    const p = new PitchedPresets();

    let sP = 0;

    let nS = spliceDiv;

    for(let i=0; i<nS; i++){

        sP = randomFloat(0, 1-(1/nS));

        p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

        b.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

        // b.normalize(-1, 1);

    }

    b.normalize(-1, 1);
    b.movingAverage(36);
    b.ramp( 0 , 1 , 0.1 , 0.9 , 1 , 1 );

    c.setBuffer( b.buffer );

    const f = new MyBiquad("highpass", 10, 1);

    impulse.connect(c);
    c.connect(f);
    f.connect(output);
    output.connect(masterGain);

    impulse.startAtTime( globalNow + startTime );

    output.gain.gain.setTargetAtTime(0, globalNow+stopTime, 0.1);

    impulse.stopAtTime( globalNow + stopTime );

}

const pitchedPresetSequenceSplicePan = (startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal) => {

    const output = new MyGain(gainVal);
    const pan = new MyPanner2(0);


    // CREATE BUFFERS

    const bL = bufferLength;

    const b = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const aB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const sB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const c = new MyConvolver(1, bL, audioCtx.sampleRate);

    const impulse = new MyBuffer2(1, 1, audioCtx.sampleRate);
    impulse.impulse().add();
    impulse.constant(64).multiply();
    impulse.playbackRate = rate;
    impulse.loop = true;

    const p = new PitchedPresets();

    let sP = 0;

    let nS = spliceDiv;

    for(let i=0; i<nS; i++){

        sP = randomFloat(0, 1-(1/nS));

        p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

        b.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

        // b.normalize(-1, 1);

    }

    b.normalize(-1, 1);
    b.movingAverage(36);

    c.setBuffer( b.buffer );

    const f = new MyBiquad("highpass", 10, 1);

    impulse.connect(c);
    c.connect(f);
    f.connect(pan);
    pan.connect(output);
    output.connect(masterGain);

    impulse.startAtTime( globalNow + startTime );

    let i = 0;

    while( ( ( i * rate ) / spliceDiv ) < globalNow + stopTime ){

        pan.setPositionAtTime( randomFloat( -1 , 1 ) , ( ( i * rate ) / spliceDiv ) );
        i++

    }

    output.gain.gain.setTargetAtTime(0, globalNow+stopTime, 0.1);

    impulse.stopAtTime( globalNow + stopTime );

}

const pitchedPresetSequenceSpliceDelay = (startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal) => {

    const output = new MyGain(gainVal);
    const delay = new Effect();
    delay.randomShortDelay();
    delay.on();
    delay.output.gain.value = 0;

    const delayLFO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
    const dR = randomInt( 0 , 2 );

    dR === 1 ? delayLFO.inverseSawtooth( 1 ).add( 0 ) : delayLFO.sawtooth( 1 ).add( 0 );

    delayLFO.playbackRate = rate;
    delayLFO.loop = true;

    const delayLFOFilter = new MyBiquad( "lowpass" , 10 , 1 );

    delayLFO.connect(delayLFOFilter);
    delayLFOFilter.connect(delay.output.gain);

    // CREATE BUFFERS

    const bL = bufferLength;

    const b = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const aB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const sB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const c = new MyConvolver(1, bL, audioCtx.sampleRate);

    const impulse = new MyBuffer2(1, 1, audioCtx.sampleRate);
    impulse.impulse().add();
    impulse.constant(64).multiply();
    impulse.playbackRate = rate;
    impulse.loop = true;

    const p = new PitchedPresets();

    let sP = 0;

    let nS = spliceDiv;

    for(let i=0; i<nS; i++){

        sP = randomFloat(0, 1-(1/nS));

        p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

        b.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

    }

    b.normalize(-1, 1);
    b.movingAverage(36);
    b.ramp( 0 , 1 , 0.0125 , 0.9875 , 0.5 , 0.5 ).multiply( 0 );

    c.setBuffer( b.buffer );

    const f = new MyBiquad("highpass", 10, 1);

    impulse.connect(c);
    c.connect(f);
    f.connect(delay);

    f.connect(output);
    delay.connect(output);

    output.connect(masterGain);

    impulse.startAtTime( globalNow + startTime );
    delayLFO.startAtTime( globalNow + startTime );

    output.gain.gain.setTargetAtTime(0, globalNow+stopTime, 0.1);

    impulse.stopAtTime( globalNow + stopTime );
    delayLFO.stopAtTime( globalNow + stopTime );

}

const fxPresetSequenceSplice = (startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal) => {

    const output = new MyGain(gainVal);

    const bL = bufferLength;

    const b = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const aB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const sB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const c = new MyConvolver(1, bL, audioCtx.sampleRate);

    const impulse = new MyBuffer2(1, 1, audioCtx.sampleRate);
    impulse.impulse().add();
    impulse.constant(64).multiply();
    impulse.playbackRate = rate;
    impulse.loop = true;

    const p = new FXPresets();

    let sP = 0;

    let nS = spliceDiv;

    for(let i=0; i<nS; i++){

        sP = randomFloat(0, 1-(1/nS));

        p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

        b.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

        // b.normalize(-1, 1);

    }

    b.normalize(-1, 1);
    b.movingAverage(36);

    c.setBuffer( b.buffer );

    const f = new MyBiquad("highpass", 10, 1);

    impulse.connect(c);
    c.connect(f);
    f.connect(output);
    output.connect(masterGain);

    impulse.startAtTime( globalNow + startTime );

    output.gain.gain.setTargetAtTime(0, globalNow+stopTime, 0.1);

    impulse.stopAtTime( globalNow + stopTime );

}

const fxPresetSequenceSpliceDelay = (startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal) => {

    const output = new MyGain(gainVal);
    const delay = new Effect();
    delay.randomShortDelay();
    delay.on();
    delay.output.gain.value = 0;
    const delayLFO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
    delayLFO.sawtooth( 1 ).add();
    delayLFO.playbackRate = rate;
    delayLFO.loop = true;

    delayLFO.connect(delay.output.gain);

    // CREATE BUFFERS

    const bL = bufferLength;

    const b = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const aB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const sB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const c = new MyConvolver(1, bL, audioCtx.sampleRate);

    const impulse = new MyBuffer2(1, 1, audioCtx.sampleRate);
    impulse.impulse().add();
    impulse.constant(64).multiply();
    impulse.playbackRate = rate;
    impulse.loop = true;

    const p = new FXPresets();

    let sP = 0;

    let nS = spliceDiv;

    for(let i=0; i<nS; i++){

        sP = randomFloat(0, 1-(1/nS));

        p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

        b.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

        // b.normalize(-1, 1);

    }

    b.normalize(-1, 1);
    b.movingAverage(36);

    c.setBuffer( b.buffer );

    const f = new MyBiquad("highpass", 10, 1);

    impulse.connect(c);
    c.connect(f);
    f.connect(delay);

    f.connect(output);
    delay.connect(output);

    output.connect(masterGain);

    impulse.startAtTime( globalNow + startTime );
    delayLFO.startAtTime( globalNow + startTime );

    output.gain.gain.setTargetAtTime(0, globalNow+stopTime, 0.1);

    impulse.stopAtTime( globalNow + stopTime );
    delayLFO.stopAtTime( globalNow + stopTime );

}

const fxPresetSequenceSplicePan = (startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal) => {

    const output = new MyGain(gainVal);
    const pan = new MyPanner2(0);


    // CREATE BUFFERS

    const bL = bufferLength;

    const b = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const aB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const sB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const c = new MyConvolver(1, bL, audioCtx.sampleRate);

    const impulse = new MyBuffer2(1, 1, audioCtx.sampleRate);
    impulse.impulse().add();
    impulse.constant(64).multiply();
    impulse.playbackRate = rate;
    impulse.loop = true;

    const p = new FXPresets();

    let sP = 0;

    let nS = spliceDiv;

    for(let i=0; i<nS; i++){

        sP = randomFloat(0, 1-(1/nS));

        p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

        b.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

        // b.normalize(-1, 1);

    }

    b.normalize(-1, 1);
    b.movingAverage(36);

    c.setBuffer( b.buffer );

    const f = new MyBiquad("highpass", 10, 1);

    impulse.connect(c);
    c.connect(f);
    f.connect(pan);
    pan.connect(output);
    output.connect(masterGain);

    impulse.startAtTime( globalNow + startTime );

    let i = 0;

    while( ( ( i * rate ) / spliceDiv ) < globalNow + stopTime ){

        pan.setPositionAtTime( randomFloat( -1 , 1 ) , ( ( i * rate ) / spliceDiv ) );
        i++

    }

    output.gain.gain.setTargetAtTime(0, globalNow+stopTime, 0.1);

    impulse.stopAtTime( globalNow + stopTime );

}

const percussionPresetSequenceSplice = (startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal) => {

    const output = new MyGain(gainVal);

    const bL = bufferLength;

    const b = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const aB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const sB = new MyBuffer2(1, bL, audioCtx.sampleRate);
    const c = new MyConvolver(1, bL, audioCtx.sampleRate);

    const impulse = new MyBuffer2(1, 1, audioCtx.sampleRate);
    impulse.impulse().add();
    impulse.constant(64).multiply();
    impulse.playbackRate = rate;
    impulse.loop = true;

    const p = new PercussionPresets();

    let sP = 0;

    let nS = spliceDiv;

    for(let i=0; i<nS; i++){

        sP = randomFloat(0, 1-(1/nS));

        p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

        b.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

        // b.normalize(-1, 1);

    }

    b.normalize(-1, 1);
    b.movingAverage(36);

    c.setBuffer( b.buffer );

    const f = new MyBiquad("highpass", 10, 1);

    impulse.connect(c);
    c.connect(f);
    f.connect(output);
    output.connect(masterGain);

    impulse.startAtTime( globalNow + startTime );

    output.gain.gain.setTargetAtTime(0, globalNow+stopTime, 0.1);

    impulse.stopAtTime( globalNow + stopTime );

}
