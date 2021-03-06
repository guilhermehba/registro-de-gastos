"use strict";
(self.webpackChunkmyApp = self.webpackChunkmyApp || []).push([
  [179],
  {
    702: () => {
      function Y(t) {
        return "function" == typeof t;
      }
      function no(t) {
        const n = t((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const _i = no(
        (t) =>
          function (n) {
            t(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function ro(t, e) {
        if (t) {
          const n = t.indexOf(e);
          0 <= n && t.splice(n, 1);
        }
      }
      class dt {
        constructor(e) {
          (this.initialTeardown = e),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let e;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (Y(r))
              try {
                r();
              } catch (i) {
                e = i instanceof _i ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  Zd(i);
                } catch (s) {
                  (e = null != e ? e : []),
                    s instanceof _i ? (e = [...e, ...s.errors]) : e.push(s);
                }
            }
            if (e) throw new _i(e);
          }
        }
        add(e) {
          var n;
          if (e && e !== this)
            if (this.closed) Zd(e);
            else {
              if (e instanceof dt) {
                if (e.closed || e._hasParent(this)) return;
                e._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                e
              );
            }
        }
        _hasParent(e) {
          const { _parentage: n } = this;
          return n === e || (Array.isArray(n) && n.includes(e));
        }
        _addParent(e) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
        }
        _removeParent(e) {
          const { _parentage: n } = this;
          n === e ? (this._parentage = null) : Array.isArray(n) && ro(n, e);
        }
        remove(e) {
          const { _finalizers: n } = this;
          n && ro(n, e), e instanceof dt && e._removeParent(this);
        }
      }
      dt.EMPTY = (() => {
        const t = new dt();
        return (t.closed = !0), t;
      })();
      const Wd = dt.EMPTY;
      function Qd(t) {
        return (
          t instanceof dt ||
          (t && "closed" in t && Y(t.remove) && Y(t.add) && Y(t.unsubscribe))
        );
      }
      function Zd(t) {
        Y(t) ? t() : t.unsubscribe();
      }
      const Ln = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Di = {
          setTimeout(t, e, ...n) {
            const { delegate: r } = Di;
            return (null == r ? void 0 : r.setTimeout)
              ? r.setTimeout(t, e, ...n)
              : setTimeout(t, e, ...n);
          },
          clearTimeout(t) {
            const { delegate: e } = Di;
            return ((null == e ? void 0 : e.clearTimeout) || clearTimeout)(t);
          },
          delegate: void 0,
        };
      function Kd(t) {
        Di.setTimeout(() => {
          const { onUnhandledError: e } = Ln;
          if (!e) throw t;
          e(t);
        });
      }
      function Jd() {}
      const pC = wa("C", void 0, void 0);
      function wa(t, e, n) {
        return { kind: t, value: e, error: n };
      }
      let Bn = null;
      function Ci(t) {
        if (Ln.useDeprecatedSynchronousErrorHandling) {
          const e = !Bn;
          if ((e && (Bn = { errorThrown: !1, error: null }), t(), e)) {
            const { errorThrown: n, error: r } = Bn;
            if (((Bn = null), n)) throw r;
          }
        } else t();
      }
      class ba extends dt {
        constructor(e) {
          super(),
            (this.isStopped = !1),
            e
              ? ((this.destination = e), Qd(e) && e.add(this))
              : (this.destination = CC);
        }
        static create(e, n, r) {
          return new Ei(e, n, r);
        }
        next(e) {
          this.isStopped
            ? Aa(
                (function mC(t) {
                  return wa("N", t, void 0);
                })(e),
                this
              )
            : this._next(e);
        }
        error(e) {
          this.isStopped
            ? Aa(
                (function gC(t) {
                  return wa("E", void 0, t);
                })(e),
                this
              )
            : ((this.isStopped = !0), this._error(e));
        }
        complete() {
          this.isStopped
            ? Aa(pC, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(e) {
          this.destination.next(e);
        }
        _error(e) {
          try {
            this.destination.error(e);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const vC = Function.prototype.bind;
      function Ma(t, e) {
        return vC.call(t, e);
      }
      class _C {
        constructor(e) {
          this.partialObserver = e;
        }
        next(e) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(e);
            } catch (r) {
              wi(r);
            }
        }
        error(e) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(e);
            } catch (r) {
              wi(r);
            }
          else wi(e);
        }
        complete() {
          const { partialObserver: e } = this;
          if (e.complete)
            try {
              e.complete();
            } catch (n) {
              wi(n);
            }
        }
      }
      class Ei extends ba {
        constructor(e, n, r) {
          let o;
          if ((super(), Y(e) || !e))
            o = {
              next: null != e ? e : void 0,
              error: null != n ? n : void 0,
              complete: null != r ? r : void 0,
            };
          else {
            let i;
            this && Ln.useDeprecatedNextContext
              ? ((i = Object.create(e)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: e.next && Ma(e.next, i),
                  error: e.error && Ma(e.error, i),
                  complete: e.complete && Ma(e.complete, i),
                }))
              : (o = e);
          }
          this.destination = new _C(o);
        }
      }
      function wi(t) {
        Ln.useDeprecatedSynchronousErrorHandling
          ? (function yC(t) {
              Ln.useDeprecatedSynchronousErrorHandling &&
                Bn &&
                ((Bn.errorThrown = !0), (Bn.error = t));
            })(t)
          : Kd(t);
      }
      function Aa(t, e) {
        const { onStoppedNotification: n } = Ln;
        n && Di.setTimeout(() => n(t, e));
      }
      const CC = {
          closed: !0,
          next: Jd,
          error: function DC(t) {
            throw t;
          },
          complete: Jd,
        },
        Ta =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function jn(t) {
        return t;
      }
      let oe = (() => {
        class t {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new t();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function wC(t) {
              return (
                (t && t instanceof ba) ||
                ((function EC(t) {
                  return t && Y(t.next) && Y(t.error) && Y(t.complete);
                })(t) &&
                  Qd(t))
              );
            })(n)
              ? n
              : new Ei(n, r, o);
            return (
              Ci(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Xd(r))((o, i) => {
              const s = new Ei({
                next: (a) => {
                  try {
                    n(a);
                  } catch (l) {
                    i(l), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [Ta]() {
            return this;
          }
          pipe(...n) {
            return (function Yd(t) {
              return 0 === t.length
                ? jn
                : 1 === t.length
                ? t[0]
                : function (n) {
                    return t.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = Xd(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (t.create = (e) => new t(e)), t;
      })();
      function Xd(t) {
        var e;
        return null !== (e = null != t ? t : Ln.Promise) && void 0 !== e
          ? e
          : Promise;
      }
      const bC = no(
        (t) =>
          function () {
            t(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let en = (() => {
        class t extends oe {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new ef(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new bC();
          }
          next(n) {
            Ci(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            Ci(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            Ci(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? Wd
              : ((this.currentObservers = null),
                i.push(n),
                new dt(() => {
                  (this.currentObservers = null), ro(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new oe();
            return (n.source = this), n;
          }
        }
        return (t.create = (e, n) => new ef(e, n)), t;
      })();
      class ef extends en {
        constructor(e, n) {
          super(), (this.destination = e), (this.source = n);
        }
        next(e) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, e);
        }
        error(e) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, e);
        }
        complete() {
          var e, n;
          null ===
            (n =
              null === (e = this.destination) || void 0 === e
                ? void 0
                : e.complete) ||
            void 0 === n ||
            n.call(e);
        }
        _subscribe(e) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(e)) && void 0 !== r
            ? r
            : Wd;
        }
      }
      function tf(t) {
        return Y(null == t ? void 0 : t.lift);
      }
      function Ie(t) {
        return (e) => {
          if (tf(e))
            return e.lift(function (n) {
              try {
                return t(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Ae(t, e, n, r, o) {
        return new MC(t, e, n, r, o);
      }
      class MC extends ba {
        constructor(e, n, r, o, i, s) {
          super(e),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (l) {
                    e.error(l);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (l) {
                    e.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    e.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var e;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (e = this.onFinalize) ||
                  void 0 === e ||
                  e.call(this));
          }
        }
      }
      function z(t, e) {
        return Ie((n, r) => {
          let o = 0;
          n.subscribe(
            Ae(r, (i) => {
              r.next(t.call(e, i, o++));
            })
          );
        });
      }
      function Un(t) {
        return this instanceof Un ? ((this.v = t), this) : new Un(t);
      }
      function SC(t, e, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          r = n.apply(t, e || []),
          i = [];
        return (
          (o = {}),
          s("next"),
          s("throw"),
          s("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function s(f) {
          r[f] &&
            (o[f] = function (h) {
              return new Promise(function (p, m) {
                i.push([f, h, p, m]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function l(f) {
              f.value instanceof Un
                ? Promise.resolve(f.value.v).then(u, c)
                : d(i[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(i[0][3], p);
          }
        }
        function u(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
        }
      }
      function IC(t) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          e = t[Symbol.asyncIterator];
        return e
          ? e.call(t)
          : ((t = (function of(t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                n = e && t[e],
                r = 0;
              if (n) return n.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && r >= t.length && (t = void 0),
                      { value: t && t[r++], done: !t }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(t)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            t[i] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function o(i, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    i({ value: u, done: a });
                  }, s);
                })(a, l, (s = t[i](s)).done, s.value);
              });
            };
        }
      }
      const sf = (t) =>
        t && "number" == typeof t.length && "function" != typeof t;
      function af(t) {
        return Y(null == t ? void 0 : t.then);
      }
      function lf(t) {
        return Y(t[Ta]);
      }
      function uf(t) {
        return (
          Symbol.asyncIterator &&
          Y(null == t ? void 0 : t[Symbol.asyncIterator])
        );
      }
      function cf(t) {
        return new TypeError(
          `You provided ${
            null !== t && "object" == typeof t ? "an invalid object" : `'${t}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const df = (function xC() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function ff(t) {
        return Y(null == t ? void 0 : t[df]);
      }
      function hf(t) {
        return SC(this, arguments, function* () {
          const n = t.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield Un(n.read());
              if (o) return yield Un(void 0);
              yield yield Un(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function pf(t) {
        return Y(null == t ? void 0 : t.getReader);
      }
      function Vt(t) {
        if (t instanceof oe) return t;
        if (null != t) {
          if (lf(t))
            return (function NC(t) {
              return new oe((e) => {
                const n = t[Ta]();
                if (Y(n.subscribe)) return n.subscribe(e);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(t);
          if (sf(t))
            return (function OC(t) {
              return new oe((e) => {
                for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
                e.complete();
              });
            })(t);
          if (af(t))
            return (function FC(t) {
              return new oe((e) => {
                t.then(
                  (n) => {
                    e.closed || (e.next(n), e.complete());
                  },
                  (n) => e.error(n)
                ).then(null, Kd);
              });
            })(t);
          if (uf(t)) return gf(t);
          if (ff(t))
            return (function PC(t) {
              return new oe((e) => {
                for (const n of t) if ((e.next(n), e.closed)) return;
                e.complete();
              });
            })(t);
          if (pf(t))
            return (function kC(t) {
              return gf(hf(t));
            })(t);
        }
        throw cf(t);
      }
      function gf(t) {
        return new oe((e) => {
          (function VC(t, e) {
            var n, r, o, i;
            return (function AC(t, e, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    u(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, l);
                }
                u((r = r.apply(t, e || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = IC(t); !(r = yield n.next()).done; )
                  if ((e.next(r.value), e.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              e.complete();
            });
          })(t, e).catch((n) => e.error(n));
        });
      }
      function tn(t, e, n, r = 0, o = !1) {
        const i = e.schedule(function () {
          n(), o ? t.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((t.add(i), !o)) return i;
      }
      function Te(t, e, n = 1 / 0) {
        return Y(e)
          ? Te((r, o) => z((i, s) => e(r, i, o, s))(Vt(t(r, o))), n)
          : ("number" == typeof e && (n = e),
            Ie((r, o) =>
              (function LC(t, e, n, r, o, i, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && e.complete();
                  },
                  h = (m) => (u < r ? p(m) : l.push(m)),
                  p = (m) => {
                    i && e.next(m), u++;
                    let D = !1;
                    Vt(n(m, c++)).subscribe(
                      Ae(
                        e,
                        (v) => {
                          null == o || o(v), i ? h(v) : e.next(v);
                        },
                        () => {
                          D = !0;
                        },
                        void 0,
                        () => {
                          if (D)
                            try {
                              for (u--; l.length && u < r; ) {
                                const v = l.shift();
                                s ? tn(e, s, () => p(v)) : p(v);
                              }
                              f();
                            } catch (v) {
                              e.error(v);
                            }
                        }
                      )
                    );
                  };
                return (
                  t.subscribe(
                    Ae(e, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    null == a || a();
                  }
                );
              })(r, o, t, n)
            ));
      }
      function oo(t = 1 / 0) {
        return Te(jn, t);
      }
      const nn = new oe((t) => t.complete());
      function Ia(t) {
        return t[t.length - 1];
      }
      function mf(t) {
        return Y(Ia(t)) ? t.pop() : void 0;
      }
      function io(t) {
        return (function jC(t) {
          return t && Y(t.schedule);
        })(Ia(t))
          ? t.pop()
          : void 0;
      }
      function yf(t, e = 0) {
        return Ie((n, r) => {
          n.subscribe(
            Ae(
              r,
              (o) => tn(r, t, () => r.next(o), e),
              () => tn(r, t, () => r.complete(), e),
              (o) => tn(r, t, () => r.error(o), e)
            )
          );
        });
      }
      function vf(t, e = 0) {
        return Ie((n, r) => {
          r.add(t.schedule(() => n.subscribe(r), e));
        });
      }
      function _f(t, e) {
        if (!t) throw new Error("Iterable cannot be null");
        return new oe((n) => {
          tn(n, e, () => {
            const r = t[Symbol.asyncIterator]();
            tn(
              n,
              e,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Ce(t, e) {
        return e
          ? (function WC(t, e) {
              if (null != t) {
                if (lf(t))
                  return (function HC(t, e) {
                    return Vt(t).pipe(vf(e), yf(e));
                  })(t, e);
                if (sf(t))
                  return (function GC(t, e) {
                    return new oe((n) => {
                      let r = 0;
                      return e.schedule(function () {
                        r === t.length
                          ? n.complete()
                          : (n.next(t[r++]), n.closed || this.schedule());
                      });
                    });
                  })(t, e);
                if (af(t))
                  return (function $C(t, e) {
                    return Vt(t).pipe(vf(e), yf(e));
                  })(t, e);
                if (uf(t)) return _f(t, e);
                if (ff(t))
                  return (function qC(t, e) {
                    return new oe((n) => {
                      let r;
                      return (
                        tn(n, e, () => {
                          (r = t[df]()),
                            tn(
                              n,
                              e,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => Y(null == r ? void 0 : r.return) && r.return()
                      );
                    });
                  })(t, e);
                if (pf(t))
                  return (function zC(t, e) {
                    return _f(hf(t), e);
                  })(t, e);
              }
              throw cf(t);
            })(t, e)
          : Vt(t);
      }
      function bi(t) {
        return t <= 0
          ? () => nn
          : Ie((e, n) => {
              let r = 0;
              e.subscribe(
                Ae(n, (o) => {
                  ++r <= t && (n.next(o), t <= r && n.complete());
                })
              );
            });
      }
      function Ra(t, e, ...n) {
        return !0 === e
          ? (t(), null)
          : !1 === e
          ? null
          : e(...n)
              .pipe(bi(1))
              .subscribe(() => t());
      }
      function K(t) {
        for (let e in t) if (t[e] === K) return e;
        throw Error("Could not find renamed property on target object.");
      }
      function xa(t, e) {
        for (const n in e)
          e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n]);
      }
      function W(t) {
        if ("string" == typeof t) return t;
        if (Array.isArray(t)) return "[" + t.map(W).join(", ") + "]";
        if (null == t) return "" + t;
        if (t.overriddenName) return `${t.overriddenName}`;
        if (t.name) return `${t.name}`;
        const e = t.toString();
        if (null == e) return "" + e;
        const n = e.indexOf("\n");
        return -1 === n ? e : e.substring(0, n);
      }
      function Na(t, e) {
        return null == t || "" === t
          ? null === e
            ? ""
            : e
          : null == e || "" === e
          ? t
          : t + " " + e;
      }
      const KC = K({ __forward_ref__: K });
      function X(t) {
        return (
          (t.__forward_ref__ = X),
          (t.toString = function () {
            return W(this());
          }),
          t
        );
      }
      function P(t) {
        return Df(t) ? t() : t;
      }
      function Df(t) {
        return (
          "function" == typeof t &&
          t.hasOwnProperty(KC) &&
          t.__forward_ref__ === X
        );
      }
      class $ extends Error {
        constructor(e, n) {
          super(
            (function Oa(t, e) {
              return `NG0${Math.abs(t)}${e ? ": " + e : ""}`;
            })(e, n)
          ),
            (this.code = e);
        }
      }
      function R(t) {
        return "string" == typeof t ? t : null == t ? "" : String(t);
      }
      function je(t) {
        return "function" == typeof t
          ? t.name || t.toString()
          : "object" == typeof t && null != t && "function" == typeof t.type
          ? t.type.name || t.type.toString()
          : R(t);
      }
      function Mi(t, e) {
        const n = e ? ` in ${e}` : "";
        throw new $(-201, `No provider for ${je(t)} found${n}`);
      }
      function et(t, e) {
        null == t &&
          (function re(t, e, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${t}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${e} <=Actual]`)
            );
          })(e, t, null, "!=");
      }
      function x(t) {
        return {
          token: t.token,
          providedIn: t.providedIn || null,
          factory: t.factory,
          value: void 0,
        };
      }
      function Qe(t) {
        return { providers: t.providers || [], imports: t.imports || [] };
      }
      function Fa(t) {
        return Cf(t, Ai) || Cf(t, wf);
      }
      function Cf(t, e) {
        return t.hasOwnProperty(e) ? t[e] : null;
      }
      function Ef(t) {
        return t && (t.hasOwnProperty(Pa) || t.hasOwnProperty(rE))
          ? t[Pa]
          : null;
      }
      const Ai = K({ ??prov: K }),
        Pa = K({ ??inj: K }),
        wf = K({ ngInjectableDef: K }),
        rE = K({ ngInjectorDef: K });
      var I = (() => (
        ((I = I || {})[(I.Default = 0)] = "Default"),
        (I[(I.Host = 1)] = "Host"),
        (I[(I.Self = 2)] = "Self"),
        (I[(I.SkipSelf = 4)] = "SkipSelf"),
        (I[(I.Optional = 8)] = "Optional"),
        I
      ))();
      let ka;
      function _n(t) {
        const e = ka;
        return (ka = t), e;
      }
      function bf(t, e, n) {
        const r = Fa(t);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & I.Optional
          ? null
          : void 0 !== e
          ? e
          : void Mi(W(t), "Injector");
      }
      function Dn(t) {
        return { toString: t }.toString();
      }
      var bt = (() => (
          ((bt = bt || {})[(bt.OnPush = 0)] = "OnPush"),
          (bt[(bt.Default = 1)] = "Default"),
          bt
        ))(),
        Lt = (() => {
          return (
            ((t = Lt || (Lt = {}))[(t.Emulated = 0)] = "Emulated"),
            (t[(t.None = 2)] = "None"),
            (t[(t.ShadowDom = 3)] = "ShadowDom"),
            Lt
          );
          var t;
        })();
      const iE = "undefined" != typeof globalThis && globalThis,
        sE = "undefined" != typeof window && window,
        aE =
          "undefined" != typeof self &&
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          self,
        Z = iE || ("undefined" != typeof global && global) || sE || aE,
        ar = {},
        J = [],
        Ti = K({ ??cmp: K }),
        Va = K({ ??dir: K }),
        La = K({ ??pipe: K }),
        Mf = K({ ??mod: K }),
        on = K({ ??fac: K }),
        so = K({ __NG_ELEMENT_ID__: K });
      let lE = 0;
      function lr(t) {
        return Dn(() => {
          const n = {},
            r = {
              type: t.type,
              providersResolver: null,
              decls: t.decls,
              vars: t.vars,
              factory: null,
              template: t.template || null,
              consts: t.consts || null,
              ngContentSelectors: t.ngContentSelectors,
              hostBindings: t.hostBindings || null,
              hostVars: t.hostVars || 0,
              hostAttrs: t.hostAttrs || null,
              contentQueries: t.contentQueries || null,
              declaredInputs: n,
              inputs: null,
              outputs: null,
              exportAs: t.exportAs || null,
              onPush: t.changeDetection === bt.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              selectors: t.selectors || J,
              viewQuery: t.viewQuery || null,
              features: t.features || null,
              data: t.data || {},
              encapsulation: t.encapsulation || Lt.Emulated,
              id: "c",
              styles: t.styles || J,
              _: null,
              setInput: null,
              schemas: t.schemas || null,
              tView: null,
            },
            o = t.directives,
            i = t.features,
            s = t.pipes;
          return (
            (r.id += lE++),
            (r.inputs = If(t.inputs, n)),
            (r.outputs = If(t.outputs)),
            i && i.forEach((a) => a(r)),
            (r.directiveDefs = o
              ? () => ("function" == typeof o ? o() : o).map(Af)
              : null),
            (r.pipeDefs = s
              ? () => ("function" == typeof s ? s() : s).map(Tf)
              : null),
            r
          );
        });
      }
      function Af(t) {
        return (
          Ne(t) ||
          (function Cn(t) {
            return t[Va] || null;
          })(t)
        );
      }
      function Tf(t) {
        return (function Hn(t) {
          return t[La] || null;
        })(t);
      }
      const Sf = {};
      function tt(t) {
        return Dn(() => {
          const e = {
            type: t.type,
            bootstrap: t.bootstrap || J,
            declarations: t.declarations || J,
            imports: t.imports || J,
            exports: t.exports || J,
            transitiveCompileScopes: null,
            schemas: t.schemas || null,
            id: t.id || null,
          };
          return null != t.id && (Sf[t.id] = t.type), e;
        });
      }
      function If(t, e) {
        if (null == t) return ar;
        const n = {};
        for (const r in t)
          if (t.hasOwnProperty(r)) {
            let o = t[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              e && (e[o] = i);
          }
        return n;
      }
      const T = lr;
      function Ze(t) {
        return {
          type: t.type,
          name: t.name,
          factory: null,
          pure: !1 !== t.pure,
          onDestroy: t.type.prototype.ngOnDestroy || null,
        };
      }
      function Ne(t) {
        return t[Ti] || null;
      }
      function ft(t, e) {
        const n = t[Mf] || null;
        if (!n && !0 === e)
          throw new Error(`Type ${W(t)} does not have '\u0275mod' property.`);
        return n;
      }
      const k = 11;
      function Bt(t) {
        return Array.isArray(t) && "object" == typeof t[1];
      }
      function At(t) {
        return Array.isArray(t) && !0 === t[1];
      }
      function Ua(t) {
        return 0 != (8 & t.flags);
      }
      function xi(t) {
        return 2 == (2 & t.flags);
      }
      function Ni(t) {
        return 1 == (1 & t.flags);
      }
      function Tt(t) {
        return null !== t.template;
      }
      function pE(t) {
        return 0 != (512 & t[2]);
      }
      function zn(t, e) {
        return t.hasOwnProperty(on) ? t[on] : null;
      }
      class yE {
        constructor(e, n, r) {
          (this.previousValue = e),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function pt() {
        return xf;
      }
      function xf(t) {
        return t.type.prototype.ngOnChanges && (t.setInput = _E), vE;
      }
      function vE() {
        const t = Of(this),
          e = null == t ? void 0 : t.current;
        if (e) {
          const n = t.previous;
          if (n === ar) t.previous = e;
          else for (let r in e) n[r] = e[r];
          (t.current = null), this.ngOnChanges(e);
        }
      }
      function _E(t, e, n, r) {
        const o =
            Of(t) ||
            (function DE(t, e) {
              return (t[Nf] = e);
            })(t, { previous: ar, current: null }),
          i = o.current || (o.current = {}),
          s = o.previous,
          a = this.declaredInputs[n],
          l = s[a];
        (i[a] = new yE(l && l.currentValue, e, s === ar)), (t[r] = e);
      }
      pt.ngInherit = !0;
      const Nf = "__ngSimpleChanges__";
      function Of(t) {
        return t[Nf] || null;
      }
      let za;
      function ce(t) {
        return !!t.listen;
      }
      const Ff = {
        createRenderer: (t, e) =>
          (function Wa() {
            return void 0 !== za
              ? za
              : "undefined" != typeof document
              ? document
              : void 0;
          })(),
      };
      function me(t) {
        for (; Array.isArray(t); ) t = t[0];
        return t;
      }
      function Oi(t, e) {
        return me(e[t]);
      }
      function mt(t, e) {
        return me(e[t.index]);
      }
      function Qa(t, e) {
        return t.data[e];
      }
      function hr(t, e) {
        return t[e];
      }
      function rt(t, e) {
        const n = e[t];
        return Bt(n) ? n : n[0];
      }
      function Pf(t) {
        return 4 == (4 & t[2]);
      }
      function Za(t) {
        return 128 == (128 & t[2]);
      }
      function En(t, e) {
        return null == e ? null : t[e];
      }
      function kf(t) {
        t[18] = 0;
      }
      function Ka(t, e) {
        t[5] += e;
        let n = t,
          r = t[3];
        for (
          ;
          null !== r && ((1 === e && 1 === n[5]) || (-1 === e && 0 === n[5]));

        )
          (r[5] += e), (n = r), (r = r[3]);
      }
      const S = {
        lFrame: Gf(null),
        bindingsEnabled: !0,
        isInCheckNoChangesMode: !1,
      };
      function Vf() {
        return S.bindingsEnabled;
      }
      function y() {
        return S.lFrame.lView;
      }
      function G() {
        return S.lFrame.tView;
      }
      function Ee() {
        let t = Lf();
        for (; null !== t && 64 === t.type; ) t = t.parent;
        return t;
      }
      function Lf() {
        return S.lFrame.currentTNode;
      }
      function jt(t, e) {
        const n = S.lFrame;
        (n.currentTNode = t), (n.isParent = e);
      }
      function Ja() {
        return S.lFrame.isParent;
      }
      function Fi() {
        return S.isInCheckNoChangesMode;
      }
      function Pi(t) {
        S.isInCheckNoChangesMode = t;
      }
      function pr() {
        return S.lFrame.bindingIndex++;
      }
      function LE(t, e) {
        const n = S.lFrame;
        (n.bindingIndex = n.bindingRootIndex = t), Xa(e);
      }
      function Xa(t) {
        S.lFrame.currentDirectiveIndex = t;
      }
      function Uf() {
        return S.lFrame.currentQueryIndex;
      }
      function tl(t) {
        S.lFrame.currentQueryIndex = t;
      }
      function jE(t) {
        const e = t[1];
        return 2 === e.type ? e.declTNode : 1 === e.type ? t[6] : null;
      }
      function Hf(t, e, n) {
        if (n & I.SkipSelf) {
          let o = e,
            i = t;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & I.Host ||
              ((o = jE(i)), null === o || ((i = i[15]), 10 & o.type)));

          );
          if (null === o) return !1;
          (e = o), (t = i);
        }
        const r = (S.lFrame = $f());
        return (r.currentTNode = e), (r.lView = t), !0;
      }
      function ki(t) {
        const e = $f(),
          n = t[1];
        (S.lFrame = e),
          (e.currentTNode = n.firstChild),
          (e.lView = t),
          (e.tView = n),
          (e.contextLView = t),
          (e.bindingIndex = n.bindingStartIndex),
          (e.inI18n = !1);
      }
      function $f() {
        const t = S.lFrame,
          e = null === t ? null : t.child;
        return null === e ? Gf(t) : e;
      }
      function Gf(t) {
        const e = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: t,
          child: null,
          inI18n: !1,
        };
        return null !== t && (t.child = e), e;
      }
      function qf() {
        const t = S.lFrame;
        return (
          (S.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t
        );
      }
      const zf = qf;
      function Vi() {
        const t = qf();
        (t.isParent = !0),
          (t.tView = null),
          (t.selectedIndex = -1),
          (t.contextLView = null),
          (t.elementDepthCount = 0),
          (t.currentDirectiveIndex = -1),
          (t.currentNamespace = null),
          (t.bindingRootIndex = -1),
          (t.bindingIndex = -1),
          (t.currentQueryIndex = 0);
      }
      function He() {
        return S.lFrame.selectedIndex;
      }
      function wn(t) {
        S.lFrame.selectedIndex = t;
      }
      function de() {
        const t = S.lFrame;
        return Qa(t.tView, t.selectedIndex);
      }
      function Li(t, e) {
        for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
          const i = t.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = i;
          s && (t.contentHooks || (t.contentHooks = [])).push(-n, s),
            a &&
              ((t.contentHooks || (t.contentHooks = [])).push(n, a),
              (t.contentCheckHooks || (t.contentCheckHooks = [])).push(n, a)),
            l && (t.viewHooks || (t.viewHooks = [])).push(-n, l),
            u &&
              ((t.viewHooks || (t.viewHooks = [])).push(n, u),
              (t.viewCheckHooks || (t.viewCheckHooks = [])).push(n, u)),
            null != c && (t.destroyHooks || (t.destroyHooks = [])).push(n, c);
        }
      }
      function Bi(t, e, n) {
        Wf(t, e, 3, n);
      }
      function ji(t, e, n, r) {
        (3 & t[2]) === n && Wf(t, e, n, r);
      }
      function nl(t, e) {
        let n = t[2];
        (3 & n) === e && ((n &= 2047), (n += 1), (t[2] = n));
      }
      function Wf(t, e, n, r) {
        const i = null != r ? r : -1,
          s = e.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & t[18] : 0; l < s; l++)
          if ("number" == typeof e[l + 1]) {
            if (((a = e[l]), null != r && a >= r)) break;
          } else
            e[l] < 0 && (t[18] += 65536),
              (a < i || -1 == i) &&
                (ZE(t, n, e, l), (t[18] = (4294901760 & t[18]) + l + 2)),
              l++;
      }
      function ZE(t, e, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = t[o ? -n[r] : n[r]];
        if (o) {
          if (t[2] >> 11 < t[18] >> 16 && (3 & t[2]) === e) {
            t[2] += 2048;
            try {
              i.call(a);
            } finally {
            }
          }
        } else
          try {
            i.call(a);
          } finally {
          }
      }
      class fo {
        constructor(e, n, r) {
          (this.factory = e),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Ui(t, e, n) {
        const r = ce(t);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if ("number" == typeof i) {
            if (0 !== i) break;
            o++;
            const s = n[o++],
              a = n[o++],
              l = n[o++];
            r ? t.setAttribute(e, a, l, s) : e.setAttributeNS(s, a, l);
          } else {
            const s = i,
              a = n[++o];
            ol(s)
              ? r && t.setProperty(e, s, a)
              : r
              ? t.setAttribute(e, s, a)
              : e.setAttribute(s, a),
              o++;
          }
        }
        return o;
      }
      function Qf(t) {
        return 3 === t || 4 === t || 6 === t;
      }
      function ol(t) {
        return 64 === t.charCodeAt(0);
      }
      function Hi(t, e) {
        if (null !== e && 0 !== e.length)
          if (null === t || 0 === t.length) t = e.slice();
          else {
            let n = -1;
            for (let r = 0; r < e.length; r++) {
              const o = e[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  Zf(t, n, o, null, -1 === n || 2 === n ? e[++r] : null);
            }
          }
        return t;
      }
      function Zf(t, e, n, r, o) {
        let i = 0,
          s = t.length;
        if (-1 === e) s = -1;
        else
          for (; i < t.length; ) {
            const a = t[i++];
            if ("number" == typeof a) {
              if (a === e) {
                s = -1;
                break;
              }
              if (a > e) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < t.length; ) {
          const a = t[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (t[i + 1] = o));
            if (r === t[i + 1]) return void (t[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (t.splice(s, 0, e), (i = s + 1)),
          t.splice(i++, 0, n),
          null !== r && t.splice(i++, 0, r),
          null !== o && t.splice(i++, 0, o);
      }
      function Kf(t) {
        return -1 !== t;
      }
      function gr(t) {
        return 32767 & t;
      }
      function mr(t, e) {
        let n = (function ew(t) {
            return t >> 16;
          })(t),
          r = e;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let il = !0;
      function $i(t) {
        const e = il;
        return (il = t), e;
      }
      let tw = 0;
      function po(t, e) {
        const n = al(t, e);
        if (-1 !== n) return n;
        const r = e[1];
        r.firstCreatePass &&
          ((t.injectorIndex = e.length),
          sl(r.data, t),
          sl(e, null),
          sl(r.blueprint, null));
        const o = Gi(t, e),
          i = t.injectorIndex;
        if (Kf(o)) {
          const s = gr(o),
            a = mr(o, e),
            l = a[1].data;
          for (let u = 0; u < 8; u++) e[i + u] = a[s + u] | l[s + u];
        }
        return (e[i + 8] = o), i;
      }
      function sl(t, e) {
        t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
      }
      function al(t, e) {
        return -1 === t.injectorIndex ||
          (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
          null === e[t.injectorIndex + 8]
          ? -1
          : t.injectorIndex;
      }
      function Gi(t, e) {
        if (t.parent && -1 !== t.parent.injectorIndex)
          return t.parent.injectorIndex;
        let n = 0,
          r = null,
          o = e;
        for (; null !== o; ) {
          const i = o[1],
            s = i.type;
          if (((r = 2 === s ? i.declTNode : 1 === s ? o[6] : null), null === r))
            return -1;
          if ((n++, (o = o[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function qi(t, e, n) {
        !(function nw(t, e, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(so) && (r = n[so]),
            null == r && (r = n[so] = tw++);
          const o = 255 & r;
          e.data[t + (o >> 5)] |= 1 << o;
        })(t, e, n);
      }
      function Xf(t, e, n) {
        if (n & I.Optional) return t;
        Mi(e, "NodeInjector");
      }
      function eh(t, e, n, r) {
        if (
          (n & I.Optional && void 0 === r && (r = null),
          0 == (n & (I.Self | I.Host)))
        ) {
          const o = t[9],
            i = _n(void 0);
          try {
            return o ? o.get(e, r, n & I.Optional) : bf(e, r, n & I.Optional);
          } finally {
            _n(i);
          }
        }
        return Xf(r, e, n);
      }
      function th(t, e, n, r = I.Default, o) {
        if (null !== t) {
          const i = (function sw(t) {
            if ("string" == typeof t) return t.charCodeAt(0) || 0;
            const e = t.hasOwnProperty(so) ? t[so] : void 0;
            return "number" == typeof e ? (e >= 0 ? 255 & e : ow) : e;
          })(n);
          if ("function" == typeof i) {
            if (!Hf(e, t, r)) return r & I.Host ? Xf(o, n, r) : eh(e, n, r, o);
            try {
              const s = i(r);
              if (null != s || r & I.Optional) return s;
              Mi(n);
            } finally {
              zf();
            }
          } else if ("number" == typeof i) {
            let s = null,
              a = al(t, e),
              l = -1,
              u = r & I.Host ? e[16][6] : null;
            for (
              (-1 === a || r & I.SkipSelf) &&
              ((l = -1 === a ? Gi(t, e) : e[a + 8]),
              -1 !== l && oh(r, !1)
                ? ((s = e[1]), (a = gr(l)), (e = mr(l, e)))
                : (a = -1));
              -1 !== a;

            ) {
              const c = e[1];
              if (rh(i, a, c.data)) {
                const d = iw(a, e, n, s, r, u);
                if (d !== nh) return d;
              }
              (l = e[a + 8]),
                -1 !== l && oh(r, e[1].data[a + 8] === u) && rh(i, a, e)
                  ? ((s = c), (a = gr(l)), (e = mr(l, e)))
                  : (a = -1);
            }
          }
        }
        return eh(e, n, r, o);
      }
      const nh = {};
      function ow() {
        return new yr(Ee(), y());
      }
      function iw(t, e, n, r, o, i) {
        const s = e[1],
          a = s.data[t + 8],
          c = zi(
            a,
            s,
            n,
            null == r ? xi(a) && il : r != s && 0 != (3 & a.type),
            o & I.Host && i === a
          );
        return null !== c ? go(e, s, c, a) : nh;
      }
      function zi(t, e, n, r, o) {
        const i = t.providerIndexes,
          s = e.data,
          a = 1048575 & i,
          l = t.directiveStart,
          c = i >> 20,
          f = o ? a + c : t.directiveEnd;
        for (let h = r ? a : a + c; h < f; h++) {
          const p = s[h];
          if ((h < l && n === p) || (h >= l && p.type === n)) return h;
        }
        if (o) {
          const h = s[l];
          if (h && Tt(h) && h.type === n) return l;
        }
        return null;
      }
      function go(t, e, n, r) {
        let o = t[n];
        const i = e.data;
        if (
          (function KE(t) {
            return t instanceof fo;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function JC(t, e) {
              const n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
              throw new $(
                -200,
                `Circular dependency in DI detected for ${t}${n}`
              );
            })(je(i[n]));
          const a = $i(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? _n(s.injectImpl) : null;
          Hf(t, r, I.Default);
          try {
            (o = t[n] = s.factory(void 0, i, t, r)),
              e.firstCreatePass &&
                n >= r.directiveStart &&
                (function QE(t, e, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = e.type.prototype;
                  if (r) {
                    const s = xf(e);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(t, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(t, s);
                  }
                  o &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - t, o),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(t, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(t, i));
                })(n, i[n], e);
          } finally {
            null !== l && _n(l), $i(a), (s.resolving = !1), zf();
          }
        }
        return o;
      }
      function rh(t, e, n) {
        return !!(n[e + (t >> 5)] & (1 << t));
      }
      function oh(t, e) {
        return !(t & I.Self || (t & I.Host && e));
      }
      class yr {
        constructor(e, n) {
          (this._tNode = e), (this._lView = n);
        }
        get(e, n, r) {
          return th(this._tNode, this._lView, e, r, n);
        }
      }
      function Fe(t) {
        return Dn(() => {
          const e = t.prototype.constructor,
            n = e[on] || ll(e),
            r = Object.prototype;
          let o = Object.getPrototypeOf(t.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[on] || ll(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function ll(t) {
        return Df(t)
          ? () => {
              const e = ll(P(t));
              return e && e();
            }
          : zn(t);
      }
      function mo(t) {
        return (function rw(t, e) {
          if ("class" === e) return t.classes;
          if ("style" === e) return t.styles;
          const n = t.attrs;
          if (n) {
            const r = n.length;
            let o = 0;
            for (; o < r; ) {
              const i = n[o];
              if (Qf(i)) break;
              if (0 === i) o += 2;
              else if ("number" == typeof i)
                for (o++; o < r && "string" == typeof n[o]; ) o++;
              else {
                if (i === e) return n[o + 1];
                o += 2;
              }
            }
          }
          return null;
        })(Ee(), t);
      }
      const _r = "__parameters__";
      function Cr(t, e, n) {
        return Dn(() => {
          const r = (function ul(t) {
            return function (...n) {
              if (t) {
                const r = t(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(e);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(_r)
                ? l[_r]
                : Object.defineProperty(l, _r, { value: [] })[_r];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = t),
            (o.annotationCls = o),
            o
          );
        });
      }
      class L {
        constructor(e, n) {
          (this._desc = e),
            (this.ngMetadataName = "InjectionToken"),
            (this.??prov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.??prov = x({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const lw = new L("AnalyzeForEntryComponents");
      function yt(t, e) {
        void 0 === e && (e = t);
        for (let n = 0; n < t.length; n++) {
          let r = t[n];
          Array.isArray(r)
            ? (e === t && (e = t.slice(0, n)), yt(r, e))
            : e !== t && e.push(r);
        }
        return e;
      }
      function Ut(t, e) {
        t.forEach((n) => (Array.isArray(n) ? Ut(n, e) : e(n)));
      }
      function sh(t, e, n) {
        e >= t.length ? t.push(n) : t.splice(e, 0, n);
      }
      function Wi(t, e) {
        return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
      }
      function ot(t, e, n) {
        let r = Er(t, e);
        return (
          r >= 0
            ? (t[1 | r] = n)
            : ((r = ~r),
              (function dw(t, e, n, r) {
                let o = t.length;
                if (o == e) t.push(n, r);
                else if (1 === o) t.push(r, t[0]), (t[0] = n);
                else {
                  for (o--, t.push(t[o - 1], t[o]); o > e; )
                    (t[o] = t[o - 2]), o--;
                  (t[e] = n), (t[e + 1] = r);
                }
              })(t, r, e, n)),
          r
        );
      }
      function dl(t, e) {
        const n = Er(t, e);
        if (n >= 0) return t[1 | n];
      }
      function Er(t, e) {
        return (function uh(t, e, n) {
          let r = 0,
            o = t.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = t[i << n];
            if (e === s) return i << n;
            s > e ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(t, e, 1);
      }
      const Do = {},
        hl = "__NG_DI_FLAG__",
        Zi = "ngTempTokenPath",
        vw = /\n/gm,
        dh = "__source",
        Dw = K({ provide: String, useValue: K });
      let Co;
      function fh(t) {
        const e = Co;
        return (Co = t), e;
      }
      function Cw(t, e = I.Default) {
        if (void 0 === Co) throw new $(203, "");
        return null === Co
          ? bf(t, void 0, e)
          : Co.get(t, e & I.Optional ? null : void 0, e);
      }
      function w(t, e = I.Default) {
        return (
          (function oE() {
            return ka;
          })() || Cw
        )(P(t), e);
      }
      const Ew = w;
      function pl(t) {
        const e = [];
        for (let n = 0; n < t.length; n++) {
          const r = P(t[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new $(900, "");
            let o,
              i = I.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = ww(a);
              "number" == typeof l
                ? -1 === l
                  ? (o = a.token)
                  : (i |= l)
                : (o = a);
            }
            e.push(w(o, i));
          } else e.push(w(r));
        }
        return e;
      }
      function Eo(t, e) {
        return (t[hl] = e), (t.prototype[hl] = e), t;
      }
      function ww(t) {
        return t[hl];
      }
      const Ki = Eo(
          Cr("Inject", (t) => ({ token: t })),
          -1
        ),
        Mn = Eo(Cr("Optional"), 8),
        wo = Eo(Cr("SkipSelf"), 4);
      class Ch {
        constructor(e) {
          this.changingThisBreaksApplicationSecurity = e;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      function An(t) {
        return t instanceof Ch ? t.changingThisBreaksApplicationSecurity : t;
      }
      const qw =
          /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi,
        zw =
          /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
      var ye = (() => (
        ((ye = ye || {})[(ye.NONE = 0)] = "NONE"),
        (ye[(ye.HTML = 1)] = "HTML"),
        (ye[(ye.STYLE = 2)] = "STYLE"),
        (ye[(ye.SCRIPT = 3)] = "SCRIPT"),
        (ye[(ye.URL = 4)] = "URL"),
        (ye[(ye.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        ye
      ))();
      function El(t) {
        const e = (function To() {
          const t = y();
          return t && t[12];
        })();
        return e
          ? e.sanitize(ye.URL, t) || ""
          : (function Mo(t, e) {
              const n = (function Uw(t) {
                return (t instanceof Ch && t.getTypeName()) || null;
              })(t);
              if (null != n && n !== e) {
                if ("ResourceURL" === n && "URL" === e) return !0;
                throw new Error(
                  `Required a safe ${e}, got a ${n} (see https://g.co/ng/security#xss)`
                );
              }
              return n === e;
            })(t, "URL")
          ? An(t)
          : (function es(t) {
              return (t = String(t)).match(qw) || t.match(zw)
                ? t
                : "unsafe:" + t;
            })(R(t));
      }
      const xh = "__ngContext__";
      function Pe(t, e) {
        t[xh] = e;
      }
      function bl(t) {
        const e = (function So(t) {
          return t[xh] || null;
        })(t);
        return e ? (Array.isArray(e) ? e : e.lView) : null;
      }
      function Al(t) {
        return t.ngOriginalError;
      }
      function gb(t, ...e) {
        t.error(...e);
      }
      class Io {
        constructor() {
          this._console = console;
        }
        handleError(e) {
          const n = this._findOriginalError(e),
            r = (function pb(t) {
              return (t && t.ngErrorLogger) || gb;
            })(e);
          r(this._console, "ERROR", e),
            n && r(this._console, "ORIGINAL ERROR", n);
        }
        _findOriginalError(e) {
          let n = e && Al(e);
          for (; n && Al(n); ) n = Al(n);
          return n || null;
        }
      }
      const Mb = (() =>
        (
          ("undefined" != typeof requestAnimationFrame &&
            requestAnimationFrame) ||
          setTimeout
        ).bind(Z))();
      function $t(t) {
        return t instanceof Function ? t() : t;
      }
      var it = (() => (
        ((it = it || {})[(it.Important = 1)] = "Important"),
        (it[(it.DashCase = 2)] = "DashCase"),
        it
      ))();
      function Sl(t, e) {
        return undefined(t, e);
      }
      function Ro(t) {
        const e = t[3];
        return At(e) ? e[3] : e;
      }
      function Il(t) {
        return jh(t[13]);
      }
      function Rl(t) {
        return jh(t[4]);
      }
      function jh(t) {
        for (; null !== t && !At(t); ) t = t[4];
        return t;
      }
      function Ar(t, e, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          At(r) ? (i = r) : Bt(r) && ((s = !0), (r = r[0]));
          const a = me(r);
          0 === t && null !== n
            ? null == o
              ? zh(e, n, a)
              : Wn(e, n, a, o || null, !0)
            : 1 === t && null !== n
            ? Wn(e, n, a, o || null, !0)
            : 2 === t
            ? (function Xh(t, e, n) {
                const r = ns(t, e);
                r &&
                  (function Bb(t, e, n, r) {
                    ce(t) ? t.removeChild(e, n, r) : e.removeChild(n);
                  })(t, r, e, n);
              })(e, a, s)
            : 3 === t && e.destroyNode(a),
            null != i &&
              (function Hb(t, e, n, r, o) {
                const i = n[7];
                i !== me(n) && Ar(e, t, r, i, o);
                for (let a = 10; a < n.length; a++) {
                  const l = n[a];
                  xo(l[1], l, t, e, r, i);
                }
              })(e, t, i, n, o);
        }
      }
      function Nl(t, e, n) {
        if (ce(t)) return t.createElement(e, n);
        {
          const r =
            null !== n
              ? (function bE(t) {
                  const e = t.toLowerCase();
                  return "svg" === e
                    ? "http://www.w3.org/2000/svg"
                    : "math" === e
                    ? "http://www.w3.org/1998/MathML/"
                    : null;
                })(n)
              : null;
          return null === r ? t.createElement(e) : t.createElementNS(r, e);
        }
      }
      function Hh(t, e) {
        const n = t[9],
          r = n.indexOf(e),
          o = e[3];
        1024 & e[2] && ((e[2] &= -1025), Ka(o, -1)), n.splice(r, 1);
      }
      function Ol(t, e) {
        if (t.length <= 10) return;
        const n = 10 + e,
          r = t[n];
        if (r) {
          const o = r[17];
          null !== o && o !== t && Hh(o, r), e > 0 && (t[n - 1][4] = r[4]);
          const i = Wi(t, 10 + e);
          !(function xb(t, e) {
            xo(t, e, e[k], 2, null, null), (e[0] = null), (e[6] = null);
          })(r[1], r);
          const s = i[19];
          null !== s && s.detachView(i[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -129);
        }
        return r;
      }
      function $h(t, e) {
        if (!(256 & e[2])) {
          const n = e[k];
          ce(n) && n.destroyNode && xo(t, e, n, 3, null, null),
            (function Fb(t) {
              let e = t[13];
              if (!e) return Fl(t[1], t);
              for (; e; ) {
                let n = null;
                if (Bt(e)) n = e[13];
                else {
                  const r = e[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; e && !e[4] && e !== t; )
                    Bt(e) && Fl(e[1], e), (e = e[3]);
                  null === e && (e = t), Bt(e) && Fl(e[1], e), (n = e && e[4]);
                }
                e = n;
              }
            })(e);
        }
      }
      function Fl(t, e) {
        if (!(256 & e[2])) {
          (e[2] &= -129),
            (e[2] |= 256),
            (function Lb(t, e) {
              let n;
              if (null != t && null != (n = t.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = e[n[r]];
                  if (!(o instanceof fo)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          l = i[s + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        i.call(o);
                      } finally {
                      }
                  }
                }
            })(t, e),
            (function Vb(t, e) {
              const n = t.cleanup,
                r = e[7];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 1],
                      a = "function" == typeof s ? s(e) : me(e[s]),
                      l = r[(o = n[i + 2])],
                      u = n[i + 3];
                    "boolean" == typeof u
                      ? a.removeEventListener(n[i], l, u)
                      : u >= 0
                      ? r[(o = u)]()
                      : r[(o = -u)].unsubscribe(),
                      (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) r[i]();
                e[7] = null;
              }
            })(t, e),
            1 === e[1].type && ce(e[k]) && e[k].destroy();
          const n = e[17];
          if (null !== n && At(e[3])) {
            n !== e[3] && Hh(n, e);
            const r = e[19];
            null !== r && r.detachView(t);
          }
        }
      }
      function Gh(t, e, n) {
        return (function qh(t, e, n) {
          let r = e;
          for (; null !== r && 40 & r.type; ) r = (e = r).parent;
          if (null === r) return n[0];
          if (2 & r.flags) {
            const o = t.data[r.directiveStart].encapsulation;
            if (o === Lt.None || o === Lt.Emulated) return null;
          }
          return mt(r, n);
        })(t, e.parent, n);
      }
      function Wn(t, e, n, r, o) {
        ce(t) ? t.insertBefore(e, n, r, o) : e.insertBefore(n, r, o);
      }
      function zh(t, e, n) {
        ce(t) ? t.appendChild(e, n) : e.appendChild(n);
      }
      function Wh(t, e, n, r, o) {
        null !== r ? Wn(t, e, n, r, o) : zh(t, e, n);
      }
      function ns(t, e) {
        return ce(t) ? t.parentNode(e) : e.parentNode;
      }
      let Kh = function Zh(t, e, n) {
        return 40 & t.type ? mt(t, n) : null;
      };
      function rs(t, e, n, r) {
        const o = Gh(t, r, e),
          i = e[k],
          a = (function Qh(t, e, n) {
            return Kh(t, e, n);
          })(r.parent || e[6], r, e);
        if (null != o)
          if (Array.isArray(n))
            for (let l = 0; l < n.length; l++) Wh(i, o, n[l], a, !1);
          else Wh(i, o, n, a, !1);
      }
      function os(t, e) {
        if (null !== e) {
          const n = e.type;
          if (3 & n) return mt(e, t);
          if (4 & n) return kl(-1, t[e.index]);
          if (8 & n) {
            const r = e.child;
            if (null !== r) return os(t, r);
            {
              const o = t[e.index];
              return At(o) ? kl(-1, o) : me(o);
            }
          }
          if (32 & n) return Sl(e, t)() || me(t[e.index]);
          {
            const r = Yh(t, e);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : os(Ro(t[16]), r)
              : os(t, e.next);
          }
        }
        return null;
      }
      function Yh(t, e) {
        return null !== e ? t[16][6].projection[e.projection] : null;
      }
      function kl(t, e) {
        const n = 10 + t + 1;
        if (n < e.length) {
          const r = e[n],
            o = r[1].firstChild;
          if (null !== o) return os(r, o);
        }
        return e[7];
      }
      function Vl(t, e, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type;
          if (
            (s && 0 === e && (a && Pe(me(a), r), (n.flags |= 4)),
            64 != (64 & n.flags))
          )
            if (8 & l) Vl(t, e, n.child, r, o, i, !1), Ar(e, t, o, a, i);
            else if (32 & l) {
              const u = Sl(n, r);
              let c;
              for (; (c = u()); ) Ar(e, t, o, c, i);
              Ar(e, t, o, a, i);
            } else 16 & l ? ep(t, e, r, n, o, i) : Ar(e, t, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function xo(t, e, n, r, o, i) {
        Vl(n, r, t.firstChild, e, o, i, !1);
      }
      function ep(t, e, n, r, o, i) {
        const s = n[16],
          l = s[6].projection[r.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) Ar(e, t, o, l[u], i);
        else Vl(t, e, l, s[3], o, i, !0);
      }
      function tp(t, e, n) {
        ce(t) ? t.setAttribute(e, "style", n) : (e.style.cssText = n);
      }
      function Ll(t, e, n) {
        ce(t)
          ? "" === n
            ? t.removeAttribute(e, "class")
            : t.setAttribute(e, "class", n)
          : (e.className = n);
      }
      function np(t, e, n) {
        let r = t.length;
        for (;;) {
          const o = t.indexOf(e, n);
          if (-1 === o) return o;
          if (0 === o || t.charCodeAt(o - 1) <= 32) {
            const i = e.length;
            if (o + i === r || t.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const rp = "ng-template";
      function Gb(t, e, n) {
        let r = 0;
        for (; r < t.length; ) {
          let o = t[r++];
          if (n && "class" === o) {
            if (((o = t[r]), -1 !== np(o.toLowerCase(), e, 0))) return !0;
          } else if (1 === o) {
            for (; r < t.length && "string" == typeof (o = t[r++]); )
              if (o.toLowerCase() === e) return !0;
            return !1;
          }
        }
        return !1;
      }
      function op(t) {
        return 4 === t.type && t.value !== rp;
      }
      function qb(t, e, n) {
        return e === (4 !== t.type || n ? t.value : rp);
      }
      function zb(t, e, n) {
        let r = 4;
        const o = t.attrs || [],
          i = (function Zb(t) {
            for (let e = 0; e < t.length; e++) if (Qf(t[e])) return e;
            return t.length;
          })(o);
        let s = !1;
        for (let a = 0; a < e.length; a++) {
          const l = e[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !qb(t, l, n)) || ("" === l && 1 === e.length))
                ) {
                  if (St(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : e[++a];
                if (8 & r && null !== t.attrs) {
                  if (!Gb(t.attrs, u, n)) {
                    if (St(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = Wb(8 & r ? "class" : l, o, op(t), n);
                if (-1 === d) {
                  if (St(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== np(h, u, 0)) || (2 & r && u !== f)) {
                    if (St(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !St(r) && !St(l)) return !1;
            if (s && St(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return St(r) || s;
      }
      function St(t) {
        return 0 == (1 & t);
      }
      function Wb(t, e, n, r) {
        if (null === e) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < e.length; ) {
            const s = e[o];
            if (s === t) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = e[++o];
                for (; "string" == typeof a; ) a = e[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function Kb(t, e) {
          let n = t.indexOf(4);
          if (n > -1)
            for (n++; n < t.length; ) {
              const r = t[n];
              if ("number" == typeof r) return -1;
              if (r === e) return n;
              n++;
            }
          return -1;
        })(e, t);
      }
      function ip(t, e, n = !1) {
        for (let r = 0; r < e.length; r++) if (zb(t, e[r], n)) return !0;
        return !1;
      }
      function sp(t, e) {
        return t ? ":not(" + e.trim() + ")" : e;
      }
      function Yb(t) {
        let e = t[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < t.length; ) {
          let s = t[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = t[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !St(s) && ((e += sp(i, o)), (o = "")),
              (r = s),
              (i = i || !St(r));
          n++;
        }
        return "" !== o && (e += sp(i, o)), e;
      }
      const N = {};
      function Tn(t) {
        ap(G(), y(), He() + t, Fi());
      }
      function ap(t, e, n, r) {
        if (!r)
          if (3 == (3 & e[2])) {
            const i = t.preOrderCheckHooks;
            null !== i && Bi(e, i, n);
          } else {
            const i = t.preOrderHooks;
            null !== i && ji(e, i, 0, n);
          }
        wn(n);
      }
      function is(t, e) {
        return (t << 17) | (e << 2);
      }
      function It(t) {
        return (t >> 17) & 32767;
      }
      function Bl(t) {
        return 2 | t;
      }
      function ln(t) {
        return (131068 & t) >> 2;
      }
      function jl(t, e) {
        return (-131069 & t) | (e << 2);
      }
      function Ul(t) {
        return 1 | t;
      }
      function vp(t, e) {
        const n = t.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r],
              i = n[r + 1];
            if (-1 !== i) {
              const s = t.data[i];
              tl(o), s.contentQueries(2, e[i], i);
            }
          }
      }
      function No(t, e, n, r, o, i, s, a, l, u) {
        const c = e.blueprint.slice();
        return (
          (c[0] = o),
          (c[2] = 140 | r),
          kf(c),
          (c[3] = c[15] = t),
          (c[8] = n),
          (c[10] = s || (t && t[10])),
          (c[k] = a || (t && t[k])),
          (c[12] = l || (t && t[12]) || null),
          (c[9] = u || (t && t[9]) || null),
          (c[6] = i),
          (c[16] = 2 == e.type ? t[16] : c),
          c
        );
      }
      function Tr(t, e, n, r, o) {
        let i = t.data[e];
        if (null === i)
          (i = (function Kl(t, e, n, r, o) {
            const i = Lf(),
              s = Ja(),
              l = (t.data[e] = (function y0(t, e, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: e ? e.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: e,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, e, r, o));
            return (
              null === t.firstChild && (t.firstChild = l),
              null !== i &&
                (s
                  ? null == i.child && null !== l.parent && (i.child = l)
                  : null === i.next && (i.next = l)),
              l
            );
          })(t, e, n, r, o)),
            (function VE() {
              return S.lFrame.inI18n;
            })() && (i.flags |= 64);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function co() {
            const t = S.lFrame,
              e = t.currentTNode;
            return t.isParent ? e : e.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return jt(i, !0), i;
      }
      function Sr(t, e, n, r) {
        if (0 === n) return -1;
        const o = e.length;
        for (let i = 0; i < n; i++)
          e.push(r), t.blueprint.push(r), t.data.push(null);
        return o;
      }
      function Oo(t, e, n) {
        ki(e);
        try {
          const r = t.viewQuery;
          null !== r && iu(1, r, n);
          const o = t.template;
          null !== o && _p(t, e, o, 1, n),
            t.firstCreatePass && (t.firstCreatePass = !1),
            t.staticContentQueries && vp(t, e),
            t.staticViewQueries && iu(2, t.viewQuery, n);
          const i = t.components;
          null !== i &&
            (function p0(t, e) {
              for (let n = 0; n < e.length; n++) P0(t, e[n]);
            })(e, i);
        } catch (r) {
          throw (
            (t.firstCreatePass &&
              ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
            r)
          );
        } finally {
          (e[2] &= -5), Vi();
        }
      }
      function Ir(t, e, n, r) {
        const o = e[2];
        if (256 == (256 & o)) return;
        ki(e);
        const i = Fi();
        try {
          kf(e),
            (function Bf(t) {
              return (S.lFrame.bindingIndex = t);
            })(t.bindingStartIndex),
            null !== n && _p(t, e, n, 2, r);
          const s = 3 == (3 & o);
          if (!i)
            if (s) {
              const u = t.preOrderCheckHooks;
              null !== u && Bi(e, u, null);
            } else {
              const u = t.preOrderHooks;
              null !== u && ji(e, u, 0, null), nl(e, 0);
            }
          if (
            ((function O0(t) {
              for (let e = Il(t); null !== e; e = Rl(e)) {
                if (!e[2]) continue;
                const n = e[9];
                for (let r = 0; r < n.length; r++) {
                  const o = n[r],
                    i = o[3];
                  0 == (1024 & o[2]) && Ka(i, 1), (o[2] |= 1024);
                }
              }
            })(e),
            (function N0(t) {
              for (let e = Il(t); null !== e; e = Rl(e))
                for (let n = 10; n < e.length; n++) {
                  const r = e[n],
                    o = r[1];
                  Za(r) && Ir(o, r, o.template, r[8]);
                }
            })(e),
            null !== t.contentQueries && vp(t, e),
            !i)
          )
            if (s) {
              const u = t.contentCheckHooks;
              null !== u && Bi(e, u);
            } else {
              const u = t.contentHooks;
              null !== u && ji(e, u, 1), nl(e, 1);
            }
          !(function f0(t, e) {
            const n = t.hostBindingOpCodes;
            if (null !== n)
              try {
                for (let r = 0; r < n.length; r++) {
                  const o = n[r];
                  if (o < 0) wn(~o);
                  else {
                    const i = o,
                      s = n[++r],
                      a = n[++r];
                    LE(s, i), a(2, e[i]);
                  }
                }
              } finally {
                wn(-1);
              }
          })(t, e);
          const a = t.components;
          null !== a &&
            (function h0(t, e) {
              for (let n = 0; n < e.length; n++) F0(t, e[n]);
            })(e, a);
          const l = t.viewQuery;
          if ((null !== l && iu(2, l, r), !i))
            if (s) {
              const u = t.viewCheckHooks;
              null !== u && Bi(e, u);
            } else {
              const u = t.viewHooks;
              null !== u && ji(e, u, 2), nl(e, 2);
            }
          !0 === t.firstUpdatePass && (t.firstUpdatePass = !1),
            i || (e[2] &= -73),
            1024 & e[2] && ((e[2] &= -1025), Ka(e[3], -1));
        } finally {
          Vi();
        }
      }
      function g0(t, e, n, r) {
        const o = e[10],
          i = !Fi(),
          s = Pf(e);
        try {
          i && !s && o.begin && o.begin(), s && Oo(t, e, r), Ir(t, e, n, r);
        } finally {
          i && !s && o.end && o.end();
        }
      }
      function _p(t, e, n, r, o) {
        const i = He(),
          s = 2 & r;
        try {
          wn(-1), s && e.length > 20 && ap(t, e, 20, Fi()), n(r, o);
        } finally {
          wn(i);
        }
      }
      function Jl(t, e, n) {
        !Vf() ||
          ((function b0(t, e, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            t.firstCreatePass || po(n, e), Pe(r, e);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const l = t.data[a],
                u = Tt(l);
              u && I0(e, n, l);
              const c = go(e, t, a, n);
              Pe(c, e),
                null !== s && R0(0, a - o, c, l, 0, s),
                u && (rt(n.index, e)[8] = c);
            }
          })(t, e, n, mt(n, e)),
          128 == (128 & n.flags) &&
            (function M0(t, e, n) {
              const r = n.directiveStart,
                o = n.directiveEnd,
                s = n.index,
                a = (function BE() {
                  return S.lFrame.currentDirectiveIndex;
                })();
              try {
                wn(s);
                for (let l = r; l < o; l++) {
                  const u = t.data[l],
                    c = e[l];
                  Xa(l),
                    (null !== u.hostBindings ||
                      0 !== u.hostVars ||
                      null !== u.hostAttrs) &&
                      Sp(u, c);
                }
              } finally {
                wn(-1), Xa(a);
              }
            })(t, e, n));
      }
      function Yl(t, e, n = mt) {
        const r = e.localNames;
        if (null !== r) {
          let o = e.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(e, t) : t[s];
            t[o++] = a;
          }
        }
      }
      function Cp(t) {
        const e = t.tView;
        return null === e || e.incompleteFirstPass
          ? (t.tView = ls(
              1,
              null,
              t.template,
              t.decls,
              t.vars,
              t.directiveDefs,
              t.pipeDefs,
              t.viewQuery,
              t.schemas,
              t.consts
            ))
          : e;
      }
      function ls(t, e, n, r, o, i, s, a, l, u) {
        const c = 20 + r,
          d = c + o,
          f = (function m0(t, e) {
            const n = [];
            for (let r = 0; r < e; r++) n.push(r < t ? null : N);
            return n;
          })(c, d),
          h = "function" == typeof u ? u() : u;
        return (f[1] = {
          type: t,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: e,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function bp(t, e, n, r) {
        const o = Fp(e);
        null === n
          ? o.push(r)
          : (o.push(n), t.firstCreatePass && Pp(t).push(r, o.length - 1));
      }
      function Mp(t, e, n) {
        for (let r in t)
          if (t.hasOwnProperty(r)) {
            const o = t[r];
            (n = null === n ? {} : n).hasOwnProperty(r)
              ? n[r].push(e, o)
              : (n[r] = [e, o]);
          }
        return n;
      }
      function Xl(t, e, n, r) {
        let o = !1;
        if (Vf()) {
          const i = (function A0(t, e, n) {
              const r = t.directiveRegistry;
              let o = null;
              if (r)
                for (let i = 0; i < r.length; i++) {
                  const s = r[i];
                  ip(n, s.selectors, !1) &&
                    (o || (o = []),
                    qi(po(n, e), t, s.type),
                    Tt(s) ? (Ip(t, n), o.unshift(s)) : o.push(s));
                }
              return o;
            })(t, e, n),
            s = null === r ? null : { "": -1 };
          if (null !== i) {
            (o = !0), Rp(n, t.data.length, i.length);
            for (let c = 0; c < i.length; c++) {
              const d = i[c];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              l = !1,
              u = Sr(t, e, i.length, null);
            for (let c = 0; c < i.length; c++) {
              const d = i[c];
              (n.mergedAttrs = Hi(n.mergedAttrs, d.hostAttrs)),
                xp(t, n, e, u, d),
                S0(u, d, s),
                null !== d.contentQueries && (n.flags |= 8),
                (null !== d.hostBindings ||
                  null !== d.hostAttrs ||
                  0 !== d.hostVars) &&
                  (n.flags |= 128);
              const f = d.type.prototype;
              !a &&
                (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                ((t.preOrderHooks || (t.preOrderHooks = [])).push(n.index),
                (a = !0)),
                !l &&
                  (f.ngOnChanges || f.ngDoCheck) &&
                  ((t.preOrderCheckHooks || (t.preOrderCheckHooks = [])).push(
                    n.index
                  ),
                  (l = !0)),
                u++;
            }
            !(function v0(t, e) {
              const r = e.directiveEnd,
                o = t.data,
                i = e.attrs,
                s = [];
              let a = null,
                l = null;
              for (let u = e.directiveStart; u < r; u++) {
                const c = o[u],
                  d = c.inputs,
                  f = null === i || op(e) ? null : x0(d, i);
                s.push(f), (a = Mp(d, u, a)), (l = Mp(c.outputs, u, l));
              }
              null !== a &&
                (a.hasOwnProperty("class") && (e.flags |= 16),
                a.hasOwnProperty("style") && (e.flags |= 32)),
                (e.initialInputs = s),
                (e.inputs = a),
                (e.outputs = l);
            })(t, n);
          }
          s &&
            (function T0(t, e, n) {
              if (e) {
                const r = (t.localNames = []);
                for (let o = 0; o < e.length; o += 2) {
                  const i = n[e[o + 1]];
                  if (null == i) throw new $(-301, !1);
                  r.push(e[o], i);
                }
              }
            })(n, r, s);
        }
        return (n.mergedAttrs = Hi(n.mergedAttrs, n.attrs)), o;
      }
      function Tp(t, e, n, r, o, i) {
        const s = i.hostBindings;
        if (s) {
          let a = t.hostBindingOpCodes;
          null === a && (a = t.hostBindingOpCodes = []);
          const l = ~e.index;
          (function w0(t) {
            let e = t.length;
            for (; e > 0; ) {
              const n = t[--e];
              if ("number" == typeof n && n < 0) return n;
            }
            return 0;
          })(a) != l && a.push(l),
            a.push(r, o, s);
        }
      }
      function Sp(t, e) {
        null !== t.hostBindings && t.hostBindings(1, e);
      }
      function Ip(t, e) {
        (e.flags |= 2), (t.components || (t.components = [])).push(e.index);
      }
      function S0(t, e, n) {
        if (n) {
          if (e.exportAs)
            for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
          Tt(e) && (n[""] = t);
        }
      }
      function Rp(t, e, n) {
        (t.flags |= 1),
          (t.directiveStart = e),
          (t.directiveEnd = e + n),
          (t.providerIndexes = e);
      }
      function xp(t, e, n, r, o) {
        t.data[r] = o;
        const i = o.factory || (o.factory = zn(o.type)),
          s = new fo(i, Tt(o), null);
        (t.blueprint[r] = s),
          (n[r] = s),
          Tp(t, e, 0, r, Sr(t, n, o.hostVars, N), o);
      }
      function I0(t, e, n) {
        const r = mt(e, t),
          o = Cp(n),
          i = t[10],
          s = us(
            t,
            No(
              t,
              o,
              null,
              n.onPush ? 64 : 16,
              r,
              e,
              i,
              i.createRenderer(r, n),
              null,
              null
            )
          );
        t[e.index] = s;
      }
      function Gt(t, e, n, r, o, i) {
        const s = mt(t, e);
        !(function eu(t, e, n, r, o, i, s) {
          if (null == i)
            ce(t) ? t.removeAttribute(e, o, n) : e.removeAttribute(o);
          else {
            const a = null == s ? R(i) : s(i, r || "", o);
            ce(t)
              ? t.setAttribute(e, o, a, n)
              : n
              ? e.setAttributeNS(n, o, a)
              : e.setAttribute(o, a);
          }
        })(e[k], s, i, t.value, n, r, o);
      }
      function R0(t, e, n, r, o, i) {
        const s = i[e];
        if (null !== s) {
          const a = r.setInput;
          for (let l = 0; l < s.length; ) {
            const u = s[l++],
              c = s[l++],
              d = s[l++];
            null !== a ? r.setInput(n, d, u, c) : (n[c] = d);
          }
        }
      }
      function x0(t, e) {
        let n = null,
          r = 0;
        for (; r < e.length; ) {
          const o = e[r];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              t.hasOwnProperty(o) &&
                (null === n && (n = []), n.push(o, t[o], e[r + 1])),
                (r += 2);
            } else r += 2;
          else r += 4;
        }
        return n;
      }
      function Np(t, e, n, r) {
        return new Array(t, !0, !1, e, null, 0, r, n, null, null);
      }
      function F0(t, e) {
        const n = rt(e, t);
        if (Za(n)) {
          const r = n[1];
          80 & n[2] ? Ir(r, n, r.template, n[8]) : n[5] > 0 && tu(n);
        }
      }
      function tu(t) {
        for (let r = Il(t); null !== r; r = Rl(r))
          for (let o = 10; o < r.length; o++) {
            const i = r[o];
            if (1024 & i[2]) {
              const s = i[1];
              Ir(s, i, s.template, i[8]);
            } else i[5] > 0 && tu(i);
          }
        const n = t[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = rt(n[r], t);
            Za(o) && o[5] > 0 && tu(o);
          }
      }
      function P0(t, e) {
        const n = rt(e, t),
          r = n[1];
        (function k0(t, e) {
          for (let n = e.length; n < t.blueprint.length; n++)
            e.push(t.blueprint[n]);
        })(r, n),
          Oo(r, n, n[8]);
      }
      function us(t, e) {
        return t[13] ? (t[14][4] = e) : (t[13] = e), (t[14] = e), e;
      }
      function nu(t) {
        for (; t; ) {
          t[2] |= 64;
          const e = Ro(t);
          if (pE(t) && !e) return t;
          t = e;
        }
        return null;
      }
      function ou(t, e, n) {
        const r = e[10];
        r.begin && r.begin();
        try {
          Ir(t, e, t.template, n);
        } catch (o) {
          throw (Vp(e, o), o);
        } finally {
          r.end && r.end();
        }
      }
      function Op(t) {
        !(function ru(t) {
          for (let e = 0; e < t.components.length; e++) {
            const n = t.components[e],
              r = bl(n),
              o = r[1];
            g0(o, r, o.template, n);
          }
        })(t[8]);
      }
      function iu(t, e, n) {
        tl(0), e(t, n);
      }
      const j0 = (() => Promise.resolve(null))();
      function Fp(t) {
        return t[7] || (t[7] = []);
      }
      function Pp(t) {
        return t.cleanup || (t.cleanup = []);
      }
      function Vp(t, e) {
        const n = t[9],
          r = n ? n.get(Io, null) : null;
        r && r.handleError(e);
      }
      function Lp(t, e, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            l = e[s],
            u = t.data[s];
          null !== u.setInput ? u.setInput(l, o, r, a) : (l[a] = o);
        }
      }
      function un(t, e, n) {
        const r = Oi(e, t);
        !(function Uh(t, e, n) {
          ce(t) ? t.setValue(e, n) : (e.textContent = n);
        })(t[k], r, n);
      }
      function cs(t, e, n) {
        let r = n ? t.styles : null,
          o = n ? t.classes : null,
          i = 0;
        if (null !== e)
          for (let s = 0; s < e.length; s++) {
            const a = e[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = Na(o, a))
              : 2 == i && (r = Na(r, a + ": " + e[++s] + ";"));
          }
        n ? (t.styles = r) : (t.stylesWithoutHost = r),
          n ? (t.classes = o) : (t.classesWithoutHost = o);
      }
      const su = new L("INJECTOR", -1);
      class Bp {
        get(e, n = Do) {
          if (n === Do) {
            const r = new Error(`NullInjectorError: No provider for ${W(e)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      const au = new L("Set Injector scope."),
        Fo = {},
        $0 = {};
      let lu;
      function jp() {
        return void 0 === lu && (lu = new Bp()), lu;
      }
      function Up(t, e = null, n = null, r) {
        const o = Hp(t, e, n, r);
        return o._resolveInjectorDefTypes(), o;
      }
      function Hp(t, e = null, n = null, r) {
        return new G0(t, n, e || jp(), r);
      }
      class G0 {
        constructor(e, n, r, o = null) {
          (this.parent = r),
            (this.records = new Map()),
            (this.injectorDefTypes = new Set()),
            (this.onDestroy = new Set()),
            (this._destroyed = !1);
          const i = [];
          n && Ut(n, (a) => this.processProvider(a, e, n)),
            Ut([e], (a) => this.processInjectorType(a, [], i)),
            this.records.set(su, Rr(void 0, this));
          const s = this.records.get(au);
          (this.scope = null != s ? s.value : null),
            (this.source = o || ("object" == typeof e ? null : W(e)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            this.onDestroy.forEach((e) => e.ngOnDestroy());
          } finally {
            this.records.clear(),
              this.onDestroy.clear(),
              this.injectorDefTypes.clear();
          }
        }
        get(e, n = Do, r = I.Default) {
          this.assertNotDestroyed();
          const o = fh(this),
            i = _n(void 0);
          try {
            if (!(r & I.SkipSelf)) {
              let a = this.records.get(e);
              if (void 0 === a) {
                const l =
                  (function Y0(t) {
                    return (
                      "function" == typeof t ||
                      ("object" == typeof t && t instanceof L)
                    );
                  })(e) && Fa(e);
                (a = l && this.injectableDefInScope(l) ? Rr(uu(e), Fo) : null),
                  this.records.set(e, a);
              }
              if (null != a) return this.hydrate(e, a);
            }
            return (r & I.Self ? jp() : this.parent).get(
              e,
              (n = r & I.Optional && n === Do ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Zi] = s[Zi] || []).unshift(W(e)), o)) throw s;
              return (function bw(t, e, n, r) {
                const o = t[Zi];
                throw (
                  (e[dh] && o.unshift(e[dh]),
                  (t.message = (function Mw(t, e, n, r = null) {
                    t =
                      t && "\n" === t.charAt(0) && "\u0275" == t.charAt(1)
                        ? t.substr(2)
                        : t;
                    let o = W(e);
                    if (Array.isArray(e)) o = e.map(W).join(" -> ");
                    else if ("object" == typeof e) {
                      let i = [];
                      for (let s in e)
                        if (e.hasOwnProperty(s)) {
                          let a = e[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : W(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${t.replace(
                      vw,
                      "\n  "
                    )}`;
                  })("\n" + t.message, o, n, r)),
                  (t.ngTokenPath = o),
                  (t[Zi] = null),
                  t)
                );
              })(s, e, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            _n(i), fh(o);
          }
        }
        _resolveInjectorDefTypes() {
          this.injectorDefTypes.forEach((e) => this.get(e));
        }
        toString() {
          const e = [];
          return (
            this.records.forEach((r, o) => e.push(W(o))),
            `R3Injector[${e.join(", ")}]`
          );
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new $(205, !1);
        }
        processInjectorType(e, n, r) {
          if (!(e = P(e))) return !1;
          let o = Ef(e);
          const i = (null == o && e.ngModule) || void 0,
            s = void 0 === i ? e : i,
            a = -1 !== r.indexOf(s);
          if ((void 0 !== i && (o = Ef(i)), null == o)) return !1;
          if (null != o.imports && !a) {
            let c;
            r.push(s);
            try {
              Ut(o.imports, (d) => {
                this.processInjectorType(d, n, r) &&
                  (void 0 === c && (c = []), c.push(d));
              });
            } finally {
            }
            if (void 0 !== c)
              for (let d = 0; d < c.length; d++) {
                const { ngModule: f, providers: h } = c[d];
                Ut(h, (p) => this.processProvider(p, f, h || J));
              }
          }
          this.injectorDefTypes.add(s);
          const l = zn(s) || (() => new s());
          this.records.set(s, Rr(l, Fo));
          const u = o.providers;
          if (null != u && !a) {
            const c = e;
            Ut(u, (d) => this.processProvider(d, c, u));
          }
          return void 0 !== i && void 0 !== e.providers;
        }
        processProvider(e, n, r) {
          let o = xr((e = P(e))) ? e : P(e && e.provide);
          const i = (function z0(t, e, n) {
            return Gp(t) ? Rr(void 0, t.useValue) : Rr($p(t), Fo);
          })(e);
          if (xr(e) || !0 !== e.multi) this.records.get(o);
          else {
            let s = this.records.get(o);
            s ||
              ((s = Rr(void 0, Fo, !0)),
              (s.factory = () => pl(s.multi)),
              this.records.set(o, s)),
              (o = e),
              s.multi.push(e);
          }
          this.records.set(o, i);
        }
        hydrate(e, n) {
          return (
            n.value === Fo && ((n.value = $0), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function J0(t) {
                return (
                  null !== t &&
                  "object" == typeof t &&
                  "function" == typeof t.ngOnDestroy
                );
              })(n.value) &&
              this.onDestroy.add(n.value),
            n.value
          );
        }
        injectableDefInScope(e) {
          if (!e.providedIn) return !1;
          const n = P(e.providedIn);
          return "string" == typeof n
            ? "any" === n || n === this.scope
            : this.injectorDefTypes.has(n);
        }
      }
      function uu(t) {
        const e = Fa(t),
          n = null !== e ? e.factory : zn(t);
        if (null !== n) return n;
        if (t instanceof L) throw new $(204, !1);
        if (t instanceof Function)
          return (function q0(t) {
            const e = t.length;
            if (e > 0)
              throw (
                ((function _o(t, e) {
                  const n = [];
                  for (let r = 0; r < t; r++) n.push(e);
                  return n;
                })(e, "?"),
                new $(204, !1))
              );
            const n = (function tE(t) {
              const e = t && (t[Ai] || t[wf]);
              if (e) {
                const n = (function nE(t) {
                  if (t.hasOwnProperty("name")) return t.name;
                  const e = ("" + t).match(/^function\s*([^\s(]+)/);
                  return null === e ? "" : e[1];
                })(t);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  e
                );
              }
              return null;
            })(t);
            return null !== n ? () => n.factory(t) : () => new t();
          })(t);
        throw new $(204, !1);
      }
      function $p(t, e, n) {
        let r;
        if (xr(t)) {
          const o = P(t);
          return zn(o) || uu(o);
        }
        if (Gp(t)) r = () => P(t.useValue);
        else if (
          (function Q0(t) {
            return !(!t || !t.useFactory);
          })(t)
        )
          r = () => t.useFactory(...pl(t.deps || []));
        else if (
          (function W0(t) {
            return !(!t || !t.useExisting);
          })(t)
        )
          r = () => w(P(t.useExisting));
        else {
          const o = P(t && (t.useClass || t.provide));
          if (
            !(function K0(t) {
              return !!t.deps;
            })(t)
          )
            return zn(o) || uu(o);
          r = () => new o(...pl(t.deps));
        }
        return r;
      }
      function Rr(t, e, n = !1) {
        return { factory: t, value: e, multi: n ? [] : void 0 };
      }
      function Gp(t) {
        return null !== t && "object" == typeof t && Dw in t;
      }
      function xr(t) {
        return "function" == typeof t;
      }
      let ke = (() => {
        class t {
          static create(n, r) {
            var o;
            if (Array.isArray(n)) return Up({ name: "" }, r, n, "");
            {
              const i = null !== (o = n.name) && void 0 !== o ? o : "";
              return Up({ name: i }, n.parent, n.providers, i);
            }
          }
        }
        return (
          (t.THROW_IF_NOT_FOUND = Do),
          (t.NULL = new Bp()),
          (t.??prov = x({ token: t, providedIn: "any", factory: () => w(su) })),
          (t.__NG_ELEMENT_ID__ = -1),
          t
        );
      })();
      function sM(t, e) {
        Li(bl(t)[1], Ee());
      }
      function Q(t) {
        let e = (function ng(t) {
            return Object.getPrototypeOf(t.prototype).constructor;
          })(t.type),
          n = !0;
        const r = [t];
        for (; e; ) {
          let o;
          if (Tt(t)) o = e.??cmp || e.??dir;
          else {
            if (e.??cmp) throw new $(903, "");
            o = e.??dir;
          }
          if (o) {
            if (n) {
              r.push(o);
              const s = t;
              (s.inputs = fu(t.inputs)),
                (s.declaredInputs = fu(t.declaredInputs)),
                (s.outputs = fu(t.outputs));
              const a = o.hostBindings;
              a && cM(t, a);
              const l = o.viewQuery,
                u = o.contentQueries;
              if (
                (l && lM(t, l),
                u && uM(t, u),
                xa(t.inputs, o.inputs),
                xa(t.declaredInputs, o.declaredInputs),
                xa(t.outputs, o.outputs),
                Tt(o) && o.data.animation)
              ) {
                const c = t.data;
                c.animation = (c.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(t), a === Q && (n = !1);
              }
          }
          e = Object.getPrototypeOf(e);
        }
        !(function aM(t) {
          let e = 0,
            n = null;
          for (let r = t.length - 1; r >= 0; r--) {
            const o = t[r];
            (o.hostVars = e += o.hostVars),
              (o.hostAttrs = Hi(o.hostAttrs, (n = Hi(n, o.hostAttrs))));
          }
        })(r);
      }
      function fu(t) {
        return t === ar ? {} : t === J ? [] : t;
      }
      function lM(t, e) {
        const n = t.viewQuery;
        t.viewQuery = n
          ? (r, o) => {
              e(r, o), n(r, o);
            }
          : e;
      }
      function uM(t, e) {
        const n = t.contentQueries;
        t.contentQueries = n
          ? (r, o, i) => {
              e(r, o, i), n(r, o, i);
            }
          : e;
      }
      function cM(t, e) {
        const n = t.hostBindings;
        t.hostBindings = n
          ? (r, o) => {
              e(r, o), n(r, o);
            }
          : e;
      }
      let ds = null;
      function Nr() {
        if (!ds) {
          const t = Z.Symbol;
          if (t && t.iterator) ds = t.iterator;
          else {
            const e = Object.getOwnPropertyNames(Map.prototype);
            for (let n = 0; n < e.length; ++n) {
              const r = e[n];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (ds = r);
            }
          }
        }
        return ds;
      }
      function Po(t) {
        return (
          !!(function hu(t) {
            return (
              null !== t && ("function" == typeof t || "object" == typeof t)
            );
          })(t) &&
          (Array.isArray(t) || (!(t instanceof Map) && Nr() in t))
        );
      }
      function Ve(t, e, n) {
        return !Object.is(t[e], n) && ((t[e] = n), !0);
      }
      function zt(t, e, n, r) {
        const o = y();
        return Ve(o, pr(), e) && (G(), Gt(de(), o, t, e, n, r)), zt;
      }
      function hs(t, e, n, r, o, i, s, a) {
        const l = y(),
          u = G(),
          c = t + 20,
          d = u.firstCreatePass
            ? (function yM(t, e, n, r, o, i, s, a, l) {
                const u = e.consts,
                  c = Tr(e, t, 4, s || null, En(u, a));
                Xl(e, n, c, En(u, l)), Li(e, c);
                const d = (c.tViews = ls(
                  2,
                  c,
                  r,
                  o,
                  i,
                  e.directiveRegistry,
                  e.pipeRegistry,
                  null,
                  e.schemas,
                  u
                ));
                return (
                  null !== e.queries &&
                    (e.queries.template(e, c),
                    (d.queries = e.queries.embeddedTView(c))),
                  c
                );
              })(c, u, l, e, n, r, o, i, s)
            : u.data[c];
        jt(d, !1);
        const f = l[k].createComment("");
        rs(u, l, f, d),
          Pe(f, l),
          us(l, (l[c] = Np(f, l, f, d))),
          Ni(d) && Jl(u, l, d),
          null != s && Yl(l, d, a);
      }
      function _(t, e = I.Default) {
        const n = y();
        return null === n ? w(t, e) : th(Ee(), n, P(t), e);
      }
      function vu() {
        throw new Error("invalid");
      }
      function $r(t, e, n) {
        const r = y();
        return (
          Ve(r, pr(), e) &&
            (function st(t, e, n, r, o, i, s, a) {
              const l = mt(e, n);
              let c,
                u = e.inputs;
              !a && null != u && (c = u[r])
                ? (Lp(t, n, c, r, o),
                  xi(e) &&
                    (function D0(t, e) {
                      const n = rt(e, t);
                      16 & n[2] || (n[2] |= 64);
                    })(n, e.index))
                : 3 & e.type &&
                  ((r = (function _0(t) {
                    return "class" === t
                      ? "className"
                      : "for" === t
                      ? "htmlFor"
                      : "formaction" === t
                      ? "formAction"
                      : "innerHtml" === t
                      ? "innerHTML"
                      : "readonly" === t
                      ? "readOnly"
                      : "tabindex" === t
                      ? "tabIndex"
                      : t;
                  })(r)),
                  (o = null != s ? s(o, e.value || "", r) : o),
                  ce(i)
                    ? i.setProperty(l, r, o)
                    : ol(r) ||
                      (l.setProperty ? l.setProperty(r, o) : (l[r] = o)));
            })(G(), de(), r, t, e, r[k], n, !1),
          $r
        );
      }
      function _u(t, e, n, r, o) {
        const s = o ? "class" : "style";
        Lp(t, n, e.inputs[s], s, r);
      }
      function fe(t, e, n, r) {
        const o = y(),
          i = G(),
          s = 20 + t,
          a = o[k],
          l = (o[s] = Nl(
            a,
            e,
            (function WE() {
              return S.lFrame.currentNamespace;
            })()
          )),
          u = i.firstCreatePass
            ? (function LM(t, e, n, r, o, i, s) {
                const a = e.consts,
                  u = Tr(e, t, 2, o, En(a, i));
                return (
                  Xl(e, n, u, En(a, s)),
                  null !== u.attrs && cs(u, u.attrs, !1),
                  null !== u.mergedAttrs && cs(u, u.mergedAttrs, !0),
                  null !== e.queries && e.queries.elementStart(e, u),
                  u
                );
              })(s, i, o, 0, e, n, r)
            : i.data[s];
        jt(u, !0);
        const c = u.mergedAttrs;
        null !== c && Ui(a, l, c);
        const d = u.classes;
        null !== d && Ll(a, l, d);
        const f = u.styles;
        return (
          null !== f && tp(a, l, f),
          64 != (64 & u.flags) && rs(i, o, l, u),
          0 ===
            (function RE() {
              return S.lFrame.elementDepthCount;
            })() && Pe(l, o),
          (function xE() {
            S.lFrame.elementDepthCount++;
          })(),
          Ni(u) &&
            (Jl(i, o, u),
            (function Dp(t, e, n) {
              if (Ua(e)) {
                const o = e.directiveEnd;
                for (let i = e.directiveStart; i < o; i++) {
                  const s = t.data[i];
                  s.contentQueries && s.contentQueries(1, n[i], i);
                }
              }
            })(i, u, o)),
          null !== r && Yl(o, u),
          fe
        );
      }
      function ae() {
        let t = Ee();
        Ja()
          ? (function Ya() {
              S.lFrame.isParent = !1;
            })()
          : ((t = t.parent), jt(t, !1));
        const e = t;
        !(function NE() {
          S.lFrame.elementDepthCount--;
        })();
        const n = G();
        return (
          n.firstCreatePass && (Li(n, t), Ua(t) && n.queries.elementEnd(t)),
          null != e.classesWithoutHost &&
            (function YE(t) {
              return 0 != (16 & t.flags);
            })(e) &&
            _u(n, e, y(), e.classesWithoutHost, !0),
          null != e.stylesWithoutHost &&
            (function XE(t) {
              return 0 != (32 & t.flags);
            })(e) &&
            _u(n, e, y(), e.stylesWithoutHost, !1),
          ae
        );
      }
      function gs(t, e, n, r) {
        return fe(t, e, n, r), ae(), gs;
      }
      function Vo(t) {
        return !!t && "function" == typeof t.then;
      }
      const Eu = function bg(t) {
        return !!t && "function" == typeof t.subscribe;
      };
      function Le(t, e, n, r) {
        const o = y(),
          i = G(),
          s = Ee();
        return (
          (function Ag(t, e, n, r, o, i, s, a) {
            const l = Ni(r),
              c = t.firstCreatePass && Pp(t),
              d = e[8],
              f = Fp(e);
            let h = !0;
            if (3 & r.type || a) {
              const D = mt(r, e),
                v = a ? a(D) : D,
                g = f.length,
                b = a ? (F) => a(me(F[r.index])) : r.index;
              if (ce(n)) {
                let F = null;
                if (
                  (!a &&
                    l &&
                    (F = (function UM(t, e, n, r) {
                      const o = t.cleanup;
                      if (null != o)
                        for (let i = 0; i < o.length - 1; i += 2) {
                          const s = o[i];
                          if (s === n && o[i + 1] === r) {
                            const a = e[7],
                              l = o[i + 2];
                            return a.length > l ? a[l] : null;
                          }
                          "string" == typeof s && (i += 2);
                        }
                      return null;
                    })(t, e, o, r.index)),
                  null !== F)
                )
                  ((F.__ngLastListenerFn__ || F).__ngNextListenerFn__ = i),
                    (F.__ngLastListenerFn__ = i),
                    (h = !1);
                else {
                  i = wu(r, e, d, i, !1);
                  const q = n.listen(v, o, i);
                  f.push(i, q), c && c.push(o, b, g, g + 1);
                }
              } else
                (i = wu(r, e, d, i, !0)),
                  v.addEventListener(o, i, s),
                  f.push(i),
                  c && c.push(o, b, g, s);
            } else i = wu(r, e, d, i, !1);
            const p = r.outputs;
            let m;
            if (h && null !== p && (m = p[o])) {
              const D = m.length;
              if (D)
                for (let v = 0; v < D; v += 2) {
                  const ct = e[m[v]][m[v + 1]].subscribe(i),
                    sr = f.length;
                  f.push(i, ct), c && c.push(o, r.index, sr, -(sr + 1));
                }
            }
          })(i, o, o[k], s, t, e, !!n, r),
          Le
        );
      }
      function Tg(t, e, n, r) {
        try {
          return !1 !== n(r);
        } catch (o) {
          return Vp(t, o), !1;
        }
      }
      function wu(t, e, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          const a = 2 & t.flags ? rt(t.index, e) : e;
          0 == (32 & e[2]) && nu(a);
          let l = Tg(e, 0, r, s),
            u = i.__ngNextListenerFn__;
          for (; u; ) (l = Tg(e, 0, u, s) && l), (u = u.__ngNextListenerFn__);
          return o && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function Sg(t = 1) {
        return (function UE(t) {
          return (S.lFrame.contextLView = (function HE(t, e) {
            for (; t > 0; ) (e = e[15]), t--;
            return e;
          })(t, S.lFrame.contextLView))[8];
        })(t);
      }
      function Lg(t, e, n, r, o) {
        const i = t[n + 1],
          s = null === e;
        let a = r ? It(i) : ln(i),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = t[a + 1];
          WM(t[a], e) && ((l = !0), (t[a + 1] = r ? Ul(c) : Bl(c))),
            (a = r ? It(c) : ln(c));
        }
        l && (t[n + 1] = r ? Bl(i) : Ul(i));
      }
      function WM(t, e) {
        return (
          null === t ||
          null == e ||
          (Array.isArray(t) ? t[1] : t) === e ||
          (!(!Array.isArray(t) || "string" != typeof e) && Er(t, e) >= 0)
        );
      }
      function ms(t, e) {
        return (
          (function xt(t, e, n, r) {
            const o = y(),
              i = G(),
              s = (function an(t) {
                const e = S.lFrame,
                  n = e.bindingIndex;
                return (e.bindingIndex = e.bindingIndex + t), n;
              })(2);
            i.firstUpdatePass &&
              (function Wg(t, e, n, r) {
                const o = t.data;
                if (null === o[n + 1]) {
                  const i = o[He()],
                    s = (function zg(t, e) {
                      return e >= t.expandoStartIndex;
                    })(t, n);
                  (function Jg(t, e) {
                    return 0 != (t.flags & (e ? 16 : 32));
                  })(i, r) &&
                    null === e &&
                    !s &&
                    (e = !1),
                    (e = (function nA(t, e, n, r) {
                      const o = (function el(t) {
                        const e = S.lFrame.currentDirectiveIndex;
                        return -1 === e ? null : t[e];
                      })(t);
                      let i = r ? e.residualClasses : e.residualStyles;
                      if (null === o)
                        0 === (r ? e.classBindings : e.styleBindings) &&
                          ((n = Lo((n = Mu(null, t, e, n, r)), e.attrs, r)),
                          (i = null));
                      else {
                        const s = e.directiveStylingLast;
                        if (-1 === s || t[s] !== o)
                          if (((n = Mu(o, t, e, n, r)), null === i)) {
                            let l = (function rA(t, e, n) {
                              const r = n ? e.classBindings : e.styleBindings;
                              if (0 !== ln(r)) return t[It(r)];
                            })(t, e, r);
                            void 0 !== l &&
                              Array.isArray(l) &&
                              ((l = Mu(null, t, e, l[1], r)),
                              (l = Lo(l, e.attrs, r)),
                              (function oA(t, e, n, r) {
                                t[It(n ? e.classBindings : e.styleBindings)] =
                                  r;
                              })(t, e, r, l));
                          } else
                            i = (function iA(t, e, n) {
                              let r;
                              const o = e.directiveEnd;
                              for (
                                let i = 1 + e.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = Lo(r, t[i].hostAttrs, n);
                              return Lo(r, e.attrs, n);
                            })(t, e, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (e.residualClasses = i)
                            : (e.residualStyles = i)),
                        n
                      );
                    })(o, i, e, r)),
                    (function qM(t, e, n, r, o, i) {
                      let s = i ? e.classBindings : e.styleBindings,
                        a = It(s),
                        l = ln(s);
                      t[r] = n;
                      let c,
                        u = !1;
                      if (Array.isArray(n)) {
                        const d = n;
                        (c = d[1]), (null === c || Er(d, c) > 0) && (u = !0);
                      } else c = n;
                      if (o)
                        if (0 !== l) {
                          const f = It(t[a + 1]);
                          (t[r + 1] = is(f, a)),
                            0 !== f && (t[f + 1] = jl(t[f + 1], r)),
                            (t[a + 1] = (function t0(t, e) {
                              return (131071 & t) | (e << 17);
                            })(t[a + 1], r));
                        } else
                          (t[r + 1] = is(a, 0)),
                            0 !== a && (t[a + 1] = jl(t[a + 1], r)),
                            (a = r);
                      else
                        (t[r + 1] = is(l, 0)),
                          0 === a ? (a = r) : (t[l + 1] = jl(t[l + 1], r)),
                          (l = r);
                      u && (t[r + 1] = Bl(t[r + 1])),
                        Lg(t, c, r, !0),
                        Lg(t, c, r, !1),
                        (function zM(t, e, n, r, o) {
                          const i = o ? t.residualClasses : t.residualStyles;
                          null != i &&
                            "string" == typeof e &&
                            Er(i, e) >= 0 &&
                            (n[r + 1] = Ul(n[r + 1]));
                        })(e, c, t, r, i),
                        (s = is(a, l)),
                        i ? (e.classBindings = s) : (e.styleBindings = s);
                    })(o, i, e, n, s, r);
                }
              })(i, t, s, r),
              e !== N &&
                Ve(o, s, e) &&
                (function Zg(t, e, n, r, o, i, s, a) {
                  if (!(3 & e.type)) return;
                  const l = t.data,
                    u = l[a + 1];
                  ys(
                    (function cp(t) {
                      return 1 == (1 & t);
                    })(u)
                      ? Kg(l, e, n, o, ln(u), s)
                      : void 0
                  ) ||
                    (ys(i) ||
                      ((function up(t) {
                        return 2 == (2 & t);
                      })(u) &&
                        (i = Kg(l, null, n, o, a, s))),
                    (function $b(t, e, n, r, o) {
                      const i = ce(t);
                      if (e)
                        o
                          ? i
                            ? t.addClass(n, r)
                            : n.classList.add(r)
                          : i
                          ? t.removeClass(n, r)
                          : n.classList.remove(r);
                      else {
                        let s = -1 === r.indexOf("-") ? void 0 : it.DashCase;
                        if (null == o)
                          i
                            ? t.removeStyle(n, r, s)
                            : n.style.removeProperty(r);
                        else {
                          const a =
                            "string" == typeof o && o.endsWith("!important");
                          a && ((o = o.slice(0, -10)), (s |= it.Important)),
                            i
                              ? t.setStyle(n, r, o, s)
                              : n.style.setProperty(r, o, a ? "important" : "");
                        }
                      }
                    })(r, s, Oi(He(), n), o, i));
                })(
                  i,
                  i.data[He()],
                  o,
                  o[k],
                  t,
                  (o[s + 1] = (function lA(t, e) {
                    return (
                      null == t ||
                        ("string" == typeof e
                          ? (t += e)
                          : "object" == typeof t && (t = W(An(t)))),
                      t
                    );
                  })(e, n)),
                  r,
                  s
                );
          })(t, e, null, !0),
          ms
        );
      }
      function Mu(t, e, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = e[a]), (r = Lo(r, i.hostAttrs, o)), i !== t);

        )
          a++;
        return null !== t && (n.directiveStylingLast = a), r;
      }
      function Lo(t, e, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== e)
          for (let i = 0; i < e.length; i++) {
            const s = e[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(t) || (t = void 0 === t ? [] : ["", t]),
                ot(t, s, !!n || e[++i]));
          }
        return void 0 === t ? null : t;
      }
      function Kg(t, e, n, r, o, i) {
        const s = null === e;
        let a;
        for (; o > 0; ) {
          const l = t[o],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let f = n[o + 1];
          f === N && (f = d ? J : void 0);
          let h = d ? dl(f, r) : c === r ? f : void 0;
          if ((u && !ys(h) && (h = dl(l, r)), ys(h) && ((a = h), s))) return a;
          const p = t[o + 1];
          o = s ? It(p) : ln(p);
        }
        if (null !== e) {
          let l = i ? e.residualClasses : e.residualStyles;
          null != l && (a = dl(l, r));
        }
        return a;
      }
      function ys(t) {
        return void 0 !== t;
      }
      function Ge(t, e = "") {
        const n = y(),
          r = G(),
          o = t + 20,
          i = r.firstCreatePass ? Tr(r, o, 1, e, null) : r.data[o],
          s = (n[o] = (function xl(t, e) {
            return ce(t) ? t.createText(e) : t.createTextNode(e);
          })(n[k], e));
        rs(r, n, s, i), jt(i, !1);
      }
      function Au(t) {
        return Bo("", t, ""), Au;
      }
      function Bo(t, e, n) {
        const r = y(),
          o = (function Fr(t, e, n, r) {
            return Ve(t, pr(), n) ? e + R(n) + r : N;
          })(r, t, e, n);
        return o !== N && un(r, He(), o), Bo;
      }
      const Zn = void 0;
      var SA = [
        "en",
        [["a", "p"], ["AM", "PM"], Zn],
        [["AM", "PM"], Zn, Zn],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        Zn,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        Zn,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", Zn, "{1} 'at' {0}", Zn],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function TA(t) {
          const n = Math.floor(Math.abs(t)),
            r = t.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === n && 0 === r ? 1 : 5;
        },
      ];
      let qr = {};
      function qe(t) {
        const e = (function RA(t) {
          return t.toLowerCase().replace(/_/g, "-");
        })(t);
        let n = vm(e);
        if (n) return n;
        const r = e.split("-")[0];
        if (((n = vm(r)), n)) return n;
        if ("en" === r) return SA;
        throw new Error(`Missing locale data for the locale "${t}".`);
      }
      function vm(t) {
        return (
          t in qr ||
            (qr[t] =
              Z.ng &&
              Z.ng.common &&
              Z.ng.common.locales &&
              Z.ng.common.locales[t]),
          qr[t]
        );
      }
      var E = (() => (
        ((E = E || {})[(E.LocaleId = 0)] = "LocaleId"),
        (E[(E.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
        (E[(E.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
        (E[(E.DaysFormat = 3)] = "DaysFormat"),
        (E[(E.DaysStandalone = 4)] = "DaysStandalone"),
        (E[(E.MonthsFormat = 5)] = "MonthsFormat"),
        (E[(E.MonthsStandalone = 6)] = "MonthsStandalone"),
        (E[(E.Eras = 7)] = "Eras"),
        (E[(E.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
        (E[(E.WeekendRange = 9)] = "WeekendRange"),
        (E[(E.DateFormat = 10)] = "DateFormat"),
        (E[(E.TimeFormat = 11)] = "TimeFormat"),
        (E[(E.DateTimeFormat = 12)] = "DateTimeFormat"),
        (E[(E.NumberSymbols = 13)] = "NumberSymbols"),
        (E[(E.NumberFormats = 14)] = "NumberFormats"),
        (E[(E.CurrencyCode = 15)] = "CurrencyCode"),
        (E[(E.CurrencySymbol = 16)] = "CurrencySymbol"),
        (E[(E.CurrencyName = 17)] = "CurrencyName"),
        (E[(E.Currencies = 18)] = "Currencies"),
        (E[(E.Directionality = 19)] = "Directionality"),
        (E[(E.PluralCase = 20)] = "PluralCase"),
        (E[(E.ExtraData = 21)] = "ExtraData"),
        E
      ))();
      const vs = "en-US";
      let _m = vs;
      function Iu(t, e, n, r, o) {
        if (((t = P(t)), Array.isArray(t)))
          for (let i = 0; i < t.length; i++) Iu(t[i], e, n, r, o);
        else {
          const i = G(),
            s = y();
          let a = xr(t) ? t : P(t.provide),
            l = $p(t);
          const u = Ee(),
            c = 1048575 & u.providerIndexes,
            d = u.directiveStart,
            f = u.providerIndexes >> 20;
          if (xr(t) || !t.multi) {
            const h = new fo(l, o, _),
              p = xu(a, e, o ? c : c + f, d);
            -1 === p
              ? (qi(po(u, s), i, a),
                Ru(i, t, e.length),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                o && (u.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = xu(a, e, c + f, d),
              p = xu(a, e, c, c + f),
              m = h >= 0 && n[h],
              D = p >= 0 && n[p];
            if ((o && !D) || (!o && !m)) {
              qi(po(u, s), i, a);
              const v = (function ST(t, e, n, r, o) {
                const i = new fo(t, n, _);
                return (
                  (i.multi = []),
                  (i.index = e),
                  (i.componentProviders = 0),
                  $m(i, o, r && !n),
                  i
                );
              })(o ? TT : AT, n.length, o, r, l);
              !o && D && (n[p].providerFactory = v),
                Ru(i, t, e.length, 0),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                o && (u.providerIndexes += 1048576),
                n.push(v),
                s.push(v);
            } else Ru(i, t, h > -1 ? h : p, $m(n[o ? p : h], l, !o && r));
            !o && r && D && n[p].componentProviders++;
          }
        }
      }
      function Ru(t, e, n, r) {
        const o = xr(e),
          i = (function Z0(t) {
            return !!t.useClass;
          })(e);
        if (o || i) {
          const l = (i ? P(e.useClass) : e).prototype.ngOnDestroy;
          if (l) {
            const u = t.destroyHooks || (t.destroyHooks = []);
            if (!o && e.multi) {
              const c = u.indexOf(n);
              -1 === c ? u.push(n, [r, l]) : u[c + 1].push(r, l);
            } else u.push(n, l);
          }
        }
      }
      function $m(t, e, n) {
        return n && t.componentProviders++, t.multi.push(e) - 1;
      }
      function xu(t, e, n, r) {
        for (let o = n; o < r; o++) if (e[o] === t) return o;
        return -1;
      }
      function AT(t, e, n, r) {
        return Nu(this.multi, []);
      }
      function TT(t, e, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = go(n, n[1], this.providerFactory.index, r);
          (i = a.slice(0, s)), Nu(o, i);
          for (let l = s; l < a.length; l++) i.push(a[l]);
        } else (i = []), Nu(o, i);
        return i;
      }
      function Nu(t, e) {
        for (let n = 0; n < t.length; n++) e.push((0, t[n])());
        return e;
      }
      function se(t, e = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function MT(t, e, n) {
              const r = G();
              if (r.firstCreatePass) {
                const o = Tt(t);
                Iu(n, r.data, r.blueprint, o, !0),
                  Iu(e, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(t) : t, e);
        };
      }
      class Gm {}
      class xT {
        resolveComponentFactory(e) {
          throw (function RT(t) {
            const e = Error(
              `No component factory found for ${W(
                t
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (e.ngComponent = t), e;
          })(e);
        }
      }
      let Go = (() => {
        class t {}
        return (t.NULL = new xT()), t;
      })();
      function NT() {
        return Wr(Ee(), y());
      }
      function Wr(t, e) {
        return new at(mt(t, e));
      }
      let at = (() => {
        class t {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (t.__NG_ELEMENT_ID__ = NT), t;
      })();
      function OT(t) {
        return t instanceof at ? t.nativeElement : t;
      }
      class zm {}
      let cn = (() => {
          class t {}
          return (
            (t.__NG_ELEMENT_ID__ = () =>
              (function PT() {
                const t = y(),
                  n = rt(Ee().index, t);
                return (function FT(t) {
                  return t[k];
                })(Bt(n) ? n : t);
              })()),
            t
          );
        })(),
        kT = (() => {
          class t {}
          return (
            (t.??prov = x({
              token: t,
              providedIn: "root",
              factory: () => null,
            })),
            t
          );
        })();
      class qo {
        constructor(e) {
          (this.full = e),
            (this.major = e.split(".")[0]),
            (this.minor = e.split(".")[1]),
            (this.patch = e.split(".").slice(2).join("."));
        }
      }
      const VT = new qo("13.3.0"),
        Ou = {};
      function ws(t, e, n, r, o = !1) {
        for (; null !== n; ) {
          const i = e[n.index];
          if ((null !== i && r.push(me(i)), At(i)))
            for (let a = 10; a < i.length; a++) {
              const l = i[a],
                u = l[1].firstChild;
              null !== u && ws(l[1], l, u, r);
            }
          const s = n.type;
          if (8 & s) ws(t, e, n.child, r);
          else if (32 & s) {
            const a = Sl(n, e);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = Yh(e, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = Ro(e[16]);
              ws(l[1], l, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class zo {
        constructor(e, n) {
          (this._lView = e),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const e = this._lView,
            n = e[1];
          return ws(n, e, n.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(e) {
          this._lView[8] = e;
        }
        get destroyed() {
          return 256 == (256 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const e = this._lView[3];
            if (At(e)) {
              const n = e[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (Ol(e, r), Wi(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          $h(this._lView[1], this._lView);
        }
        onDestroy(e) {
          bp(this._lView[1], this._lView, null, e);
        }
        markForCheck() {
          nu(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -129;
        }
        reattach() {
          this._lView[2] |= 128;
        }
        detectChanges() {
          ou(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {
          !(function L0(t, e, n) {
            Pi(!0);
            try {
              ou(t, e, n);
            } finally {
              Pi(!1);
            }
          })(this._lView[1], this._lView, this.context);
        }
        attachToViewContainerRef() {
          if (this._appRef) throw new $(902, "");
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function Ob(t, e) {
              xo(t, e, e[k], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(e) {
          if (this._attachedToViewContainer) throw new $(902, "");
          this._appRef = e;
        }
      }
      class LT extends zo {
        constructor(e) {
          super(e), (this._view = e);
        }
        detectChanges() {
          Op(this._view);
        }
        checkNoChanges() {
          !(function B0(t) {
            Pi(!0);
            try {
              Op(t);
            } finally {
              Pi(!1);
            }
          })(this._view);
        }
        get context() {
          return null;
        }
      }
      class Wm extends Go {
        constructor(e) {
          super(), (this.ngModule = e);
        }
        resolveComponentFactory(e) {
          const n = Ne(e);
          return new Fu(n, this.ngModule);
        }
      }
      function Qm(t) {
        const e = [];
        for (let n in t)
          t.hasOwnProperty(n) && e.push({ propName: t[n], templateName: n });
        return e;
      }
      class Fu extends Gm {
        constructor(e, n) {
          super(),
            (this.componentDef = e),
            (this.ngModule = n),
            (this.componentType = e.type),
            (this.selector = (function Xb(t) {
              return t.map(Yb).join(",");
            })(e.selectors)),
            (this.ngContentSelectors = e.ngContentSelectors
              ? e.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        get inputs() {
          return Qm(this.componentDef.inputs);
        }
        get outputs() {
          return Qm(this.componentDef.outputs);
        }
        create(e, n, r, o) {
          const i = (o = o || this.ngModule)
              ? (function jT(t, e) {
                  return {
                    get: (n, r, o) => {
                      const i = t.get(n, Ou, o);
                      return i !== Ou || r === Ou ? i : e.get(n, r, o);
                    },
                  };
                })(e, o.injector)
              : e,
            s = i.get(zm, Ff),
            a = i.get(kT, null),
            l = s.createRenderer(null, this.componentDef),
            u = this.componentDef.selectors[0][0] || "div",
            c = r
              ? (function wp(t, e, n) {
                  if (ce(t)) return t.selectRootElement(e, n === Lt.ShadowDom);
                  let r = "string" == typeof e ? t.querySelector(e) : e;
                  return (r.textContent = ""), r;
                })(l, r, this.componentDef.encapsulation)
              : Nl(
                  s.createRenderer(null, this.componentDef),
                  u,
                  (function BT(t) {
                    const e = t.toLowerCase();
                    return "svg" === e ? "svg" : "math" === e ? "math" : null;
                  })(u)
                ),
            d = this.componentDef.onPush ? 576 : 528,
            f = (function tg(t, e) {
              return {
                components: [],
                scheduler: t || Mb,
                clean: j0,
                playerHandler: e || null,
                flags: 0,
              };
            })(),
            h = ls(0, null, null, 1, 0, null, null, null, null, null),
            p = No(null, h, f, d, null, null, s, l, a, i);
          let m, D;
          ki(p);
          try {
            const v = (function Xp(t, e, n, r, o, i) {
              const s = n[1];
              n[20] = t;
              const l = Tr(s, 20, 2, "#host", null),
                u = (l.mergedAttrs = e.hostAttrs);
              null !== u &&
                (cs(l, u, !0),
                null !== t &&
                  (Ui(o, t, u),
                  null !== l.classes && Ll(o, t, l.classes),
                  null !== l.styles && tp(o, t, l.styles)));
              const c = r.createRenderer(t, e),
                d = No(
                  n,
                  Cp(e),
                  null,
                  e.onPush ? 64 : 16,
                  n[20],
                  l,
                  r,
                  c,
                  i || null,
                  null
                );
              return (
                s.firstCreatePass &&
                  (qi(po(l, n), s, e.type), Ip(s, l), Rp(l, n.length, 1)),
                us(n, d),
                (n[20] = d)
              );
            })(c, this.componentDef, p, s, l);
            if (c)
              if (r) Ui(l, c, ["ng-version", VT.full]);
              else {
                const { attrs: g, classes: b } = (function e0(t) {
                  const e = [],
                    n = [];
                  let r = 1,
                    o = 2;
                  for (; r < t.length; ) {
                    let i = t[r];
                    if ("string" == typeof i)
                      2 === o
                        ? "" !== i && e.push(i, t[++r])
                        : 8 === o && n.push(i);
                    else {
                      if (!St(o)) break;
                      o = i;
                    }
                    r++;
                  }
                  return { attrs: e, classes: n };
                })(this.componentDef.selectors[0]);
                g && Ui(l, c, g), b && b.length > 0 && Ll(l, c, b.join(" "));
              }
            if (((D = Qa(h, 20)), void 0 !== n)) {
              const g = (D.projection = []);
              for (let b = 0; b < this.ngContentSelectors.length; b++) {
                const F = n[b];
                g.push(null != F ? Array.from(F) : null);
              }
            }
            (m = (function eg(t, e, n, r, o) {
              const i = n[1],
                s = (function E0(t, e, n) {
                  const r = Ee();
                  t.firstCreatePass &&
                    (n.providersResolver && n.providersResolver(n),
                    xp(t, r, e, Sr(t, e, 1, null), n));
                  const o = go(e, t, r.directiveStart, r);
                  Pe(o, e);
                  const i = mt(r, e);
                  return i && Pe(i, e), o;
                })(i, n, e);
              if (
                (r.components.push(s),
                (t[8] = s),
                o && o.forEach((l) => l(s, e)),
                e.contentQueries)
              ) {
                const l = Ee();
                e.contentQueries(1, s, l.directiveStart);
              }
              const a = Ee();
              return (
                !i.firstCreatePass ||
                  (null === e.hostBindings && null === e.hostAttrs) ||
                  (wn(a.index),
                  Tp(n[1], a, 0, a.directiveStart, a.directiveEnd, e),
                  Sp(e, s)),
                s
              );
            })(v, this.componentDef, p, f, [sM])),
              Oo(h, p, null);
          } finally {
            Vi();
          }
          return new HT(this.componentType, m, Wr(D, p), p, D);
        }
      }
      class HT extends class IT {} {
        constructor(e, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new LT(o)),
            (this.componentType = e);
        }
        get injector() {
          return new yr(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(e) {
          this.hostView.onDestroy(e);
        }
      }
      class dn {}
      class Zm {}
      const Qr = new Map();
      class Ym extends dn {
        constructor(e, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.injector = this),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Wm(this));
          const r = ft(e);
          (this._bootstrapComponents = $t(r.bootstrap)),
            (this._r3Injector = Hp(
              e,
              n,
              [
                { provide: dn, useValue: this },
                { provide: Go, useValue: this.componentFactoryResolver },
              ],
              W(e)
            )),
            this._r3Injector._resolveInjectorDefTypes(),
            (this.instance = this.get(e));
        }
        get(e, n = ke.THROW_IF_NOT_FOUND, r = I.Default) {
          return e === ke || e === dn || e === su
            ? this
            : this._r3Injector.get(e, n, r);
        }
        destroy() {
          const e = this._r3Injector;
          !e.destroyed && e.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(e) {
          this.destroyCbs.push(e);
        }
      }
      class Pu extends Zm {
        constructor(e) {
          super(),
            (this.moduleType = e),
            null !== ft(e) &&
              (function GT(t) {
                const e = new Set();
                !(function n(r) {
                  const o = ft(r, !0),
                    i = o.id;
                  null !== i &&
                    ((function Km(t, e, n) {
                      if (e && e !== n)
                        throw new Error(
                          `Duplicate module registered for ${t} - ${W(
                            e
                          )} vs ${W(e.name)}`
                        );
                    })(i, Qr.get(i), r),
                    Qr.set(i, r));
                  const s = $t(o.imports);
                  for (const a of s) e.has(a) || (e.add(a), n(a));
                })(t);
              })(e);
        }
        create(e) {
          return new Ym(this.moduleType, e);
        }
      }
      function ey(t, e, n, r, o, i, s) {
        const a = e + n;
        return (function Qn(t, e, n, r) {
          const o = Ve(t, e, n);
          return Ve(t, e + 1, r) || o;
        })(t, a, o, i)
          ? (function qt(t, e, n) {
              return (t[e] = n);
            })(t, a + 2, s ? r.call(s, o, i) : r(o, i))
          : (function Wo(t, e) {
              const n = t[e];
              return n === N ? void 0 : n;
            })(t, a + 2);
      }
      function ku(t, e) {
        const n = G();
        let r;
        const o = t + 20;
        n.firstCreatePass
          ? ((r = (function tS(t, e) {
              if (e)
                for (let n = e.length - 1; n >= 0; n--) {
                  const r = e[n];
                  if (t === r.name) return r;
                }
            })(e, n.pipeRegistry)),
            (n.data[o] = r),
            r.onDestroy &&
              (n.destroyHooks || (n.destroyHooks = [])).push(o, r.onDestroy))
          : (r = n.data[o]);
        const i = r.factory || (r.factory = zn(r.type)),
          s = _n(_);
        try {
          const a = $i(!1),
            l = i();
          return (
            $i(a),
            (function vM(t, e, n, r) {
              n >= t.data.length &&
                ((t.data[n] = null), (t.blueprint[n] = null)),
                (e[n] = r);
            })(n, y(), o, l),
            l
          );
        } finally {
          _n(s);
        }
      }
      function Vu(t, e, n, r) {
        const o = t + 20,
          i = y(),
          s = hr(i, o);
        return (function Qo(t, e) {
          return t[1].data[e].pure;
        })(i, o)
          ? ey(
              i,
              (function Ue() {
                const t = S.lFrame;
                let e = t.bindingRootIndex;
                return (
                  -1 === e &&
                    (e = t.bindingRootIndex = t.tView.bindingStartIndex),
                  e
                );
              })(),
              e,
              s.transform,
              n,
              r,
              s
            )
          : s.transform(n, r);
      }
      function Lu(t) {
        return (e) => {
          setTimeout(t, void 0, e);
        };
      }
      const le = class sS extends en {
        constructor(e = !1) {
          super(), (this.__isAsync = e);
        }
        emit(e) {
          super.next(e);
        }
        subscribe(e, n, r) {
          var o, i, s;
          let a = e,
            l = n || (() => null),
            u = r;
          if (e && "object" == typeof e) {
            const d = e;
            (a = null === (o = d.next) || void 0 === o ? void 0 : o.bind(d)),
              (l = null === (i = d.error) || void 0 === i ? void 0 : i.bind(d)),
              (u =
                null === (s = d.complete) || void 0 === s ? void 0 : s.bind(d));
          }
          this.__isAsync && ((l = Lu(l)), a && (a = Lu(a)), u && (u = Lu(u)));
          const c = super.subscribe({ next: a, error: l, complete: u });
          return e instanceof dt && e.add(c), c;
        }
      };
      function aS() {
        return this._results[Nr()]();
      }
      class Bu {
        constructor(e = !1) {
          (this._emitDistinctChangesOnly = e),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const n = Nr(),
            r = Bu.prototype;
          r[n] || (r[n] = aS);
        }
        get changes() {
          return this._changes || (this._changes = new le());
        }
        get(e) {
          return this._results[e];
        }
        map(e) {
          return this._results.map(e);
        }
        filter(e) {
          return this._results.filter(e);
        }
        find(e) {
          return this._results.find(e);
        }
        reduce(e, n) {
          return this._results.reduce(e, n);
        }
        forEach(e) {
          this._results.forEach(e);
        }
        some(e) {
          return this._results.some(e);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(e, n) {
          const r = this;
          r.dirty = !1;
          const o = yt(e);
          (this._changesDetected = !(function uw(t, e, n) {
            if (t.length !== e.length) return !1;
            for (let r = 0; r < t.length; r++) {
              let o = t[r],
                i = e[r];
              if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
            }
            return !0;
          })(r._results, o, n)) &&
            ((r._results = o),
            (r.length = o.length),
            (r.last = o[this.length - 1]),
            (r.first = o[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      Symbol;
      let fn = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = cS), t;
      })();
      const lS = fn,
        uS = class extends lS {
          constructor(e, n, r) {
            super(),
              (this._declarationLView = e),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(e) {
            const n = this._declarationTContainer.tViews,
              r = No(
                this._declarationLView,
                n,
                e,
                16,
                null,
                n.declTNode,
                null,
                null,
                null,
                null
              );
            r[17] = this._declarationLView[this._declarationTContainer.index];
            const i = this._declarationLView[19];
            return (
              null !== i && (r[19] = i.createEmbeddedView(n)),
              Oo(n, r, e),
              new zo(r)
            );
          }
        };
      function cS() {
        return bs(Ee(), y());
      }
      function bs(t, e) {
        return 4 & t.type ? new uS(e, t, Wr(t, e)) : null;
      }
      let Ot = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = dS), t;
      })();
      function dS() {
        return sy(Ee(), y());
      }
      const fS = Ot,
        oy = class extends fS {
          constructor(e, n, r) {
            super(),
              (this._lContainer = e),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Wr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new yr(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const e = Gi(this._hostTNode, this._hostLView);
            if (Kf(e)) {
              const n = mr(e, this._hostLView),
                r = gr(e);
              return new yr(n[1].data[r + 8], n);
            }
            return new yr(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(e) {
            const n = iy(this._lContainer);
            return (null !== n && n[e]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(e, n, r) {
            const o = e.createEmbeddedView(n || {});
            return this.insert(o, r), o;
          }
          createComponent(e, n, r, o, i) {
            const s =
              e &&
              !(function vo(t) {
                return "function" == typeof t;
              })(e);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.ngModuleRef);
            }
            const l = s ? e : new Fu(Ne(e)),
              u = r || this.parentInjector;
            if (!i && null == l.ngModule) {
              const f = (s ? u : this.parentInjector).get(dn, null);
              f && (i = f);
            }
            const c = l.create(u, o, void 0, i);
            return this.insert(c.hostView, a), c;
          }
          insert(e, n) {
            const r = e._lView,
              o = r[1];
            if (
              (function IE(t) {
                return At(t[3]);
              })(r)
            ) {
              const c = this.indexOf(e);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new oy(d, d[6], d[3]);
                f.detach(f.indexOf(e));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function Pb(t, e, n, r) {
              const o = 10 + r,
                i = n.length;
              r > 0 && (n[o - 1][4] = e),
                r < i - 10
                  ? ((e[4] = n[o]), sh(n, 10 + r, e))
                  : (n.push(e), (e[4] = null)),
                (e[3] = n);
              const s = e[17];
              null !== s &&
                n !== s &&
                (function kb(t, e) {
                  const n = t[9];
                  e[16] !== e[3][3][16] && (t[2] = !0),
                    null === n ? (t[9] = [e]) : n.push(e);
                })(s, e);
              const a = e[19];
              null !== a && a.insertView(t), (e[2] |= 128);
            })(o, r, s, i);
            const a = kl(i, s),
              l = r[k],
              u = ns(l, s[7]);
            return (
              null !== u &&
                (function Nb(t, e, n, r, o, i) {
                  (r[0] = o), (r[6] = e), xo(t, r, n, 1, o, i);
                })(o, s[6], l, r, u, a),
              e.attachToViewContainerRef(),
              sh(ju(s), i, e),
              e
            );
          }
          move(e, n) {
            return this.insert(e, n);
          }
          indexOf(e) {
            const n = iy(this._lContainer);
            return null !== n ? n.indexOf(e) : -1;
          }
          remove(e) {
            const n = this._adjustIndex(e, -1),
              r = Ol(this._lContainer, n);
            r && (Wi(ju(this._lContainer), n), $h(r[1], r));
          }
          detach(e) {
            const n = this._adjustIndex(e, -1),
              r = Ol(this._lContainer, n);
            return r && null != Wi(ju(this._lContainer), n) ? new zo(r) : null;
          }
          _adjustIndex(e, n = 0) {
            return null == e ? this.length + n : e;
          }
        };
      function iy(t) {
        return t[8];
      }
      function ju(t) {
        return t[8] || (t[8] = []);
      }
      function sy(t, e) {
        let n;
        const r = e[t.index];
        if (At(r)) n = r;
        else {
          let o;
          if (8 & t.type) o = me(r);
          else {
            const i = e[k];
            o = i.createComment("");
            const s = mt(t, e);
            Wn(
              i,
              ns(i, s),
              o,
              (function jb(t, e) {
                return ce(t) ? t.nextSibling(e) : e.nextSibling;
              })(i, s),
              !1
            );
          }
          (e[t.index] = n = Np(r, e, o, t)), us(e, n);
        }
        return new oy(n, t, e);
      }
      class Uu {
        constructor(e) {
          (this.queryList = e), (this.matches = null);
        }
        clone() {
          return new Uu(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class Hu {
        constructor(e = []) {
          this.queries = e;
        }
        createEmbeddedView(e) {
          const n = e.queries;
          if (null !== n) {
            const r =
                null !== e.contentQueries ? e.contentQueries[0] : n.length,
              o = [];
            for (let i = 0; i < r; i++) {
              const s = n.getByIndex(i);
              o.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new Hu(o);
          }
          return null;
        }
        insertView(e) {
          this.dirtyQueriesWithMatches(e);
        }
        detachView(e) {
          this.dirtyQueriesWithMatches(e);
        }
        dirtyQueriesWithMatches(e) {
          for (let n = 0; n < this.queries.length; n++)
            null !== dy(e, n).matches && this.queries[n].setDirty();
        }
      }
      class ay {
        constructor(e, n, r = null) {
          (this.predicate = e), (this.flags = n), (this.read = r);
        }
      }
      class $u {
        constructor(e = []) {
          this.queries = e;
        }
        elementStart(e, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(e, n);
        }
        elementEnd(e) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].elementEnd(e);
        }
        embeddedTView(e) {
          let n = null;
          for (let r = 0; r < this.length; r++) {
            const o = null !== n ? n.length : 0,
              i = this.getByIndex(r).embeddedTView(e, o);
            i &&
              ((i.indexInDeclarationView = r),
              null !== n ? n.push(i) : (n = [i]));
          }
          return null !== n ? new $u(n) : null;
        }
        template(e, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(e, n);
        }
        getByIndex(e) {
          return this.queries[e];
        }
        get length() {
          return this.queries.length;
        }
        track(e) {
          this.queries.push(e);
        }
      }
      class Gu {
        constructor(e, n = -1) {
          (this.metadata = e),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = n);
        }
        elementStart(e, n) {
          this.isApplyingToNode(n) && this.matchTNode(e, n);
        }
        elementEnd(e) {
          this._declarationNodeIndex === e.index &&
            (this._appliesToNextNode = !1);
        }
        template(e, n) {
          this.elementStart(e, n);
        }
        embeddedTView(e, n) {
          return this.isApplyingToNode(e)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-e.index, n),
              new Gu(this.metadata))
            : null;
        }
        isApplyingToNode(e) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const n = this._declarationNodeIndex;
            let r = e.parent;
            for (; null !== r && 8 & r.type && r.index !== n; ) r = r.parent;
            return n === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(e, n) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let o = 0; o < r.length; o++) {
              const i = r[o];
              this.matchTNodeWithReadOption(e, n, gS(n, i)),
                this.matchTNodeWithReadOption(e, n, zi(n, e, i, !1, !1));
            }
          else
            r === fn
              ? 4 & n.type && this.matchTNodeWithReadOption(e, n, -1)
              : this.matchTNodeWithReadOption(e, n, zi(n, e, r, !1, !1));
        }
        matchTNodeWithReadOption(e, n, r) {
          if (null !== r) {
            const o = this.metadata.read;
            if (null !== o)
              if (o === at || o === Ot || (o === fn && 4 & n.type))
                this.addMatch(n.index, -2);
              else {
                const i = zi(n, e, o, !1, !1);
                null !== i && this.addMatch(n.index, i);
              }
            else this.addMatch(n.index, r);
          }
        }
        addMatch(e, n) {
          null === this.matches
            ? (this.matches = [e, n])
            : this.matches.push(e, n);
        }
      }
      function gS(t, e) {
        const n = t.localNames;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) if (n[r] === e) return n[r + 1];
        return null;
      }
      function yS(t, e, n, r) {
        return -1 === n
          ? (function mS(t, e) {
              return 11 & t.type ? Wr(t, e) : 4 & t.type ? bs(t, e) : null;
            })(e, t)
          : -2 === n
          ? (function vS(t, e, n) {
              return n === at
                ? Wr(e, t)
                : n === fn
                ? bs(e, t)
                : n === Ot
                ? sy(e, t)
                : void 0;
            })(t, e, r)
          : go(t, t[1], n, e);
      }
      function ly(t, e, n, r) {
        const o = e[19].queries[r];
        if (null === o.matches) {
          const i = t.data,
            s = n.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const u = s[l];
            a.push(u < 0 ? null : yS(e, i[u], s[l + 1], n.metadata.read));
          }
          o.matches = a;
        }
        return o.matches;
      }
      function qu(t, e, n, r) {
        const o = t.queries.getByIndex(n),
          i = o.matches;
        if (null !== i) {
          const s = ly(t, e, o, n);
          for (let a = 0; a < i.length; a += 2) {
            const l = i[a];
            if (l > 0) r.push(s[a / 2]);
            else {
              const u = i[a + 1],
                c = e[-l];
              for (let d = 10; d < c.length; d++) {
                const f = c[d];
                f[17] === f[3] && qu(f[1], f, u, r);
              }
              if (null !== c[9]) {
                const d = c[9];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  qu(h[1], h, u, r);
                }
              }
            }
          }
        }
        return r;
      }
      function zu(t) {
        const e = y(),
          n = G(),
          r = Uf();
        tl(r + 1);
        const o = dy(n, r);
        if (t.dirty && Pf(e) === (2 == (2 & o.metadata.flags))) {
          if (null === o.matches) t.reset([]);
          else {
            const i = o.crossesNgTemplate ? qu(n, e, r, []) : ly(n, e, o, r);
            t.reset(i, OT), t.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function Wu(t, e, n, r) {
        const o = G();
        if (o.firstCreatePass) {
          const i = Ee();
          (function cy(t, e, n) {
            null === t.queries && (t.queries = new $u()),
              t.queries.track(new Gu(e, n));
          })(o, new ay(e, n, r), i.index),
            (function CS(t, e) {
              const n = t.contentQueries || (t.contentQueries = []);
              e !== (n.length ? n[n.length - 1] : -1) &&
                n.push(t.queries.length - 1, e);
            })(o, t),
            2 == (2 & n) && (o.staticContentQueries = !0);
        }
        !(function uy(t, e, n) {
          const r = new Bu(4 == (4 & n));
          bp(t, e, r, r.destroy),
            null === e[19] && (e[19] = new Hu()),
            e[19].queries.push(new Uu(r));
        })(o, y(), n);
      }
      function Qu() {
        return (function DS(t, e) {
          return t[19].queries[e].queryList;
        })(y(), Uf());
      }
      function dy(t, e) {
        return t.queries.getByIndex(e);
      }
      function fy(t, e) {
        return bs(t, e);
      }
      function Ts(...t) {}
      const ec = new L("Application Initializer");
      let tc = (() => {
        class t {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = Ts),
              (this.reject = Ts),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (Vo(i)) n.push(i);
                else if (Eu(i)) {
                  const s = new Promise((a, l) => {
                    i.subscribe({ complete: a, error: l });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(ec, 8));
          }),
          (t.??prov = x({ token: t, factory: t.??fac, providedIn: "root" })),
          t
        );
      })();
      const Ko = new L("AppId", {
        providedIn: "root",
        factory: function Iy() {
          return `${nc()}${nc()}${nc()}`;
        },
      });
      function nc() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Ry = new L("Platform Initializer"),
        Ss = new L("Platform ID"),
        xy = new L("appBootstrapListener");
      let Ny = (() => {
        class t {
          log(n) {
            console.log(n);
          }
          warn(n) {
            console.warn(n);
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      const hn = new L("LocaleId", {
          providedIn: "root",
          factory: () =>
            Ew(hn, I.Optional | I.SkipSelf) ||
            (function LS() {
              return (
                ("undefined" != typeof $localize && $localize.locale) || vs
              );
            })(),
        }),
        Oy = new L("DefaultCurrencyCode", {
          providedIn: "root",
          factory: () => "USD",
        });
      class BS {
        constructor(e, n) {
          (this.ngModuleFactory = e), (this.componentFactories = n);
        }
      }
      let Fy = (() => {
        class t {
          compileModuleSync(n) {
            return new Pu(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = $t(ft(n).declarations).reduce((s, a) => {
                const l = Ne(a);
                return l && s.push(new Fu(l)), s;
              }, []);
            return new BS(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??prov = x({ token: t, factory: t.??fac, providedIn: "root" })),
          t
        );
      })();
      const US = (() => Promise.resolve(0))();
      function rc(t) {
        "undefined" == typeof Zone
          ? US.then(() => {
              t && t.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", t);
      }
      class Re {
        constructor({
          enableLongStackTrace: e = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new le(!1)),
            (this.onMicrotaskEmpty = new le(!1)),
            (this.onStable = new le(!1)),
            (this.onError = new le(!1)),
            "undefined" == typeof Zone)
          )
            throw new Error("In this configuration Angular requires Zone.js");
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            e &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function HS() {
              let t = Z.requestAnimationFrame,
                e = Z.cancelAnimationFrame;
              if ("undefined" != typeof Zone && t && e) {
                const n = t[Zone.__symbol__("OriginalDelegate")];
                n && (t = n);
                const r = e[Zone.__symbol__("OriginalDelegate")];
                r && (e = r);
              }
              return {
                nativeRequestAnimationFrame: t,
                nativeCancelAnimationFrame: e,
              };
            })().nativeRequestAnimationFrame),
            (function qS(t) {
              const e = () => {
                !(function GS(t) {
                  t.isCheckStableRunning ||
                    -1 !== t.lastRequestAnimationFrameId ||
                    ((t.lastRequestAnimationFrameId =
                      t.nativeRequestAnimationFrame.call(Z, () => {
                        t.fakeTopEventTask ||
                          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (t.lastRequestAnimationFrameId = -1),
                                ic(t),
                                (t.isCheckStableRunning = !0),
                                oc(t),
                                (t.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          t.fakeTopEventTask.invoke();
                      })),
                    ic(t));
                })(t);
              };
              t._inner = t._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return Py(t), n.invokeTask(o, i, s, a);
                  } finally {
                    ((t.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      t.shouldCoalesceRunChangeDetection) &&
                      e(),
                      ky(t);
                  }
                },
                onInvoke: (n, r, o, i, s, a, l) => {
                  try {
                    return Py(t), n.invoke(o, i, s, a, l);
                  } finally {
                    t.shouldCoalesceRunChangeDetection && e(), ky(t);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((t._hasPendingMicrotasks = i.microTask),
                          ic(t),
                          oc(t))
                        : "macroTask" == i.change &&
                          (t.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  t.runOutsideAngular(() => t.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return (
            "undefined" != typeof Zone &&
            !0 === Zone.current.get("isAngularZone")
          );
        }
        static assertInAngularZone() {
          if (!Re.isInAngularZone())
            throw new Error("Expected to be in Angular Zone, but it is not!");
        }
        static assertNotInAngularZone() {
          if (Re.isInAngularZone())
            throw new Error("Expected to not be in Angular Zone, but it is!");
        }
        run(e, n, r) {
          return this._inner.run(e, n, r);
        }
        runTask(e, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, e, $S, Ts, Ts);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(e, n, r) {
          return this._inner.runGuarded(e, n, r);
        }
        runOutsideAngular(e) {
          return this._outer.run(e);
        }
      }
      const $S = {};
      function oc(t) {
        if (0 == t._nesting && !t.hasPendingMicrotasks && !t.isStable)
          try {
            t._nesting++, t.onMicrotaskEmpty.emit(null);
          } finally {
            if ((t._nesting--, !t.hasPendingMicrotasks))
              try {
                t.runOutsideAngular(() => t.onStable.emit(null));
              } finally {
                t.isStable = !0;
              }
          }
      }
      function ic(t) {
        t.hasPendingMicrotasks = !!(
          t._hasPendingMicrotasks ||
          ((t.shouldCoalesceEventChangeDetection ||
            t.shouldCoalesceRunChangeDetection) &&
            -1 !== t.lastRequestAnimationFrameId)
        );
      }
      function Py(t) {
        t._nesting++,
          t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
      }
      function ky(t) {
        t._nesting--, oc(t);
      }
      class zS {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new le()),
            (this.onMicrotaskEmpty = new le()),
            (this.onStable = new le()),
            (this.onError = new le());
        }
        run(e, n, r) {
          return e.apply(n, r);
        }
        runGuarded(e, n, r) {
          return e.apply(n, r);
        }
        runOutsideAngular(e) {
          return e();
        }
        runTask(e, n, r, o) {
          return e.apply(n, r);
        }
      }
      let sc = (() => {
          class t {
            constructor(n) {
              (this._ngZone = n),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    "undefined" == typeof Zone
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      Re.assertNotInAngularZone(),
                        rc(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                rc(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(Re));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        Vy = (() => {
          class t {
            constructor() {
              (this._applications = new Map()), ac.addToWindow(this);
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return ac.findTestabilityInTree(this, n, r);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })();
      class WS {
        addToWindow(e) {}
        findTestabilityInTree(e, n, r) {
          return null;
        }
      }
      let Ft,
        ac = new WS();
      const Ly = new L("AllowMultipleToken");
      class By {
        constructor(e, n) {
          (this.name = e), (this.token = n);
        }
      }
      function jy(t, e, n = []) {
        const r = `Platform: ${e}`,
          o = new L(r);
        return (i = []) => {
          let s = Uy();
          if (!s || s.injector.get(Ly, !1))
            if (t) t(n.concat(i).concat({ provide: o, useValue: !0 }));
            else {
              const a = n
                .concat(i)
                .concat(
                  { provide: o, useValue: !0 },
                  { provide: au, useValue: "platform" }
                );
              !(function JS(t) {
                if (Ft && !Ft.destroyed && !Ft.injector.get(Ly, !1))
                  throw new $(400, "");
                Ft = t.get(Hy);
                const e = t.get(Ry, null);
                e && e.forEach((n) => n());
              })(ke.create({ providers: a, name: r }));
            }
          return (function YS(t) {
            const e = Uy();
            if (!e) throw new $(401, "");
            return e;
          })();
        };
      }
      function Uy() {
        return Ft && !Ft.destroyed ? Ft : null;
      }
      let Hy = (() => {
        class t {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const a = (function XS(t, e) {
                let n;
                return (
                  (n =
                    "noop" === t
                      ? new zS()
                      : ("zone.js" === t ? void 0 : t) ||
                        new Re({
                          enableLongStackTrace: !1,
                          shouldCoalesceEventChangeDetection: !!(null == e
                            ? void 0
                            : e.ngZoneEventCoalescing),
                          shouldCoalesceRunChangeDetection: !!(null == e
                            ? void 0
                            : e.ngZoneRunCoalescing),
                        })),
                  n
                );
              })(r ? r.ngZone : void 0, {
                ngZoneEventCoalescing: (r && r.ngZoneEventCoalescing) || !1,
                ngZoneRunCoalescing: (r && r.ngZoneRunCoalescing) || !1,
              }),
              l = [{ provide: Re, useValue: a }];
            return a.run(() => {
              const u = ke.create({
                  providers: l,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                c = n.create(u),
                d = c.injector.get(Io, null);
              if (!d) throw new $(402, "");
              return (
                a.runOutsideAngular(() => {
                  const f = a.onError.subscribe({
                    next: (h) => {
                      d.handleError(h);
                    },
                  });
                  c.onDestroy(() => {
                    uc(this._modules, c), f.unsubscribe();
                  });
                }),
                (function eI(t, e, n) {
                  try {
                    const r = n();
                    return Vo(r)
                      ? r.catch((o) => {
                          throw (
                            (e.runOutsideAngular(() => t.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (e.runOutsideAngular(() => t.handleError(r)), r);
                  }
                })(d, a, () => {
                  const f = c.injector.get(tc);
                  return (
                    f.runInitializers(),
                    f.donePromise.then(
                      () => (
                        (function FA(t) {
                          et(t, "Expected localeId to be defined"),
                            "string" == typeof t &&
                              (_m = t.toLowerCase().replace(/_/g, "-"));
                        })(c.injector.get(hn, vs) || vs),
                        this._moduleDoBootstrap(c),
                        c
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = $y({}, r);
            return (function ZS(t, e, n) {
              const r = new Pu(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(lc);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new $(403, "");
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new $(404, "");
            this._modules.slice().forEach((n) => n.destroy()),
              this._destroyListeners.forEach((n) => n()),
              (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(ke));
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      function $y(t, e) {
        return Array.isArray(e)
          ? e.reduce($y, t)
          : Object.assign(Object.assign({}, t), e);
      }
      let lc = (() => {
        class t {
          constructor(n, r, o, i, s) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._componentFactoryResolver = i),
              (this._initStatus = s),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const a = new oe((u) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    u.next(this._stable), u.complete();
                  });
              }),
              l = new oe((u) => {
                let c;
                this._zone.runOutsideAngular(() => {
                  c = this._zone.onStable.subscribe(() => {
                    Re.assertNotInAngularZone(),
                      rc(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), u.next(!0));
                      });
                  });
                });
                const d = this._zone.onUnstable.subscribe(() => {
                  Re.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        u.next(!1);
                      }));
                });
                return () => {
                  c.unsubscribe(), d.unsubscribe();
                };
              });
            this.isStable = (function QC(...t) {
              const e = io(t),
                n = (function UC(t, e) {
                  return "number" == typeof Ia(t) ? t.pop() : e;
                })(t, 1 / 0),
                r = t;
              return r.length
                ? 1 === r.length
                  ? Vt(r[0])
                  : oo(n)(Ce(r, e))
                : nn;
            })(
              a,
              l.pipe(
                (function ZC(t = {}) {
                  const {
                    connector: e = () => new en(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = t;
                  return (i) => {
                    let s = null,
                      a = null,
                      l = null,
                      u = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        null == a || a.unsubscribe(), (a = null);
                      },
                      h = () => {
                        f(), (s = l = null), (c = d = !1);
                      },
                      p = () => {
                        const m = s;
                        h(), null == m || m.unsubscribe();
                      };
                    return Ie((m, D) => {
                      u++, !d && !c && f();
                      const v = (l = null != l ? l : e());
                      D.add(() => {
                        u--, 0 === u && !d && !c && (a = Ra(p, o));
                      }),
                        v.subscribe(D),
                        s ||
                          ((s = new Ei({
                            next: (g) => v.next(g),
                            error: (g) => {
                              (d = !0), f(), (a = Ra(h, n, g)), v.error(g);
                            },
                            complete: () => {
                              (c = !0), f(), (a = Ra(h, r)), v.complete();
                            },
                          })),
                          Ce(m).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          bootstrap(n, r) {
            if (!this._initStatus.done) throw new $(405, "");
            let o;
            (o =
              n instanceof Gm
                ? n
                : this._componentFactoryResolver.resolveComponentFactory(n)),
              this.componentTypes.push(o.componentType);
            const i = (function KS(t) {
                return t.isBoundToModule;
              })(o)
                ? void 0
                : this._injector.get(dn),
              a = o.create(ke.NULL, [], r || o.selector, i),
              l = a.location.nativeElement,
              u = a.injector.get(sc, null),
              c = u && a.injector.get(Vy);
            return (
              u && c && c.registerApplication(l, u),
              a.onDestroy(() => {
                this.detachView(a.hostView),
                  uc(this.components, a),
                  c && c.unregisterApplication(l);
              }),
              this._loadComponent(a),
              a
            );
          }
          tick() {
            if (this._runningTick) throw new $(101, "");
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            uc(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView),
              this.tick(),
              this.components.push(n),
              this._injector
                .get(xy, [])
                .concat(this._bootstrapListeners)
                .forEach((o) => o(n));
          }
          ngOnDestroy() {
            this._views.slice().forEach((n) => n.destroy()),
              this._onMicrotaskEmptySubscription.unsubscribe();
          }
          get viewCount() {
            return this._views.length;
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(Re), w(ke), w(Io), w(Go), w(tc));
          }),
          (t.??prov = x({ token: t, factory: t.??fac, providedIn: "root" })),
          t
        );
      })();
      function uc(t, e) {
        const n = t.indexOf(e);
        n > -1 && t.splice(n, 1);
      }
      let qy = !0,
        Is = (() => {
          class t {}
          return (t.__NG_ELEMENT_ID__ = rI), t;
        })();
      function rI(t) {
        return (function oI(t, e, n) {
          if (xi(t) && !n) {
            const r = rt(t.index, e);
            return new zo(r, r);
          }
          return 47 & t.type ? new zo(e[16], e) : null;
        })(Ee(), y(), 16 == (16 & t));
      }
      class Ky {
        constructor() {}
        supports(e) {
          return Po(e);
        }
        create(e) {
          return new cI(e);
        }
      }
      const uI = (t, e) => e;
      class cI {
        constructor(e) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = e || uI);
        }
        forEachItem(e) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) e(n);
        }
        forEachOperation(e) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < Yy(r, o, i)) ? n : r,
              a = Yy(s, o, i),
              l = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const u = a - o,
                c = l - o;
              if (u != c) {
                for (let f = 0; f < u; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  c <= p && p < u && (i[f] = h + 1);
                }
                i[s.previousIndex] = c - u;
              }
            }
            a !== l && e(s, a, l);
          }
        }
        forEachPreviousItem(e) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) e(n);
        }
        forEachAddedItem(e) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) e(n);
        }
        forEachMovedItem(e) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) e(n);
        }
        forEachRemovedItem(e) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) e(n);
        }
        forEachIdentityChange(e) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            e(n);
        }
        diff(e) {
          if ((null == e && (e = []), !Po(e))) throw new $(900, "");
          return this.check(e) ? this : null;
        }
        onDestroy() {}
        check(e) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(e)) {
            this.length = e.length;
            for (let a = 0; a < this.length; a++)
              (i = e[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function mM(t, e) {
                if (Array.isArray(t))
                  for (let n = 0; n < t.length; n++) e(t[n]);
                else {
                  const n = t[Nr()]();
                  let r;
                  for (; !(r = n.next()).done; ) e(r.value);
                }
              })(e, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = e), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let e;
            for (
              e = this._previousItHead = this._itHead;
              null !== e;
              e = e._next
            )
              e._nextPrevious = e._next;
            for (e = this._additionsHead; null !== e; e = e._nextAdded)
              e.previousIndex = e.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                e = this._movesHead;
              null !== e;
              e = e._nextMoved
            )
              e.previousIndex = e.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(e, n, r, o) {
          let i;
          return (
            null === e ? (i = this._itTail) : ((i = e._prev), this._remove(e)),
            null !==
            (e =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._reinsertAfter(e, i, o))
              : null !==
                (e =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, i, o))
              : (e = this._addAfter(new dI(n, r), i, o)),
            e
          );
        }
        _verifyReinsertion(e, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (e = this._reinsertAfter(i, e._prev, o))
              : e.currentIndex != o &&
                ((e.currentIndex = o), this._addToMoves(e, o)),
            e
          );
        }
        _truncate(e) {
          for (; null !== e; ) {
            const n = e._next;
            this._addToRemovals(this._unlink(e)), (e = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(e, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(e);
          const o = e._prevRemoved,
            i = e._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(e, n, r),
            this._addToMoves(e, r),
            e
          );
        }
        _moveAfter(e, n, r) {
          return (
            this._unlink(e),
            this._insertAfter(e, n, r),
            this._addToMoves(e, r),
            e
          );
        }
        _addAfter(e, n, r) {
          return (
            this._insertAfter(e, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = e)
                : (this._additionsTail._nextAdded = e)),
            e
          );
        }
        _insertAfter(e, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (e._next = o),
            (e._prev = n),
            null === o ? (this._itTail = e) : (o._prev = e),
            null === n ? (this._itHead = e) : (n._next = e),
            null === this._linkedRecords && (this._linkedRecords = new Jy()),
            this._linkedRecords.put(e),
            (e.currentIndex = r),
            e
          );
        }
        _remove(e) {
          return this._addToRemovals(this._unlink(e));
        }
        _unlink(e) {
          null !== this._linkedRecords && this._linkedRecords.remove(e);
          const n = e._prev,
            r = e._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            e
          );
        }
        _addToMoves(e, n) {
          return (
            e.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = e)
                  : (this._movesTail._nextMoved = e)),
            e
          );
        }
        _addToRemovals(e) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Jy()),
            this._unlinkedRecords.put(e),
            (e.currentIndex = null),
            (e._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = e),
                (e._prevRemoved = null))
              : ((e._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = e)),
            e
          );
        }
        _addIdentityChange(e, n) {
          return (
            (e.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = e)
                : (this._identityChangesTail._nextIdentityChange = e)),
            e
          );
        }
      }
      class dI {
        constructor(e, n) {
          (this.item = e),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class fI {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(e) {
          null === this._head
            ? ((this._head = this._tail = e),
              (e._nextDup = null),
              (e._prevDup = null))
            : ((this._tail._nextDup = e),
              (e._prevDup = this._tail),
              (e._nextDup = null),
              (this._tail = e));
        }
        get(e, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, e)
            )
              return r;
          return null;
        }
        remove(e) {
          const n = e._prevDup,
            r = e._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class Jy {
        constructor() {
          this.map = new Map();
        }
        put(e) {
          const n = e.trackById;
          let r = this.map.get(n);
          r || ((r = new fI()), this.map.set(n, r)), r.add(e);
        }
        get(e, n) {
          const o = this.map.get(e);
          return o ? o.get(e, n) : null;
        }
        remove(e) {
          const n = e.trackById;
          return this.map.get(n).remove(e) && this.map.delete(n), e;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function Yy(t, e, n) {
        const r = t.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + e + o;
      }
      function ev() {
        return new Ns([new Ky()]);
      }
      let Ns = (() => {
        class t {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new t(n);
          }
          static extend(n) {
            return {
              provide: t,
              useFactory: (r) => t.create(n, r || ev()),
              deps: [[t, new wo(), new Mn()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new $(901, "");
          }
        }
        return (t.??prov = x({ token: t, providedIn: "root", factory: ev })), t;
      })();
      const yI = jy(null, "core", [
        { provide: Ss, useValue: "unknown" },
        { provide: Hy, deps: [ke] },
        { provide: Vy, deps: [] },
        { provide: Ny, deps: [] },
      ]);
      let vI = (() => {
          class t {
            constructor(n) {}
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(lc));
            }),
            (t.??mod = tt({ type: t })),
            (t.??inj = Qe({})),
            t
          );
        })(),
        Os = null;
      function Zt() {
        return Os;
      }
      const lt = new L("DocumentToken");
      let Jn = (() => {
        class t {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??prov = x({
            token: t,
            factory: function () {
              return (function EI() {
                return w(nv);
              })();
            },
            providedIn: "platform",
          })),
          t
        );
      })();
      const wI = new L("Location Initialized");
      let nv = (() => {
        class t extends Jn {
          constructor(n) {
            super(), (this._doc = n), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Zt().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Zt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Zt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(n) {
            this.location.pathname = n;
          }
          pushState(n, r, o) {
            rv() ? this._history.pushState(n, r, o) : (this.location.hash = o);
          }
          replaceState(n, r, o) {
            rv()
              ? this._history.replaceState(n, r, o)
              : (this.location.hash = o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(lt));
          }),
          (t.??prov = x({
            token: t,
            factory: function () {
              return (function bI() {
                return new nv(w(lt));
              })();
            },
            providedIn: "platform",
          })),
          t
        );
      })();
      function rv() {
        return !!window.history.pushState;
      }
      function pc(t, e) {
        if (0 == t.length) return e;
        if (0 == e.length) return t;
        let n = 0;
        return (
          t.endsWith("/") && n++,
          e.startsWith("/") && n++,
          2 == n ? t + e.substring(1) : 1 == n ? t + e : t + "/" + e
        );
      }
      function ov(t) {
        const e = t.match(/#|\?|$/),
          n = (e && e.index) || t.length;
        return t.slice(0, n - ("/" === t[n - 1] ? 1 : 0)) + t.slice(n);
      }
      function pn(t) {
        return t && "?" !== t[0] ? "?" + t : t;
      }
      let Kr = (() => {
        class t {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??prov = x({
            token: t,
            factory: function () {
              return (function MI(t) {
                const e = w(lt).location;
                return new iv(w(Jn), (e && e.origin) || "");
              })();
            },
            providedIn: "root",
          })),
          t
        );
      })();
      const gc = new L("appBaseHref");
      let iv = (() => {
          class t extends Kr {
            constructor(n, r) {
              if (
                (super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                null == r && (r = this._platformLocation.getBaseHrefFromDOM()),
                null == r)
              )
                throw new Error(
                  "No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document."
                );
              this._baseHref = r;
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return pc(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  pn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + pn(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + pn(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformLocation).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(Jn), w(gc, 8));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        AI = (() => {
          class t extends Kr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = pc(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + pn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + pn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformLocation).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(Jn), w(gc, 8));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        mc = (() => {
          class t {
            constructor(n, r) {
              (this._subject = new le()),
                (this._urlChangeListeners = []),
                (this._platformStrategy = n);
              const o = this._platformStrategy.getBaseHref();
              (this._platformLocation = r),
                (this._baseHref = ov(sv(o))),
                this._platformStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            path(n = !1) {
              return this.normalize(this._platformStrategy.path(n));
            }
            getState() {
              return this._platformLocation.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + pn(r));
            }
            normalize(n) {
              return t.stripTrailingSlash(
                (function SI(t, e) {
                  return t && e.startsWith(t) ? e.substring(t.length) : e;
                })(this._baseHref, sv(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._platformStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._platformStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + pn(r)),
                  o
                );
            }
            replaceState(n, r = "", o = null) {
              this._platformStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + pn(r)),
                  o
                );
            }
            forward() {
              this._platformStrategy.forward();
            }
            back() {
              this._platformStrategy.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformStrategy).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
            onUrlChange(n) {
              this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  }));
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
          }
          return (
            (t.normalizeQueryParams = pn),
            (t.joinWithSlash = pc),
            (t.stripTrailingSlash = ov),
            (t.??fac = function (n) {
              return new (n || t)(w(Kr), w(Jn));
            }),
            (t.??prov = x({
              token: t,
              factory: function () {
                return (function TI() {
                  return new mc(w(Kr), w(Jn));
                })();
              },
              providedIn: "root",
            })),
            t
          );
        })();
      function sv(t) {
        return t.replace(/\/index.html$/, "");
      }
      const av = {
        ADP: [void 0, void 0, 0],
        AFN: [void 0, "\u060b", 0],
        ALL: [void 0, void 0, 0],
        AMD: [void 0, "\u058f", 2],
        AOA: [void 0, "Kz"],
        ARS: [void 0, "$"],
        AUD: ["A$", "$"],
        AZN: [void 0, "\u20bc"],
        BAM: [void 0, "KM"],
        BBD: [void 0, "$"],
        BDT: [void 0, "\u09f3"],
        BHD: [void 0, void 0, 3],
        BIF: [void 0, void 0, 0],
        BMD: [void 0, "$"],
        BND: [void 0, "$"],
        BOB: [void 0, "Bs"],
        BRL: ["R$"],
        BSD: [void 0, "$"],
        BWP: [void 0, "P"],
        BYN: [void 0, "\u0440.", 2],
        BYR: [void 0, void 0, 0],
        BZD: [void 0, "$"],
        CAD: ["CA$", "$", 2],
        CHF: [void 0, void 0, 2],
        CLF: [void 0, void 0, 4],
        CLP: [void 0, "$", 0],
        CNY: ["CN\xa5", "\xa5"],
        COP: [void 0, "$", 2],
        CRC: [void 0, "\u20a1", 2],
        CUC: [void 0, "$"],
        CUP: [void 0, "$"],
        CZK: [void 0, "K\u010d", 2],
        DJF: [void 0, void 0, 0],
        DKK: [void 0, "kr", 2],
        DOP: [void 0, "$"],
        EGP: [void 0, "E\xa3"],
        ESP: [void 0, "\u20a7", 0],
        EUR: ["\u20ac"],
        FJD: [void 0, "$"],
        FKP: [void 0, "\xa3"],
        GBP: ["\xa3"],
        GEL: [void 0, "\u20be"],
        GHS: [void 0, "GH\u20b5"],
        GIP: [void 0, "\xa3"],
        GNF: [void 0, "FG", 0],
        GTQ: [void 0, "Q"],
        GYD: [void 0, "$", 2],
        HKD: ["HK$", "$"],
        HNL: [void 0, "L"],
        HRK: [void 0, "kn"],
        HUF: [void 0, "Ft", 2],
        IDR: [void 0, "Rp", 2],
        ILS: ["\u20aa"],
        INR: ["\u20b9"],
        IQD: [void 0, void 0, 0],
        IRR: [void 0, void 0, 0],
        ISK: [void 0, "kr", 0],
        ITL: [void 0, void 0, 0],
        JMD: [void 0, "$"],
        JOD: [void 0, void 0, 3],
        JPY: ["\xa5", void 0, 0],
        KHR: [void 0, "\u17db"],
        KMF: [void 0, "CF", 0],
        KPW: [void 0, "\u20a9", 0],
        KRW: ["\u20a9", void 0, 0],
        KWD: [void 0, void 0, 3],
        KYD: [void 0, "$"],
        KZT: [void 0, "\u20b8"],
        LAK: [void 0, "\u20ad", 0],
        LBP: [void 0, "L\xa3", 0],
        LKR: [void 0, "Rs"],
        LRD: [void 0, "$"],
        LTL: [void 0, "Lt"],
        LUF: [void 0, void 0, 0],
        LVL: [void 0, "Ls"],
        LYD: [void 0, void 0, 3],
        MGA: [void 0, "Ar", 0],
        MGF: [void 0, void 0, 0],
        MMK: [void 0, "K", 0],
        MNT: [void 0, "\u20ae", 2],
        MRO: [void 0, void 0, 0],
        MUR: [void 0, "Rs", 2],
        MXN: ["MX$", "$"],
        MYR: [void 0, "RM"],
        NAD: [void 0, "$"],
        NGN: [void 0, "\u20a6"],
        NIO: [void 0, "C$"],
        NOK: [void 0, "kr", 2],
        NPR: [void 0, "Rs"],
        NZD: ["NZ$", "$"],
        OMR: [void 0, void 0, 3],
        PHP: ["\u20b1"],
        PKR: [void 0, "Rs", 2],
        PLN: [void 0, "z\u0142"],
        PYG: [void 0, "\u20b2", 0],
        RON: [void 0, "lei"],
        RSD: [void 0, void 0, 0],
        RUB: [void 0, "\u20bd"],
        RUR: [void 0, "\u0440."],
        RWF: [void 0, "RF", 0],
        SBD: [void 0, "$"],
        SEK: [void 0, "kr", 2],
        SGD: [void 0, "$"],
        SHP: [void 0, "\xa3"],
        SLL: [void 0, void 0, 0],
        SOS: [void 0, void 0, 0],
        SRD: [void 0, "$"],
        SSP: [void 0, "\xa3"],
        STD: [void 0, void 0, 0],
        STN: [void 0, "Db"],
        SYP: [void 0, "\xa3", 0],
        THB: [void 0, "\u0e3f"],
        TMM: [void 0, void 0, 0],
        TND: [void 0, void 0, 3],
        TOP: [void 0, "T$"],
        TRL: [void 0, void 0, 0],
        TRY: [void 0, "\u20ba"],
        TTD: [void 0, "$"],
        TWD: ["NT$", "$", 2],
        TZS: [void 0, void 0, 2],
        UAH: [void 0, "\u20b4"],
        UGX: [void 0, void 0, 0],
        USD: ["$"],
        UYI: [void 0, void 0, 0],
        UYU: [void 0, "$"],
        UYW: [void 0, void 0, 4],
        UZS: [void 0, void 0, 2],
        VEF: [void 0, "Bs", 2],
        VND: ["\u20ab", void 0, 0],
        VUV: [void 0, void 0, 0],
        XAF: ["FCFA", void 0, 0],
        XCD: ["EC$", "$"],
        XOF: ["F\u202fCFA", void 0, 0],
        XPF: ["CFPF", void 0, 0],
        XXX: ["\xa4"],
        YER: [void 0, void 0, 0],
        ZAR: [void 0, "R"],
        ZMK: [void 0, void 0, 0],
        ZMW: [void 0, "ZK"],
        ZWD: [void 0, void 0, 0],
      };
      var Je = (() => (
          ((Je = Je || {})[(Je.Decimal = 0)] = "Decimal"),
          (Je[(Je.Percent = 1)] = "Percent"),
          (Je[(Je.Currency = 2)] = "Currency"),
          (Je[(Je.Scientific = 3)] = "Scientific"),
          Je
        ))(),
        ge = (() => (
          ((ge = ge || {})[(ge.Format = 0)] = "Format"),
          (ge[(ge.Standalone = 1)] = "Standalone"),
          ge
        ))(),
        U = (() => (
          ((U = U || {})[(U.Narrow = 0)] = "Narrow"),
          (U[(U.Abbreviated = 1)] = "Abbreviated"),
          (U[(U.Wide = 2)] = "Wide"),
          (U[(U.Short = 3)] = "Short"),
          U
        ))(),
        ue = (() => (
          ((ue = ue || {})[(ue.Short = 0)] = "Short"),
          (ue[(ue.Medium = 1)] = "Medium"),
          (ue[(ue.Long = 2)] = "Long"),
          (ue[(ue.Full = 3)] = "Full"),
          ue
        ))(),
        M = (() => (
          ((M = M || {})[(M.Decimal = 0)] = "Decimal"),
          (M[(M.Group = 1)] = "Group"),
          (M[(M.List = 2)] = "List"),
          (M[(M.PercentSign = 3)] = "PercentSign"),
          (M[(M.PlusSign = 4)] = "PlusSign"),
          (M[(M.MinusSign = 5)] = "MinusSign"),
          (M[(M.Exponential = 6)] = "Exponential"),
          (M[(M.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
          (M[(M.PerMille = 8)] = "PerMille"),
          (M[(M.Infinity = 9)] = "Infinity"),
          (M[(M.NaN = 10)] = "NaN"),
          (M[(M.TimeSeparator = 11)] = "TimeSeparator"),
          (M[(M.CurrencyDecimal = 12)] = "CurrencyDecimal"),
          (M[(M.CurrencyGroup = 13)] = "CurrencyGroup"),
          M
        ))();
      function Fs(t, e) {
        return Dt(qe(t)[E.DateFormat], e);
      }
      function Ps(t, e) {
        return Dt(qe(t)[E.TimeFormat], e);
      }
      function ks(t, e) {
        return Dt(qe(t)[E.DateTimeFormat], e);
      }
      function _t(t, e) {
        const n = qe(t),
          r = n[E.NumberSymbols][e];
        if (void 0 === r) {
          if (e === M.CurrencyDecimal) return n[E.NumberSymbols][M.Decimal];
          if (e === M.CurrencyGroup) return n[E.NumberSymbols][M.Group];
        }
        return r;
      }
      function lv(t) {
        if (!t[E.ExtraData])
          throw new Error(
            `Missing extra locale data for the locale "${
              t[E.LocaleId]
            }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
          );
      }
      function Dt(t, e) {
        for (let n = e; n > -1; n--) if (void 0 !== t[n]) return t[n];
        throw new Error("Locale data API: locale data undefined");
      }
      function vc(t) {
        const [e, n] = t.split(":");
        return { hours: +e, minutes: +n };
      }
      const UI =
          /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
        Yo = {},
        HI =
          /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
      var Me = (() => (
          ((Me = Me || {})[(Me.Short = 0)] = "Short"),
          (Me[(Me.ShortGMT = 1)] = "ShortGMT"),
          (Me[(Me.Long = 2)] = "Long"),
          (Me[(Me.Extended = 3)] = "Extended"),
          Me
        ))(),
        A = (() => (
          ((A = A || {})[(A.FullYear = 0)] = "FullYear"),
          (A[(A.Month = 1)] = "Month"),
          (A[(A.Date = 2)] = "Date"),
          (A[(A.Hours = 3)] = "Hours"),
          (A[(A.Minutes = 4)] = "Minutes"),
          (A[(A.Seconds = 5)] = "Seconds"),
          (A[(A.FractionalSeconds = 6)] = "FractionalSeconds"),
          (A[(A.Day = 7)] = "Day"),
          A
        ))(),
        V = (() => (
          ((V = V || {})[(V.DayPeriods = 0)] = "DayPeriods"),
          (V[(V.Days = 1)] = "Days"),
          (V[(V.Months = 2)] = "Months"),
          (V[(V.Eras = 3)] = "Eras"),
          V
        ))();
      function $I(t, e, n, r) {
        let o = (function YI(t) {
          if (dv(t)) return t;
          if ("number" == typeof t && !isNaN(t)) return new Date(t);
          if ("string" == typeof t) {
            if (((t = t.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(t))) {
              const [o, i = 1, s = 1] = t.split("-").map((a) => +a);
              return Vs(o, i - 1, s);
            }
            const n = parseFloat(t);
            if (!isNaN(t - n)) return new Date(n);
            let r;
            if ((r = t.match(UI)))
              return (function XI(t) {
                const e = new Date(0);
                let n = 0,
                  r = 0;
                const o = t[8] ? e.setUTCFullYear : e.setFullYear,
                  i = t[8] ? e.setUTCHours : e.setHours;
                t[9] &&
                  ((n = Number(t[9] + t[10])), (r = Number(t[9] + t[11]))),
                  o.call(e, Number(t[1]), Number(t[2]) - 1, Number(t[3]));
                const s = Number(t[4] || 0) - n,
                  a = Number(t[5] || 0) - r,
                  l = Number(t[6] || 0),
                  u = Math.floor(1e3 * parseFloat("0." + (t[7] || 0)));
                return i.call(e, s, a, l, u), e;
              })(r);
          }
          const e = new Date(t);
          if (!dv(e)) throw new Error(`Unable to convert "${t}" into a date`);
          return e;
        })(t);
        e = gn(n, e) || e;
        let a,
          s = [];
        for (; e; ) {
          if (((a = HI.exec(e)), !a)) {
            s.push(e);
            break;
          }
          {
            s = s.concat(a.slice(1));
            const c = s.pop();
            if (!c) break;
            e = c;
          }
        }
        let l = o.getTimezoneOffset();
        r &&
          ((l = cv(r, l)),
          (o = (function JI(t, e, n) {
            const r = n ? -1 : 1,
              o = t.getTimezoneOffset();
            return (function KI(t, e) {
              return (
                (t = new Date(t.getTime())).setMinutes(t.getMinutes() + e), t
              );
            })(t, r * (cv(e, o) - o));
          })(o, r, !0)));
        let u = "";
        return (
          s.forEach((c) => {
            const d = (function ZI(t) {
              if (Dc[t]) return Dc[t];
              let e;
              switch (t) {
                case "G":
                case "GG":
                case "GGG":
                  e = te(V.Eras, U.Abbreviated);
                  break;
                case "GGGG":
                  e = te(V.Eras, U.Wide);
                  break;
                case "GGGGG":
                  e = te(V.Eras, U.Narrow);
                  break;
                case "y":
                  e = _e(A.FullYear, 1, 0, !1, !0);
                  break;
                case "yy":
                  e = _e(A.FullYear, 2, 0, !0, !0);
                  break;
                case "yyy":
                  e = _e(A.FullYear, 3, 0, !1, !0);
                  break;
                case "yyyy":
                  e = _e(A.FullYear, 4, 0, !1, !0);
                  break;
                case "Y":
                  e = Us(1);
                  break;
                case "YY":
                  e = Us(2, !0);
                  break;
                case "YYY":
                  e = Us(3);
                  break;
                case "YYYY":
                  e = Us(4);
                  break;
                case "M":
                case "L":
                  e = _e(A.Month, 1, 1);
                  break;
                case "MM":
                case "LL":
                  e = _e(A.Month, 2, 1);
                  break;
                case "MMM":
                  e = te(V.Months, U.Abbreviated);
                  break;
                case "MMMM":
                  e = te(V.Months, U.Wide);
                  break;
                case "MMMMM":
                  e = te(V.Months, U.Narrow);
                  break;
                case "LLL":
                  e = te(V.Months, U.Abbreviated, ge.Standalone);
                  break;
                case "LLLL":
                  e = te(V.Months, U.Wide, ge.Standalone);
                  break;
                case "LLLLL":
                  e = te(V.Months, U.Narrow, ge.Standalone);
                  break;
                case "w":
                  e = _c(1);
                  break;
                case "ww":
                  e = _c(2);
                  break;
                case "W":
                  e = _c(1, !0);
                  break;
                case "d":
                  e = _e(A.Date, 1);
                  break;
                case "dd":
                  e = _e(A.Date, 2);
                  break;
                case "c":
                case "cc":
                  e = _e(A.Day, 1);
                  break;
                case "ccc":
                  e = te(V.Days, U.Abbreviated, ge.Standalone);
                  break;
                case "cccc":
                  e = te(V.Days, U.Wide, ge.Standalone);
                  break;
                case "ccccc":
                  e = te(V.Days, U.Narrow, ge.Standalone);
                  break;
                case "cccccc":
                  e = te(V.Days, U.Short, ge.Standalone);
                  break;
                case "E":
                case "EE":
                case "EEE":
                  e = te(V.Days, U.Abbreviated);
                  break;
                case "EEEE":
                  e = te(V.Days, U.Wide);
                  break;
                case "EEEEE":
                  e = te(V.Days, U.Narrow);
                  break;
                case "EEEEEE":
                  e = te(V.Days, U.Short);
                  break;
                case "a":
                case "aa":
                case "aaa":
                  e = te(V.DayPeriods, U.Abbreviated);
                  break;
                case "aaaa":
                  e = te(V.DayPeriods, U.Wide);
                  break;
                case "aaaaa":
                  e = te(V.DayPeriods, U.Narrow);
                  break;
                case "b":
                case "bb":
                case "bbb":
                  e = te(V.DayPeriods, U.Abbreviated, ge.Standalone, !0);
                  break;
                case "bbbb":
                  e = te(V.DayPeriods, U.Wide, ge.Standalone, !0);
                  break;
                case "bbbbb":
                  e = te(V.DayPeriods, U.Narrow, ge.Standalone, !0);
                  break;
                case "B":
                case "BB":
                case "BBB":
                  e = te(V.DayPeriods, U.Abbreviated, ge.Format, !0);
                  break;
                case "BBBB":
                  e = te(V.DayPeriods, U.Wide, ge.Format, !0);
                  break;
                case "BBBBB":
                  e = te(V.DayPeriods, U.Narrow, ge.Format, !0);
                  break;
                case "h":
                  e = _e(A.Hours, 1, -12);
                  break;
                case "hh":
                  e = _e(A.Hours, 2, -12);
                  break;
                case "H":
                  e = _e(A.Hours, 1);
                  break;
                case "HH":
                  e = _e(A.Hours, 2);
                  break;
                case "m":
                  e = _e(A.Minutes, 1);
                  break;
                case "mm":
                  e = _e(A.Minutes, 2);
                  break;
                case "s":
                  e = _e(A.Seconds, 1);
                  break;
                case "ss":
                  e = _e(A.Seconds, 2);
                  break;
                case "S":
                  e = _e(A.FractionalSeconds, 1);
                  break;
                case "SS":
                  e = _e(A.FractionalSeconds, 2);
                  break;
                case "SSS":
                  e = _e(A.FractionalSeconds, 3);
                  break;
                case "Z":
                case "ZZ":
                case "ZZZ":
                  e = Bs(Me.Short);
                  break;
                case "ZZZZZ":
                  e = Bs(Me.Extended);
                  break;
                case "O":
                case "OO":
                case "OOO":
                case "z":
                case "zz":
                case "zzz":
                  e = Bs(Me.ShortGMT);
                  break;
                case "OOOO":
                case "ZZZZ":
                case "zzzz":
                  e = Bs(Me.Long);
                  break;
                default:
                  return null;
              }
              return (Dc[t] = e), e;
            })(c);
            u += d
              ? d(o, n, l)
              : "''" === c
              ? "'"
              : c.replace(/(^'|'$)/g, "").replace(/''/g, "'");
          }),
          u
        );
      }
      function Vs(t, e, n) {
        const r = new Date(0);
        return r.setFullYear(t, e, n), r.setHours(0, 0, 0), r;
      }
      function gn(t, e) {
        const n = (function II(t) {
          return qe(t)[E.LocaleId];
        })(t);
        if (((Yo[n] = Yo[n] || {}), Yo[n][e])) return Yo[n][e];
        let r = "";
        switch (e) {
          case "shortDate":
            r = Fs(t, ue.Short);
            break;
          case "mediumDate":
            r = Fs(t, ue.Medium);
            break;
          case "longDate":
            r = Fs(t, ue.Long);
            break;
          case "fullDate":
            r = Fs(t, ue.Full);
            break;
          case "shortTime":
            r = Ps(t, ue.Short);
            break;
          case "mediumTime":
            r = Ps(t, ue.Medium);
            break;
          case "longTime":
            r = Ps(t, ue.Long);
            break;
          case "fullTime":
            r = Ps(t, ue.Full);
            break;
          case "short":
            const o = gn(t, "shortTime"),
              i = gn(t, "shortDate");
            r = Ls(ks(t, ue.Short), [o, i]);
            break;
          case "medium":
            const s = gn(t, "mediumTime"),
              a = gn(t, "mediumDate");
            r = Ls(ks(t, ue.Medium), [s, a]);
            break;
          case "long":
            const l = gn(t, "longTime"),
              u = gn(t, "longDate");
            r = Ls(ks(t, ue.Long), [l, u]);
            break;
          case "full":
            const c = gn(t, "fullTime"),
              d = gn(t, "fullDate");
            r = Ls(ks(t, ue.Full), [c, d]);
        }
        return r && (Yo[n][e] = r), r;
      }
      function Ls(t, e) {
        return (
          e &&
            (t = t.replace(/\{([^}]+)}/g, function (n, r) {
              return null != e && r in e ? e[r] : n;
            })),
          t
        );
      }
      function Pt(t, e, n = "-", r, o) {
        let i = "";
        (t < 0 || (o && t <= 0)) && (o ? (t = 1 - t) : ((t = -t), (i = n)));
        let s = String(t);
        for (; s.length < e; ) s = "0" + s;
        return r && (s = s.substr(s.length - e)), i + s;
      }
      function _e(t, e, n = 0, r = !1, o = !1) {
        return function (i, s) {
          let a = (function qI(t, e) {
            switch (t) {
              case A.FullYear:
                return e.getFullYear();
              case A.Month:
                return e.getMonth();
              case A.Date:
                return e.getDate();
              case A.Hours:
                return e.getHours();
              case A.Minutes:
                return e.getMinutes();
              case A.Seconds:
                return e.getSeconds();
              case A.FractionalSeconds:
                return e.getMilliseconds();
              case A.Day:
                return e.getDay();
              default:
                throw new Error(`Unknown DateType value "${t}".`);
            }
          })(t, i);
          if (((n > 0 || a > -n) && (a += n), t === A.Hours))
            0 === a && -12 === n && (a = 12);
          else if (t === A.FractionalSeconds)
            return (function GI(t, e) {
              return Pt(t, 3).substr(0, e);
            })(a, e);
          const l = _t(s, M.MinusSign);
          return Pt(a, e, l, r, o);
        };
      }
      function te(t, e, n = ge.Format, r = !1) {
        return function (o, i) {
          return (function zI(t, e, n, r, o, i) {
            switch (n) {
              case V.Months:
                return (function NI(t, e, n) {
                  const r = qe(t),
                    i = Dt([r[E.MonthsFormat], r[E.MonthsStandalone]], e);
                  return Dt(i, n);
                })(e, o, r)[t.getMonth()];
              case V.Days:
                return (function xI(t, e, n) {
                  const r = qe(t),
                    i = Dt([r[E.DaysFormat], r[E.DaysStandalone]], e);
                  return Dt(i, n);
                })(e, o, r)[t.getDay()];
              case V.DayPeriods:
                const s = t.getHours(),
                  a = t.getMinutes();
                if (i) {
                  const u = (function kI(t) {
                      const e = qe(t);
                      return (
                        lv(e),
                        (e[E.ExtraData][2] || []).map((r) =>
                          "string" == typeof r ? vc(r) : [vc(r[0]), vc(r[1])]
                        )
                      );
                    })(e),
                    c = (function VI(t, e, n) {
                      const r = qe(t);
                      lv(r);
                      const i =
                        Dt([r[E.ExtraData][0], r[E.ExtraData][1]], e) || [];
                      return Dt(i, n) || [];
                    })(e, o, r),
                    d = u.findIndex((f) => {
                      if (Array.isArray(f)) {
                        const [h, p] = f,
                          m = s >= h.hours && a >= h.minutes,
                          D = s < p.hours || (s === p.hours && a < p.minutes);
                        if (h.hours < p.hours) {
                          if (m && D) return !0;
                        } else if (m || D) return !0;
                      } else if (f.hours === s && f.minutes === a) return !0;
                      return !1;
                    });
                  if (-1 !== d) return c[d];
                }
                return (function RI(t, e, n) {
                  const r = qe(t),
                    i = Dt(
                      [r[E.DayPeriodsFormat], r[E.DayPeriodsStandalone]],
                      e
                    );
                  return Dt(i, n);
                })(e, o, r)[s < 12 ? 0 : 1];
              case V.Eras:
                return (function OI(t, e) {
                  return Dt(qe(t)[E.Eras], e);
                })(e, r)[t.getFullYear() <= 0 ? 0 : 1];
              default:
                throw new Error(`unexpected translation type ${n}`);
            }
          })(o, i, t, e, n, r);
        };
      }
      function Bs(t) {
        return function (e, n, r) {
          const o = -1 * r,
            i = _t(n, M.MinusSign),
            s = o > 0 ? Math.floor(o / 60) : Math.ceil(o / 60);
          switch (t) {
            case Me.Short:
              return (
                (o >= 0 ? "+" : "") + Pt(s, 2, i) + Pt(Math.abs(o % 60), 2, i)
              );
            case Me.ShortGMT:
              return "GMT" + (o >= 0 ? "+" : "") + Pt(s, 1, i);
            case Me.Long:
              return (
                "GMT" +
                (o >= 0 ? "+" : "") +
                Pt(s, 2, i) +
                ":" +
                Pt(Math.abs(o % 60), 2, i)
              );
            case Me.Extended:
              return 0 === r
                ? "Z"
                : (o >= 0 ? "+" : "") +
                    Pt(s, 2, i) +
                    ":" +
                    Pt(Math.abs(o % 60), 2, i);
            default:
              throw new Error(`Unknown zone width "${t}"`);
          }
        };
      }
      function uv(t) {
        return Vs(
          t.getFullYear(),
          t.getMonth(),
          t.getDate() + (4 - t.getDay())
        );
      }
      function _c(t, e = !1) {
        return function (n, r) {
          let o;
          if (e) {
            const i = new Date(n.getFullYear(), n.getMonth(), 1).getDay() - 1,
              s = n.getDate();
            o = 1 + Math.floor((s + i) / 7);
          } else {
            const i = uv(n),
              s = (function QI(t) {
                const e = Vs(t, 0, 1).getDay();
                return Vs(t, 0, 1 + (e <= 4 ? 4 : 11) - e);
              })(i.getFullYear()),
              a = i.getTime() - s.getTime();
            o = 1 + Math.round(a / 6048e5);
          }
          return Pt(o, t, _t(r, M.MinusSign));
        };
      }
      function Us(t, e = !1) {
        return function (n, r) {
          return Pt(uv(n).getFullYear(), t, _t(r, M.MinusSign), e);
        };
      }
      const Dc = {};
      function cv(t, e) {
        t = t.replace(/:/g, "");
        const n = Date.parse("Jan 01, 1970 00:00:00 " + t) / 6e4;
        return isNaN(n) ? e : n;
      }
      function dv(t) {
        return t instanceof Date && !isNaN(t.valueOf());
      }
      const eR = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
      function oR(t, e, n, r, o) {
        const s = (function wc(t, e = "-") {
          const n = {
              minInt: 1,
              minFrac: 0,
              maxFrac: 0,
              posPre: "",
              posSuf: "",
              negPre: "",
              negSuf: "",
              gSize: 0,
              lgSize: 0,
            },
            r = t.split(";"),
            o = r[0],
            i = r[1],
            s =
              -1 !== o.indexOf(".")
                ? o.split(".")
                : [
                    o.substring(0, o.lastIndexOf("0") + 1),
                    o.substring(o.lastIndexOf("0") + 1),
                  ],
            a = s[0],
            l = s[1] || "";
          n.posPre = a.substr(0, a.indexOf("#"));
          for (let c = 0; c < l.length; c++) {
            const d = l.charAt(c);
            "0" === d
              ? (n.minFrac = n.maxFrac = c + 1)
              : "#" === d
              ? (n.maxFrac = c + 1)
              : (n.posSuf += d);
          }
          const u = a.split(",");
          if (
            ((n.gSize = u[1] ? u[1].length : 0),
            (n.lgSize = u[2] || u[1] ? (u[2] || u[1]).length : 0),
            i)
          ) {
            const c = o.length - n.posPre.length - n.posSuf.length,
              d = i.indexOf("#");
            (n.negPre = i.substr(0, d).replace(/'/g, "")),
              (n.negSuf = i.substr(d + c).replace(/'/g, ""));
          } else (n.negPre = e + n.posPre), (n.negSuf = n.posSuf);
          return n;
        })(
          (function yc(t, e) {
            return qe(t)[E.NumberFormats][e];
          })(e, Je.Currency),
          _t(e, M.MinusSign)
        );
        return (
          (s.minFrac = (function jI(t) {
            let e;
            const n = av[t];
            return n && (e = n[2]), "number" == typeof e ? e : 2;
          })(r)),
          (s.maxFrac = s.minFrac),
          (function Ec(t, e, n, r, o, i, s = !1) {
            let a = "",
              l = !1;
            if (isFinite(t)) {
              let u = (function lR(t) {
                let r,
                  o,
                  i,
                  s,
                  a,
                  e = Math.abs(t) + "",
                  n = 0;
                for (
                  (o = e.indexOf(".")) > -1 && (e = e.replace(".", "")),
                    (i = e.search(/e/i)) > 0
                      ? (o < 0 && (o = i),
                        (o += +e.slice(i + 1)),
                        (e = e.substring(0, i)))
                      : o < 0 && (o = e.length),
                    i = 0;
                  "0" === e.charAt(i);
                  i++
                );
                if (i === (a = e.length)) (r = [0]), (o = 1);
                else {
                  for (a--; "0" === e.charAt(a); ) a--;
                  for (o -= i, r = [], s = 0; i <= a; i++, s++)
                    r[s] = Number(e.charAt(i));
                }
                return (
                  o > 22 && ((r = r.splice(0, 21)), (n = o - 1), (o = 1)),
                  { digits: r, exponent: n, integerLen: o }
                );
              })(t);
              s &&
                (u = (function aR(t) {
                  if (0 === t.digits[0]) return t;
                  const e = t.digits.length - t.integerLen;
                  return (
                    t.exponent
                      ? (t.exponent += 2)
                      : (0 === e
                          ? t.digits.push(0, 0)
                          : 1 === e && t.digits.push(0),
                        (t.integerLen += 2)),
                    t
                  );
                })(u));
              let c = e.minInt,
                d = e.minFrac,
                f = e.maxFrac;
              if (i) {
                const g = i.match(eR);
                if (null === g)
                  throw new Error(`${i} is not a valid digit info`);
                const b = g[1],
                  F = g[3],
                  q = g[5];
                null != b && (c = bc(b)),
                  null != F && (d = bc(F)),
                  null != q ? (f = bc(q)) : null != F && d > f && (f = d);
              }
              !(function uR(t, e, n) {
                if (e > n)
                  throw new Error(
                    `The minimum number of digits after fraction (${e}) is higher than the maximum (${n}).`
                  );
                let r = t.digits,
                  o = r.length - t.integerLen;
                const i = Math.min(Math.max(e, o), n);
                let s = i + t.integerLen,
                  a = r[s];
                if (s > 0) {
                  r.splice(Math.max(t.integerLen, s));
                  for (let d = s; d < r.length; d++) r[d] = 0;
                } else {
                  (o = Math.max(0, o)),
                    (t.integerLen = 1),
                    (r.length = Math.max(1, (s = i + 1))),
                    (r[0] = 0);
                  for (let d = 1; d < s; d++) r[d] = 0;
                }
                if (a >= 5)
                  if (s - 1 < 0) {
                    for (let d = 0; d > s; d--) r.unshift(0), t.integerLen++;
                    r.unshift(1), t.integerLen++;
                  } else r[s - 1]++;
                for (; o < Math.max(0, i); o++) r.push(0);
                let l = 0 !== i;
                const u = e + t.integerLen,
                  c = r.reduceRight(function (d, f, h, p) {
                    return (
                      (p[h] = (f += d) < 10 ? f : f - 10),
                      l && (0 === p[h] && h >= u ? p.pop() : (l = !1)),
                      f >= 10 ? 1 : 0
                    );
                  }, 0);
                c && (r.unshift(c), t.integerLen++);
              })(u, d, f);
              let h = u.digits,
                p = u.integerLen;
              const m = u.exponent;
              let D = [];
              for (l = h.every((g) => !g); p < c; p++) h.unshift(0);
              for (; p < 0; p++) h.unshift(0);
              p > 0 ? (D = h.splice(p, h.length)) : ((D = h), (h = [0]));
              const v = [];
              for (
                h.length >= e.lgSize &&
                v.unshift(h.splice(-e.lgSize, h.length).join(""));
                h.length > e.gSize;

              )
                v.unshift(h.splice(-e.gSize, h.length).join(""));
              h.length && v.unshift(h.join("")),
                (a = v.join(_t(n, r))),
                D.length && (a += _t(n, o) + D.join("")),
                m && (a += _t(n, M.Exponential) + "+" + m);
            } else a = _t(n, M.Infinity);
            return (
              (a =
                t < 0 && !l
                  ? e.negPre + a + e.negSuf
                  : e.posPre + a + e.posSuf),
              a
            );
          })(t, s, e, M.CurrencyGroup, M.CurrencyDecimal, o)
            .replace("\xa4", n)
            .replace("\xa4", "")
            .trim()
        );
      }
      function bc(t) {
        const e = parseInt(t);
        if (isNaN(e))
          throw new Error("Invalid integer literal when parsing " + t);
        return e;
      }
      function gv(t, e) {
        e = encodeURIComponent(e);
        for (const n of t.split(";")) {
          const r = n.indexOf("="),
            [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (o.trim() === e) return decodeURIComponent(i);
        }
        return null;
      }
      class pR {
        constructor(e, n, r, o) {
          (this.$implicit = e),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let mv = (() => {
        class t {
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new pR(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), yv(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              yv(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(_(Ot), _(fn), _(Ns));
          }),
          (t.??dir = T({
            type: t,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
          })),
          t
        );
      })();
      function yv(t, e) {
        t.context.$implicit = e.item;
      }
      let vv = (() => {
        class t {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new gR()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            _v("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            _v("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(_(Ot), _(fn));
          }),
          (t.??dir = T({
            type: t,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
          })),
          t
        );
      })();
      class gR {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function _v(t, e) {
        if (e && !e.createEmbeddedView)
          throw new Error(
            `${t} must be a TemplateRef, but received '${W(e)}'.`
          );
      }
      function kt(t, e) {
        return new $(2100, "");
      }
      const RR = new L("DATE_PIPE_DEFAULT_TIMEZONE");
      let Cv = (() => {
          class t {
            constructor(n, r) {
              (this.locale = n), (this.defaultTimezone = r);
            }
            transform(n, r = "mediumDate", o, i) {
              var s;
              if (null == n || "" === n || n != n) return null;
              try {
                return $I(
                  n,
                  r,
                  i || this.locale,
                  null !== (s = null != o ? o : this.defaultTimezone) &&
                    void 0 !== s
                    ? s
                    : void 0
                );
              } catch (a) {
                throw kt();
              }
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(hn, 16), _(RR, 24));
            }),
            (t.??pipe = Ze({ name: "date", type: t, pure: !0 })),
            t
          );
        })(),
        wv = (() => {
          class t {
            constructor(n, r = "USD") {
              (this._locale = n), (this._defaultCurrencyCode = r);
            }
            transform(n, r = this._defaultCurrencyCode, o = "symbol", i, s) {
              if (
                !(function Sc(t) {
                  return !(null == t || "" === t || t != t);
                })(n)
              )
                return null;
              (s = s || this._locale),
                "boolean" == typeof o && (o = o ? "symbol" : "code");
              let a = r || this._defaultCurrencyCode;
              "code" !== o &&
                (a =
                  "symbol" === o || "symbol-narrow" === o
                    ? (function LI(t, e, n = "en") {
                        const r =
                            (function FI(t) {
                              return qe(t)[E.Currencies];
                            })(n)[t] ||
                            av[t] ||
                            [],
                          o = r[1];
                        return "narrow" === e && "string" == typeof o
                          ? o
                          : r[0] || t;
                      })(a, "symbol" === o ? "wide" : "narrow", s)
                    : o);
              try {
                return oR(
                  (function Ic(t) {
                    if (
                      "string" == typeof t &&
                      !isNaN(Number(t) - parseFloat(t))
                    )
                      return Number(t);
                    if ("number" != typeof t)
                      throw new Error(`${t} is not a number`);
                    return t;
                  })(n),
                  s,
                  a,
                  r,
                  i
                );
              } catch (l) {
                throw kt();
              }
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(hn, 16), _(Oy, 16));
            }),
            (t.??pipe = Ze({ name: "currency", type: t, pure: !0 })),
            t
          );
        })();
      let jR = (() => {
        class t {}
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??mod = tt({ type: t })),
          (t.??inj = Qe({})),
          t
        );
      })();
      let GR = (() => {
        class t {}
        return (
          (t.??prov = x({
            token: t,
            providedIn: "root",
            factory: () => new qR(w(lt), window),
          })),
          t
        );
      })();
      class qR {
        constructor(e, n) {
          (this.document = e), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(e) {
          this.offset = Array.isArray(e) ? () => e : e;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(e) {
          this.supportsScrolling() && this.window.scrollTo(e[0], e[1]);
        }
        scrollToAnchor(e) {
          if (!this.supportsScrolling()) return;
          const n = (function zR(t, e) {
            const n = t.getElementById(e) || t.getElementsByName(e)[0];
            if (n) return n;
            if (
              "function" == typeof t.createTreeWalker &&
              t.body &&
              (t.body.createShadowRoot || t.body.attachShadow)
            ) {
              const r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(e) || i.querySelector(`[name="${e}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, e);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(e) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = e);
          }
        }
        scrollToElement(e) {
          const n = e.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const e =
              Mv(this.window.history) ||
              Mv(Object.getPrototypeOf(this.window.history));
            return !(!e || (!e.writable && !e.set));
          } catch (e) {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch (e) {
            return !1;
          }
        }
      }
      function Mv(t) {
        return Object.getOwnPropertyDescriptor(t, "scrollRestoration");
      }
      class $s {}
      class Rc extends class WR extends class CI {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function DI(t) {
            Os || (Os = t);
          })(new Rc());
        }
        onAndCancel(e, n, r) {
          return (
            e.addEventListener(n, r, !1),
            () => {
              e.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(e, n) {
          e.dispatchEvent(n);
        }
        remove(e) {
          e.parentNode && e.parentNode.removeChild(e);
        }
        createElement(e, n) {
          return (n = n || this.getDefaultDocument()).createElement(e);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(e) {
          return e.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(e) {
          return e instanceof DocumentFragment;
        }
        getGlobalEventTarget(e, n) {
          return "window" === n
            ? window
            : "document" === n
            ? e
            : "body" === n
            ? e.body
            : null;
        }
        getBaseHref(e) {
          const n = (function QR() {
            return (
              (ei = ei || document.querySelector("base")),
              ei ? ei.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function ZR(t) {
                (Gs = Gs || document.createElement("a")),
                  Gs.setAttribute("href", t);
                const e = Gs.pathname;
                return "/" === e.charAt(0) ? e : `/${e}`;
              })(n);
        }
        resetBaseElement() {
          ei = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(e) {
          return gv(document.cookie, e);
        }
      }
      let Gs,
        ei = null;
      const Av = new L("TRANSITION_ID"),
        JR = [
          {
            provide: ec,
            useFactory: function KR(t, e, n) {
              return () => {
                n.get(tc).donePromise.then(() => {
                  const r = Zt(),
                    o = e.querySelectorAll(`style[ng-transition="${t}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [Av, lt, ke],
            multi: !0,
          },
        ];
      class xc {
        static init() {
          !(function QS(t) {
            ac = t;
          })(new xc());
        }
        addToWindow(e) {
          (Z.getAngularTestability = (r, o = !0) => {
            const i = e.findTestabilityInTree(r, o);
            if (null == i)
              throw new Error("Could not find testability for element.");
            return i;
          }),
            (Z.getAllAngularTestabilities = () => e.getAllTestabilities()),
            (Z.getAllAngularRootElements = () => e.getAllRootElements()),
            Z.frameworkStabilizers || (Z.frameworkStabilizers = []),
            Z.frameworkStabilizers.push((r) => {
              const o = Z.getAllAngularTestabilities();
              let i = o.length,
                s = !1;
              const a = function (l) {
                (s = s || l), i--, 0 == i && r(s);
              };
              o.forEach(function (l) {
                l.whenStable(a);
              });
            });
        }
        findTestabilityInTree(e, n, r) {
          if (null == n) return null;
          const o = e.getTestability(n);
          return null != o
            ? o
            : r
            ? Zt().isShadowRoot(n)
              ? this.findTestabilityInTree(e, n.host, !0)
              : this.findTestabilityInTree(e, n.parentElement, !0)
            : null;
        }
      }
      let YR = (() => {
        class t {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      const qs = new L("EventManagerPlugins");
      let zs = (() => {
        class t {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => (o.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(qs), w(Re));
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      class Tv {
        constructor(e) {
          this._doc = e;
        }
        addGlobalEventListener(e, n, r) {
          const o = Zt().getGlobalEventTarget(this._doc, e);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let Sv = (() => {
          class t {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((o) => {
                this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        ti = (() => {
          class t extends Sv {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, o) {
              n.forEach((i) => {
                const s = this._doc.createElement("style");
                (s.textContent = i), o.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(Iv), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, o) => {
                this._addStylesToHost(n, o, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(Iv));
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(lt));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })();
      function Iv(t) {
        Zt().remove(t);
      }
      const Nc = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Oc = /%COMP%/g;
      function Ws(t, e, n) {
        for (let r = 0; r < e.length; r++) {
          let o = e[r];
          Array.isArray(o) ? Ws(t, o, n) : ((o = o.replace(Oc, t)), n.push(o));
        }
        return n;
      }
      function Nv(t) {
        return (e) => {
          if ("__ngUnwrap__" === e) return t;
          !1 === t(e) && (e.preventDefault(), (e.returnValue = !1));
        };
      }
      let Fc = (() => {
        class t {
          constructor(n, r, o) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Pc(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case Lt.Emulated: {
                let o = this.rendererByCompId.get(r.id);
                return (
                  o ||
                    ((o = new ox(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, o)),
                  o.applyToHost(n),
                  o
                );
              }
              case 1:
              case Lt.ShadowDom:
                return new ix(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const o = Ws(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(o),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(zs), w(ti), w(Ko));
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      class Pc {
        constructor(e) {
          (this.eventManager = e),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(e, n) {
          return n
            ? document.createElementNS(Nc[n] || n, e)
            : document.createElement(e);
        }
        createComment(e) {
          return document.createComment(e);
        }
        createText(e) {
          return document.createTextNode(e);
        }
        appendChild(e, n) {
          e.appendChild(n);
        }
        insertBefore(e, n, r) {
          e && e.insertBefore(n, r);
        }
        removeChild(e, n) {
          e && e.removeChild(n);
        }
        selectRootElement(e, n) {
          let r = "string" == typeof e ? document.querySelector(e) : e;
          if (!r)
            throw new Error(`The selector "${e}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(e) {
          return e.parentNode;
        }
        nextSibling(e) {
          return e.nextSibling;
        }
        setAttribute(e, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = Nc[o];
            i ? e.setAttributeNS(i, n, r) : e.setAttribute(n, r);
          } else e.setAttribute(n, r);
        }
        removeAttribute(e, n, r) {
          if (r) {
            const o = Nc[r];
            o ? e.removeAttributeNS(o, n) : e.removeAttribute(`${r}:${n}`);
          } else e.removeAttribute(n);
        }
        addClass(e, n) {
          e.classList.add(n);
        }
        removeClass(e, n) {
          e.classList.remove(n);
        }
        setStyle(e, n, r, o) {
          o & (it.DashCase | it.Important)
            ? e.style.setProperty(n, r, o & it.Important ? "important" : "")
            : (e.style[n] = r);
        }
        removeStyle(e, n, r) {
          r & it.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
        }
        setProperty(e, n, r) {
          e[n] = r;
        }
        setValue(e, n) {
          e.nodeValue = n;
        }
        listen(e, n, r) {
          return "string" == typeof e
            ? this.eventManager.addGlobalEventListener(e, n, Nv(r))
            : this.eventManager.addEventListener(e, n, Nv(r));
        }
      }
      class ox extends Pc {
        constructor(e, n, r, o) {
          super(e), (this.component = r);
          const i = Ws(o + "-" + r.id, r.styles, []);
          n.addStyles(i),
            (this.contentAttr = (function tx(t) {
              return "_ngcontent-%COMP%".replace(Oc, t);
            })(o + "-" + r.id)),
            (this.hostAttr = (function nx(t) {
              return "_nghost-%COMP%".replace(Oc, t);
            })(o + "-" + r.id));
        }
        applyToHost(e) {
          super.setAttribute(e, this.hostAttr, "");
        }
        createElement(e, n) {
          const r = super.createElement(e, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class ix extends Pc {
        constructor(e, n, r, o) {
          super(e),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = Ws(o.id, o.styles, []);
          for (let s = 0; s < i.length; s++) {
            const a = document.createElement("style");
            (a.textContent = i[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(e) {
          return e === this.hostEl ? this.shadowRoot : e;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(e, n) {
          return super.appendChild(this.nodeOrShadowRoot(e), n);
        }
        insertBefore(e, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
        }
        removeChild(e, n) {
          return super.removeChild(this.nodeOrShadowRoot(e), n);
        }
        parentNode(e) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(e))
          );
        }
      }
      let sx = (() => {
        class t extends Tv {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(lt));
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      const Fv = ["alt", "control", "meta", "shift"],
        lx = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        Pv = {
          A: "1",
          B: "2",
          C: "3",
          D: "4",
          E: "5",
          F: "6",
          G: "7",
          H: "8",
          I: "9",
          J: "*",
          K: "+",
          M: "-",
          N: ".",
          O: "/",
          "`": "0",
          "\x90": "NumLock",
        },
        ux = {
          alt: (t) => t.altKey,
          control: (t) => t.ctrlKey,
          meta: (t) => t.metaKey,
          shift: (t) => t.shiftKey,
        };
      let cx = (() => {
        class t extends Tv {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != t.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = t.parseEventName(r),
              s = t.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Zt().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = t._normalizeKey(r.pop());
            let s = "";
            if (
              (Fv.forEach((l) => {
                const u = r.indexOf(l);
                u > -1 && (r.splice(u, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const a = {};
            return (a.domEventName = o), (a.fullKey = s), a;
          }
          static getEventFullKey(n) {
            let r = "",
              o = (function dx(t) {
                let e = t.key;
                if (null == e) {
                  if (((e = t.keyIdentifier), null == e)) return "Unidentified";
                  e.startsWith("U+") &&
                    ((e = String.fromCharCode(parseInt(e.substring(2), 16))),
                    3 === t.location && Pv.hasOwnProperty(e) && (e = Pv[e]));
                }
                return lx[e] || e;
              })(n);
            return (
              (o = o.toLowerCase()),
              " " === o ? (o = "space") : "." === o && (o = "dot"),
              Fv.forEach((i) => {
                i != o && ux[i](n) && (r += i + ".");
              }),
              (r += o),
              r
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              t.getEventFullKey(i) === n && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(lt));
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      const gx = jy(yI, "browser", [
          { provide: Ss, useValue: "browser" },
          {
            provide: Ry,
            useValue: function fx() {
              Rc.makeCurrent(), xc.init();
            },
            multi: !0,
          },
          {
            provide: lt,
            useFactory: function px() {
              return (
                (function ME(t) {
                  za = t;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        mx = [
          { provide: au, useValue: "root" },
          {
            provide: Io,
            useFactory: function hx() {
              return new Io();
            },
            deps: [],
          },
          { provide: qs, useClass: sx, multi: !0, deps: [lt, Re, Ss] },
          { provide: qs, useClass: cx, multi: !0, deps: [lt] },
          { provide: Fc, useClass: Fc, deps: [zs, ti, Ko] },
          { provide: zm, useExisting: Fc },
          { provide: Sv, useExisting: ti },
          { provide: ti, useClass: ti, deps: [lt] },
          { provide: sc, useClass: sc, deps: [Re] },
          { provide: zs, useClass: zs, deps: [qs, Re] },
          { provide: $s, useClass: YR, deps: [] },
        ];
      let yx = (() => {
        class t {
          constructor(n) {
            if (n)
              throw new Error(
                "BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead."
              );
          }
          static withServerTransition(n) {
            return {
              ngModule: t,
              providers: [
                { provide: Ko, useValue: n.appId },
                { provide: Av, useExisting: Ko },
                JR,
              ],
            };
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(t, 12));
          }),
          (t.??mod = tt({ type: t })),
          (t.??inj = Qe({ providers: mx, imports: [jR, vI] })),
          t
        );
      })();
      "undefined" != typeof window && window;
      class Ct extends en {
        constructor(e) {
          super(), (this._value = e);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(e) {
          const n = super._subscribe(e);
          return !n.closed && e.next(this._value), n;
        }
        getValue() {
          const { hasError: e, thrownError: n, _value: r } = this;
          if (e) throw n;
          return this._throwIfClosed(), r;
        }
        next(e) {
          super.next((this._value = e));
        }
      }
      function O(...t) {
        return Ce(t, io(t));
      }
      const Qs = no(
        (t) =>
          function () {
            t(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function Yn(t, e) {
        return Ie((n, r) => {
          let o = 0;
          n.subscribe(Ae(r, (i) => t.call(e, i, o++) && r.next(i)));
        });
      }
      function Lv(t) {
        return Ie((e, n) => {
          let r = !1;
          e.subscribe(
            Ae(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(t), n.complete();
              }
            )
          );
        });
      }
      function Bv(t = Sx) {
        return Ie((e, n) => {
          let r = !1;
          e.subscribe(
            Ae(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(t()))
            )
          );
        });
      }
      function Sx() {
        return new Qs();
      }
      function xn(t, e) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            t ? Yn((o, i) => t(o, i, r)) : jn,
            bi(1),
            n ? Lv(e) : Bv(() => new Qs())
          );
      }
      function Nn(t, e) {
        return Y(e) ? Te(t, e, 1) : Te(t, 1);
      }
      class jv {}
      class Vc {}
      class Kt {
        constructor(e) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            e
              ? (this.lazyInit =
                  "string" == typeof e
                    ? () => {
                        (this.headers = new Map()),
                          e.split("\n").forEach((n) => {
                            const r = n.indexOf(":");
                            if (r > 0) {
                              const o = n.slice(0, r),
                                i = o.toLowerCase(),
                                s = n.slice(r + 1).trim();
                              this.maybeSetNormalizedName(o, i),
                                this.headers.has(i)
                                  ? this.headers.get(i).push(s)
                                  : this.headers.set(i, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(e).forEach((n) => {
                            let r = e[n];
                            const o = n.toLowerCase();
                            "string" == typeof r && (r = [r]),
                              r.length > 0 &&
                                (this.headers.set(o, r),
                                this.maybeSetNormalizedName(n, o));
                          });
                      })
              : (this.headers = new Map());
        }
        has(e) {
          return this.init(), this.headers.has(e.toLowerCase());
        }
        get(e) {
          this.init();
          const n = this.headers.get(e.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(e) {
          return this.init(), this.headers.get(e.toLowerCase()) || null;
        }
        append(e, n) {
          return this.clone({ name: e, value: n, op: "a" });
        }
        set(e, n) {
          return this.clone({ name: e, value: n, op: "s" });
        }
        delete(e, n) {
          return this.clone({ name: e, value: n, op: "d" });
        }
        maybeSetNormalizedName(e, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, e);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Kt
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
              (this.lazyUpdate = null)));
        }
        copyFrom(e) {
          e.init(),
            Array.from(e.headers.keys()).forEach((n) => {
              this.headers.set(n, e.headers.get(n)),
                this.normalizedNames.set(n, e.normalizedNames.get(n));
            });
        }
        clone(e) {
          const n = new Kt();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof Kt
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([e])),
            n
          );
        }
        applyUpdate(e) {
          const n = e.name.toLowerCase();
          switch (e.op) {
            case "a":
            case "s":
              let r = e.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(e.name, n);
              const o = ("a" === e.op ? this.headers.get(n) : void 0) || [];
              o.push(...r), this.headers.set(n, o);
              break;
            case "d":
              const i = e.value;
              if (i) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        forEach(e) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              e(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class Ix {
        encodeKey(e) {
          return Uv(e);
        }
        encodeValue(e) {
          return Uv(e);
        }
        decodeKey(e) {
          return decodeURIComponent(e);
        }
        decodeValue(e) {
          return decodeURIComponent(e);
        }
      }
      const xx = /%(\d[a-f0-9])/gi,
        Nx = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "2B": "+",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function Uv(t) {
        return encodeURIComponent(t).replace(xx, (e, n) => {
          var r;
          return null !== (r = Nx[n]) && void 0 !== r ? r : e;
        });
      }
      function Hv(t) {
        return `${t}`;
      }
      class mn {
        constructor(e = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = e.encoder || new Ix()),
            e.fromString)
          ) {
            if (e.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function Rx(t, e) {
              const n = new Map();
              return (
                t.length > 0 &&
                  t
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((o) => {
                      const i = o.indexOf("="),
                        [s, a] =
                          -1 == i
                            ? [e.decodeKey(o), ""]
                            : [
                                e.decodeKey(o.slice(0, i)),
                                e.decodeValue(o.slice(i + 1)),
                              ],
                        l = n.get(s) || [];
                      l.push(a), n.set(s, l);
                    }),
                n
              );
            })(e.fromString, this.encoder);
          } else
            e.fromObject
              ? ((this.map = new Map()),
                Object.keys(e.fromObject).forEach((n) => {
                  const r = e.fromObject[n];
                  this.map.set(n, Array.isArray(r) ? r : [r]);
                }))
              : (this.map = null);
        }
        has(e) {
          return this.init(), this.map.has(e);
        }
        get(e) {
          this.init();
          const n = this.map.get(e);
          return n ? n[0] : null;
        }
        getAll(e) {
          return this.init(), this.map.get(e) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(e, n) {
          return this.clone({ param: e, value: n, op: "a" });
        }
        appendAll(e) {
          const n = [];
          return (
            Object.keys(e).forEach((r) => {
              const o = e[r];
              Array.isArray(o)
                ? o.forEach((i) => {
                    n.push({ param: r, value: i, op: "a" });
                  })
                : n.push({ param: r, value: o, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(e, n) {
          return this.clone({ param: e, value: n, op: "s" });
        }
        delete(e, n) {
          return this.clone({ param: e, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((e) => {
                const n = this.encoder.encodeKey(e);
                return this.map
                  .get(e)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((e) => "" !== e)
              .join("&")
          );
        }
        clone(e) {
          const n = new mn({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(e)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
              this.updates.forEach((e) => {
                switch (e.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === e.op ? this.map.get(e.param) : void 0) || [];
                    n.push(Hv(e.value)), this.map.set(e.param, n);
                    break;
                  case "d":
                    if (void 0 === e.value) {
                      this.map.delete(e.param);
                      break;
                    }
                    {
                      let r = this.map.get(e.param) || [];
                      const o = r.indexOf(Hv(e.value));
                      -1 !== o && r.splice(o, 1),
                        r.length > 0
                          ? this.map.set(e.param, r)
                          : this.map.delete(e.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class Ox {
        constructor() {
          this.map = new Map();
        }
        set(e, n) {
          return this.map.set(e, n), this;
        }
        get(e) {
          return (
            this.map.has(e) || this.map.set(e, e.defaultValue()),
            this.map.get(e)
          );
        }
        delete(e) {
          return this.map.delete(e), this;
        }
        has(e) {
          return this.map.has(e);
        }
        keys() {
          return this.map.keys();
        }
      }
      function $v(t) {
        return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer;
      }
      function Gv(t) {
        return "undefined" != typeof Blob && t instanceof Blob;
      }
      function qv(t) {
        return "undefined" != typeof FormData && t instanceof FormData;
      }
      class ni {
        constructor(e, n, r, o) {
          let i;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = e.toUpperCase()),
            (function Fx(t) {
              switch (t) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || o
              ? ((this.body = void 0 !== r ? r : null), (i = o))
              : (i = r),
            i &&
              ((this.reportProgress = !!i.reportProgress),
              (this.withCredentials = !!i.withCredentials),
              i.responseType && (this.responseType = i.responseType),
              i.headers && (this.headers = i.headers),
              i.context && (this.context = i.context),
              i.params && (this.params = i.params)),
            this.headers || (this.headers = new Kt()),
            this.context || (this.context = new Ox()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new mn()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : $v(this.body) ||
              Gv(this.body) ||
              qv(this.body) ||
              (function Px(t) {
                return (
                  "undefined" != typeof URLSearchParams &&
                  t instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof mn
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || qv(this.body)
            ? null
            : Gv(this.body)
            ? this.body.type || null
            : $v(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof mn
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(e = {}) {
          var n;
          const r = e.method || this.method,
            o = e.url || this.url,
            i = e.responseType || this.responseType,
            s = void 0 !== e.body ? e.body : this.body,
            a =
              void 0 !== e.withCredentials
                ? e.withCredentials
                : this.withCredentials,
            l =
              void 0 !== e.reportProgress
                ? e.reportProgress
                : this.reportProgress;
          let u = e.headers || this.headers,
            c = e.params || this.params;
          const d = null !== (n = e.context) && void 0 !== n ? n : this.context;
          return (
            void 0 !== e.setHeaders &&
              (u = Object.keys(e.setHeaders).reduce(
                (f, h) => f.set(h, e.setHeaders[h]),
                u
              )),
            e.setParams &&
              (c = Object.keys(e.setParams).reduce(
                (f, h) => f.set(h, e.setParams[h]),
                c
              )),
            new ni(r, o, s, {
              params: c,
              headers: u,
              context: d,
              reportProgress: l,
              responseType: i,
              withCredentials: a,
            })
          );
        }
      }
      var De = (() => (
        ((De = De || {})[(De.Sent = 0)] = "Sent"),
        (De[(De.UploadProgress = 1)] = "UploadProgress"),
        (De[(De.ResponseHeader = 2)] = "ResponseHeader"),
        (De[(De.DownloadProgress = 3)] = "DownloadProgress"),
        (De[(De.Response = 4)] = "Response"),
        (De[(De.User = 5)] = "User"),
        De
      ))();
      class Lc {
        constructor(e, n = 200, r = "OK") {
          (this.headers = e.headers || new Kt()),
            (this.status = void 0 !== e.status ? e.status : n),
            (this.statusText = e.statusText || r),
            (this.url = e.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Bc extends Lc {
        constructor(e = {}) {
          super(e), (this.type = De.ResponseHeader);
        }
        clone(e = {}) {
          return new Bc({
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class ri extends Lc {
        constructor(e = {}) {
          super(e),
            (this.type = De.Response),
            (this.body = void 0 !== e.body ? e.body : null);
        }
        clone(e = {}) {
          return new ri({
            body: void 0 !== e.body ? e.body : this.body,
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class zv extends Lc {
        constructor(e) {
          super(e, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${e.url || "(unknown url)"}`
                : `Http failure response for ${e.url || "(unknown url)"}: ${
                    e.status
                  } ${e.statusText}`),
            (this.error = e.error || null);
        }
      }
      function jc(t, e) {
        return {
          body: e,
          headers: t.headers,
          context: t.context,
          observe: t.observe,
          params: t.params,
          reportProgress: t.reportProgress,
          responseType: t.responseType,
          withCredentials: t.withCredentials,
        };
      }
      let Wv = (() => {
        class t {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, o = {}) {
            let i;
            if (n instanceof ni) i = n;
            else {
              let l, u;
              (l = o.headers instanceof Kt ? o.headers : new Kt(o.headers)),
                o.params &&
                  (u =
                    o.params instanceof mn
                      ? o.params
                      : new mn({ fromObject: o.params })),
                (i = new ni(n, r, void 0 !== o.body ? o.body : null, {
                  headers: l,
                  context: o.context,
                  params: u,
                  reportProgress: o.reportProgress,
                  responseType: o.responseType || "json",
                  withCredentials: o.withCredentials,
                }));
            }
            const s = O(i).pipe(Nn((l) => this.handler.handle(l)));
            if (n instanceof ni || "events" === o.observe) return s;
            const a = s.pipe(Yn((l) => l instanceof ri));
            switch (o.observe || "body") {
              case "body":
                switch (i.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      z((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      z((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      z((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(z((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${o.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new mn().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, o = {}) {
            return this.request("PATCH", n, jc(o, r));
          }
          post(n, r, o = {}) {
            return this.request("POST", n, jc(o, r));
          }
          put(n, r, o = {}) {
            return this.request("PUT", n, jc(o, r));
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(jv));
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      class Qv {
        constructor(e, n) {
          (this.next = e), (this.interceptor = n);
        }
        handle(e) {
          return this.interceptor.intercept(e, this.next);
        }
      }
      const Zv = new L("HTTP_INTERCEPTORS");
      let kx = (() => {
        class t {
          intercept(n, r) {
            return r.handle(n);
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      const Vx = /^\)\]\}',?\n/;
      let Uc = (() => {
        class t {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed."
              );
            return new oe((r) => {
              const o = this.xhrFactory.build();
              if (
                (o.open(n.method, n.urlWithParams),
                n.withCredentials && (o.withCredentials = !0),
                n.headers.forEach((h, p) => o.setRequestHeader(h, p.join(","))),
                n.headers.has("Accept") ||
                  o.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*"
                  ),
                !n.headers.has("Content-Type"))
              ) {
                const h = n.detectContentTypeHeader();
                null !== h && o.setRequestHeader("Content-Type", h);
              }
              if (n.responseType) {
                const h = n.responseType.toLowerCase();
                o.responseType = "json" !== h ? h : "text";
              }
              const i = n.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = o.statusText || "OK",
                    p = new Kt(o.getAllResponseHeaders()),
                    m =
                      (function Lx(t) {
                        return "responseURL" in t && t.responseURL
                          ? t.responseURL
                          : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
                          ? t.getResponseHeader("X-Request-URL")
                          : null;
                      })(o) || n.url;
                  return (
                    (s = new Bc({
                      headers: p,
                      status: o.status,
                      statusText: h,
                      url: m,
                    })),
                    s
                  );
                },
                l = () => {
                  let { headers: h, status: p, statusText: m, url: D } = a(),
                    v = null;
                  204 !== p &&
                    (v = void 0 === o.response ? o.responseText : o.response),
                    0 === p && (p = v ? 200 : 0);
                  let g = p >= 200 && p < 300;
                  if ("json" === n.responseType && "string" == typeof v) {
                    const b = v;
                    v = v.replace(Vx, "");
                    try {
                      v = "" !== v ? JSON.parse(v) : null;
                    } catch (F) {
                      (v = b), g && ((g = !1), (v = { error: F, text: v }));
                    }
                  }
                  g
                    ? (r.next(
                        new ri({
                          body: v,
                          headers: h,
                          status: p,
                          statusText: m,
                          url: D || void 0,
                        })
                      ),
                      r.complete())
                    : r.error(
                        new zv({
                          error: v,
                          headers: h,
                          status: p,
                          statusText: m,
                          url: D || void 0,
                        })
                      );
                },
                u = (h) => {
                  const { url: p } = a(),
                    m = new zv({
                      error: h,
                      status: o.status || 0,
                      statusText: o.statusText || "Unknown Error",
                      url: p || void 0,
                    });
                  r.error(m);
                };
              let c = !1;
              const d = (h) => {
                  c || (r.next(a()), (c = !0));
                  let p = { type: De.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total),
                    "text" === n.responseType &&
                      !!o.responseText &&
                      (p.partialText = o.responseText),
                    r.next(p);
                },
                f = (h) => {
                  let p = { type: De.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (p.total = h.total), r.next(p);
                };
              return (
                o.addEventListener("load", l),
                o.addEventListener("error", u),
                o.addEventListener("timeout", u),
                o.addEventListener("abort", u),
                n.reportProgress &&
                  (o.addEventListener("progress", d),
                  null !== i &&
                    o.upload &&
                    o.upload.addEventListener("progress", f)),
                o.send(i),
                r.next({ type: De.Sent }),
                () => {
                  o.removeEventListener("error", u),
                    o.removeEventListener("abort", u),
                    o.removeEventListener("load", l),
                    o.removeEventListener("timeout", u),
                    n.reportProgress &&
                      (o.removeEventListener("progress", d),
                      null !== i &&
                        o.upload &&
                        o.upload.removeEventListener("progress", f)),
                    o.readyState !== o.DONE && o.abort();
                }
              );
            });
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w($s));
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      const Hc = new L("XSRF_COOKIE_NAME"),
        $c = new L("XSRF_HEADER_NAME");
      class Kv {}
      let Bx = (() => {
          class t {
            constructor(n, r, o) {
              (this.doc = n),
                (this.platform = r),
                (this.cookieName = o),
                (this.lastCookieString = ""),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ("server" === this.platform) return null;
              const n = this.doc.cookie || "";
              return (
                n !== this.lastCookieString &&
                  (this.parseCount++,
                  (this.lastToken = gv(n, this.cookieName)),
                  (this.lastCookieString = n)),
                this.lastToken
              );
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(lt), w(Ss), w(Hc));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        Gc = (() => {
          class t {
            constructor(n, r) {
              (this.tokenService = n), (this.headerName = r);
            }
            intercept(n, r) {
              const o = n.url.toLowerCase();
              if (
                "GET" === n.method ||
                "HEAD" === n.method ||
                o.startsWith("http://") ||
                o.startsWith("https://")
              )
                return r.handle(n);
              const i = this.tokenService.getToken();
              return (
                null !== i &&
                  !n.headers.has(this.headerName) &&
                  (n = n.clone({ headers: n.headers.set(this.headerName, i) })),
                r.handle(n)
              );
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(Kv), w($c));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        jx = (() => {
          class t {
            constructor(n, r) {
              (this.backend = n), (this.injector = r), (this.chain = null);
            }
            handle(n) {
              if (null === this.chain) {
                const r = this.injector.get(Zv, []);
                this.chain = r.reduceRight(
                  (o, i) => new Qv(o, i),
                  this.backend
                );
              }
              return this.chain.handle(n);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(Vc), w(ke));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        Ux = (() => {
          class t {
            static disable() {
              return {
                ngModule: t,
                providers: [{ provide: Gc, useClass: kx }],
              };
            }
            static withOptions(n = {}) {
              return {
                ngModule: t,
                providers: [
                  n.cookieName ? { provide: Hc, useValue: n.cookieName } : [],
                  n.headerName ? { provide: $c, useValue: n.headerName } : [],
                ],
              };
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??mod = tt({ type: t })),
            (t.??inj = Qe({
              providers: [
                Gc,
                { provide: Zv, useExisting: Gc, multi: !0 },
                { provide: Kv, useClass: Bx },
                { provide: Hc, useValue: "XSRF-TOKEN" },
                { provide: $c, useValue: "X-XSRF-TOKEN" },
              ],
            })),
            t
          );
        })(),
        Hx = (() => {
          class t {}
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??mod = tt({ type: t })),
            (t.??inj = Qe({
              providers: [
                Wv,
                { provide: jv, useClass: jx },
                Uc,
                { provide: Vc, useExisting: Uc },
              ],
              imports: [
                [
                  Ux.withOptions({
                    cookieName: "XSRF-TOKEN",
                    headerName: "X-XSRF-TOKEN",
                  }),
                ],
              ],
            })),
            t
          );
        })();
      const Gx = {
        100: {
          code: 100,
          text: "Continue",
          description:
            '"The initial part of a request has been received and has not yet been rejected by the server."',
          spec_title: "RFC7231#6.2.1",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.2.1",
        },
        101: {
          code: 101,
          text: "Switching Protocols",
          description:
            '"The server understands and is willing to comply with the client\'s request, via the Upgrade header field, for a change in the application protocol being used on this connection."',
          spec_title: "RFC7231#6.2.2",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.2.2",
        },
        200: {
          code: 200,
          text: "OK",
          description: '"The request has succeeded."',
          spec_title: "RFC7231#6.3.1",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.3.1",
        },
        201: {
          code: 201,
          text: "Created",
          description:
            '"The request has been fulfilled and has resulted in one or more new resources being created."',
          spec_title: "RFC7231#6.3.2",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.3.2",
        },
        202: {
          code: 202,
          text: "Accepted",
          description:
            '"The request has been accepted for processing, but the processing has not been completed."',
          spec_title: "RFC7231#6.3.3",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.3.3",
        },
        203: {
          code: 203,
          text: "Non-Authoritative Information",
          description:
            '"The request was successful but the enclosed payload has been modified from that of the origin server\'s 200 (OK) response by a transforming proxy."',
          spec_title: "RFC7231#6.3.4",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.3.4",
        },
        204: {
          code: 204,
          text: "No Content",
          description:
            '"The server has successfully fulfilled the request and that there is no additional content to send in the response payload body."',
          spec_title: "RFC7231#6.3.5",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.3.5",
        },
        205: {
          code: 205,
          text: "Reset Content",
          description:
            '"The server has fulfilled the request and desires that the user agent reset the "document view", which caused the request to be sent, to its original state as received from the origin server."',
          spec_title: "RFC7231#6.3.6",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.3.6",
        },
        206: {
          code: 206,
          text: "Partial Content",
          description:
            '"The server is successfully fulfilling a range request for the target resource by transferring one or more parts of the selected representation that correspond to the satisfiable ranges found in the requests\'s Range header field."',
          spec_title: "RFC7233#4.1",
          spec_href: "https://tools.ietf.org/html/rfc7233#section-4.1",
        },
        300: {
          code: 300,
          text: "Multiple Choices",
          description:
            '"The target resource has more than one representation, each with its own more specific identifier, and information about the alternatives is being provided so that the user (or user agent) can select a preferred representation by redirecting its request to one or more of those identifiers."',
          spec_title: "RFC7231#6.4.1",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.4.1",
        },
        301: {
          code: 301,
          text: "Moved Permanently",
          description:
            '"The target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs."',
          spec_title: "RFC7231#6.4.2",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.4.2",
        },
        302: {
          code: 302,
          text: "Found",
          description:
            '"The target resource resides temporarily under a different URI."',
          spec_title: "RFC7231#6.4.3",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.4.3",
        },
        303: {
          code: 303,
          text: "See Other",
          description:
            '"The server is redirecting the user agent to a different resource, as indicated by a URI in the Location header field, that is intended to provide an indirect response to the original request."',
          spec_title: "RFC7231#6.4.4",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.4.4",
        },
        304: {
          code: 304,
          text: "Not Modified",
          description:
            '"A conditional GET request has been received and would have resulted in a 200 (OK) response if it were not for the fact that the condition has evaluated to false."',
          spec_title: "RFC7232#4.1",
          spec_href: "https://tools.ietf.org/html/rfc7232#section-4.1",
        },
        305: {
          code: 305,
          text: "Use Proxy",
          description: "*deprecated*",
          spec_title: "RFC7231#6.4.5",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.4.5",
        },
        307: {
          code: 307,
          text: "Temporary Redirect",
          description:
            '"The target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI."',
          spec_title: "RFC7231#6.4.7",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.4.7",
        },
        400: {
          code: 400,
          text: "Bad Request",
          description:
            '"The server cannot or will not process the request because the received syntax is invalid, nonsensical, or exceeds some limitation on what the server is willing to process."',
          spec_title: "RFC7231#6.5.1",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
        },
        401: {
          code: 401,
          text: "Unauthorized",
          description:
            '"The request has not been applied because it lacks valid authentication credentials for the target resource."',
          spec_title: "RFC7235#6.3.1",
          spec_href: "https://tools.ietf.org/html/rfc7235#section-3.1",
        },
        402: {
          code: 402,
          text: "Payment Required",
          description: "*reserved*",
          spec_title: "RFC7231#6.5.2",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.2",
        },
        403: {
          code: 403,
          text: "Forbidden",
          description:
            '"The server understood the request but refuses to authorize it."',
          spec_title: "RFC7231#6.5.3",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.3",
        },
        404: {
          code: 404,
          text: "Not Found",
          description:
            '"The origin server did not find a current representation for the target resource or is not willing to disclose that one exists."',
          spec_title: "RFC7231#6.5.4",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
        },
        405: {
          code: 405,
          text: "Method Not Allowed",
          description:
            '"The method specified in the request-line is known by the origin server but not supported by the target resource."',
          spec_title: "RFC7231#6.5.5",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.5",
        },
        406: {
          code: 406,
          text: "Not Acceptable",
          description:
            '"The target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request, and the server is unwilling to supply a default representation."',
          spec_title: "RFC7231#6.5.6",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.6",
        },
        407: {
          code: 407,
          text: "Proxy Authentication Required",
          description:
            '"The client needs to authenticate itself in order to use a proxy."',
          spec_title: "RFC7231#6.3.2",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.3.2",
        },
        408: {
          code: 408,
          text: "Request Timeout",
          description:
            '"The server did not receive a complete request message within the time that it was prepared to wait."',
          spec_title: "RFC7231#6.5.7",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.7",
        },
        409: {
          code: 409,
          text: "Conflict",
          description:
            '"The request could not be completed due to a conflict with the current state of the resource."',
          spec_title: "RFC7231#6.5.8",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.8",
        },
        410: {
          code: 410,
          text: "Gone",
          description:
            '"Access to the target resource is no longer available at the origin server and that this condition is likely to be permanent."',
          spec_title: "RFC7231#6.5.9",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.9",
        },
        411: {
          code: 411,
          text: "Length Required",
          description:
            '"The server refuses to accept the request without a defined Content-Length."',
          spec_title: "RFC7231#6.5.10",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.10",
        },
        412: {
          code: 412,
          text: "Precondition Failed",
          description:
            '"One or more preconditions given in the request header fields evaluated to false when tested on the server."',
          spec_title: "RFC7232#4.2",
          spec_href: "https://tools.ietf.org/html/rfc7232#section-4.2",
        },
        413: {
          code: 413,
          text: "Payload Too Large",
          description:
            '"The server is refusing to process a request because the request payload is larger than the server is willing or able to process."',
          spec_title: "RFC7231#6.5.11",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.11",
        },
        414: {
          code: 414,
          text: "URI Too Long",
          description:
            '"The server is refusing to service the request because the request-target is longer than the server is willing to interpret."',
          spec_title: "RFC7231#6.5.12",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.12",
        },
        415: {
          code: 415,
          text: "Unsupported Media Type",
          description:
            '"The origin server is refusing to service the request because the payload is in a format not supported by the target resource for this method."',
          spec_title: "RFC7231#6.5.13",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.13",
        },
        416: {
          code: 416,
          text: "Range Not Satisfiable",
          description:
            '"None of the ranges in the request\'s Range header field overlap the current extent of the selected resource or that the set of ranges requested has been rejected due to invalid ranges or an excessive request of small or overlapping ranges."',
          spec_title: "RFC7233#4.4",
          spec_href: "https://tools.ietf.org/html/rfc7233#section-4.4",
        },
        417: {
          code: 417,
          text: "Expectation Failed",
          description:
            '"The expectation given in the request\'s Expect header field could not be met by at least one of the inbound servers."',
          spec_title: "RFC7231#6.5.14",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.14",
        },
        418: {
          code: 418,
          text: "I'm a teapot",
          description:
            '"1988 April Fools Joke. Returned by tea pots requested to brew coffee."',
          spec_title: "RFC 2324",
          spec_href: "https://tools.ietf.org/html/rfc2324",
        },
        426: {
          code: 426,
          text: "Upgrade Required",
          description:
            '"The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol."',
          spec_title: "RFC7231#6.5.15",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.5.15",
        },
        500: {
          code: 500,
          text: "Internal Server Error",
          description:
            '"The server encountered an unexpected condition that prevented it from fulfilling the request."',
          spec_title: "RFC7231#6.6.1",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
        },
        501: {
          code: 501,
          text: "Not Implemented",
          description:
            '"The server does not support the functionality required to fulfill the request."',
          spec_title: "RFC7231#6.6.2",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.6.2",
        },
        502: {
          code: 502,
          text: "Bad Gateway",
          description:
            '"The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request."',
          spec_title: "RFC7231#6.6.3",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.6.3",
        },
        503: {
          code: 503,
          text: "Service Unavailable",
          description:
            '"The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay."',
          spec_title: "RFC7231#6.6.4",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.6.4",
        },
        504: {
          code: 504,
          text: "Gateway Time-out",
          description:
            '"The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request."',
          spec_title: "RFC7231#6.6.5",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.6.5",
        },
        505: {
          code: 505,
          text: "HTTP Version Not Supported",
          description:
            '"The server does not support, or refuses to support, the protocol version that was used in the request message."',
          spec_title: "RFC7231#6.6.6",
          spec_href: "https://tools.ietf.org/html/rfc7231#section-6.6.6",
        },
        102: {
          code: 102,
          text: "Processing",
          description:
            '"An interim response to inform the client that the server has accepted the complete request, but has not yet completed it."',
          spec_title: "RFC5218#10.1",
          spec_href: "https://tools.ietf.org/html/rfc2518#section-10.1",
        },
        207: {
          code: 207,
          text: "Multi-Status",
          description: '"Status for multiple independent operations."',
          spec_title: "RFC5218#10.2",
          spec_href: "https://tools.ietf.org/html/rfc2518#section-10.2",
        },
        226: {
          code: 226,
          text: "IM Used",
          description:
            '"The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance."',
          spec_title: "RFC3229#10.4.1",
          spec_href: "https://tools.ietf.org/html/rfc3229#section-10.4.1",
        },
        308: {
          code: 308,
          text: "Permanent Redirect",
          description:
            '"The target resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs. [...] This status code is similar to 301 Moved Permanently (Section 7.3.2 of rfc7231), except that it does not allow rewriting the request method from POST to GET."',
          spec_title: "RFC7238",
          spec_href: "https://tools.ietf.org/html/rfc7238",
        },
        422: {
          code: 422,
          text: "Unprocessable Entity",
          description:
            '"The server understands the content type of the request entity (hence a 415(Unsupported Media Type) status code is inappropriate), and the syntax of the request entity is correct (thus a 400 (Bad Request) status code is inappropriate) but was unable to process the contained instructions."',
          spec_title: "RFC5218#10.3",
          spec_href: "https://tools.ietf.org/html/rfc2518#section-10.3",
        },
        423: {
          code: 423,
          text: "Locked",
          description:
            '"The source or destination resource of a method is locked."',
          spec_title: "RFC5218#10.4",
          spec_href: "https://tools.ietf.org/html/rfc2518#section-10.4",
        },
        424: {
          code: 424,
          text: "Failed Dependency",
          description:
            '"The method could not be performed on the resource because the requested action depended on another action and that action failed."',
          spec_title: "RFC5218#10.5",
          spec_href: "https://tools.ietf.org/html/rfc2518#section-10.5",
        },
        428: {
          code: 428,
          text: "Precondition Required",
          description:
            '"The origin server requires the request to be conditional."',
          spec_title: "RFC6585#3",
          spec_href: "https://tools.ietf.org/html/rfc6585#section-3",
        },
        429: {
          code: 429,
          text: "Too Many Requests",
          description:
            '"The user has sent too many requests in a given amount of time ("rate limiting")."',
          spec_title: "RFC6585#4",
          spec_href: "https://tools.ietf.org/html/rfc6585#section-4",
        },
        431: {
          code: 431,
          text: "Request Header Fields Too Large",
          description:
            '"The server is unwilling to process the request because its header fields are too large."',
          spec_title: "RFC6585#5",
          spec_href: "https://tools.ietf.org/html/rfc6585#section-5",
        },
        451: {
          code: 451,
          text: "Unavailable For Legal Reasons",
          description:
            '"The server is denying access to the resource in response to a legal demand."',
          spec_title: "draft-ietf-httpbis-legally-restricted-status",
          spec_href:
            "https://tools.ietf.org/html/draft-ietf-httpbis-legally-restricted-status",
        },
        506: {
          code: 506,
          text: "Variant Also Negotiates",
          description:
            '"The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process."',
          spec_title: "RFC2295#8.1",
          spec_href: "https://tools.ietf.org/html/rfc2295#section-8.1",
        },
        507: {
          code: 507,
          text: "Insufficient Storage",
          description:
            'The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request."',
          spec_title: "RFC5218#10.6",
          spec_href: "https://tools.ietf.org/html/rfc2518#section-10.6",
        },
        511: {
          code: 511,
          text: "Network Authentication Required",
          description:
            '"The client needs to authenticate to gain network access."',
          spec_title: "RFC6585#6",
          spec_href: "https://tools.ietf.org/html/rfc6585#section-6",
        },
      };
      class qc {}
      class Wx {}
      let Zs = (() => {
          class t {
            constructor(n = {}) {
              Object.assign(
                this,
                {
                  caseSensitiveSearch: !1,
                  dataEncapsulation: !1,
                  delay: 500,
                  delete404: !1,
                  passThruUnknownUrl: !1,
                  post204: !0,
                  post409: !1,
                  put204: !0,
                  put404: !1,
                  apiBase: void 0,
                  host: void 0,
                  rootPath: void 0,
                },
                n
              );
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(Wx));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        Jx = (() => {
          class t extends class Kx {
            constructor(e, n = {}) {
              (this.inMemDbService = e),
                (this.config = new Zs()),
                (this.db = {}),
                (this.requestInfoUtils = this.getRequestInfoUtils());
              const r = this.getLocation("/");
              (this.config.host = r.host),
                (this.config.rootPath = r.path),
                Object.assign(this.config, n);
            }
            get dbReady() {
              return (
                this.dbReadySubject ||
                  ((this.dbReadySubject = new Ct(!1)), this.resetDb()),
                this.dbReadySubject.asObservable().pipe(xn((e) => e))
              );
            }
            handleRequest(e) {
              return this.dbReady.pipe(Nn(() => this.handleRequest_(e)));
            }
            handleRequest_(e) {
              const n = e.urlWithParams ? e.urlWithParams : e.url,
                r = this.bind("parseRequestUrl"),
                o =
                  (r && r(n, this.requestInfoUtils)) || this.parseRequestUrl(n),
                i = o.collectionName,
                s = this.db[i],
                a = {
                  req: e,
                  apiBase: o.apiBase,
                  collection: s,
                  collectionName: i,
                  headers: this.createHeaders({
                    "Content-Type": "application/json",
                  }),
                  id: this.parseId(s, i, o.id),
                  method: this.getRequestMethod(e),
                  query: o.query,
                  resourceUrl: o.resourceUrl,
                  url: n,
                  utils: this.requestInfoUtils,
                };
              let l;
              if (/commands\/?$/i.test(a.apiBase)) return this.commands(a);
              const u = this.bind(a.method);
              if (u) {
                const c = u(a);
                if (c) return c;
              }
              return this.db[i]
                ? this.createResponse$(() => this.collectionHandler(a))
                : this.config.passThruUnknownUrl
                ? this.getPassThruBackend().handle(e)
                : ((l = this.createErrorResponseOptions(
                    n,
                    404,
                    `Collection '${i}' not found`
                  )),
                  this.createResponse$(() => l));
            }
            addDelay(e) {
              const n = this.config.delay;
              return 0 === n
                ? e
                : (function $x(t, e) {
                    return new oe((n) => {
                      let r = !1,
                        o = !1;
                      const i = t.subscribe(
                        (s) => {
                          (o = !0),
                            setTimeout(() => {
                              n.next(s), r && n.complete();
                            }, e);
                        },
                        (s) => setTimeout(() => n.error(s), e),
                        () => {
                          (r = !0), o || n.complete();
                        }
                      );
                      return () => i.unsubscribe();
                    });
                  })(e, n || 500);
            }
            applyQuery(e, n) {
              const r = [],
                o = this.config.caseSensitiveSearch ? void 0 : "i";
              n.forEach((s, a) => {
                s.forEach((l) =>
                  r.push({ name: a, rx: new RegExp(decodeURI(l), o) })
                );
              });
              const i = r.length;
              return i
                ? e.filter((s) => {
                    let a = !0,
                      l = i;
                    for (; a && l; ) {
                      l -= 1;
                      const u = r[l];
                      a = u.rx.test(s[u.name]);
                    }
                    return a;
                  })
                : e;
            }
            bind(e) {
              const n = this.inMemDbService[e];
              return n ? n.bind(this.inMemDbService) : void 0;
            }
            bodify(e) {
              return this.config.dataEncapsulation ? { data: e } : e;
            }
            clone(e) {
              return JSON.parse(JSON.stringify(e));
            }
            collectionHandler(e) {
              let n;
              switch (e.method) {
                case "get":
                  n = this.get(e);
                  break;
                case "post":
                  n = this.post(e);
                  break;
                case "put":
                  n = this.put(e);
                  break;
                case "delete":
                  n = this.delete(e);
                  break;
                default:
                  n = this.createErrorResponseOptions(
                    e.url,
                    405,
                    "Method not allowed"
                  );
              }
              const r = this.bind("responseInterceptor");
              return r ? r(n, e) : n;
            }
            commands(e) {
              const n = e.collectionName.toLowerCase(),
                r = e.method;
              let o = { url: e.url };
              switch (n) {
                case "resetdb":
                  return (
                    (o.status = 204),
                    this.resetDb(e).pipe(
                      Nn(() => this.createResponse$(() => o, !1))
                    )
                  );
                case "config":
                  if ("get" === r)
                    (o.status = 200), (o.body = this.clone(this.config));
                  else {
                    const i = this.getJsonBody(e.req);
                    Object.assign(this.config, i),
                      (this.passThruBackend = void 0),
                      (o.status = 204);
                  }
                  break;
                default:
                  o = this.createErrorResponseOptions(
                    e.url,
                    500,
                    `Unknown command "${n}"`
                  );
              }
              return this.createResponse$(() => o, !1);
            }
            createErrorResponseOptions(e, n, r) {
              return {
                body: { error: `${r}` },
                url: e,
                headers: this.createHeaders({
                  "Content-Type": "application/json",
                }),
                status: n,
              };
            }
            createResponse$(e, n = !0) {
              const r = this.createResponseOptions$(e);
              let o = this.createResponse$fromResponseOptions$(r);
              return n ? this.addDelay(o) : o;
            }
            createResponseOptions$(e) {
              return new oe((n) => {
                let r;
                try {
                  r = e();
                } catch (i) {
                  r = this.createErrorResponseOptions(
                    "",
                    500,
                    `${i.message || i}`
                  );
                }
                const o = r.status;
                try {
                  r.statusText =
                    null != o
                      ? (function qx(t) {
                          return Gx[t + ""].text || "Unknown Status";
                        })(o)
                      : void 0;
                } catch (i) {}
                return (
                  null != o &&
                  (function zx(t) {
                    return t >= 200 && t < 300;
                  })(o)
                    ? (n.next(r), n.complete())
                    : n.error(r),
                  () => {}
                );
              });
            }
            delete({
              collection: e,
              collectionName: n,
              headers: r,
              id: o,
              url: i,
            }) {
              return null == o
                ? this.createErrorResponseOptions(i, 404, `Missing "${n}" id`)
                : {
                    headers: r,
                    status:
                      this.removeById(e, o) || !this.config.delete404
                        ? 204
                        : 404,
                  };
            }
            findById(e, n) {
              return e.find((r) => r.id === n);
            }
            genId(e, n) {
              const r = this.bind("genId");
              if (r) {
                const o = r(e, n);
                if (null != o) return o;
              }
              return this.genIdDefault(e, n);
            }
            genIdDefault(e, n) {
              if (!this.isCollectionIdNumeric(e, n))
                throw new Error(
                  `Collection '${n}' id type is non-numeric or unknown. Can only generate numeric ids.`
                );
              let r = 0;
              return (
                e.reduce((o, i) => {
                  r = Math.max(r, "number" == typeof i.id ? i.id : r);
                }, void 0),
                r + 1
              );
            }
            get({
              collection: e,
              collectionName: n,
              headers: r,
              id: o,
              query: i,
              url: s,
            }) {
              let a = e;
              return (
                null != o && "" !== o
                  ? (a = this.findById(e, o))
                  : i && (a = this.applyQuery(e, i)),
                a
                  ? {
                      body: this.bodify(this.clone(a)),
                      headers: r,
                      status: 200,
                    }
                  : this.createErrorResponseOptions(
                      s,
                      404,
                      `'${n}' with id='${o}' not found`
                    )
              );
            }
            getLocation(e) {
              if (!e.startsWith("http")) {
                const n = "undefined" == typeof document ? void 0 : document,
                  r = n
                    ? n.location.protocol + "//" + n.location.host
                    : "http://fake";
                e = e.startsWith("/") ? r + e : r + "/" + e;
              }
              return (function Qx(t) {
                const n =
                    /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(
                      t
                    ),
                  r = {
                    source: "",
                    protocol: "",
                    authority: "",
                    userInfo: "",
                    user: "",
                    password: "",
                    host: "",
                    port: "",
                    relative: "",
                    path: "",
                    directory: "",
                    file: "",
                    query: "",
                    anchor: "",
                  },
                  o = Object.keys(r);
                let i = o.length;
                for (; i--; ) r[o[i]] = (n && n[i]) || "";
                return r;
              })(e);
            }
            getPassThruBackend() {
              return this.passThruBackend
                ? this.passThruBackend
                : (this.passThruBackend = this.createPassThruBackend());
            }
            getRequestInfoUtils() {
              return {
                createResponse$: this.createResponse$.bind(this),
                findById: this.findById.bind(this),
                isCollectionIdNumeric: this.isCollectionIdNumeric.bind(this),
                getConfig: () => this.config,
                getDb: () => this.db,
                getJsonBody: this.getJsonBody.bind(this),
                getLocation: this.getLocation.bind(this),
                getPassThruBackend: this.getPassThruBackend.bind(this),
                parseRequestUrl: this.parseRequestUrl.bind(this),
              };
            }
            indexOf(e, n) {
              return e.findIndex((r) => r.id === n);
            }
            parseId(e, n, r) {
              if (!this.isCollectionIdNumeric(e, n)) return r;
              const o = parseFloat(r);
              return isNaN(o) ? r : o;
            }
            isCollectionIdNumeric(e, n) {
              return !(!e || !e[0]) && "number" == typeof e[0].id;
            }
            parseRequestUrl(e) {
              try {
                const n = this.getLocation(e);
                let r = (this.config.rootPath || "").length,
                  o = "";
                n.host !== this.config.host &&
                  ((r = 1), (o = n.protocol + "//" + n.host + "/"));
                const s = n.path.substring(r).split("/");
                let l,
                  a = 0;
                null == this.config.apiBase
                  ? (l = s[a++])
                  : ((l = (function Zx(t) {
                      return t.replace(/\/$/, "");
                    })(this.config.apiBase.trim())),
                    (a = l ? l.split("/").length : 0)),
                  (l += "/");
                let u = s[a++];
                return (
                  (u = u && u.split(".")[0]),
                  {
                    apiBase: l,
                    collectionName: u,
                    id: s[a++],
                    query: this.createQueryMap(n.query),
                    resourceUrl: o + l + u + "/",
                  }
                );
              } catch (n) {
                throw new Error(
                  `unable to parse url '${e}'; original error: ${n.message}`
                );
              }
            }
            post({
              collection: e,
              collectionName: n,
              headers: r,
              id: o,
              req: i,
              resourceUrl: s,
              url: a,
            }) {
              const l = this.clone(this.getJsonBody(i));
              if (null == l.id)
                try {
                  l.id = o || this.genId(e, n);
                } catch (d) {
                  const f = d.message || "";
                  return /id type is non-numeric/.test(f)
                    ? this.createErrorResponseOptions(a, 422, f)
                    : this.createErrorResponseOptions(
                        a,
                        500,
                        `Failed to generate new id for '${n}'`
                      );
                }
              if (o && o !== l.id)
                return this.createErrorResponseOptions(
                  a,
                  400,
                  "Request id does not match item.id"
                );
              const u = this.indexOf(e, (o = l.id)),
                c = this.bodify(l);
              return -1 === u
                ? (e.push(l),
                  r.set("Location", s + "/" + o),
                  { headers: r, body: c, status: 201 })
                : this.config.post409
                ? this.createErrorResponseOptions(
                    a,
                    409,
                    `'${n}' item with id='${o} exists and may not be updated with POST; use PUT instead.`
                  )
                : ((e[u] = l),
                  this.config.post204
                    ? { headers: r, status: 204 }
                    : { headers: r, body: c, status: 200 });
            }
            put({
              collection: e,
              collectionName: n,
              headers: r,
              id: o,
              req: i,
              url: s,
            }) {
              const a = this.clone(this.getJsonBody(i));
              if (null == a.id)
                return this.createErrorResponseOptions(
                  s,
                  404,
                  `Missing '${n}' id`
                );
              if (o && o !== a.id)
                return this.createErrorResponseOptions(
                  s,
                  400,
                  `Request for '${n}' id does not match item.id`
                );
              const l = this.indexOf(e, (o = a.id)),
                u = this.bodify(a);
              return l > -1
                ? ((e[l] = a),
                  this.config.put204
                    ? { headers: r, status: 204 }
                    : { headers: r, body: u, status: 200 })
                : this.config.put404
                ? this.createErrorResponseOptions(
                    s,
                    404,
                    `'${n}' item with id='${o} not found and may not be created with PUT; use POST instead.`
                  )
                : (e.push(a), { headers: r, body: u, status: 201 });
            }
            removeById(e, n) {
              const r = this.indexOf(e, n);
              return r > -1 && (e.splice(r, 1), !0);
            }
            resetDb(e) {
              this.dbReadySubject && this.dbReadySubject.next(!1);
              const n = this.inMemDbService.createDb(e);
              return (
                (n instanceof oe
                  ? n
                  : "function" == typeof n.then
                  ? Ce(n)
                  : O(n)
                )
                  .pipe(xn())
                  .subscribe((o) => {
                    (this.db = o),
                      this.dbReadySubject && this.dbReadySubject.next(!0);
                  }),
                this.dbReady
              );
            }
          } {
            constructor(n, r, o) {
              super(n, r), (this.xhrFactory = o);
            }
            handle(n) {
              try {
                return this.handleRequest(n);
              } catch (r) {
                const i = this.createErrorResponseOptions(
                  n.url,
                  500,
                  `${r.message || r}`
                );
                return this.createResponse$(() => i);
              }
            }
            getJsonBody(n) {
              return n.body;
            }
            getRequestMethod(n) {
              return (n.method || "get").toLowerCase();
            }
            createHeaders(n) {
              return new Kt(n);
            }
            createQueryMap(n) {
              const r = new Map();
              if (n) {
                const o = new mn({ fromString: n });
                o.keys().forEach((i) => r.set(i, o.getAll(i) || []));
              }
              return r;
            }
            createResponse$fromResponseOptions$(n) {
              return n.pipe(z((r) => new ri(r)));
            }
            createPassThruBackend() {
              try {
                return new Uc(this.xhrFactory);
              } catch (n) {
                throw (
                  ((n.message =
                    "Cannot create passThru404 backend; " + (n.message || "")),
                  n)
                );
              }
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(qc), w(Zs, 8), w($s));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })();
      function Yx(t, e, n) {
        return new Jx(t, e, n);
      }
      let Xx = (() => {
          class t {
            static forRoot(n, r) {
              return {
                ngModule: t,
                providers: [
                  { provide: qc, useClass: n },
                  { provide: Zs, useValue: r },
                  { provide: Vc, useFactory: Yx, deps: [qc, Zs, $s] },
                ],
              };
            }
            static forFeature(n, r) {
              return t.forRoot(n, r);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??mod = tt({ type: t })),
            (t.??inj = Qe({})),
            t
          );
        })(),
        zc = (() => {
          class t {
            constructor(n) {
              (this.httpClient = n),
                (this.url = "inMemoryDataService/transferencias"),
                (this.listaTransferencia = []);
            }
            get transferencias() {
              return this.listaTransferencia;
            }
            todas() {
              return this.httpClient.get(this.url);
            }
            adicionar(n) {
              return this.hidratar(n), this.httpClient.post(this.url, n);
            }
            hidratar(n) {
              n.data = new Date();
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(Wv));
            }),
            (t.??prov = x({ token: t, factory: t.??fac, providedIn: "root" })),
            t
          );
        })();
      const { isArray: eN } = Array,
        { getPrototypeOf: tN, prototype: nN, keys: rN } = Object;
      function Jv(t) {
        if (1 === t.length) {
          const e = t[0];
          if (eN(e)) return { args: e, keys: null };
          if (
            (function oN(t) {
              return t && "object" == typeof t && tN(t) === nN;
            })(e)
          ) {
            const n = rN(e);
            return { args: n.map((r) => e[r]), keys: n };
          }
        }
        return { args: t, keys: null };
      }
      const { isArray: iN } = Array;
      function Yv(t) {
        return z((e) =>
          (function sN(t, e) {
            return iN(e) ? t(...e) : t(e);
          })(t, e)
        );
      }
      function Xv(t, e) {
        return t.reduce((n, r, o) => ((n[r] = e[o]), n), {});
      }
      function e_(t, e, n) {
        t ? tn(n, t, e) : e();
      }
      function Ks(t, e) {
        const n = Y(t) ? t : () => t,
          r = (o) => o.error(n());
        return new oe(e ? (o) => e.schedule(r, 0, o) : r);
      }
      function Wc(...t) {
        return (function uN() {
          return oo(1);
        })()(Ce(t, io(t)));
      }
      function t_(t) {
        return new oe((e) => {
          Vt(t()).subscribe(e);
        });
      }
      function n_() {
        return Ie((t, e) => {
          let n = null;
          t._refCount++;
          const r = Ae(e, void 0, void 0, void 0, () => {
            if (!t || t._refCount <= 0 || 0 < --t._refCount)
              return void (n = null);
            const o = t._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              e.unsubscribe();
          });
          t.subscribe(r), r.closed || (n = t.connect());
        });
      }
      class cN extends oe {
        constructor(e, n) {
          super(),
            (this.source = e),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            tf(e) && (this.lift = e.lift);
        }
        _subscribe(e) {
          return this.getSubject().subscribe(e);
        }
        getSubject() {
          const e = this._subject;
          return (
            (!e || e.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: e } = this;
          (this._subject = this._connection = null),
            null == e || e.unsubscribe();
        }
        connect() {
          let e = this._connection;
          if (!e) {
            e = this._connection = new dt();
            const n = this.getSubject();
            e.add(
              this.source.subscribe(
                Ae(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              e.closed && ((this._connection = null), (e = dt.EMPTY));
          }
          return e;
        }
        refCount() {
          return n_()(this);
        }
      }
      function Xn(t, e) {
        return Ie((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            Ae(
              r,
              (l) => {
                null == o || o.unsubscribe();
                let u = 0;
                const c = i++;
                Vt(t(l, c)).subscribe(
                  (o = Ae(
                    r,
                    (d) => r.next(e ? e(l, d, c, u++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function fN(t, e, n, r, o) {
        return (i, s) => {
          let a = n,
            l = e,
            u = 0;
          i.subscribe(
            Ae(
              s,
              (c) => {
                const d = u++;
                (l = a ? t(l, c, d) : ((a = !0), c)), r && s.next(l);
              },
              o &&
                (() => {
                  a && s.next(l), s.complete();
                })
            )
          );
        };
      }
      function r_(t, e) {
        return Ie(fN(t, e, arguments.length >= 2, !0));
      }
      function On(t) {
        return Ie((e, n) => {
          let i,
            r = null,
            o = !1;
          (r = e.subscribe(
            Ae(n, void 0, void 0, (s) => {
              (i = Vt(t(s, On(t)(e)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function Qc(t) {
        return t <= 0
          ? () => nn
          : Ie((e, n) => {
              let r = [];
              e.subscribe(
                Ae(
                  n,
                  (o) => {
                    r.push(o), t < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function ut(t, e, n) {
        const r = Y(t) || e || n ? { next: t, error: e, complete: n } : t;
        return r
          ? Ie((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                Ae(
                  i,
                  (l) => {
                    var u;
                    null === (u = r.next) || void 0 === u || u.call(r, l),
                      i.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = r.complete) || void 0 === l || l.call(r),
                      i.complete();
                  },
                  (l) => {
                    var u;
                    (a = !1),
                      null === (u = r.error) || void 0 === u || u.call(r, l),
                      i.error(l);
                  },
                  () => {
                    var l, u;
                    a &&
                      (null === (l = r.unsubscribe) ||
                        void 0 === l ||
                        l.call(r)),
                      null === (u = r.finalize) || void 0 === u || u.call(r);
                  }
                )
              );
            })
          : jn;
      }
      class yn {
        constructor(e, n) {
          (this.id = e), (this.url = n);
        }
      }
      class Zc extends yn {
        constructor(e, n, r = "imperative", o = null) {
          super(e, n), (this.navigationTrigger = r), (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class oi extends yn {
        constructor(e, n, r) {
          super(e, n), (this.urlAfterRedirects = r);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class o_ extends yn {
        constructor(e, n, r) {
          super(e, n), (this.reason = r);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class gN extends yn {
        constructor(e, n, r) {
          super(e, n), (this.error = r);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class mN extends yn {
        constructor(e, n, r, o) {
          super(e, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class yN extends yn {
        constructor(e, n, r, o) {
          super(e, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class vN extends yn {
        constructor(e, n, r, o, i) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class _N extends yn {
        constructor(e, n, r, o) {
          super(e, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class DN extends yn {
        constructor(e, n, r, o) {
          super(e, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class i_ {
        constructor(e) {
          this.route = e;
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class s_ {
        constructor(e) {
          this.route = e;
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class CN {
        constructor(e) {
          this.snapshot = e;
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class EN {
        constructor(e) {
          this.snapshot = e;
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class wN {
        constructor(e) {
          this.snapshot = e;
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class bN {
        constructor(e) {
          this.snapshot = e;
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class a_ {
        constructor(e, n, r) {
          (this.routerEvent = e), (this.position = n), (this.anchor = r);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      const j = "primary";
      class MN {
        constructor(e) {
          this.params = e || {};
        }
        has(e) {
          return Object.prototype.hasOwnProperty.call(this.params, e);
        }
        get(e) {
          if (this.has(e)) {
            const n = this.params[e];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(e) {
          if (this.has(e)) {
            const n = this.params[e];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Jr(t) {
        return new MN(t);
      }
      const l_ = "ngNavigationCancelingError";
      function Kc(t) {
        const e = Error("NavigationCancelingError: " + t);
        return (e[l_] = !0), e;
      }
      function TN(t, e, n) {
        const r = n.path.split("/");
        if (
          r.length > t.length ||
          ("full" === n.pathMatch && (e.hasChildren() || r.length < t.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = t[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: t.slice(0, r.length), posParams: o };
      }
      function Jt(t, e) {
        const n = t ? Object.keys(t) : void 0,
          r = e ? Object.keys(e) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !u_(t[o], e[o]))) return !1;
        return !0;
      }
      function u_(t, e) {
        if (Array.isArray(t) && Array.isArray(e)) {
          if (t.length !== e.length) return !1;
          const n = [...t].sort(),
            r = [...e].sort();
          return n.every((o, i) => r[i] === o);
        }
        return t === e;
      }
      function c_(t) {
        return Array.prototype.concat.apply([], t);
      }
      function d_(t) {
        return t.length > 0 ? t[t.length - 1] : null;
      }
      function xe(t, e) {
        for (const n in t) t.hasOwnProperty(n) && e(t[n], n);
      }
      function Yt(t) {
        return Eu(t) ? t : Vo(t) ? Ce(Promise.resolve(t)) : O(t);
      }
      const RN = {
          exact: function p_(t, e, n) {
            if (
              !tr(t.segments, e.segments) ||
              !Js(t.segments, e.segments, n) ||
              t.numberOfChildren !== e.numberOfChildren
            )
              return !1;
            for (const r in e.children)
              if (!t.children[r] || !p_(t.children[r], e.children[r], n))
                return !1;
            return !0;
          },
          subset: g_,
        },
        f_ = {
          exact: function xN(t, e) {
            return Jt(t, e);
          },
          subset: function NN(t, e) {
            return (
              Object.keys(e).length <= Object.keys(t).length &&
              Object.keys(e).every((n) => u_(t[n], e[n]))
            );
          },
          ignored: () => !0,
        };
      function h_(t, e, n) {
        return (
          RN[n.paths](t.root, e.root, n.matrixParams) &&
          f_[n.queryParams](t.queryParams, e.queryParams) &&
          !("exact" === n.fragment && t.fragment !== e.fragment)
        );
      }
      function g_(t, e, n) {
        return m_(t, e, e.segments, n);
      }
      function m_(t, e, n, r) {
        if (t.segments.length > n.length) {
          const o = t.segments.slice(0, n.length);
          return !(!tr(o, n) || e.hasChildren() || !Js(o, n, r));
        }
        if (t.segments.length === n.length) {
          if (!tr(t.segments, n) || !Js(t.segments, n, r)) return !1;
          for (const o in e.children)
            if (!t.children[o] || !g_(t.children[o], e.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, t.segments.length),
            i = n.slice(t.segments.length);
          return (
            !!(tr(t.segments, o) && Js(t.segments, o, r) && t.children[j]) &&
            m_(t.children[j], e, i, r)
          );
        }
      }
      function Js(t, e, n) {
        return e.every((r, o) => f_[n](t[o].parameters, r.parameters));
      }
      class er {
        constructor(e, n, r) {
          (this.root = e), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Jr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return PN.serialize(this);
        }
      }
      class H {
        constructor(e, n) {
          (this.segments = e),
            (this.children = n),
            (this.parent = null),
            xe(n, (r, o) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Ys(this);
        }
      }
      class ii {
        constructor(e, n) {
          (this.path = e), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = Jr(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return C_(this);
        }
      }
      function tr(t, e) {
        return t.length === e.length && t.every((n, r) => n.path === e[r].path);
      }
      class y_ {}
      class v_ {
        parse(e) {
          const n = new GN(e);
          return new er(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(e) {
          const n = `/${si(e.root, !0)}`,
            r = (function LN(t) {
              const e = Object.keys(t)
                .map((n) => {
                  const r = t[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${Xs(n)}=${Xs(o)}`).join("&")
                    : `${Xs(n)}=${Xs(r)}`;
                })
                .filter((n) => !!n);
              return e.length ? `?${e.join("&")}` : "";
            })(e.queryParams);
          return `${n}${r}${
            "string" == typeof e.fragment
              ? `#${(function kN(t) {
                  return encodeURI(t);
                })(e.fragment)}`
              : ""
          }`;
        }
      }
      const PN = new v_();
      function Ys(t) {
        return t.segments.map((e) => C_(e)).join("/");
      }
      function si(t, e) {
        if (!t.hasChildren()) return Ys(t);
        if (e) {
          const n = t.children[j] ? si(t.children[j], !1) : "",
            r = [];
          return (
            xe(t.children, (o, i) => {
              i !== j && r.push(`${i}:${si(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function FN(t, e) {
            let n = [];
            return (
              xe(t.children, (r, o) => {
                o === j && (n = n.concat(e(r, o)));
              }),
              xe(t.children, (r, o) => {
                o !== j && (n = n.concat(e(r, o)));
              }),
              n
            );
          })(t, (r, o) =>
            o === j ? [si(t.children[j], !1)] : [`${o}:${si(r, !1)}`]
          );
          return 1 === Object.keys(t.children).length && null != t.children[j]
            ? `${Ys(t)}/${n[0]}`
            : `${Ys(t)}/(${n.join("//")})`;
        }
      }
      function __(t) {
        return encodeURIComponent(t)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function Xs(t) {
        return __(t).replace(/%3B/gi, ";");
      }
      function Jc(t) {
        return __(t)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function ea(t) {
        return decodeURIComponent(t);
      }
      function D_(t) {
        return ea(t.replace(/\+/g, "%20"));
      }
      function C_(t) {
        return `${Jc(t.path)}${(function VN(t) {
          return Object.keys(t)
            .map((e) => `;${Jc(e)}=${Jc(t[e])}`)
            .join("");
        })(t.parameters)}`;
      }
      const BN = /^[^\/()?;=#]+/;
      function ta(t) {
        const e = t.match(BN);
        return e ? e[0] : "";
      }
      const jN = /^[^=?&#]+/,
        HN = /^[^&#]+/;
      class GN {
        constructor(e) {
          (this.url = e), (this.remaining = e);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new H([], {})
              : new H([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const e = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(e);
            } while (this.consumeOptional("&"));
          return e;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const e = [];
          for (
            this.peekStartsWith("(") || e.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), e.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (e.length > 0 || Object.keys(n).length > 0) && (r[j] = new H(e, n)),
            r
          );
        }
        parseSegment() {
          const e = ta(this.remaining);
          if ("" === e && this.peekStartsWith(";"))
            throw new Error(
              `Empty path url segment cannot have parameters: '${this.remaining}'.`
            );
          return this.capture(e), new ii(ea(e), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const e = {};
          for (; this.consumeOptional(";"); ) this.parseParam(e);
          return e;
        }
        parseParam(e) {
          const n = ta(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = ta(this.remaining);
            o && ((r = o), this.capture(r));
          }
          e[ea(n)] = ea(r);
        }
        parseQueryParam(e) {
          const n = (function UN(t) {
            const e = t.match(jN);
            return e ? e[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function $N(t) {
              const e = t.match(HN);
              return e ? e[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = D_(n),
            i = D_(r);
          if (e.hasOwnProperty(o)) {
            let s = e[o];
            Array.isArray(s) || ((s = [s]), (e[o] = s)), s.push(i);
          } else e[o] = i;
        }
        parseParens(e) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = ta(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o)
              throw new Error(`Cannot parse url '${this.url}'`);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.substr(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : e && (i = j);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[j] : new H([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(e) {
          return this.remaining.startsWith(e);
        }
        consumeOptional(e) {
          return (
            !!this.peekStartsWith(e) &&
            ((this.remaining = this.remaining.substring(e.length)), !0)
          );
        }
        capture(e) {
          if (!this.consumeOptional(e)) throw new Error(`Expected "${e}".`);
        }
      }
      class E_ {
        constructor(e) {
          this._root = e;
        }
        get root() {
          return this._root.value;
        }
        parent(e) {
          const n = this.pathFromRoot(e);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(e) {
          const n = Yc(e, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(e) {
          const n = Yc(e, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(e) {
          const n = Xc(e, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== e);
        }
        pathFromRoot(e) {
          return Xc(e, this._root).map((n) => n.value);
        }
      }
      function Yc(t, e) {
        if (t === e.value) return e;
        for (const n of e.children) {
          const r = Yc(t, n);
          if (r) return r;
        }
        return null;
      }
      function Xc(t, e) {
        if (t === e.value) return [e];
        for (const n of e.children) {
          const r = Xc(t, n);
          if (r.length) return r.unshift(e), r;
        }
        return [];
      }
      class vn {
        constructor(e, n) {
          (this.value = e), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Yr(t) {
        const e = {};
        return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
      }
      class w_ extends E_ {
        constructor(e, n) {
          super(e), (this.snapshot = n), ed(this, e);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function b_(t, e) {
        const n = (function qN(t, e) {
            const s = new na([], {}, {}, "", {}, j, e, null, t.root, -1, {});
            return new A_("", new vn(s, []));
          })(t, e),
          r = new Ct([new ii("", {})]),
          o = new Ct({}),
          i = new Ct({}),
          s = new Ct({}),
          a = new Ct(""),
          l = new Xr(r, o, s, a, i, j, e, n.root);
        return (l.snapshot = n.root), new w_(new vn(l, []), n);
      }
      class Xr {
        constructor(e, n, r, o, i, s, a, l) {
          (this.url = e),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(z((e) => Jr(e)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(z((e) => Jr(e)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function M_(t, e = "emptyOnly") {
        const n = t.pathFromRoot;
        let r = 0;
        if ("always" !== e)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function zN(t) {
          return t.reduce(
            (e, n) => ({
              params: Object.assign(Object.assign({}, e.params), n.params),
              data: Object.assign(Object.assign({}, e.data), n.data),
              resolve: Object.assign(
                Object.assign({}, e.resolve),
                n._resolvedData
              ),
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class na {
        constructor(e, n, r, o, i, s, a, l, u, c, d) {
          (this.url = e),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._urlSegment = u),
            (this._lastPathIndex = c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = Jr(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Jr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class A_ extends E_ {
        constructor(e, n) {
          super(n), (this.url = e), ed(this, n);
        }
        toString() {
          return T_(this._root);
        }
      }
      function ed(t, e) {
        (e.value._routerState = t), e.children.forEach((n) => ed(t, n));
      }
      function T_(t) {
        const e =
          t.children.length > 0 ? ` { ${t.children.map(T_).join(", ")} } ` : "";
        return `${t.value}${e}`;
      }
      function td(t) {
        if (t.snapshot) {
          const e = t.snapshot,
            n = t._futureSnapshot;
          (t.snapshot = n),
            Jt(e.queryParams, n.queryParams) ||
              t.queryParams.next(n.queryParams),
            e.fragment !== n.fragment && t.fragment.next(n.fragment),
            Jt(e.params, n.params) || t.params.next(n.params),
            (function SN(t, e) {
              if (t.length !== e.length) return !1;
              for (let n = 0; n < t.length; ++n) if (!Jt(t[n], e[n])) return !1;
              return !0;
            })(e.url, n.url) || t.url.next(n.url),
            Jt(e.data, n.data) || t.data.next(n.data);
        } else
          (t.snapshot = t._futureSnapshot), t.data.next(t._futureSnapshot.data);
      }
      function nd(t, e) {
        const n =
          Jt(t.params, e.params) &&
          (function ON(t, e) {
            return (
              tr(t, e) && t.every((n, r) => Jt(n.parameters, e[r].parameters))
            );
          })(t.url, e.url);
        return (
          n &&
          !(!t.parent != !e.parent) &&
          (!t.parent || nd(t.parent, e.parent))
        );
      }
      function ai(t, e, n) {
        if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = e.value;
          const o = (function QN(t, e, n) {
            return e.children.map((r) => {
              for (const o of n.children)
                if (t.shouldReuseRoute(r.value, o.value.snapshot))
                  return ai(t, r, o);
              return ai(t, r);
            });
          })(t, e, n);
          return new vn(r, o);
        }
        {
          if (t.shouldAttach(e.value)) {
            const i = t.retrieve(e.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = e.value),
                (s.children = e.children.map((a) => ai(t, a))),
                s
              );
            }
          }
          const r = (function ZN(t) {
              return new Xr(
                new Ct(t.url),
                new Ct(t.params),
                new Ct(t.queryParams),
                new Ct(t.fragment),
                new Ct(t.data),
                t.outlet,
                t.component,
                t
              );
            })(e.value),
            o = e.children.map((i) => ai(t, i));
          return new vn(r, o);
        }
      }
      function ra(t) {
        return (
          "object" == typeof t && null != t && !t.outlets && !t.segmentPath
        );
      }
      function li(t) {
        return "object" == typeof t && null != t && t.outlets;
      }
      function rd(t, e, n, r, o) {
        let i = {};
        if (
          (r &&
            xe(r, (a, l) => {
              i[l] = Array.isArray(a) ? a.map((u) => `${u}`) : `${a}`;
            }),
          t === e)
        )
          return new er(n, i, o);
        const s = S_(t, e, n);
        return new er(s, i, o);
      }
      function S_(t, e, n) {
        const r = {};
        return (
          xe(t.children, (o, i) => {
            r[i] = o === e ? n : S_(o, e, n);
          }),
          new H(t.segments, r)
        );
      }
      class I_ {
        constructor(e, n, r) {
          if (
            ((this.isAbsolute = e),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            e && r.length > 0 && ra(r[0]))
          )
            throw new Error("Root segment cannot have matrix parameters");
          const o = r.find(li);
          if (o && o !== d_(r))
            throw new Error("{outlets:{}} has to be the last command");
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class od {
        constructor(e, n, r) {
          (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
        }
      }
      function R_(t, e, n) {
        if (
          (t || (t = new H([], {})), 0 === t.segments.length && t.hasChildren())
        )
          return oa(t, e, n);
        const r = (function tO(t, e, n) {
            let r = 0,
              o = e;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < t.segments.length; ) {
              if (r >= n.length) return i;
              const s = t.segments[o],
                a = n[r];
              if (li(a)) break;
              const l = `${a}`,
                u = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!N_(l, u, s)) return i;
                r += 2;
              } else {
                if (!N_(l, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(t, e, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < t.segments.length) {
          const i = new H(t.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[j] = new H(t.segments.slice(r.pathIndex), t.children)),
            oa(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new H(t.segments, {})
          : r.match && !t.hasChildren()
          ? id(t, e, n)
          : r.match
          ? oa(t, 0, o)
          : id(t, e, n);
      }
      function oa(t, e, n) {
        if (0 === n.length) return new H(t.segments, {});
        {
          const r = (function eO(t) {
              return li(t[0]) ? t[0].outlets : { [j]: t };
            })(n),
            o = {};
          return (
            xe(r, (i, s) => {
              "string" == typeof i && (i = [i]),
                null !== i && (o[s] = R_(t.children[s], e, i));
            }),
            xe(t.children, (i, s) => {
              void 0 === r[s] && (o[s] = i);
            }),
            new H(t.segments, o)
          );
        }
      }
      function id(t, e, n) {
        const r = t.segments.slice(0, e);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (li(i)) {
            const l = nO(i.outlets);
            return new H(r, l);
          }
          if (0 === o && ra(n[0])) {
            r.push(new ii(t.segments[e].path, x_(n[0]))), o++;
            continue;
          }
          const s = li(i) ? i.outlets[j] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && ra(a)
            ? (r.push(new ii(s, x_(a))), (o += 2))
            : (r.push(new ii(s, {})), o++);
        }
        return new H(r, {});
      }
      function nO(t) {
        const e = {};
        return (
          xe(t, (n, r) => {
            "string" == typeof n && (n = [n]),
              null !== n && (e[r] = id(new H([], {}), 0, n));
          }),
          e
        );
      }
      function x_(t) {
        const e = {};
        return xe(t, (n, r) => (e[r] = `${n}`)), e;
      }
      function N_(t, e, n) {
        return t == n.path && Jt(e, n.parameters);
      }
      class oO {
        constructor(e, n, r, o) {
          (this.routeReuseStrategy = e),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o);
        }
        activate(e) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, e),
            td(this.futureState.root),
            this.activateChildRoutes(n, r, e);
        }
        deactivateChildRoutes(e, n, r) {
          const o = Yr(n);
          e.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            xe(o, (i, s) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(e, n, r) {
          const o = e.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(e, n, s.children);
            } else this.deactivateChildRoutes(e, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(e, n) {
          e.value.component &&
          this.routeReuseStrategy.shouldDetach(e.value.snapshot)
            ? this.detachAndStoreRouteSubtree(e, n)
            : this.deactivateRouteAndOutlet(e, n);
        }
        detachAndStoreRouteSubtree(e, n) {
          const r = n.getContext(e.value.outlet),
            o = r && e.value.component ? r.children : n,
            i = Yr(e);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(e.value.snapshot, {
              componentRef: s,
              route: e,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(e, n) {
          const r = n.getContext(e.value.outlet),
            o = r && e.value.component ? r.children : n,
            i = Yr(e);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(e, n, r) {
          const o = Yr(n);
          e.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new bN(i.value.snapshot));
          }),
            e.children.length && this.forwardEvent(new EN(e.value.snapshot));
        }
        activateRoutes(e, n, r) {
          const o = e.value,
            i = n ? n.value : null;
          if ((td(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(e, n, s.children);
            } else this.activateChildRoutes(e, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                td(a.route.value),
                this.activateChildRoutes(e, null, s.children);
            } else {
              const a = (function iO(t) {
                  for (let e = t.parent; e; e = e.parent) {
                    const n = e.routeConfig;
                    if (n && n._loadedConfig) return n._loadedConfig;
                    if (n && n.component) return null;
                  }
                  return null;
                })(o.snapshot),
                l = a ? a.module.componentFactoryResolver : null;
              (s.attachRef = null),
                (s.route = o),
                (s.resolver = l),
                s.outlet && s.outlet.activateWith(o, l),
                this.activateChildRoutes(e, null, s.children);
            }
          } else this.activateChildRoutes(e, null, r);
        }
      }
      class sd {
        constructor(e, n) {
          (this.routes = e), (this.module = n);
        }
      }
      function Fn(t) {
        return "function" == typeof t;
      }
      function nr(t) {
        return t instanceof er;
      }
      const ui = Symbol("INITIAL_VALUE");
      function ci() {
        return Xn((t) =>
          (function aN(...t) {
            const e = io(t),
              n = mf(t),
              { args: r, keys: o } = Jv(t);
            if (0 === r.length) return Ce([], e);
            const i = new oe(
              (function lN(t, e, n = jn) {
                return (r) => {
                  e_(
                    e,
                    () => {
                      const { length: o } = t,
                        i = new Array(o);
                      let s = o,
                        a = o;
                      for (let l = 0; l < o; l++)
                        e_(
                          e,
                          () => {
                            const u = Ce(t[l], e);
                            let c = !1;
                            u.subscribe(
                              Ae(
                                r,
                                (d) => {
                                  (i[l] = d),
                                    c || ((c = !0), a--),
                                    a || r.next(n(i.slice()));
                                },
                                () => {
                                  --s || r.complete();
                                }
                              )
                            );
                          },
                          r
                        );
                    },
                    r
                  );
                };
              })(r, e, o ? (s) => Xv(o, s) : jn)
            );
            return n ? i.pipe(Yv(n)) : i;
          })(
            t.map((e) =>
              e.pipe(
                bi(1),
                (function dN(...t) {
                  const e = io(t);
                  return Ie((n, r) => {
                    (e ? Wc(t, n, e) : Wc(t, n)).subscribe(r);
                  });
                })(ui)
              )
            )
          ).pipe(
            r_((e, n) => {
              let r = !1;
              return n.reduce(
                (o, i, s) =>
                  o !== ui
                    ? o
                    : (i === ui && (r = !0),
                      r || (!1 !== i && s !== n.length - 1 && !nr(i)) ? o : i),
                e
              );
            }, ui),
            Yn((e) => e !== ui),
            z((e) => (nr(e) ? e : !0 === e)),
            bi(1)
          )
        );
      }
      class dO {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.children = new di()),
            (this.attachRef = null);
        }
      }
      class di {
        constructor() {
          this.contexts = new Map();
        }
        onChildOutletCreated(e, n) {
          const r = this.getOrCreateContext(e);
          (r.outlet = n), this.contexts.set(e, r);
        }
        onChildOutletDestroyed(e) {
          const n = this.getContext(e);
          n && ((n.outlet = null), (n.attachRef = null));
        }
        onOutletDeactivated() {
          const e = this.contexts;
          return (this.contexts = new Map()), e;
        }
        onOutletReAttached(e) {
          this.contexts = e;
        }
        getOrCreateContext(e) {
          let n = this.getContext(e);
          return n || ((n = new dO()), this.contexts.set(e, n)), n;
        }
        getContext(e) {
          return this.contexts.get(e) || null;
        }
      }
      let ad = (() => {
        class t {
          constructor(n, r, o, i, s) {
            (this.parentContexts = n),
              (this.location = r),
              (this.resolver = o),
              (this.changeDetector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new le()),
              (this.deactivateEvents = new le()),
              (this.attachEvents = new le()),
              (this.detachEvents = new le()),
              (this.name = i || j),
              n.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const n = this.parentContexts.getContext(this.name);
              n &&
                n.route &&
                (n.attachRef
                  ? this.attach(n.attachRef, n.route)
                  : this.activateWith(n.route, n.resolver || null));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new Error("Outlet is not activated");
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated)
              throw new Error("Cannot activate an already activated outlet");
            this._activatedRoute = n;
            const s = (r = r || this.resolver).resolveComponentFactory(
                n._futureSnapshot.routeConfig.component
              ),
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new fO(n, a, this.location.injector);
            (this.activated = this.location.createComponent(
              s,
              this.location.length,
              l
            )),
              this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(_(di), _(Ot), _(Go), mo("name"), _(Is));
          }),
          (t.??dir = T({
            type: t,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
          })),
          t
        );
      })();
      class fO {
        constructor(e, n, r) {
          (this.route = e), (this.childContexts = n), (this.parent = r);
        }
        get(e, n) {
          return e === Xr
            ? this.route
            : e === di
            ? this.childContexts
            : this.parent.get(e, n);
        }
      }
      let O_ = (() => {
        class t {}
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??cmp = lr({
            type: t,
            selectors: [["ng-component"]],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && gs(0, "router-outlet");
            },
            directives: [ad],
            encapsulation: 2,
          })),
          t
        );
      })();
      function F_(t, e = "") {
        for (let n = 0; n < t.length; n++) {
          const r = t[n];
          hO(r, pO(e, r));
        }
      }
      function hO(t, e) {
        t.children && F_(t.children, e);
      }
      function pO(t, e) {
        return e
          ? t || e.path
            ? t && !e.path
              ? `${t}/`
              : !t && e.path
              ? e.path
              : `${t}/${e.path}`
            : ""
          : t;
      }
      function ld(t) {
        const e = t.children && t.children.map(ld),
          n = e
            ? Object.assign(Object.assign({}, t), { children: e })
            : Object.assign({}, t);
        return (
          !n.component &&
            (e || n.loadChildren) &&
            n.outlet &&
            n.outlet !== j &&
            (n.component = O_),
          n
        );
      }
      function Et(t) {
        return t.outlet || j;
      }
      function P_(t, e) {
        const n = t.filter((r) => Et(r) === e);
        return n.push(...t.filter((r) => Et(r) !== e)), n;
      }
      const k_ = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function ia(t, e, n) {
        var r;
        if ("" === e.path)
          return "full" === e.pathMatch && (t.hasChildren() || n.length > 0)
            ? Object.assign({}, k_)
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (e.matcher || TN)(n, t, e);
        if (!i) return Object.assign({}, k_);
        const s = {};
        xe(i.posParams, (l, u) => {
          s[u] = l.path;
        });
        const a =
          i.consumed.length > 0
            ? Object.assign(
                Object.assign({}, s),
                i.consumed[i.consumed.length - 1].parameters
              )
            : s;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: n.slice(i.consumed.length),
          parameters: a,
          positionalParamSegments:
            null !== (r = i.posParams) && void 0 !== r ? r : {},
        };
      }
      function sa(t, e, n, r, o = "corrected") {
        if (
          n.length > 0 &&
          (function yO(t, e, n) {
            return n.some((r) => aa(t, e, r) && Et(r) !== j);
          })(t, n, r)
        ) {
          const s = new H(
            e,
            (function mO(t, e, n, r) {
              const o = {};
              (o[j] = r),
                (r._sourceSegment = t),
                (r._segmentIndexShift = e.length);
              for (const i of n)
                if ("" === i.path && Et(i) !== j) {
                  const s = new H([], {});
                  (s._sourceSegment = t),
                    (s._segmentIndexShift = e.length),
                    (o[Et(i)] = s);
                }
              return o;
            })(t, e, r, new H(n, t.children))
          );
          return (
            (s._sourceSegment = t),
            (s._segmentIndexShift = e.length),
            { segmentGroup: s, slicedSegments: [] }
          );
        }
        if (
          0 === n.length &&
          (function vO(t, e, n) {
            return n.some((r) => aa(t, e, r));
          })(t, n, r)
        ) {
          const s = new H(
            t.segments,
            (function gO(t, e, n, r, o, i) {
              const s = {};
              for (const a of r)
                if (aa(t, n, a) && !o[Et(a)]) {
                  const l = new H([], {});
                  (l._sourceSegment = t),
                    (l._segmentIndexShift =
                      "legacy" === i ? t.segments.length : e.length),
                    (s[Et(a)] = l);
                }
              return Object.assign(Object.assign({}, o), s);
            })(t, e, n, r, t.children, o)
          );
          return (
            (s._sourceSegment = t),
            (s._segmentIndexShift = e.length),
            { segmentGroup: s, slicedSegments: n }
          );
        }
        const i = new H(t.segments, t.children);
        return (
          (i._sourceSegment = t),
          (i._segmentIndexShift = e.length),
          { segmentGroup: i, slicedSegments: n }
        );
      }
      function aa(t, e, n) {
        return (
          (!(t.hasChildren() || e.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      function V_(t, e, n, r) {
        return (
          !!(Et(t) === r || (r !== j && aa(e, n, t))) &&
          ("**" === t.path || ia(e, t, n).matched)
        );
      }
      function L_(t, e, n) {
        return 0 === e.length && !t.children[n];
      }
      class la {
        constructor(e) {
          this.segmentGroup = e || null;
        }
      }
      class B_ {
        constructor(e) {
          this.urlTree = e;
        }
      }
      function fi(t) {
        return Ks(new la(t));
      }
      function j_(t) {
        return Ks(new B_(t));
      }
      class EO {
        constructor(e, n, r, o, i) {
          (this.configLoader = n),
            (this.urlSerializer = r),
            (this.urlTree = o),
            (this.config = i),
            (this.allowRedirects = !0),
            (this.ngModule = e.get(dn));
        }
        apply() {
          const e = sa(this.urlTree.root, [], [], this.config).segmentGroup,
            n = new H(e.segments, e.children);
          return this.expandSegmentGroup(this.ngModule, this.config, n, j)
            .pipe(
              z((i) =>
                this.createUrlTree(
                  ud(i),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              On((i) => {
                if (i instanceof B_)
                  return (this.allowRedirects = !1), this.match(i.urlTree);
                throw i instanceof la ? this.noMatchError(i) : i;
              })
            );
        }
        match(e) {
          return this.expandSegmentGroup(this.ngModule, this.config, e.root, j)
            .pipe(
              z((o) => this.createUrlTree(ud(o), e.queryParams, e.fragment))
            )
            .pipe(
              On((o) => {
                throw o instanceof la ? this.noMatchError(o) : o;
              })
            );
        }
        noMatchError(e) {
          return new Error(
            `Cannot match any routes. URL Segment: '${e.segmentGroup}'`
          );
        }
        createUrlTree(e, n, r) {
          const o = e.segments.length > 0 ? new H([], { [j]: e }) : e;
          return new er(o, n, r);
        }
        expandSegmentGroup(e, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(e, n, r).pipe(z((i) => new H([], i)))
            : this.expandSegment(e, r, n, r.segments, o, !0);
        }
        expandChildren(e, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return Ce(o).pipe(
            Nn((i) => {
              const s = r.children[i],
                a = P_(n, i);
              return this.expandSegmentGroup(e, a, s, i).pipe(
                z((l) => ({ segment: l, outlet: i }))
              );
            }),
            r_((i, s) => ((i[s.outlet] = s.segment), i), {}),
            (function hN(t, e) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  t ? Yn((o, i) => t(o, i, r)) : jn,
                  Qc(1),
                  n ? Lv(e) : Bv(() => new Qs())
                );
            })()
          );
        }
        expandSegment(e, n, r, o, i, s) {
          return Ce(r).pipe(
            Nn((a) =>
              this.expandSegmentAgainstRoute(e, n, r, a, o, i, s).pipe(
                On((u) => {
                  if (u instanceof la) return O(null);
                  throw u;
                })
              )
            ),
            xn((a) => !!a),
            On((a, l) => {
              if (a instanceof Qs || "EmptyError" === a.name)
                return L_(n, o, i) ? O(new H([], {})) : fi(n);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(e, n, r, o, i, s, a) {
          return V_(o, n, i, s)
            ? void 0 === o.redirectTo
              ? this.matchSegmentAgainstRoute(e, n, o, i, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(e, n, r, o, i, s)
              : fi(n)
            : fi(n);
        }
        expandSegmentAgainstRouteUsingRedirect(e, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(e, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                e,
                n,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(e, n, r, o) {
          const i = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? j_(i)
            : this.lineralizeSegments(r, i).pipe(
                Te((s) => {
                  const a = new H(s, {});
                  return this.expandSegment(e, a, n, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(e, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: u,
            positionalParamSegments: c,
          } = ia(n, o, i);
          if (!a) return fi(n);
          const d = this.applyRedirectCommands(l, o.redirectTo, c);
          return o.redirectTo.startsWith("/")
            ? j_(d)
            : this.lineralizeSegments(o, d).pipe(
                Te((f) => this.expandSegment(e, n, r, f.concat(u), s, !1))
              );
        }
        matchSegmentAgainstRoute(e, n, r, o, i) {
          if ("**" === r.path)
            return r.loadChildren
              ? (r._loadedConfig
                  ? O(r._loadedConfig)
                  : this.configLoader.load(e.injector, r)
                ).pipe(z((d) => ((r._loadedConfig = d), new H(o, {}))))
              : O(new H(o, {}));
          const {
            matched: s,
            consumedSegments: a,
            remainingSegments: l,
          } = ia(n, r, o);
          return s
            ? this.getChildConfig(e, r, o).pipe(
                Te((c) => {
                  const d = c.module,
                    f = c.routes,
                    { segmentGroup: h, slicedSegments: p } = sa(n, a, l, f),
                    m = new H(h.segments, h.children);
                  if (0 === p.length && m.hasChildren())
                    return this.expandChildren(d, f, m).pipe(
                      z((b) => new H(a, b))
                    );
                  if (0 === f.length && 0 === p.length) return O(new H(a, {}));
                  const D = Et(r) === i;
                  return this.expandSegment(d, m, f, p, D ? j : i, !0).pipe(
                    z((g) => new H(a.concat(g.segments), g.children))
                  );
                })
              )
            : fi(n);
        }
        getChildConfig(e, n, r) {
          return n.children
            ? O(new sd(n.children, e))
            : n.loadChildren
            ? void 0 !== n._loadedConfig
              ? O(n._loadedConfig)
              : this.runCanLoadGuards(e.injector, n, r).pipe(
                  Te((o) =>
                    o
                      ? this.configLoader
                          .load(e.injector, n)
                          .pipe(z((i) => ((n._loadedConfig = i), i)))
                      : (function DO(t) {
                          return Ks(
                            Kc(
                              `Cannot load children because the guard of the route "path: '${t.path}'" returned false`
                            )
                          );
                        })(n)
                  )
                )
            : O(new sd([], e));
        }
        runCanLoadGuards(e, n, r) {
          const o = n.canLoad;
          return o && 0 !== o.length
            ? O(
                o.map((s) => {
                  const a = e.get(s);
                  let l;
                  if (
                    (function aO(t) {
                      return t && Fn(t.canLoad);
                    })(a)
                  )
                    l = a.canLoad(n, r);
                  else {
                    if (!Fn(a)) throw new Error("Invalid CanLoad guard");
                    l = a(n, r);
                  }
                  return Yt(l);
                })
              ).pipe(
                ci(),
                ut((s) => {
                  if (!nr(s)) return;
                  const a = Kc(
                    `Redirecting to "${this.urlSerializer.serialize(s)}"`
                  );
                  throw ((a.url = s), a);
                }),
                z((s) => !0 === s)
              )
            : O(!0);
        }
        lineralizeSegments(e, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return O(r);
            if (o.numberOfChildren > 1 || !o.children[j])
              return Ks(
                new Error(
                  `Only absolute redirects can have named outlets. redirectTo: '${e.redirectTo}'`
                )
              );
            o = o.children[j];
          }
        }
        applyRedirectCommands(e, n, r) {
          return this.applyRedirectCreatreUrlTree(
            n,
            this.urlSerializer.parse(n),
            e,
            r
          );
        }
        applyRedirectCreatreUrlTree(e, n, r, o) {
          const i = this.createSegmentGroup(e, n.root, r, o);
          return new er(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(e, n) {
          const r = {};
          return (
            xe(e, (o, i) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(e, n, r, o) {
          const i = this.createSegments(e, n.segments, r, o);
          let s = {};
          return (
            xe(n.children, (a, l) => {
              s[l] = this.createSegmentGroup(e, a, r, o);
            }),
            new H(i, s)
          );
        }
        createSegments(e, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(e, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(e, n, r) {
          const o = r[n.path.substring(1)];
          if (!o)
            throw new Error(
              `Cannot redirect to '${e}'. Cannot find '${n.path}'.`
            );
          return o;
        }
        findOrReturn(e, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === e.path) return n.splice(r), o;
            r++;
          }
          return e;
        }
      }
      function ud(t) {
        const e = {};
        for (const r of Object.keys(t.children)) {
          const i = ud(t.children[r]);
          (i.segments.length > 0 || i.hasChildren()) && (e[r] = i);
        }
        return (function wO(t) {
          if (1 === t.numberOfChildren && t.children[j]) {
            const e = t.children[j];
            return new H(t.segments.concat(e.segments), e.children);
          }
          return t;
        })(new H(t.segments, e));
      }
      class U_ {
        constructor(e) {
          (this.path = e), (this.route = this.path[this.path.length - 1]);
        }
      }
      class ua {
        constructor(e, n) {
          (this.component = e), (this.route = n);
        }
      }
      function MO(t, e, n) {
        const r = t._root;
        return hi(r, e ? e._root : null, n, [r.value]);
      }
      function ca(t, e, n) {
        const r = (function TO(t) {
          if (!t) return null;
          for (let e = t.parent; e; e = e.parent) {
            const n = e.routeConfig;
            if (n && n._loadedConfig) return n._loadedConfig;
          }
          return null;
        })(e);
        return (r ? r.module.injector : n).get(t);
      }
      function hi(
        t,
        e,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = Yr(e);
        return (
          t.children.forEach((s) => {
            (function SO(
              t,
              e,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = t.value,
                s = e ? e.value : null,
                a = n ? n.getContext(t.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const l = (function IO(t, e, n) {
                  if ("function" == typeof n) return n(t, e);
                  switch (n) {
                    case "pathParamsChange":
                      return !tr(t.url, e.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !tr(t.url, e.url) || !Jt(t.queryParams, e.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !nd(t, e) || !Jt(t.queryParams, e.queryParams);
                    default:
                      return !nd(t, e);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                l
                  ? o.canActivateChecks.push(new U_(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  hi(t, e, i.component ? (a ? a.children : null) : n, r, o),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new ua(a.outlet.component, s));
              } else
                s && pi(e, a, o),
                  o.canActivateChecks.push(new U_(r)),
                  hi(t, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          xe(i, (s, a) => pi(s, n.getContext(a), o)),
          o
        );
      }
      function pi(t, e, n) {
        const r = Yr(t),
          o = t.value;
        xe(r, (i, s) => {
          pi(i, o.component ? (e ? e.children.getContext(s) : null) : e, n);
        }),
          n.canDeactivateChecks.push(
            new ua(
              o.component && e && e.outlet && e.outlet.isActivated
                ? e.outlet.component
                : null,
              o
            )
          );
      }
      class LO {}
      function H_(t) {
        return new oe((e) => e.error(t));
      }
      class jO {
        constructor(e, n, r, o, i, s) {
          (this.rootComponentType = e),
            (this.config = n),
            (this.urlTree = r),
            (this.url = o),
            (this.paramsInheritanceStrategy = i),
            (this.relativeLinkResolution = s);
        }
        recognize() {
          const e = sa(
              this.urlTree.root,
              [],
              [],
              this.config.filter((s) => void 0 === s.redirectTo),
              this.relativeLinkResolution
            ).segmentGroup,
            n = this.processSegmentGroup(this.config, e, j);
          if (null === n) return null;
          const r = new na(
              [],
              Object.freeze({}),
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              j,
              this.rootComponentType,
              null,
              this.urlTree.root,
              -1,
              {}
            ),
            o = new vn(r, n),
            i = new A_(this.url, o);
          return this.inheritParamsAndData(i._root), i;
        }
        inheritParamsAndData(e) {
          const n = e.value,
            r = M_(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            e.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(e, n, r) {
          return 0 === n.segments.length && n.hasChildren()
            ? this.processChildren(e, n)
            : this.processSegment(e, n, n.segments, r);
        }
        processChildren(e, n) {
          const r = [];
          for (const i of Object.keys(n.children)) {
            const s = n.children[i],
              a = P_(e, i),
              l = this.processSegmentGroup(a, s, i);
            if (null === l) return null;
            r.push(...l);
          }
          const o = $_(r);
          return (
            (function UO(t) {
              t.sort((e, n) =>
                e.value.outlet === j
                  ? -1
                  : n.value.outlet === j
                  ? 1
                  : e.value.outlet.localeCompare(n.value.outlet)
              );
            })(o),
            o
          );
        }
        processSegment(e, n, r, o) {
          for (const i of e) {
            const s = this.processSegmentAgainstRoute(i, n, r, o);
            if (null !== s) return s;
          }
          return L_(n, r, o) ? [] : null;
        }
        processSegmentAgainstRoute(e, n, r, o) {
          if (e.redirectTo || !V_(e, n, r, o)) return null;
          let i,
            s = [],
            a = [];
          if ("**" === e.path) {
            const h = r.length > 0 ? d_(r).parameters : {};
            i = new na(
              r,
              h,
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              z_(e),
              Et(e),
              e.component,
              e,
              G_(n),
              q_(n) + r.length,
              W_(e)
            );
          } else {
            const h = ia(n, e, r);
            if (!h.matched) return null;
            (s = h.consumedSegments),
              (a = h.remainingSegments),
              (i = new na(
                s,
                h.parameters,
                Object.freeze(Object.assign({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                z_(e),
                Et(e),
                e.component,
                e,
                G_(n),
                q_(n) + s.length,
                W_(e)
              ));
          }
          const l = (function HO(t) {
              return t.children
                ? t.children
                : t.loadChildren
                ? t._loadedConfig.routes
                : [];
            })(e),
            { segmentGroup: u, slicedSegments: c } = sa(
              n,
              s,
              a,
              l.filter((h) => void 0 === h.redirectTo),
              this.relativeLinkResolution
            );
          if (0 === c.length && u.hasChildren()) {
            const h = this.processChildren(l, u);
            return null === h ? null : [new vn(i, h)];
          }
          if (0 === l.length && 0 === c.length) return [new vn(i, [])];
          const d = Et(e) === o,
            f = this.processSegment(l, u, c, d ? j : o);
          return null === f ? null : [new vn(i, f)];
        }
      }
      function $O(t) {
        const e = t.value.routeConfig;
        return e && "" === e.path && void 0 === e.redirectTo;
      }
      function $_(t) {
        const e = [],
          n = new Set();
        for (const r of t) {
          if (!$O(r)) {
            e.push(r);
            continue;
          }
          const o = e.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : e.push(r);
        }
        for (const r of n) {
          const o = $_(r.children);
          e.push(new vn(r.value, o));
        }
        return e.filter((r) => !n.has(r));
      }
      function G_(t) {
        let e = t;
        for (; e._sourceSegment; ) e = e._sourceSegment;
        return e;
      }
      function q_(t) {
        let e = t,
          n = e._segmentIndexShift ? e._segmentIndexShift : 0;
        for (; e._sourceSegment; )
          (e = e._sourceSegment),
            (n += e._segmentIndexShift ? e._segmentIndexShift : 0);
        return n - 1;
      }
      function z_(t) {
        return t.data || {};
      }
      function W_(t) {
        return t.resolve || {};
      }
      function Q_(t) {
        return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
      }
      function cd(t) {
        return Xn((e) => {
          const n = t(e);
          return n ? Ce(n).pipe(z(() => e)) : O(e);
        });
      }
      class JO extends class KO {
        shouldDetach(e) {
          return !1;
        }
        store(e, n) {}
        shouldAttach(e) {
          return !1;
        }
        retrieve(e) {
          return null;
        }
        shouldReuseRoute(e, n) {
          return e.routeConfig === n.routeConfig;
        }
      } {}
      const dd = new L("ROUTES");
      class Z_ {
        constructor(e, n, r, o) {
          (this.injector = e),
            (this.compiler = n),
            (this.onLoadStartListener = r),
            (this.onLoadEndListener = o);
        }
        load(e, n) {
          if (n._loader$) return n._loader$;
          this.onLoadStartListener && this.onLoadStartListener(n);
          const o = this.loadModuleFactory(n.loadChildren).pipe(
            z((i) => {
              this.onLoadEndListener && this.onLoadEndListener(n);
              const s = i.create(e);
              return new sd(
                c_(s.injector.get(dd, void 0, I.Self | I.Optional)).map(ld),
                s
              );
            }),
            On((i) => {
              throw ((n._loader$ = void 0), i);
            })
          );
          return (
            (n._loader$ = new cN(o, () => new en()).pipe(n_())), n._loader$
          );
        }
        loadModuleFactory(e) {
          return Yt(e()).pipe(
            Te((n) =>
              n instanceof Zm ? O(n) : Ce(this.compiler.compileModuleAsync(n))
            )
          );
        }
      }
      class XO {
        shouldProcessUrl(e) {
          return !0;
        }
        extract(e) {
          return e;
        }
        merge(e, n) {
          return e;
        }
      }
      function e1(t) {
        throw t;
      }
      function t1(t, e, n) {
        return e.parse("/");
      }
      function K_(t, e) {
        return O(null);
      }
      const n1 = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        r1 = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let Ye = (() => {
        class t {
          constructor(n, r, o, i, s, a, l) {
            (this.rootComponentType = n),
              (this.urlSerializer = r),
              (this.rootContexts = o),
              (this.location = i),
              (this.config = l),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new en()),
              (this.errorHandler = e1),
              (this.malformedUriErrorHandler = t1),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.hooks = {
                beforePreactivation: K_,
                afterPreactivation: K_,
              }),
              (this.urlHandlingStrategy = new XO()),
              (this.routeReuseStrategy = new JO()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.ngModule = s.get(dn)),
              (this.console = s.get(Ny));
            const d = s.get(Re);
            (this.isNgZoneEnabled = d instanceof Re && Re.isInAngularZone()),
              this.resetConfig(l),
              (this.currentUrlTree = (function IN() {
                return new er(new H([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.configLoader = new Z_(
                s,
                a,
                (f) => this.triggerEvent(new i_(f)),
                (f) => this.triggerEvent(new s_(f))
              )),
              (this.routerState = b_(
                this.currentUrlTree,
                this.rootComponentType
              )),
              (this.transitions = new Ct({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            var n;
            return null === (n = this.location.getState()) || void 0 === n
              ? void 0
              : n.??routerPageId;
          }
          setupNavigations(n) {
            const r = this.events;
            return n.pipe(
              Yn((o) => 0 !== o.id),
              z((o) =>
                Object.assign(Object.assign({}, o), {
                  extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
                })
              ),
              Xn((o) => {
                let i = !1,
                  s = !1;
                return O(o).pipe(
                  ut((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.currentRawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? Object.assign(
                            Object.assign({}, this.lastSuccessfulNavigation),
                            { previousNavigation: null }
                          )
                        : null,
                    };
                  }),
                  Xn((a) => {
                    const l = this.browserUrlTree.toString(),
                      u =
                        !this.navigated ||
                        a.extractedUrl.toString() !== l ||
                        l !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || u) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        J_(a.source) && (this.browserUrlTree = a.extractedUrl),
                        O(a).pipe(
                          Xn((d) => {
                            const f = this.transitions.getValue();
                            return (
                              r.next(
                                new Zc(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState
                                )
                              ),
                              f !== this.transitions.getValue()
                                ? nn
                                : Promise.resolve(d)
                            );
                          }),
                          (function bO(t, e, n, r) {
                            return Xn((o) =>
                              (function CO(t, e, n, r, o) {
                                return new EO(t, e, n, r, o).apply();
                              })(t, e, n, o.extractedUrl, r).pipe(
                                z((i) =>
                                  Object.assign(Object.assign({}, o), {
                                    urlAfterRedirects: i,
                                  })
                                )
                              )
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config
                          ),
                          ut((d) => {
                            this.currentNavigation = Object.assign(
                              Object.assign({}, this.currentNavigation),
                              { finalUrl: d.urlAfterRedirects }
                            );
                          }),
                          (function GO(t, e, n, r, o) {
                            return Te((i) =>
                              (function BO(
                                t,
                                e,
                                n,
                                r,
                                o = "emptyOnly",
                                i = "legacy"
                              ) {
                                try {
                                  const s = new jO(
                                    t,
                                    e,
                                    n,
                                    r,
                                    o,
                                    i
                                  ).recognize();
                                  return null === s ? H_(new LO()) : O(s);
                                } catch (s) {
                                  return H_(s);
                                }
                              })(
                                t,
                                e,
                                i.urlAfterRedirects,
                                n(i.urlAfterRedirects),
                                r,
                                o
                              ).pipe(
                                z((s) =>
                                  Object.assign(Object.assign({}, i), {
                                    targetSnapshot: s,
                                  })
                                )
                              )
                            );
                          })(
                            this.rootComponentType,
                            this.config,
                            (d) => this.serializeUrl(d),
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution
                          ),
                          ut((d) => {
                            if ("eager" === this.urlUpdateStrategy) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl
                                );
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new mN(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            r.next(f);
                          })
                        )
                      );
                    if (
                      u &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: f,
                          extractedUrl: h,
                          source: p,
                          restoredState: m,
                          extras: D,
                        } = a,
                        v = new Zc(f, this.serializeUrl(h), p, m);
                      r.next(v);
                      const g = b_(h, this.rootComponentType).snapshot;
                      return O(
                        Object.assign(Object.assign({}, a), {
                          targetSnapshot: g,
                          urlAfterRedirects: h,
                          extras: Object.assign(Object.assign({}, D), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), nn;
                  }),
                  cd((a) => {
                    const {
                      targetSnapshot: l,
                      id: u,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.beforePreactivation(l, {
                      navigationId: u,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  ut((a) => {
                    const l = new yN(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(l);
                  }),
                  z((a) =>
                    Object.assign(Object.assign({}, a), {
                      guards: MO(
                        a.targetSnapshot,
                        a.currentSnapshot,
                        this.rootContexts
                      ),
                    })
                  ),
                  (function RO(t, e) {
                    return Te((n) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: o,
                        guards: {
                          canActivateChecks: i,
                          canDeactivateChecks: s,
                        },
                      } = n;
                      return 0 === s.length && 0 === i.length
                        ? O(
                            Object.assign(Object.assign({}, n), {
                              guardsResult: !0,
                            })
                          )
                        : (function xO(t, e, n, r) {
                            return Ce(t).pipe(
                              Te((o) =>
                                (function VO(t, e, n, r, o) {
                                  const i =
                                    e && e.routeConfig
                                      ? e.routeConfig.canDeactivate
                                      : null;
                                  return i && 0 !== i.length
                                    ? O(
                                        i.map((a) => {
                                          const l = ca(a, e, o);
                                          let u;
                                          if (
                                            (function cO(t) {
                                              return t && Fn(t.canDeactivate);
                                            })(l)
                                          )
                                            u = Yt(l.canDeactivate(t, e, n, r));
                                          else {
                                            if (!Fn(l))
                                              throw new Error(
                                                "Invalid CanDeactivate guard"
                                              );
                                            u = Yt(l(t, e, n, r));
                                          }
                                          return u.pipe(xn());
                                        })
                                      ).pipe(ci())
                                    : O(!0);
                                })(o.component, o.route, n, e, r)
                              ),
                              xn((o) => !0 !== o, !0)
                            );
                          })(s, r, o, t).pipe(
                            Te((a) =>
                              a &&
                              (function sO(t) {
                                return "boolean" == typeof t;
                              })(a)
                                ? (function NO(t, e, n, r) {
                                    return Ce(e).pipe(
                                      Nn((o) =>
                                        Wc(
                                          (function FO(t, e) {
                                            return (
                                              null !== t && e && e(new CN(t)),
                                              O(!0)
                                            );
                                          })(o.route.parent, r),
                                          (function OO(t, e) {
                                            return (
                                              null !== t && e && e(new wN(t)),
                                              O(!0)
                                            );
                                          })(o.route, r),
                                          (function kO(t, e, n) {
                                            const r = e[e.length - 1],
                                              i = e
                                                .slice(0, e.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function AO(t) {
                                                    const e = t.routeConfig
                                                      ? t.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return e && 0 !== e.length
                                                      ? { node: t, guards: e }
                                                      : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  t_(() =>
                                                    O(
                                                      s.guards.map((l) => {
                                                        const u = ca(
                                                          l,
                                                          s.node,
                                                          n
                                                        );
                                                        let c;
                                                        if (
                                                          (function uO(t) {
                                                            return (
                                                              t &&
                                                              Fn(
                                                                t.canActivateChild
                                                              )
                                                            );
                                                          })(u)
                                                        )
                                                          c = Yt(
                                                            u.canActivateChild(
                                                              r,
                                                              t
                                                            )
                                                          );
                                                        else {
                                                          if (!Fn(u))
                                                            throw new Error(
                                                              "Invalid CanActivateChild guard"
                                                            );
                                                          c = Yt(u(r, t));
                                                        }
                                                        return c.pipe(xn());
                                                      })
                                                    ).pipe(ci())
                                                  )
                                                );
                                            return O(i).pipe(ci());
                                          })(t, o.path, n),
                                          (function PO(t, e, n) {
                                            const r = e.routeConfig
                                              ? e.routeConfig.canActivate
                                              : null;
                                            if (!r || 0 === r.length)
                                              return O(!0);
                                            const o = r.map((i) =>
                                              t_(() => {
                                                const s = ca(i, e, n);
                                                let a;
                                                if (
                                                  (function lO(t) {
                                                    return (
                                                      t && Fn(t.canActivate)
                                                    );
                                                  })(s)
                                                )
                                                  a = Yt(s.canActivate(e, t));
                                                else {
                                                  if (!Fn(s))
                                                    throw new Error(
                                                      "Invalid CanActivate guard"
                                                    );
                                                  a = Yt(s(e, t));
                                                }
                                                return a.pipe(xn());
                                              })
                                            );
                                            return O(o).pipe(ci());
                                          })(t, o.route, n)
                                        )
                                      ),
                                      xn((o) => !0 !== o, !0)
                                    );
                                  })(r, i, t, e)
                                : O(a)
                            ),
                            z((a) =>
                              Object.assign(Object.assign({}, n), {
                                guardsResult: a,
                              })
                            )
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  ut((a) => {
                    if (nr(a.guardsResult)) {
                      const u = Kc(
                        `Redirecting to "${this.serializeUrl(a.guardsResult)}"`
                      );
                      throw ((u.url = a.guardsResult), u);
                    }
                    const l = new vN(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(l);
                  }),
                  Yn(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, ""),
                      !1)
                  ),
                  cd((a) => {
                    if (a.guards.canActivateChecks.length)
                      return O(a).pipe(
                        ut((l) => {
                          const u = new _N(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(u);
                        }),
                        Xn((l) => {
                          let u = !1;
                          return O(l).pipe(
                            (function qO(t, e) {
                              return Te((n) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: o },
                                } = n;
                                if (!o.length) return O(n);
                                let i = 0;
                                return Ce(o).pipe(
                                  Nn((s) =>
                                    (function zO(t, e, n, r) {
                                      return (function WO(t, e, n, r) {
                                        const o = Q_(t);
                                        if (0 === o.length) return O({});
                                        const i = {};
                                        return Ce(o).pipe(
                                          Te((s) =>
                                            (function QO(t, e, n, r) {
                                              const o = ca(t, e, r);
                                              return Yt(
                                                o.resolve
                                                  ? o.resolve(e, n)
                                                  : o(e, n)
                                              );
                                            })(t[s], e, n, r).pipe(
                                              ut((a) => {
                                                i[s] = a;
                                              })
                                            )
                                          ),
                                          Qc(1),
                                          Te(() =>
                                            Q_(i).length === o.length
                                              ? O(i)
                                              : nn
                                          )
                                        );
                                      })(t._resolve, t, e, r).pipe(
                                        z(
                                          (i) => (
                                            (t._resolvedData = i),
                                            (t.data = Object.assign(
                                              Object.assign({}, t.data),
                                              M_(t, n).resolve
                                            )),
                                            null
                                          )
                                        )
                                      );
                                    })(s.route, r, t, e)
                                  ),
                                  ut(() => i++),
                                  Qc(1),
                                  Te((s) => (i === o.length ? O(n) : nn))
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector
                            ),
                            ut({
                              next: () => (u = !0),
                              complete: () => {
                                u ||
                                  (this.restoreHistory(l),
                                  this.cancelNavigationTransition(
                                    l,
                                    "At least one route resolver didn't emit any value."
                                  ));
                              },
                            })
                          );
                        }),
                        ut((l) => {
                          const u = new DN(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot
                          );
                          this.triggerEvent(u);
                        })
                      );
                  }),
                  cd((a) => {
                    const {
                      targetSnapshot: l,
                      id: u,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.afterPreactivation(l, {
                      navigationId: u,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  z((a) => {
                    const l = (function WN(t, e, n) {
                      const r = ai(t, e._root, n ? n._root : void 0);
                      return new w_(r, e);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState
                    );
                    return Object.assign(Object.assign({}, a), {
                      targetRouterState: l,
                    });
                  }),
                  ut((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((t, e, n) =>
                    z(
                      (r) => (
                        new oO(
                          e,
                          r.targetRouterState,
                          r.currentRouterState,
                          n
                        ).activate(t),
                        r
                      )
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a)
                  ),
                  ut({
                    next() {
                      i = !0;
                    },
                    complete() {
                      i = !0;
                    },
                  }),
                  (function pN(t) {
                    return Ie((e, n) => {
                      try {
                        e.subscribe(n);
                      } finally {
                        n.add(t);
                      }
                    });
                  })(() => {
                    var a;
                    i ||
                      s ||
                      this.cancelNavigationTransition(
                        o,
                        `Navigation ID ${o.id} is not equal to the current navigation id ${this.navigationId}`
                      ),
                      (null === (a = this.currentNavigation) || void 0 === a
                        ? void 0
                        : a.id) === o.id && (this.currentNavigation = null);
                  }),
                  On((a) => {
                    if (
                      ((s = !0),
                      (function AN(t) {
                        return t && t[l_];
                      })(a))
                    ) {
                      const l = nr(a.url);
                      l || ((this.navigated = !0), this.restoreHistory(o, !0));
                      const u = new o_(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a.message
                      );
                      r.next(u),
                        l
                          ? setTimeout(() => {
                              const c = this.urlHandlingStrategy.merge(
                                  a.url,
                                  this.rawUrlTree
                                ),
                                d = {
                                  skipLocationChange:
                                    o.extras.skipLocationChange,
                                  replaceUrl:
                                    "eager" === this.urlUpdateStrategy ||
                                    J_(o.source),
                                };
                              this.scheduleNavigation(
                                c,
                                "imperative",
                                null,
                                d,
                                {
                                  resolve: o.resolve,
                                  reject: o.reject,
                                  promise: o.promise,
                                }
                              );
                            }, 0)
                          : o.resolve(!1);
                    } else {
                      this.restoreHistory(o, !0);
                      const l = new gN(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a
                      );
                      r.next(l);
                      try {
                        o.resolve(this.errorHandler(a));
                      } catch (u) {
                        o.reject(u);
                      }
                    }
                    return nn;
                  })
                );
              })
            );
          }
          resetRootComponentType(n) {
            (this.rootComponentType = n),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(n) {
            this.transitions.next(
              Object.assign(Object.assign({}, this.transitions.value), n)
            );
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    var o;
                    const i = { replaceUrl: !0 },
                      s = (
                        null === (o = n.state) || void 0 === o
                          ? void 0
                          : o.navigationId
                      )
                        ? n.state
                        : null;
                    if (s) {
                      const l = Object.assign({}, s);
                      delete l.navigationId,
                        delete l.??routerPageId,
                        0 !== Object.keys(l).length && (i.state = l);
                    }
                    const a = this.parseUrl(n.url);
                    this.scheduleNavigation(a, r, s, i);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(n) {
            this.events.next(n);
          }
          resetConfig(n) {
            F_(n),
              (this.config = n.map(ld)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: l,
              } = r,
              u = o || this.routerState.root,
              c = l ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case "merge":
                d = Object.assign(
                  Object.assign({}, this.currentUrlTree.queryParams),
                  i
                );
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = i || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              (function KN(t, e, n, r, o) {
                if (0 === n.length) return rd(e.root, e.root, e.root, r, o);
                const i = (function JN(t) {
                  if ("string" == typeof t[0] && 1 === t.length && "/" === t[0])
                    return new I_(!0, 0, t);
                  let e = 0,
                    n = !1;
                  const r = t.reduce((o, i, s) => {
                    if ("object" == typeof i && null != i) {
                      if (i.outlets) {
                        const a = {};
                        return (
                          xe(i.outlets, (l, u) => {
                            a[u] = "string" == typeof l ? l.split("/") : l;
                          }),
                          [...o, { outlets: a }]
                        );
                      }
                      if (i.segmentPath) return [...o, i.segmentPath];
                    }
                    return "string" != typeof i
                      ? [...o, i]
                      : 0 === s
                      ? (i.split("/").forEach((a, l) => {
                          (0 == l && "." === a) ||
                            (0 == l && "" === a
                              ? (n = !0)
                              : ".." === a
                              ? e++
                              : "" != a && o.push(a));
                        }),
                        o)
                      : [...o, i];
                  }, []);
                  return new I_(n, e, r);
                })(n);
                if (i.toRoot()) return rd(e.root, e.root, new H([], {}), r, o);
                const s = (function YN(t, e, n) {
                    if (t.isAbsolute) return new od(e.root, !0, 0);
                    if (-1 === n.snapshot._lastPathIndex) {
                      const i = n.snapshot._urlSegment;
                      return new od(i, i === e.root, 0);
                    }
                    const r = ra(t.commands[0]) ? 0 : 1;
                    return (function XN(t, e, n) {
                      let r = t,
                        o = e,
                        i = n;
                      for (; i > o; ) {
                        if (((i -= o), (r = r.parent), !r))
                          throw new Error("Invalid number of '../'");
                        o = r.segments.length;
                      }
                      return new od(r, !1, o - i);
                    })(
                      n.snapshot._urlSegment,
                      n.snapshot._lastPathIndex + r,
                      t.numberOfDoubleDots
                    );
                  })(i, e, t),
                  a = s.processChildren
                    ? oa(s.segmentGroup, s.index, i.commands)
                    : R_(s.segmentGroup, s.index, i.commands);
                return rd(e.root, s.segmentGroup, a, r, o);
              })(u, this.currentUrlTree, n, d, null != c ? c : null)
            );
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const o = nr(n) ? n : this.parseUrl(n),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, "imperative", null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function o1(t) {
                for (let e = 0; e < t.length; e++) {
                  const n = t[e];
                  if (null == n)
                    throw new Error(
                      `The requested path contains ${n} segment at index ${e}`
                    );
                }
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let o;
            if (
              ((o =
                !0 === r
                  ? Object.assign({}, n1)
                  : !1 === r
                  ? Object.assign({}, r1)
                  : r),
              nr(n))
            )
              return h_(this.currentUrlTree, n, o);
            const i = this.parseUrl(n);
            return h_(this.currentUrlTree, i, o);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, o) => {
              const i = n[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (n) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = n.id),
                  (this.currentPageId = n.targetPageId),
                  this.events.next(
                    new oi(
                      n.id,
                      this.serializeUrl(n.extractedUrl),
                      this.serializeUrl(this.currentUrlTree)
                    )
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  n.resolve(!0);
              },
              (n) => {
                this.console.warn(`Unhandled Navigation Error: ${n}`);
              }
            );
          }
          scheduleNavigation(n, r, o, i, s) {
            var a, l;
            if (this.disposed) return Promise.resolve(!1);
            let u, c, d;
            s
              ? ((u = s.resolve), (c = s.reject), (d = s.promise))
              : (d = new Promise((p, m) => {
                  (u = p), (c = m);
                }));
            const f = ++this.navigationId;
            let h;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (o = this.location.getState()),
                  (h =
                    o && o.??routerPageId
                      ? o.??routerPageId
                      : i.replaceUrl || i.skipLocationChange
                      ? null !== (a = this.browserPageId) && void 0 !== a
                        ? a
                        : 0
                      : (null !== (l = this.browserPageId) && void 0 !== l
                          ? l
                          : 0) + 1))
                : (h = 0),
              this.setTransition({
                id: f,
                targetPageId: h,
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: n,
                extras: i,
                resolve: u,
                reject: c,
                promise: d,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              d.catch((p) => Promise.reject(p))
            );
          }
          setBrowserUrl(n, r) {
            const o = this.urlSerializer.serialize(n),
              i = Object.assign(
                Object.assign({}, r.extras.state),
                this.generateNgRouterState(r.id, r.targetPageId)
              );
            this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl
              ? this.location.replaceState(o, "", i)
              : this.location.go(o, "", i);
          }
          restoreHistory(n, r = !1) {
            var o, i;
            if ("computed" === this.canceledNavigationResolution) {
              const s = this.currentPageId - n.targetPageId;
              ("popstate" !== n.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !==
                  (null === (o = this.currentNavigation) || void 0 === o
                    ? void 0
                    : o.finalUrl)) ||
              0 === s
                ? this.currentUrlTree ===
                    (null === (i = this.currentNavigation) || void 0 === i
                      ? void 0
                      : i.finalUrl) &&
                  0 === s &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(s);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          cancelNavigationTransition(n, r) {
            const o = new o_(n.id, this.serializeUrl(n.extractedUrl), r);
            this.triggerEvent(o), n.resolve(!1);
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ??routerPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (t.??fac = function (n) {
            vu();
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      function J_(t) {
        return "imperative" !== t;
      }
      let fd = (() => {
          class t {
            constructor(n, r, o, i, s) {
              (this.router = n),
                (this.route = r),
                (this.tabIndexAttribute = o),
                (this.renderer = i),
                (this.el = s),
                (this.commands = null),
                (this.onChanges = new en()),
                this.setTabIndexIfNotOnNativeEl("0");
            }
            setTabIndexIfNotOnNativeEl(n) {
              if (null != this.tabIndexAttribute) return;
              const r = this.renderer,
                o = this.el.nativeElement;
              null !== n
                ? r.setAttribute(o, "tabindex", n)
                : r.removeAttribute(o, "tabindex");
            }
            ngOnChanges(n) {
              this.onChanges.next(this);
            }
            set routerLink(n) {
              null != n
                ? ((this.commands = Array.isArray(n) ? n : [n]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick() {
              if (null === this.urlTree) return !0;
              const n = {
                skipLocationChange: eo(this.skipLocationChange),
                replaceUrl: eo(this.replaceUrl),
                state: this.state,
              };
              return this.router.navigateByUrl(this.urlTree, n), !0;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: eo(this.preserveFragment),
                  });
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(Ye), _(Xr), mo("tabindex"), _(cn), _(at));
            }),
            (t.??dir = T({
              type: t,
              selectors: [["", "routerLink", "", 5, "a", 5, "area"]],
              hostBindings: function (n, r) {
                1 & n &&
                  Le("click", function () {
                    return r.onClick();
                  });
              },
              inputs: {
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                state: "state",
                relativeTo: "relativeTo",
                routerLink: "routerLink",
              },
              features: [pt],
            })),
            t
          );
        })(),
        da = (() => {
          class t {
            constructor(n, r, o) {
              (this.router = n),
                (this.route = r),
                (this.locationStrategy = o),
                (this.commands = null),
                (this.href = null),
                (this.onChanges = new en()),
                (this.subscription = n.events.subscribe((i) => {
                  i instanceof oi && this.updateTargetUrlAndHref();
                }));
            }
            set routerLink(n) {
              this.commands = null != n ? (Array.isArray(n) ? n : [n]) : null;
            }
            ngOnChanges(n) {
              this.updateTargetUrlAndHref(), this.onChanges.next(this);
            }
            ngOnDestroy() {
              this.subscription.unsubscribe();
            }
            onClick(n, r, o, i, s) {
              if (
                0 !== n ||
                r ||
                o ||
                i ||
                s ||
                ("string" == typeof this.target && "_self" != this.target) ||
                null === this.urlTree
              )
                return !0;
              const a = {
                skipLocationChange: eo(this.skipLocationChange),
                replaceUrl: eo(this.replaceUrl),
                state: this.state,
              };
              return this.router.navigateByUrl(this.urlTree, a), !1;
            }
            updateTargetUrlAndHref() {
              this.href =
                null !== this.urlTree
                  ? this.locationStrategy.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: eo(this.preserveFragment),
                  });
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(Ye), _(Xr), _(Kr));
            }),
            (t.??dir = T({
              type: t,
              selectors: [
                ["a", "routerLink", ""],
                ["area", "routerLink", ""],
              ],
              hostVars: 2,
              hostBindings: function (n, r) {
                1 & n &&
                  Le("click", function (i) {
                    return r.onClick(
                      i.button,
                      i.ctrlKey,
                      i.shiftKey,
                      i.altKey,
                      i.metaKey
                    );
                  }),
                  2 & n && zt("target", r.target)("href", r.href, El);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                state: "state",
                relativeTo: "relativeTo",
                routerLink: "routerLink",
              },
              features: [pt],
            })),
            t
          );
        })();
      function eo(t) {
        return "" === t || !!t;
      }
      let Y_ = (() => {
        class t {
          constructor(n, r, o, i, s, a) {
            (this.router = n),
              (this.element = r),
              (this.renderer = o),
              (this.cdr = i),
              (this.link = s),
              (this.linkWithHref = a),
              (this.classes = []),
              (this.isActive = !1),
              (this.routerLinkActiveOptions = { exact: !1 }),
              (this.isActiveChange = new le()),
              (this.routerEventsSubscription = n.events.subscribe((l) => {
                l instanceof oi && this.update();
              }));
          }
          ngAfterContentInit() {
            O(this.links.changes, this.linksWithHrefs.changes, O(null))
              .pipe(oo())
              .subscribe((n) => {
                this.update(), this.subscribeToEachLinkOnChanges();
              });
          }
          subscribeToEachLinkOnChanges() {
            var n;
            null === (n = this.linkInputChangesSubscription) ||
              void 0 === n ||
              n.unsubscribe();
            const r = [
              ...this.links.toArray(),
              ...this.linksWithHrefs.toArray(),
              this.link,
              this.linkWithHref,
            ]
              .filter((o) => !!o)
              .map((o) => o.onChanges);
            this.linkInputChangesSubscription = Ce(r)
              .pipe(oo())
              .subscribe((o) => {
                this.isActive !== this.isLinkActive(this.router)(o) &&
                  this.update();
              });
          }
          set routerLinkActive(n) {
            const r = Array.isArray(n) ? n : n.split(" ");
            this.classes = r.filter((o) => !!o);
          }
          ngOnChanges(n) {
            this.update();
          }
          ngOnDestroy() {
            var n;
            this.routerEventsSubscription.unsubscribe(),
              null === (n = this.linkInputChangesSubscription) ||
                void 0 === n ||
                n.unsubscribe();
          }
          update() {
            !this.links ||
              !this.linksWithHrefs ||
              !this.router.navigated ||
              Promise.resolve().then(() => {
                const n = this.hasActiveLinks();
                this.isActive !== n &&
                  ((this.isActive = n),
                  this.cdr.markForCheck(),
                  this.classes.forEach((r) => {
                    n
                      ? this.renderer.addClass(this.element.nativeElement, r)
                      : this.renderer.removeClass(
                          this.element.nativeElement,
                          r
                        );
                  }),
                  this.isActiveChange.emit(n));
              });
          }
          isLinkActive(n) {
            const r = (function i1(t) {
              return !!t.paths;
            })(this.routerLinkActiveOptions)
              ? this.routerLinkActiveOptions
              : this.routerLinkActiveOptions.exact || !1;
            return (o) => !!o.urlTree && n.isActive(o.urlTree, r);
          }
          hasActiveLinks() {
            const n = this.isLinkActive(this.router);
            return (
              (this.link && n(this.link)) ||
              (this.linkWithHref && n(this.linkWithHref)) ||
              this.links.some(n) ||
              this.linksWithHrefs.some(n)
            );
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(_(Ye), _(at), _(cn), _(Is), _(fd, 8), _(da, 8));
          }),
          (t.??dir = T({
            type: t,
            selectors: [["", "routerLinkActive", ""]],
            contentQueries: function (n, r, o) {
              if ((1 & n && (Wu(o, fd, 5), Wu(o, da, 5)), 2 & n)) {
                let i;
                zu((i = Qu())) && (r.links = i),
                  zu((i = Qu())) && (r.linksWithHrefs = i);
              }
            },
            inputs: {
              routerLinkActiveOptions: "routerLinkActiveOptions",
              routerLinkActive: "routerLinkActive",
            },
            outputs: { isActiveChange: "isActiveChange" },
            exportAs: ["routerLinkActive"],
            features: [pt],
          })),
          t
        );
      })();
      class X_ {}
      class eD {
        preload(e, n) {
          return O(null);
        }
      }
      let tD = (() => {
          class t {
            constructor(n, r, o, i) {
              (this.router = n),
                (this.injector = o),
                (this.preloadingStrategy = i),
                (this.loader = new Z_(
                  o,
                  r,
                  (l) => n.triggerEvent(new i_(l)),
                  (l) => n.triggerEvent(new s_(l))
                ));
            }
            setUpPreloading() {
              this.subscription = this.router.events
                .pipe(
                  Yn((n) => n instanceof oi),
                  Nn(() => this.preload())
                )
                .subscribe(() => {});
            }
            preload() {
              const n = this.injector.get(dn);
              return this.processRoutes(n, this.router.config);
            }
            ngOnDestroy() {
              this.subscription && this.subscription.unsubscribe();
            }
            processRoutes(n, r) {
              const o = [];
              for (const i of r)
                if (i.loadChildren && !i.canLoad && i._loadedConfig) {
                  const s = i._loadedConfig;
                  o.push(this.processRoutes(s.module, s.routes));
                } else
                  i.loadChildren && !i.canLoad
                    ? o.push(this.preloadConfig(n, i))
                    : i.children && o.push(this.processRoutes(n, i.children));
              return Ce(o).pipe(
                oo(),
                z((i) => {})
              );
            }
            preloadConfig(n, r) {
              return this.preloadingStrategy.preload(r, () =>
                (r._loadedConfig
                  ? O(r._loadedConfig)
                  : this.loader.load(n.injector, r)
                ).pipe(
                  Te(
                    (i) => (
                      (r._loadedConfig = i),
                      this.processRoutes(i.module, i.routes)
                    )
                  )
                )
              );
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(w(Ye), w(Fy), w(ke), w(X_));
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })(),
        hd = (() => {
          class t {
            constructor(n, r, o = {}) {
              (this.router = n),
                (this.viewportScroller = r),
                (this.options = o),
                (this.lastId = 0),
                (this.lastSource = "imperative"),
                (this.restoredId = 0),
                (this.store = {}),
                (o.scrollPositionRestoration =
                  o.scrollPositionRestoration || "disabled"),
                (o.anchorScrolling = o.anchorScrolling || "disabled");
            }
            init() {
              "disabled" !== this.options.scrollPositionRestoration &&
                this.viewportScroller.setHistoryScrollRestoration("manual"),
                (this.routerEventsSubscription = this.createScrollEvents()),
                (this.scrollEventsSubscription = this.consumeScrollEvents());
            }
            createScrollEvents() {
              return this.router.events.subscribe((n) => {
                n instanceof Zc
                  ? ((this.store[this.lastId] =
                      this.viewportScroller.getScrollPosition()),
                    (this.lastSource = n.navigationTrigger),
                    (this.restoredId = n.restoredState
                      ? n.restoredState.navigationId
                      : 0))
                  : n instanceof oi &&
                    ((this.lastId = n.id),
                    this.scheduleScrollEvent(
                      n,
                      this.router.parseUrl(n.urlAfterRedirects).fragment
                    ));
              });
            }
            consumeScrollEvents() {
              return this.router.events.subscribe((n) => {
                n instanceof a_ &&
                  (n.position
                    ? "top" === this.options.scrollPositionRestoration
                      ? this.viewportScroller.scrollToPosition([0, 0])
                      : "enabled" === this.options.scrollPositionRestoration &&
                        this.viewportScroller.scrollToPosition(n.position)
                    : n.anchor && "enabled" === this.options.anchorScrolling
                    ? this.viewportScroller.scrollToAnchor(n.anchor)
                    : "disabled" !== this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition([0, 0]));
              });
            }
            scheduleScrollEvent(n, r) {
              this.router.triggerEvent(
                new a_(
                  n,
                  "popstate" === this.lastSource
                    ? this.store[this.restoredId]
                    : null,
                  r
                )
              );
            }
            ngOnDestroy() {
              this.routerEventsSubscription &&
                this.routerEventsSubscription.unsubscribe(),
                this.scrollEventsSubscription &&
                  this.scrollEventsSubscription.unsubscribe();
            }
          }
          return (
            (t.??fac = function (n) {
              vu();
            }),
            (t.??prov = x({ token: t, factory: t.??fac })),
            t
          );
        })();
      const rr = new L("ROUTER_CONFIGURATION"),
        nD = new L("ROUTER_FORROOT_GUARD"),
        a1 = [
          mc,
          { provide: y_, useClass: v_ },
          {
            provide: Ye,
            useFactory: function f1(t, e, n, r, o, i, s = {}, a, l) {
              const u = new Ye(null, t, e, n, r, o, c_(i));
              return (
                a && (u.urlHandlingStrategy = a),
                l && (u.routeReuseStrategy = l),
                (function h1(t, e) {
                  t.errorHandler && (e.errorHandler = t.errorHandler),
                    t.malformedUriErrorHandler &&
                      (e.malformedUriErrorHandler = t.malformedUriErrorHandler),
                    t.onSameUrlNavigation &&
                      (e.onSameUrlNavigation = t.onSameUrlNavigation),
                    t.paramsInheritanceStrategy &&
                      (e.paramsInheritanceStrategy =
                        t.paramsInheritanceStrategy),
                    t.relativeLinkResolution &&
                      (e.relativeLinkResolution = t.relativeLinkResolution),
                    t.urlUpdateStrategy &&
                      (e.urlUpdateStrategy = t.urlUpdateStrategy),
                    t.canceledNavigationResolution &&
                      (e.canceledNavigationResolution =
                        t.canceledNavigationResolution);
                })(s, u),
                s.enableTracing &&
                  u.events.subscribe((c) => {
                    var d, f;
                    null === (d = console.group) ||
                      void 0 === d ||
                      d.call(console, `Router Event: ${c.constructor.name}`),
                      console.log(c.toString()),
                      console.log(c),
                      null === (f = console.groupEnd) ||
                        void 0 === f ||
                        f.call(console);
                  }),
                u
              );
            },
            deps: [
              y_,
              di,
              mc,
              ke,
              Fy,
              dd,
              rr,
              [class YO {}, new Mn()],
              [class ZO {}, new Mn()],
            ],
          },
          di,
          {
            provide: Xr,
            useFactory: function p1(t) {
              return t.routerState.root;
            },
            deps: [Ye],
          },
          tD,
          eD,
          class s1 {
            preload(e, n) {
              return n().pipe(On(() => O(null)));
            }
          },
          { provide: rr, useValue: { enableTracing: !1 } },
        ];
      function l1() {
        return new By("Router", Ye);
      }
      let rD = (() => {
        class t {
          constructor(n, r) {}
          static forRoot(n, r) {
            return {
              ngModule: t,
              providers: [
                a1,
                oD(n),
                {
                  provide: nD,
                  useFactory: d1,
                  deps: [[Ye, new Mn(), new wo()]],
                },
                { provide: rr, useValue: r || {} },
                {
                  provide: Kr,
                  useFactory: c1,
                  deps: [Jn, [new Ki(gc), new Mn()], rr],
                },
                { provide: hd, useFactory: u1, deps: [Ye, GR, rr] },
                {
                  provide: X_,
                  useExisting:
                    r && r.preloadingStrategy ? r.preloadingStrategy : eD,
                },
                { provide: By, multi: !0, useFactory: l1 },
                [
                  pd,
                  { provide: ec, multi: !0, useFactory: g1, deps: [pd] },
                  { provide: iD, useFactory: m1, deps: [pd] },
                  { provide: xy, multi: !0, useExisting: iD },
                ],
              ],
            };
          }
          static forChild(n) {
            return { ngModule: t, providers: [oD(n)] };
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(nD, 8), w(Ye, 8));
          }),
          (t.??mod = tt({ type: t })),
          (t.??inj = Qe({})),
          t
        );
      })();
      function u1(t, e, n) {
        return n.scrollOffset && e.setOffset(n.scrollOffset), new hd(t, e, n);
      }
      function c1(t, e, n = {}) {
        return n.useHash ? new AI(t, e) : new iv(t, e);
      }
      function d1(t) {
        return "guarded";
      }
      function oD(t) {
        return [
          { provide: lw, multi: !0, useValue: t },
          { provide: dd, multi: !0, useValue: t },
        ];
      }
      let pd = (() => {
        class t {
          constructor(n) {
            (this.injector = n),
              (this.initNavigation = !1),
              (this.destroyed = !1),
              (this.resultOfPreactivationDone = new en());
          }
          appInitializer() {
            return this.injector.get(wI, Promise.resolve(null)).then(() => {
              if (this.destroyed) return Promise.resolve(!0);
              let r = null;
              const o = new Promise((a) => (r = a)),
                i = this.injector.get(Ye),
                s = this.injector.get(rr);
              return (
                "disabled" === s.initialNavigation
                  ? (i.setUpLocationChangeListener(), r(!0))
                  : "enabled" === s.initialNavigation ||
                    "enabledBlocking" === s.initialNavigation
                  ? ((i.hooks.afterPreactivation = () =>
                      this.initNavigation
                        ? O(null)
                        : ((this.initNavigation = !0),
                          r(!0),
                          this.resultOfPreactivationDone)),
                    i.initialNavigation())
                  : r(!0),
                o
              );
            });
          }
          bootstrapListener(n) {
            const r = this.injector.get(rr),
              o = this.injector.get(tD),
              i = this.injector.get(hd),
              s = this.injector.get(Ye),
              a = this.injector.get(lc);
            n === a.components[0] &&
              (("enabledNonBlocking" === r.initialNavigation ||
                void 0 === r.initialNavigation) &&
                s.initialNavigation(),
              o.setUpPreloading(),
              i.init(),
              s.resetRootComponentType(a.componentTypes[0]),
              this.resultOfPreactivationDone.next(null),
              this.resultOfPreactivationDone.complete());
          }
          ngOnDestroy() {
            this.destroyed = !0;
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(w(ke));
          }),
          (t.??prov = x({ token: t, factory: t.??fac })),
          t
        );
      })();
      function g1(t) {
        return t.appInitializer.bind(t);
      }
      function m1(t) {
        return t.bootstrapListener.bind(t);
      }
      const iD = new L("Router Initializer");
      let sD = (() => {
          class t {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(cn), _(at));
            }),
            (t.??dir = T({ type: t })),
            t
          );
        })(),
        or = (() => {
          class t extends sD {}
          return (
            (t.??fac = (function () {
              let e;
              return function (r) {
                return (e || (e = Fe(t)))(r || t);
              };
            })()),
            (t.??dir = T({ type: t, features: [Q] })),
            t
          );
        })();
      const Xt = new L("NgValueAccessor"),
        D1 = { provide: Xt, useExisting: X(() => fa), multi: !0 },
        E1 = new L("CompositionEventMode");
      let fa = (() => {
        class t extends sD {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function C1() {
                  const t = Zt() ? Zt().getUserAgent() : "";
                  return /android (\d+)/.test(t.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", null == n ? "" : n);
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(_(cn), _(at), _(E1, 8));
          }),
          (t.??dir = T({
            type: t,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                Le("input", function (i) {
                  return r._handleInput(i.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (i) {
                  return r._compositionEnd(i.target.value);
                });
            },
            features: [se([D1]), Q],
          })),
          t
        );
      })();
      const Be = new L("NgValidators"),
        kn = new L("NgAsyncValidators");
      function yD(t) {
        return null != t;
      }
      function vD(t) {
        const e = Vo(t) ? Ce(t) : t;
        return Eu(e), e;
      }
      function _D(t) {
        let e = {};
        return (
          t.forEach((n) => {
            e = null != n ? Object.assign(Object.assign({}, e), n) : e;
          }),
          0 === Object.keys(e).length ? null : e
        );
      }
      function DD(t, e) {
        return e.map((n) => n(t));
      }
      function CD(t) {
        return t.map((e) =>
          (function b1(t) {
            return !t.validate;
          })(e)
            ? e
            : (n) => e.validate(n)
        );
      }
      function gd(t) {
        return null != t
          ? (function ED(t) {
              if (!t) return null;
              const e = t.filter(yD);
              return 0 == e.length
                ? null
                : function (n) {
                    return _D(DD(n, e));
                  };
            })(CD(t))
          : null;
      }
      function md(t) {
        return null != t
          ? (function wD(t) {
              if (!t) return null;
              const e = t.filter(yD);
              return 0 == e.length
                ? null
                : function (n) {
                    return (function v1(...t) {
                      const e = mf(t),
                        { args: n, keys: r } = Jv(t),
                        o = new oe((i) => {
                          const { length: s } = n;
                          if (!s) return void i.complete();
                          const a = new Array(s);
                          let l = s,
                            u = s;
                          for (let c = 0; c < s; c++) {
                            let d = !1;
                            Vt(n[c]).subscribe(
                              Ae(
                                i,
                                (f) => {
                                  d || ((d = !0), u--), (a[c] = f);
                                },
                                () => l--,
                                void 0,
                                () => {
                                  (!l || !d) &&
                                    (u || i.next(r ? Xv(r, a) : a),
                                    i.complete());
                                }
                              )
                            );
                          }
                        });
                      return e ? o.pipe(Yv(e)) : o;
                    })(DD(n, e).map(vD)).pipe(z(_D));
                  };
            })(CD(t))
          : null;
      }
      function bD(t, e) {
        return null === t ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
      }
      function yd(t) {
        return t ? (Array.isArray(t) ? t : [t]) : [];
      }
      function pa(t, e) {
        return Array.isArray(t) ? t.includes(e) : t === e;
      }
      function TD(t, e) {
        const n = yd(e);
        return (
          yd(t).forEach((o) => {
            pa(n, o) || n.push(o);
          }),
          n
        );
      }
      function SD(t, e) {
        return yd(e).filter((n) => !pa(t, n));
      }
      class ID {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(e) {
          (this._rawValidators = e || []),
            (this._composedValidatorFn = gd(this._rawValidators));
        }
        _setAsyncValidators(e) {
          (this._rawAsyncValidators = e || []),
            (this._composedAsyncValidatorFn = md(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(e) {
          this._onDestroyCallbacks.push(e);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((e) => e()),
            (this._onDestroyCallbacks = []);
        }
        reset(e) {
          this.control && this.control.reset(e);
        }
        hasError(e, n) {
          return !!this.control && this.control.hasError(e, n);
        }
        getError(e, n) {
          return this.control ? this.control.getError(e, n) : null;
        }
      }
      class Vn extends ID {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class We extends ID {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class RD {
        constructor(e) {
          this._cd = e;
        }
        is(e) {
          var n, r, o;
          return "submitted" === e
            ? !!(null === (n = this._cd) || void 0 === n ? void 0 : n.submitted)
            : !!(null ===
                (o =
                  null === (r = this._cd) || void 0 === r
                    ? void 0
                    : r.control) || void 0 === o
                ? void 0
                : o[e]);
        }
      }
      let xD = (() => {
          class t extends RD {
            constructor(n) {
              super(n);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(Vn, 2));
            }),
            (t.??dir = T({
              type: t,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  ms("ng-untouched", r.is("untouched"))(
                    "ng-touched",
                    r.is("touched")
                  )("ng-pristine", r.is("pristine"))("ng-dirty", r.is("dirty"))(
                    "ng-valid",
                    r.is("valid")
                  )("ng-invalid", r.is("invalid"))(
                    "ng-pending",
                    r.is("pending")
                  );
              },
              features: [Q],
            })),
            t
          );
        })(),
        ND = (() => {
          class t extends RD {
            constructor(n) {
              super(n);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(We, 10));
            }),
            (t.??dir = T({
              type: t,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  ms("ng-untouched", r.is("untouched"))(
                    "ng-touched",
                    r.is("touched")
                  )("ng-pristine", r.is("pristine"))("ng-dirty", r.is("dirty"))(
                    "ng-valid",
                    r.is("valid")
                  )("ng-invalid", r.is("invalid"))(
                    "ng-pending",
                    r.is("pending")
                  )("ng-submitted", r.is("submitted"));
              },
              features: [Q],
            })),
            t
          );
        })();
      function gi(t, e) {
        Dd(t, e),
          e.valueAccessor.writeValue(t.value),
          (function N1(t, e) {
            e.valueAccessor.registerOnChange((n) => {
              (t._pendingValue = n),
                (t._pendingChange = !0),
                (t._pendingDirty = !0),
                "change" === t.updateOn && FD(t, e);
            });
          })(t, e),
          (function F1(t, e) {
            const n = (r, o) => {
              e.valueAccessor.writeValue(r), o && e.viewToModelUpdate(r);
            };
            t.registerOnChange(n),
              e._registerOnDestroy(() => {
                t._unregisterOnChange(n);
              });
          })(t, e),
          (function O1(t, e) {
            e.valueAccessor.registerOnTouched(() => {
              (t._pendingTouched = !0),
                "blur" === t.updateOn && t._pendingChange && FD(t, e),
                "submit" !== t.updateOn && t.markAsTouched();
            });
          })(t, e),
          (function x1(t, e) {
            if (e.valueAccessor.setDisabledState) {
              const n = (r) => {
                e.valueAccessor.setDisabledState(r);
              };
              t.registerOnDisabledChange(n),
                e._registerOnDestroy(() => {
                  t._unregisterOnDisabledChange(n);
                });
            }
          })(t, e);
      }
      function va(t, e) {
        t.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(e);
        });
      }
      function Dd(t, e) {
        const n = (function MD(t) {
          return t._rawValidators;
        })(t);
        null !== e.validator
          ? t.setValidators(bD(n, e.validator))
          : "function" == typeof n && t.setValidators([n]);
        const r = (function AD(t) {
          return t._rawAsyncValidators;
        })(t);
        null !== e.asyncValidator
          ? t.setAsyncValidators(bD(r, e.asyncValidator))
          : "function" == typeof r && t.setAsyncValidators([r]);
        const o = () => t.updateValueAndValidity();
        va(e._rawValidators, o), va(e._rawAsyncValidators, o);
      }
      function FD(t, e) {
        t._pendingDirty && t.markAsDirty(),
          t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
          e.viewToModelUpdate(t._pendingValue),
          (t._pendingChange = !1);
      }
      function wd(t, e) {
        const n = t.indexOf(e);
        n > -1 && t.splice(n, 1);
      }
      const mi = "VALID",
        Da = "INVALID",
        to = "PENDING",
        yi = "DISABLED";
      function Md(t) {
        return (Ca(t) ? t.validators : t) || null;
      }
      function LD(t) {
        return Array.isArray(t) ? gd(t) : t || null;
      }
      function Ad(t, e) {
        return (Ca(e) ? e.asyncValidators : t) || null;
      }
      function BD(t) {
        return Array.isArray(t) ? md(t) : t || null;
      }
      function Ca(t) {
        return null != t && !Array.isArray(t) && "object" == typeof t;
      }
      const Td = (t) => t instanceof Id;
      function UD(t) {
        return ((t) => t instanceof GD)(t) ? t.value : t.getRawValue();
      }
      function HD(t, e) {
        const n = Td(t),
          r = t.controls;
        if (!(n ? Object.keys(r) : r).length) throw new $(1e3, "");
        if (!r[e]) throw new $(1001, "");
      }
      function $D(t, e) {
        Td(t),
          t._forEachChild((r, o) => {
            if (void 0 === e[o]) throw new $(1002, "");
          });
      }
      class Sd {
        constructor(e, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            (this._rawValidators = e),
            (this._rawAsyncValidators = n),
            (this._composedValidatorFn = LD(this._rawValidators)),
            (this._composedAsyncValidatorFn = BD(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(e) {
          this._rawValidators = this._composedValidatorFn = e;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(e) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === mi;
        }
        get invalid() {
          return this.status === Da;
        }
        get pending() {
          return this.status == to;
        }
        get disabled() {
          return this.status === yi;
        }
        get enabled() {
          return this.status !== yi;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(e) {
          (this._rawValidators = e), (this._composedValidatorFn = LD(e));
        }
        setAsyncValidators(e) {
          (this._rawAsyncValidators = e),
            (this._composedAsyncValidatorFn = BD(e));
        }
        addValidators(e) {
          this.setValidators(TD(e, this._rawValidators));
        }
        addAsyncValidators(e) {
          this.setAsyncValidators(TD(e, this._rawAsyncValidators));
        }
        removeValidators(e) {
          this.setValidators(SD(e, this._rawValidators));
        }
        removeAsyncValidators(e) {
          this.setAsyncValidators(SD(e, this._rawAsyncValidators));
        }
        hasValidator(e) {
          return pa(this._rawValidators, e);
        }
        hasAsyncValidator(e) {
          return pa(this._rawAsyncValidators, e);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(e = {}) {
          (this.touched = !0),
            this._parent && !e.onlySelf && this._parent.markAsTouched(e);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((e) => e.markAllAsTouched());
        }
        markAsUntouched(e = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !e.onlySelf && this._parent._updateTouched(e);
        }
        markAsDirty(e = {}) {
          (this.pristine = !1),
            this._parent && !e.onlySelf && this._parent.markAsDirty(e);
        }
        markAsPristine(e = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !e.onlySelf && this._parent._updatePristine(e);
        }
        markAsPending(e = {}) {
          (this.status = to),
            !1 !== e.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !e.onlySelf && this._parent.markAsPending(e);
        }
        disable(e = {}) {
          const n = this._parentMarkedDirty(e.onlySelf);
          (this.status = yi),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable(Object.assign(Object.assign({}, e), { onlySelf: !0 }));
            }),
            this._updateValue(),
            !1 !== e.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors(
              Object.assign(Object.assign({}, e), { skipPristineCheck: n })
            ),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(e = {}) {
          const n = this._parentMarkedDirty(e.onlySelf);
          (this.status = mi),
            this._forEachChild((r) => {
              r.enable(Object.assign(Object.assign({}, e), { onlySelf: !0 }));
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: e.emitEvent,
            }),
            this._updateAncestors(
              Object.assign(Object.assign({}, e), { skipPristineCheck: n })
            ),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(e) {
          this._parent &&
            !e.onlySelf &&
            (this._parent.updateValueAndValidity(e),
            e.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(e) {
          this._parent = e;
        }
        updateValueAndValidity(e = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === mi || this.status === to) &&
                this._runAsyncValidator(e.emitEvent)),
            !1 !== e.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !e.onlySelf &&
              this._parent.updateValueAndValidity(e);
        }
        _updateTreeValidity(e = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(e)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: e.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? yi : mi;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(e) {
          if (this.asyncValidator) {
            (this.status = to), (this._hasOwnPendingAsyncValidator = !0);
            const n = vD(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: e });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(e, n = {}) {
          (this.errors = e), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(e) {
          return (function L1(t, e, n) {
            if (
              null == e ||
              (Array.isArray(e) || (e = e.split(n)),
              Array.isArray(e) && 0 === e.length)
            )
              return null;
            let r = t;
            return (
              e.forEach((o) => {
                r = Td(r)
                  ? r.controls.hasOwnProperty(o)
                    ? r.controls[o]
                    : null
                  : (((t) => t instanceof j1)(r) && r.at(o)) || null;
              }),
              r
            );
          })(this, e, ".");
        }
        getError(e, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[e] : null;
        }
        hasError(e, n) {
          return !!this.getError(e, n);
        }
        get root() {
          let e = this;
          for (; e._parent; ) e = e._parent;
          return e;
        }
        _updateControlsErrors(e) {
          (this.status = this._calculateStatus()),
            e && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(e);
        }
        _initObservables() {
          (this.valueChanges = new le()), (this.statusChanges = new le());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? yi
            : this.errors
            ? Da
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(to)
            ? to
            : this._anyControlsHaveStatus(Da)
            ? Da
            : mi;
        }
        _anyControlsHaveStatus(e) {
          return this._anyControls((n) => n.status === e);
        }
        _anyControlsDirty() {
          return this._anyControls((e) => e.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((e) => e.touched);
        }
        _updatePristine(e = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !e.onlySelf && this._parent._updatePristine(e);
        }
        _updateTouched(e = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !e.onlySelf && this._parent._updateTouched(e);
        }
        _isBoxedValue(e) {
          return (
            "object" == typeof e &&
            null !== e &&
            2 === Object.keys(e).length &&
            "value" in e &&
            "disabled" in e
          );
        }
        _registerOnCollectionChange(e) {
          this._onCollectionChange = e;
        }
        _setUpdateStrategy(e) {
          Ca(e) && null != e.updateOn && (this._updateOn = e.updateOn);
        }
        _parentMarkedDirty(e) {
          return (
            !e &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
      }
      class GD extends Sd {
        constructor(e = null, n, r) {
          super(Md(n), Ad(r, n)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(e),
            this._setUpdateStrategy(n),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            Ca(n) &&
              n.initialValueIsDefault &&
              (this.defaultValue = this._isBoxedValue(e) ? e.value : e);
        }
        setValue(e, n = {}) {
          (this.value = this._pendingValue = e),
            this._onChange.length &&
              !1 !== n.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== n.emitViewToModelChange)
              ),
            this.updateValueAndValidity(n);
        }
        patchValue(e, n = {}) {
          this.setValue(e, n);
        }
        reset(e = this.defaultValue, n = {}) {
          this._applyFormState(e),
            this.markAsPristine(n),
            this.markAsUntouched(n),
            this.setValue(this.value, n),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(e) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(e) {
          this._onChange.push(e);
        }
        _unregisterOnChange(e) {
          wd(this._onChange, e);
        }
        registerOnDisabledChange(e) {
          this._onDisabledChange.push(e);
        }
        _unregisterOnDisabledChange(e) {
          wd(this._onDisabledChange, e);
        }
        _forEachChild(e) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(e) {
          this._isBoxedValue(e)
            ? ((this.value = this._pendingValue = e.value),
              e.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = e);
        }
      }
      class Id extends Sd {
        constructor(e, n, r) {
          super(Md(n), Ad(r, n)),
            (this.controls = e),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(e, n) {
          return this.controls[e]
            ? this.controls[e]
            : ((this.controls[e] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(e, n, r = {}) {
          this.registerControl(e, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(e, n = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            delete this.controls[e],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(e, n, r = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            delete this.controls[e],
            n && this.registerControl(e, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(e) {
          return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
        }
        setValue(e, n = {}) {
          $D(this, e),
            Object.keys(e).forEach((r) => {
              HD(this, r),
                this.controls[r].setValue(e[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(e, n = {}) {
          null != e &&
            (Object.keys(e).forEach((r) => {
              this.controls[r] &&
                this.controls[r].patchValue(e[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(e = {}, n = {}) {
          this._forEachChild((r, o) => {
            r.reset(e[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren({}, (e, n, r) => ((e[r] = UD(n)), e));
        }
        _syncPendingControls() {
          let e = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
        }
        _forEachChild(e) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && e(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((e) => {
            e.setParent(this),
              e._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(e) {
          for (const n of Object.keys(this.controls)) {
            const r = this.controls[n];
            if (this.contains(n) && e(r)) return !0;
          }
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (e, n, r) => ((n.enabled || this.disabled) && (e[r] = n.value), e)
          );
        }
        _reduceChildren(e, n) {
          let r = e;
          return (
            this._forEachChild((o, i) => {
              r = n(r, o, i);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const e of Object.keys(this.controls))
            if (this.controls[e].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
      }
      class j1 extends Sd {
        constructor(e, n, r) {
          super(Md(n), Ad(r, n)),
            (this.controls = e),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(e) {
          return this.controls[e];
        }
        push(e, n = {}) {
          this.controls.push(e),
            this._registerControl(e),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        insert(e, n, r = {}) {
          this.controls.splice(e, 0, n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(e, n = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            this.controls.splice(e, 1),
            this.updateValueAndValidity({ emitEvent: n.emitEvent });
        }
        setControl(e, n, r = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            this.controls.splice(e, 1),
            n && (this.controls.splice(e, 0, n), this._registerControl(n)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(e, n = {}) {
          $D(this, e),
            e.forEach((r, o) => {
              HD(this, o),
                this.at(o).setValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(e, n = {}) {
          null != e &&
            (e.forEach((r, o) => {
              this.at(o) &&
                this.at(o).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(e = [], n = {}) {
          this._forEachChild((r, o) => {
            r.reset(e[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this.controls.map((e) => UD(e));
        }
        clear(e = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: e.emitEvent }));
        }
        _syncPendingControls() {
          let e = this.controls.reduce(
            (n, r) => !!r._syncPendingControls() || n,
            !1
          );
          return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
        }
        _forEachChild(e) {
          this.controls.forEach((n, r) => {
            e(n, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((e) => e.enabled || this.disabled)
            .map((e) => e.value);
        }
        _anyControls(e) {
          return this.controls.some((n) => n.enabled && e(n));
        }
        _setUpControls() {
          this._forEachChild((e) => this._registerControl(e));
        }
        _allControlsDisabled() {
          for (const e of this.controls) if (e.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(e) {
          e.setParent(this),
            e._registerOnCollectionChange(this._onCollectionChange);
        }
      }
      const U1 = { provide: We, useExisting: X(() => Ea) },
        vi = (() => Promise.resolve(null))();
      let Ea = (() => {
        class t extends We {
          constructor(n, r) {
            super(),
              (this.submitted = !1),
              (this._directives = new Set()),
              (this.ngSubmit = new le()),
              (this.form = new Id({}, gd(n), md(r)));
          }
          ngAfterViewInit() {
            this._setUpdateStrategy();
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          get controls() {
            return this.form.controls;
          }
          addControl(n) {
            vi.then(() => {
              const r = this._findContainer(n.path);
              (n.control = r.registerControl(n.name, n.control)),
                gi(n.control, n),
                n.control.updateValueAndValidity({ emitEvent: !1 }),
                this._directives.add(n);
            });
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            vi.then(() => {
              const r = this._findContainer(n.path);
              r && r.removeControl(n.name), this._directives.delete(n);
            });
          }
          addFormGroup(n) {
            vi.then(() => {
              const r = this._findContainer(n.path),
                o = new Id({});
              (function PD(t, e) {
                Dd(t, e);
              })(o, n),
                r.registerControl(n.name, o),
                o.updateValueAndValidity({ emitEvent: !1 });
            });
          }
          removeFormGroup(n) {
            vi.then(() => {
              const r = this._findContainer(n.path);
              r && r.removeControl(n.name);
            });
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            vi.then(() => {
              this.form.get(n.path).setValue(r);
            });
          }
          setValue(n) {
            this.control.setValue(n);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function VD(t, e) {
                t._syncPendingControls(),
                  e.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this._directives),
              this.ngSubmit.emit(n),
              !1
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n) {
            this.form.reset(n), (this.submitted = !1);
          }
          _setUpdateStrategy() {
            this.options &&
              null != this.options.updateOn &&
              (this.form._updateOn = this.options.updateOn);
          }
          _findContainer(n) {
            return n.pop(), n.length ? this.form.get(n) : this.form;
          }
        }
        return (
          (t.??fac = function (n) {
            return new (n || t)(_(Be, 10), _(kn, 10));
          }),
          (t.??dir = T({
            type: t,
            selectors: [
              ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
              ["ng-form"],
              ["", "ngForm", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                Le("submit", function (i) {
                  return r.onSubmit(i);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { options: ["ngFormOptions", "options"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [se([U1]), Q],
          })),
          t
        );
      })();
      const $1 = { provide: Vn, useExisting: X(() => Rd) },
        WD = (() => Promise.resolve(null))();
      let Rd = (() => {
          class t extends Vn {
            constructor(n, r, o, i, s) {
              super(),
                (this._changeDetectorRef = s),
                (this.control = new GD()),
                (this._registered = !1),
                (this.update = new le()),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function Ed(t, e) {
                  if (!e) return null;
                  let n, r, o;
                  return (
                    Array.isArray(e),
                    e.forEach((i) => {
                      i.constructor === fa
                        ? (n = i)
                        : (function V1(t) {
                            return Object.getPrototypeOf(t.constructor) === or;
                          })(i)
                        ? (r = i)
                        : (o = i);
                    }),
                    o || r || n || null
                  );
                })(0, i));
            }
            ngOnChanges(n) {
              if ((this._checkForErrors(), !this._registered || "name" in n)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = n.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in n && this._updateDisabled(n),
                (function Cd(t, e) {
                  if (!t.hasOwnProperty("model")) return !1;
                  const n = t.model;
                  return !!n.isFirstChange() || !Object.is(e, n.currentValue);
                })(n, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              gi(this.control, this),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(n) {
              WD.then(() => {
                var r;
                this.control.setValue(n, { emitViewToModelChange: !1 }),
                  null === (r = this._changeDetectorRef) ||
                    void 0 === r ||
                    r.markForCheck();
              });
            }
            _updateDisabled(n) {
              const r = n.isDisabled.currentValue,
                o = "" === r || (r && "false" !== r);
              WD.then(() => {
                var i;
                o && !this.control.disabled
                  ? this.control.disable()
                  : !o && this.control.disabled && this.control.enable(),
                  null === (i = this._changeDetectorRef) ||
                    void 0 === i ||
                    i.markForCheck();
              });
            }
            _getPath(n) {
              return this._parent
                ? (function ma(t, e) {
                    return [...e.path, t];
                  })(n, this._parent)
                : [n];
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(
                _(We, 9),
                _(Be, 10),
                _(kn, 10),
                _(Xt, 10),
                _(Is, 8)
              );
            }),
            (t.??dir = T({
              type: t,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [se([$1]), Q, pt],
            })),
            t
          );
        })(),
        QD = (() => {
          class t {}
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??dir = T({
              type: t,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            t
          );
        })();
      const G1 = { provide: Xt, useExisting: X(() => xd), multi: !0 };
      let xd = (() => {
          class t extends or {
            writeValue(n) {
              this.setProperty("value", null == n ? "" : n);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                n("" == r ? null : parseFloat(r));
              };
            }
          }
          return (
            (t.??fac = (function () {
              let e;
              return function (r) {
                return (e || (e = Fe(t)))(r || t);
              };
            })()),
            (t.??dir = T({
              type: t,
              selectors: [
                ["input", "type", "number", "formControlName", ""],
                ["input", "type", "number", "formControl", ""],
                ["input", "type", "number", "ngModel", ""],
              ],
              hostBindings: function (n, r) {
                1 & n &&
                  Le("input", function (i) {
                    return r.onChange(i.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              features: [se([G1]), Q],
            })),
            t
          );
        })(),
        ZD = (() => {
          class t {}
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??mod = tt({ type: t })),
            (t.??inj = Qe({})),
            t
          );
        })(),
        pF = (() => {
          class t {}
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??mod = tt({ type: t })),
            (t.??inj = Qe({ imports: [[ZD]] })),
            t
          );
        })(),
        gF = (() => {
          class t {}
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??mod = tt({ type: t })),
            (t.??inj = Qe({ imports: [pF] })),
            t
          );
        })(),
        mF = (() => {
          class t {
            constructor(n, r) {
              (this.service = n),
                (this.router = r),
                (this.aoTransferir = new le());
            }
            transferir() {
              console.log("Solicitada nova Transferencia"),
                this.service
                  .adicionar({ valor: this.valor, destino: this.destino })
                  .subscribe(
                    (r) => {
                      console.log(r),
                        this.limparCampos(),
                        this.router.navigateByUrl("extrato");
                    },
                    (r) => console.error(r)
                  );
            }
            limparCampos() {
              (this.valor = 0), (this.destino = 0);
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(zc), _(Ye));
            }),
            (t.??cmp = lr({
              type: t,
              selectors: [["app-nova-transferencia"]],
              outputs: { aoTransferir: "aoTransferir" },
              decls: 15,
              vars: 2,
              consts: [
                [1, "container"],
                [1, "formulario", 3, "ngSubmit"],
                [1, "formulario__titulo"],
                [1, "form-field"],
                ["for", "valor", 1, "form-field__label"],
                [
                  "id",
                  "valor",
                  "type",
                  "number",
                  "name",
                  "valor",
                  1,
                  "form-field__input",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["for", "destino", 1, "form-field__label"],
                [
                  "id",
                  "destino",
                  "type",
                  "text",
                  "name",
                  "destino",
                  1,
                  "form-field__input",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                [1, "botao-wrapper"],
                ["type", "submit", 1, "botao"],
              ],
              template: function (n, r) {
                1 & n &&
                  (fe(0, "section", 0)(1, "form", 1),
                  Le("ngSubmit", function () {
                    return r.transferir();
                  }),
                  fe(2, "h2", 2),
                  Ge(3, "Nova Transfer\xeancia"),
                  ae(),
                  fe(4, "div", 3)(5, "label", 4),
                  Ge(6, "Valor"),
                  ae(),
                  fe(7, "input", 5),
                  Le("ngModelChange", function (i) {
                    return (r.valor = i);
                  }),
                  ae()(),
                  fe(8, "div", 3)(9, "label", 6),
                  Ge(10, "Destino"),
                  ae(),
                  fe(11, "input", 7),
                  Le("ngModelChange", function (i) {
                    return (r.destino = i);
                  }),
                  ae()(),
                  fe(12, "div", 8)(13, "button", 9),
                  Ge(14, "Transferir"),
                  ae()()()()),
                  2 & n &&
                    (Tn(7),
                    $r("ngModel", r.valor),
                    Tn(4),
                    $r("ngModel", r.destino));
              },
              directives: [QD, ND, Ea, xd, fa, xD, Rd],
              styles: [
                ".formulario[_ngcontent-%COMP%]{background-color:#fff;padding:16px;border-radius:4px;box-shadow:0 0 8px #0000001a}.formulario__titulo[_ngcontent-%COMP%]{text-transform:capitalize;color:var(--primary)}.form-field[_ngcontent-%COMP%]{width:100%;margin-top:15px;margin-bottom:15px;display:flex;flex-direction:column;color:var(--primary)}.form-field__label[_ngcontent-%COMP%]{color:inherit;margin-bottom:4px;font-size:12px}.form-field__input[_ngcontent-%COMP%]{padding:8px;border-radius:4px;color:inherit;border:2px solid;outline:none}.botao-wrapper[_ngcontent-%COMP%]{display:flex}.botao[_ngcontent-%COMP%]{background-color:var(--primary);color:#fff;display:block;flex:1;border:none;border-radius:4px;font-size:16px;padding:.5em;cursor:pointer;transition:opacity .2s}.botao--cancelar[_ngcontent-%COMP%]{background-color:var(--secondary);margin-left:20px}.botao[_ngcontent-%COMP%]:hover{opacity:.8}",
              ],
            })),
            t
          );
        })();
      function yF(t, e) {
        if (
          (1 & t &&
            (fe(0, "tr", 8)(1, "td", 9),
            Ge(2),
            ku(3, "date"),
            ae(),
            fe(4, "td", 9),
            Ge(5),
            ku(6, "currency"),
            ae(),
            fe(7, "td", 9),
            Ge(8),
            ae()()),
          2 & t)
        ) {
          const n = e.$implicit;
          Tn(2),
            Bo(" ", Vu(3, 3, n.data, "short"), " "),
            Tn(3),
            Bo(" ", Vu(6, 6, n.valor, "BRL"), " "),
            Tn(3),
            Au(n.destino);
        }
      }
      function vF(t, e) {
        if (
          (1 & t && (fe(0, "tbody"), hs(1, yF, 9, 9, "tr", 7), ae()), 2 & t)
        ) {
          const n = Sg();
          Tn(1), $r("ngForOf", n.transferencias);
        }
      }
      function _F(t, e) {
        1 & t && (fe(0, "p"), Ge(1, "Nenhum Gasto cadastrado"), ae());
      }
      const DF = [
        { path: "", redirectTo: "extrato", pathMatch: "full" },
        {
          path: "extrato",
          component: (() => {
            class t {
              constructor(n) {
                this.service = n;
              }
              ngOnInit() {
                this.service.todas().subscribe((n) => {
                  console.table(n), (this.transferencias = n);
                });
              }
            }
            return (
              (t.??fac = function (n) {
                return new (n || t)(_(zc));
              }),
              (t.??cmp = lr({
                type: t,
                selectors: [["app-extrato"]],
                decls: 14,
                vars: 2,
                consts: [
                  [1, "container"],
                  [1, "titulo"],
                  [1, "tabela"],
                  [1, "tabela__cabecalho"],
                  [1, "tabela__cabecalho__conteudo"],
                  [4, "ngIf", "ngIfElse"],
                  ["listaVazia", ""],
                  ["class", "tabela__linha", 4, "ngFor", "ngForOf"],
                  [1, "tabela__linha"],
                  [1, "tabela__conteudo"],
                ],
                template: function (n, r) {
                  if (
                    (1 & n &&
                      (fe(0, "section", 0)(1, "h2", 1),
                      Ge(2, "Registro de Gastos"),
                      ae(),
                      fe(3, "table", 2)(4, "thead", 3)(5, "th", 4),
                      Ge(6, "Data"),
                      ae(),
                      fe(7, "th", 4),
                      Ge(8, "Valor"),
                      ae(),
                      fe(9, "th", 4),
                      Ge(10, "Destino"),
                      ae()(),
                      hs(11, vF, 2, 1, "tbody", 5),
                      ae(),
                      hs(12, _F, 2, 0, "ng-template", null, 6, fy),
                      ae()),
                    2 & n)
                  ) {
                    const o = (function fg(t) {
                      return hr(
                        (function kE() {
                          return S.lFrame.contextLView;
                        })(),
                        20 + t
                      );
                    })(13);
                    Tn(11),
                      $r(
                        "ngIf",
                        (null == r.transferencias
                          ? null
                          : r.transferencias.length) > 0
                      )("ngIfElse", o);
                  }
                },
                directives: [vv, mv],
                pipes: [Cv, wv],
                styles: [
                  ".titulo[_ngcontent-%COMP%]{text-align:center;font-size:24px;margin-bottom:16px}.tabela[_ngcontent-%COMP%]{text-align:center;margin:0 auto;background-color:#fff;box-shadow:0 0 8px #0000001a}.tabela__cabecalho[_ngcontent-%COMP%]{color:var(--primary)}.tabela__cabecalho__conteudo[_ngcontent-%COMP%]{padding:10px;border-bottom:2px solid green}.tabela__linha[_ngcontent-%COMP%]{margin-bottom:10px;border-radius:4px}.tabela__linha[_ngcontent-%COMP%]:last-child   .tabela__conteudo[_ngcontent-%COMP%]{border-bottom:none}.tabela__conteudo[_ngcontent-%COMP%]{padding:10px;border-bottom:1px solid var(--cinza-claro)}",
                ],
              })),
              t
            );
          })(),
        },
        { path: "nova-transferencia", component: mF },
      ];
      let CF = (() => {
          class t {}
          return (
            (t.??fac = function (n) {
              return new (n || t)();
            }),
            (t.??mod = tt({ type: t })),
            (t.??inj = Qe({ imports: [[rD.forRoot(DF)], rD] })),
            t
          );
        })(),
        EF = (() => {
          class t {
            constructor(n) {
              (this.service = n), (this.title = "myApp");
            }
          }
          return (
            (t.??fac = function (n) {
              return new (n || t)(_(zc));
            }),
            (t.??cmp = lr({
              type: t,
              selectors: [["app-root"]],
              decls: 7,
              vars: 0,
              consts: [
                ["routerLink", "extrato"],
                [
                  "routerLink",
                  "nova-transferencia",
                  "routerLinkActive",
                  "ativo",
                ],
              ],
              template: function (n, r) {
                1 & n &&
                  (fe(0, "header")(1, "a", 0),
                  Ge(2, "Registros"),
                  ae(),
                  fe(3, "a", 1),
                  Ge(4, "Nova Transfer\xeancia"),
                  ae()(),
                  fe(5, "main"),
                  gs(6, "router-outlet"),
                  ae());
              },
              directives: [da, Y_, ad],
              styles: [
                "header[_ngcontent-%COMP%]{background-color:var(--primary);padding:10px;color:#fff;display:flex;justify-content:space-between}header[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:inherit;text-decoration:none}header[_ngcontent-%COMP%]   .ativo[_ngcontent-%COMP%]{display:none}main[_ngcontent-%COMP%]{background-color:#fcfcfc;padding:var(--padding)}",
              ],
            })),
            t
          );
        })();
      const wt = void 0,
        bF = [
          "pt",
          [["AM", "PM"], wt, wt],
          wt,
          [
            ["D", "S", "T", "Q", "Q", "S", "S"],
            ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "s\xe1b."],
            [
              "domingo",
              "segunda-feira",
              "ter\xe7a-feira",
              "quarta-feira",
              "quinta-feira",
              "sexta-feira",
              "s\xe1bado",
            ],
            ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "s\xe1b."],
          ],
          wt,
          [
            ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
            [
              "jan.",
              "fev.",
              "mar.",
              "abr.",
              "mai.",
              "jun.",
              "jul.",
              "ago.",
              "set.",
              "out.",
              "nov.",
              "dez.",
            ],
            [
              "janeiro",
              "fevereiro",
              "mar\xe7o",
              "abril",
              "maio",
              "junho",
              "julho",
              "agosto",
              "setembro",
              "outubro",
              "novembro",
              "dezembro",
            ],
          ],
          wt,
          [["a.C.", "d.C."], wt, ["antes de Cristo", "depois de Cristo"]],
          0,
          [6, 0],
          [
            "dd/MM/y",
            "d 'de' MMM 'de' y",
            "d 'de' MMMM 'de' y",
            "EEEE, d 'de' MMMM 'de' y",
          ],
          ["HH:mm", "HH:mm:ss", "HH:mm:ss z", "HH:mm:ss zzzz"],
          ["{1} {0}", wt, wt, wt],
          [
            ",",
            ".",
            ";",
            "%",
            "+",
            "-",
            "E",
            "\xd7",
            "\u2030",
            "\u221e",
            "NaN",
            ":",
          ],
          ["#,##0.###", "#,##0%", "\xa4\xa0#,##0.00", "#E0"],
          "BRL",
          "R$",
          "Real brasileiro",
          {
            AUD: ["AU$", "$"],
            JPY: ["JP\xa5", "\xa5"],
            PHP: [wt, "\u20b1"],
            PTE: ["Esc."],
            RON: [wt, "L"],
            SYP: [wt, "S\xa3"],
            THB: ["\u0e3f"],
            TWD: ["NT$"],
            USD: ["US$", "$"],
          },
          "ltr",
          function wF(t) {
            const n = Math.floor(Math.abs(t));
            return n === Math.floor(n) && n >= 0 && n <= 1 ? 1 : 5;
          },
        ];
      function hC(t, e, n, r, o, i, s) {
        try {
          var a = t[i](s),
            l = a.value;
        } catch (u) {
          return void n(u);
        }
        a.done ? e(l) : Promise.resolve(l).then(r, o);
      }
      class AF {
        createDb() {
          return (function MF(t) {
            return function () {
              var e = this,
                n = arguments;
              return new Promise(function (r, o) {
                var i = t.apply(e, n);
                function s(l) {
                  hC(i, r, o, s, a, "next", l);
                }
                function a(l) {
                  hC(i, r, o, s, a, "throw", l);
                }
                s(void 0);
              });
            };
          })(function* () {
            return {
              transferencias: [
                {
                  id: "1",
                  valor: 35,
                  destino: "Invertimentos Fii's",
                  data: "2020-11-04T16:30:10.710Z",
                },
                {
                  id: "2",
                  valor: 40,
                  destino: "Gasolina",
                  data: "2020-11-04T21:24:10.710Z",
                },
                {
                  id: "3",
                  valor: 12.5,
                  destino: "Lanche",
                  data: "2020-11-05T21:14:10.710Z",
                },
                {
                  valor: 150,
                  destino: "internet",
                  data: "2022-03-31T11:35:52.979Z",
                  id: "dyAtPXS",
                },
                {
                  valor: 25,
                  destino: "Arrumar Pneu",
                  data: "2022-03-31T11:38:04.275Z",
                  id: "QanEhR_",
                },
                {
                  valor: 47.66,
                  destino: "Aliexpress",
                  data: "2022-03-31T11:39:40.155Z",
                  id: "D620Y_I",
                },
                {
                  valor: 102.66,
                  destino: "internet atrasada",
                  data: "2022-03-31T14:52:49.981Z",
                  id: "3V9CRDs",
                },
              ],
            };
          })();
        }
      }
      !(function dR(t, e, n) {
        (function IA(t, e, n) {
          "string" != typeof e && ((n = e), (e = t[E.LocaleId])),
            (e = e.toLowerCase().replace(/_/g, "-")),
            (qr[e] = t),
            n && (qr[e][E.ExtraData] = n);
        })(t, e, n);
      })(bF, "pt");
      let TF = (() => {
        class t {}
        return (
          (t.??fac = function (n) {
            return new (n || t)();
          }),
          (t.??mod = tt({ type: t, bootstrap: [EF] })),
          (t.??inj = Qe({
            providers: [
              { provide: hn, useValue: "pt" },
              { provide: Oy, useValue: "BRL" },
            ],
            imports: [[yx, gF, Hx, CF, Xx.forRoot(AF)]],
          })),
          t
        );
      })();
      (function nI() {
        qy = !1;
      })(),
        gx()
          .bootstrapModule(TF)
          .catch((t) => console.error(t));
    },
  },
  (Y) => {
    Y((Y.s = 702));
  },
]);
