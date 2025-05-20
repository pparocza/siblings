import { IS } from "../../../script.js";

export class Piece
{
    constructor(){}

    initMasterChannel()
    {
        this.gain = audioCtx.createGain();
        this.gain.gain.value = 1;

        // REVERB

        this.c = new MyConvolver(2, 3, audioCtx.sampleRate);
        this.cB = new MyBuffer(2, 3, audioCtx.sampleRate);
        this.convolverBuffer.makeNoise();
        this.convolverBuffer.applyRamp(0, 1, 0.01, 0.015, 0.5, 4);

        this.convolver.setBuffer(this.convolverBuffer.buffer);
        this.convolver.output.gain.value = 0.25;

        // DELAY

        this.d = new Effect();

        this.dL = randomFloat(0.25, 0.4);

        this.delay.stereoDelay(this.dL*2, this.dL, 0.2, 1);
        this.delay.on();
        this.delay.output.gain.value = 0.25;

        this.dF = new MyBiquad( 'highpass' , 500 , 1 );
        this.cF = new MyBiquad( 'highpass' , 500 , 1 );

        this.f = new MyBiquad( "highpass" , 10 , 1 );
        this.f2 = new MyBiquad("lowpass" , 20000, 1 );

        // LFO DELAY

        this.dSend3In = new MyGain( 0.25 );
        this.dSend3 = new Effect();
        this.dSend3.randomShortDelay();
        this.dSend3.on();

        this.dS3L1 = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dS3L2 = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.dS3L1.noise().fill( 0 );
        this.dS3L2.noise().fill( 0 );
        this.dS3L1.constant( 0.04 ).multiply( 0 );
        this.dS3L2.constant( 0.04 ).multiply( 0 );
        this.dS3L1.loop = true;
        this.dS3L2.loop = true;
        this.dS3L1.playbackRate = randomFloat( 0.00001 , 0.000001 );
        this.dS3L2.playbackRate = randomFloat( 0.00001 , 0.000001 );

        this.dS3L1.connect( this.dSend3.dly.delayL.delayTime );
        this.dS3L2.connect( this.dSend3.dly.delayR.delayTime );

        this.dSend3In.connect( this.dSend3 );

        this.dS3L1.start();
        this.dS3L2.start();

        // DISTORTION

        this.w = new MyWaveShaper();
        this.w.makeSigmoid( 2 );
        this.w.output.gain.value = 1;

        this.wF = new MyBiquad( 'highpass' , 600 , 1 );

        // MAIN

        this.fadeFilter = new FilterFade(0);

        this.masterGain = audioCtx.createGain();

        // CONNECTIONS

        this.mainGain.connect(this.convolver.input);
        this.mainGain.connect(this.delay.input);
        this.mainGain.connect( this.dSend3In.input );

        this.mainGain.connect(this.gain);

        this.convolver.connect(this.cF);
        this.delay.connect(this.dF);
        this.dSend3.connect( this.dF );

        this.cF.connect(this.gain);
        this.dF.connect(this.gain);

        this.gain.connect( this.w.input );
        this.w.connect( this.wF );
        this.wF.connect( this.filter );

        this.gain.connect(this.filter.input);
        this.filter.connect(this.f2);

        this.f2.connect(this.fadeFilter);
        this.fadeFilter.connect(audioCtx.destination);

    }

    initParams()
    {

        this.fund = 2 * randomFloat(160, 180);
        this.gainVal = 0.25;

        this.pA =  [
            'pitch23' , 'pitch27' , 'pitch1' , 'pitch3' , 'pitch7', 'pitch9' , 'pitch10', 'pitch12' , 'pitch13', 'pitch20'
        ];

        this.pAHigh1 =  [
            'pitch23' , 'pitch27' , 'pitch1' , 'pitch12' , 'pitch13' , 'pitch20'
        ];

        this.pALow1 =  [
            'pitch23' , 'pitch27' , 'pitch20'
        ];

        this.c1A = [1, M2, P4, 1/m3, M6];
        this.c1B = [1/M2/P4, 1, M2];
        this.c1C = [1, M2, M3, P5];
        this.c1D = [1, M2, M3, P5, M6];

        this.chordArray = [ this.c1B , this.c1C , this.c1D ]; // c1D , c1C* , c1A , c1B

        this.chordIdx = randomInt( 0 , this.chordArray.length );
        this.currentChord = this.chordArray[ this.chordIdx ];
		this.chord2 = this.chordArray[ randomInt( 0 , this.chordArray.length ) ];

        this.div = randomInt( 5 , 11 );
        this.rate = randomFloat( 0.2 , 0.3 );
        this.pL = 1/this.rate;
        this.endTime = this.div * 14;

    }

    printParams( paramText )
    {

        // create a new div element
        const newDiv = document.createElement("p");

        // and give it some content
        const newContent = document.createTextNode( paramText );

        // add the text node to the newly created div
        newDiv.appendChild(newContent);

        // add the newly created element and its content into the DOM
        const currentDiv = document.getElementById("div1");
        document.body.insertBefore(newDiv, currentDiv);


    }

    schedule()
    {

        this.fadeFilter.start(1, 50);
        this.globalNow = audioCtx.currentTime;

		var pieceIndices = [0, 1, 7, 3];
        this.r = pieceIndices[randomInt(0, pieceIndices.length)]; // randomInt( 0 , 6 ); // 0, 1, 7, 2 is nice but too short, 3
		// 4 is not great
		// 5 is ok but also has a legitimate B section
		// 6 is too much

        switch(this.r){
            case 0:
                console.log( 'PIECE: rhythm tests original' );
                this.rhythmTestsOriginal();
                break;
            case 1:
                console.log( 'PIECE: flux line' );
                this.fluxLine();
                break;
            case 2:
                console.log( 'PIECE: regular continuous line' );
                this.regularContinuousLine();
                break;
            case 3:
                console.log( 'PIECE: cool progression buffer sequence' );
                this.coolProgressionBufferSequence();
                break;
            case 4:
                console.log( 'PIECE: cool progression buffer sequence 2' );
                this.coolProgressionBufferSequence2();
                break;
            case 5:
                console.log( 'PIECE: cool progression buffer sequence 3' );
                this.coolProgressionBufferSequence3();
                break;
            case 6:
                console.log( 'PIECE: cool progression buffer sequence 4' );
                this.coolProgressionBufferSequence4();
                break;
            case 7:
                console.log( 'PIECE: cool progression buffer sequence 4' );
                this.coolProgressionBufferSequence5();
                break;
        }

    }

    rhythmTestsOriginal()
    {

        console.log(`fund: ${this.fund} , chord: ${this.chordIdx} , div ${this.div} , rate: ${this.rate} , end time: ${this.endTime}`);

        this.pitchedPresetSequenceSpliceDelay( this.div*0 , this.div*4 ,  randomFloat( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*0 , this.div*6 ,  randomFloat( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*1 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div * 0.5  ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*2 , this.div*9 ,  2 , 0.25 ,  3 ,     this.fund*0.25  , this.currentChord , this.pALow1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*3 , this.endTime ,  randomFloat( 1 , 2 ) , randomFloat( 0.5 , 1.5 ) ,  this.div * randomArrayValue( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*4 , this.endTime ,  randomFloat( 1 , 2 ) , randomFloat( 0.5 , 1.5 ) ,  this.div * randomArrayValue( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*5 , this.endTime ,  randomFloat( 1 , 2 ) , randomFloat( 0.5 , 1.5 ) ,  this.div * randomArrayValue( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*4 , this.div*9 ,  randomFloat( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*5 , this.div*9 ,  randomFloat( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*6 , this.div*9 ,  randomFloat( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );

        this.pitchedPresetSequenceSpliceDelay( this.div*7 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div * 0.33 ,  this.fund ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*7 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div * 0.33 ,  this.fund ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  randomFloat( 1 , 2 ) , randomFloat( 0.5 , 1.5 ) ,  this.div * randomArrayValue( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  randomFloat( 1 , 2 ) , randomFloat( 0.5 , 1.5 ) ,  this.div * randomArrayValue( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  randomFloat( 1 , 2 ) , randomFloat( 0.5 , 1.5 ) ,  this.div * randomArrayValue( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*9 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );
        this.pitchedPresetSequenceSpliceDelay( this.div*9 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*9 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*9 , this.endTime ,  2 , 0.25 ,  3 ,     this.fund*0.25  , this.currentChord , this.pALow1 , this.gainVal );

        this.pitchedPresetSequenceSpliceDelay( this.div*10 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*11 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        this.pitchedPresetSequenceSpliceDelay( this.div*12 , this.endTime ,  randomFloat( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );

    }

    coolProgression2Buffer()
    {

        console.log(`fund: ${this.fund} , chord: ${this.chordIdx} , div ${this.div} , rate: ${this.rate} , end time: ${this.endTime}`);

        this.pitchedPresetSequenceSpliceDelayBuffer( 0         , this.pL*16 ,  1 , this.rate ,  this.div ,  this.fund * 2 , this.currentChord , this.pAHigh1 , this.gainVal * 4 );
        this.pitchedPresetSequenceSpliceDelayBuffer( this.pL*2 , this.pL*16 ,  1 , this.rate ,  this.div ,  this.fund * 2 , this.currentChord , this.pAHigh1 , this.gainVal * 4 );
        this.pitchedPresetSequenceSpliceDelayBuffer( this.pL*4 , this.pL*16 ,  1 , this.rate ,  this.div ,  this.fund     , this.currentChord , this.pAHigh1 , this.gainVal * 4 );
        this.pitchedPresetSequenceSpliceDelayBuffer( this.pL*6 , this.pL*16 ,  1 , this.rate ,  this.div ,  this.fund * 4 , this.currentChord , this.pAHigh1 , this.gainVal * 4 );
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

    coolProgressionBufferSequence2()
    {

        this.bufferLength = randomFloat(0.25, 0.75);
        this.numberOfBuffers = 3;

        this.gainVal = 0.4;

        const paramText = `fund: ${this.fund} , chord: ${this.chordIdx} , buffer length: ${this.bufferLength} , number of buffers: ${this.numberOfBuffers} , div ${this.div} , rate: ${this.rate} , end time: ${this.endTime}`;

        console.log( paramText );
        this.printParams( paramText );

        // fund: 321.7518105312957 , chord: 1 , buffer length: 0.524101316685738 , numberOfBuffers: 3 div 5 , rate: 0.24451625173432107 , end time: 70
        // fund: 351.057322885385 , chord: 1 , buffer length: 0.31257002863172667 , number of buffers: 3 , div 7 , rate: 0.2717447712886779 , end time: 98
        // fund: 331.7601514586694 , chord: 1 , buffer length: 0.2711487037164132 , number of buffers: 3 , div 7 , rate: 0.2697785683254287 , end time: 98

        // startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal
        this.bufferSequence2( 0  , 100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div       ,  this.fund * 2 , this.currentChord , this.pALow1 , this.gainVal * 3 );
        this.bufferSequence2( 0  , 100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div       ,  this.fund * 4 , this.currentChord , this.pALow1 , this.gainVal * 4 );
        this.bufferSequence2( 0  , 100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 0.5 ,  this.fund * 1 , this.currentChord , this.pALow1 , this.gainVal * 0.75 );
        this.bufferSequence2( 50 , 100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 3   ,  this.fund * 4 , this.currentChord , this.pALow1 , this.gainVal * 2 );

    }

    coolProgressionBufferSequence3()
    {

        this.fund = 343.73703558146576;

        this.chord1 = [ 1 , M2 , M3 , P5 ];
        this.chord2 = [ 1 , M3 , M3 * 2 , P5 , P5 * 2 , M6 , M2 * 2 ];
        // this.chord = [ 1 , M2 , M3 , P5 ];
        // this.chord2 = [1/M2, M2, M6, P4];

        this.bufferLength = 0.3255060810505064;
        this.numberOfBuffers = 5;
        this.div = 3;
        this.rate = 0.28577601206429365;
        this.pL = this.bufferLength / this.rate ;

        this.gainVal = 0.2;

        const paramText = `fund: ${this.fund} , chord: ${this.chordIdx} , buffer length: ${this.bufferLength} , number of buffers: ${this.numberOfBuffers} , div ${this.div} , rate: ${this.rate} , end time: ${this.endTime}`;

        console.log( paramText );
        this.printParams( paramText );

        // startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal

        // 1
        this.bufferSequence2( this.pL*0  , this.pL*36 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div ,  this.fund * 1 , this.chord1 , this.pALow1 , this.gainVal * 5 );
        this.bufferSequence2Pan( this.pL*16 , this.pL*36 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord1 , this.pALow1 ,  this.gainVal * 6 * 3 );

        // 2
        this.bufferSequence2Pan( this.pL*36 , this.pL*100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord2 , this.pALow1 , this.gainVal * 7 * 3 );
        this.bufferSequence2Pan( this.pL*36 , this.pL*100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 4 , this.chord2 , this.pALow1 , this.gainVal * 4 * 3 );

        this.bufferSequence2Pan( this.pL*52 , this.pL*100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord2 , this.pALow1 , this.gainVal * 6 * 3 );
        this.bufferSequence2( this.pL*52 , this.pL*100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 1 , this.fund * 1 , this.chord2 , this.pALow1 , this.gainVal * 4 );

        // 3
        this.bufferSequence2Key( this.pL*78 , this.pL*100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord2 , this.pALow1 , this.gainVal * 9 );

        /*
        this.bufferSequence2( this.pL*20 , this.pL*28 , this.numberOfBuffers , this.bufferLength , 100 , this.rate , this.div , this.fund * 1 , this.chord , this.pALow1 , this.gainVal * 5 );
        this.bufferSequence2( this.pL*20 , this.pL*28 , this.numberOfBuffers , this.bufferLength , 100 , this.rate , this.div , this.fund * 2 , this.chord , this.pALow1 , this.gainVal * 7 );
        this.bufferSequence2( this.pL*24  , this.pL*28 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 4 , this.chord , this.pALow1 , this.gainVal * 8 );
        */

    }

    coolProgressionBufferSequence4()
    {

        this.bufferLength = randomFloat(0.25, 0.75);
        this.numberOfBuffers = 5;
        this.div = randomInt( 3 , 7 );

        // fund: 343.73703558146576 , chord: 1 , buffer length: 0.3255060810505064 , number of buffers: 3 , div 4 , rate: 0.28577601206429365 , end time: 70

        this.fund = 343.73703558146576;
        this.chord = [1, M2, M3, P5];
        this.bufferLength = 0.3255060810505064;
        this.div = 3;
        this.rate = 0.28577601206429365;

        const paramText = `fund: ${this.fund} , chord: ${this.chordIdx} , buffer length: ${this.bufferLength} , number of buffers: ${this.numberOfBuffers} , div ${this.div} , rate: ${this.rate} , end time: ${this.endTime}`;

        console.log( paramText );
        this.printParams( paramText );

        // startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal
        // this.bufferSequence2( this.pL*0  , this.pL*8 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div , this.fund * 2 , this.currentChord , this.pALow1 , this.gainVal * 5 );
        this.bufferSequence2( this.pL*0  , this.pL*8 , this.numberOfBuffers , this.bufferLength , 100 , this.rate * 2 ,  this.div * 2 , this.fund * 2 , this.currentChord , this.pALow1 , this.gainVal * 5 );
        // this.bufferSequence2( this.pL*4  , this.pL*8 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div       ,  this.fund * 4 , this.currentChord , this.pALow1 , this.gainVal * 5 );
        // this.bufferSequence2( this.pL*4  , this.pL*8 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 0.5 ,  this.fund * 1 , this.currentChord , this.pALow1 , this.gainVal * 2 );
        // this.bufferSequence2( 0 ,  100 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 3   ,  this.fund * 4 , this.currentChord , this.pALow1 , this.gainVal * 2 );

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

		// - Quick and Dirty B Section - it's really bad rn

		/*
		this.bufferSequence2Key(    this.pL*89 , this.pL*89 + this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord1 , this.pAHigh1 , this.gainVal * 1 );
        this.bufferSequence2Key(    this.pL*89 , this.pL*89 + this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord1 , this.pAHigh1 , this.gainVal * 1 );
        this.bufferSequence2KeyPan( this.pL*89 , this.pL*89 + this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord1 , this.pAHigh1 , this.gainVal * 2 );
        this.bufferSequence2KeyPan( this.pL*89 , this.pL*89 + this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 2 , this.chord1 , this.pAHigh1 , this.gainVal * 2 );

        this.bufferSequence2KeyPan( this.pL*89 , this.pL*89 + this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 4 , this.chord1 , this.pAHigh1 , this.gainVal * 2 );
        this.bufferSequence2KeyPan( this.pL*89 , this.pL*89 + this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 2 , this.fund * 4 , this.chord1 , this.pAHigh1 , this.gainVal * 2 );

        this.bufferSequence2Key(    this.pL*89 ,  this.pL*89 + this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 1 , this.fund * 1 , this.chord1 , this.pAHigh1 , this.gainVal * 0.75 );
        this.bufferSequence2Key(    this.pL*89 ,  this.pL*89 + this.pL*89 , this.numberOfBuffers , this.bufferLength , 100 , this.rate ,  this.div * 0.5 , this.fund * 0.5 , this.chord1 , this.pAHigh1 , this.gainVal * 0.5 );
		*/
    }

    pitchedPresetSequenceSpliceDelay(startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal)
    {

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

        output.connect(this.mainGain);

        impulse.startAtTime( this.globalNow + startTime );
        delayLFO.startAtTime( this.globalNow + startTime );

        output.gain.gain.setTargetAtTime(0, this.globalNow+stopTime, 0.1);

        impulse.stopAtTime( this.globalNow + stopTime );
        delayLFO.stopAtTime( this.globalNow + stopTime );
    }

    pitchedPresetSequenceSpliceDelayPan(startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal)
    {

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
        const pan = new MyPanner2( randomFloat( -1 , 1 ) );

        impulse.connect(c);
        c.connect(f);
        f.connect(delay);

        f.connect(pan);
        pan.connect(output);

        delay.connect(output);

        output.connect(this.mainGain);

        impulse.startAtTime( this.globalNow + startTime );
        delayLFO.startAtTime( this.globalNow + startTime );

        output.gain.gain.setTargetAtTime(0, this.globalNow+stopTime, 0.1);

        impulse.stopAtTime( this.globalNow + stopTime );
        delayLFO.stopAtTime( this.globalNow + stopTime );
    }

    pitchedPresetSequenceSpliceDelayBuffer(startTime, stopTime, bufferLength, rate, spliceDiv, fund, cArray, pArray, gainVal)
    {

        const output = new MyGain(gainVal);
        const delay = new Effect();
        delay.randomShortDelay();
        delay.on();
        delay.output.gain.value = 0;
        const delayLFO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        delayLFO.sawtooth( 2 ).add();
        delayLFO.playbackRate = rate;
        delayLFO.loop = true;

        delayLFO.connect(delay.output.gain);

        // CREATE BUFFERS

        const bL = bufferLength;

        const b = new MyBuffer2(1, bL, audioCtx.sampleRate);
        const aB = new MyBuffer2(1, bL, audioCtx.sampleRate);
        const sB = new MyBuffer2(1, bL, audioCtx.sampleRate);
        const c = new MyBuffer2(1, bL, audioCtx.sampleRate);
        c.playbackRate = rate;
        c.loop = true;

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

        c.addBuffer( b.buffer );

        const f = new MyBiquad("highpass", 10, 1);

        c.connect(f);
        f.connect(delay);

        f.connect(output);
        delay.connect(output);

        output.connect(this.mainGain);

        c.startAtTime( this.globalNow + startTime );
        delayLFO.startAtTime( this.globalNow + startTime );

        output.gain.gain.setTargetAtTime(0, this.globalNow+stopTime, 0.1);

        c.stopAtTime( this.globalNow + stopTime );
        delayLFO.stopAtTime( this.globalNow + stopTime );

    }

    bufferSequence (startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal)
    {

        const output = new MyGain(gainVal);
        const delay = new Effect();
        delay.randomShortDelay();
        delay.on();
        delay.output.gain.value = 0;
        const delayLFO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        const dR = randomInt( 0 , 2 );

        dR === 1 ? delayLFO.sawtooth( 1 ).add() : delayLFO.inverseSawtooth( 1 ).add();

        delayLFO.playbackRate = rate * randomArrayValue( [ 0.5 , 0.25 , 1 , 2 ] );
        delayLFO.loop = true;

        const delayLFOFilter = new MyBiquad( 'lowpass' , 10 , 1 );

        delayLFO.connect(delayLFOFilter);
        delayLFOFilter.connect(delay.output.gain);

        // CREATE BUFFERS

        const bL = bufferLength;

        const nB = numberOfBuffers;

        const bA = [];

        const p = new PitchedPresets();
        const f = new MyBiquad("highpass", 30, 1);

        let sP = 0;

        let nS = spliceDiv;

        for(let j=0; j<nB; j++){

            bA[j] = new MyBuffer2(1, bL, audioCtx.sampleRate);

            for(let i=0; i<nS; i++){

                sP = randomFloat(0, 1-(1/nS));

                p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

                bA[j].spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

            }

            bA[j].normalize(-1, 1);
            bA[j].movingAverage(36);
            bA[j].ramp( 0 , 1 , 0.0125 , 0.9875 , 0.5 , 0.5 ).multiply( 0 );

            bA[j].connect(f);

            bA[j].playbackRate = rate;

        }

        f.connect(delay);

        f.connect(output);
        delay.connect(output);

        output.connect(this.mainGain);

        const nP = numberOfPhrases;
        let t = 0;

        for( let i=0; i<nP; i++){

            t = i / (bufferLength * rate) + startTime + this.globalNow;

            if ( t < this.globalNow + stopTime ){
                bA[randomInt(0, bA.length)].startAtTime( t );
            }

        }

        delayLFO.startAtTime( this.globalNow + startTime );

        output.gain.gain.setTargetAtTime( 0, this.globalNow + stopTime, 0.1 );
        delayLFO.stopAtTime( this.globalNow + stopTime );

    }

    bufferSequence2 (startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal)
    {

        const output = new MyGain(gainVal);
        const delay = new Effect();
        delay.randomShortDelay();
        delay.on();
        delay.output.gain.value = 1;
        const delayLFO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        const dR = randomInt( 0 , 2 );

        dR === 1 ? delayLFO.sawtooth( 1 ).add() : delayLFO.sawtooth( 1 ).add();

        delayLFO.playbackRate = rate * randomArrayValue( [ 0.5 , 0.25 , 1 , 2 ] );
        delayLFO.loop = true;

        const delayLFOFilter = new MyBiquad( 'lowpass' , 10 , 1 );

        delayLFO.connect(delayLFOFilter);
        // delayLFOFilter.connect(delay.output.gain);

        // CREATE BUFFERS

        const bL = bufferLength;

        const nB = numberOfBuffers;

        const bA = [];

        const p = new PitchedPresets();
        const f = new MyBiquad( "highpass", 20 , 1 );
        const f2 = new MyBiquad( "lowshelf" , 200 , 1 );
        f2.biquad.gain.value = -6;
        const pan = new MyPanner2( 0 );

        let sP = 0;

        let nS = spliceDiv;

        for(let j=0; j<nB; j++){

            bA[j] = new MyBuffer2(1, bL, audioCtx.sampleRate);

            for(let i=0; i<nS; i++){

                sP = randomFloat(0, 1-(1/nS));

                p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

                bA[j].spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

            }

            bA[j].normalize(-1, 1);
            bA[j].movingAverage(36);
            bA[j].ramp( 0 , 1 , 0.0125 , 0.9875 , 0.5 , 0.5 ).multiply( 0 );

            bA[j].connect(f);

            bA[j].playbackRate = rate;

        }

        f.connect(f2);
        f2.connect(delay);

        f2.connect(output);
        delay.connect(output);

        output.connect(this.mainGain);

        const nP = numberOfPhrases;
        let t = 0;

        for( let i=0; i<nP; i++){

            t = i * (bufferLength / rate) + startTime + this.globalNow;

            if ( t < this.globalNow + stopTime ){
                bA[randomInt(0, bA.length)].startAtTime( t );
            } else { break };

        }

        delayLFO.startAtTime( this.globalNow + startTime );

        output.gain.gain.setTargetAtTime( 0, this.globalNow + stopTime, 0.1 );
        delayLFO.stopAtTime( this.globalNow + stopTime );

    }

    bufferSequence2Key (startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal)
    {

        const output = new MyGain(gainVal);
        const delay = new Effect();
        delay.randomShortDelay();
        delay.on();
        delay.output.gain.value = 1;
        const delayLFO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        const dR = randomInt( 0 , 2 );

        dR === 1 ? delayLFO.sawtooth( 1 ).add() : delayLFO.sawtooth( 1 ).add();

        delayLFO.playbackRate = rate * randomArrayValue( [ 0.5 , 0.25 , 1 , 2 ] );
        delayLFO.loop = true;

        const delayLFOFilter = new MyBiquad( 'lowpass' , 10 , 1 );

        delayLFO.connect(delayLFOFilter);
        // delayLFOFilter.connect(delay.output.gain);

        // CREATE BUFFERS

        const bL = bufferLength;

        const nB = numberOfBuffers;

        const bA = [];

        const p = new PitchedPresets();
        const f = new MyBiquad( "highpass", 20 , 1 );
        const f2 = new MyBiquad( "lowshelf" , 200 , 1 );
        f2.biquad.gain.value = -6;
        const pan = new MyPanner2( 0 );

        const pB = new MyBuffer2( 1 , bL , audioCtx.sampleRate );

        let sP = 0;

        let nS = spliceDiv;

        for(let j=0; j<nB; j++){

            bA[j] = new MyBuffer2(1, bL, audioCtx.sampleRate);

            for(let i=0; i<nS; i++){

                sP = randomFloat(0, 1-(1/nS));

                p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

                pB.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);
                pB.ramp( i/nS , (i+1)/nS, randomArrayValue( [ 0.01 , 0.5 ] ), randomArrayValue( [ 0.015 , 0.5 ] ), randomArrayValue( [ 0.01 , 1 ] ) , randomArrayValue( [ 4 , 1 ] ) ).multiply( 0 );

                bA[j].addBuffer( pB.buffer );

            }

            bA[j].normalize(-1, 1);
            bA[j].movingAverage(36);
            bA[j].ramp( 0 , 1 , 0.0125 , 0.9875 , 0.5 , 0.5 ).multiply( 0 );

            bA[j].connect(f);

            bA[j].playbackRate = rate;

        }

        f.connect(f2);
        f2.connect(delay);

        f2.connect(output);
        delay.connect(output);

        output.connect(this.mainGain);

        const nP = numberOfPhrases;
        let t = 0;

        for( let i=0; i<nP; i++){

            t = i * (bufferLength / rate) + startTime + this.globalNow;

            if ( t < this.globalNow + stopTime ){
                bA[randomInt(0, bA.length)].startAtTime( t );
            } else { break };

        }

        delayLFO.startAtTime( this.globalNow + startTime );

        output.gain.gain.setTargetAtTime( 0, this.globalNow + stopTime, 0.1 );
        delayLFO.stopAtTime( this.globalNow + stopTime );

    }

    bufferSequence2KeyPan (startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal)
    {

        const output = new MyGain(gainVal);
        const delay = new Effect();
        delay.randomShortDelay();
        delay.on();
        delay.output.gain.value = 1;
        const delayLFO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        const dR = randomInt( 0 , 2 );

        dR === 1 ? delayLFO.sawtooth( 1 ).add() : delayLFO.sawtooth( 1 ).add();

        delayLFO.playbackRate = rate * randomArrayValue( [ 0.5 , 0.25 , 1 , 2 ] );
        delayLFO.loop = true;

        const delayLFOFilter = new MyBiquad( 'lowpass' , 10 , 1 );

        delayLFO.connect(delayLFOFilter);
        // delayLFOFilter.connect(delay.output.gain);

        // CREATE BUFFERS

        const bL = bufferLength;

        const nB = numberOfBuffers;

        const bA = [];

        const p = new PitchedPresets();
        const f = new MyBiquad( "highpass", 20 , 1 );
        const f2 = new MyBiquad( "lowshelf" , 200 , 1 );
        f2.biquad.gain.value = -6;
        const pan = new MyPanner2( 0 );

        const pB = new MyBuffer2( 1 , bL , audioCtx.sampleRate );

        let sP = 0;

        let nS = spliceDiv;

        for(let j=0; j<nB; j++){

            bA[j] = new MyBuffer2(1, bL, audioCtx.sampleRate);

            for(let i=0; i<nS; i++){

                sP = randomFloat(0, 1-(1/nS));

                p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

                pB.spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);
                pB.ramp( i/nS , (i+1)/nS, randomArrayValue( [ 0.01 , 0.5 ] ), randomArrayValue( [ 0.015 , 0.5 ] ), randomArrayValue( [ 0.01 , 1 ] ) , randomArrayValue( [ 4 , 1 ] ) ).multiply( 0 );

                bA[j].addBuffer( pB.buffer );

            }

            bA[j].normalize(-1, 1);
            bA[j].movingAverage(36);
            bA[j].ramp( 0 , 1 , 0.0125 , 0.9875 , 0.5 , 0.5 ).multiply( 0 );

            bA[j].connect(f);

            bA[j].playbackRate = rate;

        }

        f.connect(f2);

        f2.connect(delay);
        f2.connect(pan);

        // delay.connect(output);
        pan.connect(output);

        output.connect(this.mainGain);

        const nP = numberOfPhrases;
        let t = 0;

        for( let i=0; i<nP; i++){

            t = i * (bufferLength / rate) + startTime + this.globalNow;

            if ( t < this.globalNow + stopTime ){
                bA[randomInt(0, bA.length)].startAtTime( t );
                pan.setPositionAtTime( randomFloat( -1 , 1 ) , t );
            } else { break };

        }

        delayLFO.startAtTime( this.globalNow + startTime );

        output.gain.gain.setTargetAtTime( 0, this.globalNow + stopTime, 0.1 );
        delayLFO.stopAtTime( this.globalNow + stopTime );

    }

    bufferSequence2Pan (startTime, stopTime, numberOfBuffers, bufferLength, numberOfPhrases, rate, spliceDiv, fund, cArray, pArray, gainVal)
    {

        const output = new MyGain(gainVal);
        const delay = new Effect();
        delay.randomShortDelay();
        delay.on();
        delay.output.gain.value = 1;
        const delayLFO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        const dR = randomInt( 0 , 2 );

        dR === 1 ? delayLFO.sawtooth( 1 ).add() : delayLFO.sawtooth( 1 ).add();

        delayLFO.playbackRate = rate * randomArrayValue( [ 0.5 , 0.25 , 1 , 2 ] );
        delayLFO.loop = true;

        const delayLFOFilter = new MyBiquad( 'lowpass' , 10 , 1 );

        delayLFO.connect(delayLFOFilter);
        // delayLFOFilter.connect(delay.output.gain);

        // CREATE BUFFERS

        const bL = bufferLength;

        const nB = numberOfBuffers;

        const bA = [];

        const p = new PitchedPresets();
        const f = new MyBiquad( "highpass", 20 , 1 );
        const f2 = new MyBiquad( "lowshelf" , 200 , 1 );
        f2.biquad.gain.value = -6;
        const pan = new MyPanner2( 0 );

        let sP = 0;

        let nS = spliceDiv;

        for(let j=0; j<nB; j++){

            bA[j] = new MyBuffer2(1, bL, audioCtx.sampleRate);

            for(let i=0; i<nS; i++){

                sP = randomFloat(0, 1-(1/nS));

                p[randomArrayValue(pArray)](fund*randomArrayValue(cArray));

                bA[j].spliceBuffer( p.b1.buffer, sP, sP+(1/nS), i/nS);

            }

            bA[j].normalize(-1, 1);
            bA[j].movingAverage(36);
            bA[j].ramp( 0 , 1 , 0.0125 , 0.9875 , 0.5 , 0.5 ).multiply( 0 );

            bA[j].connect(f);

            bA[j].playbackRate = rate;

        }

        f.connect(f2);
        f2.connect(pan);
        f2.connect(delay);

        // delay.connect(output);
        pan.connect(output);

        output.connect(this.mainGain);

        const nP = numberOfPhrases;
        let t = 0;

        for( let i=0; i<nP; i++){

            t = i * (bufferLength / rate) + startTime + this.globalNow;

            if ( t < this.globalNow + stopTime ){
                bA[randomInt(0, bA.length)].startAtTime( t );
                pan.setPositionAtTime( randomFloat ( -1 , 1 ) , t );
            } else { break };

        }

        delayLFO.startAtTime( this.globalNow + startTime );

        output.gain.gain.setTargetAtTime( 0, this.globalNow + stopTime, 0.1 );
        delayLFO.stopAtTime( this.globalNow + stopTime );

    }

    fluxLine()
    {

        this.fund = 2 * randomFloat(160, 180);
        this.gainVal = 1.5;

        this.pA =  [
            'pitch23' , 'pitch27' , 'pitch1' , 'pitch3' , 'pitch7', 'pitch9' , 'pitch10', 'pitch12' , 'pitch13', 'pitch20'
        ];

        this.pAHigh1 =  [
            'pitch23' , 'pitch27' , 'pitch1' , 'pitch12' , 'pitch13' , 'pitch20'
        ];

        this.pALow1 =  [
            'pitch23' , 'pitch27' , 'pitch20'
        ];

        this.c1A = [1, M2, P4, 1/m3, M6];
        this.c1B = [1/M2/P4, 1, M2];
        this.c1C = [1, M2, M3, P5];
        this.c1D = [1, M2, M3, P5, M6];

        this.chordArray = [ this.c1B , this.c1C , this.c1D ]; // c1D , c1C* , c1A , c1B

        this.chordIdx = 1 // randomInt( 0 , chordArray.length );
        this.currentChord = this.chordArray[ this.chordIdx ];

        this.bL = randomFloat( 1.25 , 2.5 );
        this.rate = 1/this.bL;
        this.pL = 1/this.rate;
        this.nPhrases = 40; // randomInt( 30 , 40 );

        console.log(`this.fund: ${this.fund} , chord: ${this.chordIdx} , bufferLength: ${this.bL} , this.rate: ${this.rate} , this.nPhrases ${this.nPhrases}`);

        // startTime, stopTime, bufferLength, this.rate, spliceDiv, this.fund, cArray, pArray, this.gainVal

        for( let i = 0 ; i < this.nPhrases ; i++ ){

			var chord = i < this.nPhrases / 2 ? this.chordArray[1] : this.chordArray[2];

            this.pitchedPresetSequenceSpliceDelayPan( i * this.pL ,  ( i + 1 ) * this.pL ,  this.bL , this.rate ,  randomInt( 3 , 9 ) ,  this.fund * 0.5  , chord , this.pAHigh1 , this.gainVal );

            if ( i > this.nPhrases * 0.25 ){

                this.pitchedPresetSequenceSpliceDelayPan( i * this.pL ,  ( i + 1 ) * this.pL ,  this.bL , this.rate , randomInt( 3 , 9 ) , this.fund , chord , this.pAHigh1 , this.gainVal );

            }

        }

    }

    regularContinuousLine()
    {

        this.fund = 2 * randomFloat(160, 180);
        this.gainVal = 0.75;

        this.pA =  [
            'pitch23' , 'pitch27' , 'pitch1' , 'pitch3' , 'pitch7', 'pitch9' , 'pitch10', 'pitch12' , 'pitch13', 'pitch20'
        ];

        this.pAHigh1 =  [
            'pitch23' , 'pitch27' , 'pitch1' , 'pitch12' , 'pitch13' , 'pitch20'
        ];

        this.pALow1 =  [
            'pitch23' , 'pitch27' , 'pitch20'
        ];

        this.c1A = [1, M2, P4, 1/m3, M6];
        this.c1B = [1/M2/P4, 1, M2];
        this.c1C = [1, M2, M3, P5];
        this.c1D = [1, M2, M3, P5, M6];

        this.chordArray = [ this.c1B , this.c1C , this.c1D ]; // c1D , c1C* , c1A , c1B

        this.chordIdx = 1 // randomInt( 0 , chordArray.length );
        this.currentChord = this.chordArray[ this.chordIdx ];

        this.div = randomInt( 5 , 9 );
        this.rate = 0.5;
        this.pL = 1/this.rate;
        this.nPhrases = 20;

        console.log(`this.fund: ${this.fund} , chord: ${this.chordIdx} , bufferLength: ${this.bL} , this.rate: ${this.rate} , this.nPhrases ${this.nPhrases}`);

        // startTime, stopTime, bufferLength, this.rate, spliceDiv, this.fund, cArray, pArray, this.gainVal

        for( let i = 0 ; i < this.nPhrases ; i++ ){

            this.pitchedPresetSequenceSpliceDelayPan( i * this.pL ,  ( i + 1 ) * this.pL ,  2 , this.rate ,  this.div ,  this.fund * 0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );

            if ( i > this.nPhrases * 0.125 ){

                this.pitchedPresetSequenceSpliceDelayPan( i * this.pL ,  ( i + 1 ) * this.pL ,  2 , this.rate , this.div , this.fund , this.currentChord , this.pAHigh1 , this.gainVal );

            }

            if ( i > this.nPhrases * 0.25 ){

                this.pitchedPresetSequenceSpliceDelayPan( i * this.pL ,  ( i + 1 ) * this.pL ,  2 , this.rate , this.div , this.fund * 0.5 , this.currentChord , this.pAHigh1 , this.gainVal );

            }

            if ( i > this.nPhrases * 0.5 ){

                this.pitchedPresetSequenceSpliceDelayPan( i * this.pL ,  ( i + 1 ) * this.pL ,  2 , this.rate , this.div , this.fund * 0.25 , this.currentChord , this.pAHigh1 , this.gainVal * 0.5 );

            }
        }
    }

}
