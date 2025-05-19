import { IS } from "../../../script.js";

export class Piece
{
    
    constructor(){}

    initMasterChannel()
    {

        this.globalNow = 0;

        this.gain = audioCtx.createGain();
        this.gain.gain.value = 1;
    
        this.fadeFilter = new FilterFade(0);

        this.f = new MyBiquad( 'peaking' , 568.45 , 0.9 );
        this.f.biquad.gain.value = -2.10;

        this.hp = new MyBiquad( 'highpass' , 10 , 1 );

        this.hs = new MyBiquad( 'highshelf' , 1700 , 1 );
        this.hs.biquad.gain.value = 3;
    
        this.masterGain = audioCtx.createGain();
        this.masterGain.connect(this.f.input);
        this.f.connect( this.hp );
        this.hp.connect( this.hs );
        this.hs.connect( this.gain );
        this.gain.connect(this.fadeFilter.input);
        this.fadeFilter.connect(audioCtx.destination);

    }

    initFXChannels(){

        // REVERB

            this.cSend = new MyGain( 0 );

            this.c = new MyConvolver();
            this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
            this.cB.noise().fill( 0 );
            this.cB.noise().fill( 1 );
            this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 0 );
            this.cB.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 1 );

            this.c.setBuffer( this.cB.buffer );

            this.cSend.connect( this.c );
            this.c.connect( this.masterGain );

    }

    load(){

            this.rC5 = new RampingConvolver( this );
            this.rC4 = new RampingConvolver( this );
            this.rC3 = new RampingConvolver( this );
            this.rC3A = new RampingConvolver( this );
            this.rC2 = new RampingConvolver( this );

            this.BrC5 = new RampingConvolver( this );
            this.BrC4 = new RampingConvolver( this );
            this.BrC3 = new RampingConvolver( this );
            this.BrC3A = new RampingConvolver( this );
            this.BrC2 = new RampingConvolver( this );


            this.rC1A = new RampingConvolver( this );

            // RAMPING CONVOLVER

            this.fund = 0.5 * randomFloat( 350 , 450 );
            this.rate = 0.125; // randomFloat( 0.75 , 1.5 ); // 4 , randomFloat( 3.9 , 4.5 );
            this.gainVal = 3;

            console.log( `fund: ${this.fund} , rate: ${this.rate}` );
    
            // startTime , rate , rampArray , bufferLength , fund , frequencyRange , gainVal

                this.rC5.load( this.rate * randomFloat( 0.8 , 1.2 ) , 2 , this.fund * 0.5 , [ 500 , 4000 ] , this.gainVal * 3 );
                this.rC4.load( this.rate * randomFloat( 0.8 , 1.2 ) , 2 , this.fund * 0.5 , [ 500 , 4000 ] , this.gainVal * 3 );
                
                this.rC3.load( this.rate * randomFloat( 0.8 , 1.2 )  , 2 , this.fund * 1 , [ 200 , 800 ] , this.gainVal * 0.75 );
                this.rC3A.load( this.rate * randomFloat( 0.8 , 1.2 ) , 2 , this.fund * 1 , [ 200 , 800 ] , this.gainVal * 0.75 );
                
                // this.rC2.load( this.rate * randomFloat( 0.125 , 0.25 ) , 2 , this.fund * 2 , [ 500 , 4000 ] , this.gainVal * 1 );
                this.rC2.load( randomFloat( 2 , 4 ) * this.rate * randomFloat( 0.8 , 1.2 ) , 2 , this.fund * 2 , [ 1000 , 5000 ] , this.gainVal * 0.5 );

                //

                this.BrC5.load( this.rate * randomFloat( 0.125 , 0.25 ) , 2 , this.fund * 0.5 , [ 500 , 1000 ] , this.gainVal * 3 );
                this.BrC4.load( this.rate * randomFloat( 0.125 , 0.25 ) , 2 , this.fund * 0.5 , [ 500 , 1000 ] , this.gainVal * 3 );
                
                this.BrC3.load( this.rate * randomFloat( 0.8 , 1.2 )  , 2 , this.fund * 1 , [ 200 , 800 ] , this.gainVal * 1 );
                this.BrC3A.load( this.rate * randomFloat( 0.8 , 1.2 ) , 2 , this.fund * 1 , [ 200 , 800 ] , this.gainVal * 1 );
                
                // this.BrC2.load( this.rate * randomFloat( 0.125 , 0.25 ) , 2 , this.fund * 2 , [ 500 , 4000 ] , this.gainVal * 1 );
                this.BrC2.load( randomFloat( 2 , 4 ) * this.rate * randomFloat( 0.8 , 1.2 ) , 2 , this.fund * 2 , [ 1000 , 5000 ] , this.gainVal * 0.25 );


            this.rCArray = [ 

                this.rC5 , this.rC4 , this.rC3 , this.rC3A , this.rC2 ,
                this.BrC5 , this.BrC4 , this.BrC3 , this.BrC3A , this.BrC2

            ];

            this.generateStructure();

    }

    generateStructure(){

        this.qN = 4 * ( 1 / 4 );
        this.bar = 16;
        this.nBars = 2;
        this.structureIdx = 0;

        this.explicitStructure();

        // this.randomStructure( 5 );

        // this.specArrangementStructure( [ 3 , 4 , 5 , 5 , 2 , 3 , 4 , 5 ] );

    }

    explicitStructure(){

        this.structureArray1 = [

            [ 0 , 0 , 0 , 0 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 0 , 0 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 1 , 0 ],

            [ 0 , 1 , 0 , 1 , 1 , /**/ 0 , 0 , 1 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 0 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 1 , 1 , 1 , 1 ],

        ]

        this.structureArray2 = [

            [ 0 , 0 , 0 , 0 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 0 , 0 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 1 , 0 ],

            [ 1 , 0 , 0 , 1 , 1 , /**/ 0 , 0 , 1 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 0 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 1 , 1 , 1 , 1 ],

        ]

        this.structureArray3 = [

            [ 0 , 0 , 0 , 0 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 0 , 0 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 1 , 0 ],

            [ 0 , 1 , 0 , 1 , 1 , /**/ 0 , 0 , 1 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 0 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 1 , 1 , 1 , 1 ],
            [ 0 , 0 , 0 , 0 , 1 , /**/ 1 , 1 , 0 , 0 , 1 ],

        ]

        this.structureArray4 = [

            [ 1 , 1 , 1 , 0 , 0 , /**/ 0 , 0 , 0 , 0 , 0 ],
            [ 1 , 0 , 1 , 1 , 0 , /**/ 0 , 1 , 0 , 0 , 0 ],
            [ 1 , 0 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 0 , 0 , 0 , 0 ],
 
            [ 0 , 0 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 1 , 0 ],
            [ 0 , 0 , 1 , 1 , 0 , /**/ 1 , 1 , 1 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 1 , 1 , 1 ],
            [ 0 , 0 , 0 , 0 , 0 , /**/ 1 , 1 , 1 , 1 , 1 ],

        ]

        this.structureArray = randomArrayValue(
            [
                this.structureArray1 , this.structureArray2 , this.structureArray3
            ]
        )

        console.log('---- STRUCTURE ARRAY: ' , this.structureArray );

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

    moduloStructure( modulus ){

        this.structureArray = [];

        let k = 0;

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            for( let j = 0 ; j < this.rCArray.length ; j++ ){

                if( k % modulus === 0 ){
                    this.structureArray[i].push( 1 );
                }
                else{ 
                    this.structureArray[i].push( 0 );
                };

                k++;

            }
            
        }

        console.log( this.structureArray );

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

        for( let i = 0 ; i < arrangementArray.length ; i++ ){

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

    twoGroups( groupSize ){

        this.structureArray = [];
        let k = 0;

        for( let i = 0 ; i < this.nBars ; i++ ){

            this.structureArray[ i ] = [];

            for( let j = 0 ; j < groupSize ; j++ ){

                this.structureArray[i].push( k % 2 === 1 ? randomInt( 0 , 2 ) : 0 );

            }

            for( let j = 0 ; j < this.rCArray.length - groupSize ; j++ ){

                this.structureArray[i].push( k % 2 === 0 ? randomInt( 0 , 2) : 0 );

            }

            k++;
            
        }

        shuffle( this.rCArray );

        console.log( this.structureArray );

    }

    schedule(){

        this.fadeFilter.start(1, 50);
		this.globalNow = audioCtx.currentTime;

        let r = 0;

        for( let i = 0 ; i < this.structureArray.length ; i++ ){

            for( let j = 0 ; j < this.structureArray[i].length ; j++ ){

                    if( this.structureArray[i][j] === 1 ){

                        this.rCArray[j].start( ( this.globalNow + ( this.bar * i ) ) , ( this.globalNow + ( this.bar * ( i + 1 ) ) ) );

                    }

            }

        }

        this.cSend.gain.gain.setTargetAtTime( 1 , 0 ,  this.globalNow + ( 16 ) );

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

    }

    load( rate , bufferLength , fund , frequencyRange , gainVal ){

        this.output.gain.gain.value = gainVal;

        this.rate = rate;

        this.c = new MyConvolver();
        this.cB = new MyBuffer2(  1 , bufferLength , audioCtx.sampleRate );
        this.cAB = new MyBuffer2( 1 , bufferLength , audioCtx.sampleRate );

        const iArray = [ 1 , M2 , M3 , P4 , P5 , M6 , 2 ];
        const oArray = [ 1 , 4 , 2 ];

        let interval = 0;
        let o = 0;
        let p = 0;

        for( let i = 0 ; i < 10 ; i++ ){

            interval = randomArrayValue( iArray );
            o = randomArrayValue( oArray );
            p = randomFloat( 0.1 , 0.9 );

            this.cAB.fm( fund * interval * o , fund * interval * o , randomFloat( 0.5 , 2 ) ).add( 0 );
            this.cAB.constant( 1 / o ).multiply( 0 );
            this.cAB.ramp( p , p + 0.1 , 0.5 , 0.5 , 0.1 , 0.1 ).multiply( 0 );

            this.cB.addBuffer( this.cAB.buffer );

        }

        this.cB.normalize( -1 , 1 );

        this.c.setBuffer( this.cB.buffer );

        // NOISE

        this.noise = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.noise.noise().fill( 0 );
        this.noise.playbackRate = 0.55;
        this.noise.loop = true;
        this.noise.output.gain.value = 0.2;

        // NOISE FILTER

        this.noiseFilter = new MyBiquad( 'bandpass' , 0 , randomFloat( 2 , 4 ) );

        // AM

        this.aG = new MyGain( 0 );
        this.aB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.aB.loop = true;
        this.aB.playbackRate = rate;

        this.aBA = [];

        this.tB = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.aF = new MyBiquad( 'lowpass' , 500 , 1 );

        const nAB = 1;
        let modDiv = 0;
        let r = 0;

        for( let j = 0 ; j < nAB ; j++ ){

            modDiv = randomInt( 30 , 50 );

            this.aBA[j] = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.aBA[j].loop = true;
            this.aBA[j].playbackRate = rate;

            for( let i = 0 ; i < modDiv ; i++ ){

                // RANDOM LEVEL
                this.tB.noise().fill( 0 );
                // originally constant( 0.25 );
                this.tB.constant( randomFloat( 0.125 , 0.35 ) ).multiply( 0 );
    
                this.tB.fm( randomFloat( 1 , 10 ) , randomFloat( 1 , 10 ) , randomFloat( 0.1 , 1 ) ).add( 0 );
                this.tB.sine( randomFloat( 15 , 30 ) , randomFloat( 0.5 , 1 ) ).add( 0 );
                this.tB.constant( 0.5 ).multiply( 0 );
                this.tB.ramp( i / modDiv , ( i + 1 ) / modDiv , 0.5 , 0.5 , 0.1 , 0.1 ).multiply( 0 );
                this.tB.constant( randomFloat( 0.5 , 1 ) ).multiply( 0 );
                this.tB.constant( randomArrayValue( [ 0 , 0 , 2 ] ) ).multiply( 0 );
    
                this.aBA[j].addBuffer( this.tB.buffer );
    
            }

            this.aBA[j].normalize( -1 , 1 );
            this.aBA[j].connect( this.aF );

        }

        // PAN

        this.p = new MyPanner2( 0 );

        this.noise.connect( this.noiseFilter );
        this.noiseFilter.connect( this.c );

        this.c.connect( this.aG ); this.aF.connect( this.aG.gain.gain );

        // SEQUENCE GAIN

        this.sG = new MyGain ( 0 );

        this.aG.connect( this.p );
        this.p.connect( this.sG );
        this.sG.connect( this.output );

        this.c.output.gain.value = 1;

        // FILTER SEQUENCE

        const sL = randomInt( 10 , 20 );

        this.fSeq = new Sequence();
        this.fSeq.randomInts( sL , frequencyRange[ 0 ] , frequencyRange[ 1 ] );

        this.fSeq = this.fSeq.sequence;


    }

    start( startTime , stopTime ){

        let t = 0;
        let i = 0;

        while( t < stopTime ){

            t = startTime + ( i / ( this.rate * randomFloat( 1 , 7 ) ) );

                this.p.setPositionAtTime( randomFloat( -1 , 1 ) , t );
                this.sG.gain.gain.setValueAtTime( randomFloat( 1 , 3 ) , t );
                this.noiseFilter.biquad.frequency.setValueAtTime( this.fSeq[ i % this.fSeq.length ] , t );

            i++;

        }

        let currentBuffer = randomInt( 0 , this.aBA.length );

        this.noise.startAtTime( startTime );
        this.aBA[ currentBuffer ].startAtTime( startTime );

        this.noise.stopAtTime( stopTime );
        this.aBA[ currentBuffer ].stopAtTime( stopTime );

    }

}