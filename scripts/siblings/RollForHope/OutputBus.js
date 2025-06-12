import { IS } from "../../../script.js";
import { Parameters } from "./Parameters.js";

export const OutputBus =
{
    Initialize()
    {
        IS.connect.series(this.Reverb, this.MainOutput);
        IS.connect.series(this.Delay, this.MainOutput);

        this.ConfigureGridOutputBus();
        this.ConfigureKeyOutputBus();
    },

    // TODO: how to generalize this structure? if(x == null) { create x; } return x;
    _mainOutput: null,
    get MainOutput()
    {
        if(this._mainOutput === null)
        {
            this._mainOutput = IS.createGain()
            this._mainOutput.connectToMainOutput();
            this._mainOutput.volume = Parameters.OutputBus.ImitationOutputVolumeValue;
        }
        return this._mainOutput;
    },

    _delay: null,
    get Delay()
    {
        if(this._delay == null)
        {
            this._delay = IS.createStereoDelay();
            this._delay.gain = Parameters.OutputBus.DelayGainValue;
            this._delay.connectToMainOutput();
        }
        return this._delay;
    },

    _reverb: null,
    get Reverb()
    {
        if(this._reverb == null)
        {
            let reverbBuffer = IS.createBuffer(2, 3);

            reverbBuffer.noise().add();
            reverbBuffer.inverseSawtooth(3).multiply();

            this._reverb = IS.createConvolver(reverbBuffer);

            this._reverb.gain = Parameters.OutputBus.ReverbGainValue;
            this._reverb.connectToMainOutput();
        }

      return this._reverb;
    },

    _delayHighPass: null,
    get DelayHighPass()
    {
        if(this._delayHighPass == null)
        {
            this._delayHighPass = IS.createFilter("highpass", Parameters.OutputBus.DelayHighPassCutoff);
            this._delayHighPass.connectToMainOutput();
        }

        return this._delayHighPass;
    },

    _gridOutput: null,
    get GridOutput()
    {
        if(this._gridOutput == null)
        {
            this._gridOutput = IS.createGain();
        }

        return this._gridOutput;
    },

    ConfigureGridOutputBus()
    {
        this.GridOutput;
        let gridFilter = IS.createFilter("highshelf", 5000, 1, -12);

        let gridDirectOut = IS.createGain();
        let gridFXOut = IS.createGain();

        this.GridOutput.connect(gridFilter);
        gridFilter.connect(gridDirectOut, gridFXOut);

        gridDirectOut.connectToMainOutput();
        gridDirectOut.volume = -12;

        gridFXOut.connect(this.Reverb, this.Delay);

        gridFXOut.volume = -12;
    },

    _keyOutput: null,
    get KeyOutput()
    {
        if(this._keyOutput == null)
        {
            this._keyOutput = IS.createGain();
        }

        return this._keyOutput;
    },

    ConfigureKeyOutputBus()
    {
        this.KeyOutput;
        this.KeyOutput.volume = 3;

        this.KeyOutput.connectToMainOutput();
    }
}