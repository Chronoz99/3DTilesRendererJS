import { TilesRendererBase } from '../../src/core/renderer';
import { GoogleCloudAuthPlugin } from '../../src/core/plugins/GoogleCloudAuthPlugin.js';

describe( 'TilesRendererBase', () => {

	afterEach( () => {

		vi.unstubAllGlobals();

	} );

	it( 'should unregister plugin by name', () => {

		const renderer = new TilesRendererBase();

		renderer.registerPlugin( { name: 'test' } );

		expect( renderer.unregisterPlugin( 'test' ) ).toBe( true );

	} );

	it( 'should preprocess newly appended children even if earlier children were already processed', () => {

		const renderer = new TilesRendererBase();
		const processedChild = { children: [] };
		const unprocessedChild = { children: [] };
		const parent = {
			children: [ processedChild, unprocessedChild ],
		};

		renderer.preprocessNode( parent, '', null );
		renderer.preprocessNode( processedChild, '', parent );

		expect( processedChild.traversal ).toBeDefined();
		expect( unprocessedChild.traversal ).toBeUndefined();

		renderer.ensureChildrenArePreprocessed( parent, true );

		expect( unprocessedChild.traversal ).toBeDefined();
		expect( unprocessedChild.parent ).toBe( parent );

	} );

	it( 'should use a cached Google root without fetching and preserve the session token', async () => {

		vi.stubGlobal( 'window', { location: { href: 'https://studio.example.com/' } } );
		const fetch = vi.fn();
		vi.stubGlobal( 'fetch', fetch );

		const cachedRootJson = {
			asset: { version: '1.0' },
			geometricError: 100,
			root: {
				boundingVolume: { sphere: [ 0, 0, 0, 1 ] },
				geometricError: 0,
				refine: 'REPLACE',
				content: { uri: 'tile.glb?session=CACHED_SESSION' },
				children: [],
			},
		};
		const renderer = new TilesRendererBase( null, cachedRootJson );
		const authPlugin = new GoogleCloudAuthPlugin( {
			apiToken: 'TEST_KEY',
			useRecommendedSettings: false,
		} );
		renderer.registerPlugin( authPlugin );

		const loadedRoot = await renderer.invokeOnePlugin( plugin => plugin.loadRootTileset?.() );

		expect( loadedRoot ).toBe( cachedRootJson );
		expect( authPlugin.auth.sessionToken ).toBe( 'CACHED_SESSION' );
		expect( fetch ).not.toHaveBeenCalled();

		renderer.unregisterPlugin( authPlugin );

	} );

} );
