import { IS } from "../../../script.js";

export class Piece {
    
    constructor(){}

    initMasterChannel(){

        this.globalNow = 0;

        this.gain = audioCtx.createGain();
        this.gain.gain.value = 6;
    
        this.fadeFilter = new FilterFade(0);

        this.f = new MyBiquad( 'highpass' , 10 , 1 );
    
        this.masterGain = audioCtx.createGain();
        this.masterGain.connect(this.f.input);
        this.f.connect( this.gain );
        this.gain.connect(this.fadeFilter.input);
        this.fadeFilter.connect(audioCtx.destination);

        // GLOBAL NOISE

        this.globalNoise = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.globalNoise.noise().fill( 0 );
        this.globalNoise.playbackRate = 0.4;
        this.globalNoise.loop = true;
        this.globalNoise.output.gain.value = 0.15;

    }

    initFXChannels(){

        // REVERB

            this.cSend = new MyGain( 1 );

            this.c = new MyConvolver();
            this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
            this.cB.noise().fill( 0 );
            this.cB.noise().fill( 1 );
            this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 0 );
            this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 1 );

            this.c.setBuffer( this.cB.buffer );

            this.cSend.connect( this.c );
            this.c.connect( this.masterGain );

        // DELAY

            this.dSend = new MyGain( 1 );
            this.d = new Effect();
            this.d.randomEcho();
            this.d.on();

            this.d.output.gain.value = 0.25;

    }

    generateStructure(){

        this.qN = 4 * ( 1 / this.rate );
        this.bar = 2 * this.qN;
        this.nBars = 28 * ( this.rate / 2 );
        this.structureIdx = 0; // randomInt( 0 , 2 );

        switch( this.structureIdx){

            case 0: 
                console.log( 'random structure' );
                // minimumVoices
                this.randomStructure( 2 );
                break;

            case 1: 
                console.log( 'random range structure' );
                // minimumVoices , maximumVoices **
                this.randomRangeStructure( 1 , this.rCArray.length + 1 );
                break;

            case 2:
                console.log( 'spec arrangement structure' );
                // arrangementArray **
                this.specArrangementStructure( 
                    // if you replace each item with a randomInt, you can maintain a general
                    // arrangement contour, but still have variety between outputs
                    [ 5 , 2 , 5 , 1 , 3 , 6 , 2 , 7 , 1 , 8 , 7 , 6 , 5 , 4 , 3 , 1 ] 
                );
                break;

            case 3:
                console.log( 'explicit structure' );
                this.explicitStructure();
                break;

        }

        // modulus
        // this.moduloStructure( 2 );        

        // groupSize
        // this.twoGroups( 4 );

    }

    load(){

            this.rC5 = new RampingConvolver( this );
            this.rC4 = new RampingConvolver( this );
            this.rC3 = new RampingConvolver( this );
            this.rC2 = new RampingConvolver( this );
            this.rC1 = new RampingConvolver( this );

            this.rC5A = new RampingConvolver( this );
            this.rC4A = new RampingConvolver( this );
            this.rC3A = new RampingConvolver( this );
            this.rC2A = new RampingConvolver( this );

            // RAMPING CONVOLVER

            this.fund = 0.5 * randomFloat( 350 , 450 );
            this.rate = 0.5; // 4 , randomFloat( 3.9 , 4.5 );
            this.gainVal = 1;

            console.log( `fund: ${this.fund} , rate: ${this.rate}` );
    
            // startTime , rate , rampArray , bufferLength , fund , frequencyRange , gainVal

                this.rC1.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , randomArrayValue( [ 2 ])                  , this.fund * 0.5 , [ 100 , 500 ]   , this.gainVal * 2 );
                this.rC2.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , randomArrayValue( [ 1 ])                  , this.fund       , [ 100 , 500 ]   , this.gainVal * 2 );
                this.rC3.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , randomArrayValue( [ 0.25 , 0.5 , 1 , 2 ]) , this.fund       , [ 4000 , 7000 ] , this.gainVal * 2 );
                this.rC4.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , randomArrayValue( [ 0.25 , 0.5 , 1 , 2 ]) , this.fund       , [ 100 , 1000 ]  , this.gainVal * 3 );
                this.rC5.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , randomArrayValue( [ 0.5 , 1 , 2 ])        , this.fund * 0.5 , [ 100 , 5000 ]  , this.gainVal * 2 );

                this.rC2A.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , 2 , this.fund       , [ 100 , 1000 ] , this.gainVal * 2.5 );
                this.rC3A.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , 2 , this.fund * 0.5 , [ 100 , 5000 ] , this.gainVal * 1.5 );
                this.rC4A.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , 2 , this.fund       , [ 100 , 1000 ] , this.gainVal * 1.5 );
                this.rC5A.load( this.rate * randomFloat( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , 2 , this.fund * 0.5 , [ 100 , 5000 ] , this.gainVal * 1.5 );

            this.rCArray = [ this.rC1 , this.rC2 , this.rC3 , this.rC4 , this.rC5 , this.rC2A , this.rC3A , this.rC4A , this.rC5A ];

            this.generateStructure();

    }

    randomStructure( minimumVoices ){

        this.structureArray = [];

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            for( let j = 0 ; j < this.rCArray.length - minimumVoices ; j++ ){

                this.structureArray[i].push( randomInt( 0 , 2 ) );

            }

            for( let j = 0 ; j < minimumVoices ; j++ ){

                this.structureArray[i].push( 1 );

            }

            shuffle( this.structureArray[i] );
            
        }

        console.log( this.structureArray );

    }

    explicitStructure(){

        this.structureArray1 = [

            // 1
            [ 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
            // 2
            [ 1 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
            // 3
            [ 1 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
            // 4
            [ 1 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
            // 5
            [ 1 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
            // 6 
            [ 1 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
            // 7
            [ 1 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ]

        ]

        this.structureArray = randomArrayValue(
            [
                this.structureArray1
            ]
        )

        console.log('---- STRUCTURE ARRAY: ' , this.structureArray );

    }

    randomRangeStructure( minimumVoices , maximumVoices ){

        this.structureArray = [];
        let nVoices = 0;

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            nVoices = randomInt( minimumVoices , maximumVoices );

            for( let j = 0 ; j < nVoices ; j++ ){

                this.structureArray[i].push( 1 );

            }

            for( let j = 0 ; j < this.rCArray.length - nVoices ; j++ ){

                this.structureArray[i].push( 0 );

            }

            shuffle( this.structureArray[i] );
            
        }

        console.log( this.structureArray );

    }

    specArrangementStructure( arrangementArray ){

        this.structureArray = [];

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            for( let j = 0 ; j < arrangementArray[ i ] ; j++ ){

                this.structureArray[i].push( 1 );

            }

            for( let j = 0 ; j < this.rCArray.length - arrangementArray[ i ] ; j++ ){

                this.structureArray[i].push( 0 );

            }

            shuffle( this.structureArray[i] );
            
        }

        console.log( this.structureArray );

    }

    schedule(){

        this.fadeFilter.start(1, 50);
		this.globalNow = audioCtx.currentTime;

        this.globalNoise.start();

        let r = 0;

        for( let i = 0 ; i < this.rCArray.length ; i++ ){
            this.rCArray[i].rampStart();
        }

        for( let i = 0 ; i < this.structureArray.length ; i++ ){

            for( let j = 0 ; j < this.structureArray[i].length ; j++ ){

                    if( this.structureArray[i][j] === 1 ){

                        this.rCArray[j].start( this.globalNow + ( this.bar * i ) , this.globalNow + ( this.bar * ( i + 1 ) ) );

                    }

            }

        }

    }

    stop() {

        this.fadeFilter.start(0, 20);
        startButton.innerHTML = "reset";

    }

}

class RampingConvolver{

    constructor( piece ){

        this.output = new MyGain( 0 );

        this.output.connect( piece.masterGain );
        this.output.connect( piece.cSend );
        this.output.connect( piece.dSend );

        this.isStarted = false;

    }

    load( rate , rampArray , bufferLength , fund , frequencyRange , gainVal ){

        this.rate = rate;

        this.output.gain.gain.value = gainVal;

        this.c = new MyConvolver();
        this.cB = new MyBuffer2(  1 , bufferLength , audioCtx.sampleRate );
        this.cAB = new MyBuffer2( 1 , bufferLength , audioCtx.sampleRate );

        const iArray = [ 1 , M2 , M3 , P4 , P5 , M6 , 2 ];
        const oArray = [ 1 , 4 , 2 ];

        let interval = 0;
        let o = 0;
        let p = 0;

        for( let i = 0 ; i < 20 ; i++ ){

            interval = randomArrayValue( iArray );
            o = randomArrayValue( oArray );
            p = randomFloat( 0.1 , 0.9 );

            this.cAB.fm( randomFloat( 0.99 , 1.01 ) * fund * interval * o , randomFloat( 0.99 , 1.01 ) * fund * interval * o , 0.5 ).add( 0 );
            this.cAB.constant( 1 / o ).multiply( 0 );
            this.cAB.ramp( p , p + 0.1 , 0.5 , 0.5 , 0.1 , 0.1 ).multiply( 0 );

            this.cB.addBuffer( this.cAB.buffer );

        }

        this.cB.normalize( -1 , 1 );

        this.c.setBuffer( this.cB.buffer );

        // NOISE FILTER

        this.noiseFilter = new MyBiquad( 'bandpass' , 0 , 1 );

        // AM

        this.aG = new MyGain( 0 );
        this.aB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.aB.ramp( ...rampArray ).fill( 0 );
        this.aB.loop = true;
        this.aB.playbackRate = rate;

        this.aF = new MyBiquad( 'lowpass' , 500 , 1 );

        // FADE GAINS

        this.convolverGain = new MyGain( 0 );
        this.noiseGain = new MyGain( 0.05 );

        // PAN

        this.p = new MyPanner2( 0 );

        // WAVESHAPER

        this.s = new MyWaveShaper();
        this.s.makeSigmoid( 3 );

        // SEQUENCE GAIN

        this.sG = new MyGain ( 0 );

        // CONNECTIONS

        piece.globalNoise.connect( this.noiseFilter );
        this.aB.connect( this.aF );
        this.noiseFilter.connect( this.aG );    this.aF.connect( this.aG.gain.gain );

        this.aG.connect( this.noiseGain );
        this.noiseGain.connect( this.p );

        this.aG.connect( this.convolverGain );
        this.convolverGain.connect( this.c );

        this.c.connect( this.p );
        this.p.connect( this.sG );
        this.sG.connect( this.output );

        this.c.output.gain.value = 1;

        // FILTER SEQUENCE

        const sL = randomInt( 4 , 11 );

        this.fSeq = new Sequence();
        this.fSeq.randomInts( sL , frequencyRange[ 0 ] , frequencyRange[ 1 ] );

        this.fSeq = this.fSeq.sequence;

    }

    rampStart(){

        this.convolverGain.gain.gain.setTargetAtTime( 2 , piece.globalNow + 25 , 70 );
        this.noiseGain.gain.gain.setTargetAtTime( 0.025 , piece.globalNow , 100 );

    }

    start( startTime , stopTime ){

        /*
        if(!this.isStarted){
            this.convolverGain.gain.gain.setTargetAtTime( 2 , piece.globalNow + 20 , 60 );
            this.noiseGain.gain.gain.setTargetAtTime( 0.025 , piece.globalNow , 100 );
            this.isStarted = true;
        }
        */

        let t = 0;
        let i = 0;

        while( t < stopTime ){

            t = startTime + ( i / ( this.rate * randomFloat( 1 , 7 ) ) );

                this.p.setPositionAtTime( randomFloat( -1 , 1 ) , t );
                this.sG.gain.gain.setValueAtTime( randomFloat( 1 , 3 ) , t );
                this.noiseFilter.biquad.frequency.setValueAtTime( this.fSeq[ i % this.fSeq.length ] , t );

            i++;

        }

        t = 0;
        i = 0;

        while( t < stopTime ){

            t = startTime + ( i / ( this.rate * randomFloat( 1 , 7 ) ) );

                this.output.gain.gain.setValueAtTime( randomInt( 0 , 2 ) , t );

            i++;

        }

        this.aB.startAtTime( startTime );

        this.aB.stopAtTime( stopTime );

    }

}