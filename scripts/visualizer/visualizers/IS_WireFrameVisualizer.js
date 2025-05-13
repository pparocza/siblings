import * as THREE from "https://cdn.skypack.dev/three@0.152.0";

export const IS_WireFrameVisualizer =
{
	visualize()
	{
		let geo = new THREE.IcosahedronGeometry( 20, 1 );

		const geometry = new THREE.WireframeGeometry2( geo );

		let matLine = new THREE.LineMaterial
		(
			{
				color: 0x4080ff,
				linewidth: 5, // in pixels
				dashed: false
			}
		);

		wireframe = new Wireframe( geometry, matLine );
		wireframe.computeLineDistances();
		wireframe.scale.set( 1, 1, 1 );
		scene.add( wireframe );


		// Line ( THREE.WireframeGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE

		geo = new THREE.WireframeGeometry( geo );

		matLineBasic = new THREE.LineBasicMaterial( { color: 0x4080ff } );
		matLineDashed = new THREE.LineDashedMaterial( { scale: 2, dashSize: 1, gapSize: 1 } );

		wireframe1 = new THREE.LineSegments( geo, matLineBasic );
		wireframe1.computeLineDistances();
		wireframe1.visible = false;
		scene.add( wireframe1 );

		//

		window.addEventListener( 'resize', onWindowResize );
		onWindowResize();

		stats = new Stats();
		document.body.appendChild( stats.dom );

		initGui();
	}
}