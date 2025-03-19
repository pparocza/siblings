import { IS } from "../../../script.js";
import { Parameters } from "./Parameters.js";
import { OutputBus } from "./OutputBus.js";
import { FMPad } from "./FMPad.js";

export function Pads(nLayers, fundamental, chord)
{
	let fmPadSource = new FMPad(IS, nLayers, fundamental, chord);
	let fmPadSource2 = new FMPad(IS, nLayers, fundamental, chord);

	let directOutputVolume = Parameters.Mixing.Pad.FMPadSourceDirectOutputVolume;
	let convolverOutputVolume = Parameters.Mixing.Pad.FMPadSourceConvolverOutputVolume;

	fmPadSource.sourceOutput.volume = directOutputVolume;
	fmPadSource2.sourceOutput.volume = directOutputVolume;

	fmPadSource.convolverOutput.volume = convolverOutputVolume;
	fmPadSource2.convolverOutput.volume = convolverOutputVolume;

	let fmPadSourceFilter = IS.createFilter("lowpass", Parameters.Mixing.Pad.FMPadLowpassFilterCutoff);
	let fmPadConvolverFilter = IS.createFilter("highpass", 300);

	//
	fmPadSourceFilter.connect(OutputBus.Delay, OutputBus.Reverb, OutputBus.MainOutput);
	fmPadConvolverFilter.connect(OutputBus.Delay, OutputBus.Reverb, OutputBus.MainOutput);

	fmPadConvolverFilter.connectToInput
	(
		fmPadSource.convolverOutput,
		fmPadSource2.convolverOutput
	);

	fmPadSourceFilter.connectToInput
	(
		fmPadSource.sourceOutput,
		fmPadSource2.sourceOutput
	);

	let sectionStartTimes = Parameters.Structure.SectionStartTime.Pads;

	fmPadSource.scheduleStart(sectionStartTimes.One);
	fmPadSource2.scheduleStart(sectionStartTimes.Two);
}