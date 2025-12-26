import { F as y, b as v, U as T, L as ee, f as A, a as w, Q as L, P as B } from "./constants-BuP7M5oB.js";
import { e as ge, c as Te, d as me, W as be } from "./constants-BuP7M5oB.js";
import { t as te, c as H, L as P, r as S, g as se } from "./LoaderBase-CfTLVHyZ.js";
import { a as ve, T as Se } from "./LoaderBase-CfTLVHyZ.js";
function Q(n) {
  if (!n)
    return null;
  let e = n.length;
  const t = n.indexOf("?"), r = n.indexOf("#");
  t !== -1 && (e = Math.min(e, t)), r !== -1 && (e = Math.min(e, r));
  const s = n.lastIndexOf(".", e), o = n.lastIndexOf("/", e), a = n.indexOf("://");
  return a !== -1 && a + 2 === o || s === -1 || s < o ? null : n.substring(s + 1, e) || null;
}
const U = {
  inView: !1,
  error: 1 / 0,
  distanceFromCamera: 1 / 0
}, J = !0;
function j(n) {
  return n === v || n === y;
}
function m(n, e) {
  return n.__lastFrameVisited === e && n.__used;
}
function O(n) {
  return n.__childrenProcessed === n.children.length;
}
function x(n) {
  return n.__hasUnrenderableContent || n.parent && n.parent.geometricError < n.geometricError;
}
function N(n, e) {
  n.__lastFrameVisited !== e.frameCount && (n.__lastFrameVisited = e.frameCount, n.__used = !1, n.__inFrustum = !1, n.__isLeaf = !1, n.__visible = !1, n.__active = !1, n.__error = 1 / 0, n.__distanceFromCamera = 1 / 0, n.__allChildrenReady = !1, e.calculateTileViewError(n, U), n.__inFrustum = U.inView, n.__error = U.error, n.__distanceFromCamera = U.distanceFromCamera);
}
function D(n, e, t = !1) {
  if (e.ensureChildrenArePreprocessed(n), N(n, e), k(n, e, t), x(n) && O(n)) {
    const r = n.children;
    for (let s = 0, o = r.length; s < o; s++)
      D(r[s], e, t);
  }
}
function W(n, e) {
  if (e.ensureChildrenArePreprocessed(n), m(n, e.frameCount) && (n.__hasContent && e.queueTileForDownload(n), O(n))) {
    const t = n.children;
    for (let r = 0, s = t.length; r < s; r++)
      W(t[r], e);
  }
}
function k(n, e, t = !1) {
  n.__used || (t || (n.__used = !0, e.stats.used++), e.markTileUsed(n), n.__inFrustum === !0 && e.stats.inFrustum++);
}
function ne(n, e) {
  return !(n.__error <= e.errorTarget && !x(n) || e.maxDepth > 0 && n.__depth + 1 >= e.maxDepth || !O(n));
}
function z(n, e) {
  if (e.ensureChildrenArePreprocessed(n), N(n, e), !n.__inFrustum)
    return;
  if (!ne(n, e)) {
    k(n, e);
    return;
  }
  let t = !1, r = !1;
  const s = n.children;
  for (let o = 0, a = s.length; o < a; o++) {
    const l = s[o];
    z(l, e), t = t || m(l, e.frameCount), r = r || l.__inFrustum;
  }
  if (n.refine === "REPLACE" && !r && s.length !== 0) {
    n.__inFrustum = !1;
    for (let o = 0, a = s.length; o < a; o++)
      D(s[o], e, !0);
    return;
  }
  if (k(n, e), n.refine === "REPLACE" && (t && n.__depth !== 0 || J))
    for (let o = 0, a = s.length; o < a; o++)
      D(s[o], e);
}
function K(n, e) {
  const t = e.frameCount;
  if (!m(n, t))
    return;
  const r = n.children;
  let s = !1;
  for (let o = 0, a = r.length; o < a; o++) {
    const l = r[o];
    s = s || m(l, t);
  }
  if (!s)
    n.__isLeaf = !0;
  else {
    let o = !0;
    for (let a = 0, l = r.length; a < l; a++) {
      const i = r[a];
      if (K(i, e), m(i, t)) {
        const h = !x(i);
        let c = !i.__hasContent || i.__hasRenderableContent && j(i.__loadingState) || i.__hasUnrenderableContent && i.__loadingState === y;
        c = h && c || i.__allChildrenReady, o = o && c;
      }
    }
    n.__allChildrenReady = o;
  }
}
function Y(n, e) {
  const t = e.stats;
  if (!m(n, e.frameCount))
    return;
  if (n.__isLeaf) {
    n.__loadingState === v ? (n.__inFrustum && (n.__visible = !0, t.visible++), n.__active = !0, t.active++) : n.__hasContent && e.queueTileForDownload(n);
    return;
  }
  const r = n.children, s = n.__hasContent, o = j(n.__loadingState) && s, a = (e.errorTarget + 1) * e.errorThreshold, l = n.__error <= a, i = n.refine === "ADD", h = n.__allChildrenReady || n.__depth === 0 && !J;
  if (s && (l || i) && e.queueTileForDownload(n), (l && o && !h || o && i) && (n.__inFrustum && (n.__visible = !0, t.visible++), n.__active = !0, t.active++), !i && l && !h)
    for (let c = 0, u = r.length; c < u; c++) {
      const f = r[c];
      m(f, e.frameCount) && W(f, e);
    }
  else
    for (let c = 0, u = r.length; c < u; c++)
      Y(r[c], e);
}
function X(n, e) {
  const t = m(n, e.frameCount);
  if (t || n.__usedLastFrame) {
    let r = !1, s = !1;
    t ? (r = n.__active, e.displayActiveTiles ? s = n.__active || n.__visible : s = n.__visible) : N(n, e), n.__hasRenderableContent && n.__loadingState === v && (n.__wasSetActive !== r && e.invokeOnePlugin((a) => a.setTileActive && a.setTileActive(n, r)), n.__wasSetVisible !== s && e.invokeOnePlugin((a) => a.setTileVisible && a.setTileVisible(n, s))), n.__wasSetActive = r, n.__wasSetVisible = s, n.__usedLastFrame = t;
    const o = n.children;
    for (let a = 0, l = o.length; a < l; a++) {
      const i = o[a];
      X(i, e);
    }
  }
}
function re(n) {
  let e = null;
  return () => {
    e === null && (e = requestAnimationFrame(() => {
      e = null, n();
    }));
  };
}
const M = Symbol("PLUGIN_REGISTERED"), $ = (n, e) => {
  const t = n.priority || 0, r = e.priority || 0;
  return t !== r ? t > r ? 1 : -1 : n.__used !== e.__used ? n.__used ? 1 : -1 : n.__error !== e.__error ? n.__error > e.__error ? 1 : -1 : n.__distanceFromCamera !== e.__distanceFromCamera ? n.__distanceFromCamera > e.__distanceFromCamera ? -1 : 1 : n.__depthFromRenderedParent !== e.__depthFromRenderedParent ? n.__depthFromRenderedParent > e.__depthFromRenderedParent ? -1 : 1 : 0;
}, oe = (n, e) => {
  const t = n.priority || 0, r = e.priority || 0;
  return t !== r ? t > r ? 1 : -1 : n.__lastFrameVisited !== e.__lastFrameVisited ? n.__lastFrameVisited > e.__lastFrameVisited ? -1 : 1 : n.__depthFromRenderedParent !== e.__depthFromRenderedParent ? n.__depthFromRenderedParent > e.__depthFromRenderedParent ? 1 : -1 : n.__loadingState !== e.__loadingState ? n.__loadingState > e.__loadingState ? -1 : 1 : n.__hasUnrenderableContent !== e.__hasUnrenderableContent ? n.__hasUnrenderableContent ? -1 : 1 : n.__error !== e.__error ? n.__error > e.__error ? -1 : 1 : 0;
};
class ce {
  get root() {
    const e = this.rootTileset;
    return e ? e.root : null;
  }
  get rootTileSet() {
    return console.warn('TilesRenderer: "rootTileSet" has been deprecated. Use "rootTileset" instead.'), this.rootTileset;
  }
  get loadProgress() {
    const { stats: e, isLoading: t } = this, r = e.queued + e.downloading + e.parsing, s = e.inCacheSinceLoad + (t ? 1 : 0);
    return s === 0 ? 1 : 1 - r / s;
  }
  get errorThreshold() {
    return this._errorThreshold;
  }
  set errorThreshold(e) {
    console.warn('TilesRenderer: The "errorThreshold" option has been deprecated.'), this._errorThreshold = e;
  }
  constructor(e = null, t = null) {
    this.rootLoadingState = T, this.rootTileset = null, this.rootURL = e, this.cachedRootJson = t, this.fetchOptions = {}, this.plugins = [], this.queuedTiles = [], this.cachedSinceLoadComplete = /* @__PURE__ */ new Set(), this.isLoading = !1;
    const r = new ee();
    r.unloadPriorityCallback = oe;
    const s = new A();
    s.maxJobs = 25, s.priorityCallback = $;
    const o = new A();
    o.maxJobs = 5, o.priorityCallback = $;
    const a = new A();
    a.maxJobs = 25, this.processedTiles = /* @__PURE__ */ new WeakSet(), this.visibleTiles = /* @__PURE__ */ new Set(), this.activeTiles = /* @__PURE__ */ new Set(), this.usedSet = /* @__PURE__ */ new Set(), this.loadingTiles = /* @__PURE__ */ new Set(), this.lruCache = r, this.downloadQueue = s, this.parseQueue = o, this.processNodeQueue = a, this.stats = {
      inCacheSinceLoad: 0,
      inCache: 0,
      queued: 0,
      downloading: 0,
      parsing: 0,
      failed: 0,
      inFrustum: 0,
      used: 0,
      active: 0,
      visible: 0
    }, this.frameCount = 0, this._dispatchNeedsUpdateEvent = re(() => {
      this.dispatchEvent({ type: "needs-update" });
    }), this.errorTarget = 16, this._errorThreshold = 1 / 0, this.displayActiveTiles = !1, this.maxDepth = 1 / 0;
  }
  // Plugins
  registerPlugin(e) {
    if (e[M] === !0)
      throw new Error("TilesRendererBase: A plugin can only be registered to a single tileset");
    e.loadRootTileSet && !e.loadRootTileset && (console.warn('TilesRendererBase: Plugin implements deprecated "loadRootTileSet" method. Please rename to "loadRootTileset".'), e.loadRootTileset = e.loadRootTileSet), e.preprocessTileSet && !e.preprocessTileset && (console.warn('TilesRendererBase: Plugin implements deprecated "preprocessTileSet" method. Please rename to "preprocessTileset".'), e.preprocessTileset = e.preprocessTileSet);
    const t = this.plugins, r = e.priority || 0;
    let s = t.length;
    for (let o = 0; o < t.length; o++)
      if ((t[o].priority || 0) > r) {
        s = o;
        break;
      }
    t.splice(s, 0, e), e[M] = !0, e.init && e.init(this);
  }
  unregisterPlugin(e) {
    const t = this.plugins;
    if (typeof e == "string" && (e = this.getPluginByName(e)), t.includes(e)) {
      const r = t.indexOf(e);
      return t.splice(r, 1), e.dispose && e.dispose(), !0;
    }
    return !1;
  }
  getPluginByName(e) {
    return this.plugins.find((t) => t.name === e) || null;
  }
  invokeOnePlugin(e) {
    const t = [...this.plugins, this];
    for (let r = 0; r < t.length; r++) {
      const s = e(t[r]);
      if (s)
        return s;
    }
    return null;
  }
  invokeAllPlugins(e) {
    const t = [...this.plugins, this], r = [];
    for (let s = 0; s < t.length; s++) {
      const o = e(t[s]);
      o && r.push(o);
    }
    return r.length === 0 ? null : Promise.all(r);
  }
  // Public API
  traverse(e, t, r = !0) {
    this.root && te(this.root, (s, ...o) => (r && this.ensureChildrenArePreprocessed(s, !0), e ? e(s, ...o) : !1), t);
  }
  getAttributions(e = []) {
    return this.invokeAllPlugins((t) => t !== this && t.getAttributions && t.getAttributions(e)), e;
  }
  update() {
    const { lruCache: e, usedSet: t, stats: r, root: s, downloadQueue: o, parseQueue: a, processNodeQueue: l } = this;
    if (this.rootLoadingState === T && (this.rootLoadingState = w, this.invokeOnePlugin((c) => c.loadRootTileset && c.loadRootTileset()).then((c) => {
      let u = this.rootURL;
      u !== null && this.invokeAllPlugins((f) => u = f.preprocessURL ? f.preprocessURL(u, null) : u), this.rootLoadingState = v, this.rootTileset = c, this.dispatchEvent({ type: "needs-update" }), this.dispatchEvent({ type: "load-content" }), this.dispatchEvent({
        type: "load-tileset",
        tileset: c,
        url: u
      }), this.dispatchEvent({
        type: "load-root-tileset",
        tileset: c,
        url: u
      });
    }).catch((c) => {
      this.rootLoadingState = y, console.error(c), this.rootTileset = null, this.dispatchEvent({
        type: "load-error",
        tile: null,
        error: c,
        url: this.rootURL
      });
    })), !s)
      return;
    r.inFrustum = 0, r.used = 0, r.active = 0, r.visible = 0, this.frameCount++, t.forEach((c) => e.markUnused(c)), t.clear(), z(s, this), K(s, this), Y(s, this), X(s, this), this.removeUnusedPendingTiles();
    const i = this.queuedTiles;
    i.sort(e.unloadPriorityCallback);
    for (let c = 0, u = i.length; c < u && !e.isFull(); c++)
      this.requestTileContents(i[c]);
    i.length = 0, e.scheduleUnload(), (o.running || a.running || l.running) === !1 && this.isLoading === !0 && (this.cachedSinceLoadComplete.clear(), r.inCacheSinceLoad = 0, this.dispatchEvent({ type: "tiles-load-end" }), this.isLoading = !1);
  }
  resetFailedTiles() {
    this.rootLoadingState === y && (this.rootLoadingState = T);
    const e = this.stats;
    e.failed !== 0 && (this.traverse((t) => {
      t.__loadingState === y && (t.__loadingState = T);
    }, null, !1), e.failed = 0);
  }
  dispose() {
    [...this.plugins].forEach((s) => {
      this.unregisterPlugin(s);
    });
    const t = this.lruCache, r = [];
    this.traverse((s) => (r.push(s), !1), null, !1);
    for (let s = 0, o = r.length; s < o; s++)
      t.remove(r[s]);
    this.stats = {
      queued: 0,
      parsing: 0,
      downloading: 0,
      failed: 0,
      inFrustum: 0,
      used: 0,
      active: 0,
      visible: 0
    }, this.frameCount = 0, this.loadingTiles.clear();
  }
  // Overrideable
  calculateBytesUsed(e, t) {
    return 0;
  }
  dispatchEvent(e) {
  }
  addEventListener(e, t) {
  }
  removeEventListener(e, t) {
  }
  parseTile(e, t, r) {
    return null;
  }
  disposeTile(e) {
    e.__visible && (this.invokeOnePlugin((t) => t.setTileVisible && t.setTileVisible(e, !1)), e.__visible = !1), e.__active && (this.invokeOnePlugin((t) => t.setTileActive && t.setTileActive(e, !1)), e.__active = !1);
  }
  preprocessNode(e, t, r = null) {
    var s;
    if (this.processedTiles.add(e), e.content && (!("uri" in e.content) && "url" in e.content && (e.content.uri = e.content.url, delete e.content.url), e.content.boundingVolume && !("box" in e.content.boundingVolume || "sphere" in e.content.boundingVolume || "region" in e.content.boundingVolume) && delete e.content.boundingVolume), e.parent = r, e.children = e.children || [], (s = e.content) != null && s.uri) {
      const o = Q(e.content.uri);
      e.__hasContent = !0, e.__hasUnrenderableContent = !!(o && /json$/.test(o)), e.__hasRenderableContent = !e.__hasUnrenderableContent;
    } else
      e.__hasContent = !1, e.__hasUnrenderableContent = !1, e.__hasRenderableContent = !1;
    e.__childrenProcessed = 0, r && r.__childrenProcessed++, e.__distanceFromCamera = 1 / 0, e.__error = 1 / 0, e.__inFrustum = !1, e.__isLeaf = !1, e.__usedLastFrame = !1, e.__used = !1, e.__wasSetVisible = !1, e.__visible = !1, e.__allChildrenReady = !1, e.__wasSetActive = !1, e.__active = !1, e.__loadingState = T, r === null ? (e.__depth = 0, e.__depthFromRenderedParent = e.__hasRenderableContent ? 1 : 0, e.refine = e.refine || "REPLACE") : (e.__depth = r.__depth + 1, e.__depthFromRenderedParent = r.__depthFromRenderedParent + (e.__hasRenderableContent ? 1 : 0), e.refine = e.refine || r.refine), e.__basePath = t, e.__lastFrameVisited = -1, this.invokeAllPlugins((o) => {
      o !== this && o.preprocessNode && o.preprocessNode(e, t, r);
    });
  }
  setTileActive(e, t) {
    t ? this.activeTiles.add(e) : this.activeTiles.delete(e);
  }
  setTileVisible(e, t) {
    t ? this.visibleTiles.add(e) : this.visibleTiles.delete(e);
  }
  calculateTileViewError(e, t) {
  }
  removeUnusedPendingTiles() {
    const { lruCache: e, loadingTiles: t } = this, r = [];
    for (const s of t)
      !e.isUsed(s) && s.__loadingState === L && r.push(s);
    for (let s = 0; s < r.length; s++)
      e.remove(r[s]);
  }
  // Private Functions
  queueTileForDownload(e) {
    e.__loadingState !== T || this.lruCache.isFull() || this.queuedTiles.push(e);
  }
  markTileUsed(e) {
    this.usedSet.add(e), this.lruCache.markUsed(e);
  }
  fetchData(e, t) {
    return fetch(e, t);
  }
  ensureChildrenArePreprocessed(e, t = !1) {
    const r = e.children;
    for (let s = 0, o = r.length; s < o; s++) {
      const a = r[s];
      if ("__depth" in a)
        break;
      t ? (this.processNodeQueue.remove(a), this.preprocessNode(a, e.__basePath, e)) : this.processNodeQueue.has(a) || this.processNodeQueue.add(a, (l) => {
        this.preprocessNode(l, e.__basePath, e), this._dispatchNeedsUpdateEvent();
      });
    }
  }
  // returns the total bytes used for by the given tile as reported by all plugins
  getBytesUsed(e) {
    let t = 0;
    return this.invokeAllPlugins((r) => {
      r.calculateBytesUsed && (t += r.calculateBytesUsed(e, e.cached.scene) || 0);
    }), t;
  }
  // force a recalculation of the tile or all tiles if no tile is provided
  recalculateBytesUsed(e = null) {
    const { lruCache: t, processedTiles: r } = this;
    e === null ? t.itemSet.forEach((s) => {
      r.has(s) && t.setMemoryUsage(s, this.getBytesUsed(s));
    }) : t.setMemoryUsage(e, this.getBytesUsed(e));
  }
  preprocessTileset(e, t, r = null) {
    const s = Object.getPrototypeOf(this);
    Object.hasOwn(s, "preprocessTileSet") && console.warn(`${s.constructor.name}: Class overrides deprecated "preprocessTileSet" method. Please rename to "preprocessTileset".`);
    const o = e.asset.version, [a, l] = o.split(".").map((h) => parseInt(h));
    console.assert(
      a <= 1,
      "TilesRenderer: asset.version is expected to be a 1.x or a compatible version."
    ), a === 1 && l > 0 && console.warn("TilesRenderer: tiles versions at 1.1 or higher have limited support. Some new extensions and features may not be supported.");
    let i = t.replace(/\/[^/]*$/, "");
    i = new URL(i, window.location.href).toString(), this.preprocessNode(e.root, i, r);
  }
  preprocessTileSet(...e) {
    return console.warn('TilesRenderer: "preprocessTileSet" has been deprecated. Use "preprocessTileset" instead.'), this.preprocessTileset(...e);
  }
  loadRootTileset() {
    const e = Object.getPrototypeOf(this);
    Object.hasOwn(e, "loadRootTileSet") && console.warn(`${e.constructor.name}: Class overrides deprecated "loadRootTileSet" method. Please rename to "loadRootTileset".`);
    let t = this.rootURL;
    return this.invokeAllPlugins((s) => t = s.preprocessURL ? s.preprocessURL(t, null) : t), this.cachedRootJson ? Promise.resolve(this.cachedRootJson).then((s) => (this.preprocessTileset(s, t), s)) : this.invokeOnePlugin((s) => s.fetchData && s.fetchData(t, this.fetchOptions)).then((s) => {
      if (s instanceof Response) {
        if (s.ok)
          return s.json();
        throw new Error(`TilesRenderer: Failed to load tileset "${t}" with status ${s.status} : ${s.statusText}`);
      } else return s;
    }).then((s) => (this.preprocessTileset(s, t), s));
  }
  loadRootTileSet(...e) {
    return console.warn('TilesRenderer: "loadRootTileSet" has been deprecated. Use "loadRootTileset" instead.'), this.loadRootTileSet(...e);
  }
  requestTileContents(e) {
    if (e.__loadingState !== T)
      return;
    let t = !1, r = null, s = new URL(e.content.uri, e.__basePath + "/").toString();
    this.invokeAllPlugins((d) => s = d.preprocessURL ? d.preprocessURL(s, e) : s);
    const o = this.stats, a = this.lruCache, l = this.downloadQueue, i = this.parseQueue, h = this.loadingTiles, c = Q(s), u = new AbortController(), f = u.signal;
    if (a.add(e, (d) => {
      u.abort(), t ? (d.children.length = 0, d.__childrenProcessed = 0) : this.invokeAllPlugins((p) => {
        p.disposeTile && p.disposeTile(d);
      }), o.inCache--, this.cachedSinceLoadComplete.has(e) && (this.cachedSinceLoadComplete.delete(e), o.inCacheSinceLoad--), d.__loadingState === L ? o.queued-- : d.__loadingState === w ? o.downloading-- : d.__loadingState === B && o.parsing--, d.__loadingState = T, i.remove(d), l.remove(d), h.delete(d);
    }))
      return this.isLoading || (this.isLoading = !0, this.dispatchEvent({ type: "tiles-load-start" })), a.setMemoryUsage(e, this.getBytesUsed(e)), this.cachedSinceLoadComplete.add(e), o.inCacheSinceLoad++, o.inCache++, o.queued++, e.__loadingState = L, h.add(e), l.add(e, (d) => {
        if (f.aborted)
          return Promise.resolve();
        e.__loadingState = w, o.downloading++, o.queued--;
        const p = this.invokeOnePlugin((g) => g.fetchData && g.fetchData(s, { ...this.fetchOptions, signal: f }));
        return this.dispatchEvent({ type: "tile-download-start", tile: e, uri: s }), p;
      }).then((d) => {
        if (!f.aborted)
          if (d instanceof Response) {
            if (d.ok)
              return c === "json" ? d.json() : d.arrayBuffer();
            throw new Error(`Failed to load model with error code ${d.status}`);
          } else return d;
      }).then((d) => {
        if (!f.aborted)
          return o.downloading--, o.parsing++, e.__loadingState = B, i.add(e, (p) => f.aborted ? Promise.resolve() : c === "json" && d.root ? (this.preprocessTileset(d, s, e), e.children.push(d.root), r = d, t = !0, Promise.resolve()) : this.invokeOnePlugin((g) => g.parseTile && g.parseTile(d, p, c, s, f)));
      }).then(() => {
        if (f.aborted)
          return;
        o.parsing--, e.__loadingState = v, h.delete(e), a.setLoaded(e, !0);
        const d = this.getBytesUsed(e);
        if (a.getMemoryUsage(e) === 0 && d > 0 && a.isFull()) {
          a.remove(e);
          return;
        }
        a.setMemoryUsage(e, d), this.dispatchEvent({ type: "needs-update" }), this.dispatchEvent({ type: "load-content" }), t && this.dispatchEvent({
          type: "load-tileset",
          tileset: r,
          url: s
        }), e.cached.scene && this.dispatchEvent({
          type: "load-model",
          scene: e.cached.scene,
          tile: e,
          url: s
        });
      }).catch((d) => {
        f.aborted || (d.name !== "AbortError" ? (i.remove(e), l.remove(e), e.__loadingState === L ? o.queued-- : e.__loadingState === B ? o.parsing-- : e.__loadingState === w && o.downloading--, o.failed++, console.error(`TilesRenderer : Failed to load tile at url "${e.content.uri}".`), console.error(d), e.__loadingState = y, h.delete(e), a.setLoaded(e, !0), this.dispatchEvent({
          type: "load-error",
          tile: e,
          error: d,
          url: s
        })) : a.remove(e));
      });
  }
}
function Z(n, e, t, r, s, o) {
  let a;
  switch (r) {
    case "SCALAR":
      a = 1;
      break;
    case "VEC2":
      a = 2;
      break;
    case "VEC3":
      a = 3;
      break;
    case "VEC4":
      a = 4;
      break;
    default:
      throw new Error(`FeatureTable : Feature type not provided for "${o}".`);
  }
  let l;
  const i = t * a;
  switch (s) {
    case "BYTE":
      l = new Int8Array(n, e, i);
      break;
    case "UNSIGNED_BYTE":
      l = new Uint8Array(n, e, i);
      break;
    case "SHORT":
      l = new Int16Array(n, e, i);
      break;
    case "UNSIGNED_SHORT":
      l = new Uint16Array(n, e, i);
      break;
    case "INT":
      l = new Int32Array(n, e, i);
      break;
    case "UNSIGNED_INT":
      l = new Uint32Array(n, e, i);
      break;
    case "FLOAT":
      l = new Float32Array(n, e, i);
      break;
    case "DOUBLE":
      l = new Float64Array(n, e, i);
      break;
    default:
      throw new Error(`FeatureTable : Feature component type not provided for "${o}".`);
  }
  return l;
}
class R {
  constructor(e, t, r, s) {
    this.buffer = e, this.binOffset = t + r, this.binLength = s;
    let o = null;
    if (r !== 0) {
      const a = new Uint8Array(e, t, r);
      o = JSON.parse(H(a));
    } else
      o = {};
    this.header = o;
  }
  getKeys() {
    return Object.keys(this.header).filter((e) => e !== "extensions");
  }
  getData(e, t, r = null, s = null) {
    const o = this.header;
    if (!(e in o))
      return null;
    const a = o[e];
    if (a instanceof Object) {
      if (Array.isArray(a))
        return a;
      {
        const { buffer: l, binOffset: i, binLength: h } = this, c = a.byteOffset || 0, u = a.type || s, f = a.componentType || r;
        if ("type" in a && s && a.type !== s)
          throw new Error("FeatureTable: Specified type does not match expected type.");
        const _ = i + c, d = Z(l, _, t, u, f, e);
        if (_ + d.byteLength > i + h)
          throw new Error("FeatureTable: Feature data read outside binary body length.");
        return d;
      }
    } else return a;
  }
  getBuffer(e, t) {
    const { buffer: r, binOffset: s } = this;
    return r.slice(s + e, s + e + t);
  }
}
class ae {
  constructor(e) {
    this.batchTable = e;
    const t = e.header.extensions["3DTILES_batch_table_hierarchy"];
    this.classes = t.classes;
    for (const s of this.classes) {
      const o = s.instances;
      for (const a in o)
        s.instances[a] = this._parseProperty(o[a], s.length, a);
    }
    if (this.instancesLength = t.instancesLength, this.classIds = this._parseProperty(t.classIds, this.instancesLength, "classIds"), t.parentCounts ? this.parentCounts = this._parseProperty(t.parentCounts, this.instancesLength, "parentCounts") : this.parentCounts = new Array(this.instancesLength).fill(1), t.parentIds) {
      const s = this.parentCounts.reduce((o, a) => o + a, 0);
      this.parentIds = this._parseProperty(t.parentIds, s, "parentIds");
    } else
      this.parentIds = null;
    this.instancesIds = [];
    const r = {};
    for (const s of this.classIds)
      r[s] = r[s] ?? 0, this.instancesIds.push(r[s]), r[s]++;
  }
  _parseProperty(e, t, r) {
    if (Array.isArray(e))
      return e;
    {
      const { buffer: s, binOffset: o } = this.batchTable, a = e.byteOffset, l = e.componentType || "UNSIGNED_SHORT", i = o + a;
      return Z(s, i, t, "SCALAR", l, r);
    }
  }
  getDataFromId(e, t = {}) {
    const r = this.parentCounts[e];
    if (this.parentIds && r > 0) {
      let i = 0;
      for (let h = 0; h < e; h++)
        i += this.parentCounts[h];
      for (let h = 0; h < r; h++) {
        const c = this.parentIds[i + h];
        c !== e && this.getDataFromId(c, t);
      }
    }
    const s = this.classIds[e], o = this.classes[s].instances, a = this.classes[s].name, l = this.instancesIds[e];
    for (const i in o)
      t[a] = t[a] || {}, t[a][i] = o[i][l];
    return t;
  }
}
class V extends R {
  get batchSize() {
    return console.warn("BatchTable.batchSize has been deprecated and replaced with BatchTable.count."), this.count;
  }
  constructor(e, t, r, s, o) {
    super(e, r, s, o), this.count = t, this.extensions = {};
    const a = this.header.extensions;
    a && a["3DTILES_batch_table_hierarchy"] && (this.extensions["3DTILES_batch_table_hierarchy"] = new ae(this));
  }
  getData(e, t = null, r = null) {
    return console.warn("BatchTable: BatchTable.getData is deprecated. Use BatchTable.getDataFromId to get allproperties for an id or BatchTable.getPropertyArray for getting an array of value for a property."), super.getData(e, this.count, t, r);
  }
  getDataFromId(e, t = {}) {
    if (e < 0 || e >= this.count)
      throw new Error(`BatchTable: id value "${e}" out of bounds for "${this.count}" features number.`);
    for (const r of this.getKeys())
      t[r] = super.getData(r, this.count)[e];
    for (const r in this.extensions) {
      const s = this.extensions[r];
      s.getDataFromId instanceof Function && (t[r] = t[r] || {}, s.getDataFromId(e, t[r]));
    }
    return t;
  }
  getPropertyArray(e) {
    return super.getData(e, this.count);
  }
}
class de extends P {
  parse(e) {
    const t = new DataView(e), r = S(t);
    console.assert(r === "b3dm");
    const s = t.getUint32(4, !0);
    console.assert(s === 1);
    const o = t.getUint32(8, !0);
    console.assert(o === e.byteLength);
    const a = t.getUint32(12, !0), l = t.getUint32(16, !0), i = t.getUint32(20, !0), h = t.getUint32(24, !0), c = 28, u = e.slice(
      c,
      c + a + l
    ), f = new R(
      u,
      0,
      a,
      l
    ), _ = c + a + l, d = e.slice(
      _,
      _ + i + h
    ), p = new V(
      d,
      f.getData("BATCH_LENGTH"),
      0,
      i,
      h
    ), g = _ + i + h, C = new Uint8Array(e, g, o - g);
    return {
      version: s,
      featureTable: f,
      batchTable: p,
      glbBytes: C
    };
  }
}
class he extends P {
  parse(e) {
    const t = new DataView(e), r = S(t);
    console.assert(r === "i3dm");
    const s = t.getUint32(4, !0);
    console.assert(s === 1);
    const o = t.getUint32(8, !0);
    console.assert(o === e.byteLength);
    const a = t.getUint32(12, !0), l = t.getUint32(16, !0), i = t.getUint32(20, !0), h = t.getUint32(24, !0), c = t.getUint32(28, !0), u = 32, f = e.slice(
      u,
      u + a + l
    ), _ = new R(
      f,
      0,
      a,
      l
    ), d = u + a + l, p = e.slice(
      d,
      d + i + h
    ), g = new V(
      p,
      _.getData("INSTANCES_LENGTH"),
      0,
      i,
      h
    ), C = d + i + h, q = new Uint8Array(e, C, o - C);
    let F = null, E = null, G = null;
    if (c)
      F = q, E = Promise.resolve();
    else {
      const I = this.resolveExternalURL(H(q));
      G = se(I), E = fetch(I, this.fetchOptions).then((b) => {
        if (!b.ok)
          throw new Error(`I3DMLoaderBase : Failed to load file "${I}" with status ${b.status} : ${b.statusText}`);
        return b.arrayBuffer();
      }).then((b) => {
        F = new Uint8Array(b);
      });
    }
    return E.then(() => ({
      version: s,
      featureTable: _,
      batchTable: g,
      glbBytes: F,
      gltfWorkingPath: G
    }));
  }
}
class ue extends P {
  parse(e) {
    const t = new DataView(e), r = S(t);
    console.assert(r === "pnts");
    const s = t.getUint32(4, !0);
    console.assert(s === 1);
    const o = t.getUint32(8, !0);
    console.assert(o === e.byteLength);
    const a = t.getUint32(12, !0), l = t.getUint32(16, !0), i = t.getUint32(20, !0), h = t.getUint32(24, !0), c = 28, u = e.slice(
      c,
      c + a + l
    ), f = new R(
      u,
      0,
      a,
      l
    ), _ = c + a + l, d = e.slice(
      _,
      _ + i + h
    ), p = new V(
      d,
      f.getData("BATCH_LENGTH") || f.getData("POINTS_LENGTH"),
      0,
      i,
      h
    );
    return Promise.resolve({
      version: s,
      featureTable: f,
      batchTable: p
    });
  }
}
class fe extends P {
  parse(e) {
    const t = new DataView(e), r = S(t);
    console.assert(r === "cmpt", 'CMPTLoader: The magic bytes equal "cmpt".');
    const s = t.getUint32(4, !0);
    console.assert(s === 1, 'CMPTLoader: The version listed in the header is "1".');
    const o = t.getUint32(8, !0);
    console.assert(o === e.byteLength, "CMPTLoader: The contents buffer length listed in the header matches the file.");
    const a = t.getUint32(12, !0), l = [];
    let i = 16;
    for (let h = 0; h < a; h++) {
      const c = new DataView(e, i, 12), u = S(c), f = c.getUint32(4, !0), _ = c.getUint32(8, !0), d = new Uint8Array(e, i, _);
      l.push({
        type: u,
        buffer: d,
        version: f
      }), i += _;
    }
    return {
      version: s,
      tiles: l
    };
  }
}
export {
  de as B3DMLoaderBase,
  fe as CMPTLoaderBase,
  y as FAILED,
  he as I3DMLoaderBase,
  v as LOADED,
  w as LOADING,
  ee as LRUCache,
  P as LoaderBase,
  ve as LoaderUtils,
  B as PARSING,
  ue as PNTSLoaderBase,
  A as PriorityQueue,
  ge as PriorityQueueItemRemovedError,
  L as QUEUED,
  ce as TilesRendererBase,
  Se as TraversalUtils,
  T as UNLOADED,
  Te as WGS84_FLATTENING,
  me as WGS84_HEIGHT,
  be as WGS84_RADIUS
};
//# sourceMappingURL=index.core.js.map
