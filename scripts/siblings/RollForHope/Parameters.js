import { IS } from "../../../script.js";

export const Parameters =
{
    Structure:
    {
        nLayers: 50,

        TimeLimit: 160,

        SectionStartTime:
        {
            Grid:
            {
                One: 0,
                Two: 50,
                Three: 110,
                Four: 135
            },

            Pads:
            {
                One: 0,
                Two: 63
            },

            Keys:
            {
                One: 0,
                Two: 45,
                Three: 130
            }
        },

        Grid:
        {
            nVoices: 30,

            PossibleDurations:
            {
                One: [1, 1.5, 2, 3, 1.33, 1.7],
                Two: [1, 0.5, 1.5, 1.25, 0.75],
                Three: [1, 1.5, 2, 3, 1.33, 1.7],
            },

            PossibleOctaves:
            {
                One: [1, 0.5, 2],
                Two: [1, 0.5, 2],
                Three: [1, 0.5, 2]
            },

            Speed:
            {
                One: 0.133,
                Two: 1,
                Three: 0.133
            },

            Density:
            {
                One: 1,
                Two: 0.25,
                Three: 1
            },

            DensityRamp:
            {
                Zero: 0,
                One: 0.15,
                Two: 0.55,
                Three: 0
            }
        },

        Keys:
        {
            Density: 0.6
        }
    },

    Tuning:
    {
        _fundamental: null,

        get Fundamental()
        {
            if(this._fundamental == null)
            {
                this._fundamental = 180; // IS.Random.Float(220, 330);
            }

            return this._fundamental;
        },

        _modeOptions: [IS.Mode.Minor, IS.Mode.Dorian, IS.Mode.Phrygian, IS.Mode.Mixolydian],
        _mode: null,
        get Mode()
        {
            if(this._mode == null)
            {
                this._mode = IS.Random.Select(...this._modeOptions);
            }

            return this._mode;
        },

        _chord: null,
        get Chord()
        {
            if(this._chord == null)
            {
                let scale = IS.ratioScale(this.Mode);
                this._chord =
                [
                    scale.value[0], scale.value[2], scale.value[3], scale.value[4], scale.value[5], scale.value[6]
                ];
            }
            return this._chord;
        }
    },

    Mixing:
    {
        Pad:
        {
            FMPadSourceDirectOutputVolume: -26,
            FMPadSourceConvolverOutputVolume: -4,
            FMPadLowpassFilterCutoff: 1500
        }
    },

    OutputBus:
    {
        ImitationOutputVolumeValue: 0,
        DelayGainValue: 0.125,
        ReverbGainValue: 1,
        DelayHighPassCutoff: 100
    }
}

const PieceConfig =
{
    Fundamental: Parameters.Tuning.Fundamental,
    Mode: Parameters.Tuning.Mode
}
IS.ControlParameters.createParametersFromObject(PieceConfig);