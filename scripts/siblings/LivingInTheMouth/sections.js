import { IS } from "../../../script.js";
import { SigmoidShaper } from "./SigmoidShaper.js";
import { PitchedPresets } from "./PitchedPresets.js";

let m2 = 25/24;
let M2 = 9/8;
let m3 = 6/5;
let M3 = 5/4;
let P4 = 4/3;
let d5 = 45/32;
let P5 = 3/2;
let m6 = 8/5;
let M6 = 5/3;
let m7 = 9/5;
let M7 = 15/8;

export class Piece
{
    constructor()
    {
        this.pA =
            [
                'pitch23',
                'pitch27',
                'pitch1',
                'pitch3',
                'pitch7',
                'pitch9',
                'pitch10',
                'pitch12',
                'pitch13',
                'pitch20'
            ];

        this.pAHigh1 =
            [
                'pitch23' , 'pitch27' , 'pitch1' , 'pitch12' , 'pitch13' , 'pitch20'
            ];

        this.pALow1 =
            [
                'pitch23' , 'pitch27' , 'pitch20'
            ];
    }

    initMainChannel()
    {
        this.gain = IS.createGain();
        this.gain.gain = 1;

        // REVERB
        this.convolverBuffer = IS.createBuffer(2, 3);
        this.convolverBuffer.noise().add();
        this.convolverBuffer.ramp
        (
            0, 1, 0.01, 0.015, 0.5, 4
        ).multiply();

        this.convolver = IS.createConvolver(this.convolverBuffer);
        this.convolver.gain = 0.25;

        // DELAY

        this.delayLength = IS.Random.Float(0.25, 0.4);
        this.delay = IS.createStereoDelay
        (
            this.delayLength*2, this.delayLength, 0.2, 1
        );

        this.delay.gain = 0.25;

        this.delayFilter = IS.createFilter('highpass', 500, 1);
        this.convolverFilter = IS.createFilter('highpass', 500, 1);

        this.filter = IS.createFilter("highpass", 10, 1);
        this.filter2 = IS.createFilter("lowpass", 20000, 1);

        // LFO DELAY

        this.delaySend3In = IS.createGain(0.25);
        this.delaySend3 = IS.createStereoDelay
        (
            IS.Random.Float(0.01, 0.035), IS.Random.Float(0.01, 0.035), IS.Random.Float(0, 0.1), 1
        );

        this.delaySend3LFO1Buffer = IS.createBuffer(1, 1);
        this.delaySend3LFO2Buffer = IS.createBuffer(1, 1);
        this.delaySend3LFO1Buffer.noise().add();
        this.delaySend3LFO2Buffer.noise().add();
        this.delaySend3LFO1Buffer.constant(0.04).multiply();
        this.delaySend3LFO2Buffer.constant(0.04).multiply();

        this.delaySend3LFO1 = IS.createBufferSource(this.delaySend3LFO1Buffer);
        this.delaySend3LFO2 = IS.createBufferSource(this.delaySend3LFO2Buffer);
        this.delaySend3LFO1.loop = true;
        this.delaySend3LFO2.loop = true;
        this.delaySend3LFO1.playbackRate = IS.Random.Float(0.00001, 0.000001);
        this.delaySend3LFO2.playbackRate = IS.Random.Float(0.00001, 0.000001);

        this.delaySend3LFO1.connect(this.delaySend3.delayTimeLeft);
        this.delaySend3LFO2.connect(this.delaySend3.delayTimeRight);

        this.delaySend3In.connect(this.delaySend3);

        this.delaySend3LFO1.scheduleStart(0);
        this.delaySend3LFO2.scheduleStart(0);

        // DISTORTION

        this.waveShaper = new SigmoidShaper();
        this.waveShaper.sigmoid(2);
        this.waveShaper.gain = 1;

        this.waveShaperFilter = IS.createFilter('highpass', 600, 1);

        // MAIN
        this.mainGain = IS.createGain();

        // CONNECTIONS

        this.mainGain.connect(this.convolver.input);
        this.mainGain.connect(this.delay.input);
        this.mainGain.connect(this.delaySend3In.input);

        this.mainGain.connect(this.gain);

        this.convolver.connect(this.convolverFilter);
        this.delay.connect(this.delayFilter);
        this.delaySend3.connect(this.delayFilter);

        this.convolverFilter.connect(this.gain);
        this.delayFilter.connect(this.gain);

        this.gain.connect(this.waveShaper.input);
        this.waveShaper.output.connect(this.waveShaperFilter);
        this.waveShaperFilter.connect(this.filter);

        this.gain.connect(this.filter.input);
        this.filter.connect(this.filter2);

        this.filter2.connectToMainOutput();
    }

    initializeParameters()
    {
        this.fund = Parameters.Fundamental;
        this.gainVal = 0.25;

        this.c1A = [1, M2, P4, 1/m3, M6];
        this.c1B = [1/M2/P4, 1, M2];
        this.c1C = [1, M2, M3, P5];
        this.c1D = [1, M2, M3, P5, M6];

        this.chordArray = [ this.c1B , this.c1C , this.c1D ]; // c1D , c1C* , c1A , c1B

        this.chordIdx = IS.Random.Int( 0 , this.chordArray.length );
        this.currentChord = this.chordArray[ this.chordIdx ];
		this.chord2 = this.chordArray[ IS.Random.Int( 0 , this.chordArray.length ) ];

        this.div = Parameters.Division;
        this.rate = Parameters.Rate;
        this.pL = 1 / this.rate;
        this.endTime = Parameters.EndTime;
    }

    schedule()
    {
        this.globalNow = IS.now;

        switch(IS.Random.Select(0, 1, 7, 3))
        {
            case 0:
                console.log('PIECE: rhythm tests original');
                this.rhythmTestsOriginal();
                break;
            case 1:
                console.log('PIECE: flux line');
                this.fluxLine();
                break;
            case 3:
                console.log('PIECE: cool progression buffer sequence');
                this.coolProgressionBufferSequence();
                break;
            case 7:
                console.log('PIECE: cool progression buffer sequence 5');
                this.coolProgressionBufferSequence5();
                break;
        }
    }

    rhythmTestsOriginal()
    {
        console.log(`fund: ${this.fund} , chord: ${this.chordIdx} , div ${this.div} , rate: ${this.rate} , end time: ${this.endTime}`);

        this.pitchedPresetSequenceSpliceDelay( this.div*0 , this.div*4 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*0 , this.div*6 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*1 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 0.5  ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*2 , this.div*9 ,  2 , 0.25 ,  3 ,     this.fund*0.25  , this.currentChord , this.pALow1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*3 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*4 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*5 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*4 , this.div*9 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*5 , this.div*9 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*6 , this.div*9 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );

        this.pitchedPresetSequenceSpliceDelay( this.div*7 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 0.33 ,  this.fund ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*7 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 0.33 ,  this.fund ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*9 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );
        this.pitchedPresetSequenceSpliceDelay( this.div*9 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*9 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*9 , this.endTime ,  2 , 0.25 ,  3 ,     this.fund*0.25  , this.currentChord , this.pALow1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*10 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*11 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*12 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );

    }

    coolProgressionBufferSequence()
    {
        console.log(`fund: ${this.fund} , chord: ${this.chordIdx} , div ${this.div} , rate: ${this.rate} , end time: ${this.endTime}`);

        this.bufferLength = 1;

        this.bufferSequence( 0  , 100 , 3 , this.bufferLength , 100, this.rate ,  this.div ,  this.fund * 2 , this.currentChord , this.pALow1 , this.gainVal * 3 );
        this.bufferSequence( 0  , 100 , 3 , this.bufferLength , 100, this.rate ,  this.div ,  this.fund * 4 , this.currentChord , this.pALow1 , this.gainVal * 4 );
        this.bufferSequence( 0  , 100 , 3 , this.bufferLength , 100, this.rate ,  this.div * 0.5 ,  this.fund * 1 , this.currentChord , this.pALow1 , this.gainVal * 1 );
        this.bufferSequence( 50 , 100 , 3 , this.bufferLength , 100, this.rate ,  this.div * 3 ,  this.fund * 4 , this.currentChord , this.pALow1 , this.gainVal * 3 );
    }

    coolProgressionBufferSequence5()
    {
        this.fund = 343.73703558146576;

        this.chord1 = [ 1 , P4 , M7 , M2 ];
        this.chord2 = [ 1 , M3 , M3 * 2 , P5 , P5 * 2 , M6 , M2 * 2 ];
        this.chord3 = [ M2 , M2 * 2 , P5 , M6 , P5 * 2 ];
        // this.chord = [ 1 , M2 , M3 , P5 ];
        // this.chord2 = [1/M2, M2, M6, P4];

        this.bufferLength = 0.3255060810505064;
        this.numberOfBuffers = 5;
        this.div = 4; // 3 , 4
        this.rate = 0.28577601206429365;
        this.pL = this.bufferLength / this.rate ;

        this.gainVal = 1.1;

        const paramText = `fund: ${this.fund} , chord: ${this.chordIdx} , buffer length: ${this.bufferLength} , number of buffers: ${this.numberOfBuffers} , div ${this.div} , rate: ${this.rate} , end time: ${this.endTime}`;

        console.log( paramText );
        this.printParams( paramText );

        // startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal

        this.bufferSequence2Key(    this.pL*0 ,  this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord2 , this.pAHigh1 , this.gainVal * 1 );
        this.bufferSequence2Key(    this.pL*8 ,  this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord2 , this.pAHigh1 , this.gainVal * 1 );
        this.bufferSequence2KeyPan( this.pL*16 , this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord2 , this.pAHigh1 , this.gainVal * 2 );
        this.bufferSequence2KeyPan( this.pL*24 , this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord2 , this.pAHigh1 , this.gainVal * 2 );

        this.bufferSequence2KeyPan( this.pL*40 , this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 4 , this.chord2 , this.pAHigh1 , this.gainVal * 2 );
        this.bufferSequence2KeyPan( this.pL*40 , this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 4 , this.chord2 , this.pAHigh1 , this.gainVal * 2 );

        this.bufferSequence2Key(    this.pL*44 ,  this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 1 , this.fund * 1 , this.chord2 , this.pAHigh1 , this.gainVal * 0.75 );
        this.bufferSequence2Key(    this.pL*48 ,  this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 0.5 , this.fund * 0.5 , this.chord2 , this.pAHigh1 , this.gainVal * 0.5 );
    }

    pitchedPresetSequenceSpliceDelay
    (
        startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal
    )
    {
        const output = IS.createGain(gainVal);
        const delay = IS.createStereoDelay
        (
            IS.Random.Float(0.01, 0.035), IS.Random.Float(0.01, 0.035), IS.Random.Float(0, 0.1), 1
        );
        delay.gain = 0;

        const delayLFOBuffer = IS.createBuffer(1, 1);

        if(IS.Random.CoinToss())
        {
            delayLFOBuffer.inverseSawtooth(1).add();
        }
        else
        {
            delayLFOBuffer.sawtooth(1).add();
        }

        const delayLFO = IS.createBufferSource(delayLFOBuffer);
        delayLFO.playbackRate = rate;
        delayLFO.loop = true;

        const delayLFOFilter = IS.createFilter("lowpass", 10);

        delayLFO.connect(delayLFOFilter);
        delayLFOFilter.connect(delay.gain);

        // CREATE BUFFERS
        const convolverBuffer = IS.createBuffer(1, bufferLength);

        const impulseBuffer = IS.createBuffer(1, 1);
        impulseBuffer.impulse().add();
        impulseBuffer.constant(64).multiply();

        const impulse = IS.createBufferSource(impulseBuffer);
        impulse.playbackRate = rate;
        impulse.loop = true;

        const presetBuffer = new PitchedPresets();

        let spliceStartPercent = 0;

        let nSplices = spliceDiv;
        let spliceLength = 1 / nSplices;
        let spliceMax = 1 - spliceLength;

        for(let spliceIndex= 0; spliceIndex < nSplices; spliceIndex++)
        {
            spliceStartPercent = IS.Random.Float(0, spliceMax);
            let spliceEndPercent = spliceStartPercent + spliceLength;

            presetBuffer[IS.Random.Select(...pArray)](fund * IS.Random.Select(...cArray));

            convolverBuffer.splice
            (
                presetBuffer.b1,
                spliceStartPercent, spliceEndPercent,
                spliceIndex / nSplices
            ).add();
        }

        convolverBuffer.normalize();
        convolverBuffer.movingAverage(36);
        convolverBuffer.ramp
        (
            0, 1, 0.0125, 0.9875, 0.5, 0.5
        ).multiply();

        const convolver = IS.createConvolver(convolverBuffer);

        const filter = IS.createFilter("highpass", 10, 1);

        impulse.connect(convolver);
        convolver.connect(filter);
        filter.connect(delay);

        filter.connect(output);
        delay.connect(output);

        output.connect(this.mainGain);

        impulse.scheduleStart( this.globalNow + startTime );
        delayLFO.scheduleStart( this.globalNow + startTime );

        output.gain.scheduleValue(0, this.globalNow + stopTime, 0.1);

        impulse.scheduleStop(this.globalNow + stopTime);
        delayLFO.scheduleStop(this.globalNow + stopTime);
    }

    pitchedPresetSequenceSpliceDelayPan
    (
        startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal
    )
    {
        const output = IS.createGain(gainVal);
        const delay = IS.createStereoDelay
        (
            IS.Random.Float(0.01, 0.035), IS.Random.Float(0.01, 0.035), IS.Random.Float(0, 0.1), 1
        );
        delay.gain = 0;

        const delayLFOBuffer = IS.createBuffer(1, 1);

        if(IS.Random.CoinToss())
        {
            delayLFOBuffer.inverseSawtooth(1).add();
        }
        else
        {
            delayLFOBuffer.sawtooth(1).add();
        }

        const delayLFO = IS.createBufferSource(delayLFOBuffer);
        delayLFO.playbackRate = rate;
        delayLFO.loop = true;

        const delayLFOFilter = IS.createFilter("lowpass", 10, 1);

        delayLFO.connect(delayLFOFilter);
        delayLFOFilter.connect(delay.gain);

        // CREATE BUFFERS

        const impulseBuffer = IS.createBuffer(1, 1);
        impulseBuffer.impulse().add();
        impulseBuffer.constant(64).multiply();

        const impulse = IS.createBufferSource(impulseBuffer);
        impulse.playbackRate = rate;
        impulse.loop = true;

        const convolverBuffer = IS.createBuffer(1, bufferLength);
        const presetBuffer = new PitchedPresets();

        let spliceStartPercent = 0;

        let nSplices = spliceDiv;
        let spliceLength = 1 / nSplices;
        let spliceMax = 1 - spliceLength;

        for(let spliceIndex= 0; spliceIndex < nSplices; spliceIndex++)
        {
            spliceStartPercent = IS.Random.Float(0, spliceMax);
            let spliceEndPercent = spliceStartPercent + spliceLength;
            let spliceInsertPercent = spliceIndex / nSplices;

            presetBuffer[IS.Random.Select(...pArray)](fund*IS.Random.Select(...cArray));

            convolverBuffer.splice(presetBuffer.b1, spliceStartPercent, spliceEndPercent, spliceInsertPercent).add();
        }

        convolverBuffer.normalize();
        convolverBuffer.movingAverage(36);
        convolverBuffer.ramp
        (
            0, 1, 0.0125, 0.9875, 0.5, 0.5
        ).multiply();

        const convolver = IS.createConvolver(convolverBuffer);

        const filter = IS.createFilter("highpass", 10, 1);
        const pan = IS.createStereoPanner(IS.Random.Float(-1, 1));

        impulse.connect(convolver);
        convolver.connect(filter);
        filter.connect(delay);

        filter.connect(pan);
        pan.connect(output);

        delay.connect(output);

        output.connect(this.mainGain);

        impulse.scheduleStart(this.globalNow + startTime);
        delayLFO.scheduleStart(this.globalNow + startTime);

        output.gain.scheduleValue(0, this.globalNow+stopTime, 0.1);

        impulse.scheduleStop(this.globalNow + stopTime);
        delayLFO.scheduleStop(this.globalNow + stopTime);
    }

    bufferSequence
    (
        startTime, stopTime, numberOfBuffers, bufferLength,
        numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal
    )
    {
        const output = IS.createGain(gainVal);

        const delay = IS.createStereoDelay
        (
            IS.Random.Float(0.01, 0.035), IS.Random.Float(0.01, 0.035), IS.Random.Float(0, 0.1), 1
        );
        delay.gain = 0;

        const delayLFOBuffer = IS.createBuffer(1, 1);

        if(IS.Random.CoinToss())
        {
            delayLFOBuffer.sawtooth(1).add();
        }
        else
        {
            delayLFOBuffer.inverseSawtooth(1).add();
        }

        const delayLFO = IS.createBufferSource(delayLFOBuffer);
        delayLFO.playbackRate = rate * IS.Random.Select(0.5, 0.25, 1, 2);
        delayLFO.loop = true;

        const delayLFOFilter = IS.createFilter('lowpass', 10, 1);

        delayLFO.connect(delayLFOFilter);
        delayLFOFilter.connect(delay.gain);

        // CREATE BUFFERS

        const bufferArray = [];

        const presetBuffer = new PitchedPresets();
        const filter = IS.createFilter("highpass", 30, 1);

        let spliceStartPercent = 0;

        let nSplices = spliceDiv;
        let spliceLength = 1 / nSplices;
        let spliceMax = 1 - spliceLength;

        for(let bufferIndex= 0; bufferIndex < numberOfBuffers; bufferIndex++)
        {
            let buffer = IS.createBuffer(1, bufferLength);

            for(let spliceIndex= 0; spliceIndex < nSplices; spliceIndex++)
            {
                spliceStartPercent = IS.Random.Float(0, spliceMax);
                let spliceEndPercent = spliceStartPercent + spliceLength;
                let spliceInsertPercent = spliceIndex / nSplices;

                presetBuffer[IS.Random.Select(...pArray)](fund * IS.Random.Select(...cArray));

                buffer.splice
                (
                    presetBuffer.b1,
                    spliceStartPercent, spliceEndPercent,
                    spliceInsertPercent
                ).add();
            }

            buffer.normalize();
            buffer.movingAverage(36);
            buffer.ramp
            (
                0, 1,
                0.0125, 0.9875,
                0.5, 0.5
            ).multiply();

            let bufferSource = IS.createBufferSource(buffer);
            bufferSource.connect(filter);
            bufferSource.playbackRate = rate;

            bufferArray[bufferIndex] = bufferSource;
        }

        filter.connect(delay);

        filter.connect(output);
        delay.connect(output);

        output.connect(this.mainGain);

        let time = 0;

        for(let phraseIndex= 0; phraseIndex < numberOfPhrases; phraseIndex++)
        {
            time = phraseIndex / (bufferLength * rate) + startTime + this.globalNow;

            if (time < this.globalNow + stopTime)
            {
                bufferArray[IS.Random.Int(0, bufferArray.length)].scheduleStart(time);
            }
        }

        delayLFO.scheduleStart(this.globalNow + startTime);

        output.gain.scheduleValue(0, this.globalNow + stopTime, 0.1);
        delayLFO.scheduleStop(this.globalNow + stopTime);
    }

    bufferSequence2Key
    (
        startTime, stopTime, nBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal
    )
    {
        const output = IS.createGain(gainVal);
        const delay = IS.createStereoDelay
        (
            IS.Random.Float(0.01, 0.035), IS.Random.Float(0.01, 0.035), IS.Random.Float(0, 0.1), 1
        );
        delay.gain = 1;

        const delayLFOBuffer = IS.createBuffer(1, 1);

        if(IS.Random.CoinToss())
        {
            delayLFOBuffer.sawtooth(1).add();
        }
        else
        {
            delayLFOBuffer.sawtooth(1).add();
        }

        const delayLFO = IS.createBufferSource(delayLFOBuffer);
        delayLFO.playbackRate = rate * IS.Random.Select(0.5, 0.25, 1, 2);
        delayLFO.loop = true;

        const delayLFOFilter = IS.createFilter('lowpass', 10, 1);

        delayLFO.connect(delayLFOFilter);

        // CREATE BUFFERS

        const bufferSourceArray = [];

        const presetBuffer = new PitchedPresets();
        const highpass = IS.createFilter( "highpass", 20, 1);
        const lowshelf = IS.createFilter("lowshelf", 200, 1);
        lowshelf.gain = -6;

        const spliceBuffer = IS.createBuffer(1 , bufferLength);

        let spliceStartPercent = 0;

        let nSplices = spliceDiv;
        let spliceLength = 1 / nSplices;
        let spliceMax = 1 - spliceLength;

        for(let bufferIndex= 0; bufferIndex < nBuffers; bufferIndex++)
        {
            let buffer = IS.createBuffer(1, bufferLength);

            for(let spliceIndex= 0; spliceIndex < nSplices; spliceIndex++)
            {
                spliceStartPercent = IS.Random.Float(0, spliceMax);
                let spliceEndPercent = spliceStartPercent + spliceLength;
                let spliceInsertPercent = spliceIndex / nSplices;

                presetBuffer[IS.Random.Select(...pArray)](fund*IS.Random.Select(...cArray));

                spliceBuffer.splice
                (
                    presetBuffer.b1,
                    spliceStartPercent, spliceEndPercent,
                    spliceInsertPercent
                ).add();

                spliceBuffer.ramp
                (
                    spliceIndex/nSplices , (spliceIndex+1)/nSplices,
                    IS.Random.Select(0.01, 0.5), IS.Random.Select(0.015, 0.5),
                    IS.Random.Select(0.01, 1), IS.Random.Select(4, 1)
                ).multiply();

                buffer.add(spliceBuffer);
            }

            buffer.normalize();
            buffer.movingAverage(36);
            buffer.ramp
            (
                0, 1,
                0.0125, 0.9875,
                0.5, 0.5
            ).multiply();

            let bufferSource = IS.createBufferSource(buffer);
            bufferSource.connect(highpass);
            bufferSource.playbackRate = rate;

            bufferSourceArray[bufferIndex] = bufferSource;
        }

        highpass.connect(lowshelf);
        lowshelf.connect(delay);

        lowshelf.connect(output);
        delay.connect(output);

        output.connect(this.mainGain);

        let time = 0;

        for(let phraseIndex= 0; phraseIndex < numberOfPhrases; phraseIndex++)
        {
            time = phraseIndex * (bufferLength / rate) + startTime + this.globalNow;

            if (time < this.globalNow + stopTime)
            {
                bufferSourceArray[IS.Random.Int(0, bufferSourceArray.length)].scheduleStart(time);
            }
            else
            {
                break
            }
        }

        delayLFO.scheduleStart(this.globalNow + startTime);

        output.gain.scheduleValue(0, this.globalNow + stopTime, 0.1);
        delayLFO.scheduleStop(this.globalNow + stopTime);

    }

    bufferSequence2KeyPan
    (
        startTime, stopTime,
        numberOfBuffers, bufferLength,
        numberOfPhrases,
        rate, spliceDiv, fund, cArray, pArray, gainVal
    )
    {
        const output = IS.createGain(gainVal);
        const delay = IS.createStereoDelay
        (
            IS.Random.Float(0.01, 0.035), IS.Random.Float(0.01, 0.035), IS.Random.Float(0, 0.1), 1
        );
        delay.gain = 1;

        const delayLFOBuffer = IS.createBuffer(1, 1);

        if(IS.Random.CoinToss())
        {
            delayLFOBuffer.sawtooth(1).add();
        }
        else
        {
            delayLFOBuffer.sawtooth(1).add();
        }

        const delayLFO = IS.createBufferSource(delayLFOBuffer);
        delayLFO.playbackRate = rate * IS.Random.Select(0.5 , 0.25 , 1 , 2);
        delayLFO.loop = true;

        const delayLFOFilter = IS.createFilter('lowpass', 10, 1);

        delayLFO.connect(delayLFOFilter);

        // CREATE BUFFERS

        const bufferSourceArray = [];

        const presetBuffer = new PitchedPresets();
        const highpass = IS.createFilter("highpass", 20, 1);
        const lowpass = IS.createFilter("lowshelf", 200, 1);
        lowpass.gain = -6;

        const pan = IS.createStereoPanner(0);

        const preBuffer = IS.createBuffer(1, bufferLength);

        let spliceStartPercent = 0;

        let nSplices = spliceDiv;
        let spliceLength = 1 / nSplices;
        let spliceMax = 1 - spliceLength;

        for(let bufferIndex= 0; bufferIndex < numberOfBuffers; bufferIndex++)
        {
            let buffer = IS.createBuffer(1, bufferLength);

            for(let spliceIndex= 0; spliceIndex < nSplices; spliceIndex++)
            {
                spliceStartPercent = IS.Random.Float(0, spliceMax);
                let spliceEndPercent = spliceStartPercent + spliceLength;
                let spliceInsertPercent = spliceIndex / nSplices;

                presetBuffer[IS.Random.Select(...pArray)](fund*IS.Random.Select(...cArray));

                buffer.suspendOperations();

                    buffer.splice
                    (
                        presetBuffer.b1,
                        spliceStartPercent, spliceEndPercent,
                        spliceInsertPercent
                    ).add();

                    buffer.ramp
                    (
                        spliceInsertPercent , (spliceIndex+1) / nSplices,
                        IS.Random.Select(0.01, 0.5), IS.Random.Select(0.015, 0.5),
                        IS.Random.Select(0.01, 1) , IS.Random.Select(4, 1)
                    ).multiply();

               buffer.applySuspendedOperations().add();
            }

            buffer.normalize();
            buffer.movingAverage(36);
            buffer.ramp
            (
                0, 1, 0.0125, 0.9875, 0.5, 0.5
            ).multiply();

            let bufferSource = IS.createBufferSource(buffer);
            bufferSource.connect(highpass);
            bufferSource.playbackRate = rate;

            bufferSourceArray[bufferIndex] = bufferSource;
        }

        highpass.connect(lowpass);

        lowpass.connect(delay);
        lowpass.connect(pan);

        // delay.connect(output);
        pan.connect(output);

        output.connect(this.mainGain);

        let time = 0;

        for(let phraseIndex= 0; phraseIndex < numberOfPhrases; phraseIndex++)
        {
            time = phraseIndex * (bufferLength / rate) + startTime + this.globalNow;

            if ( time < this.globalNow + stopTime )
            {
                bufferSourceArray[IS.Random.Int(0, bufferSourceArray.length)].scheduleStart(time);
                pan.pan.scheduleValue(IS.Random.Float(-1, 1), time);
            }
            else
            {
                break
            }
        }

        delayLFO.scheduleStart(this.globalNow + startTime);

        output.gain.scheduleValue(0, this.globalNow + stopTime, 0.1);
        delayLFO.scheduleStop(this.globalNow + stopTime);
    }

    fluxLine()
    {
        this.fund = 2 * IS.Random.Float(160, 180);
        this.gainVal = 1.5;

        this.c1A = [1, M2, P4, 1/m3, M6];
        this.c1B = [1/M2/P4, 1, M2];
        this.c1C = [1, M2, M3, P5];
        this.c1D = [1, M2, M3, P5, M6];

        this.chordArray = [this.c1B, this.c1C, this.c1D]; // c1D , c1C* , c1A , c1B

        this.chordIdx = 1 // IS.Random.Int( 0 , chordArray.length );
        this.currentChord = this.chordArray[this.chordIdx];

        this.bL = IS.Random.Float( 1.25 , 2.5 );
        this.rate = 1 / this.bL;
        this.pL = 1 / this.rate;
        this.nPhrases = 40; // IS.Random.Int( 30 , 40 );

        // TODO: move to config
        console.log
        (
            `this.fund: ${this.fund}, chord: ${this.chordIdx}, bufferLength: ${this.bL},
            this.rate: ${this.rate}, this.nPhrases ${this.nPhrases}`
        );

        // startTime, stopTime, bufferLength, this.rate, spliceDiv, this.fund, cArray, pArray, this.gainVal

        for(let phraseIndex = 0 ; phraseIndex < this.nPhrases ; phraseIndex++)
        {
			let chord = phraseIndex < this.nPhrases / 2 ? this.chordArray[1] : this.chordArray[2];

            this.pitchedPresetSequenceSpliceDelayPan
            (
                phraseIndex * this.pL,  (phraseIndex + 1) * this.pL,
                this.bL, this.rate,  IS.Random.Int(3, 9),  this.fund * 0.5,
                chord, this.pAHigh1, this.gainVal
            );

            if (phraseIndex > this.nPhrases * 0.25)
            {
                this.pitchedPresetSequenceSpliceDelayPan
                (
                    phraseIndex * this.pL,  (phraseIndex + 1) * this.pL,  this.bL, this.rate,
                    IS.Random.Int(3, 9), this.fund, chord, this.pAHigh1, this.gainVal
                );
            }
        }
    }
}
