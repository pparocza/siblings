import { IS } from "../../../script.js";
import { Parameters } from "./parameters.js";

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
    constructor(){}

    initMainChannel()
    {
        this.gain = IS.createGain();
        this.gain.gain = 2;

        this.peakingFilter = IS.createFilter('peaking', 568.45, 0.9);
        this.peakingFilter.gain = -2.10;

        this.highpass = IS.createFilter('highpass', 10, 1);

        this.highshelf = IS.createFilter('highshelf', 1700, 1);
        this.highshelf.gain = 3;
    
        this.mainGain = IS.createGain();
        this.mainGain.connect(this.peakingFilter);
        this.peakingFilter.connect(this.highpass);
        this.highpass.connect(this.highshelf);
        this.highshelf.connect(this.gain);
        this.gain.connectToMainOutput();
    }

    initFXChannels()
    {
        // REVERB
        this.convolverSend = IS.createGain(0);

        this.convolverBuffer = IS.createBuffer(2, 2);
        this.convolverBuffer.noise().add();
        this.convolverBuffer.ramp(0, 1, 0.01, 0.015, 0.1, 4).multiply();

        this.convolver = IS.createConvolver(this.convolverBuffer);

        this.convolverSend.connect(this.convolver);
        this.convolver.connect(this.mainGain);
    }

    load()
    {
        this.rC5 = new RampingConvolver(this);
        this.rC4 = new RampingConvolver(this);
        this.rC3 = new RampingConvolver(this);
        this.rC3A = new RampingConvolver(this);
        this.rC2 = new RampingConvolver(this);

        this.BrC5 = new RampingConvolver(this);
        this.BrC4 = new RampingConvolver(this);
        this.BrC3 = new RampingConvolver(this);
        this.BrC3A = new RampingConvolver(this);
        this.BrC2 = new RampingConvolver(this);

        this.rC1A = new RampingConvolver(this);

        // RAMPING CONVOLVER

        this.fund = Parameters.Fundamental;
        this.rate = Parameters.Rate;
        this.gainVal = 3;

        console.log(`fund: ${this.fund} , rate: ${this.rate}`);

        // startTime , rate , rampArray , bufferLength , fund , frequencyRange , gainVal

        this.rC5.load(this.rate * IS.Random.Float( 0.8 , 1.2 ), 2, this.fund * 0.5, [ 500 , 4000 ], this.gainVal * 3);
        this.rC4.load(this.rate * IS.Random.Float( 0.8 , 1.2 ), 2, this.fund * 0.5, [ 500 , 4000 ], this.gainVal * 3);

        this.rC3.load( this.rate * IS.Random.Float( 0.8 , 1.2 ) , 2 , this.fund * 1 , [ 200 , 800 ] , this.gainVal * 0.75 );
        this.rC3A.load( this.rate * IS.Random.Float( 0.8 , 1.2 ), 2 , this.fund * 1 , [ 200 , 800 ] , this.gainVal * 0.75 );

        // this.rC2.load( this.rate * IS.Random.Float( 0.125 , 0.25 ) , 2 , this.fund * 2 , [ 500 , 4000 ] , this.gainVal * 1 );
        this.rC2.load( IS.Random.Float( 2 , 4 ) * this.rate * IS.Random.Float( 0.8 , 1.2 ) , 2 , this.fund * 2 , [ 1000 , 5000 ] , this.gainVal * 0.5 );

        this.BrC5.load( this.rate * IS.Random.Float( 0.125 , 0.25 ) , 2 , this.fund * 0.5 , [ 500 , 1000 ] , this.gainVal * 3 );
        this.BrC4.load( this.rate * IS.Random.Float( 0.125 , 0.25 ) , 2 , this.fund * 0.5 , [ 500 , 1000 ] , this.gainVal * 3 );

        this.BrC3.load( this.rate * IS.Random.Float( 0.8 , 1.2 )  , 2 , this.fund * 1 , [ 200 , 800 ] , this.gainVal * 1 );
        this.BrC3A.load( this.rate * IS.Random.Float( 0.8 , 1.2 ) , 2 , this.fund * 1 , [ 200 , 800 ] , this.gainVal * 1 );

        // this.BrC2.load( this.rate * IS.Random.Float( 0.125 , 0.25 ) , 2 , this.fund * 2 , [ 500 , 4000 ] , this.gainVal * 1 );
        this.BrC2.load( IS.Random.Float( 2 , 4 ) * this.rate * IS.Random.Float( 0.8 , 1.2 ) , 2 , this.fund * 2 , [ 1000 , 5000 ] , this.gainVal * 0.25 );


        this.rampingConvolverArray =
        [
            this.rC5 , this.rC4 , this.rC3 , this.rC3A , this.rC2 ,
            this.BrC5 , this.BrC4 , this.BrC3 , this.BrC3A , this.BrC2
        ];

        this.generateStructure();
    }

    generateStructure()
    {
        this.qN = 4 * ( 1 / 4 );
        this.bar = 16;
        this.nBars = 2;
        this.structureIdx = 0;

        this.explicitStructure();
    }

    explicitStructure()
    {
        this.structureArray1 =
        [
            [ 0 , 0 , 0 , 0 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 0 , 0 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 1 , 0 ],

            [ 0 , 1 , 0 , 1 , 1 , /**/ 0 , 0 , 1 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 0 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 1 , 1 , 1 , 1 ],
        ]

        this.structureArray2 =
        [
            [ 0 , 0 , 0 , 0 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 0 , 0 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 1 , 0 ],

            [ 1 , 0 , 0 , 1 , 1 , /**/ 0 , 0 , 1 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 0 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 0 , 1 , 1 , 1 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 1 , 1 , 1 , 1 ],
        ]

        this.structureArray3 =
        [
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

        this.structureArray4 =
        [
            [ 1 , 1 , 1 , 0 , 0 , /**/ 0 , 0 , 0 , 0 , 0 ],
            [ 1 , 0 , 1 , 1 , 0 , /**/ 0 , 1 , 0 , 0 , 0 ],
            [ 1 , 0 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 0 , 0 ],
            [ 1 , 1 , 1 , 1 , 1 , /**/ 1 , 0 , 0 , 0 , 0 ],
 
            [ 0 , 0 , 1 , 1 , 0 , /**/ 1 , 1 , 0 , 1 , 0 ],
            [ 0 , 0 , 1 , 1 , 0 , /**/ 1 , 1 , 1 , 0 , 0 ],
            [ 0 , 1 , 1 , 1 , 0 , /**/ 1 , 1 , 1 , 1 , 1 ],
            [ 0 , 0 , 0 , 0 , 0 , /**/ 1 , 1 , 1 , 1 , 1 ],
        ]

        this.structureArray = IS.Random.Select(this.structureArray1 , this.structureArray2 , this.structureArray3);

        console.log('---- STRUCTURE ARRAY: ' , this.structureArray);
    }

    schedule()
    {
        for (let i = 0; i < this.structureArray.length; i++)
        {
            for (let j = 0; j < this.structureArray[i].length; j++)
            {
                if(this.structureArray[i][j] === 1)
                {
                    this.rampingConvolverArray[j].scheduleStart(this.bar * i , this.bar * (i + 1));
                }
            }
        }

        this.convolverSend.gain.scheduleValue(1, 0, 16);
    }

    stop()
    {
        startButton.innerHTML = "reset";
    }
}

class RampingConvolver
{
    constructor( piece )
    {
        this.output = IS.createGain(0);

        this.output.connect(piece.mainGain);
        this.output.connect(piece.convolverSend);
    }

    load(rate, bufferLength, fund, frequencyRange, gainVal)
    {
        this.output.gain = gainVal;

        this.rate = rate;

        this.convolverBuffer = IS.createBuffer(1, bufferLength);

        const intervalArray = [1, M2, M3, P4, P5, M6, 2];
        const octaveArray = [1, 4, 2];

        let interval = 0;
        let octave = 0;
        let rampStartPercent = 0;

        for(let i = 0 ; i < 10 ; i++)
        {
            interval = IS.Random.Select(...intervalArray);
            octave = IS.Random.Select(...octaveArray);
            rampStartPercent = IS.Random.Float( 0.1 , 0.9 );

            this.convolverBuffer.suspendOperations();

                this.convolverBuffer.frequencyModulatedSine
                (
                    fund * interval * octave,
                    fund * interval * octave,
                    IS.Random.Float(0.5, 2)
                ).add();

                this.convolverBuffer.constant(1 / octave).multiply();

                this.convolverBuffer.ramp
                (
                    rampStartPercent, rampStartPercent + 0.1,
                    0.5, 0.5,
                    0.1 , 0.1
                ).multiply();

            this.convolverBuffer.applySuspendedOperations().add();
        }

        this.convolverBuffer.normalize();
        this.convolver = IS.createConvolver(this.convolverBuffer);

        // NOISE
        this.noiseBuffer = IS.createBuffer(1, 1);
        this.noiseBuffer.noise().add();

        this.noise = IS.createBufferSource(this.noiseBuffer);
        this.noise.playbackRate = 0.55;
        this.noise.loop = true;
        this.noise.gain = 0.2;

        // NOISE FILTER
        this.noiseFilter = IS.createFilter('bandpass', 0, IS.Random.Float(2, 4));

        // AM\
        this.amplitudeModulationGain = IS.createGain(0);
        this.amplitudeModulationBuffer = IS.createBuffer(1, 1);

        this.amplitudeModulator = IS.createBufferSource(this.amplitudeModulationBuffer);
        this.amplitudeModulator.loop = true;
        this.amplitudeModulator.playbackRate = rate;

        this.amplitudeModulatorArray = [];

        this.amplitudeModulationFilter = IS.createFilter('lowpass', 500, 1);

        const nAB = 1;
        let modDiv = 0;
        let r = 0;

        for(let j = 0 ; j < nAB ; j++)
        {
            modDiv = IS.Random.Int(30, 50);

            let amplitudeModulationBuffer = IS.createBuffer(1, 1);

            for(let i = 0 ; i < modDiv ; i++)
            {
                amplitudeModulationBuffer.suspendOperations();

                    // RANDOM LEVEL
                    amplitudeModulationBuffer.noise().add();
                    amplitudeModulationBuffer.constant(IS.Random.Float(0.125, 0.35)).multiply();

                    amplitudeModulationBuffer.frequencyModulatedSine
                    (
                        IS.Random.Float(1, 10), IS.Random.Float(1, 10), IS.Random.Float(0.1, 1)
                    ).add();

                    amplitudeModulationBuffer.sine(IS.Random.Float(15, 30)).add();
                    amplitudeModulationBuffer.constant(0.5).multiply();

                    amplitudeModulationBuffer.ramp
                    (
                        i / modDiv , (i + 1) / modDiv,
                        0.5, 0.5,
                        0.1, 0.1
                    ).multiply();

                    amplitudeModulationBuffer.constant(IS.Random.Float(0.5, 1)).multiply();
                    amplitudeModulationBuffer.constant(IS.Random.Select(0, 0, 2)).multiply();
    
                amplitudeModulationBuffer.applySuspendedOperations().add();
            }

            amplitudeModulationBuffer.normalize();

            this.amplitudeModulatorArray[j] = IS.createBufferSource(amplitudeModulationBuffer);
            this.amplitudeModulatorArray[j].loop = true;
            this.amplitudeModulatorArray[j].playbackRate = rate;
            this.amplitudeModulatorArray[j].connect(this.amplitudeModulationFilter);

        }

        // PAN
        this.panner = IS.createStereoPanner();

        this.noise.connect(this.noiseFilter);
        this.noiseFilter.connect(this.convolver);

        this.convolver.connect(this.amplitudeModulationGain);
        this.amplitudeModulationFilter.connect(this.amplitudeModulationGain.gain);

        // SEQUENCE GAIN

        this.sequenceGain = IS.createGain(0);

        this.amplitudeModulationGain.connect(this.panner);
        this.panner.connect(this.sequenceGain);
        this.sequenceGain.connect(this.output);

        this.convolver.gain = 1;

        // FILTER SEQUENCE

        const frequencySequenceLength = IS.Random.Int(10, 20);

        this.frequencySequence = [];

        for(let frequencyIndex = 0; frequencyIndex < frequencySequenceLength; frequencyIndex++)
        {
            this.frequencySequence.push(IS.Random.Int(frequencyRange[0], frequencyRange[1]))
        }
    }

    scheduleStart(startTime, stopTime)
    {
        let time = 0;
        let i = 0;

        while( time < stopTime )
        {
            time = startTime + (i / (this.rate * IS.Random.Float(1, 7)));

                this.panner.pan.scheduleValue(IS.Random.Float( -1 , 1 ), time);
                this.sequenceGain.gain.scheduleValue(IS.Random.Float(1, 3) , time);
                this.noiseFilter.frequency.scheduleValue(this.frequencySequence[i % this.frequencySequence.length], time);

            i++;
        }

        let currentBuffer = IS.Random.Int(0, this.amplitudeModulatorArray.length);

        this.noise.scheduleStart( startTime );
        this.amplitudeModulatorArray[currentBuffer].scheduleStart(startTime);

        this.noise.scheduleStop(stopTime);
        this.amplitudeModulatorArray[currentBuffer].scheduleStop(stopTime);
    }

}