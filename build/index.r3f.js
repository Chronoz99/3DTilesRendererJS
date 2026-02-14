import { jsx as g, jsxs as S, Fragment as H } from "react/jsx-runtime";
import { useRef as T, useLayoutEffect as N, useEffect as y, createContext as G, forwardRef as _, useContext as q, useState as j, useCallback as K, useReducer as ye, useMemo as L, StrictMode as Ce, cloneElement as xe } from "react";
import { useThree as M, useFrame as F, createPortal as Ee } from "@react-three/fiber";
import { Object3D as be, Scene as Me, Vector3 as R, Matrix4 as A, Ray as ee, OrthographicCamera as Le, BackSide as qe, EventDispatcher as pe, Line3 as me, Vector2 as we, Raycaster as _e } from "three";
import { T as Se, E as Re, G as Pe, a as Te } from "./CameraTransitionManager-DimD-zBE.js";
import { W as Fe, a as We, O as he } from "./MemoryUtils-BEiOVCnL.js";
import { createRoot as je } from "react-dom/client";
function Oe(o, e) {
  if (o === e)
    return !0;
  if (!o || !e)
    return o === e;
  for (const t in o)
    if (o[t] !== e[t])
      return !1;
  for (const t in e)
    if (o[t] !== e[t])
      return !1;
  return !0;
}
function te(o) {
  const e = T();
  return Oe(e.current, o) || (e.current = o), e.current;
}
function ke(o) {
  return /^on/g.test(o);
}
function Ae(o) {
  return o.replace(/^on/, "").replace(/[a-z][A-Z]/g, (e) => `${e[0]}-${e[1]}`).toLowerCase();
}
function ae(o) {
  return o.split("-");
}
function fe(o, e) {
  let t = o;
  const i = [...e];
  for (; i.length !== 0; ) {
    const n = i.shift();
    t = t[n];
  }
  return t;
}
function le(o, e, t) {
  const i = [...e], n = i.pop();
  fe(o, i)[n] = t;
}
function z(o, e, t = !1) {
  N(() => {
    if (o === null)
      return;
    const i = {}, n = {};
    for (const r in e)
      if (ke(r) && o.addEventListener && !(r in o)) {
        const h = Ae(r);
        n[h] = e[r], o.addEventListener(h, e[r]);
      } else {
        const h = t ? [r] : ae(r);
        i[r] = fe(o, h), le(o, h, e[r]);
      }
    return () => {
      for (const r in n)
        o.removeEventListener(r, n[r]);
      for (const r in i) {
        const h = t ? [r] : ae(r);
        le(o, h, i[r]);
      }
    };
  }, [o, te(e)]);
}
function ze(o, e) {
  z(o, e, !0);
}
function D(o, ...e) {
  y(() => {
    e.forEach((t) => {
      t && (t instanceof Function ? t(o) : t.current = o);
    });
  }, [o, ...e]);
}
const P = G(null), De = G(null), ne = G(null);
function Qe({ children: o }) {
  const e = q(P), t = T();
  return y(() => {
    e && (t.current.matrixWorld = e.group.matrixWorld);
  }, [e]), /* @__PURE__ */ g("group", { ref: t, matrixWorldAutoUpdate: !1, matrixAutoUpdate: !1, children: o });
}
function rt(o) {
  const {
    lat: e = 0,
    lon: t = 0,
    height: i = 0,
    az: n = 0,
    el: r = 0,
    roll: h = 0,
    ellipsoid: c = Fe.clone(),
    children: l
  } = o, u = q(P), m = M((s) => s.invalidate), [d, p] = j(null), v = K(() => {
    if (d === null)
      return;
    const s = u && u.ellipsoid || c || null;
    d.matrix.identity(), d.visible = !!(u && u.root || c), s !== null && (s.getOrientedEastNorthUpFrame(e, t, i, n, r, h, d.matrix), d.matrix.decompose(d.position, d.quaternion, d.scale), d.updateMatrixWorld(), m());
  }, [m, u, e, t, i, n, r, h, c, d, te(c.radius)]);
  return y(() => {
    if (u !== null && d !== null)
      return d.updateMatrixWorld = function(s) {
        this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || s) && (this.matrixWorld.multiplyMatrices(u.group.matrixWorld, this.matrix), s = !0);
        const a = this.children;
        for (let f = 0, C = a.length; f < C; f++)
          a[f].updateMatrixWorld(s);
      }, () => {
        d.updateMatrixWorld = be.prototype.updateMatrixWorld;
      };
  }, [u, d]), y(() => {
    v();
  }, [v]), y(() => {
    if (u !== null)
      return u.addEventListener("load-tileset", v), () => {
        u.removeEventListener("load-tileset", v);
      };
  }, [u, v]), /* @__PURE__ */ g("group", { ref: p, children: l });
}
const it = _(function(e, t) {
  const { plugin: i, args: n, children: r, ...h } = e, c = q(P), [l, u] = j(null), [, m] = ye((d) => d + 1, 0);
  if (N(() => {
    if (c === null)
      return;
    let d;
    return Array.isArray(n) ? d = new i(...n) : d = new i(n), u(d), () => {
      u(null);
    };
  }, [i, c, te(n)]), z(l, h), N(() => {
    if (l !== null)
      return c.registerPlugin(l), m(), () => {
        c.unregisterPlugin(l);
      };
  }, [l]), D(l, t), !(!l || !c.plugins.includes(l)))
    return /* @__PURE__ */ g(De.Provider, { value: l, children: r });
}), ot = _(function(e, t) {
  const { url: i, cachedRootJson: n = null, group: r = {}, enabled: h = !0, children: c, ...l } = e, [u, m, d] = M((a) => [a.camera, a.gl, a.invalidate]), [p, v] = j(null);
  y(() => {
    const a = () => d(), f = new Se(i, n);
    return f.addEventListener("needs-render", a), f.addEventListener("needs-update", a), v(f), () => {
      f.removeEventListener("needs-render", a), f.removeEventListener("needs-update", a), f.dispose(), v(null);
    };
  }, [i, n, d]), F(() => {
    p === null || !h || (u.updateMatrixWorld(), p.setResolutionFromRenderer(u, m), p.update());
  }), N(() => {
    if (p !== null)
      return p.setCamera(u), () => {
        p.deleteCamera(u);
      };
  }, [p, u]), D(p, t), z(p, l);
  const s = L(() => p ? {
    ellipsoid: p.ellipsoid,
    frame: p.group
  } : null, [p == null ? void 0 : p.ellipsoid, p == null ? void 0 : p.group]);
  return p ? /* @__PURE__ */ S(H, { children: [
    /* @__PURE__ */ g("primitive", { object: p.group, ...r }),
    /* @__PURE__ */ g(P.Provider, { value: p, children: /* @__PURE__ */ g(ne.Provider, { value: s, children: /* @__PURE__ */ g(Qe, { children: c }) }) })
  ] }) : null;
}), Ue = _(function({ children: e, ...t }, i) {
  const [n] = M((l) => [l.gl]), [r, h] = j(null), c = L(() => document.createElement("div"), []);
  y(() => (c.style.pointerEvents = "none", c.style.position = "absolute", c.style.width = "100%", c.style.height = "100%", c.style.left = 0, c.style.top = 0, n.domElement.parentNode.appendChild(c), () => {
    c.remove();
  }), [c, n.domElement.parentNode]), y(() => {
    const l = je(c);
    return h(l), () => {
      l.unmount();
    };
  }, [c]), r !== null && r.render(
    /* @__PURE__ */ g(Ce, { children: /* @__PURE__ */ g("div", { ...t, ref: i, children: e }) })
  );
});
function Ie() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
function st({ children: o, style: e, generateAttributions: t, ...i }) {
  const n = q(P), [r, h] = j([]);
  y(() => {
    if (!n)
      return;
    let m = !1;
    const d = () => {
      m || (m = !0, queueMicrotask(() => {
        h(n.getAttributions()), m = !1;
      }));
    };
    return n.addEventListener("tile-visibility-change", d), n.addEventListener("load-tileset", d), () => {
      n.removeEventListener("tile-visibility-change", d), n.removeEventListener("load-tileset", d);
    };
  }, [n]);
  const c = L(() => "class_" + Ie(), []), l = L(() => `
		#${c} a {
			color: white;
		}

		#${c} img {
			max-width: 125px;
			display: block;
			margin: 5px 0;
		}
	`, [c]);
  let u;
  if (t)
    u = t(r, c);
  else {
    const m = [];
    r.forEach((d, p) => {
      let v = null;
      d.type === "string" ? v = /* @__PURE__ */ g("div", { children: d.value }, p) : d.type === "html" ? v = /* @__PURE__ */ g("div", { dangerouslySetInnerHTML: { __html: d.value }, style: { pointerEvents: "all" } }, p) : d.type === "image" && (v = /* @__PURE__ */ g("div", { children: /* @__PURE__ */ g("img", { src: d.value }) }, p)), v && m.push(v);
    }), u = /* @__PURE__ */ S(H, { children: [
      /* @__PURE__ */ g("style", { children: l }),
      m
    ] });
  }
  return /* @__PURE__ */ S(
    Ue,
    {
      id: c,
      style: {
        position: "absolute",
        bottom: 0,
        left: 0,
        padding: "10px",
        color: "rgba( 255, 255, 255, 0.75 )",
        fontSize: "10px",
        ...e
      },
      ...i,
      children: [
        o,
        u
      ]
    }
  );
}
const ve = _(function(e, t) {
  const { controlsConstructor: i, domElement: n, scene: r, camera: h, ellipsoid: c, ellipsoidFrame: l, ...u } = e, [m] = M((E) => [E.camera]), [d] = M((E) => [E.gl]), [p] = M((E) => [E.scene]), [v] = M((E) => [E.invalidate]), [s] = M((E) => [E.get]), [a] = M((E) => [E.set]), f = q(ne), C = h || m || null, b = r || p || null, ie = n || d.domElement || null, oe = c || (f == null ? void 0 : f.ellipsoid) || null, se = l || (f == null ? void 0 : f.frame) || null, x = L(() => new i(), [i]);
  D(x, t), y(() => {
    const E = () => v();
    return x.addEventListener("change", E), x.addEventListener("start", E), x.addEventListener("end", E), () => {
      x.removeEventListener("change", E), x.removeEventListener("start", E), x.removeEventListener("end", E);
    };
  }, [x, v]), y(() => {
    x.setCamera(C);
  }, [x, C]), y(() => {
    x.setScene(b);
  }, [x, b]), y(() => {
    x.isGlobeControls && x.setEllipsoid(oe, se);
  }, [x, oe, se]), y(() => (x.attach(ie), () => {
    x.detach();
  }), [x, ie]), y(() => {
    const E = s().controls;
    return a({ controls: x }), () => a({ controls: E });
  }, [x, s, a]), F(() => {
    x.update();
  }, -1), ze(x, u);
}), at = _(function(e, t) {
  return /* @__PURE__ */ g(ve, { ...e, ref: t, controlsConstructor: Re });
}), lt = _(function(e, t) {
  return /* @__PURE__ */ g(ve, { ...e, ref: t, controlsConstructor: Pe });
}), w = /* @__PURE__ */ new R(), W = /* @__PURE__ */ new R(), k = /* @__PURE__ */ new R(), $ = /* @__PURE__ */ new A(), B = /* @__PURE__ */ new A(), Q = /* @__PURE__ */ new ee(), J = {};
function Ne(o, e, t, i) {
  Q.origin.copy(o.position), Q.direction.set(0, 0, -1).transformDirection(o.matrixWorld), Q.applyMatrix4(t.matrixWorldInverse), e.closestPointToRayEstimate(Q, k), k.applyMatrix4(t.matrixWorld), W.set(0, 0, -1).transformDirection(o.matrixWorld);
  const n = k.sub(o.position).dot(W);
  return i.copy(o.position).addScaledVector(W, n), i;
}
function Ve(o) {
  const { defaultScene: e, defaultCamera: t, overrideRenderLoop: i = !0, renderPriority: n = 1 } = o, r = L(() => new Le(), []), [h, c, l, u] = M((m) => [m.set, m.size, m.gl, m.scene]);
  y(() => {
    h({ camera: r });
  }, [h, r]), y(() => {
    r.left = -c.width / 2, r.right = c.width / 2, r.top = c.height / 2, r.bottom = -c.height / 2, r.near = 0, r.far = 2e3, r.position.z = r.far / 2, r.updateProjectionMatrix();
  }, [r, c]), F(() => {
    i && l.render(e, t);
    const m = l.autoClear;
    l.autoClear = !1, l.clearDepth(), l.render(u, r), l.autoClear = m;
  }, n);
}
function ce() {
  const o = T();
  return y(() => {
    const t = o.current.attributes.position;
    for (let i = 0, n = t.count; i < n; i++)
      w.fromBufferAttribute(t, i), w.y > 0 && (w.x = 0, t.setXYZ(i, ...w));
  }), /* @__PURE__ */ g("boxGeometry", { ref: o });
}
function Ge({ northColor: o = 15684432, southColor: e = 16777215 }) {
  const [t, i] = j(), n = T();
  return y(() => {
    i(n.current);
  }, []), /* @__PURE__ */ S("group", { scale: 0.5, ref: n, children: [
    /* @__PURE__ */ g("ambientLight", { intensity: 1 }),
    /* @__PURE__ */ g("directionalLight", { position: [0, 2, 3], intensity: 3, target: t }),
    /* @__PURE__ */ g("directionalLight", { position: [0, -2, -3], intensity: 3, target: t }),
    /* @__PURE__ */ S("mesh", { children: [
      /* @__PURE__ */ g("sphereGeometry", {}),
      /* @__PURE__ */ g("meshBasicMaterial", { color: 0, opacity: 0.3, transparent: !0, side: qe })
    ] }),
    /* @__PURE__ */ S("group", { scale: [0.5, 1, 0.15], children: [
      /* @__PURE__ */ S("mesh", { "position-y": 0.5, children: [
        /* @__PURE__ */ g(ce, {}),
        /* @__PURE__ */ g("meshStandardMaterial", { color: o })
      ] }),
      /* @__PURE__ */ S("mesh", { "position-y": -0.5, "rotation-x": Math.PI, children: [
        /* @__PURE__ */ g(ce, {}),
        /* @__PURE__ */ g("meshStandardMaterial", { color: e })
      ] })
    ] })
  ] });
}
function ct({ children: o, overrideRenderLoop: e, mode: t = "3d", margin: i = 10, scale: n = 35, visible: r = !0, ...h }) {
  const [c, l, u] = M((a) => [a.camera, a.scene, a.size]), m = q(ne), d = T(null), p = L(() => new Me(), []);
  let v, s;
  return Array.isArray(i) ? (v = i[0], s = i[1]) : (v = i, s = i), F(() => {
    const a = m == null ? void 0 : m.ellipsoid, f = m == null ? void 0 : m.frame;
    if (!a || !f || d.current === null)
      return null;
    const C = d.current;
    if (Ne(c, a, f, k).applyMatrix4(f.matrixWorldInverse), a.getPositionToCartographic(k, J), a.getEastNorthUpFrame(J.lat, J.lon, 0, B).premultiply(f.matrixWorld), B.invert(), $.copy(c.matrixWorld).premultiply(B), t.toLowerCase() === "3d")
      C.quaternion.setFromRotationMatrix($).invert();
    else if (w.set(0, 1, 0).transformDirection($).normalize(), w.z = 0, w.normalize(), w.length() === 0)
      C.quaternion.identity();
    else {
      const b = W.set(0, 1, 0).angleTo(w);
      W.cross(w).normalize(), C.quaternion.setFromAxisAngle(W, -b);
    }
  }), o || (o = /* @__PURE__ */ g(Ge, {})), r ? Ee(
    /* @__PURE__ */ S(H, { children: [
      /* @__PURE__ */ g(
        "group",
        {
          ref: d,
          scale: n,
          position: [
            u.width / 2 - v - n / 2,
            -u.height / 2 + s + n / 2,
            0
          ],
          ...h,
          children: o
        }
      ),
      /* @__PURE__ */ g(
        Ve,
        {
          defaultCamera: c,
          defaultScene: l,
          overrideRenderLoop: e,
          renderPriority: 10
        }
      )
    ] }),
    p,
    { events: { priority: 10 } }
  ) : null;
}
const ut = _(function(e, t) {
  const {
    mode: i = "perspective",
    onBeforeToggle: n,
    perspectiveCamera: r,
    orthographicCamera: h,
    ...c
  } = e, [l, u, m, d, p, v] = M((a) => [a.set, a.get, a.invalidate, a.controls, a.camera, a.size]), s = L(() => {
    const a = new Te();
    return a.autoSync = !1, p.isOrthographicCamera ? (a.orthographicCamera.copy(p), a.mode = "orthographic") : a.perspectiveCamera.copy(p), a.syncCameras(), a.mode = i, a;
  }, []);
  y(() => {
    const { perspectiveCamera: a, orthographicCamera: f } = s, C = v.width / v.height;
    a.aspect = C, a.updateProjectionMatrix(), f.left = -f.top * C, f.right = -f.left, a.updateProjectionMatrix();
  }, [s, v]), D(s, t), y(() => {
    const a = ({ camera: f }) => {
      l(() => ({ camera: f }));
    };
    return l(() => ({ camera: s.camera })), s.addEventListener("camera-change", a), () => {
      s.removeEventListener("camera-change", a);
    };
  }, [s, l]), y(() => {
    const a = s.perspectiveCamera, f = s.orthographicCamera;
    return s.perspectiveCamera = r || a, s.orthographicCamera = h || f, l(() => ({ camera: s.camera })), () => {
      s.perspectiveCamera = a, s.orthographicCamera = f;
    };
  }, [r, h, s, l]), y(() => {
    if (i !== s.mode) {
      const a = i === "orthographic" ? s.orthographicCamera : s.perspectiveCamera;
      n ? n(s, a) : d && d.isEnvironmentControls ? (d.getPivotPoint(s.fixedPoint), s.syncCameras(), d.adjustCamera(s.perspectiveCamera), d.adjustCamera(s.orthographicCamera)) : (s.fixedPoint.set(0, 0, -1).transformDirection(s.camera.matrixWorld).multiplyScalar(50).add(s.camera.position), s.syncCameras()), s.toggle(), m();
    }
  }, [i, s, m, d, n]), y(() => {
    const a = () => m();
    return s.addEventListener("transition-start", a), s.addEventListener("change", a), s.addEventListener("transition-end", a), () => {
      s.removeEventListener("transition-start", a), s.removeEventListener("change", a), s.removeEventListener("transition-end", a);
    };
  }, [s, m]), z(s, c), F(() => {
    s.update(), d && (d.enabled = !s.animating);
    const { camera: a, size: f } = u();
    if (!h && a === s.orthographicCamera) {
      const C = f.width / f.height, b = s.orthographicCamera;
      C !== b.right && (b.bottom = -1, b.top = 1, b.left = -C, b.right = C, b.updateProjectionMatrix());
    }
    s.animating && m();
  }, -1);
});
function ge(...o) {
  return K((e) => {
    o.forEach((t) => {
      t && (typeof t == "function" ? t(e) : t.current = e);
    });
  }, o);
}
function Z(o, e) {
  e(o) || o.children.forEach((t) => {
    Z(t, e);
  });
}
class $e extends pe {
  constructor() {
    super(), this.objects = /* @__PURE__ */ new Set(), this.observed = /* @__PURE__ */ new Set(), this._addedCallback = ({ child: e }) => {
      Z(e, (t) => this.observed.has(t) ? !0 : (this.objects.add(t), t.addEventListener("childadded", this._addedCallback), t.addEventListener("childremoved", this._removedCallback), this.dispatchEvent({ type: "childadded", child: e }), !1));
    }, this._removedCallback = ({ child: e }) => {
      Z(e, (t) => this.observed.has(t) ? !0 : (this.objects.delete(t), t.removeEventListener("childadded", this._addedCallback), t.removeEventListener("childremoved", this._removedCallback), this.dispatchEvent({ type: "childremoved", child: e }), !1));
    };
  }
  observe(e) {
    const { observed: t } = this;
    this._addedCallback({ child: e }), t.add(e);
  }
  unobserve(e) {
    const { observed: t } = this;
    t.delete(e), this._removedCallback({ child: e });
  }
  dispose() {
    this.observed.forEach((e) => {
      this.unobserve(e);
    });
  }
}
const X = /* @__PURE__ */ new _e(), O = /* @__PURE__ */ new me(), U = /* @__PURE__ */ new me(), ue = /* @__PURE__ */ new we(), I = /* @__PURE__ */ new R(), de = /* @__PURE__ */ new A();
class Be extends pe {
  constructor() {
    super(), this.autoRun = !0, this.queryMap = /* @__PURE__ */ new Map(), this.index = 0, this.queued = [], this.scheduled = !1, this.duration = 1, this.objects = [], this.observer = new $e(), this.ellipsoid = new We(), this.frame = new A(), this.cameras = /* @__PURE__ */ new Set();
    const e = /* @__PURE__ */ (() => {
      let t = !1;
      return () => {
        t || (t = !0, queueMicrotask(() => {
          this.queryMap.forEach((i) => this._enqueue(i)), t = !1;
        }));
      };
    })();
    this.observer.addEventListener("childadded", e), this.observer.addEventListener("childremoved", e);
  }
  // job runner
  _enqueue(e) {
    e.queued || (this.queued.push(e), e.queued = !0, this._scheduleRun());
  }
  _runJobs() {
    const { queued: e, cameras: t, duration: i } = this, n = performance.now();
    for (t.forEach((r, h) => {
      de.copy(r.matrixWorldInverse).premultiply(r.projectionMatrix), I.set(0, 0, -1).transformDirection(r.matrixWorld), O.start.setFromMatrixPosition(r.matrixWorld), O.end.addVectors(I, O.start);
      for (let c = 0, l = e.length; c < l; c++) {
        const u = e[c], { ray: m } = u;
        let d, p;
        if (u.point === null)
          U.start.copy(m.origin), m.at(1, U.end), Je(O, U, ue), u.distance = ue.x * (1 - Math.abs(I.dot(m.direction))), u.inFrustum = !0;
        else {
          const v = U.start;
          v.copy(u.point).applyMatrix4(de), v.x > -1 && v.x < 1 && v.y > -1 && v.y < 1 && v.z > -1 && v.z < 1 ? (u.distance = v.subVectors(u.point, O.start).dot(I), u.inFrustum = !0) : (u.distance = 0, u.inFrustum = !1);
        }
        h === 0 ? (u.distance = d, u.inFrustum = p) : (u.inFrustum = u.inFrustum || p, u.distance = Math.min(u.distance, d));
      }
    }), t.length !== 0 && e.sort((r, h) => r.point === null != (h.point === null) ? r.point === null ? 1 : -1 : r.inFrustum !== h.inFrustum ? r.inFrustum ? 1 : -1 : r.distance < 0 != h.distance < 0 ? r.distance < 0 ? -1 : 1 : h.distance - r.distance); e.length !== 0 && performance.now() - n < i; ) {
      const r = e.pop();
      r.queued = !1, this._updateQuery(r);
    }
    e.length !== 0 && this._scheduleRun();
  }
  _scheduleRun() {
    this.autoRun && !this.scheduled && (this.scheduled = !0, requestAnimationFrame(() => {
      this.scheduled = !1, this._runJobs();
    }));
  }
  _updateQuery(e) {
    X.ray.copy(e.ray), X.far = "lat" in e ? 1e4 + Math.max(...this.ellipsoid.radius) : 1 / 0;
    const t = X.intersectObjects(this.objects)[0] || null;
    t !== null && (e.point === null ? e.point = t.point.clone() : e.point.copy(t.point)), e.callback(t);
  }
  // add and remove cameras used for sorting
  addCamera(e) {
    const { queryMap: t, cameras: i } = this;
    i.add(e), t.forEach((n) => this._enqueue(n));
  }
  deleteCamera(e) {
    const { cameras: t } = this;
    t.delete(e);
  }
  // run the given item index if possible
  runIfNeeded(e) {
    const { queryMap: t, queued: i } = this, n = t.get(e);
    n.queued && (this._updateQuery(n), n.queued = !1, i.splice(i.indexOf(n), 1));
  }
  // set the scene used for query
  setScene(...e) {
    const { observer: t } = this;
    t.dispose(), e.forEach((i) => t.observe(i)), this.objects = e, this._scheduleRun();
  }
  // update the ellipsoid and frame based on a tiles renderer, updating the item rays only if necessary
  setEllipsoidFromTilesRenderer(e) {
    const { queryMap: t, ellipsoid: i, frame: n } = this;
    (!i.radius.equals(e.ellipsoid.radius) || !n.equals(e.group.matrixWorld)) && (i.copy(e.ellipsoid), n.copy(e.group.matrixWorld), t.forEach((r) => {
      if ("lat" in r) {
        const { lat: h, lon: c, ray: l } = r;
        i.getCartographicToPosition(h, c, 1e4, l.origin).applyMatrix4(n), i.getCartographicToNormal(h, c, l.direction).transformDirection(n).multiplyScalar(-1);
      }
      this._enqueue(r);
    }));
  }
  // register query callbacks
  registerRayQuery(e, t) {
    const i = this.index++, n = {
      ray: e.clone(),
      callback: t,
      queued: !1,
      distance: -1,
      point: null
    };
    return this.queryMap.set(i, n), this._enqueue(n), i;
  }
  registerLatLonQuery(e, t, i) {
    const { ellipsoid: n, frame: r } = this, h = this.index++, c = new ee();
    n.getCartographicToPosition(e, t, 1e4, c.origin).applyMatrix4(r), n.getCartographicToNormal(e, t, c.direction).transformDirection(r).multiplyScalar(-1);
    const l = {
      ray: c.clone(),
      lat: e,
      lon: t,
      callback: i,
      queued: !1,
      distance: -1,
      point: null
    };
    return this.queryMap.set(h, l), this._enqueue(l), h;
  }
  unregisterQuery(e) {
    const { queued: t, queryMap: i } = this, n = i.get(e);
    i.delete(e), n && n.queued && (n.queued = !1, t.splice(t.indexOf(n), 1));
  }
  // dispose of everything
  dispose() {
    this.queryMap.clear(), this.queued.length = 0, this.objects.length = 0, this.observer.dispose();
  }
}
const Je = (function() {
  const o = new R(), e = new R(), t = new R();
  return function(n, r, h) {
    const c = n.start, l = o, u = r.start, m = e;
    t.subVectors(c, u), o.subVectors(n.end, n.start), e.subVectors(r.end, r.start);
    const d = t.dot(m), p = m.dot(l), v = m.dot(m), s = t.dot(l), f = l.dot(l) * v - p * p;
    let C, b;
    f !== 0 ? C = (d * p - s * v) / f : C = 0, b = (d + C * p) / v, h.x = C, h.y = b;
  };
})(), re = G(null), V = /* @__PURE__ */ new A(), Y = /* @__PURE__ */ new ee(), dt = _(function(e, t) {
  const {
    interpolationFactor: i = 0.025,
    onQueryUpdate: n = null,
    ...r
  } = e, h = q(P), c = q(re), l = M(({ invalidate: s }) => s), u = L(() => new R(), []), m = L(() => ({ value: !1 }), []), d = L(() => ({ value: !1 }), []), p = T(null), v = K((s) => {
    if (h === null || s === null || p.current === null)
      return;
    const { lat: a, lon: f, rayorigin: C, raydirection: b } = r;
    a !== null && f !== null ? (u.copy(s.point), d.value = !0, c.ellipsoid.getObjectFrame(a, f, 0, 0, 0, 0, V, he).premultiply(h.group.matrixWorld), p.current.quaternion.setFromRotationMatrix(V), l()) : C !== null && b !== null && (u.copy(s.point), d.value = !0, p.current.quaternion.identity(), l()), n && n(s);
  }, [l, d, c.ellipsoid, r, u, h, n]);
  return F((s, a) => {
    if (p.current && (p.current.visible = m.value), p.current && d.value)
      if (m.value === !1)
        m.value = !0, p.current.position.copy(u);
      else {
        const f = 1 - 2 ** (-a / i);
        p.current.position.distanceToSquared(u) > 1e-6 ? (p.current.position.lerp(
          u,
          i === 0 ? 1 : f
        ), l()) : p.current.position.copy(u);
      }
  }), /* @__PURE__ */ g(
    Xe,
    {
      ref: ge(p, t),
      onQueryUpdate: v,
      ...r
    }
  );
}), Xe = _(function(e, t) {
  const {
    component: i = /* @__PURE__ */ g("group", {}),
    lat: n = null,
    lon: r = null,
    rayorigin: h = null,
    raydirection: c = null,
    onQueryUpdate: l = null,
    ...u
  } = e, m = T(null), d = q(P), p = q(re), v = M(({ invalidate: a }) => a), s = L(() => new R(), []);
  return y(() => {
    const a = (f) => {
      l ? l(f) : d && f !== null && m.current !== null && (n !== null && r !== null ? (m.current.position.copy(f.point), p.ellipsoid.getObjectFrame(n, r, 0, 0, 0, 0, V, he).premultiply(d.group.matrixWorld), m.current.quaternion.setFromRotationMatrix(V), v()) : h !== null && c !== null && (m.current.position.copy(f.point), m.current.quaternion.identity(), v()));
    };
    if (n !== null && r !== null) {
      const f = p.registerLatLonQuery(n, r, a);
      return () => p.unregisterQuery(f);
    } else if (h !== null && c !== null) {
      Y.origin.copy(h), Y.direction.copy(c);
      const f = p.registerRayQuery(Y, a);
      return () => p.unregisterQuery(f);
    }
  }, [n, r, h, c, p, d, v, s, l]), xe(i, { ...u, ref: ge(m, t), raycast: () => !1 });
}), pt = _(function(e, t) {
  const i = M(({ scene: m }) => m), {
    scene: n = i,
    children: r,
    ...h
  } = e, c = q(P), l = L(() => new Be(), []), u = M(({ camera: m }) => m);
  return z(l, h), y(() => () => l.dispose(), [l]), y(() => {
    l.setScene(...Array.isArray(n) ? n : [n]);
  }, [l, n]), y(() => {
    l.addCamera(u);
  }, [l, u]), F(() => {
    c && l.setEllipsoidFromTilesRenderer(c);
  }), D(l, t), /* @__PURE__ */ g(re.Provider, { value: l, children: /* @__PURE__ */ g("group", { matrixAutoUpdate: !1, matrixWorldAutoUpdate: !1, children: r }) });
});
export {
  dt as AnimatedSettledObject,
  ut as CameraTransition,
  Ue as CanvasDOMOverlay,
  ct as CompassGizmo,
  rt as EastNorthUpFrame,
  ne as EllipsoidContext,
  at as EnvironmentControls,
  lt as GlobeControls,
  Xe as SettledObject,
  pt as SettledObjects,
  st as TilesAttributionOverlay,
  it as TilesPlugin,
  De as TilesPluginContext,
  ot as TilesRenderer,
  P as TilesRendererContext
};
//# sourceMappingURL=index.r3f.js.map
