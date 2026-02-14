import { t as et, L as st } from "./LoaderBase-2yhE3Jur.js";
class it {
  constructor(t = {}) {
    const { apiToken: s, autoRefreshToken: e = !1 } = t;
    this.apiToken = s, this.autoRefreshToken = e, this.authURL = null, this._tokenRefreshPromise = null, this._bearerToken = null;
  }
  async fetch(t, s) {
    await this._tokenRefreshPromise;
    const e = { ...s };
    e.headers = e.headers || {}, e.headers = {
      ...e.headers,
      Authorization: this._bearerToken
    };
    const i = await fetch(t, e);
    return i.status >= 400 && i.status <= 499 && this.autoRefreshToken ? (await this.refreshToken(s), e.headers.Authorization = this._bearerToken, fetch(t, e)) : i;
  }
  refreshToken(t) {
    if (this._tokenRefreshPromise === null) {
      const s = new URL(this.authURL);
      s.searchParams.set("access_token", this.apiToken), this._tokenRefreshPromise = fetch(s, t).then((e) => {
        if (!e.ok)
          throw new Error(`CesiumIonAuthPlugin: Failed to load data with error code ${e.status}`);
        return e.json();
      }).then((e) => (this._bearerToken = `Bearer ${e.accessToken}`, this._tokenRefreshPromise = null, e));
    }
    return this._tokenRefreshPromise;
  }
}
class ot {
  constructor() {
    this.creditsCount = {};
  }
  _adjustAttributions(t, s) {
    const e = this.creditsCount, i = t.split(/;/g);
    for (let n = 0, r = i.length; n < r; n++) {
      const l = i[n];
      l in e || (e[l] = 0), e[l] += s ? 1 : -1, e[l] <= 0 && delete e[l];
    }
  }
  addAttributions(t) {
    this._adjustAttributions(t, !0);
  }
  removeAttributions(t) {
    this._adjustAttributions(t, !1);
  }
  toString() {
    return Object.entries(this.creditsCount).sort((s, e) => {
      const i = s[1];
      return e[1] - i;
    }).map((s) => s[0]).join("; ");
  }
}
const nt = "https://tile.googleapis.com/v1/3dtiles/root.json";
class rt {
  constructor({
    apiToken: t,
    sessionOptions: s = null,
    autoRefreshToken: e = !1,
    logoUrl: i = null,
    useRecommendedSettings: n = !0
  }) {
    this.name = "GOOGLE_CLOUD_AUTH_PLUGIN", this.apiToken = t, this.useRecommendedSettings = n, this.logoUrl = i, this.auth = new at({ apiToken: t, autoRefreshToken: e, sessionOptions: s }), this.tiles = null, this._visibilityChangeCallback = null, this._attributionsManager = new ot(), this._logoAttribution = {
      value: "",
      type: "image",
      collapsible: !1
    }, this._attribution = {
      value: "",
      type: "string",
      collapsible: !0
    };
  }
  init(t) {
    const { useRecommendedSettings: s, auth: e } = this;
    t.resetFailedTiles(), t.rootURL == null && (t.rootURL = nt), e.sessionOptions || (e.authURL = t.rootURL), s && !e.isMapTilesSession && (t.errorTarget = 20), this.tiles = t, this._visibilityChangeCallback = ({ tile: i, visible: n }) => {
      var l, a;
      const r = ((a = (l = i.engineData.metadata) == null ? void 0 : l.asset) == null ? void 0 : a.copyright) || "";
      n ? this._attributionsManager.addAttributions(r) : this._attributionsManager.removeAttributions(r);
    }, t.addEventListener("tile-visibility-change", this._visibilityChangeCallback);
  }
  loadRootTileset() {
    const t = this.tiles;
    if (t.cachedRootJson)
      return console.log("GoogleCloudAuthPlugin: Using cachedRootJson, skipping fetch"), this._processResponse(t.cachedRootJson), t.invokeOnePlugin((e) => e !== this && e.loadRootTileset && e.loadRootTileset());
    let s = new URL(t.rootURL, location.href);
    return t.invokeAllPlugins((e) => s = e.preprocessURL ? e.preprocessURL(s, null) : s), t.invokeOnePlugin((e) => e.fetchData && e.fetchData(s, t.fetchOptions)).then((e) => e.json()).then((e) => (this._processResponse(e), t.invokeOnePlugin((i) => i !== this && i.loadRootTileset && i.loadRootTileset())));
  }
  _processResponse(t) {
    if (this.auth.sessionToken === null && t) {
      const s = t.root;
      if (s) {
        const e = (i) => {
          if (i.content && i.content.uri) {
            const [, n] = i.content.uri.split("?");
            return new URLSearchParams(n).get("session");
          }
          if (i.children)
            for (const n of i.children) {
              const r = e(n);
              if (r) return r;
            }
          return null;
        };
        this.auth.sessionToken = e(s);
      } else t.session && (this.auth.sessionToken = t.session);
    }
  }
  getAttributions(t) {
    this.tiles.visibleTiles.size > 0 && (this.logoUrl && (this._logoAttribution.value = this.logoUrl, t.push(this._logoAttribution)), this._attribution.value = this._attributionsManager.toString(), t.push(this._attribution));
  }
  dispose() {
    this.tiles.removeEventListener("tile-visibility-change", this._visibilityChangeCallback);
  }
  async fetchData(t, s) {
    return this.auth.fetch(t, s);
  }
}
let lt = class {
  get apiToken() {
    return this.auth.apiToken;
  }
  set apiToken(t) {
    this.auth.apiToken = t;
  }
  get autoRefreshToken() {
    return this.auth.autoRefreshToken;
  }
  set autoRefreshToken(t) {
    this.auth.autoRefreshToken = t;
  }
  constructor(t = {}) {
    const {
      apiToken: s,
      assetId: e = null,
      autoRefreshToken: i = !1,
      useRecommendedSettings: n = !0,
      assetTypeHandler: r = (l, a, P) => {
        console.warn(`CesiumIonAuthPlugin: Cesium Ion asset type "${l}" unhandled.`);
      }
    } = t;
    this.name = "CESIUM_ION_AUTH_PLUGIN", this.auth = new it({ apiToken: s, autoRefreshToken: i }), this.assetId = e, this.autoRefreshToken = i, this.useRecommendedSettings = n, this.assetTypeHandler = r, this.tiles = null, this._tileSetVersion = -1, this._attributions = [];
  }
  init(t) {
    this.assetId !== null && (t.rootURL = `https://api.cesium.com/v1/assets/${this.assetId}/endpoint`), this.tiles = t, this.auth.authURL = t.rootURL, t.resetFailedTiles();
  }
  loadRootTileset() {
    return this.auth.refreshToken().then((t) => (this._initializeFromAsset(t), this.tiles.invokeOnePlugin((s) => s !== this && s.loadRootTileset && s.loadRootTileset()))).catch((t) => {
      this.tiles.dispatchEvent({
        type: "load-error",
        tile: null,
        error: t,
        url: this.auth.authURL
      });
    });
  }
  preprocessURL(t) {
    return t = new URL(t), /^http/.test(t.protocol) && this._tileSetVersion != -1 && t.searchParams.set("v", this._tileSetVersion), t.toString();
  }
  fetchData(t, s) {
    return this.tiles.getPluginByName("GOOGLE_CLOUD_AUTH_PLUGIN") !== null ? null : this.auth.fetch(t, s);
  }
  getAttributions(t) {
    this.tiles.visibleTiles.size > 0 && t.push(...this._attributions);
  }
  _initializeFromAsset(t) {
    const s = this.tiles;
    if ("externalType" in t) {
      const e = new URL(t.options.url);
      s.rootURL = t.options.url, s.registerPlugin(new rt({
        apiToken: e.searchParams.get("key"),
        autoRefreshToken: this.autoRefreshToken,
        useRecommendedSettings: this.useRecommendedSettings
      }));
    } else {
      t.type !== "3DTILES" && this.assetTypeHandler(t.type, s, t), s.rootURL = t.url;
      const e = new URL(t.url);
      e.searchParams.has("v") && this._tileSetVersion === -1 && (this._tileSetVersion = e.searchParams.get("v")), t.attributions && (this._attributions = t.attributions.map((i) => ({
        value: i.html,
        type: "html",
        collapsible: i.collapsible
      })));
    }
  }
};
const V = "https://tile.googleapis.com/v1/createSession";
class at {
  get isMapTilesSession() {
    return this.authURL === V;
  }
  constructor(t = {}) {
    const { apiToken: s, sessionOptions: e = null, autoRefreshToken: i = !1 } = t;
    this.apiToken = s, this.autoRefreshToken = i, this.authURL = V, this.sessionToken = null, this.sessionOptions = e, this._tokenRefreshPromise = null;
  }
  async fetch(t, s) {
    this.sessionToken === null && this.isMapTilesSession && this.refreshToken(s), await this._tokenRefreshPromise;
    const e = new URL(t);
    e.searchParams.set("key", this.apiToken), this.sessionToken && e.searchParams.set("session", this.sessionToken);
    let i = await fetch(e, s);
    return i.status >= 400 && i.status <= 499 && this.autoRefreshToken && (await this.refreshToken(s), this.sessionToken && e.searchParams.set("session", this.sessionToken), i = await fetch(e, s)), this.sessionToken === null && !this.isMapTilesSession ? i.json().then((n) => (this.sessionToken = N(n), n)) : i;
  }
  refreshToken(t) {
    if (this._tokenRefreshPromise === null) {
      const s = new URL(this.authURL);
      s.searchParams.set("key", this.apiToken);
      const e = { ...t };
      this.isMapTilesSession && (e.method = "POST", e.body = JSON.stringify(this.sessionOptions), e.headers = e.headers || {}, e.headers = {
        ...e.headers,
        "Content-Type": "application/json"
      }), this._tokenRefreshPromise = fetch(s, e).then((i) => {
        if (!i.ok)
          throw new Error(`GoogleCloudAuth: Failed to load data with error code ${i.status}`);
        return i.json();
      }).then((i) => (this.sessionToken = N(i), this._tokenRefreshPromise = null, i));
    }
    return this._tokenRefreshPromise;
  }
}
function N(h) {
  if ("session" in h)
    return h.session;
  {
    let t = null;
    const s = h.root;
    return et(s, (e) => {
      if (e.content && e.content.uri) {
        const [, i] = e.content.uri.split("?");
        return t = new URLSearchParams(i).get("session"), !0;
      }
      return !1;
    }), t;
  }
}
function v(h) {
  return h >> 1 ^ -(h & 1);
}
class ct extends st {
  constructor(...t) {
    super(...t), this.fetchOptions.header = {
      Accept: "application/vnd.quantized-mesh,application/octet-stream;q=0.9"
    };
  }
  loadAsync(...t) {
    const { fetchOptions: s } = this;
    return s.header = s.header || {}, s.header.Accept = "application/vnd.quantized-mesh,application/octet-stream;q=0.9", s.header.Accept += ";extensions=octvertexnormals-watermask-metadata", super.loadAsync(...t);
  }
  parse(t) {
    let s = 0;
    const e = new DataView(t), i = () => {
      const o = e.getFloat64(s, !0);
      return s += 8, o;
    }, n = () => {
      const o = e.getFloat32(s, !0);
      return s += 4, o;
    }, r = () => {
      const o = e.getUint32(s, !0);
      return s += 4, o;
    }, l = () => {
      const o = e.getUint8(s);
      return s += 1, o;
    }, a = (o, u) => {
      const f = new u(t, s, o);
      return s += o * u.BYTES_PER_ELEMENT, f;
    }, P = {
      center: [i(), i(), i()],
      minHeight: n(),
      maxHeight: n(),
      sphereCenter: [i(), i(), i()],
      sphereRadius: i(),
      horizonOcclusionPoint: [i(), i(), i()]
    }, c = r(), $ = a(c, Uint16Array), q = a(c, Uint16Array), J = a(c, Uint16Array), g = new Float32Array(c), m = new Float32Array(c), w = new Float32Array(c);
    let S = 0, C = 0, I = 0;
    const y = 32767;
    for (let o = 0; o < c; ++o)
      S += v($[o]), C += v(q[o]), I += v(J[o]), g[o] = S / y, m[o] = C / y, w[o] = I / y;
    const O = c > 65536, R = O ? Uint32Array : Uint16Array;
    O ? s = Math.ceil(s / 4) * 4 : s = Math.ceil(s / 2) * 2;
    const Q = r(), _ = a(Q * 3, R);
    let M = 0;
    for (var U = 0; U < _.length; ++U) {
      const o = _[U];
      _[U] = M - o, o === 0 && ++M;
    }
    const x = (o, u) => m[u] - m[o], X = (o, u) => -x(o, u), E = (o, u) => g[o] - g[u], Z = (o, u) => -E(o, u), Y = r(), B = a(Y, R);
    B.sort(x);
    const K = r(), z = a(K, R);
    z.sort(E);
    const W = r(), F = a(W, R);
    F.sort(X);
    const j = r(), D = a(j, R);
    D.sort(Z);
    const tt = {
      westIndices: B,
      southIndices: z,
      eastIndices: F,
      northIndices: D
    }, b = {};
    for (; s < e.byteLength; ) {
      const o = l(), u = r();
      if (o === 1) {
        const f = a(c * 2, Uint8Array), p = new Float32Array(c * 3);
        for (let d = 0; d < c; d++) {
          let k = f[2 * d + 0] / 255 * 2 - 1, T = f[2 * d + 1] / 255 * 2 - 1;
          const A = 1 - (Math.abs(k) + Math.abs(T));
          if (A < 0) {
            const G = k;
            k = (1 - Math.abs(T)) * H(G), T = (1 - Math.abs(G)) * H(T);
          }
          const L = Math.sqrt(k * k + T * T + A * A);
          p[3 * d + 0] = k / L, p[3 * d + 1] = T / L, p[3 * d + 2] = A / L;
        }
        b.octvertexnormals = {
          extensionId: o,
          normals: p
        };
      } else if (o === 2) {
        const f = u === 1 ? 1 : 256, p = a(f * f, Uint8Array);
        b.watermask = {
          extensionId: o,
          mask: p,
          size: f
        };
      } else if (o === 4) {
        const f = r(), p = a(f, Uint8Array), d = new TextDecoder().decode(p);
        b.metadata = {
          extensionId: o,
          json: JSON.parse(d)
        };
      }
    }
    return {
      header: P,
      indices: _,
      vertexData: {
        u: g,
        v: m,
        height: w
      },
      edgeIndices: tt,
      extensions: b
    };
  }
}
function H(h) {
  return h < 0 ? -1 : 1;
}
export {
  it as C,
  rt as G,
  ct as Q,
  at as a,
  lt as b,
  v as z
};
//# sourceMappingURL=QuantizedMeshLoaderBase-5NpHK4Vw.js.map
