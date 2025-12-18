import { jsx as g, jsxs as R, Fragment as Z } from "react/jsx-runtime";
import { useRef as F, useLayoutEffect as N, useEffect as y, createContext as H, forwardRef as _, useContext as q, useState as j, useCallback as K, useReducer as Ce, useMemo as L, StrictMode as xe, cloneElement as Ee } from "react";
import { useThree as M, useFrame as T, createPortal as be } from "@react-three/fiber";
import { Object3D as Me, Scene as Le, Vector3 as P, Matrix4 as A, Ray as ee, OrthographicCamera as qe, BackSide as we, EventDispatcher as me, Line3 as he, Vector2 as _e, Raycaster as Se } from "three";
import { T as Re, E as Pe, G as Fe, a as Te } from "./CameraTransitionManager-SvgW6Pmv.js";
import { W as We, a as je, O as fe } from "./MemoryUtils-R1TfIs9h.js";
import { createRoot as Oe } from "react-dom/client";
function ke(o, e) {
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
  const e = F();
  return ke(e.current, o) || (e.current = o), e.current;
}
function Ae(o) {
  return /^on/g.test(o);
}
function ze(o) {
  return o.replace(/^on/, "").replace(/[a-z][A-Z]/g, (e) => `${e[0]}-${e[1]}`).toLowerCase();
}
function le(o) {
  return o.split("-");
}
function ve(o, e) {
  let t = o;
  const i = [...e];
  for (; i.length !== 0; ) {
    const n = i.shift();
    t = t[n];
  }
  return t;
}
function ce(o, e, t) {
  const i = [...e], n = i.pop();
  ve(o, i)[n] = t;
}
function z(o, e, t = !1) {
  N(() => {
    if (o === null)
      return;
    const i = {}, n = {};
    for (const r in e)
      if (Ae(r) && o.addEventListener && !(r in o)) {
        const m = ze(r);
        n[m] = e[r], o.addEventListener(m, e[r]);
      } else {
        const m = t ? [r] : le(r);
        i[r] = ve(o, m), ce(o, m, e[r]);
      }
    return () => {
      for (const r in n)
        o.removeEventListener(r, n[r]);
      for (const r in i) {
        const m = t ? [r] : le(r);
        ce(o, m, i[r]);
      }
    };
  }, [o, te(e)]);
}
function De(o, e) {
  z(o, e, !0);
}
function D(o, ...e) {
  y(() => {
    e.forEach((t) => {
      t && (t instanceof Function ? t(o) : t.current = o);
    });
  }, [o, ...e]);
}
const S = H(null), Qe = H(null);
function Ue({ children: o }) {
  const e = q(S), t = F();
  return y(() => {
    e && (t.current.matrixWorld = e.group.matrixWorld);
  }, [e]), /* @__PURE__ */ g("group", { ref: t, matrixWorldAutoUpdate: !1, matrixAutoUpdate: !1, children: o });
}
function it(o) {
  const {
    lat: e = 0,
    lon: t = 0,
    height: i = 0,
    az: n = 0,
    el: r = 0,
    roll: m = 0,
    ellipsoid: l = We.clone(),
    children: a
  } = o, u = q(S), p = M((s) => s.invalidate), [d, h] = j(null), f = K(() => {
    if (d === null)
      return;
    const s = u && u.ellipsoid || l || null;
    d.matrix.identity(), d.visible = !!(u && u.root || l), s !== null && (s.getOrientedEastNorthUpFrame(e, t, i, n, r, m, d.matrix), d.matrix.decompose(d.position, d.quaternion, d.scale), d.updateMatrixWorld(), p());
  }, [p, u, e, t, i, n, r, m, l, d, te(l.radius)]);
  return y(() => {
    if (u !== null && d !== null)
      return d.updateMatrixWorld = function(s) {
        this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || s) && (this.matrixWorld.multiplyMatrices(u.group.matrixWorld, this.matrix), s = !0);
        const c = this.children;
        for (let v = 0, E = c.length; v < E; v++)
          c[v].updateMatrixWorld(s);
      }, () => {
        d.updateMatrixWorld = Me.prototype.updateMatrixWorld;
      };
  }, [u, d]), y(() => {
    f();
  }, [f]), y(() => {
    if (u !== null)
      return u.addEventListener("load-tileset", f), () => {
        u.removeEventListener("load-tileset", f);
      };
  }, [u, f]), /* @__PURE__ */ g("group", { ref: h, children: a });
}
const ot = _(function(e, t) {
  const { plugin: i, args: n, children: r, ...m } = e, l = q(S), [a, u] = j(null), [, p] = Ce((d) => d + 1, 0);
  if (N(() => {
    if (l === null)
      return;
    let d;
    return Array.isArray(n) ? d = new i(...n) : d = new i(n), u(d), () => {
      u(null);
    };
  }, [i, l, te(n)]), z(a, m), N(() => {
    if (a !== null)
      return l.registerPlugin(a), p(), () => {
        l.unregisterPlugin(a);
      };
  }, [a]), D(a, t), !(!a || !l.plugins.includes(a)))
    return /* @__PURE__ */ g(Qe.Provider, { value: a, children: r });
}), st = _(function(e, t) {
  const { url: i, cachedRootJson: n = null, group: r = {}, enabled: m = !0, children: l, ...a } = e, [u, p, d] = M((s) => [s.camera, s.gl, s.invalidate]), [h, f] = j(null);
  return y(() => {
    const s = () => d(), c = new Re(i, n);
    return c.addEventListener("needs-render", s), c.addEventListener("needs-update", s), f(c), () => {
      c.removeEventListener("needs-render", s), c.removeEventListener("needs-update", s), c.dispose(), f(null);
    };
  }, [i, n, d]), T(() => {
    h === null || !m || (u.updateMatrixWorld(), h.setResolutionFromRenderer(u, p), h.update());
  }), N(() => {
    if (h !== null)
      return h.setCamera(u), () => {
        h.deleteCamera(u);
      };
  }, [h, u]), D(h, t), z(h, a), h ? /* @__PURE__ */ R(Z, { children: [
    /* @__PURE__ */ g("primitive", { object: h.group, ...r }),
    /* @__PURE__ */ g(S.Provider, { value: h, children: /* @__PURE__ */ g(Ue, { children: l }) })
  ] }) : null;
}), Ie = _(function({ children: e, ...t }, i) {
  const [n] = M((a) => [a.gl]), [r, m] = j(null), l = L(() => document.createElement("div"), []);
  y(() => (l.style.pointerEvents = "none", l.style.position = "absolute", l.style.width = "100%", l.style.height = "100%", l.style.left = 0, l.style.top = 0, n.domElement.parentNode.appendChild(l), () => {
    l.remove();
  }), [l, n.domElement.parentNode]), y(() => {
    const a = Oe(l);
    return m(a), () => {
      a.unmount();
    };
  }, [l]), r !== null && r.render(
    /* @__PURE__ */ g(xe, { children: /* @__PURE__ */ g("div", { ...t, ref: i, children: e }) })
  );
});
function Ne() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
function at({ children: o, style: e, generateAttributions: t, ...i }) {
  const n = q(S), [r, m] = j([]);
  y(() => {
    if (!n)
      return;
    let p = !1;
    const d = () => {
      p || (p = !0, queueMicrotask(() => {
        m(n.getAttributions()), p = !1;
      }));
    };
    return n.addEventListener("tile-visibility-change", d), n.addEventListener("load-tileset", d), () => {
      n.removeEventListener("tile-visibility-change", d), n.removeEventListener("load-tileset", d);
    };
  }, [n]);
  const l = L(() => "class_" + Ne(), []), a = L(() => `
		#${l} a {
			color: white;
		}

		#${l} img {
			max-width: 125px;
			display: block;
			margin: 5px 0;
		}
	`, [l]);
  let u;
  if (t)
    u = t(r, l);
  else {
    const p = [];
    r.forEach((d, h) => {
      let f = null;
      d.type === "string" ? f = /* @__PURE__ */ g("div", { children: d.value }, h) : d.type === "html" ? f = /* @__PURE__ */ g("div", { dangerouslySetInnerHTML: { __html: d.value }, style: { pointerEvents: "all" } }, h) : d.type === "image" && (f = /* @__PURE__ */ g("div", { children: /* @__PURE__ */ g("img", { src: d.value }) }, h)), f && p.push(f);
    }), u = /* @__PURE__ */ R(Z, { children: [
      /* @__PURE__ */ g("style", { children: a }),
      p
    ] });
  }
  return /* @__PURE__ */ R(
    Ie,
    {
      id: l,
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
const ge = _(function(e, t) {
  const { controlsConstructor: i, domElement: n, scene: r, camera: m, ellipsoid: l, ellipsoidFrame: a, tilesRenderer: u, ...p } = e, [d] = M((x) => [x.camera]), [h] = M((x) => [x.gl]), [f] = M((x) => [x.scene]), [s] = M((x) => [x.invalidate]), [c] = M((x) => [x.get]), [v] = M((x) => [x.set]), E = q(S), b = u || E, re = m || d || null, ie = r || f || null, oe = n || h.domElement || null, se = l || (b == null ? void 0 : b.ellipsoid) || null, ae = a || (b == null ? void 0 : b.group) || null, C = L(() => new i(), [i]);
  D(C, t), y(() => {
    const x = () => s();
    return C.addEventListener("change", x), C.addEventListener("start", x), C.addEventListener("end", x), () => {
      C.removeEventListener("change", x), C.removeEventListener("start", x), C.removeEventListener("end", x);
    };
  }, [C, s]), y(() => {
    C.setCamera(re);
  }, [C, re]), y(() => {
    C.setScene(ie);
  }, [C, ie]), y(() => {
    C.isGlobeControls && C.setEllipsoid(se, ae);
  }, [C, se, ae]), y(() => (C.attach(oe), () => {
    C.detach();
  }), [C, oe]), y(() => {
    const x = c().controls;
    return v({ controls: C }), () => v({ controls: x });
  }, [C, c, v]), T(() => {
    C.update();
  }, -1), De(C, p);
}), lt = _(function(e, t) {
  return /* @__PURE__ */ g(ge, { ...e, ref: t, controlsConstructor: Pe });
}), ct = _(function(e, t) {
  return /* @__PURE__ */ g(ge, { ...e, ref: t, controlsConstructor: Fe });
}), w = /* @__PURE__ */ new P(), W = /* @__PURE__ */ new P(), k = /* @__PURE__ */ new P(), V = /* @__PURE__ */ new A(), $ = /* @__PURE__ */ new A(), Q = /* @__PURE__ */ new ee(), B = {};
function Ge(o, e, t, i) {
  Q.origin.copy(o.position), Q.direction.set(0, 0, -1).transformDirection(o.matrixWorld), Q.applyMatrix4(t.matrixWorldInverse), e.closestPointToRayEstimate(Q, k), k.applyMatrix4(t.matrixWorld), W.set(0, 0, -1).transformDirection(o.matrixWorld);
  const n = k.sub(o.position).dot(W);
  return i.copy(o.position).addScaledVector(W, n), i;
}
function Ve(o) {
  const { defaultScene: e, defaultCamera: t, overrideRenderLoop: i = !0, renderPriority: n = 1 } = o, r = L(() => new qe(), []), [m, l, a, u] = M((p) => [p.set, p.size, p.gl, p.scene]);
  y(() => {
    m({ camera: r });
  }, [m, r]), y(() => {
    r.left = -l.width / 2, r.right = l.width / 2, r.top = l.height / 2, r.bottom = -l.height / 2, r.near = 0, r.far = 2e3, r.position.z = r.far / 2, r.updateProjectionMatrix();
  }, [r, l]), T(() => {
    i && a.render(e, t);
    const p = a.autoClear;
    a.autoClear = !1, a.clearDepth(), a.render(u, r), a.autoClear = p;
  }, n);
}
function ue() {
  const o = F();
  return y(() => {
    const t = o.current.attributes.position;
    for (let i = 0, n = t.count; i < n; i++)
      w.fromBufferAttribute(t, i), w.y > 0 && (w.x = 0, t.setXYZ(i, ...w));
  }), /* @__PURE__ */ g("boxGeometry", { ref: o });
}
function $e({ northColor: o = 15684432, southColor: e = 16777215 }) {
  const [t, i] = j(), n = F();
  return y(() => {
    i(n.current);
  }, []), /* @__PURE__ */ R("group", { scale: 0.5, ref: n, children: [
    /* @__PURE__ */ g("ambientLight", { intensity: 1 }),
    /* @__PURE__ */ g("directionalLight", { position: [0, 2, 3], intensity: 3, target: t }),
    /* @__PURE__ */ g("directionalLight", { position: [0, -2, -3], intensity: 3, target: t }),
    /* @__PURE__ */ R("mesh", { children: [
      /* @__PURE__ */ g("sphereGeometry", {}),
      /* @__PURE__ */ g("meshBasicMaterial", { color: 0, opacity: 0.3, transparent: !0, side: we })
    ] }),
    /* @__PURE__ */ R("group", { scale: [0.5, 1, 0.15], children: [
      /* @__PURE__ */ R("mesh", { "position-y": 0.5, children: [
        /* @__PURE__ */ g(ue, {}),
        /* @__PURE__ */ g("meshStandardMaterial", { color: o })
      ] }),
      /* @__PURE__ */ R("mesh", { "position-y": -0.5, "rotation-x": Math.PI, children: [
        /* @__PURE__ */ g(ue, {}),
        /* @__PURE__ */ g("meshStandardMaterial", { color: e })
      ] })
    ] })
  ] });
}
function ut({ children: o, overrideRenderLoop: e, mode: t = "3d", margin: i = 10, scale: n = 35, visible: r = !0, ...m }) {
  const [l, a, u] = M((c) => [c.camera, c.scene, c.size]), p = q(S), d = F(null), h = L(() => new Le(), []);
  let f, s;
  return Array.isArray(i) ? (f = i[0], s = i[1]) : (f = i, s = i), T(() => {
    if (p === null || d.current === null)
      return null;
    const { ellipsoid: c } = p, v = d.current;
    if (Ge(l, c, p.group, k).applyMatrix4(p.group.matrixWorldInverse), c.getPositionToCartographic(k, B), c.getEastNorthUpFrame(B.lat, B.lon, 0, $).premultiply(p.group.matrixWorld), $.invert(), V.copy(l.matrixWorld).premultiply($), t.toLowerCase() === "3d")
      v.quaternion.setFromRotationMatrix(V).invert();
    else if (w.set(0, 1, 0).transformDirection(V).normalize(), w.z = 0, w.normalize(), w.length() === 0)
      v.quaternion.identity();
    else {
      const E = W.set(0, 1, 0).angleTo(w);
      W.cross(w).normalize(), v.quaternion.setFromAxisAngle(W, -E);
    }
  }), o || (o = /* @__PURE__ */ g($e, {})), r ? be(
    /* @__PURE__ */ R(Z, { children: [
      /* @__PURE__ */ g(
        "group",
        {
          ref: d,
          scale: n,
          position: [
            u.width / 2 - f - n / 2,
            -u.height / 2 + s + n / 2,
            0
          ],
          ...m,
          children: o
        }
      ),
      /* @__PURE__ */ g(
        Ve,
        {
          defaultCamera: l,
          defaultScene: a,
          overrideRenderLoop: e,
          renderPriority: 10
        }
      )
    ] }),
    h,
    { events: { priority: 10 } }
  ) : null;
}
const dt = _(function(e, t) {
  const {
    mode: i = "perspective",
    onBeforeToggle: n,
    perspectiveCamera: r,
    orthographicCamera: m,
    ...l
  } = e, [a, u, p, d, h, f] = M((c) => [c.set, c.get, c.invalidate, c.controls, c.camera, c.size]), s = L(() => {
    const c = new Te();
    return c.autoSync = !1, h.isOrthographicCamera ? (c.orthographicCamera.copy(h), c.mode = "orthographic") : c.perspectiveCamera.copy(h), c.syncCameras(), c.mode = i, c;
  }, []);
  y(() => {
    const { perspectiveCamera: c, orthographicCamera: v } = s, E = f.width / f.height;
    c.aspect = E, c.updateProjectionMatrix(), v.left = -v.top * E, v.right = -v.left, c.updateProjectionMatrix();
  }, [s, f]), D(s, t), y(() => {
    const c = ({ camera: v }) => {
      a(() => ({ camera: v }));
    };
    return a(() => ({ camera: s.camera })), s.addEventListener("camera-change", c), () => {
      s.removeEventListener("camera-change", c);
    };
  }, [s, a]), y(() => {
    const c = s.perspectiveCamera, v = s.orthographicCamera;
    return s.perspectiveCamera = r || c, s.orthographicCamera = m || v, a(() => ({ camera: s.camera })), () => {
      s.perspectiveCamera = c, s.orthographicCamera = v;
    };
  }, [r, m, s, a]), y(() => {
    if (i !== s.mode) {
      const c = i === "orthographic" ? s.orthographicCamera : s.perspectiveCamera;
      n ? n(s, c) : d && d.isEnvironmentControls ? (d.getPivotPoint(s.fixedPoint), s.syncCameras(), d.adjustCamera(s.perspectiveCamera), d.adjustCamera(s.orthographicCamera)) : (s.fixedPoint.set(0, 0, -1).transformDirection(s.camera.matrixWorld).multiplyScalar(50).add(s.camera.position), s.syncCameras()), s.toggle(), p();
    }
  }, [i, s, p, d, n]), y(() => {
    const c = () => p();
    return s.addEventListener("transition-start", c), s.addEventListener("change", c), s.addEventListener("transition-end", c), () => {
      s.removeEventListener("transition-start", c), s.removeEventListener("change", c), s.removeEventListener("transition-end", c);
    };
  }, [s, p]), z(s, l), T(() => {
    s.update(), d && (d.enabled = !s.animating);
    const { camera: c, size: v } = u();
    if (!m && c === s.orthographicCamera) {
      const E = v.width / v.height, b = s.orthographicCamera;
      E !== b.right && (b.bottom = -1, b.top = 1, b.left = -E, b.right = E, b.updateProjectionMatrix());
    }
    s.animating && p();
  }, -1);
});
function ye(...o) {
  return K((e) => {
    o.forEach((t) => {
      t && (typeof t == "function" ? t(e) : t.current = e);
    });
  }, o);
}
function Y(o, e) {
  e(o) || o.children.forEach((t) => {
    Y(t, e);
  });
}
class Be extends me {
  constructor() {
    super(), this.objects = /* @__PURE__ */ new Set(), this.observed = /* @__PURE__ */ new Set(), this._addedCallback = ({ child: e }) => {
      Y(e, (t) => this.observed.has(t) ? !0 : (this.objects.add(t), t.addEventListener("childadded", this._addedCallback), t.addEventListener("childremoved", this._removedCallback), this.dispatchEvent({ type: "childadded", child: e }), !1));
    }, this._removedCallback = ({ child: e }) => {
      Y(e, (t) => this.observed.has(t) ? !0 : (this.objects.delete(t), t.removeEventListener("childadded", this._addedCallback), t.removeEventListener("childremoved", this._removedCallback), this.dispatchEvent({ type: "childremoved", child: e }), !1));
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
const J = /* @__PURE__ */ new Se(), O = /* @__PURE__ */ new he(), U = /* @__PURE__ */ new he(), de = /* @__PURE__ */ new _e(), I = /* @__PURE__ */ new P(), pe = /* @__PURE__ */ new A();
class Je extends me {
  constructor() {
    super(), this.autoRun = !0, this.queryMap = /* @__PURE__ */ new Map(), this.index = 0, this.queued = [], this.scheduled = !1, this.duration = 1, this.objects = [], this.observer = new Be(), this.ellipsoid = new je(), this.frame = new A(), this.cameras = /* @__PURE__ */ new Set();
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
    for (t.forEach((r, m) => {
      pe.copy(r.matrixWorldInverse).premultiply(r.projectionMatrix), I.set(0, 0, -1).transformDirection(r.matrixWorld), O.start.setFromMatrixPosition(r.matrixWorld), O.end.addVectors(I, O.start);
      for (let l = 0, a = e.length; l < a; l++) {
        const u = e[l], { ray: p } = u;
        let d, h;
        if (u.point === null)
          U.start.copy(p.origin), p.at(1, U.end), Xe(O, U, de), u.distance = de.x * (1 - Math.abs(I.dot(p.direction))), u.inFrustum = !0;
        else {
          const f = U.start;
          f.copy(u.point).applyMatrix4(pe), f.x > -1 && f.x < 1 && f.y > -1 && f.y < 1 && f.z > -1 && f.z < 1 ? (u.distance = f.subVectors(u.point, O.start).dot(I), u.inFrustum = !0) : (u.distance = 0, u.inFrustum = !1);
        }
        m === 0 ? (u.distance = d, u.inFrustum = h) : (u.inFrustum = u.inFrustum || h, u.distance = Math.min(u.distance, d));
      }
    }), t.length !== 0 && e.sort((r, m) => r.point === null != (m.point === null) ? r.point === null ? 1 : -1 : r.inFrustum !== m.inFrustum ? r.inFrustum ? 1 : -1 : r.distance < 0 != m.distance < 0 ? r.distance < 0 ? -1 : 1 : m.distance - r.distance); e.length !== 0 && performance.now() - n < i; ) {
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
    J.ray.copy(e.ray), J.far = "lat" in e ? 1e4 + Math.max(...this.ellipsoid.radius) : 1 / 0;
    const t = J.intersectObjects(this.objects)[0] || null;
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
        const { lat: m, lon: l, ray: a } = r;
        i.getCartographicToPosition(m, l, 1e4, a.origin).applyMatrix4(n), i.getCartographicToNormal(m, l, a.direction).transformDirection(n).multiplyScalar(-1);
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
    const { ellipsoid: n, frame: r } = this, m = this.index++, l = new ee();
    n.getCartographicToPosition(e, t, 1e4, l.origin).applyMatrix4(r), n.getCartographicToNormal(e, t, l.direction).transformDirection(r).multiplyScalar(-1);
    const a = {
      ray: l.clone(),
      lat: e,
      lon: t,
      callback: i,
      queued: !1,
      distance: -1,
      point: null
    };
    return this.queryMap.set(m, a), this._enqueue(a), m;
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
const Xe = (function() {
  const o = new P(), e = new P(), t = new P();
  return function(n, r, m) {
    const l = n.start, a = o, u = r.start, p = e;
    t.subVectors(l, u), o.subVectors(n.end, n.start), e.subVectors(r.end, r.start);
    const d = t.dot(p), h = p.dot(a), f = p.dot(p), s = t.dot(a), v = a.dot(a) * f - h * h;
    let E, b;
    v !== 0 ? E = (d * h - s * f) / v : E = 0, b = (d + E * h) / f, m.x = E, m.y = b;
  };
})(), ne = H(null), G = /* @__PURE__ */ new A(), X = /* @__PURE__ */ new ee(), pt = _(function(e, t) {
  const {
    interpolationFactor: i = 0.025,
    onQueryUpdate: n = null,
    ...r
  } = e, m = q(S), l = q(ne), a = M(({ invalidate: s }) => s), u = L(() => new P(), []), p = L(() => ({ value: !1 }), []), d = L(() => ({ value: !1 }), []), h = F(null), f = K((s) => {
    if (m === null || s === null || h.current === null)
      return;
    const { lat: c, lon: v, rayorigin: E, raydirection: b } = r;
    c !== null && v !== null ? (u.copy(s.point), d.value = !0, l.ellipsoid.getObjectFrame(c, v, 0, 0, 0, 0, G, fe).premultiply(m.group.matrixWorld), h.current.quaternion.setFromRotationMatrix(G), a()) : E !== null && b !== null && (u.copy(s.point), d.value = !0, h.current.quaternion.identity(), a()), n && n(s);
  }, [a, d, l.ellipsoid, r, u, m, n]);
  return T((s, c) => {
    if (h.current && (h.current.visible = p.value), h.current && d.value)
      if (p.value === !1)
        p.value = !0, h.current.position.copy(u);
      else {
        const v = 1 - 2 ** (-c / i);
        h.current.position.distanceToSquared(u) > 1e-6 ? (h.current.position.lerp(
          u,
          i === 0 ? 1 : v
        ), a()) : h.current.position.copy(u);
      }
  }), /* @__PURE__ */ g(
    Ye,
    {
      ref: ye(h, t),
      onQueryUpdate: f,
      ...r
    }
  );
}), Ye = _(function(e, t) {
  const {
    component: i = /* @__PURE__ */ g("group", {}),
    lat: n = null,
    lon: r = null,
    rayorigin: m = null,
    raydirection: l = null,
    onQueryUpdate: a = null,
    ...u
  } = e, p = F(null), d = q(S), h = q(ne), f = M(({ invalidate: c }) => c), s = L(() => new P(), []);
  return y(() => {
    const c = (v) => {
      a ? a(v) : d && v !== null && p.current !== null && (n !== null && r !== null ? (p.current.position.copy(v.point), h.ellipsoid.getObjectFrame(n, r, 0, 0, 0, 0, G, fe).premultiply(d.group.matrixWorld), p.current.quaternion.setFromRotationMatrix(G), f()) : m !== null && l !== null && (p.current.position.copy(v.point), p.current.quaternion.identity(), f()));
    };
    if (n !== null && r !== null) {
      const v = h.registerLatLonQuery(n, r, c);
      return () => h.unregisterQuery(v);
    } else if (m !== null && l !== null) {
      X.origin.copy(m), X.direction.copy(l);
      const v = h.registerRayQuery(X, c);
      return () => h.unregisterQuery(v);
    }
  }, [n, r, m, l, h, d, f, s, a]), Ee(i, { ...u, ref: ye(p, t), raycast: () => !1 });
}), mt = _(function(e, t) {
  const i = M(({ scene: p }) => p), {
    scene: n = i,
    children: r,
    ...m
  } = e, l = q(S), a = L(() => new Je(), []), u = M(({ camera: p }) => p);
  return z(a, m), y(() => () => a.dispose(), [a]), y(() => {
    a.setScene(...Array.isArray(n) ? n : [n]);
  }, [a, n]), y(() => {
    a.addCamera(u);
  }, [a, u]), T(() => {
    l && a.setEllipsoidFromTilesRenderer(l);
  }), D(a, t), /* @__PURE__ */ g(ne.Provider, { value: a, children: /* @__PURE__ */ g("group", { matrixAutoUpdate: !1, matrixWorldAutoUpdate: !1, children: r }) });
});
export {
  pt as AnimatedSettledObject,
  dt as CameraTransition,
  Ie as CanvasDOMOverlay,
  ut as CompassGizmo,
  it as EastNorthUpFrame,
  lt as EnvironmentControls,
  ct as GlobeControls,
  Ye as SettledObject,
  mt as SettledObjects,
  at as TilesAttributionOverlay,
  ot as TilesPlugin,
  Qe as TilesPluginContext,
  st as TilesRenderer,
  S as TilesRendererContext
};
//# sourceMappingURL=index.r3f.js.map
