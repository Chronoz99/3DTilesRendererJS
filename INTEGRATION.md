# 3DTilesRendererJS Fork - Root Tileset Caching Integration Guide

This fork of [NASA-AMMOS/3DTilesRendererJS](https://github.com/NASA-AMMOS/3DTilesRendererJS) adds support for **pre-caching the root tileset JSON**. This optimization allows your backend to fetch and cache the root `tileset.json` (or Google's `root.json`), eliminating the initial network request from the frontend and significantly improving perceived load times.

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Installation](#installation)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Integration](#frontend-integration)
   - [React Three Fiber (R3F)](#react-three-fiber-r3f)
   - [Vanilla Three.js](#vanilla-threejs)
6. [Google Photorealistic 3D Tiles](#google-photorealistic-3d-tiles)
7. [API Reference](#api-reference)
8. [Best Practices](#best-practices)

---

## Overview

When loading 3D Tiles, the renderer must first fetch the root `tileset.json` to understand the tile hierarchy. For services like Google's Photorealistic 3D Tiles, this initial request can add latency to your application's startup.

This fork introduces a `cachedRootJson` parameter that allows you to:

1. **Pre-fetch** the root tileset JSON on your backend
2. **Cache** it (in Redis, memory, or any caching layer)
3. **Inject** it directly into the renderer, bypassing the initial fetch

### Benefits

- ⚡ **Faster Initial Load**: Skip the roundtrip to fetch `root.json`
- 🔄 **Backend Control**: Your server manages API keys and caching strategies
- 🔒 **Security**: Keep API keys on the server side
- 📊 **Analytics**: Track and optimize tileset usage from your backend

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           WITHOUT CACHING                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Frontend                           Google/Tile Server                  │
│     │                                      │                            │
│     │──── 1. Fetch root.json ─────────────►│                            │
│     │◄─── 2. Return root.json ─────────────│                            │
│     │                                      │                            │
│     │──── 3. Fetch child tiles ───────────►│                            │
│     │◄─── 4. Return tiles ─────────────────│                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                            WITH CACHING                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Frontend              Your Backend              Google/Tile Server     │
│     │                       │                           │               │
│     │── 1. Get cached ─────►│                           │               │
│     │   root.json           │                           │               │
│     │◄─ 2. Return cached ───│ (from Redis/memory)       │               │
│     │   root.json           │                           │               │
│     │                       │                           │               │
│     │───────── 3. Fetch child tiles ───────────────────►│               │
│     │◄──────── 4. Return tiles ─────────────────────────│               │
│                                                                         │
│  * Backend periodically refreshes cache from tile server                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Installation

### Option 1: Install from GitHub (Recommended)

```bash
# Using npm
npm install github:Chronoz99/3DTilesRendererJS#master

# Using yarn
yarn add github:Chronoz99/3DTilesRendererJS#master

# Using pnpm
pnpm add github:Chronoz99/3DTilesRendererJS#master
```

### Option 2: Use as a Git Submodule

```bash
git submodule add https://github.com/Chronoz99/3DTilesRendererJS.git lib/3d-tiles-renderer
```

Then update your `package.json`:

```json
{
  "dependencies": {
    "3d-tiles-renderer": "file:./lib/3d-tiles-renderer"
  }
}
```

### Option 3: Link Locally (for development)

```bash
# In your fork directory
cd /path/to/3DTilesRendererJS
npm link

# In your application directory
cd /path/to/your-app
npm link 3d-tiles-renderer
```

---

## Backend Implementation

Your backend should:

1. Fetch the root tileset JSON from the tile server
2. Cache it with an appropriate TTL (time-to-live)
3. Expose an API endpoint for the frontend to retrieve it

### Example: Node.js/Express Backend

```typescript
// services/tilesetCache.service.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);
const CACHE_TTL_SECONDS = 3600; // 1 hour

interface CachedTileset {
  json: object;
  fetchedAt: number;
}

export class TilesetCacheService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  }

  /**
   * Get the cached root tileset JSON for Google Photorealistic 3D Tiles
   */
  async getGoogleRootTileset(): Promise<object | null> {
    const cacheKey = 'google:3dtiles:root';

    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed: CachedTileset = JSON.parse(cached);
      return parsed.json;
    }

    // Fetch from Google
    const url = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch root tileset: ${response.status}`);
      }

      const json = await response.json();

      // Cache the result
      const cacheData: CachedTileset = {
        json,
        fetchedAt: Date.now(),
      };
      
      await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(cacheData));

      return json;
    } catch (error) {
      console.error('Error fetching Google root tileset:', error);
      return null;
    }
  }

  /**
   * Get cached root tileset for a custom tileset URL
   */
  async getCustomRootTileset(tilesetUrl: string): Promise<object | null> {
    const cacheKey = `tileset:${Buffer.from(tilesetUrl).toString('base64')}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached).json;
    }

    try {
      const response = await fetch(tilesetUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch tileset: ${response.status}`);
      }

      const json = await response.json();
      
      await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify({
        json,
        fetchedAt: Date.now(),
      }));

      return json;
    } catch (error) {
      console.error('Error fetching tileset:', error);
      return null;
    }
  }
}
```

### API Endpoint

```typescript
// routes/tiles.routes.ts
import { Router } from 'express';
import { TilesetCacheService } from '../services/tilesetCache.service';

const router = Router();
const cacheService = new TilesetCacheService();

/**
 * GET /api/tiles/google/root
 * Returns the cached Google Photorealistic 3D Tiles root.json
 */
router.get('/google/root', async (req, res) => {
  try {
    const rootJson = await cacheService.getGoogleRootTileset();
    
    if (!rootJson) {
      return res.status(503).json({ error: 'Unable to fetch tileset' });
    }

    // Set cache headers for CDN/browser caching
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(rootJson);
  } catch (error) {
    console.error('Error serving root tileset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/tiles/custom/root
 * Returns a cached custom tileset root
 */
router.get('/custom/root', async (req, res) => {
  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const rootJson = await cacheService.getCustomRootTileset(url);
    
    if (!rootJson) {
      return res.status(503).json({ error: 'Unable to fetch tileset' });
    }

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(rootJson);
  } catch (error) {
    console.error('Error serving root tileset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

---

## Frontend Integration

### React Three Fiber (R3F)

The R3F `TilesRenderer` component now accepts a `cachedRootJson` prop:

```tsx
import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { TilesRenderer, TilesPlugin } from '3d-tiles-renderer/r3f';
import {
  GoogleCloudAuthPlugin,
  TileCompressionPlugin,
  TilesFadePlugin,
  GLTFExtensionsPlugin,
  ReorientationPlugin,
} from '3d-tiles-renderer/plugins';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// Create DRACO loader once
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

interface Maps3DViewerProps {
  apiKey: string;
  center: { lat: number; lon: number };
}

export function Maps3DViewer({ apiKey, center }: Maps3DViewerProps) {
  const [cachedRootJson, setCachedRootJson] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cached root JSON from your backend
  useEffect(() => {
    async function fetchCachedRoot() {
      try {
        const response = await fetch('/api/tiles/google/root');
        if (response.ok) {
          const json = await response.json();
          setCachedRootJson(json);
        }
      } catch (error) {
        console.warn('Failed to fetch cached root, will fetch directly:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCachedRoot();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Canvas camera={{ position: [0, 500, 500], fov: 60, near: 0.1, far: 200000 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1000, 2000, 1000]} intensity={1.5} />

      {/* 
        Pass cachedRootJson to skip the initial root.json fetch.
        If cachedRootJson is null, it will fetch normally.
      */}
      <TilesRenderer cachedRootJson={cachedRootJson}>
        <TilesPlugin
          plugin={GoogleCloudAuthPlugin}
          args={{
            apiToken: apiKey,
            autoRefreshToken: true,
            useRecommendedSettings: true,
          }}
        />
        <TilesPlugin plugin={TileCompressionPlugin} />
        <TilesPlugin plugin={TilesFadePlugin} />
        <TilesPlugin plugin={GLTFExtensionsPlugin} dracoLoader={dracoLoader} />
        <TilesPlugin
          plugin={ReorientationPlugin}
          args={{
            lat: center.lat * (Math.PI / 180),
            lon: center.lon * (Math.PI / 180),
            height: 0,
          }}
        />
      </TilesRenderer>
    </Canvas>
  );
}
```

### Vanilla Three.js

For non-React applications, use the `TilesRenderer` class directly:

```typescript
import { TilesRenderer } from '3d-tiles-renderer';
import { GoogleCloudAuthPlugin, TileCompressionPlugin } from '3d-tiles-renderer/plugins';
import * as THREE from 'three';

async function initTilesRenderer(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  apiKey: string
) {
  // Fetch cached root JSON from your backend
  let cachedRootJson: object | null = null;
  
  try {
    const response = await fetch('/api/tiles/google/root');
    if (response.ok) {
      cachedRootJson = await response.json();
      console.log('Using cached root JSON');
    }
  } catch (error) {
    console.warn('Failed to fetch cached root, will fetch directly:', error);
  }

  // Create renderer with cached root JSON
  // The second parameter is the cached root JSON - if provided, it skips the fetch
  const tiles = new TilesRenderer(null, cachedRootJson);

  // Register the Google Cloud Auth plugin
  // This will set the rootURL automatically if not provided
  tiles.registerPlugin(new GoogleCloudAuthPlugin({
    apiToken: apiKey,
    autoRefreshToken: true,
    useRecommendedSettings: true,
  }));

  tiles.registerPlugin(new TileCompressionPlugin());

  // Set up camera and resolution
  tiles.setCamera(camera);
  tiles.setResolutionFromRenderer(camera, renderer);

  // Add to scene
  tiles.group.rotation.x = -Math.PI / 2;
  scene.add(tiles.group);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    tiles.update();
    renderer.render(scene, camera);
  }

  animate();

  return tiles;
}
```

---

## Google Photorealistic 3D Tiles

When using Google's Photorealistic 3D Tiles, the `GoogleCloudAuthPlugin` handles:

- Authentication with your API key
- Session management
- URL preprocessing for tile requests

The `cachedRootJson` optimization works seamlessly with this plugin:

```typescript
// The plugin will use the cached root JSON instead of fetching it
tiles.registerPlugin(new GoogleCloudAuthPlugin({
  apiToken: apiKey,
  autoRefreshToken: true,
}));
```

### Important Notes

1. **API Key Security**: When using the caching approach, your API key stays on the backend. The frontend only needs the API key for subsequent tile requests (which still go through Google's servers).

2. **Session Management**: The `GoogleCloudAuthPlugin` extracts the session token from child tiles. The cached root JSON provides the initial tile hierarchy, and the plugin handles authentication for all subsequent requests.

3. **Cache Invalidation**: Google's root.json rarely changes, but you should implement a reasonable TTL (1-24 hours) to handle any updates.

---

## API Reference

### TilesRendererBase Constructor

```typescript
constructor(url?: string | null, cachedRootJson?: object | null)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | `string \| null` | `null` | The URL of the root tileset. Can be `null` if using a plugin that provides the URL. |
| `cachedRootJson` | `object \| null` | `null` | Pre-fetched root tileset JSON. If provided, skips the initial fetch. |

### TilesRenderer (R3F Component)

```tsx
<TilesRenderer
  url?: string
  cachedRootJson?: object | null
  enabled?: boolean
  // ... other TilesRenderer options
>
  {/* TilesPlugin components */}
</TilesRenderer>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | `undefined` | The URL of the root tileset |
| `cachedRootJson` | `object \| null` | `null` | Pre-fetched root tileset JSON |
| `enabled` | `boolean` | `true` | Whether to enable tile updates |

---

## Best Practices

### 1. Graceful Fallback

Always implement a fallback in case the cached root cannot be fetched:

```typescript
const [cachedRoot, setCachedRoot] = useState<object | null>(null);

useEffect(() => {
  fetch('/api/tiles/google/root')
    .then(res => res.ok ? res.json() : null)
    .then(setCachedRoot)
    .catch(() => setCachedRoot(null)); // Falls back to direct fetch
}, []);

// TilesRenderer will fetch directly if cachedRootJson is null
<TilesRenderer cachedRootJson={cachedRoot}>
```

### 2. Cache Warming

Pre-warm your cache on server startup:

```typescript
// server.ts
import { TilesetCacheService } from './services/tilesetCache.service';

const cacheService = new TilesetCacheService();

// Warm cache on startup
cacheService.getGoogleRootTileset()
  .then(() => console.log('Google tiles cache warmed'))
  .catch(console.error);
```

### 3. CDN Caching

Add CDN-friendly cache headers to reduce load on your backend:

```typescript
res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
```

### 4. Error Monitoring

Log cache misses and errors for monitoring:

```typescript
const rootJson = await cacheService.getGoogleRootTileset();
if (!rootJson) {
  logger.warn('Cache miss for Google root tileset');
  // Optionally track in metrics
  metrics.increment('tileset.cache.miss');
}
```

### 5. Version Pinning

Since this is a fork, pin to a specific commit in production:

```json
{
  "dependencies": {
    "3d-tiles-renderer": "github:Chronoz99/3DTilesRendererJS#<commit-hash>"
  }
}
```

---

## Migration from Official Package

If you're currently using the official `3d-tiles-renderer` package:

1. **Update package.json**:
   ```diff
   - "3d-tiles-renderer": "^0.4.18"
   + "3d-tiles-renderer": "github:Chronoz99/3DTilesRendererJS#master"
   ```

2. **Install**:
   ```bash
   npm install
   ```

3. **Update imports** (no changes needed - the API is backwards compatible):
   ```typescript
   // These imports work exactly the same
   import { TilesRenderer } from '3d-tiles-renderer';
   import { TilesRenderer as TilesRendererComponent } from '3d-tiles-renderer/r3f';
   ```

4. **Add caching** (optional enhancement):
   ```tsx
   // Before: No caching
   <TilesRendererComponent>

   // After: With caching
   <TilesRendererComponent cachedRootJson={cachedRootJson}>
   ```

The library is **fully backwards compatible**. If you don't provide `cachedRootJson`, it behaves exactly like the official package.

---

## Troubleshooting

### Cache Not Working

1. Verify your backend endpoint returns valid JSON
2. Check browser Network tab for `/api/tiles/google/root` response
3. Ensure `cachedRootJson` is not `undefined` (use `null` for no cache)

### Tiles Not Loading

1. Confirm the `GoogleCloudAuthPlugin` has a valid API key
2. Check console for authentication errors
3. Verify the cached JSON structure matches Google's `root.json` format

### TypeScript Errors

Ensure you're using the correct types:

```typescript
import type { TilesRenderer } from '3d-tiles-renderer';

const cachedJson: object | null = await fetchCachedRoot();
```

---

## Contributing

To contribute to this fork:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

This fork maintains the same [Apache-2.0 License](./LICENSE) as the original NASA-AMMOS/3DTilesRendererJS project.
