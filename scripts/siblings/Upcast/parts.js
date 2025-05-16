import { IS } from "../../../script.js";
import { SemiOpenPipe } from "./SemiOpenPipe.js";
import { FMShaper } from "./FMShaper.js";

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

export class Piece
{
    constructor()
    {
        this.output = IS.createGain(48);
        this.output.connectToMainOutput();
    }

    initMainChannel()
    {
        this.globalNoiseBuffer = IS.createBuffer(1 , 1);
        this.globalNoiseBuffer.noise().add();

        this.globalNoise = IS.createBufferSource(this.globalNoiseBuffer);
        this.globalNoise.playbackRate = 0.25;
        this.globalNoise.loop = true;
        this.globalNoise.gain = 0.3;

        this.globalNoise.scheduleStart(0);
    }

    initFXChannels()
    {
        // REVERB

        this.convolverBuffer = IS.createBuffer(2 , 2);
        this.convolverBuffer.noise().add();

        this.convolver = IS.createConvolver(this.convolverBuffer);

        this.convolver.gain = 2;

        this.convolver2Buffer = IS.createBuffer(2 , 3);
        this.convolver2Buffer.noise().add();
        this.convolver2Buffer.ramp
        (
            0 , 1 , 0.01 , 0.015 , 0.1 , 4
        ).multiply();

        this.convolver2 = IS.createConvolver(this.convolver2Buffer);

        this.convolver2.gain = 2;

        this.convolverDelay = this.createRandomEcho();
        this.convolverDelay.gain = 0.125;

        // DELAY

        this.delay1 = this.createModulatingDelay(0.25);
        this.delay1.connect(this.output);

        // CONNECTIONS

        this.convolver2.connect(this.convolver);
        this.convolver.connect(this.output);

        this.convolver2.connect(this.output);
    }

    load()
    {
        this.loadRampingConvolver();
    }

    schedule()
    {
        this.structure3Short();
    }

    structure3Short()
    {
        this.rate =  0.15048545040547232;

        // RAMPING CONVOLVER

        this.rampingConvolver3A.startInverse(0, 80);

        this.rampingConvolver3.startInverse(5 , 7);
        this.rampingConvolver3.startInverse(12, 14);
        this.rampingConvolver3.startInverse(18, 21);
        this.rampingConvolver3.startInverse(26, 30);

        this.rampingConvolver3B.startInverse(30, 80);

        this.rampingConvolver3.startInverse(35, 39);
        this.rampingConvolver3.startInverse(44, 47);
        this.rampingConvolver3.startInverse(52, 55);
        this.rampingConvolver3.startInverse(60, 65);
    }

    createModulatingDelay(gainValue)
    {
        let modulatingDelay = this.createRandomEcho();
        modulatingDelay.gain = gainValue;

        let modulationSourceLeft = this.createDelayModulationSource();
        let modulationSourceRight = this.createDelayModulationSource();

        modulationSourceLeft.connect(modulatingDelay.delayTimeLeft);
        modulationSourceRight.connect(modulatingDelay.delayTimeRight);

        modulationSourceLeft.scheduleStart(0);
        modulationSourceRight.scheduleStart(0);

        return modulatingDelay;
    }

    loadRampingConvolver()
    {
        const fund = 1 * IS.Random.Float( 225 , 325 ); // 300
        this.fund = fund;
        const intervalArray1 = [1, M2, P4, P5, M6];
        const octaveArray = [1, 0.5, 2, 0.25];
        const bufferLength = 2;
        const gainVal = 0.5;

        this.rampingConvolver3 = new RampingConvolver(this);
        this.rampingConvolver3A = new RampingConvolver(this);
        this.rampingConvolver3B = new RampingConvolver(this);

        /*
        centerFrequency , bandwidth , Q , oscillationRate ,
        bufferLength , fund , iArray , oArray , divArray , cNorm , gainVal
        */
        this.rampingConvolver3.loadStandard
        (
            3300, 2000, 10, 0.25, bufferLength, fund,
            intervalArray1, octaveArray, [0.125, 0.25, 0.5, 0.165, 0.33, 0.66, 1],
            1, gainVal * 0.25
        );

        this.rampingConvolver3B.loadStandard
        (
            800, 200, 10, 0.25, bufferLength, fund, intervalArray1,
            octaveArray, [ 4 , 5 , 6 , 7 ], 1, gainVal * 0.25
        );

        this.rampingConvolver3A.loadStandard
        (
            800, 200, 10, 1, bufferLength, fund, intervalArray1,
            octaveArray, [2, 3, 4, 5, 6, 7], 1, gainVal * 0.25
        );
    }

    createRandomEcho()
    {
        return IS.createStereoDelay
        (
            IS.Random.Float(0.35, 0.6), IS.Random.Float(0.35, 0.6), IS.Random.Float(0, 0.2), 1
        );
    }

    createDelayModulationSource()
    {
        let delayModulationBuffer = IS.createBuffer(1 , 1);
        delayModulationBuffer.unipolarNoise().add();
        delayModulationBuffer.constant(IS.Random.Float(0.03, 0.04)).multiply();

        let delayModulationSource = IS.createBufferSource(delayModulationBuffer);

        delayModulationSource.playbackRate = IS.Random.Float(0.00002125, 0.00003125);
        delayModulationSource.loop = true;
        delayModulationSource.scheduleStart(0);

        return delayModulationSource;
    }
}

class RampingConvolver extends Piece
{
    constructor(piece)
    {
        super();

        this.output = IS.createGain(0.25);
        this.convolverGain = IS.createGain(2);

        this.noiseFilterGain = IS.createGain(0.03);
        this.noiseFilterConvolverGain = IS.createGain(1);
        this.convolverOutputGain = IS.createGain(0.3);
        this.pieceOutputGain = IS.createGain(0.3);
        this.pieceOutputConvolverGain = IS.createGain(0.125);

        // CONNECT TO PIECE OUTPUT

        this.convolverOutputGain.connect(piece.output);
        this.noiseFilterGain.connect(piece.output);
        this.pieceOutputGain.connect(piece.output);

        // CONNECT TO REVERB

        this.convolverOutputGain.connect(this.convolverGain);

        this.noiseFilterGain.connect(this.noiseFilterConvolverGain);
        this.noiseFilterConvolverGain.connect(this.convolverGain);

        this.pieceOutputGain.connect(this.pieceOutputConvolverGain);
        this.pieceOutputConvolverGain.connect(this.convolverGain);

        this.convolverGain.connect(piece.convolver2);

        // CONNECT TO DELAY

        this.pieceOutputGain.connect(piece.delay1);
    }

    loadStandard
    (
        centerFrequency , bandwidth , Q , oscillationRate , bufferLength , fund ,
        iArray , oArray , divArray , cNorm, gainVal
    )
    {
        this.output.gain = gainVal;

        this.divisionArray = divArray;
        this.oscillationRate = oscillationRate;
        this.fund = fund;
        this.intervalArray = iArray;
        this.octaveArray = oArray;

        // CONVOLVERS

        this.amplitudeModulationConvolver1 = new AMConvolver(bufferLength, fund, iArray, oArray, cNorm);
        this.amplitudeModulationConvolver2 = new AMConvolver(bufferLength, fund, iArray, oArray, cNorm);
        this.amplitudeModulationConvolver3 = new AMConvolver(bufferLength, fund, iArray, oArray, cNorm);

        // IMPULSE

            this.noiseFilter = IS.createFilter('bandpass' , centerFrequency , Q);

            this.noiseOscillatorBufferDivisions = 5;
            this.quantizedBufferDivs = IS.Random.Int(10 , 20);

            this.noiseOscillatorBuffer = IS.createBuffer(1 , 1);

            this.impulseBuffer = IS.createBuffer(1, 1);
            this.impulseNoteDivisions = 10;

            let octave2 = 0;
            let interval2 = 0;

            for(let divisionIndex = 0; divisionIndex < this.impulseNoteDivisions; divisionIndex++)
            {
                octave2 = IS.Random.Select(...oArray);
                interval2 = IS.Random.Select(...iArray);

                this.impulseBuffer.suspendOperations();

                    this.impulseBuffer.ramp
                    (
                        divisionIndex / this.impulseNoteDivisions,
                        (divisionIndex + 1) / this.impulseNoteDivisions,
                        0.01, 0.015, 0.1, 4
                    ).add();

                    this.impulseBuffer.constant(IS.Random.Float(0.25 , 0.7)).multiply();

                this.impulseBuffer.applySuspendedOperations().add();
            }

            let synthesisAlgorithmIndex = 0;

            for(let divisionIndex = 0; divisionIndex < this.noiseOscillatorBufferDivisions; divisionIndex++)
            {
                synthesisAlgorithmIndex = IS.Random.Int(0 , 4);

                let preBuffer = IS.createBuffer
                (
                    1, 1 / this.noiseOscillatorBufferDivisions
                );

                if(synthesisAlgorithmIndex === 0)
                {
                    preBuffer.sine(5).add();
                }

                if(synthesisAlgorithmIndex === 1)
                {
                    preBuffer.frequencyModulatedSine
                    (
                        IS.Random.Float(0.5 , 5),
                        IS.Random.Float(0.5 , 5),
                        IS.Random.Float(0.25 , 2)
                    ).add();
                }

                if(synthesisAlgorithmIndex === 2)
                {
                    preBuffer.amplitudeModulatedSine
                    (
                        IS.Random.Float(0.5, 5), IS.Random.Float(0.5, 5), 1
                    ).add();
                }

                if(synthesisAlgorithmIndex === 3)
                {
                    let peakPercent = IS.Random.Float(0 , 1);

                    preBuffer.ramp
                    (
                        0, 1, peakPercent, peakPercent,
                        IS.Random.Float(1, 2), IS.Random.Float(1, 2)
                    ).add();

                    preBuffer.constant(IS.Random.Select(-1 , 1)).multiply();
                }

                if(synthesisAlgorithmIndex === 4)
                {
                    let quantizedArray = [];

                    for(let divisionIndex = 0; divisionIndex < this.quantizedBufferDivs; divisionIndex++)
                    {
                        quantizedArray.push(IS.Random.Float(-1, 1));
                    }

                    preBuffer.quantizedArrayBuffer(quantizedArray.length, quantizedArray).add();
                }

                this.noiseOscillatorBuffer.splice
                (
                    preBuffer,
                    0 , (divisionIndex / this.noiseOscillatorBufferDivisions),
                    ( divisionIndex + 1 ) / this.noiseOscillatorBufferDivisions
                ).add();
            }

            this.noiseOscillatorBuffer.normalize();

        // PIPE

        this.pipe1 = new SemiOpenPipe(fund);
        this.pipe2 = new SemiOpenPipe(fund);
        this.pipe3 = new SemiOpenPipe(fund);

        this.pipe2.output.gain = 1.25;

        // IMPULSE SHAPER

        // TODO: get this to work
        this.waveShaper = new FMShaper
        (
            fund * 0.125 , fund * 0.25 , 0.1 , 1
        );

        // CONNECTIONS

        this.noiseOscillator = IS.createBufferSource(this.noiseOscillatorBuffer);
        this.noiseOscillator.playbackRate = this.oscillationRate / this.noiseOscillatorBufferDivisions;
        this.noiseOscillatorGain = IS.createGain(bandwidth);

        this.impulseSource = IS.createBufferSource(this.impulseBuffer);
        this.impulseSource.playbackRate = 1;

        this.noiseOscillator.connect(this.noiseOscillatorGain);
        this.noiseOscillatorGain.connect(this.noiseFilter.frequency);

        this.impulseSource.connect(this.waveShaper.input);
        this.waveShaper.output.connect(this.noiseFilter);

        this.noiseFilter.connect(this.noiseFilterGain);

        // convolvers

        this.noiseFilterConvolverGain2 = IS.createGain(1);
        this.noiseFilter.connect(this.noiseFilterConvolverGain2);

        this.noiseFilterConvolverGain2.connect(this.amplitudeModulationConvolver1.input);
        this.amplitudeModulationConvolver1.connect(this.convolverOutputGain);

        this.noiseFilterConvolverGain2.connect(this.amplitudeModulationConvolver2.input);
        this.amplitudeModulationConvolver2.connect(this.convolverOutputGain);

        this.noiseFilterConvolverGain2.connect(this.amplitudeModulationConvolver3.input);
        this.amplitudeModulationConvolver3.connect(this.convolverOutputGain);

        this.noiseFilterConvolverGain2.connect(this.pipe1.input);
        this.pipe1.output.connect(this.pieceOutputGain);

        this.noiseFilterConvolverGain2.connect(this.pipe2.input);
        this.pipe2.output.connect(this.pieceOutputGain);

        this.noiseFilterConvolverGain2.connect(this.pipe3.input);
        this.pipe3.output.connect(this.pieceOutputGain);
    }

    startInverse( startTime , stopTime )
    {
        let currentTime = startTime;
        let startPoint = 0;
        let duration = 1 / this.oscillationRate;
        let divPosition = 0;

        this.amplitudeModulationConvolver1.schedule(startTime, stopTime);
        this.amplitudeModulationConvolver2.schedule(startTime, stopTime);
        this.amplitudeModulationConvolver2.schedule(startTime, stopTime);

        while(currentTime < stopTime)
        {
            divPosition =
            (
                IS.Random.Int(0, this.noiseOscillatorBufferDivisions) / this.noiseOscillatorBufferDivisions
            );

            // TODO: figure out how to start at a different point in the buffer
            startPoint = this.noiseOscillatorBuffer.duration * divPosition;

            this.noiseOscillator.loopStart = startPoint;
            this.noiseOscillator.scheduleStart(currentTime, duration);

            currentTime += duration;
        }

        this.pipeSequenceInverse(startTime , stopTime , this.divisionArray);
    }

    pipeSequenceInverse(startTime, stopTime, divArray)
    {
        let length = 0;
        let currentTime = 0 + startTime ;
        let division = 0;
        let f = 0;

        let nFilters = 4;

        while(currentTime < stopTime)
        {
            length = this.fund * IS.Random.Select(...this.intervalArray) * IS.Random.Select(...this.octaveArray);
            division = IS.Random.Select(...divArray);

            for(let filterIndex = 0; filterIndex < nFilters; filterIndex++)
            {
                f = length * this.pipe1.lengthMultiplierArray[ filterIndex ];

                // TODO: restore "time constant"?
                this.pipe1.filters[filterIndex].frequency.scheduleValue
                (
                    f, currentTime, 0.01
                );

                this.pipe2.filters[filterIndex].frequency.scheduleValue
                (
                    f * 0.5, currentTime, 0.01
                );

                this.pipe3.filters[filterIndex].frequency.scheduleValue
                (
                    f * 2, currentTime, 0.01
                );
            }

            this.impulseSource.playbackRate = 1 / division;
            this.impulseSource.scheduleStart(currentTime);
            this.impulseSource.scheduleStop(stopTime);
            this.impulseSource.playbackRate.scheduleValue(1 / division , currentTime);

            currentTime += division;
        }
    }

}

class AMConvolver extends Piece
{
    constructor(bufferLength, fund, iArray)
    {
        super();

        this.input = IS.createGain(1);
        this.output = IS.createGain(1);

        this.highPass = IS.createFilter('highpass', 20, 1);
        this.lowShelf = IS.createFilter('lowshelf', 300, 1);

        // TODO: note that this .gain is ambiguous with IS_Node.gain
        this.lowShelf.gain = -3;

        this.highPass2 = IS.createFilter('highpass', 200, 1);

        // TAP BUFFER

        // tapDivs, tapBufferPlaybackRate
        this.createTapBuffer(IS.Random.Int(30, 60), IS.Random.Float(0.25 , 1));

        this.tapGain = IS.createGain(0);

        const convolverBuffer = IS.createBuffer(1 , bufferLength);

        let possibleOctaves = [1 , 2 , 4 , 8 , 16];

        let interval = 0;
        let octave = 0;
        let octave2 = 0;
        let rampStartPercent = 0;
        let nConvolverNotes = IS.Random.Int(10 , 16);

        for(let convolverNoteIndex = 0; convolverNoteIndex < nConvolverNotes; convolverNoteIndex++)
        {
            interval = IS.Random.Select(...iArray);
            octave = IS.Random.Select(...possibleOctaves);
            rampStartPercent = IS.Random.Float(0.1, 0.9);

            convolverBuffer.suspendOperations();

                convolverBuffer.frequencyModulatedSine
                (
                    fund * interval * octave,
                    fund * interval * octave,
                    IS.Random.Float(0.1, 2)
                ).add();

                convolverBuffer.constant(IS.Random.Float(0.5, 1)).multiply();

                if(octave === 16 || octave === 8)
                {
                    convolverBuffer.constant(0.5).multiply();
                }

                if(IS.Random.CoinToss())
                {
                    convolverBuffer.ramp
                    (
                        rampStartPercent, rampStartPercent + 0.1,
                        0.01, 0.015, 0.1, 4
                    ).multiply()
                }
                else
                {
                    convolverBuffer.ramp
                    (
                        rampStartPercent, rampStartPercent + 0.1,
                        0.5, 0.5, 1, 1
                    ).multiply();
                }

            convolverBuffer.applySuspendedOperations().add();
        }

        convolverBuffer.normalize();
        const convolver = IS.createConvolver(convolverBuffer);

        this.input.connect(this.highPass);
        this.highPass.connect(this.tapGain); this.tapBufferSource.connect(this.tapGain.gain);
        this.tapGain.connect(this.lowShelf);
        this.lowShelf.connect(convolver);
        convolver.connect(this.highPass2);
        this.highPass2.connect(this.output);
    }

    createTapBuffer(nTapDivs, playbackRate)
    {
        this.tapBufferPlaybackRate = playbackRate;

        this.tapBuffer = IS.createBuffer(1 , 1);

        let toggle = 0;

        for(let tapIndex = 0; tapIndex < nTapDivs; tapIndex++)
        {
            if(toggle === 0)
            {
                let pulseEndPercent = IS.Random.Float(0.25 , 1);

                let pulseBuffer = IS.createBuffer(1, 1 / nTapDivs);

                toggle = IS.Random.Int(0 , 2);

                pulseBuffer.ramp
                (
                    0, pulseEndPercent,
                    0.5, 0.5,
                    0.1, 0.1
                ).add();

                pulseBuffer.constant(IS.Random.Float(0.25 , 1)).multiply();
                pulseBuffer.constant(toggle).multiply();

                toggle = 1;

                this.tapBuffer.splice
                (
                    pulseBuffer, 0, 1, tapIndex / nTapDivs
                ).add();
            }
            else
            {
                toggle = 0;
            }
        }

        this.tapBufferSource = IS.createBufferSource(this.tapBuffer);
        this.tapBufferSource.playbackRate = this.tapBufferPlaybackRate;
        this.tapBufferSource.loop = true;
    }

    schedule(startTime, stopTime)
    {
        this.tapBufferSource.scheduleStart( startTime );
        this.tapBufferSource.scheduleStop( stopTime );
    }

    connect(audioNode)
    {
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	}
}