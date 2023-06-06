import { DebugTilesRenderer as TilesRenderer } from '../src/index.js';
import {
	Scene,
	DirectionalLight,
	AmbientLight,
	WebGLRenderer,
	PerspectiveCamera,
	Vector3,
	sRGBEncoding,
	Raycaster,
	Vector2,
	Box3,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { MapControls } from './src/lib/MapControls.js';
import { MapsTilesCredits } from './src/MapsTilesCredits.js';
import { GeoCoord } from './src/GeoCoord.js';
import * as GeoUtils from './src/GeoUtils.js';

const apiOrigin = 'https://tile.googleapis.com';

let camera, controls, scene, renderer, tiles, credits;
let statsContainer, stats;

const ellipsoid = GeoUtils.WGS84_ELLIPSOID;

const raycaster = new Raycaster();
raycaster.firstHitOnly = true;
const pointer = new Vector2();
const deltaTarget = new Vector3();
const geocoord = new GeoCoord();

const params = {

	'enableUpdate': true,
	'enableCacheDisplay': false,
	'enableRendererStats': false,

	'apiKey': 'put-your-api-key-here',
	'loadSiblings': true,
	'stopAtEmptyTiles': true,
	'resolutionScale': 1.0,

	'autoDisableRendererCulling': true,
	'displayActiveTiles': false,
	'displayBoxBounds': false,
	'displaySphereBounds': false,
	'displayRegionBounds': false,
	'reload': reinstantiateTiles,

};

init();
animate();

function setupTiles() {

	tiles.fetchOptions.mode = 'cors';

	// Note the DRACO compression files need to be supplied via an explicit source.
	// We use unpkg here but in practice should be provided by the application.
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath( 'https://unpkg.com/three@0.123.0/examples/js/libs/draco/gltf/' );

	const loader = new GLTFLoader( tiles.manager );
	loader.setDRACOLoader( dracoLoader );

	tiles.manager.addHandler( /\.gltf$/, loader );
	scene.add( tiles.group );

	tiles.setResolutionFromRenderer( camera, renderer );
	tiles.setCamera( camera );

}

function reinstantiateTiles() {

	if ( tiles ) {

		scene.remove( tiles.group );
		tiles.dispose();
		tiles = null;

	}

	const url = new URL( `${apiOrigin}/v1/3dtiles/root.json?key=${ params.apiKey }` );

	fetch( url, { mode: 'cors' } )
		.then( res => {

			if ( res.ok ) {

				return res.json();

			} else {

				return Promise.reject( new Error( `${res.status} : ${res.statusText}` ) );

			}

		} )
		.then( json => {

			if ( ! json.root ) {

				throw new Error( `malformed response: ${ json }` );

			}

			// TODO: See if there's a better way to retrieve the session id
			let uri;
			const toVisit = [ json.root ];
			while ( toVisit.length !== 0 ) {

				const curr = toVisit.pop();
				if ( curr.content && curr.content.uri ) {

					uri = new URL( `${ apiOrigin }${ curr.content.uri }` );
					uri.searchParams.append( 'key', params.apiKey );
					break;

				} else {

					toVisit.push( ...curr.children );

				}

			}

			if ( ! uri ) {

				throw new Error( `can't find session string in response: ${ json }` );

			}

			const session = uri.searchParams.get( 'session' );

			tiles = new TilesRenderer( url.toString() );
			tiles.preprocessURL = uri => {

				uri = new URL( uri );
				if ( /^http/.test( uri.protocol ) ) {

					uri.searchParams.append( 'session', session );
					uri.searchParams.append( 'key', params.apiKey );

				}
				return uri.toString();

			};

			credits = new MapsTilesCredits();
			tiles.onTileVisibilityChange = ( scene, tile, visible ) => {

				const copyright = tile.cached.metadata.asset.copyright || '';
				if ( visible ) credits.addCredits( copyright );
				else credits.removeCredits( copyright );


			};

			tiles.parseQueue.maxJobs = 5;
			tiles.downloadQueue.maxJobs = 50;
			tiles.lruCache.minSize = 3000;
			tiles.lruCache.maxSize = 5000;
			tiles.group.rotation.x = - Math.PI / 2;

			setupTiles();

		} )
		.catch( err => {

			console.error( 'Unable to get gmaps tileset:', err );

		} );

}

function init() {

	scene = new Scene();

	// primary camera view
	renderer = new WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x151c1f );
	renderer.outputEncoding = sRGBEncoding;

	document.body.appendChild( renderer.domElement );

	camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 160000000 );
	camera.position.set( 7326000, 10279000, - 823000 );

	// controls
	controls = new MapControls( camera, renderer.domElement );
	controls.minDistance = 1;
	controls.maxDistance = Infinity;
	controls.minPolarAngle = Math.PI / 4;
	controls.target.set( 0, 0, 1 );

	// lights
	const dirLight = new DirectionalLight( 0xffffff );
	dirLight.position.set( 1, 2, 3 );
	scene.add( dirLight );

	const ambLight = new AmbientLight( 0xffffff, 0.2 );
	scene.add( ambLight );

	reinstantiateTiles();

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );

	// GUI
	const gui = new GUI();
	gui.width = 300;

	const mapsOptions = gui.addFolder( 'GMaps' );
	mapsOptions.add( params, 'apiKey' );
	mapsOptions.add( params, 'reload' );
	mapsOptions.open();

	const tileOptions = gui.addFolder( 'Tiles Options' );
	tileOptions.add( params, 'loadSiblings' );
	tileOptions.add( params, 'stopAtEmptyTiles' );

	const debug = gui.addFolder( 'Debug Options' );
	debug.add( params, 'displayBoxBounds' );
	debug.add( params, 'displaySphereBounds' );
	debug.add( params, 'displayRegionBounds' );

	const exampleOptions = gui.addFolder( 'Example Options' );
	exampleOptions.add( params, 'enableUpdate' ).onChange( v => {

		tiles.parseQueue.autoUpdate = v;
		tiles.downloadQueue.autoUpdate = v;

		if ( v ) {

			tiles.parseQueue.scheduleJobRun();
			tiles.downloadQueue.scheduleJobRun();

		}

	} );
	exampleOptions.add( params, 'enableCacheDisplay' );
	exampleOptions.add( params, 'enableRendererStats' );

	gui.open();

	statsContainer = document.createElement( 'div' );
	document.getElementById( 'info' ).appendChild( statsContainer );

	// Stats
	stats = new Stats();
	stats.showPanel( 0 );
	document.body.appendChild( stats.dom );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.updateProjectionMatrix();
	renderer.setPixelRatio( window.devicePixelRatio * params.resolutionScale );

}

function updateControls() {

	// TODO: add tilting of the camera - keep a frame at the surface to retain the camera orientation

	const raycaster = new Raycaster();
	raycaster.ray.origin.copy( controls.target ).normalize().multiplyScalar( GeoUtils.WGS84_RADIUS * 1.5 );
	raycaster.ray.direction.copy( raycaster.ray.origin ).normalize().multiplyScalar( - 1 );
	raycaster.firstHitOnly = true;

	const hit = raycaster.intersectObject( scene, true )[ 0 ];
	if ( hit ) {

		controls.target.copy( hit.point );

	} else {

		controls.target.normalize().multiplyScalar( GeoUtils.WGS84_RADIUS );

	}
	controls.panPlane.copy( controls.target ).normalize();

	const dist = camera.position.length();
	camera.position.copy( controls.target ).normalize().multiplyScalar( dist );
	camera.lookAt( controls.target );
	controls.update();

	const box = new Box3();
	tiles.getBounds( box );

	camera.far = dist;
	camera.near = Math.max( 1, dist - Math.max( ...box.min, ...box.max ) );
	camera.updateProjectionMatrix();

}

function animate() {

	requestAnimationFrame( animate );

	if ( ! tiles ) return;

	updateControls();

	// update options
	tiles.loadSiblings = params.loadSiblings;
	tiles.stopAtEmptyTiles = params.stopAtEmptyTiles;
	tiles.displayActiveTiles = params.displayActiveTiles;
	tiles.autoDisableRendererCulling = params.autoDisableRendererCulling;
	tiles.displayBoxBounds = params.displayBoxBounds;
	tiles.displaySphereBounds = params.displaySphereBounds;
	tiles.displayRegionBounds = params.displayRegionBounds;

	tiles.setResolutionFromRenderer( camera, renderer );
	tiles.setCamera( camera );

	// update tiles
	window.tiles = tiles;
	if ( params.enableUpdate ) {

		camera.updateMatrixWorld();
		tiles.update();

	}

	render();
	stats.update();

}

function render() {

	// render primary view
	renderer.render( scene, camera );

	const cacheFullness = tiles.lruCache.itemList.length / tiles.lruCache.maxSize;
	let str = `Downloading: ${ tiles.stats.downloading } Parsing: ${ tiles.stats.parsing } Visible: ${ tiles.group.children.length - 2 }`;

	if ( params.enableCacheDisplay ) {

		const geomSet = new Set();
		tiles.traverse( tile => {

			const scene = tile.cached.scene;
			if ( scene ) {

				scene.traverse( c => {

					if ( c.geometry ) {

						geomSet.add( c.geometry );

					}

				} );

			}

		} );

		let count = 0;
		geomSet.forEach( g => {

			count += BufferGeometryUtils.estimateBytesUsed( g );

		} );
		str += `<br/>Cache: ${ ( 100 * cacheFullness ).toFixed( 2 ) }% ~${ ( count / 1000 / 1000 ).toFixed( 2 ) }mb`;

	}

	if ( params.enableRendererStats ) {

		const memory = renderer.info.memory;
		const programCount = renderer.info.programs.length;
		str += `<br/>Geometries: ${ memory.geometries } Textures: ${ memory.textures } Programs: ${ programCount }`;

	}

	if ( statsContainer.innerHTML !== str ) {

		statsContainer.innerHTML = str;

	}

	if ( credits ) {

		const mat = tiles.group.matrixWorld.clone().invert();
		const vec = camera.position.clone().applyMatrix4( mat );
		document.getElementById( 'credits' ).innerText = geocoord.fromVector3( vec ).toString() + '\n' + credits.getCredits();

	}

}