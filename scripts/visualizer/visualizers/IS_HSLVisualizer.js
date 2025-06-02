import * as THREE from "https://cdn.skypack.dev/three@0.152.0";
import { IS_Visualizer } from "../IS_Visualizer.js";
import { IS } from "../../../script.js";
import { IS_Light } from "../elements/IS_Light.js";
import { IS_BufferCircle } from "../elements/IS_BufferCircle.js";
import { IS_BufferGeometry } from "../elements/IS_BufferGeometry.js";

// TODO: sort out addons with CDN: https://threejs.org/manual/#en/fundamentals <- at the botttom

export const IS_HSLVisualizer =
{
	visualize() {},

	initialize()
	{
		let bufferSources = [];

		let light = new IS_Light([0, 0, 2]);
		IS_Visualizer.addToScene(light.light);

		for(const [audioNodeUUID, audioNode] of Object.entries(IS.NodeRegistry._registry))
		{
			if(audioNode.isISBufferSource)
			{
				bufferSources.push(audioNode);
			}
		}

		this._createBufferCircles(bufferSources);
		this._createBufferGeometries(bufferSources);
	},

	_createBufferCircles(bufferSources)
	{
		let scaleArray = [0.6, 16, 0.4];
		let denominatorArray = [1, 2, 3];

		for(let bufferIndex = 0; bufferIndex < bufferSources.length; bufferIndex++)
		{
			let bufferSource = bufferSources[bufferIndex];

			let scaleIndex = Math.floor(scaleArray.length * (bufferIndex / bufferSources.length));
			let scaleFactor = scaleArray[scaleIndex];

			new IS_BufferCircle
			(
				bufferSource.buffer,
				bufferSource,
				scaleFactor / denominatorArray[bufferIndex % 3]
			);
		}
	},

	_createBufferGeometries(bufferSources)
	{
		let nCircles = 30;

		for(let bufferIndex = 0; bufferIndex < bufferSources.length; bufferIndex++)
		{
			let bufferSource = bufferSources[bufferIndex];
			let bufferArray = bufferSource.buffer.getChannelData(0);
			let nSamples = bufferArray.length;
			let circleNPoints = bufferArray.length / nCircles ;

			let bufferGeometry = new IS_BufferGeometry(THREE, bufferSource);

			for(let sampleIndex = 0; sampleIndex < nSamples; sampleIndex++)
			{
				let sampleValue = bufferArray[sampleIndex];

				let xPosition = Math.sin(2 * Math.PI * (sampleIndex / circleNPoints)) + sampleValue * 0.025;
				let yPosition = Math.cos(2 * Math.PI * (sampleIndex / circleNPoints)) + sampleValue * 0.025;
				let zPosition = 0;

				let position = [xPosition, yPosition, zPosition];

				bufferGeometry.createVertex(position, [0, 0, 1], [0, 0]);
			}

			bufferGeometry.createBufferGeometry();
			let shape = bufferGeometry.createInstance();

			let xScale = 1;
			let yScale = 1;
			let zScale = 1;

			shape.scale.set(xScale, yScale, zScale);
			shape.position.set(0, 0 , 0);

			IS_Visualizer.addToScene(shape);
		}
	}
}