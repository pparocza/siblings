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
                One: IS.array(1, 0.5, 2, 0.25),
                Two: IS.array(1, 0.5, 2, 0.25),
                Three: IS.array(1, 0.5, 2, 0.25)
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
                this._fundamental = IS.Random.Float(19, 25);
            }

            return this._fundamental;
        },

        _tonicOptions: IS.array("A", "B", "Bb", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#"),
        _tonic: null,
        get Tonic()
        {
            if(this._tonic == null)
            {
                this._tonic = this._tonicOptions.random();
            }

            return this._tonic;
        },

        _modeOptions: IS.array("minor", "dorian", "phrygian", "mixolydian"),
        _mode: null,
        get Mode()
        {
            if(this._mode == null)
            {
                this._mode = this._modeOptions.random();
            }

            return this._mode;
        },

        _chord: null,
        get Chord()
        {
            if(this._chord == null)
            {
                let scale = IS.ratioScale(this.Tonic, this.Mode);
                this._chord = IS.array
                (
                    scale.value[0], scale.value[2], scale.value[3], scale.value[4],
                    scale.value[5], scale.value[6], scale.value[7]
                );
            }
            return this._chord;
        }
    },

    Mixing:
    {
        Pad:
        {
            FMPadSourceDirectOutputVolume: -11,
            FMPadSourceConvolverOutputVolume: 4,
            FMPadLowpassFilterCutoff: 1500
        }
    },

    OutputBus:
    {
        ImitationOutputVolumeValue: -12,
        DelayGainValue: 0.125,
        ReverbGainValue: 0.5,
        DelayHighPassCutoff: 100
    }
}