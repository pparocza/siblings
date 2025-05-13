// https://threejs.org/examples/?q=line#svg_lines
import * as THREE from "https://cdn.skypack.dev/three@0.152.0";
import { IS_Visualizer } from "../IS_Visualizer.js";

export const IS_LineVisualizer =
{
	visualize()
	{
		const vertices = [];
		const divisions = 50;

		for ( let i = 0; i <= divisions; i ++ ) {

			const v = ( i / divisions ) * ( Math.PI * 2 );

			const x = Math.sin( v );
			const z = Math.cos( v );

			vertices.push( x, 0, z );

		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

		//

		for ( let i = 1; i <= 3; i ++ ) {

			const material = new THREE.LineBasicMaterial( {
				color: Math.random() * 0xffffff,
				linewidth: 10
			} );
			const line = new THREE.Line( geometry, material );
			line.scale.setScalar( i / 3 );
			IS_Visualizer.addToScene( line );

		}

		const material = new THREE.LineDashedMaterial( {
			color: 'blue',
			linewidth: 1,
			dashSize: 10,
			gapSize: 10
		} );

		const line = new THREE.Line( geometry, material );
		line.scale.setScalar( 2 );
		IS_Visualizer.addToScene( line );
	},
}