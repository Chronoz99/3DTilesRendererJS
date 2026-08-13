import { A as e, M as t, b as n, c as r, j as i, p as a, v as o } from "./renderer-CASIahiy.js";
import { c as s, d as c, m as l, o as u, s as d } from "./renderer-t4tMADa3.js";
import { i as f, o as p, s as m, t as h } from "./plugins-BBrI4L2j.js";
import { BatchedMesh as g, Box2 as _, Box3 as v, Box3Helper as y, BoxGeometry as b, BufferAttribute as x, BufferGeometry as S, CanvasTexture as C, Color as w, CustomBlending as T, DataTexture as E, DefaultLoadingManager as D, DoubleSide as O, EventDispatcher as k, FileLoader as ee, Frustum as te, GreaterDepth as ne, Group as A, LineBasicMaterial as re, LineSegments as ie, LinearFilter as ae, LinearMipMapLinearFilter as oe, MathUtils as j, Matrix2 as se, Matrix3 as ce, Matrix4 as M, Mesh as le, MeshBasicMaterial as N, MeshStandardMaterial as ue, OneFactor as de, PlaneGeometry as fe, Points as pe, PointsMaterial as me, Quaternion as he, REVISION as ge, RGFormat as _e, Ray as ve, Raycaster as ye, SRGBColorSpace as be, ShaderMaterial as xe, Source as Se, Sphere as Ce, SphereGeometry as we, Texture as Te, TextureUtils as Ee, Triangle as De, UnsignedByteType as Oe, Vector2 as P, Vector3 as F, Vector4 as I, WebGLArrayRenderTarget as ke, WebGLRenderTarget as Ae, WebGLRenderer as je, ZeroFactor as Me } from "three";
import { GLTFLoader as Ne } from "three/addons/loaders/GLTFLoader.js";
import { FullScreenQuad as Pe } from "three/addons/postprocessing/Pass.js";
//#region src/three/plugins/images/utils/getCartographicToMeterDerivative.js
var Fe = /* @__PURE__ */ new F(), Ie = /* @__PURE__ */ new F();
function Le(e, t, n) {
	let r = 1e-5, i = n + r, a = t + r;
	Math.abs(a) > Math.PI / 2 && (a -= r), e.getCartographicToPosition(t, n, 0, Fe), e.getCartographicToPosition(a, n, 0, Ie);
	let o = Fe.distanceTo(Ie) / r;
	return e.getCartographicToPosition(t, i, 0, Ie), [Fe.distanceTo(Ie) / r, o];
}
//#endregion
//#region src/three/plugins/images/utils/ProjectionScheme.js
var L = class {
	get isMercator() {
		return this.scheme === "EPSG:3857";
	}
	get isCartographic() {
		return this.scheme !== "none";
	}
	constructor(e = "EPSG:4326") {
		this.scheme = e, this.tileCountX = 1, this.tileCountY = 1, this.setScheme(e);
	}
	setScheme(e) {
		switch (this.scheme = e, e) {
			case "CRS:84":
			case "EPSG:4326":
				this.tileCountX = 2, this.tileCountY = 1;
				break;
			case "EPSG:3857":
				this.tileCountX = 1, this.tileCountY = 1;
				break;
			case "none":
				this.tileCountX = 1, this.tileCountY = 1;
				break;
			default: throw Error(`ProjectionScheme: Unknown projection scheme "${e}"`);
		}
	}
	convertNormalizedToLatitude(e) {
		if (this.scheme === "none") return e;
		if (this.isMercator) {
			let t = j.mapLinear(e, 0, 1, -1, 1);
			return 2 * Math.atan(Math.exp(t * Math.PI)) - Math.PI / 2;
		} else return j.mapLinear(e, 0, 1, -Math.PI / 2, Math.PI / 2);
	}
	convertNormalizedToLongitude(e) {
		return this.scheme === "none" ? e : j.mapLinear(e, 0, 1, -Math.PI, Math.PI);
	}
	convertLatitudeToNormalized(e) {
		return this.scheme === "none" ? e : this.isMercator ? 1 / 2 + 1 * Math.log(Math.tan(Math.PI / 4 + e / 2)) / (2 * Math.PI) : j.mapLinear(e, -Math.PI / 2, Math.PI / 2, 0, 1);
	}
	convertLongitudeToNormalized(e) {
		return this.scheme === "none" ? e : (e + Math.PI) / (2 * Math.PI);
	}
	getLongitudeDerivativeAtNormalized(e) {
		return this.scheme === "none" ? 1 : 2 * Math.PI;
	}
	getLatitudeDerivativeAtNormalized(e) {
		if (this.scheme === "none") return 1;
		{
			let t = 1e-5, n = e - t;
			return n < 0 && (n = e + t), this.isMercator ? Math.abs(this.convertNormalizedToLatitude(e) - this.convertNormalizedToLatitude(n)) / t : Math.PI;
		}
	}
	getBounds() {
		return this.scheme === "none" ? [
			0,
			0,
			1,
			1
		] : [
			this.convertNormalizedToLongitude(0),
			this.convertNormalizedToLatitude(0),
			this.convertNormalizedToLongitude(1),
			this.convertNormalizedToLatitude(1)
		];
	}
	toNormalizedPoint(e, t) {
		let n = [e, t];
		return n[0] = this.convertLongitudeToNormalized(n[0]), n[1] = this.convertLatitudeToNormalized(n[1]), n;
	}
	toNormalizedRange(e) {
		return [...this.toNormalizedPoint(e[0], e[1]), ...this.toNormalizedPoint(e[2], e[3])];
	}
	toCartographicPoint(e, t) {
		let n = [e, t];
		return n[0] = this.convertNormalizedToLongitude(n[0]), n[1] = this.convertNormalizedToLatitude(n[1]), n;
	}
	toCartographicRange(e) {
		return [...this.toCartographicPoint(e[0], e[1]), ...this.toCartographicPoint(e[2], e[3])];
	}
	clampToBounds(e, t = !1) {
		let n = [...e], r;
		r = t ? [
			0,
			0,
			1,
			1
		] : this.getBounds();
		let [i, a, o, s] = r;
		return n[0] = j.clamp(n[0], i, o), n[2] = j.clamp(n[2], i, o), n[1] = j.clamp(n[1], a, s), n[3] = j.clamp(n[3], a, s), n;
	}
};
//#endregion
//#region src/three/plugins/images/utils/TilingScheme.js
function Re(e, t) {
	let [n, r, i, a] = e, [o, s, c, l] = t;
	return !(n >= c || i <= o || r >= l || a <= s);
}
var ze = class {
	get levelCount() {
		return this._levels.length;
	}
	get maxLevel() {
		return this.levelCount - 1;
	}
	get minLevel() {
		let e = this._levels;
		for (let t = 0; t < e.length; t++) if (e[t] !== null) return t;
		return -1;
	}
	get contentBounds() {
		return this._contentBounds ?? this.projection.getBounds();
	}
	get aspectRatio() {
		let { pixelWidth: e, pixelHeight: t } = this.getLevel(this.maxLevel);
		return e / t;
	}
	constructor() {
		this.flipY = !1, this.pixelOverlap = 0, this._contentBounds = null, this.projection = new L("none"), this._levels = [];
	}
	setLevel(e, t = {}) {
		let n = this._levels;
		for (; n.length < e;) n.push(null);
		let { tileSplitX: r = 2, tileSplitY: i = 2 } = t, { tilePixelWidth: a = 256, tilePixelHeight: o = 256, tileCountX: s = r ** e, tileCountY: c = i ** e, tileBounds: l = null } = t, { pixelWidth: u = a * s, pixelHeight: d = o * c } = t;
		n[e] = {
			tilePixelWidth: a,
			tilePixelHeight: o,
			pixelWidth: u,
			pixelHeight: d,
			tileCountX: s,
			tileCountY: c,
			tileSplitX: r,
			tileSplitY: i,
			tileBounds: l
		};
	}
	generateLevels(e, t, n, r = {}) {
		let { minLevel: i = 0, tilePixelWidth: a = 256, tilePixelHeight: o = 256 } = r, s = e - 1, { pixelWidth: c = a * t * 2 ** s, pixelHeight: l = o * n * 2 ** s } = r;
		for (let t = i; t < e; t++) {
			let n = e - t - 1, r = Math.ceil(c * 2 ** -n), i = Math.ceil(l * 2 ** -n), s = Math.ceil(r / a), u = Math.ceil(i / o);
			this.setLevel(t, {
				tilePixelWidth: a,
				tilePixelHeight: o,
				pixelWidth: r,
				pixelHeight: i,
				tileCountX: s,
				tileCountY: u
			});
		}
	}
	getLevel(e) {
		return this._levels[e];
	}
	setContentBounds(e, t, n, r) {
		this._contentBounds = [
			e,
			t,
			n,
			r
		];
	}
	setProjection(e) {
		this.projection = e;
	}
	getTileAtPoint(e, t, n, r = !1) {
		let { flipY: i } = this, { tileCountY: a, tileBounds: o, pixelHeight: s, pixelWidth: c, tilePixelHeight: l, tilePixelWidth: u } = this.getLevel(n), d = u / c, f = l / s;
		if (r || ([e, t] = this.toNormalizedPoint(e, t)), o) {
			let n = this.toNormalizedRange(o);
			e = j.mapLinear(e, n[0], n[2], 0, 1), t = j.mapLinear(t, n[1], n[3], 0, 1);
		}
		let p = Math.floor(e / d), m = Math.floor(t / f);
		return i && (m = a - 1 - m), [p, m];
	}
	getTilesInRange(e, t, n, r, i, a = !1) {
		let o = [
			e,
			t,
			n,
			r
		], s = this.getContentBounds(a), c = this.getLevel(i).tileBounds;
		if (!Re(o, s) || c && (a && (c = this.toNormalizedRange(c)), !Re(o, s))) return [
			0,
			0,
			-1,
			-1
		];
		let [l, u, d, f] = this.clampToContentBounds(o, a), p = this.getTileAtPoint(l, u, i, a), m = this.getTileAtPoint(d, f, i, a);
		this.flipY && ([p[1], m[1]] = [m[1], p[1]]);
		let { tileCountX: h, tileCountY: g } = this.getLevel(i), [_, v] = p, [y, b] = m;
		return y < 0 || b < 0 || _ >= h || v >= g ? [
			0,
			0,
			-1,
			-1
		] : [
			j.clamp(_, 0, h - 1),
			j.clamp(v, 0, g - 1),
			j.clamp(y, 0, h - 1),
			j.clamp(b, 0, g - 1)
		];
	}
	getTileExists(e, t, n) {
		let [r, i, a, o] = this.contentBounds, [s, c, l, u] = this.getTileBounds(e, t, n);
		return !(s >= l || c >= u) && s <= a && c <= o && l >= r && u >= i;
	}
	getContentBounds(e = !1) {
		let { projection: t } = this, n = [...this.contentBounds];
		return e && (n[0] = t.convertLongitudeToNormalized(n[0]), n[1] = t.convertLatitudeToNormalized(n[1]), n[2] = t.convertLongitudeToNormalized(n[2]), n[3] = t.convertLatitudeToNormalized(n[3])), n;
	}
	getTileContentUVBounds(e, t, n) {
		let [r, i, a, o] = this.getTileBounds(e, t, n, !0, !0), [s, c, l, u] = this.getTileBounds(e, t, n, !0, !1);
		return [
			j.mapLinear(r, s, l, 0, 1),
			j.mapLinear(i, c, u, 0, 1),
			j.mapLinear(a, s, l, 0, 1),
			j.mapLinear(o, c, u, 0, 1)
		];
	}
	getTileBounds(e, t, n, r = !1, i = !0) {
		let { flipY: a, pixelOverlap: o, projection: s } = this, { tilePixelWidth: c, tilePixelHeight: l, pixelWidth: u, pixelHeight: d, tileBounds: f } = this.getLevel(n), p = c * e - o, m = l * t - o, h = p + c + o * 2, g = m + l + o * 2;
		if (p = Math.max(p, 0), m = Math.max(m, 0), h = Math.min(h, u), g = Math.min(g, d), p /= u, h /= u, m /= d, g /= d, a) {
			let e = (g - m) / 2, t = 1 - (m + g) / 2;
			m = t - e, g = t + e;
		}
		let _ = [
			p,
			m,
			h,
			g
		];
		if (f) {
			let e = this.toNormalizedRange(f);
			_[0] = j.mapLinear(_[0], 0, 1, e[0], e[2]), _[2] = j.mapLinear(_[2], 0, 1, e[0], e[2]), _[1] = j.mapLinear(_[1], 0, 1, e[1], e[3]), _[3] = j.mapLinear(_[3], 0, 1, e[1], e[3]);
		}
		return i && (_ = this.clampToBounds(_, !0)), r || (_[0] = s.convertNormalizedToLongitude(_[0]), _[1] = s.convertNormalizedToLatitude(_[1]), _[2] = s.convertNormalizedToLongitude(_[2]), _[3] = s.convertNormalizedToLatitude(_[3])), _;
	}
	toNormalizedPoint(e, t) {
		return this.projection.toNormalizedPoint(e, t);
	}
	toNormalizedRange(e) {
		return this.projection.toNormalizedRange(e);
	}
	toCartographicPoint(e, t) {
		return this.projection.toCartographicPoint(e, t);
	}
	toCartographicRange(e) {
		return this.projection.toCartographicRange(e);
	}
	clampToContentBounds(e, t = !1) {
		let n = [...e], [r, i, a, o] = this.getContentBounds(t);
		return n[0] = j.clamp(n[0], r, a), n[1] = j.clamp(n[1], i, o), n[2] = j.clamp(n[2], r, a), n[3] = j.clamp(n[3], i, o), n;
	}
	clampToBounds(e, t = !1) {
		return this.projection.clampToBounds(e, t);
	}
}, Be = Symbol("TILE_X"), Ve = Symbol("TILE_Y"), He = Symbol("TILE_LEVEL"), Ue = 30, We = 15, Ge = 20, Ke = Symbol("OVERLAY_RANGE"), qe = Symbol("OVERLAY_LEVEL"), Je = /* @__PURE__ */ new F(), Ye = /* @__PURE__ */ new F(), Xe = /* @__PURE__ */ new Ce(), Ze = class {
	constructor(e = {}) {
		let { overlay: t = null, shape: n = "ellipsoid", endCaps: r = !0, center: i = !0, useRecommendedSettings: a = !0, applyOverlayTexture: o = !1 } = e;
		this.priority = -10, this.tiles = null, this.overlay = t, this.shape = n, this.endCaps = r, this.center = i, this.useRecommendedSettings = a, this.applyOverlayTexture = o, this._tiling = null;
	}
	init(e) {
		this.useRecommendedSettings && (e.errorTarget = 1), this.tiles = e;
	}
	async loadRootTileset() {
		let { overlay: e } = this;
		return e ? (await e.init(), this._tiling = e.tiling || this._createDefaultTiling()) : this._tiling = this._createDefaultTiling(), this.getTileset();
	}
	async parseToMesh(e, t, n, r, i) {
		if (n !== "generated_surface") return null;
		let a;
		a = this._useEllipsoid() ? this._createEllipsoidMesh(t) : this._createPlanarMesh(t);
		let { overlay: o, applyOverlayTexture: s } = this;
		if (o && s) {
			let e = t[Be], n = t[Ve], r = t[He], s = this._tiling.getTileBounds(e, n, r, !0, !1);
			if (o.hasContent(s, r)) {
				try {
					await o.lockTexture(s, r);
				} catch (e) {
					if (e.name !== "AbortError") throw e;
					return null;
				}
				let e = o.getTexture(s, r);
				if (t[Ke] = s, t[qe] = r, i.aborted) return o.releaseTexture(s, r), delete t[Ke], delete t[qe], null;
				a.material.map = e, a.material.needsUpdate = !0;
			}
		}
		return a;
	}
	preprocessNode(e) {
		let t = this._tiling.maxLevel;
		e[He] < t && e.parent !== null && this.expandChildren(e);
	}
	disposeTile(e) {
		let t = e[Ke];
		this.overlay && t && (this.overlay.releaseTexture(t, e[qe]), delete e[Ke], delete e[qe]);
	}
	dispose() {
		this.tiles.forEachLoadedModel((e, t) => {
			this.disposeTile(t);
		});
	}
	getCartographicFromPosition(e, t = {}) {
		let { _tiling: n } = this, { projection: r } = n;
		if (!r.isCartographic) throw Error("GeneratedSurfacePlugin: getCartographicFromPosition requires a cartographic projection.");
		if (this._useEllipsoid()) return this.tiles.ellipsoid.getPositionToCartographic(e, t);
		let { center: i } = this, a = e.x / n.aspectRatio + (i ? .5 : 0), o = e.y + (i ? .5 : 0);
		return t.lat = r.convertNormalizedToLatitude(o), t.lon = r.convertNormalizedToLongitude(a), t;
	}
	getPositionFromCartographic(e, t, n = new F()) {
		let { _tiling: r } = this, { projection: i } = r;
		if (!i.isCartographic) throw Error("GeneratedSurfacePlugin: getPositionFromCartographic requires a cartographic projection.");
		if (this._useEllipsoid()) return this.tiles.ellipsoid.getCartographicToPosition(e, t, 0, n);
		let { center: a } = this, o = i.convertLongitudeToNormalized(t), s = i.convertLatitudeToNormalized(e);
		return n.x = (o - (a ? .5 : 0)) * r.aspectRatio, n.y = s - (a ? .5 : 0), n.z = 0, n;
	}
	_useEllipsoid() {
		return this._tiling.projection.isCartographic && this.shape === "ellipsoid";
	}
	_createPlanarMesh(e) {
		let t = e[Be], n = e[Ve], r = e[He], i = e.boundingVolume.box, a = 1, o = 1, s = 0, c = 0, l = 0;
		i && ([s, c, l] = i, a = i[3], o = i[7]);
		let u = new fe(2 * a, 2 * o), d = new le(u, new N());
		d.position.set(s, c, l);
		let f = this._tiling.getTileContentUVBounds(t, n, r), { uv: p } = u.attributes;
		for (let e = 0; e < p.count; e++) p.setXY(e, j.mapLinear(p.getX(e), 0, 1, f[0], f[2]), j.mapLinear(p.getY(e), 0, 1, f[1], f[3]));
		return d;
	}
	_createEllipsoidMesh(e) {
		let { tiles: t, endCaps: n, _tiling: r } = this, { projection: i } = r, a = e[He], o = e[Be], s = e[Ve], [c, l, u, d] = e.boundingVolume.region, f = Math.max(We, Math.ceil((d - l) * j.RAD2DEG * .25)), p = Math.max(Ue, Math.ceil((u - c) * j.RAD2DEG * .25)), m = p + 3, h = f + 3, g = new fe(1, 1, p + 2, f + 2), [_, v, y, b] = r.getTileBounds(o, s, a, !0, !0), x = r.getTileContentUVBounds(o, s, a), { position: S, normal: C, uv: w } = g.attributes, T = S.count;
		e.engineData.boundingVolume.getSphere(Xe);
		for (let r = 0; r < T; r++) {
			let a = r % m, o = Math.floor(r / m), s = a === 0 || a === m - 1 || o === 0 || o === h - 1, c = Math.max(1, Math.min(m - 2, a)), u = Math.max(1, Math.min(h - 2, o)), g = (c - 1) / p, T = 1 - (u - 1) / f, E = i.convertNormalizedToLongitude(j.mapLinear(g, 0, 1, _, y)), D = i.convertNormalizedToLatitude(j.mapLinear(T, 0, 1, v, b));
			if (i.isMercator && n && (b === 1 && T === 1 && (D = Math.PI / 2), v === 0 && T === 0 && (D = -Math.PI / 2)), i.isMercator && T !== 0 && T !== 1) {
				let e = i.convertNormalizedToLatitude(1), t = 1 / f, n = j.mapLinear(T - t, 0, 1, l, d), r = j.mapLinear(T + t, 0, 1, l, d);
				D > e && n < e && (D = e), D < -e && r > -e && (D = -e);
			}
			t.ellipsoid.getCartographicToPosition(D, E, 0, Je).sub(Xe.center), t.ellipsoid.getCartographicToNormal(D, E, Ye), s && Je.addScaledVector(Ye, -e.geometricError);
			let O = j.mapLinear(i.convertLongitudeToNormalized(E), _, y, x[0], x[2]), k = j.mapLinear(i.convertLatitudeToNormalized(D), v, b, x[1], x[3]);
			S.setXYZ(r, Je.x, Je.y, Je.z), C.setXYZ(r, Ye.x, Ye.y, Ye.z), w.setXY(r, O, k);
		}
		let E = new le(g, new N());
		return E.position.copy(Xe.center), E;
	}
	getTileset() {
		let { tiles: e, _tiling: t } = this, n = t.minLevel, { tileCountX: r, tileCountY: i } = t.getLevel(n), a = [];
		for (let e = 0; e < r; e++) for (let t = 0; t < i; t++) {
			let r = this.createChild(e, t, n);
			r !== null && a.push(r);
		}
		let o = {
			asset: { version: "1.1" },
			geometricError: Infinity,
			root: {
				refine: "REPLACE",
				geometricError: Infinity,
				boundingVolume: this.createBoundingVolume(0, 0, -1),
				children: a,
				[He]: -1,
				[Be]: 0,
				[Ve]: 0
			}
		};
		return e.preprocessTileset(o, ""), o;
	}
	getUrl() {
		return "tile.generated_surface";
	}
	fetchData(e) {
		if (/generated_surface/.test(e)) return /* @__PURE__ */ new ArrayBuffer();
	}
	createBoundingVolume(e, t, n, r = 0) {
		let { _tiling: i } = this, a = n === -1;
		if (this._useEllipsoid()) {
			let { endCaps: o } = this, s, c;
			return a ? (s = i.getContentBounds(!0), c = i.getContentBounds()) : (s = i.getTileBounds(e, t, n, !0, !0), c = i.getTileBounds(e, t, n, !1, !0)), o && (s[3] === 1 && (c[3] = Math.PI / 2), s[1] === 0 && (c[1] = -Math.PI / 2)), { region: [
				...c,
				-r,
				1
			] };
		} else {
			let { center: r } = this, o;
			o = a ? i.getContentBounds(!0) : i.getTileBounds(e, t, n, !0);
			let [s, c, l, u] = o, d = (l - s) / 2, f = (u - c) / 2, p = s + d, m = c + f;
			return r && (p -= .5, m -= .5), p *= i.aspectRatio, d *= i.aspectRatio, { box: [
				p,
				m,
				0,
				d,
				0,
				0,
				0,
				f,
				0,
				0,
				0,
				0
			] };
		}
	}
	createChild(e, t, n) {
		let { _tiling: r } = this, { projection: i } = r;
		if (!r.getTileExists(e, t, n)) return null;
		let a, o = this._useEllipsoid();
		if (o) {
			let [o, s, c, l] = r.getTileBounds(e, t, n, !0), { tilePixelWidth: u, tilePixelHeight: d } = r.getLevel(n), f = (c - o) / u, p = (l - s) / d, [, m, h, g] = r.getTileBounds(e, t, n), _ = m > 0 == g > 0 ? Math.min(Math.abs(m), Math.abs(g)) : 0, v = i.convertLatitudeToNormalized(_), y = i.getLongitudeDerivativeAtNormalized(o), b = i.getLatitudeDerivativeAtNormalized(v), [x, S] = Le(this.tiles.ellipsoid, _, h);
			a = Math.max(f * y * x, p * b * S);
		} else {
			let { pixelWidth: e, pixelHeight: t } = r.getLevel(n);
			a = Math.max(r.aspectRatio / e, 1 / t);
		}
		return {
			refine: "REPLACE",
			geometricError: a,
			boundingVolume: this.createBoundingVolume(e, t, n, o ? a : 0),
			content: { uri: this.getUrl(e, t, n) },
			children: [],
			[Be]: e,
			[Ve]: t,
			[He]: n
		};
	}
	expandChildren(e) {
		let t = e[He], n = e[Be], r = e[Ve], { tileSplitX: i, tileSplitY: a } = this._tiling.getLevel(t);
		for (let o = 0; o < i; o++) for (let s = 0; s < a; s++) {
			let c = this.createChild(i * n + o, a * r + s, t + 1);
			c && e.children.push(c);
		}
	}
	_createDefaultTiling() {
		let e = new ze();
		if (this.shape === "ellipsoid") {
			let t = new L("EPSG:3857");
			e.setProjection(t), e.generateLevels(Ge, t.tileCountX, t.tileCountY);
		} else {
			let t = new L("none");
			e.setProjection(t), e.generateLevels(Ge, 1, 1);
		}
		return e;
	}
}, Qe = class extends DOMException {
	constructor() {
		super("DataCache: Item removed", "AbortError");
	}
};
function $e(...e) {
	return e.join("_");
}
var et = class {
	constructor() {
		this.cache = {}, this.count = 0, this.cachedBytes = 0, this.active = 0;
	}
	fetchItem(e, t) {}
	disposeItem(e, t) {}
	getMemoryUsage(e) {
		return 0;
	}
	setData(...e) {
		let { cache: t } = this, n = e.pop(), r = $e(...e);
		if (r in t) throw Error(`DataCache: "${r}" is already present.`);
		return this.cache[r] = {
			abortController: new AbortController(),
			result: n,
			count: 1,
			bytes: this.getMemoryUsage(n)
		}, this.count++, this.cachedBytes += this.cache[r].bytes, n;
	}
	lock(...e) {
		let { cache: t } = this, n = $e(...e);
		if (n in t) t[n].count++;
		else {
			let t = new AbortController(), r = {
				abortController: t,
				result: null,
				count: 1,
				bytes: 0,
				args: e
			};
			this.active++, r.result = this.fetchItem(e, t.signal), r.result instanceof Promise ? r.result = r.result.then((e) => (t.signal.throwIfAborted(), r.result = e, r.bytes = this.getMemoryUsage(e), this.cachedBytes += r.bytes, e)).finally(() => {
				this.active--;
			}) : (this.active--, r.bytes = this.getMemoryUsage(r.result), this.cachedBytes += r.bytes), this.cache[n] = r, this.count++;
		}
		return t[n].result;
	}
	release(...e) {
		let t = $e(...e);
		this.releaseViaFullKey(t);
	}
	get(...e) {
		let { cache: t } = this, n = $e(...e);
		return n in t && t[n].count > 0 ? t[n].result : null;
	}
	has(...e) {
		let { cache: t } = this;
		return $e(...e) in t;
	}
	forEachItem(e) {
		let { cache: t } = this;
		for (let n in t) {
			let r = t[n];
			r.result instanceof Promise || e(r.result, r.args);
		}
	}
	dispose() {
		let { cache: e } = this;
		for (let t in e) {
			let { abortController: n } = e[t];
			n.abort(new Qe()), this.releaseViaFullKey(t, !0);
		}
		this.cache = {};
	}
	releaseViaFullKey(e, t = !1) {
		let { cache: n } = this;
		if (e in n && n[e].count > 0) {
			let r = n[e];
			if (r.count--, r.count === 0 || t) {
				let i = () => {
					if (n[e] !== r) return;
					let { result: t, abortController: i } = r;
					i.abort(new Qe()), t instanceof Promise ? t.then((e) => {
						this.disposeItem(e, r.args);
					}).catch(() => {
						this.disposeItem(null, r.args);
					}).finally(() => {
						this.count--, this.cachedBytes -= r.bytes;
					}) : (this.disposeItem(t, r.args), this.count--, this.cachedBytes -= r.bytes), delete n[e];
				};
				t ? i() : queueMicrotask(() => {
					r.count === 0 && i();
				});
			}
			return !0;
		}
		throw Error("DataCache: Attempting to release key that does not exist");
	}
}, tt = class extends et {
	constructor(e = {}) {
		super();
		let { fetchOptions: t = {} } = e;
		this.tiling = new ze(), this.fetchOptions = t, this.fetchData = (...e) => fetch(...e);
	}
	init() {}
	async processBufferToTexture(e) {
		let t = new Blob([e]), n = new Te(await createImageBitmap(t, {
			premultiplyAlpha: "none",
			colorSpaceConversion: "none",
			imageOrientation: "flipY"
		}));
		return n.generateMipmaps = !1, n.colorSpace = be, n.needsUpdate = !0, n;
	}
	getMemoryUsage(e) {
		let { format: t, type: n, image: r, generateMipmaps: i } = e, { width: a, height: o } = r, s = Ee.getByteLength(a, o, t, n);
		return i ? s * 4 / 3 : s;
	}
	fetchItem(e, t) {
		let n = {
			...this.fetchOptions,
			signal: t
		}, r = this.getUrl(...e);
		return this.fetchData(r, n).then((e) => e.arrayBuffer()).then((e) => this.processBufferToTexture(e));
	}
	disposeItem(e) {
		e && (e.dispose(), e.image instanceof ImageBitmap && e.image.close());
	}
	getUrl(...e) {}
}, nt = class extends tt {
	constructor(e = {}) {
		let { levels: t = 20, tileDimension: n = 256, projection: r = "EPSG:3857", url: i = null, ...a } = e;
		super(a), this.tileDimension = n, this.levels = t, this.projection = r, this.url = i;
	}
	getUrl(e, t, n) {
		return this.url.replace(/{\s*z\s*}/gi, n).replace(/{\s*x\s*}/gi, e).replace(/{\s*(y|reverseY|-\s*y)\s*}/gi, t);
	}
	init() {
		let { tiling: e, tileDimension: t, levels: n, url: r, projection: i } = this;
		return e.flipY = !/{\s*reverseY|-\s*y\s*}/g.test(r), e.setProjection(new L(i)), e.setContentBounds(...e.projection.getBounds()), Array.isArray(n) ? n.forEach((n, r) => {
			n !== null && e.setLevel(r, {
				tilePixelWidth: t,
				tilePixelHeight: t,
				...n
			});
		}) : e.generateLevels(n, e.projection.tileCountX, e.projection.tileCountY, {
			tilePixelWidth: t,
			tilePixelHeight: t
		}), this.url = r, Promise.resolve();
	}
}, rt = class extends nt {
	constructor(e = {}) {
		let { subdomains: t = ["t0"], ...n } = e;
		super(n), this.subdomains = t, this.subDomainIndex = 0;
	}
	getUrl(e, t, n) {
		return this.url.replace(/{\s*subdomain\s*}/gi, this._getSubdomain()).replace(/{\s*quadkey\s*}/gi, this._tileToQuadKey(e, t, n));
	}
	_tileToQuadKey(e, t, n) {
		let r = "";
		for (let i = n; i > 0; i--) {
			let n = 0, a = 1 << i - 1;
			(e & a) !== 0 && (n += 1), (t & a) !== 0 && (n += 2), r += n.toString();
		}
		return r;
	}
	_getSubdomain() {
		return this.subDomainIndex = (this.subDomainIndex + 1) % this.subdomains.length, this.subdomains[this.subDomainIndex];
	}
}, it = class extends tt {
	constructor(e = {}) {
		let { url: t = null, ...n } = e;
		super(n), this.tileSets = null, this.extension = null, this.url = t;
	}
	getUrl(e, t, n) {
		let { url: r, extension: i, tileSets: a, tiling: o } = this;
		return new URL(`${parseInt(a[n - o.minLevel].href)}/${e}/${t}.${i}`, r).toString();
	}
	init() {
		let { url: e } = this;
		return this.fetchData(new URL("tilemapresource.xml", e), this.fetchOptions).then((e) => e.text()).then((t) => {
			let { tiling: n } = this, r = new DOMParser().parseFromString(t, "text/xml"), i = r.querySelector("BoundingBox"), a = r.querySelector("TileFormat"), o = [...r.querySelector("TileSets").querySelectorAll("TileSet")].map((e) => ({
				href: parseInt(e.getAttribute("href")),
				unitsPerPixel: parseFloat(e.getAttribute("units-per-pixel")),
				order: parseInt(e.getAttribute("order"))
			})).sort((e, t) => e.order - t.order), s = parseFloat(i.getAttribute("minx")) * j.DEG2RAD, c = parseFloat(i.getAttribute("maxx")) * j.DEG2RAD, l = parseFloat(i.getAttribute("miny")) * j.DEG2RAD, u = parseFloat(i.getAttribute("maxy")) * j.DEG2RAD, d = parseInt(a.getAttribute("width")), f = parseInt(a.getAttribute("height")), p = a.getAttribute("extension"), m = r.querySelector("SRS").textContent;
			this.extension = p, this.url = e, this.tileSets = o, n.setProjection(new L(m)), n.setContentBounds(s, l, c, u), o.forEach(({ order: e }) => {
				n.setLevel(e, {
					tileCountX: n.projection.tileCountX * 2 ** e,
					tilePixelWidth: d,
					tilePixelHeight: f
				});
			});
		});
	}
};
//#endregion
//#region src/three/plugins/images/overlays/utils.js
function R(e, t, n, r) {
	let [i, a, o, s] = e;
	a += 1e-8, i += 1e-8, s -= 1e-8, o -= 1e-8;
	let c = Math.max(Math.min(t, n.maxLevel), n.minLevel), [l, u, d, f] = n.getTilesInRange(i, a, o, s, c, !0);
	for (let e = l; e <= d; e++) for (let t = u; t <= f; t++) r(e, t, c);
}
function at(e, t, n) {
	let r = new F(), i = {}, a = [], o = e.getAttribute("position");
	e.computeBoundingBox(), e.boundingBox.getCenter(r).applyMatrix4(t), n.getPositionToCartographic(r, i);
	let s = i.lat || 0, c = i.lon || 0, l = Infinity, u = Infinity, d = Infinity, f = -Infinity, p = -Infinity, m = -Infinity;
	for (let e = 0; e < o.count; e++) r.fromBufferAttribute(o, e).applyMatrix4(t), n.getPositionToCartographic(r, i), Math.abs(Math.abs(i.lat) - Math.PI / 2) < 1e-5 && (i.lon = c), Math.abs(c - i.lon) > Math.PI && (i.lon += Math.sign(c - i.lon) * Math.PI * 2), Math.abs(s - i.lat) > Math.PI && (i.lat += Math.sign(s - i.lat) * Math.PI * 2), a.push(i.lon, i.lat, i.height), l = Math.min(l, i.lat), f = Math.max(f, i.lat), u = Math.min(u, i.lon), p = Math.max(p, i.lon), d = Math.min(d, i.height), m = Math.max(m, i.height);
	let h = [
		u,
		l,
		p,
		f
	];
	return {
		uv: a,
		range: h,
		region: [
			...h,
			d,
			m
		]
	};
}
function ot(e, t, n = null, r = null, i = null) {
	let a = Infinity, o = Infinity, s = Infinity, c = -Infinity, l = -Infinity, u = -Infinity, d = [], f = new M();
	if (e.forEach((e) => {
		f.copy(e.matrixWorld), n && f.premultiply(n);
		let { uv: r, region: i } = at(e.geometry, f, t);
		d.push(r), a = Math.min(a, i[1]), c = Math.max(c, i[3]), o = Math.min(o, i[0]), l = Math.max(l, i[2]), s = Math.min(s, i[4]), u = Math.max(u, i[5]);
	}), r !== null) {
		i === null && (i = r.clampToBounds([
			o,
			a,
			l,
			c
		]), i = r.toNormalizedRange(i));
		let [e, t, n, f] = i;
		d.forEach((i) => {
			for (let a = 0, o = i.length; a < o; a += 3) {
				let o = i[a + 0], c = i[a + 1], l = i[a + 2], [d, p] = r.toNormalizedPoint(o, c);
				d = j.clamp(d, 0, 1), p = j.clamp(p, 0, 1), i[a + 0] = j.mapLinear(d, e, n, 0, 1), i[a + 1] = j.mapLinear(p, t, f, 0, 1), i[a + 2] = j.mapLinear(l, s, u, 0, 1);
			}
		});
	}
	return {
		uvs: d,
		range: i,
		region: [
			o,
			a,
			l,
			c,
			s,
			u
		]
	};
}
function st(e, t) {
	let n = new F(), r = [], i = e.getAttribute("position"), a = Infinity, o = Infinity, s = Infinity, c = -Infinity, l = -Infinity, u = -Infinity;
	for (let e = 0; e < i.count; e++) n.fromBufferAttribute(i, e).applyMatrix4(t), r.push(n.x, n.y, n.z), a = Math.min(a, n.x), c = Math.max(c, n.x), o = Math.min(o, n.y), l = Math.max(l, n.y), s = Math.min(s, n.z), u = Math.max(u, n.z);
	return {
		uv: r,
		range: [
			a,
			o,
			c,
			l
		],
		heightRange: [s, u]
	};
}
function ct(e, t) {
	let n = Infinity, r = Infinity, i = Infinity, a = -Infinity, o = -Infinity, s = -Infinity, c = [], l = new M();
	return e.forEach((e) => {
		l.copy(e.matrixWorld), t && l.premultiply(t);
		let { uv: u, range: d, heightRange: f } = st(e.geometry, l);
		c.push(u), n = Math.min(n, d[0]), a = Math.max(a, d[2]), r = Math.min(r, d[1]), o = Math.max(o, d[3]), i = Math.min(i, f[0]), s = Math.max(s, f[1]);
	}), c.forEach((e) => {
		for (let t = 0, i = e.length; t < i; t += 3) {
			let i = e[t + 0], s = e[t + 1];
			e[t + 0] = j.mapLinear(i, n, a, 0, 1), e[t + 1] = j.mapLinear(s, r, o, 0, 1);
		}
	}), {
		uvs: c,
		range: [
			n,
			r,
			a,
			o
		],
		heightRange: [i, s]
	};
}
//#endregion
//#region src/three/plugins/images/overlays/wrapOverlaysMaterial.js
var lt = Symbol("OVERLAY_PARAMS");
function ut(e, t) {
	if (e[lt]) return e[lt];
	let n = {
		layerMaps: { value: [] },
		layerInfo: { value: [] }
	};
	return e[lt] = n, e.defines = {
		...e.defines || {},
		LAYER_COUNT: 0
	}, e.onBeforeCompile = (e) => {
		t && t(e), e.uniforms = {
			...e.uniforms,
			...n
		}, e.vertexShader = e.vertexShader.replace(/void main\(\s*\)\s*{/, (e) => `

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							attribute vec3 layer_uv_UNROLLED_LOOP_INDEX;
							varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

						#endif


					}
				#pragma unroll_loop_end

				${e}

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							v_layer_uv_UNROLLED_LOOP_INDEX = layer_uv_UNROLLED_LOOP_INDEX;

						#endif

					}
				#pragma unroll_loop_end

			`), e.fragmentShader = e.fragmentShader.replace(/void main\(/, (e) => `

				#if LAYER_COUNT != 0
					struct LayerInfo {
						vec3 color;
						float opacity;

						int alphaMask;
						int alphaInvert;
					};

					uniform sampler2D layerMaps[ LAYER_COUNT ];
					uniform LayerInfo layerInfo[ LAYER_COUNT ];
				#endif

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

						#endif

					}
				#pragma unroll_loop_end

				${e}

			`).replace(/#include <color_fragment>/, (e) => `

				${e}

				#if LAYER_COUNT != 0
				{
					vec4 tint;
					vec3 layerUV;
					float layerOpacity;
					float wOpacity;
					float wDelta;
					#pragma unroll_loop_start
						for ( int i = 0; i < 10; i ++ ) {

							#if UNROLLED_LOOP_INDEX < LAYER_COUNT

								layerUV = v_layer_uv_UNROLLED_LOOP_INDEX;
								tint = texture( layerMaps[ i ], layerUV.xy );

								// discard texture outside 0, 1 on w - offset the stepped value by an epsilon to avoid cases
								// where wDelta is near 0 (eg a flat surface) at the w boundary, resulting in artifacts on some
								// hardware.
								wDelta = max( fwidth( layerUV.z ), 1e-7 );
								wOpacity =
									smoothstep( - wDelta, 0.0, layerUV.z ) *
									smoothstep( 1.0 + wDelta, 1.0, layerUV.z );

								// apply tint & opacity
								tint.rgb *= layerInfo[ i ].color;
								tint.rgba *= layerInfo[ i ].opacity * wOpacity;

								// invert the alpha
								if ( layerInfo[ i ].alphaInvert > 0 ) {

									tint.a = 1.0 - tint.a;

								}

								// apply the alpha across all existing layers if alpha mask is true
								if ( layerInfo[ i ].alphaMask > 0 ) {

									diffuseColor.a *= tint.a;

								} else {

									tint.rgb *= tint.a;
									diffuseColor = tint + diffuseColor * ( 1.0 - tint.a );

								}

							#endif

						}
					#pragma unroll_loop_end
				}
				#endif
			`);
	}, n;
}
//#endregion
//#region src/three/plugins/utilities/GeometryClipper.js
var z = 0, dt = [
	"a",
	"b",
	"c"
], B = /* @__PURE__ */ new I(), ft = /* @__PURE__ */ new I(), pt = /* @__PURE__ */ new I(), mt = /* @__PURE__ */ new I(), ht = class {
	constructor() {
		this.attributeList = null, this.splitOperations = [], this.trianglePool = new gt();
	}
	forEachSplitPermutation(e) {
		let { splitOperations: t } = this, n = (r = 0) => {
			if (r >= t.length) {
				e();
				return;
			}
			t[r].keepPositive = !0, n(r + 1), t[r].keepPositive = !1, n(r + 1);
		};
		n();
	}
	addSplitOperation(e, t = !0) {
		this.splitOperations.push({
			callback: e,
			keepPositive: t
		});
	}
	clearSplitOperations() {
		this.splitOperations.length = 0;
	}
	clipObject(e) {
		let t = e.clone(), n = [];
		return t.traverse((e) => {
			e.isMesh && (e.geometry = this.clip(e).geometry, (e.geometry.index ? e.geometry.index.count / 3 : e.attributes.position.count / 3) == 0 && n.push(e));
		}), n.forEach((e) => {
			e.removeFromParent();
		}), t;
	}
	clip(e, t = null) {
		let n = this.getClippedData(e, t);
		return this.constructMesh(n.attributes, n.index, e);
	}
	getClippedData(e, t = null, n = {}) {
		let { trianglePool: r, splitOperations: i, attributeList: a } = this, o = e.geometry, s = o.attributes.position, c = o.index, l = 0, u = {};
		n.index = n.index || [], n.vertexIsClipped = n.vertexIsClipped || [], n.attributes = n.attributes || {};
		for (let e in o.attributes) a !== null && (a instanceof Function && !a(e) || Array.isArray(a) && !a.includes(e)) || (n.attributes[e] = []);
		let d = 0, f = c ? c.count : s.count;
		t !== null && (d = t.start, f = t.count);
		for (let t = d, n = d + f; t < n; t += 3) {
			let n = t + 0, a = t + 1, s = t + 2;
			c && (n = c.getX(n), a = c.getX(a), s = c.getX(s));
			let l = r.get();
			l.initFromIndices(n, a, s);
			let u = [l];
			for (let t = 0; t < i.length; t++) {
				let { keepPositive: n, callback: r } = i[t], a = [];
				for (let t = 0; t < u.length; t++) {
					let i = u[t], { indices: s, barycoord: c } = i;
					i.clipValues.a = r(o, s.a, s.b, s.c, c.a, e.matrixWorld), i.clipValues.b = r(o, s.a, s.b, s.c, c.b, e.matrixWorld), i.clipValues.c = r(o, s.a, s.b, s.c, c.c, e.matrixWorld), this.splitTriangle(i, !n, a);
				}
				u = a;
			}
			for (let e = 0, t = u.length; e < t; e++) {
				let t = u[e];
				p(t, o);
			}
			r.reset();
		}
		return n;
		function p(e, t) {
			for (let r = 0; r < 3; r++) {
				let i = e.getVertexHash(r, t);
				i in u || (u[i] = l, l++, e.getVertexData(r, t, n.attributes), n.vertexIsClipped.push(e.clipValues[dt[r]] === z));
				let a = u[i];
				n.index.push(a);
			}
		}
	}
	constructMesh(e, t, n) {
		let r = n.geometry, i = new S(), a = e.position.length / 3 > 65535 ? new Uint32Array(t) : new Uint16Array(t);
		i.setIndex(new x(a, 1, !1));
		for (let t in e) {
			let n = r.getAttribute(t), a = new x(new n.array.constructor(e[t]), n.itemSize, n.normalized);
			a.gpuType = n.gpuType, i.setAttribute(t, a);
		}
		let o = new le(i, n.material.clone());
		return o.position.copy(n.position), o.quaternion.copy(n.quaternion), o.scale.copy(n.scale), o;
	}
	splitTriangle(e, t, n) {
		let { trianglePool: r } = this, i = [], a = [], o = [];
		for (let t = 0; t < 3; t++) {
			let n = dt[t], r = dt[(t + 1) % 3], s = e.clipValues[n], c = e.clipValues[r];
			(s < z != c < z || s === z) && (i.push(t), a.push([n, r]), s === c ? o.push(0) : o.push(j.mapLinear(z, s, c, 0, 1)));
		}
		if (i.length !== 2) Math.min(e.clipValues.a, e.clipValues.b, e.clipValues.c) < z === t && n.push(e);
		else if (i.length === 2) {
			let s = r.get().initFromTriangle(e), c = r.get().initFromTriangle(e), l = r.get().initFromTriangle(e);
			(i[0] + 1) % 3 === i[1] ? (s.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), s.copyVertex(e, a[0][1], "b"), s.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "c"), s.clipValues.a = z, s.clipValues.c = z, c.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), c.copyVertex(e, a[1][1], "b"), c.copyVertex(e, a[0][0], "c"), c.clipValues.a = z, l.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), l.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "b"), l.copyVertex(e, a[1][1], "c"), l.clipValues.a = z, l.clipValues.b = z) : (s.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), s.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "b"), s.copyVertex(e, a[0][0], "c"), s.clipValues.a = z, s.clipValues.b = z, c.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), c.copyVertex(e, a[0][1], "b"), c.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "c"), c.clipValues.a = z, c.clipValues.c = z, l.copyVertex(e, a[0][1], "a"), l.copyVertex(e, a[1][0], "b"), l.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "c"), l.clipValues.c = z);
			let u, d;
			u = Math.min(s.clipValues.a, s.clipValues.b, s.clipValues.c), d = u < z, d === t && n.push(s), u = Math.min(c.clipValues.a, c.clipValues.b, c.clipValues.c), d = u < z, d === t && n.push(c), u = Math.min(l.clipValues.a, l.clipValues.b, l.clipValues.c), d = u < z, d === t && n.push(l);
		}
	}
}, gt = class {
	constructor() {
		this.pool = [], this.index = 0;
	}
	get() {
		if (this.index >= this.pool.length) {
			let e = new _t();
			this.pool.push(e);
		}
		let e = this.pool[this.index];
		return this.index++, e;
	}
	reset() {
		this.index = 0;
	}
}, _t = class {
	constructor() {
		this.indices = {
			a: -1,
			b: -1,
			c: -1
		}, this.clipValues = {
			a: -1,
			b: -1,
			c: -1
		}, this.barycoord = new De();
	}
	getVertexHash(e, t) {
		let { barycoord: n, indices: r } = this, i = n[dt[e]];
		if (i.x === 1) return r[dt[0]];
		if (i.y === 1) return r[dt[1]];
		if (i.z === 1) return r[dt[2]];
		{
			let { attributes: e } = t, n = "";
			for (let t in e) {
				let a = e[t];
				switch (vt(a, r.a, r.b, r.c, i, B), (t === "normal" || t === "tangent" || t === "bitangent") && B.normalize(), a.itemSize) {
					case 4:
						n += yt(B.x, B.y, B.z, B.w);
						break;
					case 3:
						n += yt(B.x, B.y, B.z);
						break;
					case 2:
						n += yt(B.x, B.y);
						break;
					case 1:
						n += yt(B.x);
						break;
				}
				n += "|";
			}
			return n;
		}
	}
	getVertexData(e, t, n) {
		let { barycoord: r, indices: i } = this, a = r[dt[e]], { attributes: o } = t;
		for (let e in o) {
			if (!n[e]) continue;
			let t = o[e], r = n[e];
			switch (vt(t, i.a, i.b, i.c, a, B), (e === "normal" || e === "tangent" || e === "bitangent") && B.normalize(), t.itemSize) {
				case 4:
					r.push(B.x, B.y, B.z, B.w);
					break;
				case 3:
					r.push(B.x, B.y, B.z);
					break;
				case 2:
					r.push(B.x, B.y);
					break;
				case 1:
					r.push(B.x);
					break;
			}
		}
	}
	initFromTriangle(e) {
		return this.initFromIndices(e.indices.a, e.indices.b, e.indices.c);
	}
	initFromIndices(e, t, n) {
		return this.indices.a = e, this.indices.b = t, this.indices.c = n, this.clipValues.a = -1, this.clipValues.b = -1, this.clipValues.c = -1, this.barycoord.a.set(1, 0, 0), this.barycoord.b.set(0, 1, 0), this.barycoord.c.set(0, 0, 1), this;
	}
	lerpVertexFromEdge(e, t, n, r, i) {
		this.clipValues[i] = j.lerp(e.clipValues[t], e.clipValues[n], r), this.barycoord[i].lerpVectors(e.barycoord[t], e.barycoord[n], r);
	}
	copyVertex(e, t, n) {
		this.clipValues[n] = e.clipValues[t], this.barycoord[n].copy(e.barycoord[t]);
	}
};
function vt(e, t, n, r, i, a) {
	switch (ft.fromBufferAttribute(e, t), pt.fromBufferAttribute(e, n), mt.fromBufferAttribute(e, r), a.set(0, 0, 0, 0).addScaledVector(ft, i.x).addScaledVector(pt, i.y).addScaledVector(mt, i.z), e.itemSize) {
		case 3:
			B.w = 0;
			break;
		case 2:
			B.w = 0, B.z = 0;
			break;
		case 1:
			B.w = 0, B.z = 0, B.y = 0;
			break;
	}
	return a;
}
function yt(...e) {
	let t = "";
	for (let n = 0, r = e.length; n < r; n++) t += ~~(e[n] * 1e5 + .5), n !== r - 1 && (t += "_");
	return t;
}
//#endregion
//#region src/three/plugins/images/sources/WMTSImageSource.js
var bt = class extends tt {
	constructor(e = {}) {
		let { layer: t = null, tileMatrixSet: n = "default", style: r = "default", url: i = null, format: a = "image/jpeg", dimensions: o = null, tileMatrixLabels: s = null, tileMatrices: c = null, projection: l = null, levels: u = 20, tileDimension: d = 256, contentBoundingBox: f = null, ...p } = e;
		super(p), this.layer = t, this.tileMatrixSet = n, this.style = r, this.url = i, this.format = a, this.dimensions = o, this.tileMatrixLabels = s, this.tileMatrices = c, this.projection = l, this.levels = u, this.tileDimension = d, this.contentBoundingBox = f, this._useKvp = !1;
	}
	_detectRequestMode(e) {
		return !/\{/.test(e);
	}
	init() {
		let { tiling: e, tileDimension: t, levels: n, dimensions: r, contentBoundingBox: i, tileMatrices: a, style: o, tileMatrixSet: s } = this, { url: c } = this, l = this.projection || "EPSG:3857";
		if (e.flipY = !0, e.setProjection(new L(l)), i === null ? e.setContentBounds(...e.projection.getBounds()) : e.setContentBounds(i[0], i[1], i[2], i[3]), Array.isArray(a) ? a.forEach((n, r) => {
			let i = n.tileWidth || t, a = n.tileHeight || t;
			e.setLevel(r, {
				tilePixelWidth: i,
				tilePixelHeight: a,
				tileCountX: n.matrixWidth,
				tileCountY: n.matrixHeight,
				tileBounds: n.tileBounds || n.bounds
			});
		}) : e.generateLevels(n, e.projection.tileCountX, e.projection.tileCountY, {
			tilePixelWidth: t,
			tilePixelHeight: t
		}), this._useKvp = this._detectRequestMode(c), !this._useKvp && (c = c.replace(/{\s*TileMatrixSet\s*}/gi, s).replace(/{\s*Style\s*}/gi, o), r)) for (let e in r) c = c.replace(RegExp(`{\\s*${e}\\s*}`, "gi"), r[e]);
		return this.url = c, Promise.resolve();
	}
	getUrl(e, t, n) {
		let { tileMatrices: r, tileMatrixLabels: i } = this, a;
		return a = r !== null && r.length > 0 ? r[n].identifier : i ? i[n] : n.toString(), this._useKvp ? this._buildKvpUrl(e, t, a) : this._buildRestfulUrl(e, t, a);
	}
	_buildRestfulUrl(e, t, n) {
		return this.url.replace(/{\s*TileMatrix\s*}/gi, n).replace(/{\s*TileCol\s*}/gi, e).replace(/{\s*TileRow\s*}/gi, t);
	}
	_buildKvpUrl(e, t, n) {
		let { dimensions: r, format: i } = this, a = this.url, o = new URLSearchParams({
			SERVICE: "WMTS",
			VERSION: "1.0.0",
			REQUEST: "GetTile",
			LAYER: this.layer,
			STYLE: this.style,
			TILEMATRIXSET: this.tileMatrixSet,
			TILEMATRIX: n,
			TILEROW: t,
			TILECOL: e,
			FORMAT: i
		});
		if (r) for (let e in r) o.set(e, r[e]);
		return a + (a.includes("?") ? "&" : "?") + o.toString();
	}
}, xt = class {
	constructor() {
		this.canvas = null, this.context = null, this.range = [
			0,
			0,
			1,
			1
		];
	}
	setTarget(e, t) {
		this.canvas = e.image, this.context = e.image.getContext("2d"), this.range = [...t];
	}
	draw(e, t) {
		let { canvas: n, range: r, context: i } = this, { width: a, height: o } = n, { image: s } = e, c = Math.round(j.mapLinear(t[0], r[0], r[2], 0, a)), l = Math.round(j.mapLinear(t[1], r[1], r[3], 0, o)), u = Math.round(j.mapLinear(t[2], r[0], r[2], 0, a)), d = Math.round(j.mapLinear(t[3], r[1], r[3], 0, o)), f = u - c, p = d - l;
		s instanceof ImageBitmap ? (i.save(), i.translate(c, o - l), i.scale(1, -1), i.drawImage(s, 0, 0, f, p), i.restore()) : i.drawImage(s, c, o - l, f, -p);
	}
	clear() {
		let { context: e, canvas: t } = this;
		e.clearRect(0, 0, t.width, t.height);
	}
}, St = 1e-10;
function Ct(e, t, n = 0) {
	if (e.length !== t.length) return !1;
	for (let r = 0, i = e.length; r < i; r++) if (Math.abs(e[r] - t[r]) > n) return !1;
	return !0;
}
var wt = class extends et {
	hasContent(...e) {
		return !0;
	}
}, Tt = class extends wt {
	constructor(e) {
		super(), this.tiledImageSource = e, this.tileComposer = new xt(), this.resolution = 256;
	}
	hasContent(e, t, n, r, i) {
		let a = this.tiledImageSource.tiling, o = 0;
		return R([
			e,
			t,
			n,
			r
		], i, a, () => {
			o++;
		}), o !== 0;
	}
	async fetchItem([e, t, n, r, i], a) {
		let { tiledImageSource: o, tileComposer: s } = this, c = [
			e,
			t,
			n,
			r
		], l = o.tiling;
		await this._markImages(c, i, !1), a?.throwIfAborted();
		let u = null;
		if (R(c, i, l, (e, t, n) => {
			Ct(l.getTileBounds(e, t, n, !0, !1), c, St) && (u = [
				e,
				t,
				n
			]);
		}), u !== null) {
			let [e, t, n] = u;
			return o.get(e, t, n).clone();
		}
		let d = document.createElement("canvas");
		d.width = this.resolution, d.height = this.resolution;
		let f = new C(d);
		return f.colorSpace = be, f.generateMipmaps = !1, s.setTarget(f, c), s.clear(16777215, 0), R(c, i, l, (e, t, n) => {
			let r = l.getTileBounds(e, t, n, !0, !1), i = o.get(e, t, n);
			s.draw(i, r);
		}), f;
	}
	disposeItem(e, [t, n, r, i, a]) {
		e && e.dispose(), this._markImages([
			t,
			n,
			r,
			i
		], a, !0);
	}
	dispose() {
		super.dispose(), this.tiledImageSource.dispose();
	}
	_markImages(e, t, n = !1) {
		let r = this.tiledImageSource, i = r.tiling, a = [];
		R(e, t, i, (e, t, i) => {
			n ? r.release(e, t, i) : a.push(r.lock(e, t, i));
		});
		let o = a.filter((e) => e instanceof Promise);
		return o.length === 0 ? null : Promise.all(o);
	}
}, Et = Object.freeze({
	fill: "#cccccc",
	stroke: "transparent",
	strokeWidth: 1,
	radius: 2,
	order: 0,
	visible: !0
}), Dt = class {
	static get DEFAULT_STYLE() {
		return Et;
	}
	get fill() {
		return this._ctx.fillStyle;
	}
	set fill(e) {
		this._ctx.fillStyle = e;
	}
	get stroke() {
		return this._ctx.strokeStyle;
	}
	set stroke(e) {
		this._ctx.strokeStyle = e;
	}
	get strokeWidth() {
		return this._ctx.lineWidth;
	}
	set strokeWidth(e) {
		this._ctx.lineWidth = e;
	}
	constructor(e = {}) {
		let { getX: t = (e) => e.x, getY: n = (e) => e.y, flipY: r = !1, tileExtent: i = null } = e;
		this.getX = t, this.getY = n, this.flipY = r, this.tileExtent = i, this.radius = Et.radius, this.visible = !0, this._invScale = 1, this._ctx = null;
	}
	setFrame(e, t, n) {
		e.restore();
		let [r, i, a, o] = t, [s, c, l, u] = n, { width: d, height: f } = e.canvas, { flipY: p, tileExtent: m } = this, h = m ?? a - r, g = m ?? o - i, _ = Math.round(d * (r - s) / (l - s)), v = Math.round(d * (a - s) / (l - s)), y = Math.round(f * (u - o) / (u - c)), b = Math.round(f * (u - i) / (u - c)), x = (v - _) / h, S = (p ? -1 : 1) * (b - y) / g, C = m ? 0 : r, w = m ? 0 : p ? o : i, T = _ - C * x, E = y - w * S;
		e.save(), e.setTransform(x, 0, 0, S, T, E), e.beginPath(), e.rect(C, m ? 0 : i, h, g), e.clip(), e.clearRect(C, m ? 0 : i, h, g), this._ctx = e, this._invScale = 1 / x;
	}
	setStyle(e) {
		let { _invScale: t } = this;
		this.fill = e?.fill ?? Et.fill, this.stroke = e?.stroke ?? Et.stroke, this.strokeWidth = (e?.strokeWidth ?? Et.strokeWidth) * t, this.radius = (e?.radius ?? Et.radius) * t, this.visible = e ? e?.visible ?? Et.visible : !1;
	}
	_renderPoints(e, t = 1) {
		let { _ctx: n, radius: r, getX: i, getY: a, visible: o } = this;
		if (o) {
			for (let o of e) for (let e of o) {
				let o = i(e), s = a(e);
				n.beginPath(), n.ellipse(o, s, r / t, r, 0, 0, Math.PI * 2), n.fill();
			}
			n.stroke();
		}
	}
	_renderLines(e) {
		let { _ctx: t, getX: n, getY: r, visible: i } = this;
		if (i) {
			if (e instanceof Path2D) {
				t.stroke(e);
				return;
			}
			t.beginPath();
			for (let i of e) for (let e = 0; e < i.length; e++) e === 0 ? t.moveTo(n(i[e]), r(i[e])) : t.lineTo(n(i[e]), r(i[e]));
			t.stroke();
		}
	}
	_renderPolygons(e) {
		let { _ctx: t, getX: n, getY: r, visible: i } = this;
		if (i) {
			if (e instanceof Path2D) {
				t.fill(e, "evenodd"), t.stroke(e);
				return;
			}
			t.beginPath();
			for (let i of e) {
				for (let e = 0; e < i.length; e++) e === 0 ? t.moveTo(n(i[e]), r(i[e])) : t.lineTo(n(i[e]), r(i[e]));
				t.closePath();
			}
			t.fill("evenodd"), t.stroke();
		}
	}
}, Ot = new Set([
	"Point",
	"MultiPoint",
	"LineString",
	"MultiLineString",
	"Polygon",
	"MultiPolygon"
]), kt = /* @__PURE__ */ new F(), At = /* @__PURE__ */ new F();
function jt(e, t, n) {
	let r = .01;
	e.getCartographicToPosition(t, n, 0, kt), e.getCartographicToPosition(t + r, n, 0, At);
	let i = kt.distanceTo(At);
	return e.getCartographicToPosition(t, n + r, 0, At), kt.distanceTo(At) / i;
}
var Mt = class extends wt {
	constructor({ geojson: e = null, url: t = null, resolution: n = 256, pointRadius: r = 6, strokeStyle: i = "white", strokeWidth: a = 2, fillStyle: o = "rgba( 255, 255, 255, 0.5 )", getStyle: s = ((e, t) => ({
		fill: t.fillStyle || this.fillStyle,
		stroke: t.strokeStyle || this.strokeStyle,
		strokeWidth: t.strokeWidth || this.strokeWidth,
		radius: t.pointRadius || this.pointRadius
	})), ...c } = {}) {
		super(c), this.geojson = e, this.url = t, this.resolution = n, this.pointRadius = r, this.strokeStyle = i, this.strokeWidth = a, this.fillStyle = o, this.getStyle = s, this.features = null, this.featureBounds = /* @__PURE__ */ new Map(), this.contentBounds = null, this.projection = new L(), this.fetchData = (...e) => fetch(...e), this._canvasRenderer = new Dt({
			flipY: !0,
			getX: (e) => e[0],
			getY: (e) => e[1]
		});
	}
	async init() {
		let { geojson: e, url: t } = this;
		if (!e && t) {
			let e = await this.fetchData(t);
			this.geojson = await e.json();
		}
		this._updateCache(!0);
	}
	hasContent(e, t, n, r) {
		let i = [
			e,
			t,
			n,
			r
		].map((e) => e * Math.RAD2DEG);
		return this._boundsIntersectBounds(i, this.contentBounds);
	}
	fetchItem(e, t) {
		let n = document.createElement("canvas"), r = new C(n);
		return r.colorSpace = be, r.generateMipmaps = !1, this._drawToCanvas(n, e), r.needsUpdate = !0, r;
	}
	disposeItem(e) {
		e && e.dispose();
	}
	redraw(...e) {
		let t = this.get(...e);
		t && (this._drawToCanvas(t.image, e), t.needsUpdate = !0);
	}
	_updateCache(e = !1) {
		let { geojson: t, featureBounds: n } = this;
		if (!t || this.features && !e) return;
		n.clear();
		let r = Infinity, i = Infinity, a = -Infinity, o = -Infinity;
		this.features = this._featuresFromGeoJSON(t);
		for (let e of this.features) {
			let t = this._getFeatureBounds(e);
			n.set(e, t);
			let [s, c, l, u] = t;
			r = Math.min(r, s), i = Math.min(i, c), a = Math.max(a, l), o = Math.max(o, u);
		}
		this.contentBounds = [
			r,
			i,
			a,
			o
		];
	}
	_drawToCanvas(e, t) {
		this._updateCache();
		let [n, r, i, a] = t, { projection: o, resolution: s, features: c, _canvasRenderer: l } = this;
		e.width = s, e.height = s;
		let u = o.convertNormalizedToLongitude(n), d = o.convertNormalizedToLatitude(r), f = o.convertNormalizedToLongitude(i), p = o.convertNormalizedToLatitude(a), m = [
			u * j.RAD2DEG,
			d * j.RAD2DEG,
			f * j.RAD2DEG,
			p * j.RAD2DEG
		], h = e.getContext("2d");
		l.setFrame(h, m, m);
		for (let e of c) this._featureIntersectsTile(e, m) && this._drawFeatureOnCanvas(e, m, s);
	}
	_featureIntersectsTile(e, t) {
		let n = this.featureBounds.get(e);
		return n ? this._boundsIntersectBounds(n, t) : !1;
	}
	_boundsIntersectBounds(e, t) {
		let [n, r, i, a] = e, [o, s, c, l] = t;
		return !(i < o || n > c || a < s || r > l);
	}
	_getFeatureBounds(e) {
		let { geometry: t } = e;
		if (!t) return null;
		let { type: n, coordinates: r } = t, i = Infinity, a = Infinity, o = -Infinity, s = -Infinity, c = (e, t) => {
			i = Math.min(i, e), o = Math.max(o, e), a = Math.min(a, t), s = Math.max(s, t);
		};
		return n === "Point" ? c(r[0], r[1]) : n === "MultiPoint" || n === "LineString" ? r.forEach((e) => c(e[0], e[1])) : n === "MultiLineString" || n === "Polygon" ? r.forEach((e) => e.forEach((e) => c(e[0], e[1]))) : n === "MultiPolygon" && r.forEach((e) => e.forEach((e) => e.forEach((e) => c(e[0], e[1])))), [
			i,
			a,
			o,
			s
		];
	}
	_featuresFromGeoJSON(e) {
		let t = e.type;
		return t === "FeatureCollection" ? e.features : t === "Feature" ? [e] : t === "GeometryCollection" ? e.geometries.map((e) => ({
			type: "Feature",
			geometry: e,
			properties: {}
		})) : Ot.has(t) ? [{
			type: "Feature",
			geometry: e,
			properties: {}
		}] : [];
	}
	_drawFeatureOnCanvas(e, t, n) {
		let { geometry: r = null, properties: i = {} } = e;
		if (!r) return;
		let [, a, , o] = t, { _canvasRenderer: s } = this, l = this.getStyle(e, i);
		s.setStyle(l);
		let u = r.type;
		if (u === "Point" || u === "MultiPoint") {
			s.radius = l.radius * (o - a) / n;
			let e = u === "Point" ? [r.coordinates] : r.coordinates;
			for (let t of e) {
				let e = jt(c, t[1] * j.DEG2RAD, t[0] * j.DEG2RAD), n = [t];
				s._renderPoints([n], e);
			}
		} else u === "LineString" ? s._renderLines([r.coordinates]) : u === "MultiLineString" ? s._renderLines(r.coordinates) : u === "Polygon" ? s._renderPolygons(r.coordinates) : u === "MultiPolygon" && r.coordinates.forEach((e) => s._renderPolygons(e));
	}
}, Nt = class extends tt {
	constructor(e = {}) {
		let { url: t = null, layer: n = null, styles: r = null, contentBoundingBox: i = null, version: a = "1.3.0", crs: o = "EPSG:4326", format: s = "image/png", transparent: c = !1, levels: l = 18, tileDimension: u = 256, ...d } = e;
		super(d), this.url = t, this.layer = n, this.crs = o, this.format = s, this.tileDimension = u, this.styles = r, this.version = a, this.levels = l, this.transparent = c, this.contentBoundingBox = i;
	}
	init() {
		let { tiling: e, levels: t, tileDimension: n, contentBoundingBox: r } = this;
		return e.setProjection(new L(this.crs)), e.flipY = !0, e.generateLevels(t, e.projection.tileCountX, e.projection.tileCountY, {
			tilePixelWidth: n,
			tilePixelHeight: n
		}), r === null ? e.setContentBounds(...e.projection.getBounds()) : e.setContentBounds(...r), Promise.resolve();
	}
	normalizedToMercatorX(e) {
		return j.mapLinear(e, 0, 1, -20037508.342789244, 20037508.342789244);
	}
	normalizedToMercatorY(e) {
		return j.mapLinear(e, 0, 1, -20037508.342789244, 20037508.342789244);
	}
	getUrl(e, t, n) {
		let { tiling: r, layer: i, crs: a, format: o, tileDimension: s, styles: c, version: l, transparent: u } = this, d = l === "1.1.1" ? "SRS" : "CRS", f;
		if (a === "EPSG:3857") {
			let i = r.getTileBounds(e, t, n, !0, !1);
			f = [
				this.normalizedToMercatorX(i[0]),
				this.normalizedToMercatorY(i[1]),
				this.normalizedToMercatorX(i[2]),
				this.normalizedToMercatorY(i[3])
			];
		} else {
			let [i, o, s, c] = r.getTileBounds(e, t, n, !1, !1).map((e) => e * j.RAD2DEG);
			f = a === "EPSG:4326" ? l === "1.1.1" ? [
				i,
				o,
				s,
				c
			] : [
				o,
				i,
				c,
				s
			] : [
				i,
				o,
				s,
				c
			];
		}
		let p = new URLSearchParams({
			SERVICE: "WMS",
			REQUEST: "GetMap",
			VERSION: l,
			LAYERS: i,
			[d]: a,
			BBOX: f.join(","),
			WIDTH: s,
			HEIGHT: s,
			FORMAT: o,
			TRANSPARENT: u ? "TRUE" : "FALSE"
		});
		return c != null && p.set("STYLES", c), new URL("?" + p.toString(), this.url).toString();
	}
}, Pt = class extends tt {
	constructor(e = {}) {
		let { url: t = null, ...n } = e;
		super(n), this.url = t, this.format = null, this.stem = null;
	}
	getUrl(e, t, n) {
		return `${this.stem}_files/${n}/${e}_${t}.${this.format}`;
	}
	init() {
		let { url: e } = this;
		return this.fetchData(e, this.fetchOptions).then((e) => e.text()).then((t) => {
			let n = new DOMParser().parseFromString(t, "text/xml");
			if (n.querySelector("DisplayRects") || n.querySelector("Collection")) throw Error("DeepZoomImagesPlugin: DisplayRect and Collection DZI files not supported.");
			let r = n.querySelector("Image"), i = r.querySelector("Size"), a = parseInt(i.getAttribute("Width")), o = parseInt(i.getAttribute("Height")), s = parseInt(r.getAttribute("TileSize")), c = parseInt(r.getAttribute("Overlap")), l = r.getAttribute("Format");
			this.format = l, this.stem = e.split(/\.[^.]+$/g)[0];
			let { tiling: u } = this, d = Math.ceil(Math.log2(Math.max(a, o))) + 1;
			u.flipY = !0, u.pixelOverlap = c, u.generateLevels(d, 1, 1, {
				tilePixelWidth: s,
				tilePixelHeight: s,
				pixelWidth: a,
				pixelHeight: o
			});
		});
	}
}, Ft = /* @__PURE__ */ new M(), It = /* @__PURE__ */ new F(), Lt = /* @__PURE__ */ new F(), Rt = /* @__PURE__ */ new F(), V = /* @__PURE__ */ new F(), zt = /* @__PURE__ */ new v(), Bt = Symbol("SPLIT_TILE_DATA"), Vt = Symbol("SPLIT_HASH"), Ht = Symbol("ORIGINAL_REFINE"), Ut = /* @__PURE__ */ new i();
Ut.maxJobs = 10, Ut.priorityCallback = (e, t) => {
	let n = e.tile, r = t.tile, i = n.internal.renderer, a = r.internal.renderer, s = i.visibleTiles.has(n);
	return s === a.visibleTiles.has(r) ? o(n, r) : s ? 1 : -1;
};
var Wt = class {
	get enableTileSplitting() {
		return this._enableTileSplitting;
	}
	set enableTileSplitting(e) {
		this._enableTileSplitting !== e && (this._enableTileSplitting = e, this._markNeedsUpdate());
	}
	constructor(e = {}) {
		let { overlays: t = [], resolution: n = 256, enableTileSplitting: r = !0 } = e;
		this.name = "IMAGE_OVERLAY_PLUGIN", this.priority = -15, this.resolution = n, this._enableTileSplitting = r, this.overlays = [], this.needsUpdate = !1, this.tiles = null, this.tileComposer = null, this.tileControllers = /* @__PURE__ */ new Map(), this.overlayInfo = /* @__PURE__ */ new Map(), this.meshParams = /* @__PURE__ */ new WeakMap(), this.pendingTiles = /* @__PURE__ */ new Map(), this.processedTiles = /* @__PURE__ */ new Set(), this.processQueue = null, this._onUpdateAfter = null, this._onTileDownloadStart = null, this._onTileVisibilityChange = null, this._virtualChildResetId = 0, this._bytesUsed = /* @__PURE__ */ new WeakMap(), t.forEach((e) => {
			this.addOverlay(e);
		});
	}
	init(e) {
		let t = new xt();
		this.tiles = e, this.tileComposer = t, this.processQueue = Ut, e.forEachLoadedModel((e, t) => {
			this._processTileModel(e, t, !0);
		}), this._onUpdateAfter = async () => {
			let t = !1;
			if (this.overlayInfo.forEach((e, n) => {
				if (!!n.frame != !!e.frame || n.frame && e.frame && !e.frame.equals(n.frame)) {
					let r = e.order;
					this.deleteOverlay(n), this.addOverlay(n, r), t = !0;
				}
			}), t) {
				let { processQueue: t } = this, n = t.maxJobs, r = 0;
				t.items.forEach((t) => {
					e.visibleTiles.has(t.tile) && r++;
				}), t.maxJobs = r + t.currJobs, t.tryRunJobs(), t.maxJobs = n, this.needsUpdate = !0;
			}
			if (this.needsUpdate) {
				this.needsUpdate = !1;
				let { overlays: t, overlayInfo: n } = this;
				t.sort((e, t) => n.get(e).order - n.get(t).order), this.processedTiles.forEach((e) => {
					this._updateLayers(e);
				}), this.resetVirtualChildren(!this.enableTileSplitting), e.recalculateBytesUsed(), e.dispatchEvent({ type: "needs-render" });
			}
		}, this._onTileDownloadStart = ({ tile: e, url: t }) => {
			!/\.json$/i.test(t) && !/\.subtree/i.test(t) && (this.processedTiles.add(e), this._initTileOverlayInfo(e));
		}, this._onTileVisibilityChange = ({ tile: e, visible: t }) => {
			this.overlayInfo.forEach(({ tileInfo: n }, r) => {
				if (n.has(e)) {
					let { range: i } = n.get(e);
					r.setRegionVisible(i, t, e);
				}
			});
		}, e.addEventListener("update-after", this._onUpdateAfter), e.addEventListener("tile-download-start", this._onTileDownloadStart), e.addEventListener("tile-visibility-change", this._onTileVisibilityChange), this.overlays.forEach((e) => {
			this._initOverlay(e);
		});
	}
	_removeVirtualChildren(e) {
		if (!(Ht in e)) return;
		let { tiles: t } = this, { virtualChildCount: n } = e.internal, r = e.children.length, i = r - n;
		for (let n = i; n < r; n++) {
			let r = e.children[n];
			t.processNodeQueue.remove(r), t.lruCache.remove(r), r.parent = null;
		}
		e.children.length -= n, e.internal.virtualChildCount = 0, e.refine = e[Ht], delete e[Ht], delete e[Vt];
	}
	disposeTile(e) {
		let { overlayInfo: t, tileControllers: n, processQueue: r, pendingTiles: i, processedTiles: a } = this;
		a.delete(e), this._removeVirtualChildren(e), n.has(e) && (n.get(e).abort(), n.delete(e), i.delete(e)), t.forEach((({ tileInfo: t }, n) => {
			if (t.has(e)) {
				let { meshInfo: r, range: i } = t.get(e);
				i !== null && n.releaseTexture(i), t.delete(e), r.clear();
			}
		})), r.removeByFilter((t) => t.tile === e);
	}
	calculateBytesUsed(e) {
		let { overlayInfo: t } = this, n = this._bytesUsed, r = null;
		return t.forEach(({ tileInfo: t }, n) => {
			if (t.has(e)) {
				let { target: n } = t.get(e);
				r ||= 0, r += u(n);
			}
		}), r === null ? n.has(e) ? n.get(e) : 0 : (n.set(e, r), r);
	}
	processTileModel(e, t) {
		return this._processTileModel(e, t);
	}
	async _processTileModel(e, t, n = !1) {
		let { tileControllers: r, processedTiles: i, pendingTiles: a } = this;
		r.set(t, new AbortController()), n || a.set(t, e), i.add(t), this._wrapMaterials(e), this._initTileOverlayInfo(t), await this._initTileSceneOverlayInfo(e, t), this.expandVirtualChildren(e, t), this._updateLayers(t), a.delete(t);
	}
	dispose() {
		let { tiles: e } = this;
		[...this.overlays].forEach((e) => {
			this.deleteOverlay(e);
		}), this.processedTiles.forEach((e) => {
			this._updateLayers(e), this.disposeTile(e);
		}), e.removeEventListener("update-after", this._onUpdateAfter), e.removeEventListener("tile-download-start", this._onTileDownloadStart), e.removeEventListener("tile-visibility-change", this._onTileVisibilityChange), this.resetVirtualChildren(!0);
	}
	getAttributions(e) {
		this.overlays.forEach((t) => {
			t.opacity > 0 && t.getAttributions(e);
		});
	}
	parseToMesh(e, t, n, r) {
		if (n === "image_overlay_tile_split") return t[Bt];
	}
	async resetVirtualChildren(e = !1) {
		this._virtualChildResetId++;
		let t = this._virtualChildResetId;
		if (await Promise.all(this.overlays.map((e) => e.whenReady())), t !== this._virtualChildResetId) return;
		let { tiles: n } = this, r = [];
		this.processedTiles.forEach((e) => {
			Vt in e && r.push(e);
		}), r.sort((e, t) => t.internal.depth - e.internal.depth), r.forEach((t) => {
			let n = t.engineData.scene.clone();
			n.updateMatrixWorld(), (e || t[Vt] !== this._getSplitVectors(n, t).hash) && this._removeVirtualChildren(t);
		}), e || n.forEachLoadedModel((e, t) => {
			this.expandVirtualChildren(e, t);
		});
	}
	_getSplitVectors(e, t, n = Lt) {
		let { tiles: r, overlayInfo: i } = this, a = new v();
		a.setFromObject(e), a.getCenter(n);
		let o = [], s = [];
		i.forEach(({ tileInfo: e }, i) => {
			let a = e.get(t);
			if (a && a.target && i.shouldSplit(a.range)) {
				i.frame ? V.set(0, 0, 1).transformDirection(i.frame) : (r.ellipsoid.getPositionToNormal(n, V), V.length() < 1e-6 && V.set(1, 0, 0));
				let e = `${V.x.toFixed(3)},${V.y.toFixed(3)},${V.z.toFixed(3)}_`;
				s.includes(e) || s.push(e);
				let t = It.set(0, 0, 1);
				Math.abs(V.dot(t)) > .9999 && t.set(1, 0, 0);
				let a = new F().crossVectors(V, t).normalize(), c = new F().crossVectors(V, a).normalize();
				o.push(a, c);
			}
		});
		let c = [];
		for (; o.length !== 0;) {
			let e = o.pop().clone(), t = e.clone();
			for (let n = 0; n < o.length; n++) {
				let r = o[n], i = e.dot(r);
				Math.abs(i) > Math.cos(Math.PI / 8) && (t.addScaledVector(r, Math.sign(i)), e.copy(t).normalize(), o.splice(n, 1), n--);
			}
			c.push(t.normalize());
		}
		return {
			directions: c,
			hash: s.join("")
		};
	}
	async expandVirtualChildren(e, t) {
		let { refine: n } = t, r = n === "REPLACE" && t.children.length === 0 || n === "ADD", i = t.internal.virtualChildCount !== 0;
		if (this.enableTileSplitting === !1 || !r || i) return;
		let a = e.clone();
		a.updateMatrixWorld();
		let { directions: o, hash: s } = this._getSplitVectors(a, t, Lt);
		if (o.length === 0) return;
		t[Vt] = s;
		let c = new ht();
		c.attributeList = (e) => !/^layer_uv_\d+/.test(e), o.map((e) => {
			c.addSplitOperation((t, n, r, i, a, o) => (De.getInterpolatedAttribute(t.attributes.position, n, r, i, a, It), It.applyMatrix4(o).sub(Lt).dot(e)));
		});
		let l = [];
		c.forEachSplitPermutation(() => {
			let e = c.clipObject(a);
			e.matrix.premultiply(t.engineData.transformInverse).decompose(e.position, e.quaternion, e.scale);
			let n = [];
			if (e.traverse((e) => {
				if (e.isMesh) {
					let t = e.material.clone();
					e.material = t;
					for (let e in t) {
						let n = t[e];
						if (n && n.isTexture && n.source.data instanceof ImageBitmap) {
							let r = document.createElement("canvas");
							r.width = n.image.width, r.height = n.image.height;
							let i = r.getContext("2d");
							i.scale(1, -1), i.drawImage(n.source.data, 0, 0, r.width, -r.height);
							let a = new C(r);
							a.mapping = n.mapping, a.wrapS = n.wrapS, a.wrapT = n.wrapT, a.minFilter = n.minFilter, a.magFilter = n.magFilter, a.format = n.format, a.type = n.type, a.anisotropy = n.anisotropy, a.colorSpace = n.colorSpace, a.generateMipmaps = n.generateMipmaps, t[e] = a;
						}
					}
					n.push(e);
				}
			}), n.length === 0) return;
			let r = {};
			if (t.boundingVolume.region && (r.region = ot(n, this.tiles.ellipsoid).region), t.boundingVolume.box || t.boundingVolume.sphere) {
				zt.setFromObject(e, !0).getCenter(Rt);
				let t = 0;
				e.traverse((e) => {
					let n = e.geometry;
					if (n) {
						let r = n.attributes.position;
						for (let n = 0, i = r.count; n < i; n++) {
							let i = It.fromBufferAttribute(r, n).applyMatrix4(e.matrixWorld).distanceToSquared(Rt);
							t = Math.max(t, i);
						}
					}
				}), r.sphere = [...Rt, Math.sqrt(t)];
			}
			l.push({
				internal: { isVirtual: !0 },
				refine: "REPLACE",
				geometricError: t.geometricError * .5,
				boundingVolume: r,
				content: { uri: "./child.image_overlay_tile_split" },
				children: [],
				[Bt]: e
			});
		}), t[Ht] = t.refine, t.refine = "REPLACE", t.children.push(...l), t.internal.virtualChildCount += l.length;
	}
	fetchData(e, t) {
		if (/image_overlay_tile_split/.test(e)) return /* @__PURE__ */ new ArrayBuffer();
	}
	addOverlay(e, t = null) {
		let { tiles: n, overlays: r, overlayInfo: i } = this;
		t === null && (t = r.reduce((e, t) => Math.max(e, t.order + 1), 0));
		let a = new AbortController();
		r.push(e), i.set(e, {
			order: t,
			uniforms: {},
			tileInfo: /* @__PURE__ */ new Map(),
			controller: a,
			frame: e.frame ? e.frame.clone() : null
		}), n !== null && this._initOverlay(e);
	}
	setOverlayOrder(e, t) {
		this.overlays.indexOf(e) !== -1 && (this.overlayInfo.get(e).order = t, this._markNeedsUpdate());
	}
	deleteOverlay(e) {
		let { overlays: t, overlayInfo: n, processQueue: r, processedTiles: i, tiles: a } = this, o = t.indexOf(e);
		if (o !== -1) {
			let { tileInfo: s, controller: c } = n.get(e);
			i.forEach((t) => {
				if (!s.has(t)) return;
				let { meshInfo: n, range: r } = s.get(t);
				r !== null && (a.visibleTiles.has(t) && e.setRegionVisible(r, !1), e.releaseTexture(r)), s.delete(t), n.clear();
			}), s.clear(), n.delete(e), c.abort(), r.removeByFilter((t) => t.overlay === e && i.has(t.tile)), t.splice(o, 1), i.forEach((e) => {
				this._updateLayers(e);
			}), this._markNeedsUpdate();
		}
	}
	_initOverlay(e) {
		let { processedTiles: t } = this;
		e.init().then(() => {
			e.setResolution(this.resolution);
		});
		let n = [];
		t.forEach(async (t) => {
			let r = t.engineData.scene;
			this._initTileOverlayInfo(t, e);
			let i = this._initTileSceneOverlayInfo(r, t, e);
			n.push(i), await i, this._updateLayers(t);
		}), Promise.all(n).then(() => {
			this._markNeedsUpdate();
		});
	}
	_wrapMaterials(e) {
		e.traverse((e) => {
			if (e.material) {
				let t = ut(e.material, e.material.onBeforeCompile);
				this.meshParams.set(e, t);
			}
		});
	}
	_initTileOverlayInfo(e, t = this.overlays) {
		if (Array.isArray(t)) {
			t.forEach((t) => this._initTileOverlayInfo(e, t));
			return;
		}
		let { overlayInfo: n } = this;
		if (n.get(t).tileInfo.has(e)) return;
		let r = {
			range: null,
			target: null,
			meshInfo: /* @__PURE__ */ new Map(),
			failed: !1
		};
		if (n.get(t).tileInfo.set(e, r), t.isReady && !t.isPlanarProjection && e.boundingVolume.region) {
			let [n, i, a, o] = e.boundingVolume.region, s = [
				n,
				i,
				a,
				o
			];
			s = t.projection.clampToBounds(s), s = t.projection.toNormalizedRange(s), r.range = s, t.lockTextureSafe(s);
		}
	}
	async _initTileSceneOverlayInfo(e, t, n = this.overlays) {
		if (Array.isArray(n)) return Promise.all(n.map((n) => this._initTileSceneOverlayInfo(e, t, n)));
		let { tiles: r, overlayInfo: i, tileControllers: a } = this, { ellipsoid: o } = r, { controller: s, tileInfo: c } = i.get(n), l = a.get(t);
		if (n.isReady || await n.whenReady(), s.signal.aborted || l.signal.aborted) return;
		let u = [];
		e.updateMatrixWorld(), e.traverse((e) => {
			e.isMesh && u.push(e);
		});
		let { aspectRatio: d, projection: f } = n, p = c.get(t), m, h, g;
		if (n.isPlanarProjection) {
			Ft.makeScale(1 / d, 1, 1).multiply(n.frame), e.parent !== null && Ft.multiply(r.group.matrixWorldInverse);
			let t;
			({range: m, uvs: h, heightRange: t} = ct(u, Ft)), g = !(t[0] > 1 || t[1] < 0);
		} else Ft.identity(), e.parent !== null && Ft.copy(r.group.matrixWorldInverse), {range: m, uvs: h} = ot(u, o, Ft, f, p.range), g = !0;
		p.range === null && (p.range = m, n.lockTextureSafe(m)), r.visibleTiles.has(t) && n.setRegionVisible(p.range, !0), g && n.hasContent(m) && await this._fetchTileOverlayTexture(t, n, p), u.forEach((e, t) => {
			let n = new x(new Float32Array(h[t]), 3);
			p.meshInfo.set(e, { attribute: n });
		});
	}
	async _fetchTileOverlayTexture(e, t, n) {
		let { tiles: r, overlayInfo: i, tileControllers: a, processQueue: o } = this, { controller: s } = i.get(t), c = a.get(e), { range: l } = n;
		n.target = await o.add({
			tile: e,
			overlay: t
		}, async () => {
			if (s.signal.aborted || c.signal.aborted) return null;
			let e = await t.getTexture(l);
			return s.signal.aborted || c.signal.aborted ? null : e;
		}).catch((i) => i.name === "AbortError" ? null : (n.failed = !0, r.dispatchEvent({
			type: "load-error",
			tile: e,
			overlay: t,
			error: i,
			url: null
		}), null));
	}
	resetFailedOverlays() {
		let { processedTiles: e, overlayInfo: t, overlays: n } = this, r = [];
		e.forEach((e) => {
			n.forEach((n) => {
				let { tileInfo: i } = t.get(n), a = i.get(e);
				a.failed && (a.failed = !1, n.releaseTexture(a.range), r.push({
					tile: e,
					overlay: n,
					info: a
				}));
			});
		}), requestAnimationFrame(() => {
			r.forEach(({ tile: e, overlay: t, info: n }) => {
				t.lockTextureSafe(n.range), this._fetchTileOverlayTexture(e, t, n).then(() => {
					this._updateLayers(e);
				}).catch((e) => {
					if (e.name !== "AbortError") throw e;
				});
			});
		});
	}
	_updateLayers(e) {
		let { overlayInfo: t, overlays: n, tileControllers: r, meshParams: i } = this, a = r.get(e);
		if (this.tiles.recalculateBytesUsed(e), !(!a || a.signal.aborted)) {
			if (n.length === 0) {
				let t = e.engineData && e.engineData.scene;
				t && t.traverse((e) => {
					if (e.material && i.has(e)) {
						let t = i.get(e);
						t.layerMaps.length = 0, t.layerInfo.length = 0, e.material.defines.LAYER_COUNT = 0, e.material.needsUpdate = !0;
					}
				});
				return;
			}
			n.forEach((r, a) => {
				let { tileInfo: o } = t.get(r), { meshInfo: s, target: c } = o.get(e);
				s.forEach(({ attribute: e }, t) => {
					let { geometry: o, material: s } = t, l = i.get(t), u = `layer_uv_${a}`;
					o.getAttribute(u) !== e && (o.setAttribute(u, e), o.dispose()), l.layerMaps.length = n.length, l.layerInfo.length = n.length, l.layerMaps.value[a] = c === null ? null : c, l.layerInfo.value[a] = r, s.defines[`LAYER_${a}_EXISTS`] = Number(c !== null), s.defines[`LAYER_${a}_ALPHA_INVERT`] = Number(r.alphaInvert), s.defines[`LAYER_${a}_ALPHA_MASK`] = Number(r.alphaMask), s.defines.LAYER_COUNT = n.length, s.needsUpdate = !0;
				});
			});
		}
	}
	_markNeedsUpdate() {
		this.needsUpdate === !1 && (this.needsUpdate = !0, this.tiles !== null && this.tiles.dispatchEvent({ type: "needs-update" }));
	}
}, Gt = class {
	get isPlanarProjection() {
		return !!this.frame;
	}
	constructor(e = {}) {
		let { opacity: t = 1, color: n = 16777215, frame: r = null, preprocessURL: i = null, alphaMask: o = !1, alphaInvert: s = !1 } = e;
		this.preprocessURL = i, this.opacity = t, this.color = new w(n), this.frame = r === null ? null : r.clone(), this.alphaMask = o, this.alphaInvert = s, this.downloadQueue = a, this._whenReady = null, this.isReady = !1, this.isInitialized = !1, this._visibleRegionCounts = /* @__PURE__ */ new Map();
	}
	init() {
		return this.isInitialized || (this.isInitialized = !0, this._whenReady = this._init().then(() => this.isReady = !0)), this._whenReady;
	}
	whenReady() {
		return this._whenReady;
	}
	_init() {
		return Promise.resolve();
	}
	fetch(e, t = {}) {
		this.preprocessURL && (e = this.preprocessURL(e));
		let n = { priority: -performance.now() }, r = this.downloadQueue.add(n, () => fetch(e, t));
		return t.signal && t.signal.addEventListener("abort", () => this.downloadQueue.remove(n), { once: !0 }), r;
	}
	getAttributions(e) {}
	hasContent(e, t = null) {
		return !1;
	}
	async getTexture(e, t = null) {
		return null;
	}
	async lockTexture(e, t = null) {
		return null;
	}
	lockTextureSafe(e) {
		let t = this.lockTexture(e);
		return t instanceof Promise && t.catch((e) => {
			if (e.name !== "AbortError") throw e;
		}), t;
	}
	releaseTexture(e, t = null) {}
	shouldSplit(e, t = null) {
		return !1;
	}
	setResolution(e) {}
	setRegionVisible(e, t) {
		let { _visibleRegionCounts: n } = this, r = e.join("_"), i = n.get(r);
		if (i || (i = {
			range: [...e],
			count: 0
		}, n.set(r, i)), i.count += t ? 1 : -1, i.count < 0) throw Error();
		i.count === 0 && n.delete(r);
	}
}, H = class extends Gt {
	get tiling() {
		return this.imageSource.tiling;
	}
	get projection() {
		return this.tiling.projection;
	}
	get aspectRatio() {
		return this.tiling && this.isReady ? this.tiling.aspectRatio : 1;
	}
	get fetchOptions() {
		return this.imageSource.fetchOptions;
	}
	set fetchOptions(e) {
		this.imageSource.fetchOptions = e;
	}
	constructor(e = {}) {
		let { imageSource: t = null, ...n } = e;
		super(n), this.imageSource = t, this.regionImageSource = null;
	}
	_init() {
		return this._initImageSource().then(() => {
			this.imageSource.fetchData = (...e) => this.fetch(...e), this.regionImageSource = new Tt(this.imageSource);
		});
	}
	_initImageSource() {
		return this.imageSource.init();
	}
	calculateLevel(e, t = null) {
		let [n, r, i, a] = e, o = i - n, s = a - r;
		t === null && (t = this.regionImageSource.resolution);
		let c = 0, l = this.tiling.maxLevel;
		for (; c < l; c++) {
			let e = t / o, n = t / s, r = this.tiling.getLevel(c);
			if (r == null) continue;
			let { pixelWidth: i, pixelHeight: a } = r;
			if (i >= e || a >= n) break;
		}
		return c;
	}
	hasContent(e, t = this.calculateLevel(e)) {
		return this.regionImageSource.hasContent(...e, t);
	}
	getTexture(e, t = this.calculateLevel(e)) {
		return this.regionImageSource.get(...e, t);
	}
	lockTexture(e, t = this.calculateLevel(e)) {
		return this.regionImageSource.lock(...e, t);
	}
	releaseTexture(e, t = this.calculateLevel(e)) {
		this.regionImageSource.release(...e, t);
	}
	shouldSplit(e, t = this.calculateLevel(e)) {
		return this.tiling.maxLevel > t;
	}
	setResolution(e) {
		this.regionImageSource.resolution = e;
	}
}, Kt = class extends H {
	constructor(e = {}) {
		super(e), this.imageSource = new nt(e);
	}
}, qt = class extends H {
	constructor(e) {
		super(e), this.imageSource = new Pt(e);
	}
}, Jt = class extends Gt {
	get projection() {
		return this.imageSource.projection;
	}
	get aspectRatio() {
		return 2;
	}
	get pointRadius() {
		return this.imageSource.pointRadius;
	}
	set pointRadius(e) {
		this.imageSource.pointRadius = e;
	}
	get strokeStyle() {
		return this.imageSource.strokeStyle;
	}
	set strokeStyle(e) {
		this.imageSource.strokeStyle = e;
	}
	get strokeWidth() {
		return this.imageSource.strokeWidth;
	}
	set strokeWidth(e) {
		this.imageSource.strokeWidth = e;
	}
	get fillStyle() {
		return this.imageSource.fillStyle;
	}
	set fillStyle(e) {
		this.imageSource.fillStyle = e;
	}
	get geojson() {
		return this.imageSource.geojson;
	}
	set geojson(e) {
		this.imageSource.geojson = e;
	}
	constructor(e = {}) {
		super(e), this.imageSource = new Mt(e), this._redrawQueue = new i(), this._redrawQueue.maxJobs = 4, this._redrawQueue.priorityCallback = () => 0;
	}
	_init() {
		return this.imageSource.init();
	}
	hasContent(e) {
		return this.imageSource.hasContent(...e);
	}
	getTexture(e) {
		return this.imageSource.get(...e);
	}
	lockTexture(e) {
		return this.imageSource.lock(...e);
	}
	releaseTexture(e) {
		this.imageSource.release(...e);
	}
	setResolution(e) {
		this.imageSource.resolution = e;
	}
	shouldSplit(e) {
		return !0;
	}
	setRegionVisible(e, t) {
		if (super.setRegionVisible(e, t), t) {
			let { _redrawQueue: t } = this, n = e.join("_");
			t.has(n) && t.flush(n);
		}
	}
	redraw() {
		let { imageSource: e, _redrawQueue: t, _visibleRegionCounts: n } = this;
		for (let { range: t } of n.values()) e.redraw(...t);
		e.forEachItem((r, i) => {
			let a = i.join("_");
			!n.has(a) && !t.has(a) && t.add(a, () => {
				e.redraw(...i);
			});
		});
	}
}, Yt = class extends H {
	constructor(e = {}) {
		super(e), this.imageSource = new Nt(e);
	}
}, Xt = class extends H {
	constructor(e = {}) {
		super(e), this.imageSource = new bt(e);
	}
}, Zt = class extends H {
	constructor(e = {}) {
		super(e), this.imageSource = new it(e);
	}
}, Qt = class extends H {
	constructor(e = {}) {
		super(e);
		let { apiToken: t, autoRefreshToken: n, assetId: r } = e;
		this.options = e, this.assetId = r, this.auth = new m({
			apiToken: t,
			autoRefreshToken: n
		}), this.auth.authURL = `https://api.cesium.com/v1/assets/${r}/endpoint`, this._attributions = [], this.externalType = !1;
	}
	_initImageSource() {
		return this.auth.refreshToken().then(async (e) => {
			if (this._attributions = e.attributions.map((e) => ({
				value: e.html,
				type: "html",
				collapsible: e.collapsible
			})), e.type !== "IMAGERY") throw Error("CesiumIonOverlay: Only IMAGERY is supported as overlay type.");
			switch (this.externalType = !!e.externalType, e.externalType) {
				case "GOOGLE_2D_MAPS": {
					let { url: t, session: n, key: r, tileWidth: i } = e.options, a = `${t}/v1/2dtiles/{z}/{x}/{y}?session=${n}&key=${r}`;
					this.imageSource = new nt({
						...this.options,
						url: a,
						tileDimension: i,
						levels: 22
					});
					break;
				}
				case "BING": {
					let { url: t, mapStyle: n, key: r } = e.options, i = `${t}/REST/v1/Imagery/Metadata/${n}?incl=ImageryProviders&key=${r}&uriScheme=https`, a = (await fetch(i).then((e) => e.json())).resourceSets[0].resources[0];
					this.imageSource = new rt({
						...this.options,
						url: a.imageUrl,
						subdomains: a.imageUrlSubdomains,
						tileDimension: a.tileWidth,
						levels: a.zoomMax
					});
					break;
				}
				default: this.imageSource = new it({
					...this.options,
					url: e.url
				});
			}
			return this.imageSource.fetchData = (...e) => this.fetch(...e), this.imageSource.init();
		});
	}
	fetch(e, t = {}) {
		if (this.externalType) return super.fetch(e, t);
		this.preprocessURL && (e = this.preprocessURL(e));
		let n = { priority: -performance.now() }, r = this.downloadQueue.add(n, () => this.auth.fetch(e, t));
		return t.signal && t.signal.addEventListener("abort", () => this.downloadQueue.remove(n), { once: !0 }), r;
	}
	getAttributions(e) {
		e.push(...this._attributions);
	}
}, $t = class extends H {
	constructor(e = {}) {
		super(e);
		let { apiToken: t, sessionOptions: n, autoRefreshToken: r, logoUrl: i } = e;
		this.logoUrl = i, this.auth = new p({
			apiToken: t,
			sessionOptions: n,
			autoRefreshToken: r
		}), this.imageSource = new nt(), this.imageSource.fetchData = (...e) => this.fetch(...e), this._logoAttribution = {
			value: "",
			type: "image",
			collapsible: !1
		};
	}
	_initImageSource() {
		return this.auth.refreshToken().then((e) => (this.imageSource.tileDimension = e.tileWidth, this.imageSource.url = "https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}", this.imageSource.init()));
	}
	fetch(e, t = {}) {
		this.preprocessURL && (e = this.preprocessURL(e));
		let n = { priority: -performance.now() }, r = this.downloadQueue.add(n, () => this.auth.fetch(e, t));
		return t.signal && t.signal.addEventListener("abort", () => this.downloadQueue.remove(n), { once: !0 }), r;
	}
	getAttributions(e) {
		this.logoUrl && (this._logoAttribution.value = this.logoUrl, e.push(this._logoAttribution));
	}
}, en = /* @__PURE__ */ new F(), tn = /* @__PURE__ */ new De(), U = /* @__PURE__ */ new F(), W = /* @__PURE__ */ new F(), nn = class extends h {
	constructor(e = D) {
		super(), this.manager = e, this.ellipsoid = new l(), this.skirtLength = 1e3, this.smoothSkirtNormals = !0, this.generateNormals = !0, this.solid = !1, this.minLat = -Math.PI / 2, this.maxLat = Math.PI / 2, this.minLon = -Math.PI, this.maxLon = Math.PI;
	}
	parse(e) {
		let { ellipsoid: t, solid: n, skirtLength: r, smoothSkirtNormals: i, generateNormals: a, minLat: o, maxLat: s, minLon: c, maxLon: l } = this, { header: u, indices: d, vertexData: f, edgeIndices: p, extensions: m } = super.parse(e), h = new S(), g = new ue(), _ = new le(h, g);
		_.position.set(...u.center);
		let v = "octvertexnormals" in m, y = v || a, b = f.u.length, C = [], w = [], T = [], D = [], O = 0, k = 0;
		for (let e = 0; e < b; e++) te(e, U), ne(U.x, U.y, U.z, W), w.push(U.x, U.y), C.push(...W);
		for (let e = 0, t = d.length; e < t; e++) T.push(d[e]);
		if (y) if (v) {
			let e = m.octvertexnormals.normals;
			for (let t = 0, n = e.length; t < n; t++) D.push(e[t]);
		} else {
			let e = new S(), t = d.length > 21845 ? new Uint32Array(d) : new Uint16Array(d);
			e.setIndex(new x(t, 1, !1)), e.setAttribute("position", new x(new Float32Array(C), 3, !1)), e.computeVertexNormals();
			let n = e.getAttribute("normal").array;
			m.octvertexnormals = { normals: n };
			for (let e = 0, t = n.length; e < t; e++) D.push(n[e]);
		}
		if (h.addGroup(O, d.length, k), O += d.length, k++, n) {
			let e = C.length / 3;
			for (let e = 0; e < b; e++) te(e, U), ne(U.x, U.y, U.z, W, -r), w.push(U.x, U.y), C.push(...W);
			for (let t = d.length - 1; t >= 0; t--) T.push(d[t] + e);
			if (y) {
				let e = m.octvertexnormals.normals;
				for (let t = 0, n = e.length; t < n; t++) D.push(-e[t]);
			}
			h.addGroup(O, d.length, k), O += d.length, k++;
		}
		if (r > 0) {
			let { westIndices: e, eastIndices: t, southIndices: n, northIndices: r } = p, i, a = A(e);
			i = C.length / 3, w.push(...a.uv), C.push(...a.positions);
			for (let e = 0, t = a.indices.length; e < t; e++) T.push(a.indices[e] + i);
			let o = A(t);
			i = C.length / 3, w.push(...o.uv), C.push(...o.positions);
			for (let e = 0, t = o.indices.length; e < t; e++) T.push(o.indices[e] + i);
			let s = A(n);
			i = C.length / 3, w.push(...s.uv), C.push(...s.positions);
			for (let e = 0, t = s.indices.length; e < t; e++) T.push(s.indices[e] + i);
			let c = A(r);
			i = C.length / 3, w.push(...c.uv), C.push(...c.positions);
			for (let e = 0, t = c.indices.length; e < t; e++) T.push(c.indices[e] + i);
			y && (D.push(...a.normals), D.push(...o.normals), D.push(...s.normals), D.push(...c.normals)), h.addGroup(O, d.length, k), O += d.length, k++;
		}
		for (let e = 0, t = C.length; e < t; e += 3) C[e + 0] -= u.center[0], C[e + 1] -= u.center[1], C[e + 2] -= u.center[2];
		let ee = C.length / 3 > 65535 ? new Uint32Array(T) : new Uint16Array(T);
		if (h.setIndex(new x(ee, 1, !1)), h.setAttribute("position", new x(new Float32Array(C), 3, !1)), h.setAttribute("uv", new x(new Float32Array(w), 2, !1)), y && h.setAttribute("normal", new x(new Float32Array(D), 3, !1)), "watermask" in m) {
			let { mask: e, size: t } = m.watermask, n = new Uint8Array(2 * t * t);
			for (let t = 0, r = e.length; t < r; t++) {
				let r = e[t] === 255 ? 0 : 255;
				n[2 * t + 0] = r, n[2 * t + 1] = r;
			}
			let r = new E(n, t, t, _e, Oe);
			r.flipY = !0, r.minFilter = oe, r.magFilter = ae, r.needsUpdate = !0, g.roughnessMap = r;
		}
		return _.userData.minHeight = u.minHeight, _.userData.maxHeight = u.maxHeight, "metadata" in m && (_.userData.metadata = m.metadata.json), _;
		function te(e, t) {
			return t.x = f.u[e], t.y = f.v[e], t.z = f.height[e], t;
		}
		function ne(e, n, r, i, a = 0) {
			let d = j.lerp(u.minHeight, u.maxHeight, r), f = j.lerp(c, l, e), p = j.lerp(o, s, n);
			return t.getCartographicToPosition(p, f, d + a, i), i;
		}
		function A(e) {
			let t = [], n = [], a = [], o = [], s = [];
			for (let i = 0, s = e.length; i < s; i++) te(e[i], U), t.push(U.x, U.y), a.push(U.x, U.y), ne(U.x, U.y, U.z, W), n.push(...W), ne(U.x, U.y, U.z, W, -r), o.push(...W);
			let c = e.length - 1;
			for (let t = 0; t < c; t++) {
				let n = t, r = t + 1, i = t + e.length, a = t + e.length + 1;
				s.push(n, i, r), s.push(r, i, a);
			}
			let l = null;
			if (y) {
				let t = (n.length + o.length) / 3;
				if (i) {
					l = Array(t * 3);
					let n = m.octvertexnormals.normals, r = l.length / 2;
					for (let i = 0, a = t / 2; i < a; i++) {
						let t = e[i], a = 3 * i, o = n[3 * t + 0], s = n[3 * t + 1], c = n[3 * t + 2];
						l[a + 0] = o, l[a + 1] = s, l[a + 2] = c, l[r + a + 0] = o, l[r + a + 1] = s, l[r + a + 2] = c;
					}
				} else {
					l = [], tn.a.fromArray(n, 0), tn.b.fromArray(o, 0), tn.c.fromArray(n, 3), tn.getNormal(en);
					for (let e = 0; e < t; e++) l.push(...en);
				}
			}
			return {
				uv: [...t, ...a],
				positions: [...n, ...o],
				indices: s,
				normals: l
			};
		}
	}
}, rn = {}, an = /* @__PURE__ */ new F(), on = /* @__PURE__ */ new F(), sn = /* @__PURE__ */ new F(), cn = /* @__PURE__ */ new F(), ln = /* @__PURE__ */ new F(), G = /* @__PURE__ */ new F(), un = /* @__PURE__ */ new F(), K = /* @__PURE__ */ new P(), dn = /* @__PURE__ */ new P(), fn = /* @__PURE__ */ new P(), pn = class extends ht {
	constructor() {
		super(), this.ellipsoid = new l(), this.skirtLength = 1e3, this.smoothSkirtNormals = !0, this.solid = !1, this.minLat = -Math.PI / 2, this.maxLat = Math.PI / 2, this.minLon = -Math.PI, this.maxLon = Math.PI, this.attributeList = [
			"position",
			"normal",
			"uv"
		];
	}
	clipToQuadrant(e, t, n) {
		let { solid: r, skirtLength: i, ellipsoid: a, smoothSkirtNormals: o } = this;
		this.clearSplitOperations(), this.addSplitOperation(mn("x"), !t), this.addSplitOperation(mn("y"), !n);
		let s, c, l = e.geometry.groups[0], u = this.getClippedData(e, l);
		if (this.adjustVertices(u, e.position, 0), r) {
			s = {
				index: u.index.slice().reverse(),
				attributes: {}
			};
			for (let e in u.attributes) s.attributes[e] = u.attributes[e].slice();
			let t = s.attributes.normal;
			if (t) for (let e = 0; e < t.length; e += 3) t[e + 0] *= -1, t[e + 1] *= -1, t[e + 2] *= -1;
			this.adjustVertices(s, e.position, -i);
		}
		if (i > 0) {
			c = {
				index: [],
				attributes: {
					position: [],
					normal: [],
					uv: []
				}
			};
			let t = 0, n = {}, r = (e, r, i) => {
				let a = yt(...e, ...i, ...r);
				a in n || (n[a] = t, t++, c.attributes.position.push(...e), c.attributes.normal.push(...i), c.attributes.uv.push(...r)), c.index.push(n[a]);
			}, s = u.index, l = u.attributes.uv, d = u.attributes.position, f = u.attributes.normal, p = u.index.length / 3;
			for (let t = 0; t < p; t++) {
				let n = 3 * t;
				for (let t = 0; t < 3; t++) {
					let c = (t + 1) % 3, u = s[n + t], p = s[n + c];
					if (K.fromArray(l, u * 2), dn.fromArray(l, p * 2), K.x === dn.x && (K.x === 0 || K.x === .5 || K.x === 1) || K.y === dn.y && (K.y === 0 || K.y === .5 || K.y === 1)) {
						on.fromArray(d, u * 3), sn.fromArray(d, p * 3);
						let t = on, n = sn, s = cn.copy(on), c = ln.copy(sn);
						G.copy(s).add(e.position), a.getPositionToNormal(G, G), s.addScaledVector(G, -i), G.copy(c).add(e.position), a.getPositionToNormal(G, G), c.addScaledVector(G, -i), o && f ? (G.fromArray(f, u * 3), un.fromArray(f, p * 3)) : (G.subVectors(t, n), un.subVectors(t, s).cross(G).normalize(), G.copy(un)), r(n, dn, un), r(t, K, G), r(s, K, G), r(n, dn, un), r(s, K, G), r(c, dn, un);
					}
				}
			}
		}
		let d = u.index.length, f = u;
		if (s) {
			let { index: e, attributes: t } = s, n = f.attributes.position.length / 3;
			for (let t = 0, r = e.length; t < r; t++) f.index.push(e[t] + n);
			for (let e in u.attributes) f.attributes[e].push(...t[e]);
		}
		if (c) {
			let { index: e, attributes: t } = c, n = f.attributes.position.length / 3;
			for (let t = 0, r = e.length; t < r; t++) f.index.push(e[t] + n);
			for (let e in u.attributes) f.attributes[e].push(...t[e]);
		}
		let p = t ? 0 : -.5, m = n ? 0 : -.5, h = f.attributes.uv;
		for (let e = 0, t = h.length; e < t; e += 2) h[e] = (h[e] + p) * 2, h[e + 1] = (h[e + 1] + m) * 2;
		let g = this.constructMesh(f.attributes, f.index, e);
		g.userData.minHeight = e.userData.minHeight, g.userData.maxHeight = e.userData.maxHeight;
		let _ = 0, v = 0;
		return g.geometry.addGroup(v, d, _), v += d, _++, s && (g.geometry.addGroup(v, s.index.length, _), v += s.index.length, _++), c && (g.geometry.addGroup(v, c.index.length, _), v += c.index.length, _++), g;
	}
	adjustVertices(e, t, n) {
		let { ellipsoid: r, minLat: i, maxLat: a, minLon: o, maxLon: s } = this, { attributes: c, vertexIsClipped: l } = e, u = c.position, d = c.uv, f = u.length / 3;
		for (let e = 0; e < f; e++) {
			let c = K.fromArray(d, e * 2);
			l && l[e] && (Math.abs(c.x - .5) < 1e-10 && (c.x = .5), Math.abs(c.y - .5) < 1e-10 && (c.y = .5), K.toArray(d, e * 2));
			let f = j.lerp(i, a, c.y), p = j.lerp(o, s, c.x), m = an.fromArray(u, e * 3).add(t);
			r.getPositionToCartographic(m, rn), r.getCartographicToPosition(f, p, rn.height + n, m), m.sub(t), m.toArray(u, e * 3);
		}
	}
};
function mn(e) {
	return (t, n, r, i, a) => {
		let o = t.attributes.uv;
		return K.fromBufferAttribute(o, n), dn.fromBufferAttribute(o, r), fn.fromBufferAttribute(o, i), K[e] * a.x + dn[e] * a.y + fn[e] * a.z - .5;
	};
}
//#endregion
//#region src/three/plugins/QuantizedMeshPlugin.js
var hn = Symbol("TILE_X"), gn = Symbol("TILE_Y"), _n = Symbol("TILE_LEVEL"), vn = Symbol("TILE_AVAILABLE"), yn = Symbol("TILE_SPLIT_SOURCE_SCENE"), bn = 1e4, xn = /* @__PURE__ */ new F();
function Sn(e, t, n, r) {
	if (e && t < e.length) {
		let i = e[t];
		for (let e = 0, t = i.length; e < t; e++) {
			let { startX: t, startY: a, endX: o, endY: s } = i[e];
			if (n >= t && n <= o && r >= a && r <= s) return !0;
		}
	}
	return !1;
}
function Cn(e) {
	let { available: t = null, maxzoom: n = null } = e;
	return n === null ? t.length - 1 : n;
}
function wn(e) {
	let { metadataAvailability: t = -1 } = e;
	return t;
}
function Tn(e, t) {
	let n = e[_n], r = wn(t);
	return n < Cn(t) && r !== -1 && n % r === 0;
}
function En(e, t, n, r, i) {
	return i.tiles[0].replace(/{\s*z\s*}/g, n).replace(/{\s*x\s*}/g, e).replace(/{\s*y\s*}/g, t).replace(/{\s*version\s*}/g, r);
}
var Dn = class {
	constructor(e = {}) {
		let { useRecommendedSettings: t = !0, skirtLength: n = null, smoothSkirtNormals: r = !0, generateNormals: i = !0, solid: a = !1 } = e;
		this.name = "QUANTIZED_MESH_PLUGIN", this.priority = -1e3, this.tiles = null, this.layer = null, this.useRecommendedSettings = t, this.skirtLength = n, this.smoothSkirtNormals = r, this.solid = a, this.generateNormals = i, this.attribution = null, this.tiling = new ze(), this.projection = new L();
	}
	init(e) {
		e.fetchOptions.headers = e.fetchOptions.headers || {}, e.fetchOptions.headers.Accept = "application/vnd.quantized-mesh,application/octet-stream;q=0.9", this.useRecommendedSettings && (e.errorTarget = 2), this.tiles = e;
	}
	loadRootTileset() {
		let { tiles: e } = this, t = new URL("layer.json", new URL(e.rootURL, location.href));
		return e.invokeAllPlugins((e) => t = e.preprocessURL ? e.preprocessURL(t, null) : t), e.invokeOnePlugin((e) => e.fetchData && e.fetchData(t, this.tiles.fetchOptions)).then((e) => e.json()).then((e) => {
			this.layer = e;
			let { projection: t = "EPSG:4326", extensions: n = [], attribution: r = "", available: i = null } = e, { tiling: a, tiles: o, projection: s } = this;
			r && (this.attribution = {
				value: r,
				type: "string",
				collapsible: !0
			}), n.length > 0 && (o.fetchOptions.headers.Accept += `;extensions=${n.join("-")}`), s.setScheme(t);
			let { tileCountX: c, tileCountY: l } = s;
			a.setProjection(s), a.generateLevels(Cn(e) + 1, c, l);
			let u = [];
			for (let e = 0; e < c; e++) {
				let t = this.createChild(0, e, 0, i);
				t && u.push(t);
			}
			let d = {
				asset: { version: "1.1" },
				geometricError: Infinity,
				root: {
					refine: "REPLACE",
					geometricError: Infinity,
					boundingVolume: { region: [
						...this.tiling.getContentBounds(),
						-1e4,
						bn
					] },
					children: u,
					[vn]: i,
					[_n]: -1
				}
			}, f = o.rootURL;
			return o.invokeAllPlugins((e) => f = e.preprocessURL ? e.preprocessURL(f, null) : f), o.preprocessTileset(d, f), d;
		});
	}
	parseToMesh(e, t, n, r) {
		let { skirtLength: i, solid: a, smoothSkirtNormals: o, generateNormals: s, tiles: c } = this, l = c.ellipsoid, u;
		if (n === "quantized_tile_split") {
			let e = new URL(r).searchParams, n = e.get("left") === "true", s = e.get("bottom") === "true", c = new pn();
			c.ellipsoid.copy(l), c.solid = a, c.smoothSkirtNormals = o, c.skirtLength = i === null ? t.geometricError : i;
			let [d, f, p, m] = t.parent.boundingVolume.region;
			c.minLat = f, c.maxLat = m, c.minLon = d, c.maxLon = p;
			let h = t.parent.engineData.scene || t.parent[yn];
			u = c.clipToQuadrant(h, n, s);
		} else if (n === "terrain") {
			let n = new nn(c.manager);
			n.ellipsoid.copy(l), n.solid = a, n.smoothSkirtNormals = o, n.generateNormals = s, n.skirtLength = i === null ? t.geometricError : i;
			let [r, d, f, p] = t.boundingVolume.region;
			n.minLat = d, n.maxLat = p, n.minLon = r, n.maxLon = f, u = n.parse(e);
		} else return;
		let { minHeight: d, maxHeight: f, metadata: p } = u.userData;
		return t.boundingVolume.region[4] = d, t.boundingVolume.region[5] = f, t.engineData.boundingVolume.setRegionData(l, ...t.boundingVolume.region), p && ("geometricerror" in p && (t.geometricError = p.geometricerror), Tn(t, this.layer) && "available" in p && t.children.length === 0 && (t[vn] = [...Array(t[_n] + 1).fill(null), ...p.available])), t[yn] = u, this.expandChildren(t), u;
	}
	getAttributions(e) {
		this.attribution && e.push(this.attribution);
	}
	createChild(e, t, n, r) {
		let { tiles: i, layer: a, tiling: o, projection: s } = this, c = i.ellipsoid, l = r === null && e === 0 || Sn(r, e, t, n), u = En(t, n, e, 1, a), d = [
			...o.getTileBounds(t, n, e),
			-1e4,
			bn
		], [, f, , p, , m] = d, h = f > 0 == p > 0 ? Math.min(Math.abs(f), Math.abs(p)) : 0;
		c.getCartographicToPosition(h, 0, m, xn), xn.z = 0;
		let g = s.tileCountX, _ = Math.max(...c.radius) * 2 * Math.PI * .25 / (65 * g) / 2 ** e, v = {
			[vn]: null,
			[_n]: e,
			[hn]: t,
			[gn]: n,
			refine: "REPLACE",
			geometricError: _,
			boundingVolume: { region: d },
			content: l ? { uri: u } : null,
			children: []
		};
		return Tn(v, a) || (v[vn] = r), v;
	}
	expandChildren(e) {
		let t = e[_n], n = e[hn], r = e[gn], i = e[vn];
		if (t >= this.tiling.maxLevel) return;
		let a = !1;
		for (let o = 0; o < 2; o++) for (let s = 0; s < 2; s++) {
			let c = this.createChild(t + 1, 2 * n + o, 2 * r + s, i);
			c.content === null ? (c.content = { uri: `tile.quantized_tile_split?bottom=${s === 0}&left=${o === 0}` }, c.internal = { isVirtual: !0 }, e.internal.virtualChildCount++, e.children.push(c)) : (e.children.push(c), a = !0);
		}
		a || (e.children.length -= e.internal.virtualChildCount, e.internal.virtualChildCount = 0);
	}
	fetchData(e, t) {
		if (/quantized_tile_split/.test(e)) return /* @__PURE__ */ new ArrayBuffer();
	}
	disposeTile(e) {
		let { tiles: t, layer: n } = this;
		if (delete e[yn], Tn(e, n) && (e[vn] = null), vn in e) {
			let { virtualChildCount: n } = e.internal, r = e.children.length, i = r - n;
			for (let n = i; n < r; n++) t.processNodeQueue.remove(e.children[n]);
			e.children.length = 0, e.internal.virtualChildCount = 0;
		}
	}
}, On = class extends f {
	constructor(e = {}) {
		super({
			assetTypeHandler: (e, t, n) => {
				if (e === "TERRAIN" && t.getPluginByName("QUANTIZED_MESH_PLUGIN") === null) t.registerPlugin(new Dn({ useRecommendedSettings: this.useRecommendedSettings }));
				else if (e === "IMAGERY" && t.getPluginByName("GENERATED_SURFACE_PLUGIN") === null) {
					let e = new Zt({ url: t.rootURL });
					t.registerPlugin(new Ze({
						shape: "ellipsoid",
						overlay: e
					}));
				} else console.warn(`CesiumIonAuthPlugin: Cesium Ion asset type "${e}" unhandled.`);
			},
			...e
		});
	}
}, kn = /* @__PURE__ */ new M(), An = class {
	constructor() {
		this.name = "UPDATE_ON_CHANGE_PLUGIN", this.tiles = null, this.needsUpdate = !1, this.cameraMatrices = /* @__PURE__ */ new Map();
	}
	init(e) {
		this.tiles = e, this._needsUpdateCallback = () => {
			this.needsUpdate = !0;
		}, this._onCameraAdd = ({ camera: e }) => {
			this.needsUpdate = !0, this.cameraMatrices.set(e, new M());
		}, this._onCameraDelete = ({ camera: e }) => {
			this.needsUpdate = !0, this.cameraMatrices.delete(e);
		}, e.addEventListener("needs-update", this._needsUpdateCallback), e.addEventListener("add-camera", this._onCameraAdd), e.addEventListener("delete-camera", this._onCameraDelete), e.addEventListener("camera-resolution-change", this._needsUpdateCallback), e.cameras.forEach((e) => {
			this._onCameraAdd({ camera: e });
		});
	}
	doTilesNeedUpdate() {
		let e = this.tiles, t = !1;
		this.cameraMatrices.forEach((n, r) => {
			kn.copy(e.group.matrixWorld).premultiply(r.matrixWorldInverse).premultiply(r.projectionMatrixInverse), t ||= !kn.equals(n), n.copy(kn);
		});
		let n = this.needsUpdate;
		return this.needsUpdate = !1, n || t;
	}
	preprocessNode() {
		this.needsUpdate = !0;
	}
	dispose() {
		let e = this.tiles;
		e.removeEventListener("camera-resolution-change", this._needsUpdateCallback), e.removeEventListener("needs-update", this._needsUpdateCallback), e.removeEventListener("add-camera", this._onCameraAdd), e.removeEventListener("delete-camera", this._onCameraDelete);
	}
}, jn = /* @__PURE__ */ new F();
function Mn(e, t) {
	if (e.isInterleavedBufferAttribute || e.array instanceof t) return e;
	let n = t === Int8Array || t === Int16Array || t === Int32Array ? -1 : 0, r = new x(new t(e.count * e.itemSize), e.itemSize, !0), i = e.itemSize, a = e.count;
	for (let t = 0; t < a; t++) for (let a = 0; a < i; a++) {
		let i = j.clamp(e.getComponent(t, a), n, 1);
		r.setComponent(t, a, i);
	}
	return r;
}
function Nn(e, t = Int16Array) {
	let n = e.geometry, r = n.attributes, i = r.position;
	if (i.isInterleavedBufferAttribute || i.array instanceof t) return i;
	let a = new x(new t(i.count * i.itemSize), i.itemSize, !1), o = i.itemSize, s = i.count;
	n.computeBoundingBox();
	let c = n.boundingBox, { min: l, max: u } = c, d = 2 ** (8 * t.BYTES_PER_ELEMENT - 1) - 1, f = -d;
	for (let e = 0; e < s; e++) for (let t = 0; t < o; t++) {
		let n = t === 0 ? "x" : t === 1 ? "y" : "z", r = l[n], o = u[n], s = j.mapLinear(i.getComponent(e, t), r, o, f, d);
		a.setComponent(e, t, s);
	}
	c.getCenter(jn).multiply(e.scale).applyQuaternion(e.quaternion), e.position.add(jn), e.scale.x *= .5 * (u.x - l.x) / d, e.scale.y *= .5 * (u.y - l.y) / d, e.scale.z *= .5 * (u.z - l.z) / d, r.position = a, e.geometry.boundingBox = null, e.geometry.boundingSphere = null, e.updateMatrixWorld();
}
var Pn = class {
	constructor(e) {
		this._options = {
			generateNormals: !1,
			disableMipmaps: !0,
			compressIndex: !0,
			compressNormals: !1,
			compressUvs: !1,
			compressPosition: !1,
			uvType: Int8Array,
			normalType: Int8Array,
			positionType: Int16Array,
			...e
		}, this.name = "TILES_COMPRESSION_PLUGIN", this.priority = -100;
	}
	processTileModel(e, t) {
		let { generateNormals: n, disableMipmaps: r, compressIndex: i, compressUvs: a, compressNormals: o, compressPosition: s, uvType: c, normalType: l, positionType: u } = this._options;
		e.traverse((e) => {
			if (e.material && r) {
				let t = e.material;
				for (let e in t) {
					let n = t[e];
					n && n.isTexture && n.generateMipmaps && (n.generateMipmaps = !1, n.minFilter = ae);
				}
			}
			if (e.geometry) {
				let t = e.geometry, r = t.attributes;
				if (a) {
					let { uv: e, uv1: t, uv2: n, uv3: i } = r;
					e && (r.uv = Mn(e, c)), t && (r.uv1 = Mn(t, c)), n && (r.uv2 = Mn(n, c)), i && (r.uv3 = Mn(i, c));
				}
				if (n && !r.normals && t.computeVertexNormals(), o && r.normals && (r.normals = Mn(r.normals, l)), s && Nn(e, u), i && t.index) {
					let e = r.position.count, n = t.index, i = e > 65535 ? Uint32Array : e > 255 ? Uint16Array : Uint8Array;
					if (!(n.array instanceof i)) {
						let e = new i(t.index.count);
						e.set(n.array);
						let r = new x(e, 1);
						t.setIndex(r);
					}
				}
			}
		});
	}
};
//#endregion
//#region src/three/plugins/gltf/metadata/utilities/ClassPropertyHelpers.js
function q(e, t, n) {
	return e && t in e ? e[t] : n;
}
function Fn(e) {
	return e !== "BOOLEAN" && e !== "STRING" && e !== "ENUM";
}
function In(e) {
	return /^FLOAT/.test(e);
}
function Ln(e) {
	return /^VEC/.test(e);
}
function Rn(e) {
	return /^MAT/.test(e);
}
function zn(e, t, n, r = null) {
	return Rn(n) || Ln(n) ? r.fromArray(e, t) : e[t];
}
function Bn(e) {
	let { type: t, componentType: n } = e;
	switch (t) {
		case "SCALAR": return n === "INT64" ? 0n : 0;
		case "VEC2": return new P();
		case "VEC3": return new F();
		case "VEC4": return new I();
		case "MAT2": return new se();
		case "MAT3": return new ce();
		case "MAT4": return new M();
		case "BOOLEAN": return !1;
		case "STRING": return "";
		case "ENUM": return 0;
	}
}
function Vn(e, t) {
	if (t == null) return !1;
	switch (e) {
		case "SCALAR": return typeof t == "number" || typeof t == "bigint";
		case "VEC2": return t.isVector2;
		case "VEC3": return t.isVector3;
		case "VEC4": return t.isVector4;
		case "MAT2": return t.isMatrix2;
		case "MAT3": return t.isMatrix3;
		case "MAT4": return t.isMatrix4;
		case "BOOLEAN": return typeof t == "boolean";
		case "STRING": return typeof t == "string";
		case "ENUM": return typeof t == "number" || typeof t == "bigint";
	}
	throw Error("ClassProperty: invalid type.");
}
function Hn(e, t = null) {
	switch (e) {
		case "INT8": return Int8Array;
		case "INT16": return Int16Array;
		case "INT32": return Int32Array;
		case "INT64": return BigInt64Array;
		case "UINT8": return Uint8Array;
		case "UINT16": return Uint16Array;
		case "UINT32": return Uint32Array;
		case "UINT64": return BigUint64Array;
		case "FLOAT32": return Float32Array;
		case "FLOAT64": return Float64Array;
	}
	switch (t) {
		case "BOOLEAN": return Uint8Array;
		case "STRING": return Uint8Array;
	}
	throw Error("ClassProperty: invalid type.");
}
function Un(e, t = null) {
	if (e.array) {
		t = t && Array.isArray(t) ? t : [], t.length = e.count;
		for (let n = 0, r = t.length; n < r; n++) t[n] = Wn(e, t[n]);
	} else t = Wn(e, t);
	return t;
}
function Wn(e, t = null) {
	let n = e.default, r = e.type;
	if (t ||= Bn(e), n === null) {
		switch (r) {
			case "SCALAR": return 0;
			case "VEC2": return t.set(0, 0);
			case "VEC3": return t.set(0, 0, 0);
			case "VEC4": return t.set(0, 0, 0, 0);
			case "MAT2": return t.identity();
			case "MAT3": return t.identity();
			case "MAT4": return t.identity();
			case "BOOLEAN": return !1;
			case "STRING": return "";
			case "ENUM": return "";
		}
		throw Error("ClassProperty: invalid type.");
	} else if (Rn(r)) t.fromArray(n);
	else if (Ln(r)) t.fromArray(n);
	else return n;
}
function Gn(e, t) {
	if (e.noData === null) return t;
	let n = e.noData, r = e.type;
	if (Array.isArray(t)) for (let e = 0, n = t.length; e < n; e++) t[e] = i(t[e]);
	else t = i(t);
	return t;
	function i(t) {
		return a(t) && (t = Wn(e, t)), t;
	}
	function a(e) {
		if (Rn(r)) {
			let t = e.elements;
			for (let e = 0, r = n.length; e < r; e++) if (n[e] !== t[e]) return !1;
			return !0;
		} else if (Ln(r)) {
			for (let t = 0, r = n.length; t < r; t++) if (n[t] !== e.getComponent(t)) return !1;
			return !0;
		} else return n === e;
	}
}
function Kn(e, t) {
	switch (e) {
		case "INT8": return Math.max(t / 127, -1);
		case "INT16": return Math.max(t, 32767, -1);
		case "INT32": return Math.max(t / 2147483647, -1);
		case "INT64": return Math.max(Number(t) / 0x8000000000000000, -1);
		case "UINT8": return t / 255;
		case "UINT16": return t / 65535;
		case "UINT32": return t / 4294967295;
		case "UINT64": return Number(t) / 0x10000000000000000;
	}
}
function qn(e, t) {
	let { type: n, componentType: r, scale: i, offset: a, normalized: o } = e;
	if (Array.isArray(t)) for (let e = 0, n = t.length; e < n; e++) t[e] = s(t[e]);
	else t = s(t);
	return t;
	function s(e) {
		return e = Rn(n) ? l(e) : Ln(n) ? c(e) : u(e), e;
	}
	function c(e) {
		return e.x = u(e.x), e.y = u(e.y), "z" in e && (e.z = u(e.z)), "w" in e && (e.w = u(e.w)), e;
	}
	function l(e) {
		let t = e.elements;
		for (let e = 0, n = t.length; e < n; e++) t[e] = u(t[e]);
		return e;
	}
	function u(e) {
		return o && (e = Kn(r, e)), (o || In(r)) && (e = e * i + a), e;
	}
}
function Jn(e, t, n = null) {
	if (e.array) {
		Array.isArray(t) || (t = Array(e.count || 0)), t.length = n === null ? e.count : n;
		for (let n = 0, r = t.length; n < r; n++) Vn(e.type, t[n]) || (t[n] = Bn(e));
	} else Vn(e.type, t) || (t = Bn(e));
	return t;
}
function Yn(e, t) {
	for (let n in t) n in e || delete t[n];
	for (let n in e) {
		let r = e[n];
		t[n] = Jn(r, t[n]);
	}
}
function Xn(e) {
	switch (e) {
		case "ENUM": return 1;
		case "SCALAR": return 1;
		case "VEC2": return 2;
		case "VEC3": return 3;
		case "VEC4": return 4;
		case "MAT2": return 4;
		case "MAT3": return 9;
		case "MAT4": return 16;
		case "BOOLEAN": return -1;
		case "STRING": return -1;
		default: return -1;
	}
}
//#endregion
//#region src/three/plugins/gltf/metadata/classes/ClassProperty.js
var Zn = class {
	constructor(e, t, n = null) {
		this.name = t.name || null, this.description = t.description || null, this.type = t.type, this.componentType = t.componentType || null, this.enumType = t.enumType || null, this.array = t.array || !1, this.count = t.count || 0, this.normalized = t.normalized || !1, this.offset = t.offset || 0, this.scale = q(t, "scale", 1), this.max = q(t, "max", Infinity), this.min = q(t, "min", -Infinity), this.required = t.required || !1, this.noData = q(t, "noData", null), this.default = q(t, "default", null), this.semantic = q(t, "semantic", null), this.enumSet = null, this.accessorProperty = n, n && (this.offset = q(n, "offset", this.offset), this.scale = q(n, "scale", this.scale), this.max = q(n, "max", this.max), this.min = q(n, "min", this.min)), t.type === "ENUM" && (this.enumSet = e[this.enumType], this.componentType === null && (this.componentType = q(this.enumSet, "valueType", "UINT16")));
	}
	shapeToProperty(e, t = null) {
		return Jn(this, e, t);
	}
	resolveDefaultElement(e) {
		return Wn(this, e);
	}
	resolveDefault(e) {
		return Un(this, e);
	}
	resolveNoData(e) {
		return Gn(this, e);
	}
	resolveEnumsToStrings(e) {
		let t = this.enumSet;
		if (this.type === "ENUM") if (Array.isArray(e)) for (let t = 0, r = e.length; t < r; t++) e[t] = n(e[t]);
		else e = n(e);
		return e;
		function n(e) {
			let n = t.values.find((t) => t.value === e);
			return n === null ? "" : n.name;
		}
	}
	adjustValueScaleOffset(e) {
		return Fn(this.type) ? qn(this, e) : e;
	}
}, Qn = class {
	constructor(e, t = {}, n = {}, r = null) {
		this.definition = e, this.class = t[e.class], this.className = e.class, this.enums = n, this.data = r, this.name = "name" in e ? e.name : null, this.properties = null;
	}
	getPropertyNames() {
		return Object.keys(this.class.properties);
	}
	includesData(e) {
		return !!this.definition.properties[e];
	}
	dispose() {}
	_initProperties(e = Zn) {
		let t = {};
		for (let n in this.class.properties) t[n] = new e(this.enums, this.class.properties[n], this.definition.properties[n]);
		this.properties = t;
	}
}, $n = class extends Zn {
	constructor(e, t, n = null) {
		super(e, t, n), this.attribute = n?.attribute ?? null;
	}
}, er = class extends Qn {
	constructor(...e) {
		super(...e), this.isPropertyAttributeAccessor = !0, this._initProperties($n);
	}
	getData(e, t, n = {}) {
		let r = this.properties;
		Yn(r, n);
		for (let i in r) n[i] = this.getPropertyValue(i, e, t, n[i]);
		return n;
	}
	getPropertyValue(e, t, n, r = null) {
		if (t >= this.count) throw Error("PropertyAttributeAccessor: Requested index is outside the range of the buffer.");
		let i = this.properties[e], a = i.type;
		if (!i) throw Error("PropertyAttributeAccessor: Requested class property does not exist.");
		if (!this.definition.properties[e]) return i.resolveDefault(r);
		r = i.shapeToProperty(r);
		let o = n.getAttribute(i.attribute.toLowerCase());
		if (Rn(a)) {
			let e = r.elements;
			for (let n = e.length; 0 < n;) e[0] = o.getComponent(t, 0);
		} else if (Ln(a)) r.fromBufferAttribute(o, t);
		else if (a === "SCALAR" || a === "ENUM") r = o.getX(t);
		else throw Error("StructuredMetadata.PropertyAttributeAccessor: BOOLEAN and STRING types are not supported by property attributes.");
		return r = i.adjustValueScaleOffset(r), r = i.resolveEnumsToStrings(r), r = i.resolveNoData(r), r;
	}
}, tr = class extends Zn {
	constructor(e, t, n = null) {
		super(e, t, n), this.values = n?.values ?? null, this.valueLength = Xn(this.type), this.arrayOffsets = q(n, "arrayOffsets", null), this.stringOffsets = q(n, "stringOffsets", null), this.arrayOffsetType = q(n, "arrayOffsetType", "UINT32"), this.stringOffsetType = q(n, "stringOffsetType", "UINT32");
	}
	getArrayLengthFromId(e, t) {
		let n = this.count;
		if (this.arrayOffsets !== null) {
			let { arrayOffsets: r, arrayOffsetType: i } = this, a = new (Hn(i))(e[r]);
			n = a[t + 1] - a[t];
		}
		return n;
	}
	getIndexOffsetFromId(e, t) {
		let n = t;
		if (this.arrayOffsets) {
			let { arrayOffsets: t, arrayOffsetType: r } = this;
			n = new (Hn(r))(e[t])[n];
		} else this.array && (n *= this.count);
		return n;
	}
}, nr = class extends Qn {
	constructor(...e) {
		super(...e), this.isPropertyTableAccessor = !0, this.count = this.definition.count, this._initProperties(tr);
	}
	getData(e, t = {}) {
		let n = this.properties;
		Yn(n, t);
		for (let r in n) t[r] = this.getPropertyValue(r, e, t[r]);
		return t;
	}
	_readValueAtIndex(e, t, n, r = null) {
		let i = this.properties[e], { componentType: a, type: o } = i, s = this.data, c = s[i.values], l = new (Hn(a, o))(c), u = i.getIndexOffsetFromId(s, t);
		if (Fn(o) || o === "ENUM") return zn(l, (u + n) * i.valueLength, o, r);
		if (o === "STRING") {
			let e = u + n, t = 0;
			if (i.stringOffsets !== null) {
				let { stringOffsets: n, stringOffsetType: r } = i, a = new (Hn(r))(s[n]);
				t = a[e + 1] - a[e], e = a[e];
			}
			let a = new Uint8Array(l.buffer, e, t);
			r = new TextDecoder().decode(a);
		} else if (o === "BOOLEAN") {
			let e = u + n, t = Math.floor(e / 8), i = e % 8;
			r = (l[t] >> i & 1) == 1;
		}
		return r;
	}
	getPropertyValue(e, t, n = null) {
		if (t >= this.count) throw Error("PropertyTableAccessor: Requested index is outside the range of the table.");
		let r = this.properties[e];
		if (!r) throw Error("PropertyTableAccessor: Requested property does not exist.");
		if (!this.definition.properties[e]) return r.resolveDefault(n);
		let i = r.array, a = this.data, o = r.getArrayLengthFromId(a, t);
		if (n = r.shapeToProperty(n, o), i) for (let r = 0, i = n.length; r < i; r++) n[r] = this._readValueAtIndex(e, t, r, n[r]);
		else n = this._readValueAtIndex(e, t, 0, n);
		return n = r.adjustValueScaleOffset(n), n = r.resolveEnumsToStrings(n), n = r.resolveNoData(n), n;
	}
}, rr = /* @__PURE__ */ new _(), ir = class {
	constructor() {
		this._renderer = new je(), this._target = new Ae(1, 1), this._texTarget = new Ae(), this._quad = new Pe(new xe({
			blending: T,
			blendDst: Me,
			blendSrc: de,
			uniforms: {
				map: { value: null },
				pixel: { value: new P() }
			},
			vertexShader: "\n				void main() {\n\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n				}\n			",
			fragmentShader: "\n				uniform sampler2D map;\n				uniform ivec2 pixel;\n\n				void main() {\n\n					gl_FragColor = texelFetch( map, pixel, 0 );\n\n				}\n			"
		}));
	}
	increaseSizeTo(e) {
		this._target.setSize(Math.max(this._target.width, e), 1);
	}
	readDataAsync(e) {
		let { _renderer: t, _target: n } = this;
		return t.readRenderTargetPixelsAsync(n, 0, 0, e.length / 4, 1, e);
	}
	readData(e) {
		let { _renderer: t, _target: n } = this;
		t.readRenderTargetPixels(n, 0, 0, e.length / 4, 1, e);
	}
	renderPixelToTarget(e, t, n) {
		let { _renderer: r, _target: i } = this;
		rr.min.copy(t), rr.max.copy(t), rr.max.x += 1, rr.max.y += 1, r.initRenderTarget(i), r.copyTextureToTexture(e, i.texture, rr, n, 0);
	}
}, ar = /* @__PURE__ */ new class {
	constructor() {
		let e = null;
		Object.getOwnPropertyNames(ir.prototype).forEach((t) => {
			t !== "constructor" && (this[t] = (...n) => (e ||= new ir(), e[t](...n)));
		});
	}
}(), or = /* @__PURE__ */ new P(), sr = /* @__PURE__ */ new P(), cr = /* @__PURE__ */ new P();
function lr(e, t) {
	return t === 0 ? e.getAttribute("uv") : e.getAttribute(`uv${t}`);
}
function ur(e, t, n = [
	,
	,
	,
]) {
	let r = 3 * t, i = 3 * t + 1, a = 3 * t + 2;
	return e.index && (r = e.index.getX(r), i = e.index.getX(i), a = e.index.getX(a)), n[0] = r, n[1] = i, n[2] = a, n;
}
function dr(e, t, n, r, i) {
	let [a, o, s] = r, c = lr(e, t);
	or.fromBufferAttribute(c, a), sr.fromBufferAttribute(c, o), cr.fromBufferAttribute(c, s), i.set(0, 0, 0).addScaledVector(or, n.x).addScaledVector(sr, n.y).addScaledVector(cr, n.z);
}
function fr(e, t, n, r) {
	let i = e.x - Math.floor(e.x), a = e.y - Math.floor(e.y), o = Math.floor(i * t % t), s = Math.floor(a * n % n);
	return r.set(o, s), r;
}
//#endregion
//#region src/three/plugins/gltf/metadata/classes/PropertyTextureAccessor.js
var pr = /* @__PURE__ */ new P(), mr = /* @__PURE__ */ new P(), hr = /* @__PURE__ */ new P(), gr = class extends Zn {
	constructor(e, t, n = null) {
		super(e, t, n), this.channels = q(n, "channels", [0]), this.index = q(n, "index", null), this.texCoord = q(n, "texCoord", null), this.valueLength = parseInt(this.type.replace(/[^0-9]/g, "")) || 1;
	}
	readDataFromBuffer(e, t, n = null) {
		let r = this.type;
		if (r === "BOOLEAN" || r === "STRING") throw Error("PropertyTextureAccessor: BOOLEAN and STRING types not supported.");
		return zn(e, t * this.valueLength, r, n);
	}
}, _r = class extends Qn {
	constructor(...e) {
		super(...e), this.isPropertyTextureAccessor = !0, this._asyncRead = !1, this._initProperties(gr);
	}
	getData(e, t, n, r = {}) {
		let i = this.properties;
		Yn(i, r);
		let a = Object.keys(i), o = a.map((e) => r[e]);
		return this.getPropertyValuesAtTexel(a, e, t, n, o), a.forEach((e, t) => r[e] = o[t]), r;
	}
	async getDataAsync(e, t, n, r = {}) {
		let i = this.properties;
		Yn(i, r);
		let a = Object.keys(i), o = a.map((e) => r[e]);
		return await this.getPropertyValuesAtTexelAsync(a, e, t, n, o), a.forEach((e, t) => r[e] = o[t]), r;
	}
	getPropertyValuesAtTexelAsync(...e) {
		this._asyncRead = !0;
		let t = this.getPropertyValuesAtTexel(...e);
		return this._asyncRead = !1, t;
	}
	getPropertyValuesAtTexel(e, t, n, r, i = []) {
		for (; i.length < e.length;) i.push(null);
		i.length = e.length, ar.increaseSizeTo(i.length);
		let a = this.data, o = this.definition.properties, s = this.properties, c = ur(r, t);
		for (let t = 0, i = e.length; t < i; t++) {
			let i = e[t];
			if (!o[i]) continue;
			let l = s[i], u = a[l.index];
			dr(r, l.texCoord, n, c, pr), fr(pr, u.image.width, u.image.height, mr), hr.set(t, 0), ar.renderPixelToTarget(u, mr, hr);
		}
		let l = new Uint8Array(e.length * 4);
		if (this._asyncRead) return ar.readDataAsync(l).then(() => (u.call(this), i));
		return ar.readData(l), u.call(this), i;
		function u() {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t], r = s[n], a = r.type;
				if (i[t] = Jn(r, i[t]), !r) throw Error("PropertyTextureAccessor: Requested property does not exist.");
				if (!o[n]) {
					i[t] = r.resolveDefault(i);
					continue;
				}
				let c = r.valueLength * (r.count || 1), u = r.channels.map((e) => l[4 * t + e]), d = r.componentType, f = new (Hn(d, a))(c);
				if (new Uint8Array(f.buffer).set(u), r.array) {
					let e = i[t];
					for (let t = 0, n = e.length; t < n; t++) e[t] = r.readDataFromBuffer(f, t, e[t]);
				} else i[t] = r.readDataFromBuffer(f, 0, i[t]);
				i[t] = r.adjustValueScaleOffset(i[t]), i[t] = r.resolveEnumsToStrings(i[t]), i[t] = r.resolveNoData(i[t]);
			}
		}
	}
	dispose() {
		this.data.forEach((e) => {
			e && (e.dispose(), e.image instanceof ImageBitmap && e.image.close());
		});
	}
}, vr = class {
	constructor(e, t, n, r = null, i = null) {
		let { schema: a, propertyTables: o = [], propertyTextures: s = [], propertyAttributes: c = [] } = e, { enums: l, classes: u } = a, d = o.map((e) => new nr(e, u, l, n)), f = [], p = [];
		r && (r.propertyTextures && (f = r.propertyTextures.map((e) => new _r(s[e], u, l, t))), r.propertyAttributes && (p = r.propertyAttributes.map((e) => new er(c[e], u, l)))), this.schema = a, this.tableAccessors = d, this.textureAccessors = f, this.attributeAccessors = p, this.object = i, this.textures = t, this.nodeMetadata = r;
	}
	getPropertyTableData(e, t, n = null) {
		if (!Array.isArray(e)) n ||= {}, n = this.tableAccessors[e].getData(t, n);
		else {
			n ||= [];
			let r = Math.min(e.length, t.length);
			n.length = r;
			for (let i = 0; i < r; i++) {
				let r = this.tableAccessors[e[i]];
				n[i] = r.getData(t[i], n[i]);
			}
		}
		if (Array.isArray(e) !== Array.isArray(n) || Array.isArray(e) !== Array.isArray(t)) throw Error("StructuralMetadata: Scalar and array inputs cannot be mixed.");
		return n;
	}
	getPropertyTableInfo(e = null) {
		if (e === null && (e = this.tableAccessors.map((e, t) => t)), Array.isArray(e)) return e.map((e) => {
			let t = this.tableAccessors[e];
			return {
				name: t.name,
				className: t.definition.class
			};
		});
		{
			let t = this.tableAccessors[e];
			return {
				name: t.name,
				className: t.definition.class
			};
		}
	}
	getPropertyTextureData(e, t, n = []) {
		let r = this.textureAccessors;
		n.length = r.length;
		for (let i = 0; i < r.length; i++) n[i] = r[i].getData(e, t, this.object.geometry, n[i]);
		return n;
	}
	async getPropertyTextureDataAsync(e, t, n = []) {
		let r = this.textureAccessors;
		n.length = r.length;
		let i = [];
		for (let a = 0; a < r.length; a++) {
			let o = r[a].getDataAsync(e, t, this.object.geometry, n[a]).then((e) => {
				n[a] = e;
			});
			i.push(o);
		}
		return await Promise.all(i), n;
	}
	getPropertyTextureInfo() {
		return this.textureAccessors;
	}
	getPropertyAttributeData(e, t = []) {
		let n = this.attributeAccessors;
		t.length = n.length;
		for (let r = 0; r < n.length; r++) t[r] = n[r].getData(e, this.object.geometry, t[r]);
		return t;
	}
	getPropertyAttributeInfo() {
		return this.attributeAccessors.map((e) => ({
			name: e.name,
			className: e.definition.class
		}));
	}
	dispose() {
		this.textureAccessors.forEach((e) => e.dispose()), this.tableAccessors.forEach((e) => e.dispose()), this.attributeAccessors.forEach((e) => e.dispose());
	}
}, yr = "EXT_structural_metadata";
function br(e, t = []) {
	let n = e.json.textures?.length || 0, r = Array(n).fill(null);
	return t.forEach(({ properties: t }) => {
		for (let n in t) {
			let { index: i } = t[n];
			r[i] === null && (r[i] = e.loadTexture(i));
		}
	}), Promise.all(r);
}
function xr(e, t = []) {
	let n = e.json.bufferViews?.length || 0, r = Array(n).fill(null);
	return t.forEach(({ properties: t }) => {
		for (let n in t) {
			let { values: i, arrayOffsets: a, stringOffsets: o } = t[n];
			r[i] === null && (r[i] = e.getDependency("bufferView", i)), r[a] === null && (r[a] = e.getDependency("bufferView", a)), r[o] === null && (r[o] = e.getDependency("bufferView", o));
		}
	}), Promise.all(r);
}
var Sr = class {
	constructor(e) {
		this.parser = e, this.name = yr;
	}
	async afterRoot({ scene: e, parser: t }) {
		let n = t.json.extensionsUsed;
		if (!n || !n.includes(yr)) return;
		let r = null, i = t.json.extensions[yr];
		if (i.schemaUri) {
			let { manager: e, path: n, requestHeader: a, crossOrigin: o } = t.options, s = new URL(i.schemaUri, n).toString(), c = new ee(e);
			c.setCrossOrigin(o), c.setResponseType("json"), c.setRequestHeader(a), r = c.loadAsync(s).then((e) => {
				i = {
					...i,
					schema: e
				};
			});
		}
		let [a, o] = await Promise.all([
			br(t, i.propertyTextures),
			xr(t, i.propertyTables),
			r
		]), s = new vr(i, a, o);
		e.userData.structuralMetadata = s, e.traverse((e) => {
			if (t.associations.has(e)) {
				let { meshes: n, primitives: r } = t.associations.get(e), c = t.json.meshes[n]?.primitives[r];
				if (c && c.extensions && c.extensions[yr]) {
					let t = c.extensions[yr];
					e.userData.structuralMetadata = new vr(i, a, o, t, e);
				} else e.userData.structuralMetadata = s;
			}
		});
	}
}, Cr = /* @__PURE__ */ new P(), wr = /* @__PURE__ */ new P(), Tr = /* @__PURE__ */ new P();
function Er(e) {
	return e.x > e.y && e.x > e.z ? 0 : e.y > e.z ? 1 : 2;
}
var Dr = class {
	constructor(e, t, n) {
		this.geometry = e, this.textures = t, this.data = n, this._asyncRead = !1, this.featureIds = n.featureIds.map((e) => {
			let { texture: t, ...n } = e, r = {
				label: null,
				propertyTable: null,
				nullFeatureId: null,
				...n
			};
			return t && (r.texture = {
				texCoord: 0,
				channels: [0],
				...t
			}), r;
		});
	}
	getTextures() {
		return this.textures;
	}
	getFeatureInfo() {
		return this.featureIds;
	}
	getFeaturesAsync(...e) {
		this._asyncRead = !0;
		let t = this.getFeatures(...e);
		return this._asyncRead = !1, t;
	}
	getFeatures(e, t) {
		let { geometry: n, textures: r, featureIds: i } = this, a = Array(i.length).fill(null), o = i.length;
		ar.increaseSizeTo(o);
		let s = ur(n, e), c = s[Er(t)];
		for (let e = 0, o = i.length; e < o; e++) {
			let o = i[e], l = "nullFeatureId" in o ? o.nullFeatureId : null;
			if ("texture" in o) {
				let i = r[o.texture.index];
				dr(n, o.texture.texCoord, t, s, Cr), fr(Cr, i.image.width, i.image.height, wr), Tr.set(e, 0), ar.renderPixelToTarget(r[o.texture.index], wr, Tr);
			} else if ("attribute" in o) {
				let t = n.getAttribute(`_feature_id_${o.attribute}`).getX(c);
				t !== l && (a[e] = t);
			} else {
				let t = c;
				t !== l && (a[e] = t);
			}
		}
		let l = new Uint8Array(o * 4);
		if (this._asyncRead) return ar.readDataAsync(l).then(() => (u(), a));
		return ar.readData(l), u(), a;
		function u() {
			let e = new Uint32Array(1);
			for (let t = 0, n = i.length; t < n; t++) {
				let n = i[t], r = "nullFeatureId" in n ? n.nullFeatureId : null;
				if ("texture" in n) {
					let { channels: i } = n.texture, o = i.map((e) => l[4 * t + e]);
					new Uint8Array(e.buffer).set(o);
					let s = e[0];
					s !== r && (a[t] = s);
				}
			}
		}
	}
	dispose() {
		this.textures.forEach((e) => {
			e && (e.dispose(), e.image instanceof ImageBitmap && e.image.close());
		});
	}
}, Or = "EXT_mesh_features";
function kr(e, t, n) {
	e.traverse((e) => {
		if (t.associations.has(e)) {
			let { meshes: r, primitives: i } = t.associations.get(e), a = t.json.meshes[r]?.primitives[i];
			a && a.extensions && a.extensions[Or] && n(e, a.extensions[Or]);
		}
	});
}
var Ar = class {
	constructor(e) {
		this.parser = e, this.name = Or;
	}
	async afterRoot({ scene: e, parser: t }) {
		let n = t.json.extensionsUsed;
		if (!n || !n.includes(Or)) return;
		let r = t.json.textures?.length || 0, i = Array(r).fill(null);
		kr(e, t, (e, { featureIds: n }) => {
			n.forEach((e) => {
				if (e.texture && i[e.texture.index] === null) {
					let n = e.texture.index;
					i[n] = t.loadTexture(n);
				}
			});
		});
		let a = await Promise.all(i);
		kr(e, t, (e, t) => {
			e.userData.meshFeatures = new Dr(e.geometry, a, t);
		});
	}
}, jr = class {
	constructor() {
		this.name = "CESIUM_RTC";
	}
	afterRoot(e) {
		if (e.parser.json.extensions && e.parser.json.extensions.CESIUM_RTC) {
			let { center: t } = e.parser.json.extensions.CESIUM_RTC;
			t && (e.scene.position.x += t[0], e.scene.position.y += t[1], e.scene.position.z += t[2]);
		}
	}
}, Mr = class {
	constructor(e) {
		e = {
			metadata: !0,
			rtc: !0,
			plugins: [],
			dracoLoader: null,
			ktxLoader: null,
			meshoptDecoder: null,
			autoDispose: !0,
			...e
		}, this.tiles = null, this.metadata = e.metadata, this.rtc = e.rtc, this.plugins = e.plugins, this.dracoLoader = e.dracoLoader, this.ktxLoader = e.ktxLoader, this.meshoptDecoder = e.meshoptDecoder, this._gltfRegex = /\.(gltf|glb)$/g, this._dracoRegex = /\.drc$/g, this._loader = null;
	}
	init(e) {
		let t = new Ne(e.manager);
		this.dracoLoader && (t.setDRACOLoader(this.dracoLoader), e.manager.addHandler(this._dracoRegex, this.dracoLoader)), this.ktxLoader && t.setKTX2Loader(this.ktxLoader), this.meshoptDecoder && t.setMeshoptDecoder(this.meshoptDecoder), this.rtc && t.register(() => new jr()), this.metadata && (t.register(() => new Sr()), t.register(() => new Ar())), this.plugins.forEach((e) => t.register(e)), e.manager.addHandler(this._gltfRegex, t), this.tiles = e, this._loader = t;
	}
	dispose() {
		this.tiles.manager.removeHandler(this._gltfRegex), this.tiles.manager.removeHandler(this._dracoRegex), this.autoDispose && (this.ktxLoader.dispose(), this.dracoLoader.dispose());
	}
}, Nr = /* @__PURE__ */ new Ce(), Pr = class {
	constructor(e) {
		e = {
			up: "+z",
			recenter: !0,
			lat: null,
			lon: null,
			height: 0,
			azimuth: 0,
			elevation: 0,
			roll: 0,
			...e
		}, this.tiles = null, this.up = e.up.toLowerCase().replace(/\s+/, ""), this.lat = e.lat, this.lon = e.lon, this.height = e.height, this.azimuth = e.azimuth, this.elevation = e.elevation, this.roll = e.roll, this.recenter = e.recenter, this._callback = null;
	}
	init(e) {
		this.tiles = e, this._callback = () => {
			let { up: t, lat: n, lon: r, height: i, azimuth: a, elevation: o, roll: s, recenter: c } = this;
			if (n !== null && r !== null) this.transformLatLonHeightToOrigin(n, r, i, a, o, s);
			else {
				let { ellipsoid: n } = e, r = Math.min(...n.radius);
				if (e.getBoundingSphere(Nr), Nr.center.length() > r * .5) {
					let e = {};
					n.getPositionToCartographic(Nr.center, e), this.transformLatLonHeightToOrigin(e.lat, e.lon, e.height);
				} else {
					let n = e.group;
					switch (n.rotation.set(0, 0, 0), t) {
						case "x":
						case "+x":
							n.rotation.z = Math.PI / 2;
							break;
						case "-x":
							n.rotation.z = -Math.PI / 2;
							break;
						case "y":
						case "+y": break;
						case "-y":
							n.rotation.z = Math.PI;
							break;
						case "z":
						case "+z":
							n.rotation.x = -Math.PI / 2;
							break;
						case "-z":
							n.rotation.x = Math.PI / 2;
							break;
					}
					e.group.position.copy(Nr.center).applyEuler(n.rotation).multiplyScalar(-1);
				}
			}
			c || e.group.position.setScalar(0), e.removeEventListener("load-root-tileset", this._callback);
		}, e.addEventListener("load-root-tileset", this._callback), e.root && this._callback();
	}
	transformLatLonHeightToOrigin(e, t, n = 0, r = 0, i = 0, a = 0) {
		let { group: o, ellipsoid: s } = this.tiles;
		s.getObjectFrame(e, t, n, r, i, a, o.matrix, 2), o.matrix.invert().decompose(o.position, o.quaternion, o.scale), o.updateMatrixWorld();
	}
	dispose() {
		let { group: e } = this.tiles;
		e.position.setScalar(0), e.quaternion.identity(), e.scale.set(1, 1, 1), this.tiles.removeEventListener("load-root-tileset", this._callback);
	}
}, Fr = class {
	set delay(e) {
		this.deferCallbacks.delay = e;
	}
	get delay() {
		return this.deferCallbacks.delay;
	}
	set bytesTarget(e) {
		this.lruCache.minBytesSize = e;
	}
	get bytesTarget() {
		return this.lruCache.minBytesSize;
	}
	get estimatedGpuBytes() {
		return this.lruCache.cachedBytes;
	}
	constructor(e = {}) {
		let { delay: n = 0, bytesTarget: r = 0 } = e;
		this.name = "UNLOAD_TILES_PLUGIN", this.tiles = null, this.lruCache = new t(), this.deferCallbacks = new Ir(), this.delay = n, this.bytesTarget = r;
	}
	init(e) {
		this.tiles = e;
		let { lruCache: t, deferCallbacks: n } = this, r = (t) => {
			let n = t.engineData.scene;
			e.visibleTiles.has(t) || e.invokeOnePlugin((e) => e.unloadTileFromGPU && e.unloadTileFromGPU(n, t));
		};
		this._onUpdateBefore = () => {
			t.unloadPriorityCallback = e.lruCache.unloadPriorityCallback, t.minSize = Infinity, t.maxSize = Infinity, t.maxBytesSize = Infinity, t.unloadPercent = 1, t.autoMarkUnused = !1;
		}, this._onVisibilityChangeCallback = ({ tile: i, scene: a, visible: o }) => {
			o ? (t.add(i, r), t.setMemoryUsage(i, e.calculateBytesUsed(i, a) || 1), e.markTileUsed(i), n.cancel(i)) : n.run(i);
		}, this._onDisposeModel = ({ tile: e }) => {
			t.remove(e), n.cancel(e);
		}, n.callback = (e) => {
			t.markUnused(e), t.scheduleUnload();
		}, e.forEachLoadedModel((t, n) => {
			let r = e.visibleTiles.has(n);
			this._onVisibilityChangeCallback({
				tile: n,
				visible: r
			});
		}), e.addEventListener("tile-visibility-change", this._onVisibilityChangeCallback), e.addEventListener("update-before", this._onUpdateBefore), e.addEventListener("dispose-model", this._onDisposeModel);
	}
	unloadTileFromGPU(e, t) {
		e && e.traverse((e) => {
			if (e.material) {
				let t = e.material;
				t.dispose();
				for (let e in t) {
					let n = t[e];
					n && n.isTexture && n.dispose();
				}
			}
			e.geometry && e.geometry.dispose();
		});
	}
	dispose() {
		let { lruCache: e, tiles: t, deferCallbacks: n } = this;
		t.removeEventListener("tile-visibility-change", this._onVisibilityChangeCallback), t.removeEventListener("update-before", this._onUpdateBefore), t.removeEventListener("dispose-model", this._onDisposeModel), n.cancelAll(), e.minBytesSize = 0, e.minSize = 0, e.maxSize = 0, e.markAllUnused(), e.scheduleUnload();
	}
}, Ir = class {
	constructor(e = () => {}) {
		this.map = /* @__PURE__ */ new Map(), this.callback = e, this.delay = 0;
	}
	run(e) {
		let { map: t, delay: n } = this;
		if (t.has(e)) throw Error("DeferCallbackManager: Callback already initialized.");
		n === 0 ? this.callback(e) : t.set(e, setTimeout(() => {
			this.callback(e), t.delete(e);
		}, n));
	}
	cancel(e) {
		let { map: t } = this;
		t.has(e) && (clearTimeout(t.get(e)), t.delete(e));
	}
	cancelAll() {
		this.map.forEach((e, t) => {
			this.cancel(t);
		});
	}
}, { clamp: Lr } = j, Rr = class {
	constructor() {
		this.duration = 250, this.fadeCount = 0, this._lastTick = -1, this._fadeState = /* @__PURE__ */ new Map(), this.onFadeComplete = null, this.onFadeStart = null, this.onFadeSetComplete = null, this.onFadeSetStart = null;
	}
	deleteObject(e) {
		e && this.completeFade(e);
	}
	guaranteeState(e) {
		let t = this._fadeState;
		return t.has(e) ? !1 : (t.set(e, {
			fadeInTarget: 0,
			fadeOutTarget: 0,
			fadeIn: 0,
			fadeOut: 0
		}), !0);
	}
	completeFade(e) {
		let t = this._fadeState;
		if (!t.has(e)) return;
		let n = t.get(e).fadeOutTarget === 0;
		t.delete(e), this.fadeCount--, this.onFadeComplete && this.onFadeComplete(e, n), this.fadeCount === 0 && this.onFadeSetComplete && this.onFadeSetComplete();
	}
	completeAllFades() {
		this._fadeState.forEach((e, t) => {
			this.completeFade(t);
		});
	}
	forEachObject(e) {
		this._fadeState.forEach((t, n) => {
			e(n, t);
		});
	}
	fadeIn(e) {
		let t = this.guaranteeState(e), n = this._fadeState.get(e);
		n.fadeInTarget = 1, n.fadeOutTarget = 0, n.fadeOut = 0, t && (this.fadeCount++, this.fadeCount === 1 && this.onFadeSetStart && this.onFadeSetStart(), this.onFadeStart && this.onFadeStart(e));
	}
	fadeOut(e) {
		let t = this.guaranteeState(e), n = this._fadeState.get(e);
		n.fadeOutTarget = 1, t && (n.fadeInTarget = 1, n.fadeIn = 1, this.fadeCount++, this.fadeCount === 1 && this.onFadeSetStart && this.onFadeSetStart(), this.onFadeStart && this.onFadeStart(e));
	}
	isFading(e) {
		return this._fadeState.has(e);
	}
	isFadingOut(e) {
		let t = this._fadeState.get(e);
		return t && t.fadeOutTarget === 1;
	}
	update() {
		let e = window.performance.now();
		this._lastTick === -1 && (this._lastTick = e);
		let t = Lr((e - this._lastTick) / this.duration, 0, 1);
		this._lastTick = e, this._fadeState.forEach((e, n) => {
			let { fadeOutTarget: r, fadeInTarget: i } = e, { fadeOut: a, fadeIn: o } = e, s = Math.sign(i - o);
			o = Lr(o + s * t, 0, 1);
			let c = Math.sign(r - a);
			a = Lr(a + c * t, 0, 1), e.fadeIn = o, e.fadeOut = a, ((a === 1 || a === 0) && (o === 1 || o === 0) || a >= o) && this.completeFade(n);
		});
	}
}, zr = Symbol("FADE_PARAMS");
function Br(e, t) {
	if (e[zr]) return e[zr];
	let n = {
		fadeIn: { value: 0 },
		fadeOut: { value: 0 },
		fadeTexture: { value: null }
	};
	return e[zr] = n, e.defines = {
		...e.defines || {},
		FEATURE_FADE: 0
	}, e.onBeforeCompile = (e) => {
		t && t(e), e.uniforms = {
			...e.uniforms,
			...n
		}, e.vertexShader = e.vertexShader.replace(/void\s+main\(\)\s+{/, (e) => `
					#ifdef USE_BATCHING_FRAG

					varying float vBatchId;

					#endif

					${e}

						#ifdef USE_BATCHING_FRAG

						// add 0.5 to the value to avoid floating error that may cause flickering
						vBatchId = getIndirectIndex( gl_DrawID ) + 0.5;

						#endif
				`), e.fragmentShader = e.fragmentShader.replace(/void main\(/, (e) => `
				#if FEATURE_FADE

				// adapted from https://www.shadertoy.com/view/Mlt3z8
				float bayerDither2x2( vec2 v ) {

					return mod( 3.0 * v.y + 2.0 * v.x, 4.0 );

				}

				float bayerDither4x4( vec2 v ) {

					vec2 P1 = mod( v, 2.0 );
					vec2 P2 = floor( 0.5 * mod( v, 4.0 ) );
					return 4.0 * bayerDither2x2( P1 ) + bayerDither2x2( P2 );

				}

				// the USE_BATCHING define is not available in fragment shaders
				#ifdef USE_BATCHING_FRAG

				// functions for reading the fade state of a given batch id
				uniform sampler2D fadeTexture;
				varying float vBatchId;
				vec2 getFadeValues( const in float i ) {

					int size = textureSize( fadeTexture, 0 ).x;
					int j = int( i );
					int x = j % size;
					int y = j / size;
					return texelFetch( fadeTexture, ivec2( x, y ), 0 ).rg;

				}

				#else

				uniform float fadeIn;
				uniform float fadeOut;

				#endif

				#endif

				${e}
			`).replace(/#include <dithering_fragment>/, (e) => `

				${e}

				#if FEATURE_FADE

				#ifdef USE_BATCHING_FRAG

				vec2 fadeValues = getFadeValues( vBatchId );
				float fadeIn = fadeValues.r;
				float fadeOut = fadeValues.g;

				#endif

				float bayerValue = bayerDither4x4( floor( mod( gl_FragCoord.xy, 4.0 ) ) );
				float bayerBins = 16.0;
				float dither = ( 0.5 + bayerValue ) / bayerBins;
				if ( dither >= fadeIn ) {

					discard;

				}

				if ( dither < fadeOut ) {

					discard;

				}

				#endif

			`);
	}, n;
}
//#endregion
//#region src/three/plugins/fade/FadeMaterialManager.js
var Vr = class {
	constructor() {
		this._fadeParams = /* @__PURE__ */ new WeakMap(), this.fading = 0;
	}
	setFade(e, t, n) {
		if (!e) return;
		let r = this._fadeParams;
		e.traverse((e) => {
			let i = e.material;
			if (i && r.has(i)) {
				let e = r.get(i);
				e.fadeIn.value = t, e.fadeOut.value = n;
				let a = Number(!(t === 0 || t === 1) || !(n === 0 || n === 1));
				i.defines.FEATURE_FADE !== a && (this.fading += a === 1 ? 1 : -1, i.defines.FEATURE_FADE = a, i.needsUpdate = !0);
			}
		});
	}
	prepareScene(e) {
		e.traverse((e) => {
			e.material && this.prepareMaterial(e.material);
		});
	}
	deleteScene(e) {
		if (!e) return;
		this.setFade(e, 1, 0);
		let t = this._fadeParams;
		e.traverse((e) => {
			let n = e.material;
			n && t.delete(n);
		});
	}
	prepareMaterial(e) {
		let t = this._fadeParams;
		t.has(e) || t.set(e, Br(e, e.onBeforeCompile));
	}
}, Hr = class {
	constructor(e, t = new N()) {
		this.other = e, this.material = t, this.visible = !0, this.parent = null, this._instanceInfo = [], this._visibilityChanged = !0;
		let n = new Proxy(this, {
			get(t, r) {
				if (r in t) return t[r];
				{
					let i = e[r];
					return i instanceof Function ? (...e) => (t.syncInstances(), i.call(n, ...e)) : e[r];
				}
			},
			set(t, n, r) {
				return n in t ? t[n] = r : e[n] = r, !0;
			},
			deleteProperty(t, n) {
				return n in t ? delete t[n] : delete e[n];
			}
		});
		return n;
	}
	syncInstances() {
		let e = this._instanceInfo, t = this.other._instanceInfo;
		for (; t.length > e.length;) {
			let n = e.length;
			e.push(new Proxy({ visible: !1 }, {
				get(e, r) {
					return r in e ? e[r] : t[n][r];
				},
				set(e, r, i) {
					return r in e ? e[r] = i : t[n][r] = i, !0;
				}
			}));
		}
	}
}, Ur = class extends Hr {
	constructor(...e) {
		super(...e);
		let t = this.material, n = Br(t, t.onBeforeCompile);
		t.defines.FEATURE_FADE = 1, t.defines.USE_BATCHING_FRAG = 1, t.needsUpdate = !0, this.fadeTexture = null, this._fadeParams = n;
	}
	setFadeAt(e, t, n) {
		this._initFadeTexture(), this.fadeTexture.setValueAt(e, t * 255, n * 255);
	}
	_initFadeTexture() {
		let e = Math.sqrt(this._maxInstanceCount);
		e = Math.ceil(e);
		let t = e * e * 2, n = this.fadeTexture;
		if (!n || n.image.data.length !== t) {
			let r = new Wr(new Uint8Array(t), e, e, _e, Oe);
			if (n) {
				n.dispose();
				let e = n.image.data, t = this.fadeTexture.image.data, r = Math.min(e.length, t.length);
				t.set(new e.constructor(e.buffer, 0, r));
			}
			this.fadeTexture = r, this._fadeParams.fadeTexture.value = r, r.needsUpdate = !0;
		}
	}
	dispose() {
		this.fadeTexture && this.fadeTexture.dispose();
	}
}, Wr = class extends E {
	setValueAt(e, ...t) {
		let { data: n, width: r, height: i } = this.image, a = Math.floor(n.length / (r * i)), o = !1;
		for (let r = 0; r < a; r++) {
			let i = e * a + r, s = n[i], c = t[r] || 0;
			s !== c && (n[i] = c, o = !0);
		}
		o && (this.needsUpdate = !0);
	}
}, Gr = Symbol("HAS_POPPED_IN");
function Kr(e) {
	let t = e;
	for (; t;) {
		if (t.traversal.wasSetActive) return t.traversal.wasInFrustum;
		t = t.parent;
	}
	return !1;
}
var qr = /* @__PURE__ */ new F(), Jr = /* @__PURE__ */ new F(), Yr = /* @__PURE__ */ new he(), Xr = /* @__PURE__ */ new he(), Zr = /* @__PURE__ */ new F();
function Qr() {
	let e = this._fadeManager, t = this._fadeMaterialManager, n = this._fadingBefore, r = this._prevCameraTransforms, { tiles: i, maximumFadeOutTiles: a, batchedMesh: o } = this, { cameras: s } = i;
	e.update();
	let c = e.fadeCount;
	if (n !== 0 && c !== 0 && (i.dispatchEvent({ type: "fade-change" }), i.dispatchEvent({ type: "needs-render" })), a < this._fadingOutCount) {
		let t = !0;
		s.forEach((e) => {
			if (!r.has(e)) return;
			let n = e.matrixWorld, i = r.get(e);
			n.decompose(Jr, Xr, Zr), i.decompose(qr, Yr, Zr);
			let a = Xr.angleTo(Yr), o = Jr.distanceTo(qr);
			t &&= a > .25 || o > .1;
		}), t && e.completeAllFades();
	}
	if (s.forEach((e) => {
		r.get(e).copy(e.matrixWorld);
	}), e.forEachObject((e, { fadeIn: n, fadeOut: r }) => {
		let a = e.engineData.scene;
		i.markTileUsed(e), a && t.setFade(a, n, r), this.forEachBatchIds(e, (e, t, i) => {
			t.setFadeAt(e, n, r), t.setVisibleAt(e, !0), i.batchedMesh.setVisibleAt(e, !1);
		});
	}), o) {
		let e = i.getPluginByName("BATCHED_TILES_PLUGIN").batchedMesh.material;
		o.material.map = e.map;
	}
}
var $r = class {
	get fadeDuration() {
		return this._fadeManager.duration;
	}
	set fadeDuration(e) {
		this._fadeManager.duration = Number(e);
	}
	get fadingTiles() {
		return this._fadeManager.fadeCount;
	}
	constructor(e) {
		e = {
			maximumFadeOutTiles: 50,
			fadeRootTiles: !1,
			fadeDuration: 250,
			...e
		}, this.name = "FADE_TILES_PLUGIN", this.priority = -2, this.tiles = null, this.batchedMesh = null, this._quickFadeTiles = /* @__PURE__ */ new Set(), this._fadeManager = new Rr(), this._fadeMaterialManager = new Vr(), this._prevCameraTransforms = null, this._fadingOutCount = 0, this.maximumFadeOutTiles = e.maximumFadeOutTiles, this.fadeRootTiles = e.fadeRootTiles, this.fadeDuration = e.fadeDuration;
	}
	init(e) {
		this._onLoadModel = ({ scene: e }) => {
			this._fadeMaterialManager.prepareScene(e);
		}, this._onDisposeModel = ({ tile: e, scene: t }) => {
			this.tiles.visibleTiles.has(e) && this._quickFadeTiles.add(e.parent), this._fadeManager.deleteObject(e), this._fadeMaterialManager.deleteScene(t);
		}, this._onAddCamera = ({ camera: e }) => {
			this._prevCameraTransforms.set(e, new M());
		}, this._onDeleteCamera = ({ camera: e }) => {
			this._prevCameraTransforms.delete(e);
		}, this._onTileVisibilityChange = ({ tile: e }) => {
			this.forEachBatchIds(e, (e, t, n) => {
				t.setFadeAt(e, 0, 0), t.setVisibleAt(e, !1), n.batchedMesh.setVisibleAt(e, !1);
			});
		}, this._onUpdateBefore = () => {
			this._fadingBefore = this._fadeManager.fadeCount;
		}, this._onUpdateAfter = () => {
			Qr.call(this);
		}, e.addEventListener("load-model", this._onLoadModel), e.addEventListener("dispose-model", this._onDisposeModel), e.addEventListener("add-camera", this._onAddCamera), e.addEventListener("delete-camera", this._onDeleteCamera), e.addEventListener("update-before", this._onUpdateBefore), e.addEventListener("update-after", this._onUpdateAfter), e.addEventListener("tile-visibility-change", this._onTileVisibilityChange);
		let t = this._fadeManager;
		t.onFadeSetStart = () => {
			e.dispatchEvent({ type: "fade-start" }), e.dispatchEvent({ type: "needs-render" });
		}, t.onFadeSetComplete = () => {
			e.dispatchEvent({ type: "fade-end" }), e.dispatchEvent({ type: "needs-render" });
		}, t.onFadeComplete = (t, n) => {
			this._fadeMaterialManager.setFade(t.engineData.scene, 0, 0), this.forEachBatchIds(t, (e, t, r) => {
				t.setFadeAt(e, 0, 0), t.setVisibleAt(e, !1), r.batchedMesh.setVisibleAt(e, n);
			}), n || (e.invokeOnePlugin((e) => e !== this && e.setTileVisible && e.setTileVisible(t, !1)), this._fadingOutCount--);
		};
		let n = /* @__PURE__ */ new Map();
		e.cameras.forEach((e) => {
			n.set(e, new M());
		}), e.forEachLoadedModel((e, t) => {
			this._onLoadModel({ scene: e });
		}), this.tiles = e, this._fadeManager = t, this._prevCameraTransforms = n;
	}
	initBatchedMesh() {
		let e = this.tiles.getPluginByName("BATCHED_TILES_PLUGIN")?.batchedMesh;
		if (e) {
			if (this.batchedMesh === null) {
				this._onBatchedMeshDispose = () => {
					this.batchedMesh.dispose(), this.batchedMesh.removeFromParent(), this.batchedMesh = null, e.removeEventListener("dispose", this._onBatchedMeshDispose);
				};
				let t = e.material.clone();
				t.onBeforeCompile = e.material.onBeforeCompile, this.batchedMesh = new Ur(e, t), this.tiles.group.add(this.batchedMesh);
			}
		} else this.batchedMesh !== null && (this._onBatchedMeshDispose(), this._onBatchedMeshDispose = null);
	}
	setTileVisible(e, t) {
		let n = this._fadeManager, r = n.isFading(e);
		if (!Kr(e)) return r && n.completeFade(e), !1;
		if (n.isFadingOut(e) && this._fadingOutCount--, t ? e.internal.depthFromRenderedParent === 1 ? ((e[Gr] || this.fadeRootTiles) && this._fadeManager.fadeIn(e), e[Gr] = !0) : this._fadeManager.fadeIn(e) : (this._fadingOutCount++, n.fadeOut(e)), this._quickFadeTiles.has(e) && (this._fadeManager.completeFade(e), this._quickFadeTiles.delete(e)), r) return !0;
		let i = this._fadeManager.isFading(e);
		return !!(!t && i);
	}
	dispose() {
		let e = this.tiles;
		this._fadeManager.completeAllFades(), this.batchedMesh !== null && this._onBatchedMeshDispose(), e.removeEventListener("load-model", this._onLoadModel), e.removeEventListener("dispose-model", this._onDisposeModel), e.removeEventListener("add-camera", this._onAddCamera), e.removeEventListener("delete-camera", this._onDeleteCamera), e.removeEventListener("update-before", this._onUpdateBefore), e.removeEventListener("update-after", this._onUpdateAfter), e.removeEventListener("tile-visibility-change", this._onTileVisibilityChange), e.forEachLoadedModel((e, t) => {
			this._fadeManager.deleteObject(t);
		});
	}
	forEachBatchIds(e, t) {
		if (this.initBatchedMesh(), this.batchedMesh) {
			let n = this.tiles.getPluginByName("BATCHED_TILES_PLUGIN"), r = n.getTileBatchIds(e);
			r && r.forEach((e) => {
				t(e, this.batchedMesh, n);
			});
		}
	}
}, ei = /* @__PURE__ */ new M(), ti = /* @__PURE__ */ new F(), ni = /* @__PURE__ */ new F(), ri = class extends g {
	constructor(...e) {
		super(...e), this.resetDistance = 1e4, this._matricesTextureHandle = null, this._lastCameraPos = new M(), this._forceUpdate = !0, this._matrices = [];
	}
	setMatrixAt(e, t) {
		super.setMatrixAt(e, t), this._forceUpdate = !0;
		let n = this._matrices;
		for (; n.length <= e;) n.push(new M());
		n[e].copy(t);
	}
	setInstanceCount(...e) {
		super.setInstanceCount(...e);
		let t = this._matrices;
		for (; t.length > this.instanceCount;) t.pop();
	}
	onBeforeRender(e, t, n, r, i, a) {
		super.onBeforeRender(e, t, n, r, i, a), ti.setFromMatrixPosition(n.matrixWorld), ni.setFromMatrixPosition(this._lastCameraPos);
		let o = this._matricesTexture, s = this._modelViewMatricesTexture;
		if ((!s || s.image.width !== o.image.width || s.image.height !== o.image.height) && (s && s.dispose(), s = o.clone(), s.source = new Se({
			...s.image,
			data: s.image.data.slice()
		}), this._modelViewMatricesTexture = s), this._forceUpdate || ti.distanceTo(ni) > this.resetDistance) {
			let e = this._matrices, t = s.image.data;
			for (let r = 0; r < this.maxInstanceCount; r++) {
				let i = e[r];
				i ? ei.copy(i) : ei.identity(), ei.premultiply(this.matrixWorld).premultiply(n.matrixWorldInverse).toArray(t, r * 16);
			}
			s.needsUpdate = !0, this._lastCameraPos.copy(n.matrixWorld), this._forceUpdate = !1;
		}
		this._matricesTextureHandle = this._matricesTexture, this._matricesTexture = this._modelViewMatricesTexture, this.matrixWorld.copy(this._lastCameraPos);
	}
	onAfterRender() {
		this.updateMatrixWorld(), this._matricesTexture = this._matricesTextureHandle, this._matricesTextureHandle = null;
	}
	onAfterShadow(e, t, n, r, i, a) {
		this.onAfterRender(e, null, r, i, a);
	}
	dispose() {
		super.dispose(), this._modelViewMatricesTexture && this._modelViewMatricesTexture.dispose();
	}
}, J = /* @__PURE__ */ new le(), ii = [], ai = class extends ri {
	constructor(...e) {
		super(...e), this.expandPercent = .25, this.maxInstanceExpansionSize = Infinity, this._freeGeometryIds = [];
	}
	findFreeId(e, t, n) {
		let r = !!this.geometry.index, i = Math.max(r ? e.index.count : -1, n), a = Math.max(e.attributes.position.count, t), o = -1, s = Infinity, c = this._freeGeometryIds;
		if (c.forEach((e, t) => {
			let { reservedIndexCount: n, reservedVertexCount: r } = this.getGeometryRangeAt(e);
			if (n >= i && r >= a) {
				let e = i - n + (a - r);
				e < s && (o = t, s = e);
			}
		}), o !== -1) {
			let e = c[o];
			return c.splice(o, 1), e;
		} else return -1;
	}
	addGeometry(e, t, n) {
		let r = !!this.geometry.index;
		n = Math.max(r ? e.index.count : -1, n), t = Math.max(e.attributes.position.count, t);
		let { expandPercent: i, _freeGeometryIds: a } = this, o = this.findFreeId(e, t, n);
		if (o !== -1) this.setGeometryAt(o, e);
		else {
			let r = () => {
				let e = this.unusedVertexCount < t, r = this.unusedIndexCount < n;
				return e || r;
			}, s = e.index, c = e.attributes.position;
			if (t = Math.max(t, c.count), n = Math.max(n, s ? s.count : 0), r() && (a.forEach((e) => this.deleteGeometry(e)), a.length = 0, this.optimize(), r())) {
				let e = this.geometry.index, r = this.geometry.attributes.position, a, o;
				if (e) {
					let t = Math.ceil(i * e.count);
					a = Math.max(t, n, s.count) + e.count;
				} else a = Math.max(this.unusedIndexCount, n);
				if (r) {
					let e = Math.ceil(i * r.count);
					o = Math.max(e, t, c.count) + r.count;
				} else o = Math.max(this.unusedVertexCount, t);
				this.setGeometrySize(o, a);
			}
			o = super.addGeometry(e, t, n);
		}
		return o;
	}
	addInstance(e) {
		if (this.maxInstanceCount === this.instanceCount) {
			let e = Math.ceil(this.maxInstanceCount * (1 + this.expandPercent));
			this.setInstanceCount(Math.min(e, this.maxInstanceExpansionSize));
		}
		return super.addInstance(e);
	}
	deleteInstance(e) {
		let t = this.getGeometryIdAt(e);
		return t !== -1 && this._freeGeometryIds.push(t), super.deleteInstance(e);
	}
	raycastInstance(e, t, n) {
		let r = this.geometry, i = this.getGeometryIdAt(e);
		J.material = this.material, J.geometry.index = r.index, J.geometry.attributes = r.attributes;
		let a = this.getGeometryRangeAt(i);
		J.geometry.setDrawRange(a.start, a.count), J.geometry.boundingBox === null && (J.geometry.boundingBox = new v()), J.geometry.boundingSphere === null && (J.geometry.boundingSphere = new Ce()), this.getMatrixAt(e, J.matrixWorld).premultiply(this.matrixWorld), this.getBoundingBoxAt(i, J.geometry.boundingBox), this.getBoundingSphereAt(i, J.geometry.boundingSphere), J.raycast(t, ii);
		for (let t = 0, r = ii.length; t < r; t++) {
			let r = ii[t];
			r.object = this, r.batchId = e, n.push(r);
		}
		ii.length = 0;
	}
};
//#endregion
//#region src/three/plugins/batched/utilities.js
function oi(e) {
	return e.r === 1 && e.g === 1 && e.b === 1;
}
function si(e) {
	e.needsUpdate = !0, e.onBeforeCompile = (e) => {
		e.vertexShader = e.vertexShader.replace("#include <common>", "\n				#include <common>\n				varying float texture_index;\n				").replace("#include <uv_vertex>", "\n				#include <uv_vertex>\n				texture_index = getIndirectIndex( gl_DrawID );\n				"), e.fragmentShader = e.fragmentShader.replace("#include <map_pars_fragment>", "\n				#ifdef USE_MAP\n				precision highp sampler2DArray;\n				uniform sampler2DArray map;\n				varying float texture_index;\n				#endif\n				").replace("#include <map_fragment>", "\n				#ifdef USE_MAP\n					diffuseColor *= texture( map, vec3( vMapUv, texture_index ) );\n				#endif\n				");
	};
}
//#endregion
//#region src/three/plugins/batched/BatchedTilesPlugin.js
var ci = new Pe(new N()), li = new E(new Uint8Array([
	255,
	255,
	255,
	255
]), 1, 1);
li.needsUpdate = !0;
var ui = class {
	constructor(e = {}) {
		if (parseInt(ge) < 170) throw Error("BatchedTilesPlugin: Three.js revision 170 or higher required.");
		e = {
			instanceCount: 500,
			vertexCount: 750,
			indexCount: 2e3,
			expandPercent: .25,
			maxInstanceCount: Infinity,
			discardOriginalContent: !0,
			textureSize: null,
			material: null,
			renderer: null,
			...e
		}, this.name = "BATCHED_TILES_PLUGIN", this.priority = -1;
		let t = e.renderer.getContext();
		this.instanceCount = e.instanceCount, this.vertexCount = e.vertexCount, this.indexCount = e.indexCount, this.material = e.material ? e.material.clone() : null, this.expandPercent = e.expandPercent, this.maxInstanceCount = Math.min(e.maxInstanceCount, t.getParameter(t.MAX_3D_TEXTURE_SIZE)), this.renderer = e.renderer, this.discardOriginalContent = e.discardOriginalContent, this.textureSize = e.textureSize, this.batchedMesh = null, this.arrayTarget = null, this.tiles = null, this._tileToInstanceId = /* @__PURE__ */ new Map();
	}
	init(e) {
		this.tiles = e;
	}
	initTextureArray(e) {
		if (this.arrayTarget !== null || e.material.map === null) return;
		let { instanceCount: t, renderer: n, textureSize: r, batchedMesh: i } = this, a = e.material.map, o = {
			colorSpace: a.colorSpace,
			wrapS: a.wrapS,
			wrapT: a.wrapT,
			wrapR: a.wrapS,
			magFilter: a.magFilter
		}, s = new ke(r || a.image.width, r || a.image.height, t);
		Object.assign(s.texture, o), n.initRenderTarget(s), i.material.map = s.texture, this.arrayTarget = s, this._tileToInstanceId.forEach((e) => {
			e.forEach((e) => {
				this.assignTextureToLayer(li, e);
			});
		});
	}
	initBatchedMesh(e) {
		if (this.batchedMesh !== null) return;
		let { instanceCount: t, vertexCount: n, indexCount: r, tiles: i } = this, a = this.material ? this.material : new e.material.constructor(), o = new ai(t, t * n, t * r, a);
		o.name = "BatchTilesPlugin", o.frustumCulled = !1, i.group.add(o), o.updateMatrixWorld(), si(o.material), this.batchedMesh = o;
	}
	setTileVisible(e, t) {
		let n = e.engineData.scene;
		if (t && this.addSceneToBatchedMesh(n, e), this._tileToInstanceId.has(e)) {
			this._tileToInstanceId.get(e).forEach((e) => {
				this.batchedMesh.setVisibleAt(e, t);
			});
			let r = this.tiles;
			return t ? r.visibleTiles.add(e) : r.visibleTiles.delete(e), r.dispatchEvent({
				type: "tile-visibility-change",
				scene: n,
				tile: e,
				visible: t
			}), !0;
		}
		return !1;
	}
	disposeTile(e) {
		this.removeSceneFromBatchedMesh(e);
	}
	unloadTileFromGPU(e, t) {
		return !this.discardOriginalContent && this._tileToInstanceId.has(t) ? (this.removeSceneFromBatchedMesh(t), !0) : !1;
	}
	assignTextureToLayer(e, t) {
		if (!this.arrayTarget) return;
		this.expandArrayTargetIfNeeded();
		let { renderer: n } = this, r = n.getRenderTarget();
		n.setRenderTarget(this.arrayTarget, t), ci.material.map = e, ci.render(n), n.setRenderTarget(r), ci.material.map = null, e.dispose();
	}
	expandArrayTargetIfNeeded() {
		let { batchedMesh: e, arrayTarget: t, renderer: n } = this, r = Math.min(e.maxInstanceCount, this.maxInstanceCount);
		if (r > t.depth) {
			let i = {
				colorSpace: t.texture.colorSpace,
				wrapS: t.texture.wrapS,
				wrapT: t.texture.wrapT,
				generateMipmaps: t.texture.generateMipmaps,
				minFilter: t.texture.minFilter,
				magFilter: t.texture.magFilter
			}, a = new ke(t.width, t.height, r);
			Object.assign(a.texture, i), n.initRenderTarget(a), n.copyTextureToTexture(t.texture, a.texture), t.dispose(), e.material.map = a.texture, this.arrayTarget = a;
		}
	}
	removeSceneFromBatchedMesh(e) {
		if (this._tileToInstanceId.has(e)) {
			let t = this._tileToInstanceId.get(e);
			this._tileToInstanceId.delete(e), t.forEach((e) => {
				this.batchedMesh.deleteInstance(e);
			});
		}
	}
	addSceneToBatchedMesh(e, t) {
		if (this._tileToInstanceId.has(t)) return;
		let n = [];
		e.traverse((e) => {
			e.isMesh && n.push(e);
		});
		let r = !0;
		n.forEach((e) => {
			if (this.batchedMesh && r) {
				let t = e.geometry.attributes, n = this.batchedMesh.geometry.attributes;
				for (let e in n) if (!(e in t)) {
					r = !1;
					return;
				}
			}
		});
		let i = !this.batchedMesh || this.batchedMesh.instanceCount + n.length <= this.maxInstanceCount;
		if (r && i) {
			e.updateMatrixWorld();
			let r = [];
			this._tileToInstanceId.set(t, r), n.forEach((e) => {
				this.initBatchedMesh(e), this.initTextureArray(e);
				let { geometry: t, material: n } = e, { batchedMesh: i, expandPercent: a } = this;
				i.expandPercent = a;
				let o = i.addGeometry(t, this.vertexCount, this.indexCount), s = i.addInstance(o);
				r.push(s), i.setMatrixAt(s, e.matrixWorld), i.setVisibleAt(s, !1), oi(n.color) || (n.color.setHSL(Math.random(), .5, .5), i.setColorAt(s, n.color));
				let c = n.map;
				c ? this.assignTextureToLayer(c, s) : this.assignTextureToLayer(li, s);
			}), this.discardOriginalContent && (t.engineData.textures.forEach((e) => {
				e.image instanceof ImageBitmap && e.image.close();
			}), t.engineData.scene = null, t.engineData.materials = [], t.engineData.geometries = [], t.engineData.textures = []);
		}
	}
	raycastTile(e, t, n, r) {
		return this._tileToInstanceId.has(e) ? (this._tileToInstanceId.get(e).forEach((e) => {
			this.batchedMesh.raycastInstance(e, n, r);
		}), !0) : !1;
	}
	dispose() {
		let { arrayTarget: e, batchedMesh: t } = this;
		e && e.dispose(), t && (t.material.dispose(), t.geometry.dispose(), t.dispose(), t.removeFromParent());
	}
	getTileBatchIds(e) {
		return this._tileToInstanceId.get(e);
	}
}, di = /* @__PURE__ */ new Ce(), fi = /* @__PURE__ */ new F(), pi = /* @__PURE__ */ new M(), mi = /* @__PURE__ */ new M(), hi = /* @__PURE__ */ new ye(), gi = /* @__PURE__ */ new N({ side: O }), _i = /* @__PURE__ */ new v(), vi = 1e5;
function yi(e, t) {
	return e.isBufferGeometry ? (e.boundingSphere === null && e.computeBoundingSphere(), t.copy(e.boundingSphere)) : (_i.setFromObject(e), _i.getBoundingSphere(t), t);
}
var bi = class {
	constructor() {
		this.name = "TILE_FLATTENING_PLUGIN", this.priority = -100, this.tiles = null, this.shapes = /* @__PURE__ */ new Map(), this.positionsMap = /* @__PURE__ */ new Map(), this.positionsUpdated = /* @__PURE__ */ new Set(), this.needsUpdate = !1;
	}
	init(e) {
		this.tiles = e, this.needsUpdate = !0, this._updateBeforeCallback = () => {
			this.needsUpdate &&= (this._updateTiles(), !1);
		}, this._disposeModelCallback = ({ tile: e }) => {
			this.positionsMap.delete(e), this.positionsUpdated.delete(e);
		}, e.addEventListener("update-before", this._updateBeforeCallback), e.addEventListener("dispose-model", this._disposeModelCallback);
	}
	setTileActive(e, t) {
		t && !this.positionsUpdated.has(e) && this._updateTile(e);
	}
	_updateTile(e) {
		let { positionsUpdated: t, positionsMap: n, shapes: r, tiles: i } = this;
		t.add(e);
		let a = e.engineData.scene;
		if (n.has(e)) {
			let t = n.get(e);
			a.traverse((e) => {
				if (e.geometry) {
					let n = t.get(e.geometry);
					n && (e.geometry.attributes.position.array.set(n), e.geometry.attributes.position.needsUpdate = !0);
				}
			});
		} else {
			let t = /* @__PURE__ */ new Map();
			n.set(e, t), a.traverse((e) => {
				e.geometry && t.set(e.geometry, e.geometry.attributes.position.array.slice());
			});
		}
		a.updateMatrixWorld(!0), a.traverse((e) => {
			let { geometry: t } = e;
			t && (pi.copy(e.matrixWorld), a.parent !== null && pi.premultiply(i.group.matrixWorldInverse), mi.copy(pi).invert(), yi(t, di).applyMatrix4(pi), r.forEach(({ shape: e, direction: n, sphere: r, thresholdMode: i, threshold: a, flattenRange: o }) => {
				fi.subVectors(di.center, r.center), fi.addScaledVector(n, -n.dot(fi));
				let s = (di.radius + r.radius) ** 2;
				if (fi.lengthSq() > s) return;
				let { position: c } = t.attributes, { ray: l } = hi;
				l.direction.copy(n).multiplyScalar(-1);
				for (let t = 0, r = c.count; t < r; t++) {
					l.origin.fromBufferAttribute(c, t).applyMatrix4(pi).addScaledVector(n, vi), hi.far = vi;
					let r = hi.intersectObject(e)[0];
					if (r) {
						let e = (vi - r.distance) / a, n = e >= 1;
						(!n || n && i === "flatten") && (e = Math.min(e, 1), r.point.addScaledVector(l.direction, j.mapLinear(e, 0, 1, -o, 0)), r.point.applyMatrix4(mi), c.setXYZ(t, ...r.point));
					}
				}
			}));
		}), this.tiles.dispatchEvent({ type: "needs-render" });
	}
	_updateTiles() {
		this.positionsUpdated.clear(), this.tiles.activeTiles.forEach((e) => this._updateTile(e));
	}
	hasShape(e) {
		return this.shapes.has(e);
	}
	addShape(e, t = new F(0, 0, -1), n = {}) {
		if (this.hasShape(e)) throw Error("TileFlatteningPlugin: Shape is already used.");
		typeof n == "number" && (console.warn("TileFlatteningPlugin: \"addShape\" function signature has changed. Please use an options object, instead."), n = { threshold: n }), this.needsUpdate = !0;
		let r = e.clone();
		r.updateMatrixWorld(!0), r.traverse((e) => {
			e.material &&= gi;
		});
		let i = yi(r, new Ce());
		this.shapes.set(e, {
			shape: r,
			direction: t.clone(),
			sphere: i,
			thresholdMode: "none",
			threshold: Infinity,
			flattenRange: 0,
			...n
		});
	}
	updateShape(e) {
		if (!this.hasShape(e)) throw Error("TileFlatteningPlugin: Shape is not present.");
		let { direction: t, threshold: n, thresholdMode: r, flattenRange: i } = this.shapes.get(e);
		this.deleteShape(e), this.addShape(e, t, {
			threshold: n,
			thresholdMode: r,
			flattenRange: i
		});
	}
	deleteShape(e) {
		return this.needsUpdate = !0, this.shapes.delete(e);
	}
	clearShapes() {
		this.shapes.size !== 0 && (this.needsUpdate = !0, this.shapes.clear());
	}
	dispose() {
		this.tiles.removeEventListener("before-update", this._updateBeforeCallback), this.tiles.removeEventListener("dispose-model", this._disposeModelCallback), this.positionsMap.forEach((e) => {
			e.forEach((e, t) => {
				let { position: n } = t.attributes;
				n.array.set(e), n.needsUpdate = !0;
			});
		});
	}
}, xi = class {
	constructor(e = {}) {
		let { regions: t = [] } = e;
		this.name = "LOAD_REGION_PLUGIN", this.regions = [], this.tiles = null, t.forEach((e) => this.addRegion(e));
	}
	init(e) {
		this.tiles = e;
	}
	addRegion(e) {
		this.regions.indexOf(e) === -1 && this.regions.push(e);
	}
	removeRegion(e) {
		let t = this.regions.indexOf(e);
		t !== -1 && this.regions.splice(t, 1);
	}
	hasRegion(e) {
		return this.regions.indexOf(e) !== -1;
	}
	clearRegions() {
		this.regions = [];
	}
	calculateTileViewError(e, t) {
		let n = e.engineData.boundingVolume, { regions: r, tiles: i } = this, a = !1, o = null, s = 0, c = Infinity;
		for (let t of r) {
			let r = t.intersectsTile(n, e, i);
			a ||= r, r && (s = Math.max(t.calculateError(e, i), s), c = Math.min(t.calculateDistance(n, e, i), c)), t.mask && (o ||= r);
		}
		return t.inView = a && o !== !1, t.error = s, t.distance = c, t.inView || o !== null;
	}
	dispose() {
		this.regions = [];
	}
}, Si = class {
	constructor(e = {}) {
		let { errorTarget: t = 10, mask: n = !1 } = e;
		this.errorTarget = t, this.mask = n;
	}
	intersectsTile(e, t, n) {
		return !1;
	}
	calculateDistance(e, t, n) {
		return Infinity;
	}
	calculateError(e, t) {
		return e.geometricError - this.errorTarget + t.errorTarget;
	}
}, Ci = class extends Si {
	constructor(e = {}) {
		let { sphere: t = new Ce() } = e;
		super(e), this.sphere = t.clone();
	}
	intersectsTile(e) {
		return e.intersectsSphere(this.sphere);
	}
}, wi = class extends Si {
	constructor(e = {}) {
		let { ray: t = new ve() } = e;
		super(e), this.ray = t.clone();
	}
	intersectsTile(e) {
		return e.intersectsRay(this.ray);
	}
}, Ti = class extends Si {
	constructor(e = {}) {
		let { obb: t = new s() } = e;
		super(e), this.obb = t.clone(), this.obb.update();
	}
	intersectsTile(e) {
		return e.intersectsOBB(this.obb);
	}
}, Y = /* @__PURE__ */ new F(), Ei = [
	"x",
	"y",
	"z"
], Di = class extends ie {
	constructor(e, t = 16776960, n = 40) {
		let r = new S(), i = [];
		for (let e = 0; e < 3; e++) {
			let t = Ei[e], r = Ei[(e + 1) % 3];
			Y.set(0, 0, 0);
			for (let e = 0; e < n; e++) {
				let a;
				a = 2 * Math.PI * e / (n - 1), Y[t] = Math.sin(a), Y[r] = Math.cos(a), i.push(Y.x, Y.y, Y.z), a = 2 * Math.PI * (e + 1) / (n - 1), Y[t] = Math.sin(a), Y[r] = Math.cos(a), i.push(Y.x, Y.y, Y.z);
			}
		}
		r.setAttribute("position", new x(new Float32Array(i), 3)), r.computeBoundingSphere(), super(r, new re({
			color: t,
			toneMapped: !1
		})), this.sphere = e, this.type = "SphereHelper";
	}
	updateMatrixWorld(e) {
		let t = this.sphere;
		this.position.copy(t.center), this.scale.setScalar(t.radius), super.updateMatrixWorld(e);
	}
}, Oi = /* @__PURE__ */ new F(), X = /* @__PURE__ */ new F(), ki = /* @__PURE__ */ new F(), Z = /* @__PURE__ */ new F(), Ai = /* @__PURE__ */ new F(), ji = /* @__PURE__ */ new F(0, 0, 1);
function Mi(e) {
	e = e.toNonIndexed();
	let { groups: t } = e, { position: n, normal: r } = e.attributes, i = [], a = [];
	for (let e of t) {
		let { start: t, count: o } = e;
		for (let e = t, s = t + o; e < s; e++) Z.fromBufferAttribute(n, e), Ai.fromBufferAttribute(r, e), a.push(...Z), i.push(...Ai);
	}
	let o = new S();
	return o.setAttribute("position", new x(new Float32Array(a), 3)), o.setAttribute("normal", new x(new Float32Array(i), 3)), o;
}
function Ni(e, t = 32) {
	let { latStart: n = -Math.PI / 2, latEnd: r = Math.PI / 2, lonStart: i = 0, lonEnd: a = 2 * Math.PI, heightStart: o = 0, heightEnd: s = 0 } = e, c = new b(1, 1, 1, t, t), { normal: l, position: u } = c.attributes;
	for (let t = 0, c = u.count; t < c; t++) {
		ki.fromBufferAttribute(u, t);
		let c = j.mapLinear(ki.x, -.5, .5, n, r), d = j.mapLinear(ki.y, -.5, .5, i, a), f = ki.z < 0;
		Oi.fromBufferAttribute(l, t), e.getCartographicToPosition(c, d, f ? s : o, ki), u.setXYZ(t, ki.x, ki.y, ki.z), e.getCartographicToNormal(c, d, X), Oi.z === 0 ? (Z.crossVectors(ji, X), Z.lengthSq() < 1e-12 && Z.set(1, 0, 0), Z.normalize(), Oi.x === 0 ? X.copy(Z).multiplyScalar(Math.sign(Oi.y)) : X.crossVectors(X, Z).normalize().multiplyScalar(Math.sign(Oi.x))) : X.multiplyScalar(f ? 1 : -1), l.setXYZ(t, X.x, X.y, X.z);
	}
	return c;
}
function Pi(e, t = 32) {
	let { latStart: n = -Math.PI / 2, latEnd: r = Math.PI / 2, lonStart: i = 0, lonEnd: a = 2 * Math.PI, heightStart: o = 0, heightEnd: s = 0 } = e, c = [], l = (n, r, i, a, o, s) => {
		for (let l = 0; l < t; l++) {
			let u = l / t, d = (l + 1) / t;
			e.getCartographicToPosition(j.lerp(n, a, u), j.lerp(r, o, u), j.lerp(i, s, u), Z), e.getCartographicToPosition(j.lerp(n, a, d), j.lerp(r, o, d), j.lerp(i, s, d), Ai), c.push(Z.x, Z.y, Z.z, Ai.x, Ai.y, Ai.z);
		}
	};
	for (let e of [o, s]) l(n, i, e, n, a, e), l(r, i, e, r, a, e), l(n, i, e, r, i, e), l(n, a, e, r, a, e);
	for (let e of [n, r]) for (let t of [i, a]) l(e, t, o, e, t, s);
	let u = new S();
	return u.setAttribute("position", new x(new Float32Array(c), 3)), u;
}
var Fi = class extends ie {
	constructor(e = new d(), t = 16776960) {
		super(), this.ellipsoidRegion = e, this.material.color.set(t), this.update();
	}
	update() {
		this.geometry.dispose(), this.geometry = Pi(this.ellipsoidRegion);
	}
	dispose() {
		this.geometry.dispose(), this.material.dispose();
	}
}, Ii = class extends le {
	constructor(e = new d(), t = 16776960) {
		super(), this.ellipsoidRegion = e, this.material.color.set(t), this.update();
	}
	update() {
		this.geometry.dispose();
		let e = Ni(this.ellipsoidRegion), { lonStart: t, lonEnd: n } = this;
		n - t >= 2 * Math.PI ? (e.groups.splice(2, 2), this.geometry = Mi(e)) : this.geometry = e;
	}
	dispose() {
		this.geometry.dispose(), this.material.dispose();
	}
}, Li = Symbol("ORIGINAL_MATERIAL"), Ri = Symbol("HAS_RANDOM_COLOR"), zi = Symbol("HAS_RANDOM_NODE_COLOR"), Bi = Symbol("LOAD_TIME"), Vi = Symbol("PARENT_BOUND_REF_COUNT"), Hi = /* @__PURE__ */ new Ce(), Ui = () => {}, Wi = {};
function Gi(e) {
	if (!Wi[e]) {
		let t = Math.random(), n = .5 + Math.random() * .5, r = .375 + Math.random() * .25;
		Wi[e] = new w().setHSL(t, n, r);
	}
	return Wi[e];
}
var Ki = 0, qi = 1, Ji = 2, Yi = 3, Xi = 4, Zi = 5, Qi = 6, $i = 7, ea = 8, ta = 9, na = 10, ra = 11, ia = Object.freeze({
	NONE: Ki,
	SCREEN_ERROR: qi,
	GEOMETRIC_ERROR: Ji,
	DISTANCE: Yi,
	DEPTH: Xi,
	RELATIVE_DEPTH: Zi,
	IS_LEAF: Qi,
	RANDOM_COLOR: $i,
	RANDOM_NODE_COLOR: ea,
	CUSTOM_COLOR: ta,
	LOAD_ORDER: na,
	INDEXED_COLOR: ra
}), aa = class {
	static get ColorModes() {
		return ia;
	}
	get wireframe() {
		return this._wireframe;
	}
	set wireframe(e) {
		e !== this._wireframe && (this._wireframe = e, this.materialsNeedUpdate = !0);
	}
	get unlit() {
		return this._unlit;
	}
	set unlit(e) {
		e !== this._unlit && (this._unlit = e, this.materialsNeedUpdate = !0);
	}
	get colorMode() {
		return this._colorMode;
	}
	set colorMode(e) {
		e !== this._colorMode && (this._colorMode = e, this.materialsNeedUpdate = !0);
	}
	get boundsColorMode() {
		return this._boundsColorMode;
	}
	set boundsColorMode(e) {
		e !== this._boundsColorMode && (this._boundsColorMode = e, this.materialsNeedUpdate = !0);
	}
	get enabled() {
		return this._enabled;
	}
	set enabled(e) {
		e !== this._enabled && this.tiles !== null && (this._enabled = e, e ? this.init(this.tiles) : this.dispose());
	}
	get displayParentBounds() {
		return this._displayParentBounds;
	}
	set displayParentBounds(e) {
		this._displayParentBounds !== e && (this._displayParentBounds = e, e ? this.tiles.traverse((e) => {
			e.traversal.visible && this._onTileVisibilityChange(e, !0);
		}) : this.tiles.traverse((e) => {
			e[Vi] = null, this._onTileVisibilityChange(e, e.traversal.visible);
		}));
	}
	constructor(e) {
		e = {
			displayParentBounds: !1,
			displayBoxBounds: !1,
			displaySphereBounds: !1,
			displayRegionBounds: !1,
			colorMode: Ki,
			boundsColorMode: Ki,
			maxDebugDepth: -1,
			maxDebugDistance: -1,
			maxDebugError: -1,
			customColorCallback: null,
			unlit: !1,
			wireframe: !1,
			enabled: !0,
			...e
		}, this.name = "DEBUG_TILES_PLUGIN", this.tiles = null, this._colorMode = null, this._boundsColorMode = null, this._unlit = null, this._wireframe = null, this.materialsNeedUpdate = !1, this.extremeDebugDepth = -1, this.extremeDebugError = -1, this.boxGroup = null, this.sphereGroup = null, this.regionGroup = null, this._enabled = e.enabled, this._displayParentBounds = e.displayParentBounds, this.displayBoxBounds = e.displayBoxBounds, this.displaySphereBounds = e.displaySphereBounds, this.displayRegionBounds = e.displayRegionBounds, this.colorMode = e.colorMode, this.boundsColorMode = e.boundsColorMode, this.maxDebugDepth = e.maxDebugDepth, this.maxDebugDistance = e.maxDebugDistance, this.maxDebugError = e.maxDebugError, this.customColorCallback = e.customColorCallback, this.unlit = e.unlit, this.wireframe = e.wireframe, this.getDebugColor = (e, t) => {
			t.setRGB(e, e, e);
		};
	}
	init(e) {
		if (this.tiles = e, !this.enabled) return;
		let t = e.group;
		this.boxGroup = new A(), this.boxGroup.name = "DebugTilesRenderer.boxGroup", t.add(this.boxGroup), this.boxGroup.updateMatrixWorld(), this.sphereGroup = new A(), this.sphereGroup.name = "DebugTilesRenderer.sphereGroup", t.add(this.sphereGroup), this.sphereGroup.updateMatrixWorld(), this.regionGroup = new A(), this.regionGroup.name = "DebugTilesRenderer.regionGroup", t.add(this.regionGroup), this.regionGroup.updateMatrixWorld(), this._onLoadTilesetCB = () => {
			this._initExtremes();
		}, this._onLoadModelCB = ({ scene: e, tile: t }) => {
			this._onLoadModel(e, t);
		}, this._onDisposeModelCB = ({ tile: e }) => {
			this._onDisposeModel(e);
		}, this._onUpdateAfterCB = () => {
			this.update();
		}, this._onTileVisibilityChangeCB = ({ scene: e, tile: t, visible: n }) => {
			this._onTileVisibilityChange(t, n);
		}, e.addEventListener("load-tileset", this._onLoadTilesetCB), e.addEventListener("load-model", this._onLoadModelCB), e.addEventListener("dispose-model", this._onDisposeModelCB), e.addEventListener("update-after", this._onUpdateAfterCB), e.addEventListener("tile-visibility-change", this._onTileVisibilityChangeCB), this._initExtremes(), e.traverse((e) => {
			e.engineData.scene && this._onLoadModel(e.engineData.scene, e);
		}), e.visibleTiles.forEach((e) => {
			this._onTileVisibilityChange(e, !0);
		});
	}
	getTileFromObject3D(e) {
		let t = null;
		return this.tiles.activeTiles.forEach((n) => {
			if (t) return;
			let r = n.engineData.scene;
			r && r.traverse((r) => {
				r === e && (t = n);
			});
		}), t;
	}
	setEmptyTileVisible(e, t) {
		this._onTileVisibilityChange(e, t);
	}
	_initExtremes() {
		if (!(this.tiles && this.tiles.root)) return;
		let e = -1, t = -1;
		this.tiles.traverse(null, (n, r, i) => {
			e = Math.max(e, i), t = Math.max(t, n.geometricError);
		}, !1), this.extremeDebugDepth = e, this.extremeDebugError = t;
	}
	update() {
		let { tiles: e, colorMode: t, boundsColorMode: n } = this;
		if (!e.root) return;
		this.materialsNeedUpdate &&= (e.forEachLoadedModel((e) => {
			this._updateMaterial(e);
		}), !1), this.boxGroup.visible = this.displayBoxBounds, this.sphereGroup.visible = this.displaySphereBounds, this.regionGroup.visible = this.displayRegionBounds;
		let r = -1;
		r = this.maxDebugDepth === -1 ? this.extremeDebugDepth : this.maxDebugDepth;
		let i = -1;
		i = this.maxDebugError === -1 ? this.extremeDebugError : this.maxDebugError;
		let a = -1;
		this.maxDebugDistance === -1 ? (e.getBoundingSphere(Hi), a = Hi.radius) : a = this.maxDebugDistance;
		let { errorTarget: o, visibleTiles: s } = e, c;
		(t === na || n === na) && (c = Array.from(s).sort((e, t) => e[Bi] - t[Bi]));
		let l = (e, t, n, s, l, u) => {
			switch (e !== $i && delete n.material[Ri], e !== ea && delete n.material[zi], e) {
				case Xi: {
					let e = t.internal.depth / r;
					this.getDebugColor(e, n.material.color);
					break;
				}
				case Zi: {
					let e = t.internal.depthFromRenderedParent / r;
					this.getDebugColor(e, n.material.color);
					break;
				}
				case qi: {
					let e = t.traversal.error / o;
					e > 1 ? n.material.color.setRGB(1, 0, 0) : this.getDebugColor(e, n.material.color);
					break;
				}
				case Ji: {
					let e = Math.min(t.geometricError / i, 1);
					this.getDebugColor(e, n.material.color);
					break;
				}
				case Yi: {
					let e = Math.min(t.traversal.distanceFromCamera / a, 1);
					this.getDebugColor(e, n.material.color);
					break;
				}
				case Qi:
					!t.children || t.children.length === 0 ? this.getDebugColor(1, n.material.color) : this.getDebugColor(0, n.material.color);
					break;
				case ea:
					n.material[zi] || (n.material.color.setHSL(s, l, u), n.material[zi] = !0);
					break;
				case $i:
					n.material[Ri] || (n.material.color.setHSL(s, l, u), n.material[Ri] = !0);
					break;
				case ta:
					this.customColorCallback ? this.customColorCallback(t, n) : console.warn("DebugTilesRenderer: customColorCallback not defined");
					break;
				case na: {
					let e = c.indexOf(t);
					this.getDebugColor(e / (c.length - 1), n.material.color);
					break;
				}
				case ra:
					n.material.color.copy(Gi(t.internal.depth)), delete n.material[Ri], delete n.material[zi];
					break;
			}
		};
		s.forEach((e) => {
			let n = e.engineData.scene, r, i, a;
			t === $i && (r = Math.random(), i = .5 + Math.random() * .5, a = .375 + Math.random() * .25), n.traverse((n) => {
				t === ea && (r = Math.random(), i = .5 + Math.random() * .5, a = .375 + Math.random() * .25), n.material && l(t, e, n, r, i, a);
			});
		});
		let u = n === Ki ? ra : n, d = [
			this.boxGroup,
			this.sphereGroup,
			this.regionGroup
		];
		for (let e of d) for (let t of e.children) {
			let e = t.userData.tile, n, r, i;
			u === $i && (n = Math.random(), r = .5 + Math.random() * .5, i = .375 + Math.random() * .25), t.traverse((t) => {
				u === ea && (n = Math.random(), r = .5 + Math.random() * .5, i = .375 + Math.random() * .25), t.material && l(u, e, t, n, r, i);
			});
		}
	}
	_onTileVisibilityChange(e, t) {
		this.displayParentBounds ? n(e, (n) => {
			n[Vi] ?? (n[Vi] = 0), t ? n[Vi]++ : n[Vi] > 0 && n[Vi]--;
			let r = n === e && t || this.displayParentBounds && n[Vi] > 0;
			this._updateBoundHelper(n, r);
		}) : this._updateBoundHelper(e, t);
	}
	_createBoundHelper(e) {
		let t = this.tiles, n = e.engineData, { sphere: r, obb: i, region: a } = n.boundingVolume;
		if (i) {
			let r = new A();
			r.name = "DebugTilesRenderer.boxHelperGroup", r.matrix.copy(i.transform), r.matrixAutoUpdate = !1, r.userData.tile = e, n.boxHelperGroup = r;
			let a = new y(i.box, Gi(e.internal.depth));
			a.raycast = Ui, r.add(a);
			let o = new le(new b(), new N({
				color: Gi(e.internal.depth),
				transparent: !0,
				depthWrite: !1,
				opacity: .05,
				side: O
			}));
			i.box.getSize(o.scale), o.raycast = Ui, r.add(o), t.visibleTiles.has(e) && this.displayBoxBounds && (this.boxGroup.add(r), r.updateMatrixWorld(!0));
		}
		if (r) {
			let i = new Di(r, Gi(e.internal.depth));
			i.raycast = Ui, i.userData.tile = e;
			let a = new le(new we(1), new N({
				color: Gi(e.internal.depth),
				transparent: !0,
				depthWrite: !1,
				opacity: .05,
				side: O
			}));
			a.raycast = Ui, i.add(a), n.sphereHelper = i, t.visibleTiles.has(e) && this.displaySphereBounds && (this.sphereGroup.add(i), i.updateMatrixWorld(!0));
		}
		if (a) {
			let r = new Fi(a, Gi(e.internal.depth));
			r.raycast = Ui, r.userData.tile = e;
			let i = new Ii(a, Gi(e.internal.depth));
			i.material.transparent = !0, i.material.depthWrite = !1, i.material.opacity = .05, i.material.side = O, i.raycast = Ui, r.add(i);
			let o = new Ce();
			a.getBoundingSphere(o), r.position.copy(o.center), o.center.multiplyScalar(-1), r.geometry.translate(...o.center), i.geometry.translate(...o.center), n.regionHelper = r, t.visibleTiles.has(e) && this.displayRegionBounds && (this.regionGroup.add(r), r.updateMatrixWorld(!0));
		}
	}
	_updateHelperMaterials(e, t) {
		t.traverse((t) => {
			let { material: n } = t;
			if (!n) return;
			e.traversal.visible || !this.displayParentBounds ? n.opacity = t.isMesh ? .05 : 1 : n.opacity = t.isMesh ? .01 : .2;
			let r = n.transparent;
			n.transparent = n.opacity < 1, n.transparent !== r && (n.needsUpdate = !0);
		});
	}
	_updateBoundHelper(e, t) {
		let n = e.engineData;
		if (!n) return;
		let r = this.sphereGroup, i = this.boxGroup, a = this.regionGroup;
		t && n.boxHelperGroup == null && n.sphereHelper == null && n.regionHelper == null && this._createBoundHelper(e);
		let o = n.boxHelperGroup, s = n.sphereHelper, c = n.regionHelper;
		t ? (o && (i.add(o), o.updateMatrixWorld(!0), this._updateHelperMaterials(e, o)), s && (r.add(s), s.updateMatrixWorld(!0), this._updateHelperMaterials(e, s)), c && (a.add(c), c.updateMatrixWorld(!0), this._updateHelperMaterials(e, c))) : (o && i.remove(o), s && r.remove(s), c && a.remove(c));
	}
	_updateMaterial(e) {
		let { colorMode: t, unlit: n, wireframe: r } = this;
		e.traverse((e) => {
			if (!e.material) return;
			let i = e.material, a = e[Li];
			if (i !== a && i.dispose(), t !== Ki || n) {
				if (e.isPoints) {
					let t = new me();
					t.size = a.size, t.sizeAttenuation = a.sizeAttenuation, e.material = t;
				} else n ? e.material = new N({ wireframe: r }) : (e.material = new ue({ wireframe: r }), e.material.flatShading = !0);
				t === Ki && (e.material.map = a.map, e.material.color.set(a.color));
			} else e.material = a;
		});
	}
	_onLoadModel(e, t) {
		t[Bi] = performance.now(), e.traverse((e) => {
			let t = e.material;
			t && (e[Li] = t);
		}), this._updateMaterial(e);
	}
	_onDisposeModel(e) {
		let t = e.engineData;
		t?.boxHelperGroup && (t.boxHelperGroup.traverse((e) => {
			e.geometry && (e.geometry.dispose(), e.material.dispose());
		}), delete t.boxHelperGroup), t?.sphereHelper && (t.sphereHelper.traverse((e) => {
			e.geometry && (e.geometry.dispose(), e.material.dispose());
		}), delete t.sphereHelper), t?.regionHelper && (t.regionHelper.traverse((e) => {
			e.geometry && (e.geometry.dispose(), e.material.dispose());
		}), delete t.regionHelper);
	}
	dispose() {
		let e = this.tiles;
		e.removeEventListener("load-tileset", this._onLoadTilesetCB), e.removeEventListener("load-model", this._onLoadModelCB), e.removeEventListener("dispose-model", this._onDisposeModelCB), e.removeEventListener("update-after", this._onUpdateAfterCB), e.removeEventListener("tile-visibility-change", this._onTileVisibilityChangeCB), this.colorMode = Ki, this.boundsColorMode = Ki, this.unlit = !1, e.forEachLoadedModel((e) => {
			this._updateMaterial(e);
		}), e.traverse((e) => {
			this._onDisposeModel(e);
		}, null, !1), this.boxGroup?.removeFromParent(), this.sphereGroup?.removeFromParent(), this.regionGroup?.removeFromParent();
	}
}, oa = 0, sa = 1, ca = 2, la = 3, ua = 150;
function da(e, t) {
	return e * 1 | t * 2;
}
function fa(e, t, n) {
	return `${e}_${t}_${n}`;
}
var pa = class {
	constructor() {
		this.parent = null, this.x = 0, this.y = 0, this.level = 0, this.children = [
			,
			,
			,
			,
		].fill(null), this.childCount = 0, this.loadingState = oa, this.visible = !1, this.target = 0, this.showTimer = 0, this.hideTimer = 0, this.siblingForced = !1, this.forced = !1, this._key = null, this._index = null;
	}
	getKey() {
		return this._key === null && (this._key = `${this.x}_${this.y}_${this.level}`), this._key;
	}
	getIndex() {
		return this._index === null && (this._index = da(this.x % 2, this.y % 2)), this._index;
	}
	addChild(e) {
		let t = e.getIndex();
		if (this.children[t] || e.x >> 1 !== this.x || e.y >> 1 !== this.y || e.level - 1 !== this.level) throw Error();
		e.parent = this, this.children[t] = e, this.childCount++;
	}
	remove() {
		if (this.childCount > 0) throw Error();
		this.parent.childCount--, this.parent.children[this.getIndex()] = null, this.parent = null;
	}
}, ma = /* @__PURE__ */ new Set(), ha = class extends k {
	constructor() {
		super(), this.root = new pa(), this.cache = { [this.root.getKey()]: this.root }, this.contentCache = null, this._lastTime = -1, this.loadSiblings = !0;
	}
	update() {
		let e = performance.now(), t = e - (this._lastTime === -1 ? e : this._lastTime);
		this._lastTime = e;
		let { root: n } = this, r = this;
		i(n), a(n), ma.forEach((e) => this._deleteTile(e)), ma.clear();
		function i(e) {
			let n = e.target > 0 || e.siblingForced, a = e.visible && e.forced;
			if (n || a ? (e.showTimer += t, e.showTimer = Math.min(e.showTimer, ua), e.showTimer === ua && (e.hideTimer = 0)) : (e.visible || e.showTimer > 0) && (e.hideTimer += t, e.hideTimer = Math.min(e.hideTimer, ua), e.hideTimer === ua && (e.showTimer = 0, e.hideTimer = 0, e.loadingState !== oa && (r.contentCache.release(e.x, e.y, e.level), e.loadingState = oa))), ((n ? e.showTimer === ua : e.showTimer > 0) || a) && e.loadingState === oa) {
				e.loadingState = sa;
				let { x: t, y: n, level: i } = e, a = r.contentCache.lock(t, n, i);
				a instanceof Promise ? a.then((t) => {
					e.loadingState === sa && (e.loadingState = ca);
				}).catch((t) => {
					e.loadingState === sa && (e.loadingState = t.name === "AbortError" ? oa : la);
				}) : e.loadingState = a === null ? la : ca;
			}
			let { children: o } = e;
			if (r.loadSiblings) {
				let t = !1;
				for (let e = 0, n = o.length; e < n; e++) {
					let n = o[e];
					n !== null && n.target > 0 && (t = !0);
				}
				if (t && e.childCount < 4) for (let t = 0; t <= 1; t++) for (let n = 0; n <= 1; n++) r._ensureTile(2 * e.x + n, 2 * e.y + t, e.level + 1);
				for (let e = 0, n = o.length; e < n; e++) {
					let n = o[e];
					n !== null && (n.siblingForced = t);
				}
			} else for (let e = 0, t = o.length; e < t; e++) {
				let t = o[e];
				t !== null && (t.siblingForced = !1);
			}
			for (let e = 0, t = o.length; e < t; e++) {
				let t = o[e];
				t !== null && i(t);
			}
		}
		function a(e, t = !1, n = !0) {
			let i = e.target > 0 || e.siblingForced, o = e.visible && t;
			e.forced = t;
			let s = (i ? e.showTimer === ua : e.showTimer > 0) || o, c = !1;
			(i || o) && (e.loadingState === ca && (n || o) ? (c = !0, t = !1) : s && (t = !0));
			let { children: l } = e, u = !0;
			if (r.loadSiblings) for (let e = 0, t = l.length; e < t; e++) {
				let t = l[e];
				(t === null || t.loadingState !== ca && t.loadingState !== la) && (u = !1);
			}
			let d = e.visible || i || e.showTimer > 0, f = !1;
			for (let e = 0, n = l.length; e < n; e++) {
				let n = l[e];
				if (n !== null) {
					d = a(n, t, u) || d;
					let e = n.target > 0 || n.siblingForced, i = r.loadSiblings && n.loadingState === la;
					f ||= e && !n.visible && !i;
				}
			}
			if (f && e.loadingState === ca && (c = !0), r.loadSiblings && c && e.childCount === 4) {
				let e = !0, t = !1;
				for (let n = 0, r = l.length; n < r; n++) {
					let r = l[n];
					!r.visible && r.loadingState !== la && (e = !1), t ||= r.visible;
				}
				e && t && (c = !1);
			}
			return c !== e.visible && (e.visible = c, r.dispatchEvent({
				type: "toggle",
				visible: c,
				x: e.x,
				y: e.y,
				level: e.level
			})), e !== r.root && !d && ma.add(e), d;
		}
	}
	getVisibleTiles() {
		let e = [];
		for (let t in this.cache) {
			let n = this.cache[t];
			n.visible && e.push(n);
		}
		return e;
	}
	setTargetState(e, t, n, r) {
		if (r) {
			let r = this._ensureTile(e, t, n);
			r.target++;
		} else {
			let r = this.cache[fa(e, t, n)];
			if (!r || r.target <= 0) throw Error("MVTHierarchy: target ref count went negative — mismatched calls.");
			r.target--;
		}
	}
	_deleteTile(e) {
		if (e === this.root) throw Error();
		let { cache: t } = this, { x: n, y: r, level: i } = e, a = fa(n, r, i);
		if (!(a in t)) throw Error();
		t[a].remove(), delete t[a];
	}
	_ensureTile(e, t, n) {
		let { cache: r } = this, i = fa(e, t, n);
		if (i in r) return r[i];
		let a = new pa();
		a.x = e, a.y = t, a.level = n;
		let o = e >> 1, s = t >> 1, c = n - 1;
		return this._ensureTile(o, s, c).addChild(a), r[a.getKey()] = a, a;
	}
}, ga = {
	test: () => !1,
	mark: () => !1
}, _a = class {
	constructor() {
		this.id = "", this.layer = "", this.properties = null, this.lodLevel = 0, this.enabled = !0, this.valid = !0, this.ready = !1, this.screenPos = new F(), this.visibleDuration = Infinity, this.visibleTime = Infinity, this.visible = !1;
	}
	updateTransform(e, t, n) {}
	evaluate(e, t) {
		return !1;
	}
	onShown() {}
	onHidden() {}
}, va = class extends k {
	get hasPendingWork() {
		return this.working || this.needsUpdate;
	}
	constructor() {
		super(), this.camera = null, this.matrix = new M(), this.maxUpdateTimeMs = .5, this._task = null, this._deadline = 0, this.working = !1, this.resolution = new P(1, 1), this.size = 12, this.cells = new Uint32Array(1), this._totalResolution = new P(), this._lastMatrix = new M(), this._ndcMatrix = new M(), this._invMatrix = new M(), this._cameraLocalPos = new F(), this.buffer = .15, this.items = [], this.visible = /* @__PURE__ */ new Set(), this.prevVisible = /* @__PURE__ */ new Set(), this.added = /* @__PURE__ */ new Set(), this._itemSet = /* @__PURE__ */ new Set(), this._itemsNeedsUpdate = !1, this.needsUpdate = !1, this._id = -1, this.handle = {
			test: (e, t, n) => {
				let { cells: r, _id: i } = this, a = !1;
				return this._cellRange(e, t, n, (e, t, n) => (a = !0, r[n] !== 0 && r[n] !== i)) || !a;
			},
			mark: (e, t, n) => {
				let { cells: r, _id: i } = this;
				return this._cellRange(e, t, n, (e, t, n) => (r[n] = i, !1));
			}
		}, this.sortCallback = () => 0;
	}
	_cellRange(e, t, n, r) {
		let { size: i, resolution: a, buffer: o } = this, s = a.width, c = a.height, l = s * o, u = c * o, { width: d, height: f } = this._totalResolution, p = e + l, m = t + u, h = Math.max(0, Math.floor((p - n) / i)), g = Math.max(0, Math.floor((m - n) / i)), _ = Math.min(d - 1, Math.floor((p + n) / i)), v = Math.min(f - 1, Math.floor((m + n) / i)), y = n * n;
		for (let e = g; e <= v; e++) for (let t = h; t <= _; t++) {
			let n = Math.max(t * i, Math.min(p, (t + 1) * i)), a = Math.max(e * i, Math.min(m, (e + 1) * i)), o = p - n, s = m - a;
			if (o * o + s * s <= y && r(t, e, e * d + t) === !0) return !0;
		}
		return !1;
	}
	syncItems() {
		let { items: e, _itemSet: t } = this;
		if (this._itemsNeedsUpdate) {
			this._itemsNeedsUpdate = !1, e.length = t.size;
			let n = 0;
			for (let r of t.values()) e[n] = r, n++;
		}
	}
	_deadlineExpired() {
		return performance.now() >= this._deadline;
	}
	setDeadline(e = this.maxUpdateTimeMs) {
		this._deadline = performance.now() + e;
	}
	update(e = this.maxUpdateTimeMs) {
		this.setDeadline(e), this._task === null && (this._task = this._updateGenerator()), this._task.next();
	}
	flush() {
		this.setDeadline(Infinity), this._task === null && (this._task = this._updateGenerator());
		do
			this._task.next();
		while (this.working);
	}
	updateCameraTransform() {
		let { camera: e, matrix: t, _ndcMatrix: n, _invMatrix: r, _cameraLocalPos: i } = this;
		n.copy(t).premultiply(e.matrixWorldInverse).premultiply(e.projectionMatrix), r.copy(t).invert(), i.setFromMatrixPosition(e.matrixWorld).applyMatrix4(r);
	}
	*_updateGenerator() {
		for (;;) {
			let { resolution: e, size: t, added: n, handle: r, sortCallback: i, buffer: a, items: o, _lastMatrix: s, _itemSet: c, _ndcMatrix: l, _cameraLocalPos: u } = this;
			if (this.updateCameraTransform(), s.equals(l) && !this.needsUpdate) {
				yield;
				continue;
			}
			s.copy(l), this.needsUpdate = !1, this.working = !0, this.syncItems(), [this.visible, this.prevVisible] = [this.prevVisible, this.visible];
			let { visible: d, prevVisible: f } = this;
			d.clear(), n.clear(), this._totalResolution.copy(e).multiplyScalar(1 + 2 * a).multiplyScalar(1 / t).ceil();
			let { width: p, height: m } = this._totalResolution;
			this.cells.length === p * m ? this.cells.fill(0) : this.cells = new Uint8Array(p * m);
			for (let t = 0, n = o.length; t < n; t++) {
				let n = o[t];
				n.enabled && n.updateTransform(l, e, u), this._deadlineExpired() && (yield, this.updateCameraTransform());
			}
			o.sort(i), this._deadlineExpired() && (yield, this.updateCameraTransform());
			for (let e = 0, t = o.length; e < t; e++) {
				let t = o[e];
				this._id = e + 1, t.enabled && c.has(t) && t.evaluate(r) && (d.add(t), f.has(t) ? (t.visible = !1, f.delete(t)) : (t.visible = !0, n.add(t))), this._deadlineExpired() && (yield, this.updateCameraTransform());
			}
			this.working = !1, (n.size > 0 || f.size > 0) && this.dispatchEvent({
				type: "change",
				added: n,
				removed: f
			}), yield;
		}
	}
	refreshLayout(e) {
		let { resolution: t, _ndcMatrix: n, _cameraLocalPos: r } = this;
		e.updateTransform(n, t, r), e.evaluate(ga, !0);
	}
	register(e) {
		this._itemSet.add(e), this._itemsNeedsUpdate = !0, this.needsUpdate = !0;
	}
	unregister(e) {
		this._itemSet.delete(e), this._itemsNeedsUpdate = !0, this.needsUpdate = !0;
	}
}, ya = class extends k {
	get camera() {
		return this.manager.camera;
	}
	set camera(e) {
		this.manager.camera = e;
	}
	get matrix() {
		return this.manager.matrix;
	}
	get resolution() {
		return this.manager.resolution;
	}
	get size() {
		return this.manager.size;
	}
	set size(e) {
		this.manager.size = e;
	}
	get cells() {
		return this.manager.cells;
	}
	get working() {
		return this.manager.working;
	}
	get hasPendingWork() {
		return this._showTimers.size > 0 || this._hideTimers.size > 0 || this.manager.hasPendingWork;
	}
	get sortCallback() {
		return this.manager.sortCallback;
	}
	set sortCallback(e) {
		this.manager.sortCallback = e;
	}
	get buffer() {
		return this.manager.buffer;
	}
	set buffer(e) {
		this.manager.buffer = e;
	}
	get needsUpdate() {
		return this.manager.needsUpdate;
	}
	set needsUpdate(e) {
		this.manager.needsUpdate = e;
	}
	constructor() {
		super(), this.manager = new va(), this.visible = /* @__PURE__ */ new Set(), this.showDelay = .5, this.hideDelay = .5, this._showTimers = /* @__PURE__ */ new Map(), this._hideTimers = /* @__PURE__ */ new Map(), this._lastUpdateTime = -1, this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this.manager.addEventListener("change", ({ added: e, removed: t }) => {
			let { _showTimers: n, _hideTimers: r, visible: i } = this;
			for (let t of e) r.delete(t), i.has(t) || (t.onShown(), n.set(t, 0));
			for (let e of t) n.delete(e) ? e.onHidden() : i.has(e) && r.set(e, 0);
		});
	}
	register(e) {
		return this.manager.register(e);
	}
	unregister(e) {
		this.manager.unregister(e);
	}
	syncItems() {
		this.manager.syncItems();
	}
	flush() {
		this.manager.flush();
	}
	update(...e) {
		let t = performance.now() / 1e3, n = this._lastUpdateTime < 0 ? 0 : Math.min(t - this._lastUpdateTime, .1);
		this._lastUpdateTime = t, this.manager.update(...e);
		let { _showTimers: r, _hideTimers: i, visible: a, added: o, removed: s, showDelay: c, hideDelay: l } = this, u = performance.now();
		for (let [e, t] of r) {
			let i = t + n;
			i >= c ? (r.delete(e), a.add(e), o.add(e), s.delete(e), e.visibleTime = u) : r.set(e, i);
		}
		for (let [e, t] of i) {
			let r = t + n;
			r >= l || !e.valid ? (i.delete(e), a.delete(e), s.add(e), o.delete(e), e.onHidden()) : i.set(e, r);
		}
		for (let e of a.values()) e.visibleDuration = u - e.visibleTime, this.manager.refreshLayout(e);
		(o.size > 0 || s.size > 0) && this.dispatchEvent({
			type: "change",
			added: o,
			removed: s
		});
	}
	finishAnimations() {
		let { _showTimers: e, _hideTimers: t, visible: n, added: r, removed: i } = this, a = performance.now();
		for (let t of e.keys()) n.add(t), r.add(t), i.delete(t), t.visibleTime = a;
		e.clear();
		for (let e of t.keys()) n.delete(e), i.add(e), r.delete(e), e.onHidden();
		t.clear();
	}
	reset() {
		this.added.clear(), this.removed.clear();
	}
}, ba = 5e5, xa = class extends _a {
	get count() {
		return this.lat.length;
	}
	get anchorCount() {
		return this.anchorPositions.length;
	}
	constructor() {
		super(), this.text = "", this.characterWidths = [], this.characterRadius = 0, this.totalTextWidth = 0, this.range = null, this.lat = [], this.lon = [], this.positions = [], this.anchorPositions = [], this.screenPositions = [], this.cumulativeLen = [], this.cachedMatrix = new M(), this.cachedResolution = new P(), this.needsUpdate = !1;
	}
	evaluate() {
		throw Error();
	}
	updateTransform(e, t, n) {
		let { positions: r, screenPositions: i, cachedMatrix: a, cachedResolution: o, cumulativeLen: s } = this;
		if (!(!this.needsUpdate && a.equals(e) && o.equals(t))) {
			for (this.needsUpdate = !1, a.copy(e), o.copy(t); i.length < r.length;) i.push(new F());
			for (let n = 0, a = i.length; n < a; n++) {
				let a = r[n], o = i[n];
				o.copy(a).applyMatrix4(e), o.x = (o.x * .5 + .5) * t.width, o.y = (-o.y * .5 + .5) * t.height, o.z = j.mapLinear(o.z, -1, 1, 0, 1);
			}
			s.length = i.length, s[0] = 0;
			for (let e = 1; e < i.length; e++) {
				let t = i[e - 1], n = i[e], r = n.x - t.x, a = n.y - t.y, o = Math.sqrt(r * r + a * a);
				s[e] = s[e - 1] + o;
			}
		}
	}
	updateCharacterWidthCache(e) {
		let { text: t, characterWidths: n, properties: r, layer: i } = this;
		n.length = t.length;
		let a = 0;
		for (let o = 0, s = t.length; o < s; o++) {
			let s = e(t[o], i, r);
			n[o] = s, a += s;
		}
		this.totalTextWidth = a, this.characterRadius = e("M", i, r);
	}
	hasCoverage(e, t) {
		let [n, r, i, a] = this.range;
		return t >= n && t <= i && e >= r && e <= a;
	}
	generateAnchors(e) {
		let { lat: t, lon: n } = this, r = [], i = 0;
		for (let e = 0, a = t.length - 1; e < a; e++) {
			let a = t[e], o = t[e + 1], s = n[e], c = n[e + 1], l = .5 * (a + o), u = o - a, d = (c - s) * Math.cos(l), f = Math.sqrt(u * u + d * d);
			r.push(f), i += f;
		}
		let a = e * .5;
		a > i && (a = i * .5);
		let o = 0, s = 0, c = [];
		for (; a <= i;) {
			for (; s < r.length && o + r[s] < a;) o += r[s], s++;
			if (s >= r.length) break;
			let i = s, l = s + 1, u = r[i], d = u > 0 ? (a - o) / u : 0;
			c.push({
				i0: i,
				i1: l,
				alpha: d,
				ref: null,
				lat: j.lerp(t[i], t[l], d),
				lon: j.lerp(n[i], n[l], d)
			}), a += e;
		}
		this.anchorPositions = c;
	}
};
function Sa(e, t) {
	let n = [];
	for (let r = 0, i = e.length - 1; r < i; r++) {
		let i = e[r], a = e[r + 1];
		n.push(i);
		let o = a.x - i.x, s = a.y - i.y, c = Math.sqrt(o * o + s * s), l = Math.ceil(c / t);
		for (let e = 1; e < l; e++) {
			let t = e / l;
			n.push({
				x: j.lerp(i.x, a.x, t),
				y: j.lerp(i.y, a.y, t)
			});
		}
	}
	return n.push(e[e.length - 1]), n;
}
function Ca(e, t, n, r, i, a, o, s = []) {
	let c = ba / a.radius.x, [l, u, d, f] = i.getTileBounds(t, n, r, !0, !1), { flipY: p } = i, m = i.getTileBounds(t, n, r, !1, !1);
	for (let t in e.layers) {
		let n = e.layers[t], a = n.extent, h = a * .015625, g = [];
		for (let e = 0; e < n.length; e++) {
			let r = n.feature(e);
			if (r.type !== 2 || !o(t, r.properties, r.type)) continue;
			let i = `${t}:${r.properties.name || r.id}`, a = r.loadGeometry();
			for (let e of a) g.push({
				key: i,
				id: i,
				properties: r.properties,
				points: e
			});
		}
		for (let e of g) {
			let n = Sa(e.points, h), o = new xa();
			o.id = e.id, o.layer = t, o.properties = e.properties, o.lodLevel = r, o.range = m;
			for (let e of n) {
				let t = j.lerp(l, d, e.x / a), n = e.y / a, r = p ? j.lerp(f, u, n) : j.lerp(u, f, n), [s, c] = i.toCartographicPoint(t, r);
				o.lon.push(s), o.lat.push(c), o.positions.push(new F());
			}
			o.generateAnchors(c * (m[2] - m[0])), s.push(o);
		}
	}
	return s;
}
//#endregion
//#region src/three/plugins/mvt/SettlingManager.js
var wa = 1e-10, Ta = 1, Ea = 16, Da = /* @__PURE__ */ new ye(), Oa = /* @__PURE__ */ new F();
function ka(e, t) {
	let { ray: n } = e, { planes: r } = t, i = 0, a = e.far;
	for (let e = 0; e < 6; e++) {
		let t = r[e], o = t.normal.dot(n.direction);
		if (Math.abs(o) < wa) {
			if (t.distanceToPoint(n.origin) < 0) return !1;
		} else {
			let e = n.distanceToPlane(t);
			if (o > 0) e !== null && e > i && (i = e);
			else {
				if (e === null) return !1;
				e < a && (a = e);
			}
			if (i > a) return !1;
		}
	}
	return !0;
}
var Aa = class {
	get hasPendingWork() {
		return this._queue.size > 0;
	}
	constructor() {
		this.tiles = null, this.occupancy = null, this.camera = null, this.maxSettleTimeMs = 1, this.performSettleRaycast = null, this._queue = /* @__PURE__ */ new Set(), this._items = /* @__PURE__ */ new Set(), this.needsUpdate = !1, this._task = null, this._deadline = 0;
	}
	register(e) {
		this._items.add(e), this._queue.add(e);
	}
	unregister(e) {
		this._items.delete(e), this._queue.delete(e);
	}
	update(e = this.maxSettleTimeMs) {
		if (this.setDeadline(e), this.needsUpdate) {
			this.needsUpdate = !1;
			for (let e of this._items.values()) this._queue.add(e);
		}
		this._task === null && (this._task = this._settleGenerator()), this._task.next();
	}
	setDeadline(e = this.maxSettleTimeMs) {
		this._deadline = performance.now() + e;
	}
	_deadlineExpired() {
		return performance.now() >= this._deadline;
	}
	_getSettlingRay(e, t, n) {
		let { tiles: r } = this, { origin: i, direction: a } = n.ray;
		r.ellipsoid.getCartographicToPosition(e, t, 1e8, i), r.ellipsoid.getCartographicToPosition(e, t, 0, a), a.sub(i).normalize(), n.far = 2 * 1e8, n.firstHitOnly = !0;
	}
	_settleSample(e, t, n, r) {
		let { tiles: i, performSettleRaycast: a } = this, { origin: o, direction: s } = Da.ray;
		this._getSettlingRay(e, t, Da), o.applyMatrix4(i.group.matrixWorld), s.transformDirection(i.group.matrixWorld);
		let c = !1;
		if (a !== null) c = a(Da.ray, e, t, Oa);
		else {
			let e = Da.intersectObject(i.group);
			e.length > 0 && (Oa.copy(e[0].point), c = !0);
		}
		c ? Oa.applyMatrix4(i.group.matrixWorldInverse) : i.ellipsoid.getCartographicToPosition(e, t, 0, Oa), Oa.distanceTo(n) > r && n.copy(Oa);
	}
	*_settleGenerator() {
		let e = new M(), t = new te(), n = /* @__PURE__ */ new Set(), r = [
			[],
			[],
			[],
			[]
		];
		for (;;) {
			let { _queue: i, _items: a, tiles: o, camera: s, occupancy: c } = this;
			if (s !== null) {
				e.copy(o.group.matrixWorld).premultiply(s.matrixWorldInverse).premultiply(s.projectionMatrix), t.setFromProjectionMatrix(e);
				for (let e of i) if (!c.visible.has(e)) {
					if (e instanceof xa) {
						let { anchorPositions: r } = e, { lat: i, lon: a } = r[r.length >> 1];
						if (this._getSettlingRay(i, a, Da), ka(Da, t)) {
							n.add(e);
							continue;
						}
					} else this._getSettlingRay(e.lat, e.lon, Da), ka(Da, t) && n.add(e);
					this._deadlineExpired() && (yield);
				}
			}
			for (let e of i) {
				let t = n.has(e), i = 0;
				!e.ready && t ? i = 3 : c.visible.has(e) ? i = 2 : t && (i = 1), r[i].push(e), this._deadlineExpired() && (yield);
			}
			for (let e = r.length - 1; e >= 0; e--) {
				let t = r[e];
				for (; t.length > 0;) {
					let e = t.pop();
					if (i.delete(e), a.has(e)) {
						if (!e.enabled) {
							e.ready = !1;
							continue;
						}
						yield* this._settleItem(e), this._deadlineExpired() && (yield);
					}
				}
			}
			n.clear(), r.forEach((e) => e.length = 0), yield;
		}
	}
	*_settleItem(e) {
		let t = Ta * 2 ** (Ea - e.lodLevel);
		if (e instanceof xa) {
			let { _items: n } = this, { lat: r, lon: i, positions: a } = e;
			for (let o = 0, s = r.length; o < s; o++) if (this._settleSample(r[o], i[o], a[o], t), this._deadlineExpired() && (yield, !n.has(e))) return;
			e.needsUpdate = !0;
		} else this._settleSample(e.lat, e.lon, e.position, t);
		e.ready = !0;
	}
}, ja = 40, Ma = Math.PI / 2, Na = Math.cos(Ma), Pa = .8, Fa = [], Ia = [], Q = /* @__PURE__ */ new F(), La = /* @__PURE__ */ new P(), Ra = /* @__PURE__ */ new P(), za = /* @__PURE__ */ new P(), Ba = /* @__PURE__ */ new P(), Va = /* @__PURE__ */ new P(), Ha = /* @__PURE__ */ new P(), Ua = /* @__PURE__ */ new P(), Wa = 0, Ga = class extends _a {
	get lat() {
		return this.getActiveReference().lat;
	}
	get lon() {
		return this.getActiveReference().lon;
	}
	get ready() {
		return this.getActiveReference().line.ready;
	}
	set ready(e) {}
	get properties() {
		return this.getActiveReference().line.properties;
	}
	set properties(e) {}
	get enabled() {
		return this.getActiveReference().line.enabled;
	}
	set enabled(e) {}
	get text() {
		return this.getActiveReference().line.text;
	}
	constructor(e) {
		super(), this.id = `${e}_${Wa++}`, this.displayed = !1, this.referencePaths = [], this._activeReference = null, this._snapped = null, this._flippedTextDir = !1, this.characterPositions = [], this.characterAngles = [];
	}
	evaluate(e, t = !1) {
		let { text: n } = this;
		if (!n) return !1;
		let { line: r } = this.getActiveReference(), { cumulativeLen: i } = r;
		return !r.ready || i.length < 2 || (this._flippedTextDir = this._getTextDirection(), Fa.length = n.length, Ia.length = n.length, this._layoutCharacters(e, Fa, Ia, t), !this.valid && !t) ? !1 : (this._placeCharacters(e, Fa, Ia), !0);
	}
	_getTextDirection() {
		let { line: e, i0: t, i1: n, alpha: r } = this.getActiveReference(), { cumulativeLen: i, screenPositions: a, totalTextWidth: o } = e, s = j.lerp(i[t], i[n], r), c = o * .5, l = s - c, u = s + c, d = 0, f = 0, p = i.length - 2, m = 1;
		for (let e = 0, t = i.length - 2; e < t; e++) {
			let t = e + 1, n = i[e], r = i[t];
			l >= n && l <= r && (d = e, f = j.mapLinear(l, n, r, 0, 1)), u >= n && u <= r && (p = e, m = j.mapLinear(u, n, r, 0, 1));
		}
		let h = Q.lerpVectors(a[d], a[d + 1], f).x;
		return Q.lerpVectors(a[p], a[p + 1], m).x < h;
	}
	_layoutCharacters(e, t, n, r = !1) {
		let { line: i, i0: a, i1: o, alpha: s } = this.getActiveReference(), { cumulativeLen: c, screenPositions: l, totalTextWidth: u, characterWidths: d, characterRadius: f, text: p } = i, m = j.lerp(c[a], c[o], s), h = this._flippedTextDir;
		this.valid = !0;
		let g = l.length, _ = c[c.length - 1], v = p.length, y = 0, b = 0, x = 0;
		for (let i = 0; i < v; i++) {
			let a = h ? v - 1 - i : i, o = d[a], s = b + o * .5 - u * .5;
			b += o;
			let p = m + s;
			if ((p < 0 || p > _) && (this.valid = !1, !r)) break;
			for (; y < g - 2 && c[y + 1] < p;) y++;
			let S = y + 1, C = c[S] - c[y], w = C > 0 ? (p - c[y]) / C : 0, T = l[y], E = l[S];
			if (Q.lerpVectors(T, E, w), (Q.z < 0 || Q.z > 1 || e.test(Q.x, Q.y, f)) && (this.valid = !1, !r)) break;
			if (i > 0) {
				let e = Q.x - La.x, t = Q.y - La.y, n = e * e + t * t, i = (o + x) * .5 * Pa;
				if (n < i * i && (this.valid = !1, !r)) break;
			}
			if (i >= 2) {
				Va.subVectors(La, Ra), Ha.subVectors(Q, Ra), Ua.subVectors(Q, La);
				let e = Math.abs(Va.cross(Ha)), t = Va.length() * Ua.length() * Ha.length();
				if ((t > 0 ? 2 * e / t : 0) > 1 / ja && (this.valid = !1, !r)) break;
			}
			if (za.subVectors(E, T).normalize(), i > 0 && za.dot(Ba) < Na && (this.valid = !1, !r)) break;
			Ba.copy(za), x = o, Ra.copy(La), La.copy(Q), t[a] = y, n[a] = w;
		}
	}
	_placeCharacters(e, t, n) {
		let { characterPositions: r, characterAngles: i, text: a } = this, { line: o } = this.getActiveReference(), { screenPositions: s, positions: c, characterRadius: l } = o, u = this._flippedTextDir, d = a.length;
		for (; r.length < d;) r.push(new F());
		r.length = d, i.length = d;
		for (let a = 0; a < d; a++) {
			let o = t[a], d = n[a], f = s[o], p = s[o + 1];
			e.mark(f.x + (p.x - f.x) * d, f.y + (p.y - f.y) * d, l), r[a].lerpVectors(c[o], c[o + 1], d);
			let m = (p.x - f.x) * (u ? -1 : 1), h = (p.y - f.y) * (u ? -1 : 1);
			i[a] = Math.atan2(h, m);
		}
	}
	updateTransform(e, t, n) {
		this.updateActiveReference(), this.getActiveReference().line.updateTransform(e, t, n);
	}
	isEmpty() {
		return this.referencePaths.length === 0;
	}
	hasLoD(e) {
		return this.referencePaths.find((t) => t.line.lodLevel === e);
	}
	getPosition(e) {
		let { line: t, i0: n, i1: r, alpha: i } = this.getActiveReference();
		return e.lerpVectors(t.positions[n], t.positions[r], i);
	}
	getActiveReference() {
		return this._snapped ?? this._activeReference;
	}
	updateActiveReference() {
		let { referencePaths: e, _activeReference: t, displayed: n } = this, r, i = e[0] ?? null;
		if (r = i && i.line.ready ? i : t && t.line.ready && (e.includes(t) || this.displayed) ? t : i ?? t, r && t && r !== t) if (n) {
			let { lat: e, lon: n } = this._snapped ?? t;
			this._snapped = this._snapToLine(r.line, e, n);
		} else this._snapped = null;
		return this._activeReference = r, r;
	}
	_snapToLine(e, t, n) {
		let { lat: r, lon: i } = e;
		if (r.length < 2) return null;
		let a = Infinity, o = 0, s = 1, c = 0, l = r[0], u = i[0];
		for (let e = 0, d = r.length - 1; e < d; e++) {
			let d = r[e], f = i[e], p = r[e + 1] - d, m = i[e + 1] - f, h = p * p + m * m, g = h > 0 ? j.clamp(((t - d) * p + (n - f) * m) / h, 0, 1) : 0, _ = d + p * g, v = f + m * g, y = t - _, b = n - v, x = y * y + b * b;
			x < a && (a = x, o = e, s = e + 1, c = g, l = _, u = v);
		}
		return {
			line: e,
			i0: o,
			i1: s,
			alpha: c,
			lat: l,
			lon: u
		};
	}
	onShown() {
		this.displayed = !0, this._snapped = null;
	}
	onHidden() {
		this.displayed = !1;
	}
	addLine(e, t) {
		let n = e.anchorPositions[t], { referencePaths: r } = this;
		r.push({
			line: e,
			i0: n.i0,
			i1: n.i1,
			alpha: n.alpha,
			lat: n.lat,
			lon: n.lon
		}), r.sort((e, t) => t.line.lodLevel - e.line.lodLevel), this.updateActiveReference();
	}
	removeLine(e) {
		let { referencePaths: t } = this;
		for (let n = 0; n < t.length; n++) t[n].line === e && (t.splice(n, 1), n--);
		this.updateActiveReference();
	}
}, Ka = class {
	constructor() {
		this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this._anchorsById = /* @__PURE__ */ new Map(), this._linesById = /* @__PURE__ */ new Map(), this.lines = /* @__PURE__ */ new Set(), this.anchors = /* @__PURE__ */ new Set();
	}
	reset() {
		this.added.clear(), this.removed.clear();
	}
	update() {
		let { _anchorsById: e, removed: t } = this;
		e.forEach((n, r) => {
			n.forEach((e) => {
				e.isEmpty() && (n.delete(e), this.anchors.delete(e), t.add(e));
			}), n.size === 0 && e.delete(r);
		});
	}
	addLines(e) {
		let { _anchorsById: t, _linesById: n, added: r } = this, i = /* @__PURE__ */ new Map();
		e.forEach((e) => {
			i.has(e.id) || i.set(e.id, []), i.get(e.id).push(e);
		}), i.forEach((e, i) => {
			t.has(i) || t.set(i, /* @__PURE__ */ new Set()), n.has(i) || n.set(i, /* @__PURE__ */ new Set());
			let a = e[0], o = t.get(i);
			o.forEach((t) => {
				let n = Infinity, r = null, i = -1;
				!a.hasCoverage(t.lat, t.lon) || t.hasLoD(a.lodLevel) || (e.forEach((e) => {
					e.anchorPositions.forEach((a, o) => {
						if (a.ref === null) {
							let s = t.lat - a.lat, c = t.lon - a.lon, l = s * s + c * c;
							l < n && (n = l, r = e, i = o);
						}
					});
				}), r && (t.addLine(r, i), r.anchorPositions[i].ref = t));
			}), e.forEach((e) => {
				e.anchorPositions.forEach((t, n) => {
					if (t.ref === null) {
						let a = new Ga(i);
						a.addLine(e, n), e.hasCoverage(a.lat, a.lon) && (t.ref = a, o.add(a), this.anchors.add(a), r.add(a));
					}
				});
			});
		}), i.forEach((e, t) => {
			let r = n.get(t);
			e.forEach((e) => {
				r.add(e), this.lines.add(e);
			});
		});
	}
	deleteLines(e) {
		e.forEach((e) => this.deleteLine(e));
	}
	deleteLine(e) {
		let { _anchorsById: t, _linesById: n } = this, r = e.id;
		n.get(r).delete(e), this.lines.delete(e), n.get(r).size === 0 && n.delete(r);
		let i = t.get(r);
		i && i.forEach((t) => {
			t.removeLine(e);
		});
	}
}, qa = class {
	constructor(e) {
		this.enabled = !1, this.canvas = null, this.occupancyManager = e;
	}
	update() {
		let { occupancyManager: e, enabled: t } = this;
		if (!t) {
			this.dispose();
			return;
		}
		if (this.canvas === null) {
			let e = document.createElement("canvas");
			e.style.cssText = "position:fixed;top:0;left:0;pointer-events:none;opacity:0.5;", document.body.appendChild(e), this.canvas = e;
		}
		if (e.working) return;
		let { canvas: n } = this, { cells: r, size: i, resolution: a, buffer: o } = e, s = window.devicePixelRatio, c = a.width * o, l = a.height * o, u = Math.ceil((a.width + 2 * c) / i), d = Math.ceil((a.height + 2 * l) / i);
		n.width = Math.round(s * (a.width + 2 * c)), n.height = Math.round(s * (a.height + 2 * l)), n.style.width = `${a.width + 2 * c}px`, n.style.height = `${a.height + 2 * l}px`, n.style.left = `${-c}px`, n.style.top = `${-l}px`;
		let f = i * s, p = n.getContext("2d");
		p.clearRect(0, 0, n.width, n.height);
		for (let e = 0; e < d; e++) for (let t = 0; t < u; t++) {
			let n = r[e * u + t] !== 0;
			p.fillStyle = n ? "rgba( 255, 80, 80, 0.6 )" : "rgba( 80, 255, 80, 0.15 )", p.fillRect(t * f + .5, e * f + .5, f - 1, f - 1), p.strokeStyle = n ? "rgba( 255, 80, 80, 1 )" : "rgba( 80, 255, 80, 0.25 )", p.lineWidth = 1, p.strokeRect(t * f + .5, e * f + .5, f - 1, f - 1);
		}
	}
	dispose() {
		this.canvas !== null && (this.canvas.remove(), this.canvas = null);
	}
}, Ja = new class {
	constructor() {
		this._cache = {};
	}
	getColor(...e) {
		let t = e.pop(), n = e.join("_"), { _cache: r } = this;
		return n in r || (t.setHSL(Math.random(), 1, .5), r[n] = t.getHex()), t.set(r[n]);
	}
}(), Ya = {
	NONE: 0,
	ID: 1,
	LEVEL: 2,
	TILE: 3,
	NAME: 4
}, Xa = /* @__PURE__ */ new F(), Za = /* @__PURE__ */ new F(), Qa = /* @__PURE__ */ new w();
function $a() {
	let e = new E(new Uint8Array(1024 * 4), 32, 32);
	for (let t = 0; t < 32; t++) for (let n = 0; n < 32; n++) {
		let r = (t - 16) / 16, i = (n - 16) / 16, a = Math.sqrt(r * r + i * i), o = n * 32 + t;
		e.image.data[4 * o + 0] = 255, e.image.data[4 * o + 1] = 255, e.image.data[4 * o + 2] = 255, e.image.data[4 * o + 3] = a < 1 ? 255 : 0;
	}
	return e.needsUpdate = !0, e;
}
var eo = class {
	get ColorMode() {
		return Ya;
	}
	constructor(e) {
		this.enabled = !1, this.colorMode = Ya.NONE, this.displayLines = !0, this.displayAnchors = !0, this.camera = null, this.anchorManager = e, this.group = null, this._lines = null, this._points = null;
	}
	update() {
		let { enabled: e, group: t, camera: n, anchorManager: r, displayAnchors: i, displayLines: a } = this;
		if (!e) {
			this.dispose();
			return;
		}
		if (this._lines === null) {
			let e = new ie();
			e.material.transparent = !0, e.material.depthTest = !1, e.material.depthWrite = !1, e.material.vertexColors = !0, e.frustumCulled = !1, e.raycast = () => {};
			let n = new pe();
			n.material.transparent = !0, n.material.depthTest = !1, n.material.depthWrite = !1, n.material.map = $a(), n.material.size = 6, n.material.sizeAttenuation = !1, n.material.vertexColors = !0, n.frustumCulled = !1, n.raycast = () => {}, t.add(e, n), this._lines = e, this._points = n;
		}
		let { _lines: o, _points: s } = this;
		n === null ? Xa.set(0, 0, 0) : (Xa.setFromMatrixPosition(n.matrixWorld), t.worldToLocal(Xa));
		let c = Array.from(r.lines).filter((e) => e instanceof xa && e.ready), l = 0;
		for (let e of c) l += e.count - 1;
		let u = new x(new Float32Array(l * 2 * 3), 3), d = new x(new Float32Array(l * 2 * 3), 3), f = 0;
		for (let e of c) {
			this._getColor(e, Qa);
			let t = e.positions;
			for (let e = 0, n = t.length - 1; e < n; e++) u.setXYZ(f + 0, ...Za.copy(t[e]).sub(Xa)), u.setXYZ(f + 1, ...Za.copy(t[e + 1]).sub(Xa)), d.setXYZ(f + 0, ...Qa), d.setXYZ(f + 1, ...Qa), f += 2;
		}
		let p = Array.from(r.anchors).filter((e) => e.ready), m = new x(new Float32Array(p.length * 3), 3), h = new x(new Float32Array(p.length * 2 * 3), 3);
		f = 0;
		for (let e of p) e.getPosition(Za).sub(Xa), m.setXYZ(f, ...Za), this._getColor(e.getActiveReference().line, Qa), h.setXYZ(f, ...Qa), f++;
		o.geometry.dispose(), o.geometry.setAttribute("position", u), o.geometry.setAttribute("color", d), o.position.copy(Xa), o.updateMatrixWorld(), o.visible = a, s.geometry.dispose(), s.geometry.setAttribute("position", m), s.geometry.setAttribute("color", h), s.position.copy(Xa), s.updateMatrixWorld(), s.visible = i;
	}
	dispose() {
		this._lines !== null && (this._lines.removeFromParent(), this._lines.geometry.dispose(), this._lines.material.dispose(), this._lines = null), this._points !== null && (this._points.removeFromParent(), this._points.geometry.dispose(), this._points.material.dispose(), this._points.material.map.dispose(), this._points = null);
	}
	_getColor(e, t) {
		switch (this.colorMode) {
			case Ya.ID:
				Ja.getColor(e.id, t);
				break;
			case Ya.LEVEL:
				Ja.getColor(e.lodLevel, t);
				break;
			case Ya.NAME:
				Ja.getColor(e.properties.name, t);
				break;
			case Ya.TILE:
				Ja.getColor(...e.range, t);
				break;
			default:
				t.set(16777215);
				break;
		}
	}
}, to = /* @__PURE__ */ new F(), no = Math.acos(.1), ro = class extends _a {
	constructor() {
		super(), this.position = new F(), this.lat = 0, this.lon = 0, this.radius = 28, this.screenPos = new F(), this._facingAngle = 0;
	}
	updateTransform(e, t, n) {
		let { position: r, screenPos: i } = this;
		i.copy(r).applyMatrix4(e), i.x = (i.x * .5 + .5) * t.width, i.y = (-i.y * .5 + .5) * t.height, i.z = +(i.z < -1 || i.z > 1), n === null ? this._facingAngle = 0 : (to.subVectors(n, r), this._facingAngle = r.lengthSq() > 0 ? r.angleTo(to) : 0);
	}
	evaluate(e) {
		let { screenPos: t, radius: n, _facingAngle: r } = this;
		return !this.ready || t.z !== 0 || r > no || e.test(t.x, t.y, n) ? !1 : (e.mark(t.x, t.y, n), !0);
	}
};
function io(e, t, n, r, i, a, o = []) {
	let [s, c, l, u] = i.getTileBounds(t, n, r, !0, !1);
	for (let t in e.layers) {
		let n = e.layers[t], d = n.extent;
		for (let e = 0; e < n.length; e++) {
			let f = n.feature(e);
			if (f.type !== 1 || !a(t, f.properties, f.type)) continue;
			let p = f.loadGeometry();
			for (let [e] of p) {
				let n = j.lerp(s, l, e.x / d), a = e.y / d, p = i.flipY ? j.lerp(u, c, a) : j.lerp(c, u, a), [m, h] = i.toCartographicPoint(n, p), g = new ro();
				g.id = `${t}:${f.id}`, g.layer = t, g.properties = f.properties, g.lat = h, g.lon = m, g.lodLevel = r, o.push(g);
			}
		}
	}
	return o;
}
//#endregion
//#region src/three/plugins/mvt/debug/HierarchyOverlay.js
var ao = {
	NONE: 0,
	LEVEL: 1,
	TILE: 2
}, oo = class {
	get ColorMode() {
		return ao;
	}
	constructor() {
		this.enabled = !1, this._wasEnabled = !1, this.hierarchy = null, this.tiles = null, this.tiling = null, this.colorMode = ao.NONE, this._regions = {}, this._onToggleCallback = ({ x: e, y: t, level: n, visible: r }) => {
			let i = `${e}_${t}_${n}`;
			if (r) {
				let { ellipsoid: r, group: a } = this.tiles, [o, s, c, l] = this.tiling.getTileBounds(e, t, n, !1, !1), u = new d(...r.radius, s, l, o, c, 600, 700), f = new Fi(u);
				f.material.depthWrite = !1, f.material.depthTest = !1, f.material.transparent = !0;
				let p = new Ii(u);
				p.material.transparent = !0, p.material.opacity = .1, p.material.depthWrite = !1;
				let m = new A();
				m.add(f, p), a.add(m), m.updateMatrixWorld(!0), this._regions[i] = {
					helper: m,
					x: e,
					y: t,
					level: n
				};
			} else {
				let { helper: e } = this._regions[i];
				e.children.forEach((e) => e.dispose()), e.removeFromParent(), delete this._regions[i];
			}
		};
	}
	update() {
		let { enabled: e, hierarchy: t, _regions: n } = this;
		if (e !== this._wasEnabled && (this._wasEnabled = e, e ? (t.getVisibleTiles().forEach((e) => {
			this._onToggleCallback(e);
		}), t.addEventListener("toggle", this._onToggleCallback)) : this.dispose()), e) for (let e in n) {
			let { x: t, y: r, level: i, helper: a } = n[e];
			a.children.forEach((e) => {
				let { color: n } = e.material;
				switch (this.colorMode) {
					case ao.NONE:
						n.set(16777215);
						break;
					case ao.LEVEL:
						Ja.getColor(i, n);
						break;
					case ao.TILE:
						Ja.getColor(t, r, i, n);
						break;
				}
			});
		}
	}
	dispose() {
		let { hierarchy: e } = this;
		e.getVisibleTiles().forEach((e) => {
			this._onToggleCallback({
				...e,
				visible: !1
			});
		}), e.removeEventListener("toggle", this._onToggleCallback);
	}
}, so = class {
	constructor() {
		this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this.points = /* @__PURE__ */ new Set(), this._annotationsById = /* @__PURE__ */ new Map();
	}
	add(e) {
		let { _annotationsById: t, points: n, added: r } = this, { id: i } = e;
		if (!t.has(i)) t.set(i, {
			annotation: e,
			ref: 0
		}), n.add(e), r.add(e);
		else {
			let n = t.get(i).annotation;
			e.lodLevel > n.lodLevel && (n.lodLevel = e.lodLevel, n.lat = e.lat, n.lon = e.lon);
		}
		t.get(i).ref++;
	}
	delete(e) {
		let { _annotationsById: t } = this, { id: n } = e, r = t.get(n);
		r.ref--;
	}
	update() {
		let { removed: e, points: t, _annotationsById: n } = this;
		n.forEach((r, i) => {
			r.ref === 0 && (e.add(r.annotation), t.delete(r.annotation), n.delete(i));
		});
	}
	reset() {
		this.added.clear(), this.removed.clear();
	}
}, co = class extends C {
	get isFull() {
		return this._freeList.length === 0 && this._nextIndex >= this._capacity;
	}
	get capacity() {
		return this._capacity;
	}
	get count() {
		return this._slots.size;
	}
	constructor(e = 32, t = 64) {
		super(null), this.generateMipmaps = !1, this.slotSize = 0, this._columns = -1, this._capacity = -1, this._slots = /* @__PURE__ */ new Map(), this._freeList = [], this._nextIndex = 0, this._capacity = 0, this._columns = 0, this._uvs = /* @__PURE__ */ new Map(), this.resize(e, t), this.colorSpace = be;
	}
	keys() {
		return this._slots.keys();
	}
	has(e) {
		return this._slots.has(e);
	}
	get(e) {
		let { _slots: t } = this;
		return t.has(e) ? this._indexToSlot(t.get(e)) : null;
	}
	getSlotSize(e) {
		let { slotSize: t, image: n } = this;
		return e.set(t / n.width, t / n.height);
	}
	getUV(e) {
		let { _slots: t, _uvs: n } = this, r = t.get(e);
		return n.get(r);
	}
	drawChar(e, t, n = {}) {
		let { font: r = "", color: i = "white", strokeStyle: a = null, strokeWidth: o = 1 } = n;
		return this._draw(e, (e, n, s, c, l) => {
			let u = n + c / 2, d = s + l / 2, f = this.measureChar(t), p = u - (f.actualBoundingBoxRight + f.actualBoundingBoxLeft) / 2, m = d + l / 4;
			a !== null && (e.font = r, e.lineJoin = "round", e.lineWidth = o * 2, e.strokeStyle = a, e.strokeText(t, p, m)), e.font = r, e.fillStyle = i, e.fillText(t, p, m);
		});
	}
	measureChar(e, t) {
		let { ctx: n } = this;
		return n.font = t, n.measureText(e);
	}
	drawImage(e, t) {
		return this._draw(e, (e, n, r, i, a) => {
			e.drawImage(t, n, r, i, a);
		});
	}
	drawPath(e, t, n = {}) {
		let { fillStyle: r = null, strokeStyle: i = null, lineWidth: a = 1 } = n;
		return this._draw(e, (e, n, o) => {
			e.save(), e.translate(n, o), r !== null && (e.fillStyle = r, e.fill(t)), i !== null && (e.strokeStyle = i, e.lineWidth = a, e.stroke(t)), e.restore();
		});
	}
	drawSVG(e, t, n = {}) {
		let { fillStyle: r = "white", strokeStyle: i = null, strokeWidth: a = 1, iconScale: o = 1 } = n, s = new DOMParser().parseFromString(t, "image/svg+xml").documentElement, c = (s.getAttribute("viewBox") ?? "0 0 15 15").trim().split(/[\s,]+/), l = parseFloat(c[2]), u = parseFloat(c[3]), d = [...s.querySelectorAll("path")].map((e) => e.getAttribute("d")).filter(Boolean).map((e) => new Path2D(e));
		return this._draw(e, (e, t, n, s, c) => {
			let f = s * o, p = c * o, m = Math.min(f / l, p / u), h = t + (s - l * m) / 2, g = n + (c - u * m) / 2;
			if (e.save(), e.translate(h, g), e.scale(m, m), e.lineJoin = "round", e.lineCap = "round", i !== null) {
				e.lineWidth = a / m, e.strokeStyle = i;
				for (let t of d) e.stroke(t);
			}
			if (r !== null) {
				e.fillStyle = r;
				for (let t of d) e.fill(t);
			}
			e.restore();
		});
	}
	release(e) {
		let { _slots: t, _freeList: n } = this;
		if (!t.has(e)) return;
		let r = t.get(e);
		n.push(r), t.delete(e);
	}
	resize(e, t = this.slotSize) {
		let n = this.image, r = this._columns, i = this.slotSize, a = Math.ceil(Math.sqrt(e)), o = document.createElement("canvas");
		o.width = a * t, o.height = a * t;
		let s = o.getContext("2d");
		for (let e of this._slots.values()) {
			let o = e % r * i, c = Math.floor(e / r) * i, l = e % a * t, u = Math.floor(e / a) * t;
			s.drawImage(n, o, c, i, i, l, u, t, t);
		}
		this.dispose(), this.image = o, this.ctx = s, this.slotSize = t, this._columns = a, this._capacity = e;
		for (let e of this._slots.values()) this._updateUV(e);
		this.needsUpdate = !0;
	}
	clear() {
		this._slots.clear(), this._freeList.length = 0, this._nextIndex = 0, this.ctx.clearRect(0, 0, this.image.width, this.image.height), this.needsUpdate = !0;
	}
	_draw(e, t) {
		let { ctx: n, _freeList: r, _capacity: i, _slots: a } = this, o;
		if (a.has(e)) o = a.get(e);
		else {
			if (r.length > 0) o = r.pop();
			else if (this._nextIndex < i) o = this._nextIndex++;
			else throw Error("MVTGlyphAtlasTexture: atlas is full. Call resize() to increase capacity.");
			a.set(e, o);
		}
		let s = this._indexToSlot(o);
		return n.save(), n.beginPath(), n.rect(s.x, s.y, s.w, s.h), n.clip(), n.clearRect(s.x, s.y, s.w, s.h), t(n, s.x, s.y, s.w, s.h), n.restore(), this._updateUV(o), this.needsUpdate = !0, s;
	}
	_indexToSlot(e) {
		let { _columns: t, slotSize: n } = this;
		return {
			x: e % t * n,
			y: Math.floor(e / t) * n,
			w: n,
			h: n
		};
	}
	_updateUV(e) {
		let { slotSize: t, image: n, _uvs: r } = this, { width: i, height: a } = n, o = this._indexToSlot(e);
		r.set(e, {
			x: o.x / i,
			y: (a - o.y) / a,
			w: t / i,
			h: t / a
		});
	}
}, lo = /* @__PURE__ */ new I(), uo = class extends me {
	get glyphAtlas() {
		return this._glyphAtlas;
	}
	set glyphAtlas(e) {
		this._glyphAtlas = e, e !== null && e.getSlotSize(this._glyphCellSize), this._uniforms && (this._uniforms.glyphAtlas.value = e);
	}
	get glyphCellSize() {
		return this._glyphCellSize;
	}
	constructor(e = {}) {
		let { size: t = 25, sizeAttenuation: n = !1, ...r } = e;
		super({
			size: t,
			sizeAttenuation: n,
			...r
		}), this.transparent = !0, this.depthTest = !1, this.depthWrite = !1, this.resolution = new P(), this._glyphCellSize = new P(), this._glyphAtlas = new co(), this._uniforms = null, this.onBeforeCompile = (e) => {
			e.uniforms.glyphAtlas = { value: this._glyphAtlas }, e.uniforms.glyphCellSize = { value: this._glyphCellSize }, this._uniforms = e.uniforms, e.vertexShader = e.vertexShader.replace("#include <color_pars_vertex>", "\n					#include <color_pars_vertex>\n					attribute vec2 glyphUV;\n					attribute float alpha;\n					attribute float angle;\n					varying vec2 vGlyphUV;\n					varying float vAlpha;\n					varying float vAngle;\n				"), e.vertexShader = e.vertexShader.replace("#include <color_vertex>", "\n					#include <color_vertex>\n					vGlyphUV = glyphUV;\n					vAlpha = alpha;\n					vAngle = angle;\n				"), e.fragmentShader = "\n\n					uniform sampler2D glyphAtlas;\n					uniform vec2 glyphCellSize;\n					uniform float opacity;\n					varying vec2 vGlyphUV;\n					varying float vAlpha;\n					varying float vAngle;\n\n					void main() {\n\n						vec4 diffuseColor = vec4( 0.0 );\n						if ( vGlyphUV.x >= 0.0 ) {\n\n							// rotate the point-sprite lookup around its center so the glyph follows\n							// the path direction; clamp keeps the rotated corners inside the slot\n							vec2 pc = gl_PointCoord - 0.5;\n							float c = cos( vAngle );\n							float s = sin( vAngle );\n							pc = vec2( c * pc.x + s * pc.y, - s * pc.x + c * pc.y ) + 0.5;\n							pc = clamp( pc, 0.0, 1.0 );\n\n							vec4 glyph = texture2D( glyphAtlas, vGlyphUV + pc * glyphCellSize * vec2( 1.0, - 1.0 ) );\n							diffuseColor = glyph;\n\n						}\n\n						diffuseColor.a *= vAlpha * opacity;\n						gl_FragColor = diffuseColor;\n\n						#include <tonemapping_fragment>\n						#include <colorspace_fragment>\n						#include <premultiplied_alpha_fragment>\n\n\n					}\n\n\n			";
		};
	}
	onBeforeRender(e) {
		this._glyphAtlas.getSlotSize(this._glyphCellSize), e.getViewport(lo), this.resolution.set(lo.z, lo.w);
	}
}, fo = /* @__PURE__ */ new M(), $ = /* @__PURE__ */ new I(), po = /* @__PURE__ */ new I(), mo = /* @__PURE__ */ new P(), ho = /* @__PURE__ */ new P(), go = /* @__PURE__ */ new F(), _o = /* @__PURE__ */ Object.freeze({
	OBSCURED: 0,
	DRAW_THROUGH: 1,
	OVERLAY: 2
}), vo = class extends A {
	static get DrawMode() {
		return _o;
	}
	get size() {
		return this._opaque.material.size;
	}
	set size(e) {
		this._opaque.material.size = e, this._drawThrough.material.size = e;
	}
	get glyphAtlas() {
		return this._opaque.material.glyphAtlas;
	}
	get drawMode() {
		return this._drawMode;
	}
	set drawMode(e) {
		this._drawMode = e, this._applyDrawMode();
	}
	get geometry() {
		return this._opaque.geometry;
	}
	constructor(e) {
		super(), this.frustumCulled = !1, this.fadeInDuration = .3, this.fadeOutDuration = .3, this.drawThroughOpacity = .5, this._entryMap = /* @__PURE__ */ new Map(), this._orderedEntries = [], this._lastUpdateTime = -1, this._lastCamera = null;
		let t = new S(), n = new pe(t, new uo());
		n.frustumCulled = !1, n.renderOrder = 1e3, n.onAfterRender = (e, t, n) => {
			this._lastCamera = n;
		};
		let r = new pe(t, new uo());
		r.frustumCulled = !1, r.material.glyphAtlas = n.material.glyphAtlas, r.renderOrder = 1001, r.onAfterRender = (e, t, n) => {
			this._lastCamera = n;
		}, this.add(r, n), this._opaque = n, this._drawThrough = r, this.drawMode = _o.OVERLAY;
	}
	dispose() {
		this.glyphAtlas.dispose(), this.geometry.dispose(), this._opaque.material.dispose(), this._drawThrough.material.dispose();
	}
	update(e, t) {
		let n = performance.now() / 1e3, r = this._lastUpdateTime < 0 ? 0 : Math.min(n - this._lastUpdateTime, .1);
		this._lastUpdateTime = n;
		let { _entryMap: i, _orderedEntries: a, fadeInDuration: o, fadeOutDuration: s } = this;
		for (let t of e) {
			let e = i.get(t.id);
			if (e) e.item = t, e.state === "out" && (e.state = "in");
			else {
				let e = {
					item: t,
					fade: 0,
					state: "in"
				};
				i.set(t.id, e), a.push(e);
			}
		}
		for (let e of t) {
			let t = i.get(e.id);
			t && t.state !== "out" && (t.state = "out");
		}
		let c = !1;
		for (let [e, t] of i) t.state === "in" ? (t.fade = Math.min(1, t.fade + r / o), t.fade >= 1 && (t.state = "visible")) : t.state === "out" && (t.fade = Math.max(0, t.fade - r / s), t.fade <= 0 && (i.delete(e), c = !0));
		c && (this._orderedEntries = a.filter((e) => i.has(e.item.id))), this._recenter(), this._updateGeometry();
	}
	raycast(e, t) {
		let n = e.camera;
		if (!n) return;
		let { geometry: r, matrixWorld: i } = this, { material: a } = this._opaque, { resolution: o } = a, s = r.getAttribute("position");
		if (!s || s.count === 0) return;
		let c = a.size / 2, l = -n.near;
		e.ray.at(1, po), po.w = 1, po.applyMatrix4(n.matrixWorldInverse), po.applyMatrix4(n.projectionMatrix), po.multiplyScalar(1 / po.w), mo.set(po.x * o.x / 2, po.y * o.y / 2), fo.multiplyMatrices(n.matrixWorldInverse, i);
		for (let a = 0, u = r.drawRange.count; a < u; a++) {
			if ($.fromBufferAttribute(s, a), $.w = 1, $.applyMatrix4(fo), $.z > l || ($.applyMatrix4(n.projectionMatrix), $.multiplyScalar(1 / $.w), $.z < -1 || $.z > 1) || (ho.set($.x * o.x / 2, $.y * o.y / 2), mo.distanceTo(ho) > c)) continue;
			go.fromBufferAttribute(s, a).applyMatrix4(i);
			let r = this._orderedEntries[a];
			t.push({
				distance: e.ray.origin.distanceTo(go),
				point: go.clone(),
				index: a,
				face: null,
				faceIndex: null,
				object: this,
				layer: r?.item.layer ?? null,
				properties: r?.item.properties ?? null
			});
		}
		return !1;
	}
	_applyDrawMode() {
		let { _opaque: e, _drawThrough: t, drawThroughOpacity: n, _drawMode: r } = this;
		switch (r) {
			case _o.OVERLAY:
				e.visible = !0, e.material.depthTest = !1, t.visible = !1;
				break;
			case _o.DRAW_THROUGH:
				e.visible = !0, e.material.depthTest = !0, t.visible = !0, t.material.opacity = n, t.material.depthFunc = ne;
				break;
			case _o.OBSCURED:
			default:
				e.visible = !0, e.material.depthTest = !0, t.visible = !1;
				break;
		}
	}
	_recenter() {
		let { parent: e, _lastCamera: t } = this;
		t || (this.position.set(0, 0, 0), this.updateMatrixWorld(!0)), e ? fo.copy(e.matrixWorld).invert() : fo.identity(), this.position.setFromMatrixPosition(t.matrixWorld).applyMatrix4(fo), this.updateMatrixWorld(!0);
	}
	_updateGeometry() {}
	_resizeGeometry(e) {
		let { geometry: t } = this, n = t.getAttribute("position");
		(!n || n.count < e) && (t.dispose(), t.setAttribute("position", new x(new Float32Array(e * 3), 3)), t.setAttribute("glyphUV", new x(new Float32Array(e * 2), 2)), t.setAttribute("alpha", new x(new Float32Array(e), 1)), t.setAttribute("angle", new x(new Float32Array(e), 1))), t.setDrawRange(0, e);
	}
	_writeGlyph(e, t, n, r, i = 0) {
		let { geometry: a, glyphAtlas: o } = this, s = this.position, { position: c, glyphUV: l, alpha: u, angle: d } = a.attributes;
		if (c.setXYZ(e, t.x - s.x, t.y - s.y, t.z - s.z), n !== null && o.has(n)) {
			let t = o.getUV(n);
			l.setXY(e, t.x, t.y);
		} else l.setXY(e, -1, -1);
		u.setX(e, r), d.setX(e, i);
	}
	_markNeedsUpdate() {
		let { geometry: e } = this;
		e.getAttribute("position").needsUpdate = !0, e.getAttribute("glyphUV").needsUpdate = !0, e.getAttribute("alpha").needsUpdate = !0, e.getAttribute("angle").needsUpdate = !0;
	}
}, yo = class extends vo {
	constructor(e = {}) {
		let { getKind: t = () => null, fallback: n = null, size: r = 18, glyphSize: i = 18 * window.devicePixelRatio, slotCount: a = 64 } = e;
		super(), this.getKind = t, this.fallback = n, this.size = r, this.glyphAtlas.resize(a, i);
	}
	_updateGeometry() {
		let { _orderedEntries: e, getKind: t, glyphAtlas: n, fallback: r } = this, i = e.length;
		this._resizeGeometry(i);
		for (let a = 0; a < i; a++) {
			let { item: i, fade: o } = e[a], s = t(i.layer, i.properties);
			(s === null || !n.has(s)) && (s = r), this._writeGlyph(a, i.position, s, o);
		}
		this._markNeedsUpdate();
	}
}, bo = /* @__PURE__ */ new Set(), xo = class extends vo {
	constructor(e = {}) {
		let { size: t = 16, glyphSize: n = 16 * window.devicePixelRatio, slotCount: r = 64, font: i = null, fontFamily: a = "sans-serif", strokeStyle: o = "black", strokeWidth: s = 0 } = e;
		super();
		let c = Math.round(n * .7);
		this._font = i ?? `400 ${c}px ${a}`, this._advanceCache = /* @__PURE__ */ new Map(), this._strokeStyle = o, this._strokeWidth = s, this.glyphAtlas.resize(r, n), this.size = t;
	}
	reset() {
		this._advanceCache.clear(), this.glyphAtlas.clear();
	}
	measureChar(e) {
		let { _advanceCache: t, glyphAtlas: n, _font: r } = this;
		if (!t.has(e)) {
			let i = this.size / n.slotSize, a = n.measureChar(e, r).width + 2;
			t.set(e, a * i);
		}
		return t.get(e);
	}
	_drawChar(e, t) {
		let { glyphAtlas: n } = this;
		if (n.capacity === n.count) {
			let e = null;
			for (let r of n.keys()) if (!t.has(r)) {
				e = r;
				break;
			}
			e === null ? n.resize(n.capacity * 2) : n.release(e);
		}
		n.drawChar(e, e, {
			font: this._font,
			color: "white",
			strokeStyle: this._strokeStyle,
			strokeWidth: this._strokeWidth
		});
	}
	_updateGeometry() {
		let { _orderedEntries: e, glyphAtlas: t } = this;
		bo.clear();
		let n = 0;
		for (let t of e) {
			let { text: e, characterPositions: r } = t.item;
			n += r.length;
			for (let t = 0, n = e.length; t < n; t++) bo.add(e[t]);
		}
		for (let e of bo) t.has(e) || this._drawChar(e, bo);
		this._resizeGeometry(n);
		let r = 0;
		for (let t of e) {
			let e = t.item, { fade: n } = t, i = e.characterPositions, a = e.characterAngles, o = e.text;
			for (let e = 0, t = i.length; e < t; e++) this._writeGlyph(r++, i[e], o[e], n, a[e]);
		}
		this._markNeedsUpdate(), bo.clear();
	}
}, So = /* @__PURE__ */ new M();
function Co(e) {
	let t = [];
	return e.traverse((e) => {
		e.isMesh && t.push(e);
	}), t;
}
var wo = class {
	set needsUpdate(e) {
		e && this.version++;
	}
	constructor() {
		this.group = new A(), this.performSettleRaycast = null, this.version = 0;
	}
	filterAnnotation(e, t, n) {
		return !1;
	}
	sortAnnotations(e, t) {
		return (e.properties.rank ?? 1e10) - (t.properties.rank ?? 1e10);
	}
	measureChar(e, t, n) {
		return 1;
	}
	getText(e) {
		return e.name ?? "";
	}
	isAnnotationEnabled(e, t) {
		return !0;
	}
	onPointsUpdate(e, t) {}
	onLabelsUpdate(e, t) {}
	dispose() {}
};
function To(e) {
	let t = [], n = [];
	for (let r of e) r instanceof Ga ? n.push(r) : t.push(r);
	return {
		points: t,
		labels: n
	};
}
var Eo = class extends wo {
	constructor() {
		super();
		let e = window.devicePixelRatio, t = new yo({ fallback: "default" });
		t.glyphAtlas.drawChar("default", "●", {
			fillStyle: "white",
			strokeStyle: "black",
			strokeWidth: 3 * e,
			font: "30px sans-serif"
		});
		let n = new xo({
			fontFamily: "Arial",
			strokeStyle: "black",
			strokeWidth: 3 * e
		});
		this.group.add(t, n), this.icons = t, this.labels = n;
	}
	filterAnnotation(e, t, n) {
		return !0;
	}
	measureChar(e, t, n) {
		return this.labels.measureChar(e);
	}
	onPointsUpdate(e, t) {
		this.icons.update(e, t);
	}
	onLabelsUpdate(e, t) {
		this.labels.update(e, t);
	}
	dispose() {
		this.icons.dispose(), this.labels.dispose();
	}
}, Do = class {
	get contentCache() {
		return this.overlay.imageSource._contentCache;
	}
	constructor(e = {}) {
		this.priority = Infinity, this.name = "MVT_ANNOTATIONS_PLUGIN";
		let { overlay: t, camera: n = null, driver: r = new Eo(), resolution: i = 50 } = e;
		this.overlay = t, this.camera = n, this.driver = r, this.resolution = i, this._measureChar = (e) => this.driver.measureChar(e), this._filterAnnotation = (e, t, n) => this.driver.filterAnnotation(e, t, n), this._driverVersion = -1, this.hierarchy = new ha(), this.occupancy = new ya(), this.anchorManager = new Ka(), this.pointManager = new so(), this.settlingManager = new Aa(), this.tileLoadState = /* @__PURE__ */ new Map(), this.vectorTileInfo = /* @__PURE__ */ new Map(), this.debug = {
			occupancy: new qa(this.occupancy),
			paths: new eo(this.anchorManager),
			hierarchy: new oo()
		};
	}
	async init(e) {
		this.tiles = e, e.group.add(this.driver.group), this.driver.group.updateMatrixWorld();
		let { overlay: t, occupancy: n, debug: r, hierarchy: i, settlingManager: a, contentCache: o, pointManager: s, anchorManager: c } = this;
		r.paths.group = e.group, r.hierarchy.hierarchy = i, r.hierarchy.tiles = e, r.hierarchy.tiling = t.tiling, a.occupancy = n, a.tiles = e, i.contentCache = o, t.init(), t.isReady || await t.whenReady(), n.sortCallback = (e, t) => {
			let r = n.visible.has(e);
			if (r !== n.visible.has(t)) return r ? -1 : 1;
			let i = this.driver.sortAnnotations(e, t);
			if (i !== 0) return i;
			if (e.lodLevel !== t.lodLevel) return t.lodLevel - e.lodLevel;
			let a = e.visibleDuration < 5e3 || t.visibleDuration < 5e3;
			return r && a && e.visibleTime !== t.visibleTime ? e.visibleTime < t.visibleTime ? -1 : 1 : t.screenPos.y === e.screenPos.y ? e.id > t.id ? 1 : -1 : t.screenPos.y - e.screenPos.y;
		}, this._onVisibilityChange = ({ scene: e, tile: t, visible: n }) => {
			a.needsUpdate = !0, this._markVectorTile(t, n);
		}, this._onUpdateAfter = () => {
			let { driver: t, camera: o, _measureChar: l } = this, u = t.version !== this._driverVersion;
			if (this._driverVersion = t.version, u) {
				for (let e of s.points) e.enabled = t.isAnnotationEnabled(e.layer, e.properties, 1);
				for (let e of c.lines) e.enabled = t.isAnnotationEnabled(e.layer, e.properties, 2), e.text = t.getText(e.properties), e.updateCharacterWidthCache(l);
				a.needsUpdate = !0, n.needsUpdate = !0;
			}
			o !== null && (e.getResolution(o, n.resolution), n.matrix.copy(e.group.matrixWorld)), i.update(), s.update(), s.added.forEach((e) => {
				n.register(e), a.register(e);
			}), s.removed.forEach((e) => {
				n.unregister(e), a.unregister(e);
			}), s.reset(), c.update(), c.added.forEach((e) => {
				n.register(e);
			}), c.removed.forEach((e) => {
				n.unregister(e);
			}), c.reset(), n.needsUpdate = n.needsUpdate || a.hasPendingWork, a.camera = o, a.performSettleRaycast = t.performSettleRaycast, a.update(), n.camera = o, n.update(), u && (n.flush(), n.finishAnimations());
			let d = To(n.added), f = To(n.removed);
			this.driver.onPointsUpdate(d.points, f.points), this.driver.onLabelsUpdate(d.labels, f.labels), (n.added.size > 0 || n.removed.size > 0) && e.dispatchEvent({ type: "needs-render" }), n.reset(), (n.hasPendingWork || a.hasPendingWork) && (e.dispatchEvent({ type: "needs-update" }), requestIdleCallback((e) => {
				a.update(e.timeRemaining() * .9), n.update(e.timeRemaining() * .9);
			})), r.paths.camera = this.camera, r.occupancy.update(), r.paths.update(), r.hierarchy.update();
		}, this._onVectorTileToggle = ({ x: n, y: r, level: i, visible: a }) => {
			e.dispatchEvent({ type: "needs-update" });
			let { contentCache: o, driver: s, vectorTileInfo: c, settlingManager: l, anchorManager: u, pointManager: d, _filterAnnotation: f, _measureChar: p } = this, m = `${n}_${r}_${i}`;
			if (a) {
				let { tiling: a } = t, h = o.get(n, r, i);
				if (!h) {
					c.set(m, { annotations: [] });
					return;
				}
				let g = [];
				io(h, n, r, i, a, f, g), Ca(h, n, r, i, a, e.ellipsoid, f, g), c.set(m, { annotations: g });
				for (let e of g) e instanceof xa ? (l.register(e), e.enabled = s.isAnnotationEnabled(e.layer, e.properties, 2), e.text = s.getText(e.properties), e.updateCharacterWidthCache(p)) : (d.add(e), e.enabled = s.isAnnotationEnabled(e.layer, e.properties, 1));
				u.addLines(g.filter((e) => e instanceof xa));
			} else {
				let { annotations: e } = c.get(m);
				c.delete(m);
				for (let t of e) t instanceof xa ? l.unregister(t) : d.delete(t);
				u.deleteLines(e.filter((e) => e instanceof xa));
			}
		}, this._onDisposeModel = ({ tile: e }) => {
			this.tileLoadState.delete(e);
		}, i.addEventListener("toggle", this._onVectorTileToggle), e.addEventListener("update-after", this._onUpdateAfter), e.addEventListener("tile-visibility-change", this._onVisibilityChange), e.addEventListener("dispose-model", this._onDisposeModel), e.forEachLoadedModel((t, n) => {
			this.processTileModel(t, n), e.visibleTiles.has(n) && this._markVectorTile(n, !0);
		});
	}
	dispose() {
		let { debug: e, tiles: t, hierarchy: n, tileLoadState: r } = this;
		e.occupancy.dispose(), e.paths.dispose(), t.group.remove(this.driver.group), this.driver.dispose(), n.removeEventListener("toggle", this._onVectorTileToggle), t.removeEventListener("update-after", this._onUpdateAfter), t.removeEventListener("tile-visibility-change", this._onVisibilityChange), t.removeEventListener("dispose-model", this._onDisposeModel), r.forEach((e, n) => {
			t.visibleTiles.has(n) && this._markVectorTile(n, !1);
		});
	}
	processTileModel(e, t) {
		let { tiles: n, overlay: r } = this;
		So.identity(), e.parent !== null && So.copy(n.group.matrixWorldInverse), e.updateMatrixWorld();
		let { range: i } = ot(Co(e), n.ellipsoid, So, r.projection);
		this.tileLoadState.set(t, i);
	}
	_markVectorTile(e, t) {
		let n = this.tileLoadState.get(e);
		this._forEachTileInBounds(n, (e, n, r) => {
			this.hierarchy.setTargetState(e, n, r, t);
		});
	}
	_forEachTileInBounds(e, t) {
		let { overlay: n, resolution: r } = this, { tiling: i } = n, a = n.calculateLevel(e, r);
		if (!n.isReady) throw Error("MVTAnnotationsPlugin: overlay is not ready.");
		R(e, a, i, t);
	}
}, Oo = null;
function ko() {
	return Oo ??= Promise.all([import("@mapbox/vector-tile"), import("pbf")]).then(([{ VectorTile: e }, { default: t }]) => ({
		VectorTile: e,
		Protobuf: t
	}));
}
var Ao = {
	earth: {
		fill: "#e2dfda",
		order: 0
	},
	water: {
		fill: "#80deea",
		order: 1
	},
	landcover: {
		fill: "#c4e7d2",
		order: 2
	},
	landuse: {
		fill: "#cfddd5",
		order: 3
	},
	natural: {
		fill: "#e2e0d7",
		order: 4
	},
	buildings: {
		fill: "#cccccc",
		order: 5
	},
	roads: {
		stroke: "#ebebeb",
		order: 6
	},
	transit: {
		stroke: "#a7b1b3",
		order: 7
	},
	boundaries: {
		stroke: "#adadad",
		order: 8
	},
	places: {
		fill: "#5c5c5c",
		order: 9
	},
	pois: {
		fill: "#1a8cbd",
		radius: 3,
		order: 10
	}
}, jo = (e, t) => Ao[e] ?? null, Mo = class extends et {
	constructor(e = {}) {
		super();
		let { url: t = null, levels: n = 20, projection: r = "EPSG:3857" } = e;
		this.url = t, this.levels = n, this.projectionId = r, this.tiling = new ze(), this.fetchData = (...e) => fetch(...e), this.fetchOptions = {};
	}
	init() {
		let { tiling: e, levels: t, url: n, projectionId: r } = this;
		return e.flipY = !/{\s*reverseY|-\s*y\s*}/g.test(n), e.setProjection(new L(r)), e.setContentBounds(...e.projection.getBounds()), Array.isArray(t) ? t.forEach((t, n) => {
			t !== null && e.setLevel(n, {
				tilePixelWidth: 512,
				tilePixelHeight: 512,
				...t
			});
		}) : e.generateLevels(t, e.projection.tileCountX, e.projection.tileCountY, {
			tilePixelWidth: 512,
			tilePixelHeight: 512
		}), Promise.resolve();
	}
	async fetchItem([e, t, n], r) {
		let i = this.getUrl(e, t, n), a = await (await this.fetchData(i, {
			...this.fetchOptions,
			signal: r
		})).arrayBuffer();
		return this._parseVectorTile(a);
	}
	async _parseVectorTile(e) {
		if (!e || e.byteLength === 0) return null;
		let { VectorTile: t, Protobuf: n } = await ko();
		return new t(new n(e));
	}
	disposeItem() {}
	getUrl(e, t, n) {
		return this.url.replace(/{\s*z\s*}/gi, n).replace(/{\s*x\s*}/gi, e).replace(/{\s*(y|reverseY|-\s*y)\s*}/gi, t);
	}
}, No = class extends wt {
	get tiling() {
		return this._contentCache.tiling;
	}
	get fetchData() {
		return this._contentCache.fetchData;
	}
	set fetchData(e) {
		this._contentCache.fetchData = e;
	}
	get fetchOptions() {
		return this._contentCache.fetchOptions;
	}
	set fetchOptions(e) {
		this._contentCache.fetchOptions = e;
	}
	constructor(e = {}) {
		let { resolution: t = 512, getStyle: n = null, contentCache: r, ...i } = e;
		super(), this.resolution = t, this.getStyle = n, this._canvasRenderer = new Dt({ tileExtent: 4096 }), this._contentCache = r ?? new Mo(i);
	}
	init() {
		return this._contentCache.init();
	}
	hasContent(e, t, n, r, i) {
		let a = 0;
		return R([
			e,
			t,
			n,
			r
		], i, this._contentCache.tiling, () => a++), a > 0;
	}
	async fetchItem([e, t, n, r, i], a) {
		let { resolution: o, _contentCache: s } = this, c = document.createElement("canvas");
		c.width = o, c.height = o;
		let l = [
			e,
			t,
			n,
			r
		], u = [];
		R(l, i, s.tiling, (e, t, n) => {
			u.push(s.lock(e, t, n));
		}), await Promise.all(u), a?.throwIfAborted(), this._drawToCanvas(c, l, i);
		let d = new C(c);
		return d.colorSpace = be, d.generateMipmaps = !1, d.needsUpdate = !0, d;
	}
	disposeItem(e, [t, n, r, i, a]) {
		R([
			t,
			n,
			r,
			i
		], a, this._contentCache.tiling, (e, t, n) => {
			this._contentCache.release(e, t, n);
		}), e && e.dispose();
	}
	redraw(...e) {
		let [t, n, r, i, a] = e, o = this.get(t, n, r, i, a);
		o && (this._drawToCanvas(o.image, [
			t,
			n,
			r,
			i
		], a), o.needsUpdate = !0);
	}
	dispose() {
		super.dispose(), this._contentCache.dispose();
	}
	_drawToCanvas(e, t, n) {
		let { _contentCache: r, _canvasRenderer: i } = this, a = e.getContext("2d");
		R(t, n, r.tiling, (e, n, o) => {
			let s = r.tiling.getTileBounds(e, n, o, !0, !1);
			i.setFrame(a, s, t);
			let c = r.get(e, n, o);
			c && this._renderVectorTile(c);
		});
	}
	_renderVectorTile(e) {
		let { _canvasRenderer: t } = this, n = this.getStyle || jo, r = [...Object.keys(e.layers)].sort((e, t) => {
			let r = n(e, null)?.order ?? Dt.DEFAULT_STYLE.order, i = n(t, null)?.order ?? Dt.DEFAULT_STYLE.order;
			return r === i ? e.localeCompare(t) : r - i;
		});
		for (let i of r) {
			let r = e.layers[i];
			for (let e = 0; e < r.length; e++) {
				let a = r.feature(e), { properties: o, type: s } = a, c = n(i, o);
				t.setStyle(c);
				let l = a.loadGeometry();
				s === 1 ? t._renderPoints(l) : s === 2 ? t._renderLines(l) : s === 3 && t._renderPolygons(l);
			}
		}
	}
}, Po = Math.PI / 180, Fo = null;
function Io() {
	return Fo ??= import("pmtiles").then((e) => e.PMTiles);
}
var Lo = class extends tt {
	constructor(e, t) {
		super(), this.instance = e, this.tiling = t;
	}
	async fetchItem([e, t, n], r) {
		let i = await this.instance.getZxy(n, e, t, r);
		return !i || !i.data || i.data.byteLength === 0 ? null : this.processBufferToTexture(i.data);
	}
}, Ro = class extends Mo {
	constructor(e = {}) {
		super(e), this.instance = null, this.tileType = 1;
	}
	async init() {
		let { tiling: e } = this, t = await Io();
		this.instance = new t({
			getKey: () => this.url,
			getBytes: async (e, t, n) => {
				n && n.throwIfAborted();
				let { fetchOptions: r, url: i } = this, a = await this.fetchData(i, {
					...r,
					signal: n,
					headers: {
						...r.headers,
						range: `bytes=${e}-${e + t - 1}`
					}
				});
				if (!a.ok) throw Error(`PMTilesImageSource: Bad response code: ${a.status}`);
				if (a.status !== 206) throw Error("PMTilesImageSource: Server does not support HTTP Byte Serving.");
				return {
					data: await a.arrayBuffer(),
					etag: a.headers.get("ETag"),
					cacheControl: a.headers.get("Cache-Control"),
					expires: a.headers.get("Expires")
				};
			}
		});
		let n = await this.instance.getHeader();
		this.tileType = n.tileType;
		let r = new L("EPSG:3857");
		e.flipY = !0, e.setProjection(r), e.setContentBounds(Po * n.minLon, Po * n.minLat, Po * n.maxLon, Po * n.maxLat), e.generateLevels(n.maxZoom + 1, r.tileCountX, r.tileCountY, {
			tilePixelWidth: 512,
			tilePixelHeight: 512,
			minLevel: n.minZoom
		});
	}
	async fetchItem([e, t, n], r) {
		let i = await this.instance.getZxy(n, e, t, r);
		return this._parseVectorTile(i ? i.data : null);
	}
}, zo = class extends wt {
	get tiling() {
		return this._contentCache.tiling;
	}
	get fetchData() {
		return this._contentCache.fetchData;
	}
	set fetchData(e) {
		this._contentCache.fetchData = e;
	}
	get resolution() {
		return this._resolution;
	}
	set resolution(e) {
		this._resolution = e, this._deferredSource && (this._deferredSource.resolution = e);
	}
	get fetchOptions() {
		return this._contentCache.fetchOptions;
	}
	set fetchOptions(e) {
		this._contentCache.fetchOptions = e;
	}
	constructor(e = {}) {
		super();
		let { resolution: t = 512, getStyle: n = null } = e;
		this._resolution = t, this._getStyle = n, this._contentCache = new Ro(e), this._deferredSource = null, this.isVectorTile = !1;
	}
	async init() {
		await this._contentCache.init();
		let { _contentCache: e } = this;
		if (this.isVectorTile = e.tileType === 1, this.isVectorTile) this._deferredSource = new No({
			resolution: this._resolution,
			getStyle: this._getStyle,
			contentCache: e
		});
		else {
			let t = new Lo(e.instance, e.tiling);
			this._deferredSource = new Tt(t), this._deferredSource.resolution = this._resolution;
		}
	}
	hasContent(e, t, n, r, i) {
		return this._deferredSource.hasContent(e, t, n, r, i);
	}
	lock(...e) {
		return this._deferredSource.lock(...e);
	}
	release(...e) {
		this._deferredSource.release(...e);
	}
	get(...e) {
		return this._deferredSource.get(...e);
	}
	redraw(...e) {
		this._deferredSource instanceof No && this._deferredSource.redraw(...e);
	}
	forEachItem(...e) {
		return this._deferredSource.forEachItem(...e);
	}
	dispose() {
		super.dispose(), this._contentCache.dispose(), this._deferredSource && this._deferredSource.dispose();
	}
}, Bo = class extends Gt {
	get tiling() {
		return this.imageSource.tiling;
	}
	get projection() {
		return this.tiling.projection;
	}
	get aspectRatio() {
		return this.tiling && this.isReady ? this.tiling.aspectRatio : 1;
	}
	get fetchOptions() {
		return this.imageSource.fetchOptions;
	}
	set fetchOptions(e) {
		this.imageSource.fetchOptions = e;
	}
	get resolution() {
		return this.imageSource.resolution;
	}
	constructor(e = {}) {
		super(e), this.imageSource = e.imageSource ?? new No(e), this._redrawQueue = new i(), this._redrawQueue.maxJobs = 4, this._redrawQueue.priorityCallback = () => 0;
	}
	_init() {
		return this.imageSource.fetchData = (...e) => this.fetch(...e), this.imageSource.init();
	}
	calculateLevel(e, t = this.resolution) {
		let [n, r, i, a] = e, o = i - n, s = a - r, c = this.tiling.maxLevel, l = 0;
		for (; l < c; l++) {
			let e = this.tiling.getLevel(l);
			if (e == null) continue;
			let { pixelWidth: n, pixelHeight: r } = e;
			if (n >= t / o || r >= t / s) break;
		}
		return l;
	}
	hasContent(e, t = this.calculateLevel(e)) {
		return this.imageSource.hasContent(...e, t);
	}
	getTexture(e, t = this.calculateLevel(e)) {
		return this.imageSource.get(...e, t);
	}
	lockTexture(e, t = this.calculateLevel(e)) {
		return this.imageSource.lock(...e, t);
	}
	releaseTexture(e, t = this.calculateLevel(e)) {
		this.imageSource.release(...e, t);
	}
	setResolution(e) {
		this.imageSource.resolution = e;
	}
	shouldSplit(e) {
		return !0;
	}
	setRegionVisible(e, t) {
		if (super.setRegionVisible(e, t), t) {
			let { _redrawQueue: t } = this, n = e.join("_") + "_" + this.calculateLevel(e);
			t.has(n) && t.flush(n);
		}
	}
	redraw() {
		let { imageSource: e, _redrawQueue: t, _visibleRegionCounts: n } = this;
		for (let { range: t } of n.values()) e.redraw(...t, this.calculateLevel(t));
		e.forEachItem((r, i) => {
			let a = i.join("_");
			!n.has(a) && !t.has(a) && t.add(a, () => {
				e.redraw(...i);
			});
		});
	}
}, Vo = class extends Bo {
	constructor(e = {}) {
		super({
			...e,
			imageSource: new zo(e)
		});
	}
	shouldSplit(e) {
		return this.imageSource.isVectorTile ? !0 : this.tiling.maxLevel > this.calculateLevel(e);
	}
}, Ho = e * Math.PI * 2, Uo = /* @__PURE__ */ new L("EPSG:3857");
function Wo(e) {
	return /:4326$/i.test(e);
}
function Go(e) {
	return /:3857$/i.test(e);
}
function Ko(e) {
	return e.trim().split(/\s+/).map((e) => parseFloat(e));
}
function qo(e, t) {
	Wo(t) && ([e[1], e[0]] = [e[0], e[1]]);
}
function Jo(e, t) {
	if (Go(t)) return e[0] = Uo.convertNormalizedToLongitude(.5 + e[0] / Ho), e[1] = Uo.convertNormalizedToLatitude(.5 + e[1] / Ho), e[0] *= j.RAD2DEG, e[1] *= j.RAD2DEG, e;
}
function Yo(e) {
	e[0] *= j.DEG2RAD, e[1] *= j.DEG2RAD;
}
var Xo = class extends r {
	parse(e) {
		let t = new TextDecoder("utf-8").decode(new Uint8Array(e)), n = new DOMParser().parseFromString(t, "text/xml"), r = n.querySelector("Contents"), i = as(r, "TileMatrixSet").map((e) => rs(e)), a = as(r, "Layer").map((e) => Qo(e)), o = Zo(n.querySelector("ServiceIdentification"));
		return a.forEach((e) => {
			e.tileMatrixSets = e.tileMatrixSetLinks.map((e) => i.find((t) => t.identifier === e));
		}), {
			serviceIdentification: o,
			tileMatrixSets: i,
			layers: a
		};
	}
};
function Zo(e) {
	return {
		title: e.querySelector("Title").textContent,
		abstract: e.querySelector("Abstract")?.textContent || "",
		serviceType: e.querySelector("ServiceType").textContent,
		serviceTypeVersion: e.querySelector("ServiceTypeVersion").textContent
	};
}
function Qo(e) {
	let t = e.querySelector("Title").textContent, n = e.querySelector("Identifier").textContent, r = e.querySelector("Format").textContent, i = as(e, "ResourceURL").map((e) => $o(e)), a = as(e, "TileMatrixSetLink").map((e) => as(e, "TileMatrixSet")[0].textContent), o = as(e, "Style").map((e) => ns(e)), s = as(e, "Dimension").map((e) => es(e)), c = ts(e.querySelector("WGS84BoundingBox"));
	return c ||= ts(e.querySelector("BoundingBox")), {
		title: t,
		identifier: n,
		format: r,
		dimensions: s,
		tileMatrixSetLinks: a,
		styles: o,
		boundingBox: c,
		resourceUrls: i
	};
}
function $o(e) {
	return {
		template: e.getAttribute("template"),
		format: e.getAttribute("format"),
		resourceType: e.getAttribute("resourceType")
	};
}
function es(e) {
	return {
		identifier: e.querySelector("Identifier").textContent,
		uom: e.querySelector("UOM")?.textContent || "",
		defaultValue: e.querySelector("Default").textContent,
		current: e.querySelector("Current")?.textContent === "true",
		values: as(e, "Value").map((e) => e.textContent)
	};
}
function ts(e) {
	if (!e) return null;
	let t = e.nodeName.endsWith("WGS84BoundingBox") ? "urn:ogc:def:crs:CRS::84" : e.getAttribute("crs"), n = Ko(e.querySelector("LowerCorner").textContent), r = Ko(e.querySelector("UpperCorner").textContent);
	return qo(n, t), qo(r, t), Jo(n, t), Jo(r, t), Yo(n), Yo(r), {
		crs: t,
		lowerCorner: n,
		upperCorner: r,
		bounds: [...n, ...r]
	};
}
function ns(e) {
	return {
		title: e.querySelector("Title")?.textContent || null,
		identifier: e.querySelector("Identifier").textContent,
		isDefault: e.getAttribute("isDefault") === "true"
	};
}
function rs(e) {
	let t = e.querySelector("SupportedCRS").textContent, n = e.querySelector("Title")?.textContent || "", r = e.querySelector("Identifier").textContent, i = e.querySelector("Abstract")?.textContent || "", a = [];
	return e.querySelectorAll("TileMatrix").forEach((e, n) => {
		let r = is(e), i = 28e-5 * r.scaleDenominator, o = r.tileWidth * r.matrixWidth * i, s = r.tileHeight * r.matrixHeight * i, c;
		qo(r.topLeftCorner, t), c = Go(t) ? [r.topLeftCorner[0] + o, r.topLeftCorner[1] - s] : [r.topLeftCorner[0] + 360 * o / Ho, r.topLeftCorner[1] - 360 * s / Ho], Jo(c, t), Jo(r.topLeftCorner, t), Yo(c), Yo(r.topLeftCorner), r.bounds = [...r.topLeftCorner, ...c], [r.bounds[1], r.bounds[3]] = [r.bounds[3], r.bounds[1]], a.push(r);
	}), {
		title: n,
		identifier: r,
		abstract: i,
		supportedCRS: t,
		tileMatrices: a
	};
}
function is(e) {
	return {
		identifier: e.querySelector("Identifier").textContent,
		tileWidth: parseFloat(e.querySelector("TileWidth").textContent),
		tileHeight: parseFloat(e.querySelector("TileHeight").textContent),
		matrixWidth: parseFloat(e.querySelector("MatrixWidth").textContent),
		matrixHeight: parseFloat(e.querySelector("MatrixHeight").textContent),
		scaleDenominator: parseFloat(e.querySelector("ScaleDenominator").textContent),
		topLeftCorner: Ko(e.querySelector("TopLeftCorner").textContent),
		bounds: null
	};
}
function as(e, t) {
	return [...e.children].filter((e) => e.tagName === t);
}
//#endregion
//#region src/three/plugins/loaders/WMSCapabilitiesLoader.js
var os = e * Math.PI * 2, ss = /* @__PURE__ */ new L("EPSG:3857");
function cs(e) {
	return /:4326$/i.test(e);
}
function ls(e) {
	return /:3857$/i.test(e);
}
function us(e, t) {
	return ls(t) && (e[0] = ss.convertNormalizedToLongitude(.5 + e[0] / (Math.PI * 2 * os)), e[1] = ss.convertNormalizedToLatitude(.5 + e[1] / (Math.PI * 2 * os)), e[0] *= j.RAD2DEG, e[1] *= j.RAD2DEG), e;
}
function ds(e, t, n) {
	let [r, i] = n.split(".").map((e) => parseInt(e)), a = r === 1 && i < 3 || r < 1;
	cs(t) && a && ([e[0], e[1]] = [e[1], e[0]]);
}
function fs(e) {
	e[0] *= j.DEG2RAD, e[1] *= j.DEG2RAD;
}
function ps(e, t) {
	if (!e) return null;
	let n = e.getAttribute("CRS") || e.getAttribute("crs") || e.getAttribute("SRS") || "", r = parseFloat(e.getAttribute("minx")), i = parseFloat(e.getAttribute("miny")), a = parseFloat(e.getAttribute("maxx")), o = parseFloat(e.getAttribute("maxy")), s = [r, i], c = [a, o];
	return ds(s, n, t), ds(c, n, t), us(s, n), us(c, n), fs(s), fs(c), {
		crs: n,
		bounds: [...s, ...c]
	};
}
function ms(e) {
	let t = parseFloat(e.querySelector("westBoundLongitude").textContent), n = parseFloat(e.querySelector("eastBoundLongitude").textContent), r = parseFloat(e.querySelector("southBoundLatitude").textContent), i = parseFloat(e.querySelector("northBoundLatitude").textContent), a = [t, r], o = [n, i];
	return fs(a), fs(o), [...a, ...o];
}
function hs(e) {
	let t = parseFloat(e.getAttribute("minx").textContent), n = parseFloat(e.getAttribute("maxx").textContent), r = parseFloat(e.getAttribute("miny").textContent), i = parseFloat(e.getAttribute("maxy").textContent), a = [t, r], o = [n, i];
	return fs(a), fs(o), [...a, ...o];
}
function gs(e) {
	return {
		name: e.querySelector("Name").textContent,
		title: e.querySelector("Title").textContent,
		legends: [...e.querySelectorAll("LegendURL")].map((e) => ({
			width: parseInt(e.getAttribute("width")),
			height: parseInt(e.getAttribute("height")),
			format: e.querySelector("Format").textContent,
			url: ys(e.querySelector("OnlineResource"))
		}))
	};
}
function _s(e, t, n = {}) {
	let { styles: r = [], crs: i = [], contentBoundingBox: a = null, queryable: o = !1, opaque: s = !1 } = n, c = e.querySelector(":scope > Name")?.textContent || null, l = e.querySelector(":scope > Title")?.textContent || "", u = e.querySelector(":scope > Abstract")?.textContent || "", d = [...e.querySelectorAll(":scope > Keyword")].map((e) => e.textContent), f = [...e.querySelectorAll(":scope > BoundingBox")].map((e) => ps(e, t));
	i = [...i, ...Array.from(e.querySelectorAll("CRS")).map((e) => e.textContent)], r = [...r, ...Array.from(e.querySelectorAll(":scope > Style")).map((e) => gs(e))], e.hasAttribute("queryable") && (o = e.getAttribute("queryable") === "1"), e.hasAttribute("opaque") && (s = e.getAttribute("opaque") === "1"), e.querySelector("EX_GeographicBoundingBox") ? a = ms(e.querySelector("EX_GeographicBoundingBox")) : e.querySelector("LatLonBoundingBox") && (a = hs(e.querySelector("LatLonBoundingBox")));
	let p = Array.from(e.querySelectorAll(":scope > Layer")).map((e) => _s(e, t, {
		styles: r,
		crs: i,
		contentBoundingBox: a,
		queryable: o,
		opaque: s
	}));
	return {
		name: c,
		title: l,
		abstract: u,
		queryable: o,
		opaque: s,
		keywords: d,
		crs: i,
		boundingBoxes: f,
		contentBoundingBox: a,
		styles: r,
		subLayers: p
	};
}
function vs(e) {
	return {
		name: e.querySelector("Name")?.textContent || "",
		title: e.querySelector("Title")?.textContent || "",
		abstract: e.querySelector("Abstract")?.textContent || "",
		keywords: Array.from(e.querySelectorAll("Keyword")).map((e) => e.textContent),
		maxWidth: parseFloat(e.querySelector("MaxWidth")) || null,
		maxHeight: parseFloat(e.querySelector("MaxHeight")) || null,
		layerLimit: parseFloat(e.querySelector("LayerLimit")) || null
	};
}
function ys(e) {
	return e ? (e.getAttribute("xlink:href") || e.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "").trim() : "";
}
function bs(e) {
	let t = Array.from(e.querySelectorAll("Format")).map((e) => e.textContent.trim()), n = Array.from(e.querySelectorAll("DCPType")).map((e) => {
		let t = e.querySelector("HTTP"), n = t.querySelector("Get OnlineResource") || t.querySelector("Get > OnlineResource") || t.querySelector("Get"), r = t.querySelector("Post OnlineResource") || t.querySelector("Post > OnlineResource") || t.querySelector("Post");
		return {
			type: "HTTP",
			get: ys(n),
			post: ys(r)
		};
	});
	return {
		formats: t,
		dcp: n,
		href: n[0].get
	};
}
function xs(e) {
	let t = {};
	return Array.from(e.querySelectorAll(":scope > *")).forEach((e) => {
		let n = e.localName;
		t[n] = bs(e);
	}), t;
}
function Ss(e, t = []) {
	return e.forEach((e) => {
		e.name !== null && t.push(e), Ss(e.subLayers, t);
	}), t;
}
var Cs = class extends r {
	parse(e) {
		let t = new TextDecoder("utf-8").decode(new Uint8Array(e)), n = new DOMParser().parseFromString(t, "text/xml"), r = (n.querySelector("WMS_Capabilities") || n.querySelector("WMT_MS_Capabilities")).getAttribute("version"), i = n.querySelector("Capability"), a = vs(n.querySelector(":scope > Service")), o = xs(i.querySelector(":scope > Request"));
		return {
			version: r,
			service: a,
			layers: Ss(Array.from(i.querySelectorAll(":scope > Layer")).map((e) => _s(e, r))),
			request: o
		};
	}
};
//#endregion
export { Pn as A, Zt as B, Pr as C, Dr as D, Ar as E, qt as F, Ze as G, Yt as H, Jt as I, Ve as J, He as K, $t as L, On as M, Dn as N, Sr as O, Qt as P, Gt as R, Fr as S, jr as T, Xt as U, H as V, Kt as W, wi as _, Eo as a, ui as b, xo as c, uo as d, co as f, Ti as g, xi as h, Vo as i, An as j, vr as k, yo as l, Si as m, Xo as n, wo as o, aa as p, Be as q, Bo as r, Do as s, Cs as t, vo as u, Ci as v, Mr as w, $r as x, bi as y, Wt as z };

//# sourceMappingURL=plugins-CQSoVsPj.js.map