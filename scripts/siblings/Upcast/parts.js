class Piece {
    
    constructor(){

    }

    initMasterChannel(){

        this.globalNow = 0;

        this.gain = audioCtx.createGain();
        this.gain.gain.value = 12;

        this.fadeFilter = new FilterFade(0);

        this.masterGain = audioCtx.createGain();
        this.masterGain.connect( this.gain );
        this.gain.connect(this.fadeFilter.input);
        this.fadeFilter.connect(audioCtx.destination);

        this.globalNoise = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.globalNoise.noise().fill( 0 );
        this.globalNoise.playbackRate = 0.25;
        this.globalNoise.loop = true;
        this.globalNoise.output.gain.value = 0.1;

    }

    initFXChannels(){


        // REVERB

            this.c = new MyConvolver();
            this.cB = new MyBuffer2( 2 , 2 , audioCtx.sampleRate );
            this.cB.noise().add( 0 );
            this.cB.noise().add( 1 );

            this.c.setBuffer( this.cB.buffer );

            this.c.output.gain.value = 2;

            this.c2 = new MyConvolver();
            this.c2B = new MyBuffer2( 2 , 3 , audioCtx.sampleRate );
            this.c2B.noise().add( 0 );
            this.c2B.noise().add( 1 );
            this.c2B.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 0 );
            this.c2B.ramp( 0 , 1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 1 );

            this.c2.setBuffer( this.c2B.buffer );

            this.c2.output.gain.value = 2;

            this.cD = new Effect();
            this.cD.randomEcho();
            this.cD.on();
            this.cD.output.gain.value = 0.125;

        // DELAY

            this.d1 = new Effect();
            this.d1.randomEcho();
            this.d1.on();
            this.d1.output.gain.value = 0.25;

            this.d2 = new Effect();
            this.d2.randomEcho();
            this.d2.on();
            this.d2.output.gain.value = 0.25;

            this.d3 = new Effect();
            this.d3.randomEcho();
            this.d3.on();
            this.d3.output.gain.value = 1;

            this.d4 = new Effect();
            this.d4.stereoDelay( 0.25 , 0.5 , 0.2 , 1 );
            this.d4.on();
            this.d4.output.gain.value = 0.125;

        // DELAY MODULATION

            this.dB1L = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dB1L.unipolarNoise( 0 ).fill( 0 );
            this.dB1L.constant( randomFloat( 0.03 , 0.04 ) ).multiply( 0 );
            this.dB1L.playbackRate = randomFloat( 0.00002125 , 0.00003125 );
            this.dB1L.loop = true;
            this.dB1L.start();

            this.dB1R = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dB1R.unipolarNoise( 0 ).fill( 0 );
            this.dB1R.constant( randomFloat( 0.03 , 0.04 ) ).multiply( 0 );
            this.dB1R.playbackRate = randomFloat( 0.00002125 , 0.00003125 );
            this.dB1R.loop = true;
            this.dB1R.start();

            this.dB2L = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dB2L.unipolarNoise( 0 ).fill( 0 );
            this.dB2L.constant( randomFloat( 0.03 , 0.04 ) ).multiply( 0 );
            this.dB2L.playbackRate = randomFloat( 0.00002125 , 0.00003125 );
            this.dB2L.loop = true;
            this.dB2L.start();
                
            this.dB2R = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dB2R.unipolarNoise( 0 ).fill( 0 );
            this.dB2R.constant( randomFloat( 0.03 , 0.04 ) ).multiply( 0 );
            this.dB2R.playbackRate = randomFloat( 0.00002125 , 0.00003125 );
            this.dB2R.loop = true;
            this.dB2R.start();

            this.dB3L = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dB3L.unipolarNoise( 0 ).fill( 0 );
            this.dB3L.constant( randomFloat( 0.03 , 0.04 ) ).multiply( 0 );
            this.dB3L.playbackRate = randomFloat( 0.00000125 , 0.00003125 );
            this.dB3L.loop = true;
            this.dB3L.start();

            this.dB3R = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.dB3R.unipolarNoise( 0 ).fill( 0 );
            this.dB3R.constant( randomFloat( 0.03 , 0.04 ) ).multiply( 0 );
            this.dB3R.playbackRate = randomFloat( 0.00002125 , 0.00003125 );
            this.dB3R.loop = true;
            this.dB3R.start();

            this.dB1L.connect( this.d1.dly.delayL.delayTime );
            this.dB1R.connect( this.d1.dly.delayR.delayTime );

            this.dB3L.connect( this.d3.dly.delayL.delayTime );
            this.dB3R.connect( this.d3.dly.delayR.delayTime );

            this.dB2L.connect( this.d2.dly.delayL.delayTime );
            this.dB2R.connect( this.d2.dly.delayR.delayTime );

        // TEST

            this.s = new SemiOpenPipe( randomInt( 700 , 2000 ) );
            this.s.output.gain.value = 0.25;

            this.s2 = new SemiOpenPipe( randomInt( 700 , 2000 ) );
            this.s2.output.gain.value = 0.25;

            this.s3 = new SemiOpenPipe( randomInt( 700 , 2000 ) );
            this.s3.output.gain.value = 0.25;

        // CONNECTIONS

            this.d1.connect( this.masterGain );
            this.d2.connect( this.masterGain );
            this.d3.connect( this.masterGain );
            this.d4.connect( this.masterGain );
            
            // this.c.connect( this.cD );

            // this.c.connect( this.masterGain );
            // this.cD.connect( this.masterGain );

            this.c2.connect( this.c );
            this.c.connect( this.masterGain );

            this.c2.connect( this.masterGain );

    }

    load() {

        this.loadRampingConvolver();

    }

    start(){

        this.fadeFilter.start(1, 50);
		this.globalNow = audioCtx.currentTime;

        this.globalNoise.start();

        this.structure3Short();

    }

    structure3Short(){

        this.rate =  0.15048545040547232;

        // RAMPING CONVOLVER

            this.rC3A.startInverse( this.globalNow + 0 , this.globalNow + 80 );

            this.rC3.startInverse( this.globalNow + 5  , this.globalNow + 7  );
            this.rC3.startInverse( this.globalNow + 12 , this.globalNow + 14 );
            this.rC3.startInverse( this.globalNow + 18 , this.globalNow + 21 );
            this.rC3.startInverse( this.globalNow + 26 , this.globalNow + 30 );

            this.rC3B.startInverse( this.globalNow + 30 , this.globalNow + 80 );

            this.rC3.startInverse( this.globalNow + 35 , this.globalNow + 39 );
            this.rC3.startInverse( this.globalNow + 44 , this.globalNow + 47 );
            this.rC3.startInverse( this.globalNow + 52 , this.globalNow + 55 );
            this.rC3.startInverse( this.globalNow + 60 , this.globalNow + 65 );

    }

    stop() {

        this.fadeFilter.start(0, 20);
        startButton.innerHTML = "reset";

    }

    loadRampingConvolver(){
        
        const fund = 1 * randomFloat( 225 , 325 ); // 300
        this.fund = fund;
        const iArray1 = [ 1 , M2 , P4 , P5 , M6 ];
        const iArray2 = [ 1 , M3 , P5 , 1/M2 , M6 ];
        const iArray3 = [ 1 , M6 , P5 , M3 ];
        const oArray2 = [ 0.5 , 1 , 0.25 , 2 ];
        const oArray = [ 1 , 0.5 , 2 , 0.25 ];
        const bufferLength = 2;
        const gainVal = 0.5;

        const iArray = iArray3;

        this.rC3 = new RampingConvolver( this );
        this.rC3A = new RampingConvolver( this );
        this.rC3B = new RampingConvolver( this );

        // centerFrequency , bandwidth , Q , oscillationRate , bufferLength , fund , iArray , oArray , divArray , cNorm , gainVal
        this.rC3.loadStandard( 3300 , 2000 , 10 , 0.25 , bufferLength , fund , iArray1 , oArray , [ 0.125 , 0.25 , 0.5 , 0.165 , 0.33 , 0.66 , 1 ] , 1 , gainVal * 0.25 );
        this.rC3B.loadStandard( 800 , 200 , 10 , 0.25 , bufferLength , fund , iArray1 , oArray , [ 4 , 5 , 6 , 7 ] , 1 , gainVal * 0.25 );

        this.rC3A.loadStandard( 800 , 200 , 10 , 1 , bufferLength , fund , iArray1 , oArray , [ 2 , 3 , 4 , 5 , 6 , 7 ] , 1 , gainVal * 0.25 );

    }

}

class RampingConvolver extends Piece{

    constructor( piece ){

        super();

        this.output = new MyGain( 0.125 );
        this.cG = new MyGain( 1.5 );

        this.nFG = new MyGain( 0.04 );
        this.nFCG = new MyGain( 0.5 );
        this.cOG = new MyGain( 0.2 );
        this.pOG = new MyGain( 0.3 );
        this.pOCG = new MyGain( 0.125 );

        // CONNECT TO MASTER GAIN

            this.cOG.connect( piece.masterGain );
            this.nFG.connect( piece.masterGain );
            this.pOG.connect( piece.masterGain );

        // CONNECT TO REVERB

            this.cOG.connect( this.cG );

            this.nFG.connect( this.nFCG );
            this.nFCG.connect( this.cG );

            this.pOG.connect( this.pOCG );
            this.pOCG.connect( this.cG );

            this.cG.connect( piece.c2 );

        // CONNECT TO DELAY

            this.pOG.connect( piece.d1 );

    }

    loadStandard( centerFrequency , bandwidth , Q , oscillationRate , bufferLength , fund , iArray , oArray , divArray , cNorm, gainVal ){
        
        this.output.gain.gain.value = gainVal;

        this.divArray = divArray;
        this.oscillationRate = oscillationRate;
        this.fund = fund;
        this.iArray = iArray;
        this.oArray = oArray;

        // CONVOLVERS

            this.c1 = new AMConvolver( bufferLength , fund , iArray , oArray , cNorm );
            this.c2 = new AMConvolver( bufferLength , fund , iArray , oArray , cNorm );
            this.c3 = new AMConvolver( bufferLength , fund , iArray , oArray , cNorm );

        // IMPULSE

            this.nF = new MyBiquad( 'bandpass' , centerFrequency , Q );

            this.nDivs = randomInt( 5 , 5 );
            this.tBDivs = randomInt( 10 , 20 );

            this.nO = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
            this.nO.playbackRate = ( this.nO.buffer.duration * this.oscillationRate ) / this.nDivs ;
            this.nOF = new MyBiquad( 'lowpass' , 2 , 1 );

            this.p = randomFloat( 0 , 1 );

            this.sB = new MyBuffer2( 1 , this.nO.buffer.duration / this.nDivs , audioCtx.sampleRate );
            this.tB = new MyBuffer2( 1 , this.sB.buffer.duration / this.tBDivs , audioCtx.sampleRate );
            this.iB = new MyBuffer2( 1 , this.nO.buffer.duration , audioCtx.sampleRate );
            this.iTB = new MyBuffer2( 1 , this.nO.buffer.duration , audioCtx.sampleRate );
            this.iND = randomInt( 10 , 10 );

            let o2 = 0;
            let i2 = 0;

            for( let i = 0 ; i < this.iND ; i++ ){

                o2 = randomArrayValue( oArray );
                i2 = randomArrayValue( iArray );

                this.iTB.ramp( i / this.iND , ( i + 1 ) / this.iND , 0.01 , 0.015 , 0.1 , 4 ).fill( 0 );
                this.iTB.constant( randomFloat( 0.25 , 0.7 ) ).multiply( 0 );

                this.iB.bufferShape( this.iTB.buffer ).add( 0 );

            }

            this.iB.playbackRate = 1;

            let r = 0;
            let rP = 0;
            let rA = 0;
            let rOD = 0;
            let rO = 0;

            for( let i = 0 ; i < this.nDivs ; i++ ){
                
                r = randomInt( 0 , 4 );

                this.sB.constant( 0 ).fill( 0 );

                if( r === 0 ){
                    this.sB.sine( randomInt( 5 , 5 ) , 1 ).fill( 0 );
                }

                if( r === 1 ){
                    this.sB.fm( randomFloat( 0.5 , 5 ) , randomFloat( 0.5 , 5 ) , randomFloat( 0.25 , 2 ) ).fill( 0 );
                }

                if( r === 2 ){
                    this.sB.am( randomFloat( 0.5 , 5 ) , randomFloat( 0.5 , 5 ) , 1 ).fill( 0 );
                }

                if( r === 3 ){
                    rP = randomFloat( 0 , 1 );
                    this.sB.ramp( 0 , 1 , rP , rP , randomFloat( 1 , 2 ) , randomFloat( 1 , 2 ) ).fill( 0 );
                    this.sB.constant( randomArrayValue( [ -1 , 1 ] ) ).multiply( 0 );
                }

                if( r === 4){
                    for( let j = 0 ; j < this.tBDivs ; j++ ){
                        this.tB.constant( randomFloat( -1 , 1 ) ).fill( 0 );
                        this.sB.bufferShape2( this.tB.buffer ).insert2( 0 , j / this.tBDivs , ( j + 1 ) / this.tBDivs );
                    }
                }

                this.nO.bufferShape2( this.sB.buffer ).insert2( 0 , ( i / this.nDivs ) , ( ( i + 1 ) / this.nDivs ) );

            }

            this.nO.normalize( -1 , 1 );


        // PIPE

            this.p = new SemiOpenPipe( fund );
            this.p2 = new SemiOpenPipe( fund );
            this.p3 = new SemiOpenPipe( fund );

            this.p2.output.gain.value = 1.25;

        // IMPULSE SHAPER

            this.w = new Effect();
            this.w.fmShaper( fund * 0.125 , fund * 0.25 , 0.1 , 1 );
            this.w.on();

        // CONNECTIONS

            this.nOG = new MyGain( bandwidth );

            this.nO.connect( this.nOG );
            this.nOG.connect( this.nF.biquad.frequency );

            this.iB.connect( this.w ); 
            this.w.connect( this.nF );
            this.nF.connect( this.nFG );

            // convolvers

            this.nFCG2 = new MyGain( 1 );
            this.nF.connect( this.nFCG2 );

            this.nFCG2.connect( this.c1.input );
            this.c1.connect( this.cOG );

            this.nFCG2.connect( this.c2.input );
            this.c2.connect( this.cOG );

            this.nFCG2.connect( this.c3.input );
            this.c3.connect( this.cOG );

            this.nFCG2.connect( this.p );
            this.p.connect( this.pOG );

            this.nFCG2.connect( this.p2 );
            this.p2.connect( this.pOG );

            this.nFCG2.connect( this.p3 );
            this.p3.connect( this.pOG );
    }

    startInverse( startTime , stopTime ){

        let t = startTime;
        let startPoint = 0;
        let duration = 1 / this.oscillationRate;
        let divPosition = 0;
        let tBStartPoint = 0;
        let t2 = startTime;
        let t3 = 0;
        let divPosition3 = 0;
        let startPoint3 = 0;

        this.c1.start( startTime , stopTime );
        this.c2.start( startTime , stopTime );
        this.c2.start( startTime , stopTime );

        while( t < stopTime ){

            divPosition = ( randomInt( 0 , this.nDivs ) / this.nDivs );

            startPoint = this.nO.buffer.duration * divPosition;

            this.nO.startAtTime( t , startPoint ,  duration );

            t += duration;

        }

        this.pipeSequenceInverse( startTime , stopTime , this.divArray );

    }

    pipeSequenceInverse( startTime , stopTime , divArray ){

        let length = 0; 
        let t = 0 + startTime ;
        let d = 0;
        let f = 0;

        while( t < stopTime ){

            length = this.fund * randomArrayValue( this.iArray ) * randomArrayValue( this.oArray );
            d = randomArrayValue( divArray );

            for( let i = 0 ; i < 4 ; i++ ){

                f = length * this.p.lengthMultiplierArray[ i ];
                this.p.filters[ i ].filter.frequency.setTargetAtTime( f , t , 0.01 );
                this.p2.filters[ i ].filter.frequency.setTargetAtTime( f * 0.5 , t , 0.01 );
                this.p3.filters[ i ].filter.frequency.setTargetAtTime( f * 2 , t , 0.01 );
    
            }

            this.iB.playbackRate = 1 / d;
            this.iB.startAtTime( t );
            this.iB.stopAtTime( stopTime );
            this.iB.bufferSource.playbackRate.setValueAtTime( 1 / d , t );

            t += d;

        }

    }

}

class AMConvolver extends Piece{

    constructor( bufferLength , fund , iArray , oArray , cNorm ){

        super();

        this.input = new MyGain( 1 );
        this.output = new MyGain( 1 );

        this.hp = new MyBiquad( 'highpass' , 20 , 1 );
        this.ls = new MyBiquad( 'lowshelf' , 300 , 1 );
        this.ls.biquad.gain.value = -3;
        this.hp2 = new MyBiquad( 'highpass' , 200 , 1 );

        // TAP BUFFER

            // tapDivs, tapBufferPlaybackRate
            this.createTapBuffer( randomInt( 30 , 60 ) , randomFloat( 0.25 , 1 ) );
            this.tapGain = new MyGain( 0 );

        const c = new MyConvolver();
        const cB = new MyBuffer2(  1 , bufferLength , audioCtx.sampleRate );
        const cAB = new MyBuffer2( 1 , bufferLength , audioCtx.sampleRate );

        let interval = 0;
        let o = 0;
        let o2 = 0;
        let p = 0;
        let cN = randomInt( 10 , 16 );
        let r = 0;

        for( let i = 0 ; i < cN ; i++ ){

            interval = randomArrayValue( iArray );
            o = randomArrayValue( [ 1 , 2 , 4 , 8 , 16 ] /*[ 0.5 , 1 , 2 , 4 ]*/ );
            p = randomFloat( 0.1 , 0.9 );
            r = randomInt( 0 , 2 );

            cAB.fm( fund * interval * o , fund * interval * o , randomFloat( 0.1 , 2 ) ).add( 0 );
            cAB.constant( randomFloat( 0.5 , 1 ) ).multiply( 0 );

            if( o == 16 || o == 8 ){

                cAB.constant( 0.5 ).multiply( 0 );
                
            }

            if( r == 0 ) {

                cAB.ramp( p , p + 0.1 , 0.01 , 0.015 , 0.1 , 4 ).multiply( 0 )

            }
            else if( r == 1 ) {

                cAB.ramp( p , p + 0.1 , 0.5 , 0.5 , 1 , 1 ).multiply( 0 );

            }

            cB.addBuffer( cAB.buffer );

        }

        cB.normalize( -cNorm , cNorm );
        c.setBuffer( cB.buffer );

        this.input.connect( this.hp );
        this.hp.connect( this.tapGain ); this.tapBuffer.connect( this.tapGain.gain.gain );
        this.tapGain.connect( this.ls );
        this.ls.connect( c );
        c.connect( this.hp2 );
        this.hp2.connect( this.output );
    }

    createTapBuffer( tapDivs , playbackRate ){

        this.tapDivs = tapDivs;
        this.tapBufferPlaybackRate = playbackRate;

        this.tapBuffer = new MyBuffer2( 1 , 1 , audioCtx.sampleRate );
        this.tapAddBuffer = new MyBuffer2( 1 , 1 / this.tapDivs , audioCtx.sampleRate );

        this.tapBuffer.playbackRate = this.tapBufferPlaybackRate;
        this.tapBuffer.loop = true;

        this.p2 = 0;
        let toggle = 0;

        for( let i = 0 ; i < this.tapDivs ; i++ ){

            this.p2 = randomFloat( 0.25 , 1 );

            if( toggle == 0 ){

                toggle = randomInt( 0 , 2 );
                this.tapAddBuffer.ramp( 0 , this.p2 , 0.5 , 0.5 , 0.1 , 0.1  ).fill( 0 );
                this.tapAddBuffer.constant( randomFloat( 0.25 , 1 ) ).multiply( 0 );
                this.tapAddBuffer.constant( toggle ).multiply( 0 );
                toggle = 1;

            }
            else{ 

                this.tapAddBuffer.constant( 0 ).multiply( 0 );
                toggle = 0 
            }

            this.tapBuffer.bufferShape2( this.tapAddBuffer.buffer ).insert2( 0 , ( i / this.tapDivs ) , ( i + 1 ) / ( this.tapDivs ) );

        }
    }

    start( startTime , stopTime ){
        
        this.tapBuffer.startAtTime( startTime );
        this.tapBuffer.stopAtTime( stopTime );

    }

    connect(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	}

}