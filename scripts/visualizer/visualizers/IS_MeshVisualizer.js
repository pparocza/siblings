import * as THREE from "https://cdn.skypack.dev/three@0.152.0";
import { SIBLING_CONTEXT } from "../IS_VisualizerContext.js";
import { IS_Visualizer } from "../IS_Visualizer.js";

// https://threejs.org/examples/#webgl_interactive_raycasting_points

const pointer = new THREE.Vector2();

let intersection = null;
const spheresIndex = 0;
let clock = null;
let toggle = 0;

const spheres = [];

const threshold = 0.1;
const pointSize = 0.05;
const width = 80;
const length = 160;
const rotateY = new THREE.Matrix4().makeRotationY(0.005);

export class IS_MeshVisualizer
{
	constructor() {}

	visualize()
	{
		let networkRegistry = SIBLING_CONTEXT.NetworkRegistry;

		console.log(width);

		const pcBuffer = generatePointcloud(width, length);
		pcBuffer.scale.set( 5, 10, 10 );
		pcBuffer.position.set( 0, 0, 0 );
		IS_Visualizer.addToScene(pcBuffer);

		for(let networkIndex = 0; networkIndex < networkRegistry.nNetworks; networkIndex++)
		{
			let iSNetwork = networkRegistry.getNetwork(networkIndex);
		}
	};
}

function generatePointcloud(color, width, length)
{
	const geometry = generatePointCloudGeometry(color, width, length);

	const material = new THREE.PointsMaterial
	(
		{
			size: pointSize, vertexColors: true
		}
	);

	return new THREE.Points(geometry, material);
}

function generatePointCloudGeometry(width, length)
{
	const geometry = new THREE.BufferGeometry();
	let compBuffer = [];

	for(const [uuid, node] of Object.entries(SIBLING_CONTEXT.NodeRegistry._registry))
	{
		if(node.isISBufferSource)
		{
			for(let channelIndex = 0; channelIndex < node.buffer.numberOfChannels; channelIndex++)
			{
				// console.log(node.buffer.getChannelData(channelIndex));
				compBuffer.push(...node.buffer.getChannelData(channelIndex));
			}
		}
	}

	const numPoints = width * length;

	const positions = new Float32Array( numPoints * 3 );
	const colors = new Float32Array( numPoints * 3 );
	let color = null;

	let k = 0;

	for ( let i = 0; i < width; i++ )
	{
		for ( let j = 0; j < length; j ++ )
		{
			const u = i / width;
			const v = j / length;
			const x = u - 0.5;
			const y = compBuffer[j] / 20; // ( Math.cos( u * Math.PI * 4 ) + Math.sin( v * Math.PI * 8 ) ) / 20;
			const z = v - 0.5;

			positions[ 3 * k ] = x;
			positions[ 3 * k + 1 ] = y;
			positions[ 3 * k + 2 ] = z;

			if (i + j / numPoints < 0.33)
			{
				color = new THREE.Color(0, 0, 1);
			}
			else if(i + j / numPoints >= 0.33 && i + j / numPoints < 0.66)
			{
				color = new THREE.Color(1, 0, 0);
			}
			else if(i + j / numPoints > 0.66)
			{
				color = new THREE.Color(0, 1, 0);
			}

			const intensity = ( y + 0.1 ) * 5;
			colors[ 3 * k ] = color.r * intensity;
			colors[ 3 * k + 1 ] = color.g * intensity;
			colors[ 3 * k + 2 ] = color.b * intensity;

			k ++;
		}
	}

	geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	geometry.computeBoundingBox();

	return geometry;
}