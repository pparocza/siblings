import { IS } from "../../../script.js";
import { PitchedPresets } from "./PitchedPresets.js";

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
        this.fund = 2 * IS.Random.Float(160, 180);
        this.gainVal = 0.25;
    
        this.pA =
        [
            'pitch1'/*, 'pitch3', 'pitch7', 'pitch9', 'pitch10', 'pitch12',
            'pitch13', 'pitch20', 'pitch23', 'pitch27'*/
        ];
    
        this.pAHigh1 =
        [
            'pitch1'/*, 'pitch12', 'pitch13', 'pitch20', 'pitch23', 'pitch27',*/
        ];
    
        this.pALow1 =
        [
            'pitch1', // <-- TODO: not originally part of this array, remove once fixes made
            // 'pitch20', 'pitch23', 'pitch27'
        ];
    
        this.chord1A = [1, M2, P4, 1/m3, M6];
        this.chord1B = [1/M2/P4, 1, M2];
        this.chord1C = [1, M2, M3, P5];
        this.chord1D = [1, M2, M3, P5, M6];
    
        this.chordArray = [ this.chord1B , this.chord1C , this.chord1D ];
    
        this.chordIdx = IS.Random.Int(0 , this.chordArray.length);
        this.currentChord = this.chordArray[ this.chordIdx ];
    
        this.div = IS.Random.Int( 5 , 11 );
        this.rate = IS.Random.Float( 0.2 , 0.3 );
        this.endTime = this.div * 14;
        this.pL = 1/this.rate;
    }

    start()
    {
        this.coolProgression2A();
    }

    coolProgression2A()
    {

        console.log
        (
            `fund: ${this.fund} , chord: ${this.chordIdx} , div ${this.div} , 
            this.rate: ${this.rate} , end time: ${this.endTime}`
        );

        // this.div = IS.Random.Int( 5 , 10 );

        // fund: 321.90993509639503 , chord: 2 , div 10 , this.rate: 0.2047596119357182 , end time: 140
        // fund: 348.7297948494201 , chord: 0 , div 9 , this.rate: 0.23331114908119638 , end time: 126
        // fund: 328.22318374685204 , chord: 0 , div 9 , this.rate: 0.2190200424713958 , end time: 126
        // fund: 336.1230164008747 , chord: 2 , div 8 , this.rate: 0.29172782378539674 , end time: 112
        // fund: 347.0753799717477 , chord: 2 , div 7 , this.rate: 0.20243439390443727 , end time: 98
        // fund: 338.76247135798565 , chord: 0 , div 9 , this.rate: 0.24076482676701277 , end time: 126
        // fund: 344.63746777631195 , chord: 1 , div 7 , this.rate: 0.2915959613102263 , end time: 98
        // fund: 341.37746545178527 , chord: 1 , div 6 , this.rate: 0.22323923759022346 , end time: 84
        // fund: 339.4846326317231 , chord: 0 , div 9 , this.rate: 0.2407382359311753 , end time: 126
        // fund: 336.8388918174787 , chord: 2 , div 6 , this.rate: 0.21023856287583045 , end time: 84
        // fund: 338.02941873547064 , chord: 0 , div 8 , this.rate: 0.2422288506305436 , end time: 112
        // fund: 324.17912503706634 , chord: 2 , div 9 , this.rate: 0.2629148693604565 , end time: 126
        // fund: 338.2179556918736 , chord: 2 , div 5 , this.rate: 0.2526208302133381 , end time: 70
        // fund: 323.99865392549066 , chord: 1 , div 6 , this.rate: 0.2716168508878215 , end time: 84
        // fund: 358.4809500087004 , chord: 0 , div 8 , this.rate: 0.24212698921728448 , end time: 112
        // fund: 339.7393969750227 , chord: 0 , div 8 , this.rate: 0.29122356515634173 , end time: 112
        // fund: 355.0687247579041 , chord: 0 , div 8 , this.rate: 0.2609988577607561 , end time: 112
        // fund: 352.15876472484166 , chord: 0 , div 7 , this.rate: 0.20613563611166508 , end time: 98
        // fund: 343.0985994082451 , chord: 1 , div 7 , this.rate: 0.20899903740687525 , end time: 98
        // fund: 357.00422794494114 , chord: 2 , div 8 , this.rate: 0.29607481645452605 , end time: 112

        pitchedPresetSequenceSpliceDelay( this.div*0 , this.div*2 , IS.Random.Float( 1 , 2 ) , this.rate , this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*0 , this.div*3 , IS.Random.Float( 1 , 2 ) , this.rate , this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        pitchedPresetSequenceSpliceDelay( this.div*2 , this.div*4 , IS.Random.Float( 1 , 2 ) , this.rate , this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*3 , this.div*4 , IS.Random.Float( 1 , 2 ) , this.rate , this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        
        pitchedPresetSequenceSpliceDelay( this.div*1 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 0.5  ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal * 0.5 );
        
        pitchedPresetSequenceSpliceDelay( this.div*2 , this.div*5 ,  2 , 0.25 ,  3 ,     this.fund * 0.25  , this.currentChord , this.pALow1 , this.gainVal );
        
        pitchedPresetSequenceSpliceDelay( this.div*3 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*4 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*5 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * 0.25 ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        pitchedPresetSequenceSpliceDelay( this.div*4 , this.div*4.5 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );
        pitchedPresetSequenceSpliceDelay( this.div*4 , this.div*5 , IS.Random.Float( 1 , 2 ) , this.rate , this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        
        pitchedPresetSequenceSpliceDelay( this.div*5 , this.div*5.5 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );

        pitchedPresetSequenceSpliceDelay( this.div*6 , this.div*7.5 , IS.Random.Float( 1 , 2 ) , this.rate , this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        pitchedPresetSequenceSpliceDelay( this.div*7 , this.div*7.25 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );

        pitchedPresetSequenceSpliceDelay( this.div*5 , this.div*9 ,  2 , 0.25 ,  4 /* 3 */ ,     this.fund*0.25  , this.currentChord , this.pALow1 , this.gainVal );

        pitchedPresetSequenceSpliceDelay( this.div*6 , this.div*8 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*6 , this.div*8 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        
        pitchedPresetSequenceSpliceDelay( this.div*7 , this.div*8.5 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 0.33 ,  this.fund ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*8 , this.div*9.7 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 0.33 ,  this.fund ,  this.currentChord , this.pAHigh1 , this.gainVal );
        
        pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * IS.Random.Select( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * IS.Random.Select( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*8 , this.endTime ,  IS.Random.Float( 1 , 2 ) , IS.Random.Float( 0.5 , 1.5 ) ,  this.div * IS.Random.Select( [ 0.25 ] ) ,   this.fund*0.5  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        
        pitchedPresetSequenceSpliceDelay( this.div*8 , this.div*9.75 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );
       
        pitchedPresetSequenceSpliceDelay( this.div*8 , this.div*9 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*8 , this.div*9.5 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*9 , this.div*10 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        
        pitchedPresetSequenceSpliceDelay( this.div*8 , this.div*11 ,  2 , 0.25 ,  3 ,     this.fund*0.25  , this.currentChord , this.pALow1 , this.gainVal );
    
        pitchedPresetSequenceSpliceDelay( this.div*10 , this.div*11.5 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*10 , this.div*12 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*11 , this.div*12 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        pitchedPresetSequenceSpliceDelay( this.div*12 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );

        pitchedPresetSequenceSpliceDelay( this.div*12 , this.div*12.5 ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );

        pitchedPresetSequenceSpliceDelay( this.div*11 , this.endTime ,  2 , 0.25 ,  4 ,     this.fund*0.25  , this.currentChord , this.pALow1 , this.gainVal );

        pitchedPresetSequenceSpliceDelay( this.div*13 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div ,  this.fund  ,  this.currentChord , this.pAHigh1 , this.gainVal );
        pitchedPresetSequenceSpliceDelay( this.div*13 , this.endTime ,  IS.Random.Float( 1 , 2 ) , this.rate ,  this.div * 2 ,  this.fund * 2  ,  this.currentChord , this.pA , this.gainVal * 0.5 );

    }
}

function pitchedPresetSequenceSpliceDelay
(
    startTime, stopTime, bufferLength, rate, spliceDiv, fundamental, chordArray, pitchArray, gainVal
)
{
    const output = IS.createGain(gainVal);
    const delay = IS.createStereoDelay
    (
        IS.Random.Float(0.01, 0.035),
        IS.Random.Float(0.01, 0.035),
        IS.Random.Float(0, 0.1),
        1
    );

    const delayLFOBuffer = IS.createBuffer(1 , 1);
    const delayLFOSource = IS.createBufferSource(delayLFOBuffer);

    if(IS.Random.CoinToss())
    {
        delayLFOBuffer.inverseSawtooth(1).add();
    }
    else
    {
        delayLFOBuffer.sawtooth(1).add();
    }

    delayLFOSource.playbackRate = rate * IS.Random.Select(0.5 , 0.25 , 0.33 , 0.66 , 1 , 1.5 , 1.25);
    delayLFOSource.loop = true;

    const delayLFOFilter = IS.createFilter( "lowpass" , 10 , 1 );

    delayLFOSource.connect(delayLFOFilter);
    delayLFOSource.connect(delay.gain);

    // CREATE BUFFERS
    const convolverBuffer = IS.createBuffer(1, bufferLength);

    const impulseBuffer = IS.createBuffer(1, 1);
    impulseBuffer.impulse().add();
    impulseBuffer.constant(64).multiply();

    const impulseBufferSource = IS.createBufferSource(impulseBuffer);
    impulseBufferSource.playbackRate = rate;
    impulseBufferSource.loop = true;

    const pitchedPresets = new PitchedPresets();

    let splicePositionPercent = 0;
    const sPMax = 1 - (1 / spliceDiv);

    for (let spliceIndex= 0; spliceIndex < spliceDiv; spliceIndex++)
    {
        splicePositionPercent = IS.Random.Float(0, sPMax);

        pitchedPresets[IS.Random.Select(...pitchArray)](fundamental * IS.Random.Select(...chordArray));

        convolverBuffer.splice
        (
            pitchedPresets.b1Buffer,
            splicePositionPercent,
            splicePositionPercent + (1 / spliceDiv),
            spliceIndex / spliceDiv
        ).add();
    }

    convolverBuffer.constant(1 / spliceDiv).multiply();
    // TODO: restore in IS_Buffer
    convolverBuffer.movingAverage(36);

    convolverBuffer.ramp
    (
        0 , 1 , 0.0125 , 0.9875 , 0.5 , 0.5
    ).multiply();

    const filter = IS.createFilter("highpass", 10, 1);
    const convolver = IS.createConvolver(convolverBuffer);

    impulseBufferSource.connect(convolver);
    convolver.connect(filter);
    filter.connect(delay);

    filter.connect(output);
    delay.connect(output);

    output.connectToMainOutput();

    impulseBufferSource.scheduleStart(startTime);
    delayLFOSource.scheduleStart(startTime);

    impulseBufferSource.scheduleStop(stopTime);
    delayLFOSource.scheduleStop(stopTime);

    // convolverBuffer.printOnOperationsComplete = true;
}
