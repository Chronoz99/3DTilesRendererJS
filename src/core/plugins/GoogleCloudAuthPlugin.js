import { GoogleCloudAuth } from '3d-tiles-renderer/core/plugins';
import { GoogleAttributionsManager } from './GoogleAttributionsManager.js';

const TILES_3D_API = 'https://tile.googleapis.com/v1/3dtiles/root.json';

export class GoogleCloudAuthPlugin {

	constructor( {
		apiToken,
		sessionOptions = null,
		autoRefreshToken = false,
		logoUrl = null,
		useRecommendedSettings = true,
	} ) {

		this.name = 'GOOGLE_CLOUD_AUTH_PLUGIN';

		this.apiToken = apiToken;
		this.useRecommendedSettings = useRecommendedSettings;
		this.logoUrl = logoUrl;

		this.auth = new GoogleCloudAuth( { apiToken, autoRefreshToken, sessionOptions } );
		this.tiles = null;

		this._visibilityChangeCallback = null;
		this._attributionsManager = new GoogleAttributionsManager();
		this._logoAttribution = {
			value: '',
			type: 'image',
			collapsible: false,
		};
		this._attribution = {
			value: '',
			type: 'string',
			collapsible: true,
		};

	}

	init( tiles ) {

		const { useRecommendedSettings, auth } = this;

		// reset the tiles in case this plugin was removed and re-added
		tiles.resetFailedTiles();

		if ( tiles.rootURL == null ) {

			tiles.rootURL = TILES_3D_API;

		}

		if ( ! auth.sessionOptions ) {

			auth.authURL = tiles.rootURL;

		}

		if ( useRecommendedSettings && ! auth.isMapTilesSession ) {

			// This plugin changes below values to be more efficient for the photorealistic tiles
			tiles.errorTarget = 20;

		}

		this.tiles = tiles;

		this._visibilityChangeCallback = ( { tile, visible } ) => {

			const copyright = tile.cached.metadata?.asset?.copyright || '';
			if ( visible ) {

				this._attributionsManager.addAttributions( copyright );

			} else {

				this._attributionsManager.removeAttributions( copyright );

			}

		};

		tiles.addEventListener( 'tile-visibility-change', this._visibilityChangeCallback );

	}

	loadRootTileset() {

		const tiles = this.tiles;

		// If cachedRootJson is provided, skip fetching and use the cached data
		if ( tiles.cachedRootJson ) {

			console.log( 'GoogleCloudAuthPlugin: Using cachedRootJson, skipping fetch' );

			// Process the cached JSON to extract session info if present
			this._processResponse( tiles.cachedRootJson );

			// Chain to the next plugin or base implementation
			return tiles.invokeOnePlugin( plugin => plugin !== this && plugin.loadRootTileset && plugin.loadRootTileset() );

		}

		// initialize href to resolve the root in case it's specified as a relative url
		let url = new URL( tiles.rootURL, location.href );
		tiles.invokeAllPlugins( plugin => url = plugin.preprocessURL ? plugin.preprocessURL( url, null ) : url );

		return tiles
			.invokeOnePlugin( plugin => plugin.fetchData && plugin.fetchData( url, tiles.fetchOptions ) )
			.then( res => res.json() )
			.then( json => {

				this._processResponse( json );

				// chain to the next plugin or base implementation
				return tiles.invokeOnePlugin( plugin => plugin !== this && plugin.loadRootTileset && plugin.loadRootTileset() );

			} );

	}

	_processResponse( json ) {

		// Extract the session token from the root JSON if not already set
		// The auth.fetch method normally does this, but when using cachedRootJson
		// we need to do it manually
		if ( this.auth.sessionToken === null && json ) {

			// Extract session token from the tile URIs (same logic as GoogleCloudAuth)
			const root = json.root;
			if ( root ) {

				const findSession = ( tile ) => {

					if ( tile.content && tile.content.uri ) {

						const [ , params ] = tile.content.uri.split( '?' );
						return new URLSearchParams( params ).get( 'session' );

					}
					if ( tile.children ) {

						for ( const child of tile.children ) {

							const session = findSession( child );
							if ( session ) return session;

						}

					}
					return null;

				};

				this.auth.sessionToken = findSession( root );

			} else if ( json.session ) {

				// 2D maps API format
				this.auth.sessionToken = json.session;

			}

		}

	}

	getAttributions( target ) {

		if ( this.tiles.visibleTiles.size > 0 ) {

			if ( this.logoUrl ) {

				this._logoAttribution.value = this.logoUrl;
				target.push( this._logoAttribution );

			}

			this._attribution.value = this._attributionsManager.toString();
			target.push( this._attribution );

		}

	}

	dispose() {

		this.tiles.removeEventListener( 'tile-visibility-change', this._visibilityChangeCallback );

	}

	async fetchData( uri, options ) {

		return this.auth.fetch( uri, options );

	}

}
