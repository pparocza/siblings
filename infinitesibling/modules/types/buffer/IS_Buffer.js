import { IS_Object } from "../IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Random } from "../../utilities/IS_Random.js";
import { BufferPrint } from "../../utilities/BufferPrint.js";
import { Utilities } from "../../utilities/Utilities.js";
import { IS_BufferPresets } from "../../presets/IS_BufferPresets.js";
import { IS_BufferOperationData } from "./operation/IS_BufferOperationData.js";
import { IS_BufferFunctionData } from "./operation/function/IS_BufferFunctionData.js";
import { IS_BufferFunctionType } from "./operation/function/IS_BufferFunctionType.js";
import { IS_BufferOperatorType } from "./operation/IS_BufferOperatorType.js"
import { IS_BufferOperator } from "./operation/operationQueue/IS_BufferOperator.js";

// TODO: SmoothClip

export class IS_Buffer extends IS_Object
{
    constructor(siblingContext, numberOfChannels = 1, duration = 1, sampleRate = null)
    {
        super(IS_Type.IS_Data.IS_Buffer);

        if (sampleRate === null)
        {
            sampleRate = siblingContext.sampleRate;
        }

        let lengthSamples = siblingContext.Utility.SecondsToSamples(duration, sampleRate);

        this._numberOfChannels = numberOfChannels;
        this._duration = duration;
        this._length = lengthSamples;
        this._sampleRate = sampleRate;

        this._buffer = siblingContext.AudioContext.createBuffer
        (
            numberOfChannels, lengthSamples, this._sampleRate
        );

        this._siblingContext = siblingContext;

        this._operationRequestData = new IS_BufferOperationData();
        this._operationRequestData.bufferLength = this._length;
        this._operationsSuspended = false;

        this._bufferIsReady = true;
        this._printOnOperationsComplete = false;
        this._printTag = null;

        this._operationChannel = null;

        this._awaitingBuffer = [];
    }

    isISBuffer = true;

    get bufferIsReady() { return this._bufferIsReady; }

    get buffer() { return this._buffer; }
    set buffer(buffer)
    {
        this._buffer = buffer.isISBuffer ? buffer.buffer : buffer;
    }

    requestBuffer(awaitingBuffer)
    {
        if(this.bufferIsReady)
        {
            return this._buffer;
        }
        else
        {
            this._awaitingBuffer.push(awaitingBuffer);
        }
    }

    get duration() { return this._duration; }
    set duration(value)
    {
        this._duration = value;
        this._buffer.duration = this._duration;
    }

    // TODO: lengthInSamples and lengthInSeconds
    get length() { return this._length; }
    set length(value)
    {
        this._length = value;
        this._buffer.length = this._length;
    }

    get numberOfChannels() { return this._numberOfChannels; }
    set numberOfChannels(value)
    {
        this._numberOfChannels = value;
        this._buffer.numberOfChannels = this._numberOfChannels;
    }

    get sampleRate() { return this._sampleRate; }
    set sampleRate(value)
    {
        this._sampleRate = value;
        this._buffer.sampleRate = this._sampleRate;
    }

    get preset()
    {
        return IS_BufferPresets._setBuffer(this);
    }

    set operationChannel(value) { this._operationChannel = value; }
    operateOnAllChannels() { this._operationChannel = null; }

    set printTag(value) { this._printTag = value; }

    get printOnOperationsComplete() { return this._printOnOperationsComplete; }
    set printOnOperationsComplete(value) { this._printOnOperationsComplete = value; }

    // OPERATION REQUESTS
    _requestOperation()
    {
        this._bufferIsReady = false;

        if(this._operationChannel !== null)
        {
            this._requestOperationForChannel(this._operationChannel);
        }
        else
        {
            this._requestOperationForAllChannels();
        }
    }

    _requestOperationForChannel(channel)
    {
        let operationData = this._createOperationRequest(channel);
        IS_BufferOperator.requestOperation(this, operationData);
    }

    _requestOperationForAllChannels()
    {
        for(let channelIndex = 0; channelIndex < this._numberOfChannels; channelIndex++)
        {
            let operationData = this._createOperationRequest(channelIndex);
            IS_BufferOperator.requestOperation(this, operationData);
        }
    }

    _createOperationRequest(channel)
    {
        let functionType = this._operationRequestData.functionData.functionType;

        let operationData = new IS_BufferOperationData
        (
            this._operationRequestData.operatorType,
            this._operationRequestData.functionData,
            channel,
            this._uuid
        );

        if (this._operationsSuspended && functionType !== IS_BufferFunctionType.SuspendedOperations)
        {
            operationData.isSuspendedOperation = true;
        }
        else
        {
            operationData.isSuspendedOperation = false;

            this._operationsSuspended = false;
        }

        return operationData;
    }

    completedOperationDataToBuffer(completedOperationData)
    {
        let completedArrays = completedOperationData.completedArrays;

        for(const [channelNumber, completedArray] of Object.entries(completedArrays))
        {
            this._buffer.copyToChannel(completedArray, parseInt(channelNumber));
        }

        this.operationsComplete();
    }

    operationsComplete()
    {
        this._bufferIsReady = true;
        this._fulfillBufferRequests();

        if(this.printOnOperationsComplete)
        {
            this.print();
        }
    }

    _fulfillBufferRequests()
    {
        while(this._awaitingBuffer.length > 0)
        {
            let awaitingBuffer = this._awaitingBuffer.shift();

            if(awaitingBuffer.isISBufferSource || awaitingBuffer.isISConvolver)
            {
                awaitingBuffer.buffer = this.buffer;
            }
            else if(awaitingBuffer.isISBufferRegistryData)
            {
                awaitingBuffer.getAwaitedBuffer(this);
            }
        }
    }

    _setOperationRequestOperatorData(iSBufferOperatorType)
    {
        this._operationRequestData.operatorType = iSBufferOperatorType;
    }

    _setOperationRequestFunctionData(iSBufferFunctionType, ...args)
    {
        this._operationRequestData.functionData = new IS_BufferFunctionData
        (
            iSBufferFunctionType, ...args
        );
    }

    // OPERATION SUSPENSION
    suspendOperations()
    {
        this._operationsSuspended = true;
    }

    applySuspendedOperations()
    {
        this._setOperationRequestFunctionData(IS_BufferFunctionType.SuspendedOperations);
        return this;
    }

    add(buffer = null)
    {
        if (buffer === null)
        {
            this._handleOperatorMethod(IS_BufferOperatorType.Add);
        }
        else
        {
            this._handleOtherBufferAsFunction(IS_BufferOperatorType.Add, buffer);
        }
    }

    multiply(buffer = null)
    {
        if (buffer === null)
        {
            this._handleOperatorMethod(IS_BufferOperatorType.Multiply);
        }
        else
        {
            this._handleOtherBufferAsFunction(IS_BufferOperatorType.Multiply, buffer);
        }
    }

    divide(buffer = null)
    {
        if (buffer === null)
        {
            this._handleOperatorMethod(IS_BufferOperatorType.Divide);
        }
        else
        {
            this._handleOtherBufferAsFunction(IS_BufferOperatorType.Divide, buffer);
        }
    }

    subtract(buffer = null)
    {
        if (buffer === null)
        {
            this._handleOperatorMethod(IS_BufferOperatorType.Subtract);
        }
        else
        {
            this._handleOtherBufferAsFunction(IS_BufferOperatorType.Subtract, buffer);
        }
    }

    _handleOperatorMethod(iSBufferOperatorType)
    {
        this._setOperationRequestOperatorData(iSBufferOperatorType);

        this._requestOperation();
    }

    _handleOtherBufferAsFunction(iSBufferOperatorType, otherBuffer)
    {
        this._setOperationRequestFunctionData(IS_BufferFunctionType.Buffer, otherBuffer);
        this._setOperationRequestOperatorData(iSBufferOperatorType);

        this._requestOperation();
    }

    // FUNCTIONS
    constant(value)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Constant, value
        );

        return this;
    }

    impulse()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Impulse, null
        );

        return this;
    }

    sawtooth(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Sawtooth, exponent
        );

        return this;
    }

    inverseSawtooth(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.InverseSawtooth, exponent
        );

        return this;
    }

    triangle(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Triangle, exponent
        );

        return this;
    }

    noise()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Noise, null
        );

        return this;
    }

    unipolarNoise()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Noise, null
        );

        return this;
    }

    square(dutyCycle = 0.5)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Square, dutyCycle
        );

        return this;
    }

    pulse(startPercent = 0.5, endPercent= 1.0)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Pulse,
            startPercent, endPercent
        );

        return this;
    }

    // TODO: MULTIPLE FREQUENCIES / ARGUMENT ARRAYS
    sine(frequency = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Sine, frequency
        );

        return this;
    }

    unipolarSine(frequency = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.UnipolarSine, frequency
        );

        return this;
    }

    frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.FrequencyModulatedSine,
            carrierFrequency, modulatorFrequency, modulatorGain
        );

        return this;
    }

    amplitudeModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.AmplitudeModulatedSine,
            carrierFrequency, modulatorFrequency, modulatorGain
        );

        return this;
    }

    quantizedArrayBuffer(quantizationValue = null, ...values)
    {
        let quantization = quantizationValue !== null ? quantizationValue : values.length;

        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.QuantizedArrayBuffer, quantization, ...values
        );

        return this;
    }

    ramp
    (
        startPercent = 0, endPercent = 1,
        upEndPercent = 0.5, downStartPercent = null,
        upExponent = 1, downExponent = 1
    )
    {
        let rampStart = startPercent;
        let rampEnd = endPercent;

        let rampLength = endPercent - startPercent;

        let upLength = (rampLength * upEndPercent);
        let upEnd = rampStart + upLength;

        downStartPercent = downStartPercent !== null ? downStartPercent : upEndPercent;

        let downLength = rampLength - (rampLength * downStartPercent);
        let downStart = rampStart + (rampLength - downLength);

        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Ramp,
            rampStart, rampEnd,
            upEnd, upLength,
            downStart, downLength,
            upExponent, downExponent
        );

        return this;
    }

    noiseBand
    (
        centerFrequency, bandwidth,
        amplitudeMin = 0, amplitudeMax = 1,
        tuningMin = 1, tuningMax = 1
    )
    {
        let frequencies = [];
        let amplitudes = [];

        let halfBand = Math.round(bandwidth * 0.5);
        let bottomFrequency = centerFrequency - halfBand;

        for(let frequencyIndex = 0; frequencyIndex < bandwidth; frequencyIndex++)
        {
            let frequency = bottomFrequency + frequencyIndex;
            let tuning = IS_Random.Float(tuningMin, tuningMax);

            frequencies.push(frequency * tuning);
            amplitudes.push(IS_Random.Float(amplitudeMin, amplitudeMax));
        }

        let frequencyData = [];
        frequencyData.push(frequencies, amplitudes);

        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.NoiseBand, frequencyData
        );

        return this;
    }

    splice(otherBuffer, cropStartPercent, cropEndPercent, insertPercent)
    {
        let cropStartSample = Math.round(otherBuffer.length * cropStartPercent);
        let cropEndSample = Math.round(otherBuffer.length * cropEndPercent);
        let insertStartSample = Math.round(this._length * insertPercent);

        cropEndSample = Math.min(otherBuffer.length, cropEndSample);

        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Splice,
            otherBuffer, cropStartSample, cropEndSample, insertStartSample
        );

        return this;
    }


    movingAverage(windowSize = 36)
    {
        this._setOperationRequestFunctionData(IS_BufferFunctionType.MovingAverage, windowSize);
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Replace);

        this._requestOperation();
    }

    normalize(targetMax = 1)
    {
        this._setOperationRequestFunctionData(IS_BufferFunctionType.Normalize, targetMax);
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Replace);

        this._requestOperation();
    }

    // UTILITY
    amplitude(value)
    {
        this._setOperationRequestFunctionData(IS_BufferFunctionType.Constant, value);
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Multiply);
        this._requestOperation();
    }

    volume(value)
    {
        let amplitude = Utilities.DecibelsToAmplitude(value);

        this._setOperationRequestFunctionData(IS_BufferFunctionType.Constant, amplitude);
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Multiply);
        this._requestOperation();
    }

    print(channel = null)
    {
        if(this._printTag !== null)
        {
            console.log(this._printTag);
        }

        if(channel === null)
        {
            for(let channelIndex = 0; channelIndex < this.numberOfChannels; channelIndex++)
            {
                this.printChannel(channelIndex);
            }
        }
        else
        {
            this.printChannel(channel);
        }
    }

    /**
     * print the contents of a buffer as a graph in the browser console
     * @param channel
     * @param tag
     */
    printChannel(channel = null, tag)
    {
        if (tag)
        {
            console.log(tag)
        }

        let bufferData = new Float32Array(this.length);
        this.buffer.copyFromChannel(bufferData, channel, 0);

        for(let sample= 0; sample < bufferData.length; sample++)
        {
            bufferData[sample] = (0.5 * (100 + (Math.floor(bufferData[sample] * 100))));
        }

        BufferPrint.print(bufferData);
    }
}

// TODO: All of these need to be dealt with
/*
    insert(channel = 0, startPercent = 0, endPercent = 1, style = "add")
    {
        // TODO: all methods have default range arguments?
        let startSample = Math.round(this.length * startPercent);
        let endSample = Math.round(this.length * endPercent);

        let nowBuffering = this.buffer.getChannelData(channel);

        switch(style)
        {
            case "add":
            case 0:
                this.insertAdd(nowBuffering, startSample, endSample);
                break;
            case "replace":
            case 1:
                this.insertReplace(nowBuffering, startSample, endSample);
                break;
            default:
                break;
        }
    }

    /!**
     *
     * @param buffer
     * @param startSample
     * @param endSample
     *!/
    insertAdd(buffer, startSample, endSample)
    {
        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            if(sample > startSample && sample < endSample)
            {
                buffer[sample] += this._bufferShapeArray[sample];
            }
        }
    }

    /!**
     *
     * @param buffer
     * @param startSample
     * @param endSample
     *!/
    insertReplace(buffer, startSample, endSample)
    {
        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            if(sample > startSample && sample < endSample)
            {
                buffer[sample] = this._bufferShapeArray[sample - startSample];
            }
        }
    }
*/

/*

    rampBand
    (
        centerFrequency, bandwidth, upHarmonics, midHarmonics, downHarmonics, upTuningRange, midTuningRange,
        downTuningRange, upEnd, downStart, upExponent, downExponent, upRange, midRange, downRange
    )
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.RampBand,
            centerFrequency, bandwidth, upHarmonics, midHarmonics, downHarmonics, upTuningRange,
            midTuningRange, downTuningRange, upEnd, downStart, upExponent, downExponent, upRange,
            midRange, downRange
        );

        return this;
    }

    /!**
     *
     * @param buffer
     * @param insertPercent
     * @param writeMode
     *!/
    insertBuffer(buffer, insertPercent, writeMode = 0)
    {
        let otherBuffer = null;
        let nowBuffering = null;
        let otherNowBuffering = null;

        if (buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            otherBuffer = buffer.buffer;
        } else
        {
            otherBuffer = buffer;
        }

        let insertSample = Math.round(this.length * insertPercent);

        for (let channel = 0; channel < this.numberOfChannels; channel++)
        {
            nowBuffering = this.buffer.getChannelData(channel);
            otherNowBuffering = otherBuffer.getChannelData(channel);

            for (let sample = 0; sample < otherNowBuffering.length; sample++)
            {
                switch (writeMode)
                {
                    case 0:
                        nowBuffering[sample + insertSample] = otherNowBuffering[sample];
                        break;
                    case 1:
                        nowBuffering[sample + insertSample] += otherNowBuffering[sample];
                        break;
                    default:
                        nowBuffering[sample + insertSample] = otherNowBuffering[sample];
                        break;
                }
            }
        }
    }

    /!**
     * Reverse contents of buffer
     *!/
    reverse()
    {
        for(let channel= 0; channel < this.buffer.numberOfChannels; channel++)
        {
            let nowBuffering = this.buffer.getChannelData(channel);
            nowBuffering.reverse();
        }
    }

    /!**
     * Reverse contents of a single channel
     * @param channel
     *!/
    reverseChannel(channel)
    {
        let nowBuffering = this.buffer.getChannelData(channel);
        nowBuffering.reverse();
    }

    /!**
     * Move portion of buffer to another location
     * @param cropStartPercent
     * @param cropEndPercent
     * @param insertPercent
     *!/
    edit(cropStartPercent, cropEndPercent, insertPercent)
    {
        let cropStartSample = Math.round(this.buffer.length * cropStartPercent);
        let cropEndSample = Math.round(this.buffer.length * cropEndPercent);

        let cropLength = cropEndSample - cropStartSample;

        let newStartSample = Math.round(this.buffer.length * insertPercent);

        let cropArray = [];

        for (let channel= 0; channel < this.buffer.numberOfChannels; channel++)
        {
            let nowBuffering = this.buffer.getChannelData(channel);

            // crop the buffer values
            for (let cropSample= 0; cropSample < cropLength; cropSample++)
            {
                cropArray[cropSample] = nowBuffering[cropSample + cropStartSample];
            }

            // reinsert the cropped values at the new position
            for (let insertSample= 0; insertSample < cropLength; insertSample++)
            {
                if (insertSample + this.nSP <= nowBuffering.length)
                {
                    nowBuffering[insertSample + newStartSample] = cropArray[insertSample];
                }
            }
        }
    }

    channelMerge()
    {
        let nChannels = this._numberOfChannels;

        let tempBuffer = this._siblingContext.AudioContext.createBuffer
        (
            nChannels, this._length, this._sampleRate
        );

        for(let channel = 0; channel < nChannels; channel++)
        {
            tempBuffer.copyToChannel
            (
                this._buffer.getChannelData(channel),
                nChannels - channel - 1
            );
        }

        for(let channel = 0; channel < nChannels; channel++)
        {
            let tempChannel = tempBuffer.getChannelData(channel);
            let nowBuffering = this._buffer.getChannelData(channel);

            for(let sample = 0; sample < this._length; sample++)
            {
                let currentMergeFactor = Math.abs(this._bufferShapeArray[sample]);

                let nowBufferingValue = nowBuffering[sample];
                let otherChannelValue = tempChannel[sample];

                let nowBufferingScaledAmplitude = nowBufferingValue * currentMergeFactor;
                let otherChannelScaledAmplitude = otherChannelValue * (1 - currentMergeFactor);

                let mergedValue = nowBufferingScaledAmplitude + otherChannelScaledAmplitude;

                if(!this._operationsSuspended)
                {
                    nowBuffering[sample] = mergedValue;
                }
                else
                {
                    this._suspendedOperationsArray[sample] = mergedValue;
                }
            }
        }
    }
*/


