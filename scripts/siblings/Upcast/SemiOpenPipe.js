import { IS } from "../../../script.js";

export class SemiOpenPipe
{
	constructor(length)
	{
		this._input = IS.createGain();
		this._output = IS.createGain();

		this._length = length;
		this.lengthMultiplierArray = [1, 3, 5, 7];
		let nFilters = this.lengthMultiplierArray.length;

		this.filters = [];

		for(let filterIndex=0; filterIndex < nFilters; filterIndex++)
		{
			let filterFrequency = this._length * this.lengthMultiplierArray[filterIndex];
			let filter = IS.createFilter("bandpass", filterFrequency, 30);

			this.filters[filterIndex] = filter;

			this._input.connect(filter);
			filter.connect(this._output);
		}
	}

	get input() { return this._input; }
	get output() { return this._output; }
}