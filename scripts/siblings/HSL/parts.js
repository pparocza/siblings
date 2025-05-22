import { IS } from "../../../script.js";
import { Parameters } from "./parameters.js";

var m2 = 25/24;
var M2 = 9/8;
var m3 = 6/5;
var M3 = 5/4;
var P4 = 4/3;
var d5 = 45/32;
var P5 = 3/2;
var m6 = 8/5;
var M6 = 5/3;
var m7 = 9/5;
var M7 = 15/8;

export class Piece
{
    constructor(){}

    initMainChannel()
    {
        this.globalNow = 0;

        this.gain = IS.createGain(8);

        this.highpass = IS.createFilter('highpass', 30.225, 0.581);
        this.lowshelf = IS.createFilter('lowshelf', 695.22, 1);
        this.lowshelf.gain = -2.67;
        this.lowshelf2 = IS.createFilter('lowshelf', 162.24, 1);
        this.lowshelf2.gain = -3.13;
        this.peakingFilter = IS.createFilter('peaking', 279.5, 1.586);
        this.peakingFilter.gain = -2.20;
        this.peakingFilter2 = IS.createFilter('peaking', 2557.9, 1);
        this.peakingFilter2.gain = 1.38;
    
        this.mainGain = IS.createGain();
        this.mainGain.connect(this.highpass);
        this.highpass.connect(this.lowshelf);
        this.lowshelf.connect(this.lowshelf2);
        this.lowshelf2.connect(this.peakingFilter);
        this.peakingFilter.connect(this.gain);
        this.gain.connectToMainOutput();
    }

    initFXChannels()
    {
        // REVERB

        this.reverbSend = IS.createGain(2);

        this.delaySend = IS.createStereoDelay
        (
            IS.Random.Float(0.35, 0.6), IS.Random.Float(0.35, 0.6), IS.Random.Float(0, 0.2), 1
        );
        this.delaySend.gain = 0.0125;

        this.convolverBuffer = IS.createBuffer(2 , 3);
        this.convolverBuffer.noise().add()
        this.convolverBuffer.ramp(0, 1, 0.01, 0.015, 0.1, 4).multiply();

        this.fxHighpass = IS.createFilter("highpass", 200, 1);

        this.convolver = IS.createConvolver(this.convolverBuffer);

        IS.connect.series
        (
            this.reverbSend, this.fxHighpass, this.convolver, this.mainGain
        );

        IS.connect.series
        (
            this.reverbSend, this.fxHighpass, this.delaySend, this.mainGain
        );
    }

    load()
    {
        this.loadRampingConvolvers();
    }

    loadRampingConvolvers(){

        const fund = Parameters.Fundamental; // 300
        const iArray = [ 1 , M2 , P4 , P5 , M6 ];
        this.globalRate = Parameters.Rate;

        this.rC1 = new RampingConvolver(this);
        this.rC2 = new RampingConvolver(this);
        this.rC3 = new RampingConvolver(this);
        this.rC4 = new RampingConvolver(this);
        this.rC5 = new RampingConvolver(this);

        this.rC1.load
        ( 
            // fund
            fund,
            // bufferLength
            2,
            // intervalArray
            iArray,
            // octaveArray
            [1, 0.5, 2, 0.25, 4] ,
            // cFreq 
            12000,
            // bandwidth
            11750,
            // Q
            2,
            // fmCFreq , fmMFreq
            IS.Random.Float(1, 5), IS.Random.Float(1, 5),
            // oscillationRate
            this.globalRate,
            // noiseRate
            0.25,
            // gain
            16 
        );

        this.rC2.load
        ( 
            // fund
            fund , 
            // bufferLength
            1 , 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 0.5 , 2 , 0.25 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11750 , 
            // Q
            4 , 
            // fmCFreq , fmMFreq
            IS.Random.Int(1, 10) , IS.Random.Int(1, 10) ,
            // oscillationRate
            this.globalRate , 
            // noiseRate
            0.25 , 
            // gain
            8 
        );

        this.rC3.load(
            // fund
            fund , 
            // bufferLength
            0.25 , 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 0.5 , 2 , 0.25 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11750 , 
            // Q
            5 , 
            // fmCFreq , fmMFreq
            IS.Random.Int( 1 , 10 ) , IS.Random.Int( 1 , 10 ) ,  
            // oscillationRate
            this.globalRate , 
            // noiseRate
            0.25 , 
            // gain
            5 
        );

        this.rC4.load(
            // fund
            fund , 
            // bufferLength
            2 , 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 0.5 , 2 , 0.25 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11750 , 
            // Q
            2 , 
            // fmCFreq , fmMFreq
            IS.Random.Int( 1 , 10 ) , IS.Random.Int( 1 , 10 ) ,  
            // oscillationRate
            this.globalRate * 0.5 , 
            // noiseRate
            0.25 , 
            // gain
            8 
        );

        this.rC5.load(
            // fund
            fund * 2 , 
            // bufferLength
            1, 
            // intervalArray
            iArray , 
            // octaveArray
            [ 1 , 0.5 , 2 , 0.25 , 4 ] ,
            // cFreq 
            12000 , 
            // bandwidth
            11750 , 
            // Q
            5 , 
            // fmCFreq , fmMFreq
            IS.Random.Int( 1 , 10 ) , IS.Random.Int( 1 , 10 ) ,  
            // oscillationRate
            this.globalRate, 
            // noiseRate
            0.25 , 
            // gain
            8 
        );

        this.rC1.output.connect( this.mainGain );
        this.rC2.output.connect( this.mainGain );
        this.rC3.output.connect( this.mainGain );
        this.rC4.output.connect( this.mainGain );
        this.rC5.output.connect( this.mainGain );

    }

    startRampingConvolvers()
    {
        this.phraseLength = 1 / this.globalRate;

        this.rC1.start(this.globalNow + this.phraseLength * 0, this.globalNow + this.phraseLength * 8);
        this.rC3.start(this.globalNow + this.phraseLength * 4, this.globalNow + this.phraseLength * 8);
        this.rC5.start( this.globalNow + this.phraseLength * 4, this.globalNow + this.phraseLength * 8);

        this.rC2.start(this.globalNow + this.phraseLength * 8  , this.globalNow + this.phraseLength * 16);
        this.rC4.start(this.globalNow + this.phraseLength * 10 , this.globalNow + this.phraseLength * 16);

        this.rC1.start(this.globalNow + this.phraseLength * 12 , this.globalNow + this.phraseLength * 16);
        this.rC3.start(this.globalNow + this.phraseLength * 15  , this.globalNow + this.phraseLength * 16);
    }

    schedule()
    {
		this.globalNow = IS.now;

        this.startRampingConvolvers();
    }

    stop()
    {
        this.fadeFilter.start(0, 20);
        startButton.innerHTML = "reset";
    }

}

class RampingConvolver extends Piece
{
    constructor( piece )
    {
        super();

        this.output = IS.createGain();

        this.mainOutput = IS.createGain(1);
        this.fxOutput = IS.createGain(0.125);

        this.output.connect(this.mainOutput, this.fxOutput);

        this.output.connect(piece.mainGain);
        this.output.connect(piece.reverbSend);
    }

    load
    (
        fund, bufferLength, iArray, oArray, centerFrequency, bandwidth,
        Q, fmCFreq, fmMFreq, oscillationRate, noiseRate, gainVal
    )
    {
        this.convolverBuffer = IS.createBuffer(1, bufferLength);

        let interval = 0;
        let octave = 0;
        let rampPercent = 0;

        for(let i = 0; i < 20; i++)
        {
            interval = IS.Random.Select(...iArray);
            octave = IS.Random.Select(...oArray);
            rampPercent = IS.Random.Float(0.1, 0.9);

            this.convolverBuffer.suspendOperations();

                this.convolverBuffer.frequencyModulatedSine
                (
                    fund * interval * octave,
                    fund * interval * octave,
                    0.5
                ).add();

                this.convolverBuffer.constant(1 / octave).multiply();
                this.convolverBuffer.ramp
                (
                    rampPercent, rampPercent + 0.1,
                    0.5, 0.5,
                    0.1, 0.1
                ).multiply();

            this.convolverBuffer.applySuspendedOperations().add();
        }

        this.convolverBuffer.normalize();

        this.convolver = IS.createConvolver(this.convolverBuffer);

        // NOISE

            this.noiseBuffer = IS.createBuffer(1, 1);
            this.noiseBuffer.noise().add();

            this.noise = IS.createBufferSource(this.noiseBuffer);
            this.noise.playbackRate = noiseRate;
            this.noise.loop = true;
            this.noise.gain = 0.1;

            this.noiseFilter = IS.createFilter('bandpass', centerFrequency, Q);

            this.noiseOscillatorBuffer = IS.createBuffer(1 , 1);
            this.noiseOscillatorBuffer.frequencyModulatedSine(fmCFreq, fmMFreq, 1).add();

            this.noiseOscillator = IS.createBufferSource(this.noiseOscillatorBuffer);
            this.noiseOscillator.playbackRate = oscillationRate;
            this.noiseOscillator.loop = true;

            this.noiseOscillatorGain = IS.createGain(bandwidth);

            this.noiseOscillator.connect(this.noiseOscillatorGain);
            this.noiseOscillatorGain.connect(this.noiseFilter.frequency);
            this.noise.connect(this.noiseFilter);
            this.noiseFilter.connect(this.convolver);

        // DELAY

        this.delay = IS.createStereoDelay
        (
            IS.Random.Float(0.35, 0.6), IS.Random.Float(0.35, 0.6), IS.Random.Float(0, 0.2), 1
        );

        // CONNECTIONS

        this.convolver.connect(this.output);

        this.convolver.connect(this.delay);

        this.convolver.connect(this.output);
        this.delay.connect(this.output);

        this.convolver.gain = gainVal;
    }

    start(startTime, stopTime)
    {
        this.noise.scheduleStart(startTime);
        this.noiseOscillator.scheduleStart(startTime);

        this.noise.scheduleStop(stopTime);
        this.noiseOscillator.scheduleStop(stopTime);
    }

}