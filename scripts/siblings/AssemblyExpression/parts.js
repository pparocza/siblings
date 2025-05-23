import { IS } from "../../../script.js";
import { Parameters } from "./parameters.js";

const m2 = 25/24;
const M2 = 9/8;
const m3 = 6/5;
const M3 = 5/4;
const P4 = 4/3;
const d5 = 45/32;
const P5 = 3/2;
const m6 = 8/5;
const M6 = 5/3;
const m7 = 9/5;
const M7 = 15/8;

function shuffle(array)
{
    var i = array.length;
    var j = 0;
    var temp;

    while (i--)
    {
        j = Math.floor(Math.random() * (i+1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

export class Piece
{
    constructor(){}

    initMainChannel()
    {
        this.globalNow = 0;

        this.gain = IS.createGain();
        this.gain.gain = 18;

        this.filter = IS.createFilter('highpass', 10, 1);
    
        this.mainGain = IS.createGain();
        this.mainGain.connect(this.filter);
        this.filter.connect(this.gain);
        this.gain.connectToMainOutput();

        // GLOBAL NOISE
        this.globalNoiseBuffer = IS.createBuffer(1, 1);
        this.globalNoiseBuffer.noise().add();

        this.globalNoise = IS.createBufferSource(this.globalNoiseBuffer);
        this.globalNoise.playbackRate = 0.4;
        this.globalNoise.loop = true;
        this.globalNoise.gain = 0.15;
    }

    initFXChannels()
    {
        // REVERB
        this.convolverSend = IS.createGain();

        this.convolverBuffer = IS.createBuffer(2, 2);
        this.convolverBuffer.noise().add();
        this.convolverBuffer.ramp
        (
            0, 1, 0.01, 0.015, 0.1, 4
        ).multiply();

        this.convolver = IS.createConvolver(this.convolverBuffer);

        this.convolverSend.connect(this.convolver);
        this.convolver.connect(this.mainGain);

        // DELAY
        this.delaySend = IS.createGain();

        this.delay = IS.createStereoDelay
        (
            IS.Random.Float(0.35, 0.6), IS.Random.Float(0.35, 0.6), IS.Random.Float(0, 0.2), 1
        );

        this.delay.gain = 0.25;
    }

    generateStructure()
    {
        this.quarterNote = 4 * ( 1 / this.rate );
        this.bar = 2 * this.quarterNote;
        this.nBars = 28 * ( this.rate / 2 );
        this.randomStructure(2);
    }

    load()
    {
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

            this.fund = Parameters.Fundamental;
            this.rate = Parameters.Rate; // 4 , IS.Random.Float( 3.9 , 4.5 );
            this.gainVal = 1;

            console.log(`fund: ${this.fund} , rate: ${this.rate}`);
    
            // startTime , rate , rampArray , bufferLength , fund , frequencyRange , gainVal

                this.rC1.load( this.rate * IS.Random.Float(0.0625, 1), [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , IS.Random.Select(2)                  , this.fund * 0.5 , [ 100 , 500 ]   , this.gainVal * 2 );
                this.rC2.load( this.rate * IS.Random.Float(0.0625, 1), [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , IS.Random.Select([ 1 ])                  , this.fund       , [ 100 , 500 ]   , this.gainVal * 2 );
                this.rC3.load( this.rate * IS.Random.Float(0.0625, 1), [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , IS.Random.Select(0.25, 0.5, 1, 2) , this.fund       , [ 4000 , 7000 ] , this.gainVal * 2 );
                this.rC4.load( this.rate * IS.Random.Float(0.0625, 1), [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , IS.Random.Select(0.25, 0.5, 1, 2) , this.fund       , [ 100 , 1000 ]  , this.gainVal * 3 );
                this.rC5.load( this.rate * IS.Random.Float(0.0625, 1), [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , IS.Random.Select(0.5, 1, 2)        , this.fund * 0.5 , [ 100 , 5000 ]  , this.gainVal * 2 );

                this.rC2A.load( this.rate * IS.Random.Float( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , 2 , this.fund       , [ 100 , 1000 ] , this.gainVal * 2.5 );
                this.rC3A.load( this.rate * IS.Random.Float( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , 2 , this.fund * 0.5 , [ 100 , 5000 ] , this.gainVal * 1.5 );
                this.rC4A.load( this.rate * IS.Random.Float( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , 2 , this.fund       , [ 100 , 1000 ] , this.gainVal * 1.5 );
                this.rC5A.load( this.rate * IS.Random.Float( 0.0625 , 1 ) , [ 0 , 1 , 0.5 , 0.5 , 1 , 1 ] , 2 , this.fund * 0.5 , [ 100 , 5000 ] , this.gainVal * 1.5 );

            this.rampingConvolverArray =
            [
                this.rC1 , this.rC2 , this.rC3 , this.rC4 , this.rC5 , this.rC2A , this.rC3A , this.rC4A , this.rC5A
            ];

            this.generateStructure();

    }

    randomStructure(minimumVoices)
    {
        this.structureArray = [];

        for( let i = 0 ; i < this.nBars ; i++ )
        {
            this.structureArray[ i ] = [];

            for(let j = 0 ; j < this.rampingConvolverArray.length - minimumVoices ; j++ )
            {
                this.structureArray[i].push(IS.Random.Int(0, 2));
            }

            for( let j = 0 ; j < minimumVoices ; j++ )
            {
                this.structureArray[i].push( 1 );
            }

            shuffle(this.structureArray[i]);
        }

        console.log(this.structureArray);
    }

    schedule()
    {
		this.globalNow = IS.now;

        this.globalNoise.scheduleStart(0);

        let r = 0;

        for(let i = 0 ; i < this.rampingConvolverArray.length ; i++ )
        {
            this.rampingConvolverArray[i].rampStart();
        }

        for( let i = 0 ; i < this.structureArray.length ; i++ )
        {
            for( let j = 0 ; j < this.structureArray[i].length ; j++ )
            {
                if( this.structureArray[i][j] === 1 )
                {
                    this.rampingConvolverArray[j].scheduleStart
                    (
                        this.globalNow + (this.bar * i), this.globalNow + (this.bar * (i + 1))
                    );
                }
            }
        }
    }

    stop()
    {
        this.fadeFilter.start(0, 20);
        startButton.innerHTML = "reset";
    }
}

class RampingConvolver
{
    constructor(piece)
    {
        this.piece = piece;

        // TODO: look here if things end up not making any noise
        this.output = IS.createGain(0);

        this.output.connect(piece.mainGain);
        this.output.connect(piece.convolverSend);
        this.output.connect(piece.delaySend);

        this.isStarted = false;
    }

    load(rate, rampArray, bufferLength, fund, frequencyRange, gainVal)
    {
        this.rate = rate;

        this.output.gain = gainVal;

        this.convolverBuffer = IS.createBuffer(1, bufferLength);

        const intervalArray = [1, M2, M3, P4, P5, M6, 2];
        const octaveArray = [1, 4, 2];

        let interval = 0;
        let octave = 0;
        let percent = 0;

        for(let i = 0; i < 20; i++)
        {
            interval = IS.Random.Select(...intervalArray);
            octave = IS.Random.Select(...octaveArray);
            percent = IS.Random.Float(0.1, 0.9);

            this.convolverBuffer.suspendOperations();

                this.convolverBuffer.frequencyModulatedSine
                (
                    IS.Random.Float( 0.99 , 1.01 ) * fund * interval * octave,
                    IS.Random.Float( 0.99 , 1.01 ) * fund * interval * octave,
                    0.5
                ).add();

                this.convolverBuffer.constant(1 / octave).multiply();

                this.convolverBuffer.ramp
                (
                    percent, percent + 0.1,
                    0.5, 0.5,
                    0.1, 0.1
                ).multiply();

            this.convolverBuffer.applySuspendedOperations().add();
        }

        this.convolverBuffer.normalize();

        this.convolver = IS.createConvolver(this.convolverBuffer);

        // NOISE FILTER

        this.noiseFilter = IS.createFilter('bandpass', 0, 1);

        // AM

        this.amplitudeModulationGain = IS.createGain(0);
        this.amplitudeModulationBuffer = IS.createBuffer(1, 1);
        this.amplitudeModulationBuffer.ramp(...rampArray).add();

        this.amplitudeModulationBufferSource = IS.createBufferSource(this.amplitudeModulationBuffer);
        this.amplitudeModulationBufferSource.loop = true;
        this.amplitudeModulationBufferSource.playbackRate = rate;

        this.amplitudeModulationFilter = IS.createFilter('lowpass', 500, 1);

        // FADE GAINS

        this.convolverGain = IS.createGain(0);
        this.noiseGain = IS.createGain(0.025);

        // PAN
        this.panner = IS.createStereoPanner(0);

        // SEQUENCE GAIN
        this.sequenceGain = IS.createGain(0);

        // CONNECTIONS
        this.piece.globalNoise.connect(this.noiseFilter);
        this.amplitudeModulationBufferSource.connect(this.amplitudeModulationFilter);
        this.noiseFilter.connect(this.amplitudeModulationGain);
        this.amplitudeModulationFilter.connect(this.amplitudeModulationGain.gain);

        this.amplitudeModulationGain.connect(this.noiseGain);
        this.noiseGain.connect(this.panner);

        this.amplitudeModulationGain.connect(this.convolverGain);
        this.convolverGain.connect(this.convolver);

        this.convolver.connect(this.panner);
        this.panner.connect(this.sequenceGain);
        this.sequenceGain.connect(this.output);

        this.convolver.gain = 1;

        // FILTER SEQUENCE

        const sequenceLength = IS.Random.Int(4, 11);
        this.frequencySequence = [];

        for(let frequencyIndex = 0; frequencyIndex < sequenceLength; frequencyIndex++)
        {
            this.frequencySequence.push(IS.Random.Int(frequencyRange[0], frequencyRange[1]));
        }
    }

    rampStart()
    {
        this.convolverGain.gain.scheduleValue(2, IS.now + 10, 35);
        this.noiseGain.gain.scheduleValue(0.00625, IS.now, 50);
    }

    scheduleStart(startTime, stopTime)
    {
        let time = 0;
        let i = 0;

        while(time < stopTime)
        {
            time = startTime + (i / (this.rate * IS.Random.Float(1, 7)));

                let frequency = this.frequencySequence[i % this.frequencySequence.length];
                let gainMax = 3

                if(frequency > 2000)
                {
                    gainMax = 1;
                }
                else if(frequency < 150)
                {
                    gainMax = 1.5;
                }

                this.panner.pan.scheduleValue(IS.Random.Float(-1, 1), time, IS.Random.Float(0.5, 2));
                this.sequenceGain.gain.scheduleValue(IS.Random.Float(1, gainMax), time, IS.Random.Float(0.025, 0.05));

                this.noiseFilter.frequency.scheduleValue(frequency, time, IS.Random.Float(0, 0.1));

            i++;
        }

        time = 0;
        i = 0;

        while(time < stopTime)
        {
            time = startTime + (i / (this.rate * IS.Random.Float(1, 7)));

                this.output.gain.scheduleValue(IS.Random.Int(0, 2), time, IS.Random.Float(0.0125, 0.05));

            i++;
        }

        this.amplitudeModulationBufferSource.scheduleStart(startTime);
        this.amplitudeModulationBufferSource.scheduleStop(stopTime);
    }

}