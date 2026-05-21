// ==UserScript==
// @name        Pinboard
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @connect     api.telegram.org
// @connect     api.vxtwitter.com
// @version     2.8.1
// @author      gabszap
// @description Adds an internal bookmark system and tags to X, replacing the Grok button.
// ==/UserScript==

(function () {
  'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var STORAGE_KEY = 'x_internal_bookmarks';
  var TAGS_KEY = 'x_bookmark_tags';
  var BOOKMARK_ICON_SVG = "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" aria-hidden=\"true\" class=\"r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1hdv0qi\" style=\"display:block; flex-shrink:0;\"><g><path d=\"M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z\"></path></g></svg>";
  var ICON_TAG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\"/><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/></svg>";
  var ICON_TRASH = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/><path d=\"M3 6h18\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/></svg>";
  var ICON_X = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/></svg>";
  var ICON_BROOM = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M12 2v11\"/><rect x=\"8\" y=\"13\" width=\"8\" height=\"3\" rx=\".5\"/><path d=\"m8 16-3 6h14l-3-6\"/></svg>";
  var ICON_SETTINGS = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>";
  var ICON_GRID = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"/></svg>";
  var ICON_STATS = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M3 3v18h18\"/><rect width=\"3\" height=\"7\" x=\"7\" y=\"10\" rx=\"1\"/><rect width=\"3\" height=\"12\" x=\"13\" y=\"5\" rx=\"1\"/><rect width=\"3\" height=\"4\" x=\"19\" y=\"13\" rx=\"1\" transform=\"translate(-1 0)\"/></svg>";
  var ICON_EXTERNAL_LINK = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M15 3h6v6\"/><path d=\"M10 14 21 3\"/><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/></svg>";
  var ICON_CALENDAR = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/></svg>";
  var ICON_DOWNLOAD = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M12 15V3\"/><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><path d=\"m7 10 5 5 5-5\"/></svg>";
  var ICON_STAR = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"none\"><path d=\"M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.037 6.27a1 1 0 0 0 .95.69h6.593c.969 0 1.371 1.24.588 1.81l-5.334 3.876a1 1 0 0 0-.364 1.118l2.037 6.27c.3.922-.755 1.688-1.539 1.118l-5.334-3.876a1 1 0 0 0-1.176 0l-5.334 3.876c-.783.57-1.838-.196-1.539-1.118l2.037-6.27a1 1 0 0 0-.364-1.118L.881 11.697c-.783-.57-.38-1.81.588-1.81h6.593a1 1 0 0 0 .95-.69z\"/></svg>";
  var ICON_MERGE = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"11\" y=\"11\" width=\"10\" height=\"10\" rx=\"2\"/></svg>";
  var ICON_VIDEO = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m22 8-6 4 6 4V8Z\"/><rect width=\"14\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\" ry=\"2\"/></svg>";
  var ICON_PENCIL_SMALL = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z\"/></svg>";
  var ICON_USER = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></svg>";
  var ICON_CLOUD = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"/></svg>";
  var ICON_CLOUD_OFF = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"m2 2 20 20\"/><path d=\"M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193\"/><path d=\"M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7 7 0 0 0 8 5.17\"/></svg>";
  var ICON_TELEGRAM = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"currentColor\" style=\"vertical-align: middle;\"><path d=\"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z\"/></svg>";
  var ICON_TELEGRAM_BADGE = ICON_CLOUD.replace('width="16"', 'width="14"').replace('height="16"', 'height="14"');
  var ICON_TWITTER = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 32 32\" fill=\"currentColor\" style=\"vertical-align: middle;\"><path d=\"M25.2 1.54h4.91l-10.72 12.25L32 30.46h-9.87l-7.73-10.11-8.85 10.11H0.63l11.47-13.11L0 1.54h10.13l6.99 9.24ZM23.48 27.53h2.72L8.65 4.32H5.73Z\"/></svg>";
  var ICON_CHEVRON_DOWN = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m6 9 6 6 6-6\"/></svg>";
  var ICON_CHEVRON_UP = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m18 15-6-6-6 6\"/></svg>";
  var ICON_CHEVRON_LEFT = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M15.5 5 8.5 12l7 7\"/></svg>";
  var ICON_CHEVRON_RIGHT = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m8.5 5 7 7-7 7\"/></svg>";
  var ICON_EYE = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>";
  var ICON_EYE_OFF = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9.88 9.88a3 3 0 1 0 4.24 4.24\"/><path d=\"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68\"/><path d=\"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61\"/><line x1=\"2\" x2=\"22\" y1=\"2\" y2=\"22\"/></svg>";
  var ICON_CHECK = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 6 9 17l-5-5\"/></svg>";
  var ICON_PALETTE = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\"/><path d=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z\"/></svg>";
  var ICON_REFRESH = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M20 11a8.1 8.1 0 0 0-15.5-2.6\"/><path d=\"M4 5v4h4\"/><path d=\"M4 13a8.1 8.1 0 0 0 15.5 2.6\"/><path d=\"M20 19v-4h-4\"/></svg>";
  var BLUE_COLOR = 'rgb(29, 155, 240)';
  var GRAY_COLOR = 'rgb(113, 118, 123)';
  var IN_POST_ACTION_BUTTON_SIZE = '32px';
  var IN_POST_ACTION_BUTTON_GAP = '-8px';
  var LOCAL_FONT_STACK = 'Aptos, "Segoe UI Variable", "SF Pro Display", "Segoe UI", sans-serif';
  var VERSION = GM_info.script.version;
  var SETTINGS_KEY = 'x_bookmark_settings';
  var AUTOTAG_RULES_KEY = 'x_bookmark_autotag_rules';
  var TELEGRAM_ROUTES_KEY = 'x_bookmark_telegram_routes';
  var DEFAULT_SETTINGS = {
    showUserLabel: true,
    hideOverlays: false,
    gridPhotoHeight: 300,
    galleryTitle: 'Meus Bookmarks',
    autoTagVideos: true,
    autoplayVideos: true,
    shortcuts: {
      openGallery: 'ctrl+b',
      closeModal: 'escape',
      toggleView: 'g',
      openSettings: 's'
    },
    telegramAutoBackup: true,
    telegramToken: '',
    telegramChatId: '',
    telegramUploadMode: 'document',
    telegramFilterTags: [],
    collapsedSections: [],
    debugMode: false
  };

  // Estado da galeria
  var currentFilter = {
    tags: [],
    search: '',
    sort: 'newest_added'
  };
  var selectedItems = new Set();
  var isListeningForShortcut = false; // Flag para evitar conflito ao definir novos atalhos
  var currentPage = 1;
  var ITEMS_PER_PAGE = 24;
  var filteredCount = 0;

  // ==================== STORAGE ====================
  function getBookmarks() {
    var bookmarks = GM_getValue(STORAGE_KEY, []);
    var migrated = false;
    bookmarks.forEach(function (b) {
      if (b.catboxUrls && !b.telegramUrls) {
        b.telegramUrls = b.catboxUrls;
        delete b.catboxUrls;
        migrated = true;
      }
    });
    if (migrated) {
      setTimeout(function () {
        return saveBookmarks(bookmarks);
      }, 100);
    }
    return bookmarks;
  }
  function saveBookmarks(bookmarks) {
    GM_setValue(STORAGE_KEY, bookmarks);
  }
  function getTags() {
    return GM_getValue(TAGS_KEY, []);
  }
  function saveTags(tags) {
    GM_setValue(TAGS_KEY, tags);
  }
  function getSettings() {
    var saved = GM_getValue(SETTINGS_KEY, {});
    // Deep merge para objetos aninhados como shortcuts
    return _objectSpread(_objectSpread(_objectSpread({}, DEFAULT_SETTINGS), saved), {}, {
      shortcuts: _objectSpread(_objectSpread({}, DEFAULT_SETTINGS.shortcuts), saved.shortcuts || {})
    });
  }
  function saveSetting(key, value) {
    var settings = getSettings();
    settings[key] = value;
    GM_setValue(SETTINGS_KEY, settings);
  }
  function getAutotagRules() {
    return GM_getValue(AUTOTAG_RULES_KEY, []);
  }
  function saveAutotagRules(rules) {
    GM_setValue(AUTOTAG_RULES_KEY, normalizeAutotagRules(rules));
  }
  function normalizeAutotagUsername(username) {
    var trimmedUsername = (username || '').trim().replace(/^@+/, '');
    if (!trimmedUsername) return '';
    return '@' + trimmedUsername;
  }
  function getAutotagUsernameKey(username) {
    var normalizedUsername = normalizeAutotagUsername(username);
    if (!normalizedUsername) return '';
    return normalizedUsername.toLowerCase();
  }
  function normalizeAutotagRule(rule) {
    if (!rule || !rule.username || !rule.tag) return null;
    var username = normalizeAutotagUsername(rule.username);
    var tag = String(rule.tag).trim();
    if (!username || !tag) return null;
    return {
      username: username,
      tag: tag
    };
  }
  function normalizeAutotagRules(rules) {
    var normalizedRules = [];
    var usernameByKey = {};
    if (!rules || !rules.length) return normalizedRules;
    for (var i = 0; i < rules.length; i++) {
      var normalizedRule = normalizeAutotagRule(rules[i]);
      if (!normalizedRule) continue;
      var usernameKey = getAutotagUsernameKey(normalizedRule.username);
      if (!usernameKey) continue;
      var canonicalUsername = usernameByKey[usernameKey];
      if (!canonicalUsername) {
        canonicalUsername = normalizedRule.username;
        usernameByKey[usernameKey] = canonicalUsername;
      }
      var isDuplicate = false;
      for (var j = 0; j < normalizedRules.length; j++) {
        var existingRule = normalizedRules[j];
        var existingUsernameKey = getAutotagUsernameKey(existingRule.username);
        if (existingUsernameKey === usernameKey && existingRule.tag === normalizedRule.tag) {
          isDuplicate = true;
          break;
        }
      }
      if (isDuplicate) continue;
      normalizedRules.push({
        username: canonicalUsername,
        tag: normalizedRule.tag
      });
    }
    return normalizedRules;
  }
  function getNormalizedAutotagRules() {
    return normalizeAutotagRules(getAutotagRules());
  }
  function getAutotagTagsForUsername(username) {
    var usernameKey = getAutotagUsernameKey(username);
    if (!usernameKey) return [];
    var tags = [];
    getNormalizedAutotagRules().forEach(function (rule) {
      if (getAutotagUsernameKey(rule.username) !== usernameKey) return;
      if (tags.includes(rule.tag)) return;
      tags.push(rule.tag);
    });
    return tags;
  }
  function upsertAutotagRulesForUsername(previousUsername, nextUsername, tags) {
    var formattedNextUsername = normalizeAutotagUsername(nextUsername);
    var formattedPreviousUsername = normalizeAutotagUsername(previousUsername);
    var nextUsernameKey = getAutotagUsernameKey(formattedNextUsername);
    var previousUsernameKey = getAutotagUsernameKey(formattedPreviousUsername);
    var cleanTags = [];
    tags.forEach(function (tag) {
      var cleanTag = String(tag || '').trim();
      if (!cleanTag || cleanTags.includes(cleanTag)) return;
      cleanTags.push(cleanTag);
    });
    if (!formattedNextUsername || cleanTags.length === 0) return {
      saved: false,
      count: 0,
      username: formattedNextUsername
    };
    var normalizedRules = getNormalizedAutotagRules();
    var isRenamingToAnotherUsername = previousUsernameKey && previousUsernameKey !== nextUsernameKey;
    var nextUsernameAlreadyExists = false;
    for (var i = 0; i < normalizedRules.length; i++) {
      if (getAutotagUsernameKey(normalizedRules[i].username) !== nextUsernameKey) continue;
      nextUsernameAlreadyExists = true;
      break;
    }
    if (isRenamingToAnotherUsername && nextUsernameAlreadyExists) {
      return {
        saved: false,
        count: 0,
        username: formattedNextUsername,
        conflict: true
      };
    }
    var rules = normalizedRules.filter(function (rule) {
      var ruleUsernameKey = getAutotagUsernameKey(rule.username);
      return ruleUsernameKey !== previousUsernameKey && ruleUsernameKey !== nextUsernameKey;
    });
    cleanTags.forEach(function (tag) {
      rules.push({
        username: formattedNextUsername,
        tag: tag
      });
    });
    saveAutotagRules(rules);
    return {
      saved: true,
      count: cleanTags.length,
      username: formattedNextUsername
    };
  }
  function getTelegramRoutes() {
    return GM_getValue(TELEGRAM_ROUTES_KEY, []);
  }
  function saveTelegramRoutes(routes) {
    GM_setValue(TELEGRAM_ROUTES_KEY, routes);
  }

  // ==================== FEEDBACK VISUAL ====================
  function showSaveIndicator(inputElement) {
    var _inputElement$parentE;
    if (!inputElement) return;

    // Adicionar estilos de animação se não existirem
    if (!document.getElementById('pinboard-save-indicator-style')) {
      var style = document.createElement('style');
      style.id = 'pinboard-save-indicator-style';
      style.textContent = "\n                @keyframes saveGlow {\n                    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }\n                    50% { box-shadow: 0 0 8px 2px rgba(34, 197, 94, 0.3); }\n                    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }\n                }\n                @keyframes checkFadeIn {\n                    from { opacity: 0; transform: scale(0.8); }\n                    to { opacity: 1; transform: scale(1); }\n                }\n                @keyframes checkFadeOut {\n                    from { opacity: 1; transform: scale(1); }\n                    to { opacity: 0; transform: scale(0.8); }\n                }\n            ";
      document.head.appendChild(style);
    }

    // Aplicar glow verde no input
    inputElement.style.animation = 'saveGlow 1s ease';
    setTimeout(function () {
      return inputElement.style.animation = '';
    }, 1000);

    // Criar checkmark indicator
    var existingCheck = (_inputElement$parentE = inputElement.parentElement) === null || _inputElement$parentE === void 0 ? void 0 : _inputElement$parentE.querySelector('.save-check-indicator');
    if (existingCheck) existingCheck.remove();
    var checkmark = document.createElement('span');
    checkmark.className = 'save-check-indicator';
    checkmark.innerHTML = ICON_CHECK;
    checkmark.style = "\n            position: absolute; right: 10px; top: 50%; transform: translateY(-50%);\n            color: #22c55e; display: flex; align-items: center;\n            animation: checkFadeIn 0.2s ease;\n        ";

    // Garantir que o parent tem position relative
    var parent = inputElement.parentElement;
    if (parent && getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    if (parent) {
      parent.appendChild(checkmark);
      setTimeout(function () {
        checkmark.style.animation = 'checkFadeOut 0.3s ease forwards';
        setTimeout(function () {
          return checkmark.remove();
        }, 300);
      }, 1200);
    }
  }

  // ==================== TELEGRAM BACKUP ====================
  // Normaliza URLs do Twitter para máxima qualidade (4096x4096)
  function formatTwitterUrl(src) {
    if (!src) return '';
    // Limpar formatos antigos (pipe fallback)
    if (src.includes('|')) src = src.split('|')[0];
    if (src.includes('twimg.com')) {
      // Ignorar vídeos
      if (src.includes('.mp4') || src.includes('video.twimg.com')) return src;

      // Forçar resolução máxima 4k
      if (src.includes('name=')) return src.replace(/name=[^&]+/, 'name=4096x4096');
      if (src.includes('?')) return src + '&name=4096x4096';
    }
    return src;
  }
  function isSaveableMediaSource(src) {
    if (!src) return false;
    src = String(src);
    if (src.indexOf('pbs.twimg.com/media') > -1) return true;
    if (src.indexOf('video.twimg.com') > -1) return true;
    if (src.indexOf('.mp4') > -1) return true;
    if (src.indexOf('video_thumb') > -1) return true;
    if (src.indexOf('ext_tw_video_thumb') > -1) return true;
    if (src.indexOf('tweet_video_thumb') > -1) return true;
    return false;
  }
  function isWithinQuotedPost(article, element) {
    if (!article || !element) return false;
    var quotedArea = article.querySelector('[data-testid="quotedTweet"]');
    if (quotedArea && quotedArea.contains(element)) return true;
    var condensedMedia = article.querySelector('[data-testid="testCondensedMedia"]');
    if (condensedMedia && condensedMedia.contains(element)) return true;
    return false;
  }
  function getSaveableMediaElements(article) {
    var mediaElements = [];
    if (!article) return mediaElements;
    var candidates = article.querySelectorAll('div[data-testid="tweetPhoto"] img, div[data-testid="videoComponent"] video, div[data-testid="videoComponent"] img, div[data-testid="videoPlayer"] video, div[data-testid="videoPlayer"] img');
    candidates.forEach(function (element) {
      var tagName = element.tagName.toLowerCase();
      var src = tagName === 'video' ? element.poster || element.src : element.src;
      if (isWithinQuotedPost(article, element)) return;
      if (tagName === 'video') {
        mediaElements.push(element);
        return;
      }
      if (!isSaveableMediaSource(src)) return;
      mediaElements.push(element);
    });
    return mediaElements;
  }
  function getLightboxMediaElement() {
    return document.querySelector('[data-testid="swipe-to-dismiss"] img[src*="pbs.twimg.com/media"]') || document.querySelector('[role="dialog"] img[src*="pbs.twimg.com/media"]') || document.querySelector('div[aria-modal="true"] img[src*="pbs.twimg.com/media"]') || document.querySelector('[role="dialog"] video') || document.querySelector('div[aria-modal="true"] video');
  }
  function getArticleStatusUrl(article) {
    if (!article) return '';
    var quotedArea = article.querySelector('[data-testid="quotedTweet"]');
    var allTimeElements = article.querySelectorAll('time');
    for (var i = 0; i < allTimeElements.length; i++) {
      var timeEl = allTimeElements[i];
      var link = timeEl.parentElement;
      if (quotedArea && quotedArea.contains(timeEl)) continue;
      if (link && link.getAttribute('href')) return normalizeStatusUrl('https://x.com' + link.getAttribute('href'));
    }
    return '';
  }
  function getCurrentStatusUrl() {
    if (!isStatusOrMediaPath(window.location.pathname)) return '';
    return normalizeStatusUrl(window.location.href);
  }
  function hasStatusPhotoRouteLightboxMedia(article) {
    if (!article || !/\/photo\/\d+\/?$/.test(window.location.pathname || '')) return false;
    var currentStatusUrl = getCurrentStatusUrl();
    var articleStatusUrl = getArticleStatusUrl(article);
    if (currentStatusUrl && articleStatusUrl && currentStatusUrl !== articleStatusUrl) return false;
    return !!getLightboxMediaElement();
  }
  function hasSaveableMedia(article) {
    return getSaveableMediaElements(article).length > 0 || hasStatusPhotoRouteLightboxMedia(article);
  }
  function getActionMediaElements(article) {
    var mediaElements = getSaveableMediaElements(article);
    var lightboxMedia;
    if (mediaElements.length > 0) return mediaElements;
    lightboxMedia = getLightboxMediaElement();
    if (lightboxMedia) mediaElements.push(lightboxMedia);
    return mediaElements;
  }
  function normalizeStatusUrl(url) {
    if (!url) return '';
    var cleanUrl = String(url).split('?')[0].split('#')[0];
    return cleanUrl.replace(/\/photo\/\d+\/?$/, '').replace(/\/video\/\d+\/?$/, '');
  }
  function isStatusOrMediaPath(path) {
    return /^\/[a-zA-Z0-9_]{1,15}\/status\/\d+(\/(photo|video)\/\d+)?\/?$/.test(path || '');
  }
  function getPinboardRouteInjectionDelays() {
    var delays = [0, 100, 350, 900];
    if (/\/(photo|video)\/\d+\/?$/.test(window.location.pathname || '')) {
      delays.push(1600);
      delays.push(2600);
    }
    return delays;
  }
  function handlePinboardRouteChanged() {
    var delays = getPinboardRouteInjectionDelays();
    for (var i = 0; i < delays.length; i++) {
      if (delays[i] === 0) {
        injectButtons();
        continue;
      }
      setTimeout(injectButtons, delays[i]);
    }
  }
  function installPinboardRouteWatcher() {
    if (window.__pinboardRouteWatcherInstalled) return;
    window.__pinboardRouteWatcherInstalled = true;
    var lastUrl = window.location.href;
    function handleRouteMaybeChanged() {
      if (window.location.href === lastUrl) return;
      lastUrl = window.location.href;
      clearPinboardPhotoRouteChecks();
      handlePinboardRouteChanged();
    }
    function wrapHistoryMethod(methodName) {
      var originalMethod = history[methodName];
      if (!originalMethod) return;
      history[methodName] = function () {
        var result = originalMethod.apply(this, arguments);
        handlePinboardRouteChanged();
        setTimeout(handleRouteMaybeChanged, 0);
        return result;
      };
    }
    wrapHistoryMethod('pushState');
    wrapHistoryMethod('replaceState');
    window.addEventListener('popstate', handlePinboardRouteChanged);
    window.addEventListener('hashchange', handlePinboardRouteChanged);
  }
  function applyInPostActionButtonSize(button) {
    if (!button) return;
    button.style.width = IN_POST_ACTION_BUTTON_SIZE;
    button.style.height = IN_POST_ACTION_BUTTON_SIZE;
    button.style.minWidth = IN_POST_ACTION_BUTTON_SIZE;
    button.style.minHeight = IN_POST_ACTION_BUTTON_SIZE;
    button.style.padding = '0';
    button.style.flex = '0 0 ' + IN_POST_ACTION_BUTTON_SIZE;
    button.style.overflow = 'hidden';
    button.style.borderRadius = '9999px';
  }
  function setBookmarkButtonVisualState(button, iconContainer, postUrl, isHovered) {
    var isSaved = postUrl && isBookmarked(postUrl);
    var restingColor = isSaved ? BLUE_COLOR : GRAY_COLOR;
    if (button) {
      button.setAttribute('data-pinboard-resting-color', restingColor);
      button.style.backgroundColor = isHovered ? 'rgba(29, 155, 240, 0.1)' : 'transparent';
    }
    if (iconContainer) {
      iconContainer.style.color = isHovered ? BLUE_COLOR : restingColor;
    }
  }
  function getBookmarkById(bookmarkId) {
    if (!bookmarkId) return null;
    var bookmarks = getBookmarks();
    for (var i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].id === bookmarkId) return bookmarks[i];
    }
    return null;
  }
  function getBookmarkByPostUrl(postUrl) {
    if (!postUrl) return null;
    var normalizedPostUrl = normalizeStatusUrl(postUrl);
    var bookmarks = getBookmarks();
    for (var i = 0; i < bookmarks.length; i++) {
      if (normalizeStatusUrl(bookmarks[i].postUrl) === normalizedPostUrl) return bookmarks[i];
    }
    return null;
  }
  function getCleanUniqueTags(tags) {
    var cleanTags = [];
    if (!tags || !tags.length) return cleanTags;
    for (var i = 0; i < tags.length; i++) {
      var tag = String(tags[i] || '').trim();
      if (!tag || cleanTags.includes(tag)) continue;
      cleanTags.push(tag);
    }
    return cleanTags;
  }
  function addGlobalTagIfNeeded(tag) {
    var cleanTag = String(tag || '').trim();
    if (!cleanTag) return '';
    var tags = getTags();
    if (!tags.includes(cleanTag)) {
      tags.push(cleanTag);
      saveTags(tags);
    }
    return cleanTag;
  }
  function saveBookmarkTags(bookmarkId, tags) {
    var cleanTags = getCleanUniqueTags(tags);
    var bookmarks = getBookmarks();
    var updatedBookmark = null;
    for (var i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].id !== bookmarkId) continue;
      bookmarks[i].tags = cleanTags;
      updatedBookmark = bookmarks[i];
      break;
    }
    if (!updatedBookmark) return null;
    saveBookmarks(bookmarks);
    if (document.getElementById('pinboard-gallery')) updateGalleryContent();
    return updatedBookmark;
  }
  function setQuickTagButtonVisualState(button, postUrl, isHovered) {
    if (!button) return;
    var isSaved = postUrl && isBookmarked(postUrl);
    button.style.display = isSaved ? 'inline-flex' : 'none';
    button.style.backgroundColor = isHovered ? 'rgba(29, 155, 240, 0.1)' : 'transparent';
    var iconContainer = button.querySelector('[data-pinboard-quick-tag-icon="true"]') || button.querySelector('svg') && button.querySelector('svg').parentElement;
    if (iconContainer) iconContainer.style.color = isHovered ? BLUE_COLOR : GRAY_COLOR;
  }
  function updateQuickTagButtonsForPost(postUrl) {
    var buttons = document.querySelectorAll('button[data-pinboard-quick-tag-injected="true"]');
    buttons.forEach(function (button) {
      if (button.getAttribute('data-pinboard-post-url') !== postUrl) return;
      setQuickTagButtonVisualState(button, postUrl, false);
    });
  }
  function isPinboardModalArtifact(element) {
    if (!element) return false;
    if (element.id === 'fx-reveal-overlay') return false;
    if (element.getAttribute && element.getAttribute('data-pinboard-overlay') === 'true') return true;
    if (element.id === 'pinboard-gallery') return true;
    if (element.id === 'pinboard-stats-overlay') return true;
    if (element.id === 'pinboard-settings-overlay') return true;
    if (element.id === 'pinboard-autotag-overlay') return true;
    if (element.id === 'pinboard-telegram-routes-overlay') return true;
    if (element.id === 'pinboard-image-viewer') return true;
    if (element.id === 'pinboard-quick-tag-popover') return true;
    if (!element.id && element.style && (element.style.zIndex === '10001' || element.style.zIndex === '10002')) return true;
    return false;
  }
  function getPinboardModalArtifacts() {
    var candidates = document.querySelectorAll('[data-pinboard-overlay="true"], [style*="z-index: 10001"], [style*="z-index: 10002"], #pinboard-gallery, #pinboard-quick-tag-popover');
    var artifacts = [];
    candidates.forEach(function (element) {
      if (element.parentNode !== document.body) return;
      if (!isPinboardModalArtifact(element)) return;
      artifacts.push(element);
    });
    return artifacts;
  }
  function closePinboardModalArtifacts() {
    getPinboardModalArtifacts().forEach(function (element) {
      element.remove();
    });
  }
  function closePinboardGallery() {
    document.body.style.overflow = '';
    closePinboardModalArtifacts();
  }
  function clearPinboardPhotoRouteChecks() {
    var checkedArticles = document.querySelectorAll('article[data-pinboard-photo-route-checked]');
    checkedArticles.forEach(function (article) {
      article.removeAttribute('data-pinboard-photo-route-checked');
    });
  }
  function getHeaderValue(rawHeaders, headerName) {
    if (!rawHeaders) return '';
    var escaped = headerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp("^".concat(escaped, ":\\s*(.+)$"), 'im');
    var match = rawHeaders.match(re);
    return match ? match[1].trim() : '';
  }
  function guessImageExtension(mimeType, fallbackUrl) {
    var type = (mimeType || '').toLowerCase();
    if (type.includes('mp4') || type.includes('video')) return 'mp4';
    if (type.includes('png')) return 'png';
    if (type.includes('webp')) return 'webp';
    if (type.includes('gif')) return 'gif';
    if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
    var cleanUrl = (fallbackUrl || '').split('?')[0].toLowerCase();
    if (cleanUrl.endsWith('.mp4')) return 'mp4';
    if (cleanUrl.endsWith('.png')) return 'png';
    if (cleanUrl.endsWith('.webp')) return 'webp';
    if (cleanUrl.endsWith('.gif')) return 'gif';
    return 'jpg';
  }
  function downloadUrlAsBlob(url) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        onload: function onload(response) {
          if (response.status < 200 || response.status >= 300 || !response.response) {
            reject(new Error("Falha ao baixar original (".concat(response.status, ")")));
            return;
          }
          var contentType = getHeaderValue(response.responseHeaders || '', 'content-type') || 'application/octet-stream';
          resolve(new Blob([response.response], {
            type: contentType
          }));
        },
        onerror: function onerror() {
          return reject(new Error('Erro de rede ao baixar imagem original'));
        }
      });
    });
  }

  // Verifica se o bot está configurado corretamente chamando getMe
  function validateTelegramCredentials(_x) {
    return _validateTelegramCredentials.apply(this, arguments);
  }
  function _validateTelegramCredentials() {
    _validateTelegramCredentials = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(token) {
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            if (token) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2, {
              valid: false,
              error: 'Token vazio'
            });
          case 1:
            return _context9.a(2, new Promise(function (resolve) {
              GM_xmlhttpRequest({
                method: 'GET',
                url: "https://api.telegram.org/bot".concat(token, "/getMe"),
                onload: function onload(response) {
                  try {
                    var data = JSON.parse(response.responseText);
                    if (data.ok) {
                      resolve({
                        valid: true,
                        botName: data.result.username
                      });
                    } else {
                      resolve({
                        valid: false,
                        error: data.description || 'Token inválido'
                      });
                    }
                  } catch (e) {
                    resolve({
                      valid: false,
                      error: 'Resposta inválida da API'
                    });
                  }
                },
                onerror: function onerror() {
                  return resolve({
                    valid: false,
                    error: 'Erro de rede'
                  });
                }
              });
            }));
        }
      }, _callee7);
    }));
    return _validateTelegramCredentials.apply(this, arguments);
  }
  function validateTelegramChat(token, chatId) {
    return new Promise(function (resolve) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: "https://api.telegram.org/bot".concat(token, "/getChat?chat_id=").concat(encodeURIComponent(chatId)),
        onload: function onload(response) {
          try {
            var data = JSON.parse(response.responseText);
            if (data.ok) {
              resolve({
                valid: true,
                title: data.result.title || data.result.first_name || data.result.username || 'Chat'
              });
            } else {
              resolve({
                valid: false,
                error: data.description
              });
            }
          } catch (e) {
            resolve({
              valid: false,
              error: 'Resposta inválida'
            });
          }
        },
        onerror: function onerror() {
          return resolve({
            valid: false,
            error: 'Erro de rede'
          });
        }
      });
    });
  }
  function getTelegramFileUrl(fileId) {
    var token = getSettings().telegramToken;
    if (!token || !fileId) return Promise.reject(new Error('Token ou file_id ausente'));
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: "https://api.telegram.org/bot".concat(token, "/getFile?file_id=").concat(encodeURIComponent(fileId)),
        onload: function onload(response) {
          try {
            var _data$result;
            var data = JSON.parse(response.responseText);
            if (!data.ok || !((_data$result = data.result) !== null && _data$result !== void 0 && _data$result.file_path)) {
              reject(new Error(data.description || 'getFile falhou'));
              return;
            }
            var fileUrl = "https://api.telegram.org/file/bot".concat(token, "/").concat(data.result.file_path);
            // Nova chamada em formato binário para contornar bloqueio CSP do Twitter
            GM_xmlhttpRequest({
              method: 'GET',
              url: fileUrl,
              responseType: 'arraybuffer',
              onload: function onload(fileRes) {
                if (fileRes.status === 200) {
                  var _fileRes$responseHead;
                  var headerMatch = (_fileRes$responseHead = fileRes.responseHeaders) === null || _fileRes$responseHead === void 0 ? void 0 : _fileRes$responseHead.match(/content-type:\s*([^\r\n]*)/i);
                  var contentType = headerMatch ? headerMatch[1].trim() : 'image/jpeg';
                  var blob = new Blob([fileRes.response], {
                    type: contentType
                  });
                  resolve(URL.createObjectURL(blob));
                } else {
                  reject(new Error('Falha ao carregar conteúdo blob CSP bypass'));
                }
              },
              onerror: function onerror() {
                return reject(new Error('Erro de rede no CSP bypass'));
              }
            });
          } catch (e) {
            reject(new Error('Resposta inválida do getFile'));
          }
        },
        onerror: function onerror() {
          return reject(new Error('Falha de rede no getFile'));
        }
      });
    });
  }

  // Envia um blob para o chat do Telegram via sendDocument e/ou sendPhoto com base nas configurações
  function uploadToTelegram(_x2, _x3, _x4) {
    return _uploadToTelegram.apply(this, arguments);
  }
  function _uploadToTelegram() {
    _uploadToTelegram = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(blob, filename, caption) {
      var threadId,
        settings,
        token,
        chatId,
        mode,
        isVideo,
        sendPhoto,
        sendVideo,
        sendDocument,
        photoId,
        _yield$Promise$all,
        _yield$Promise$all2,
        docId,
        _photoId,
        finalId,
        _args0 = arguments,
        _t9;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            threadId = _args0.length > 3 && _args0[3] !== undefined ? _args0[3] : null;
            settings = getSettings();
            token = settings.telegramToken;
            chatId = settings.telegramChatId;
            mode = settings.telegramUploadMode || 'document'; // 'document', 'photo', 'both'
            if (!(!token || !chatId)) {
              _context0.n = 1;
              break;
            }
            return _context0.a(2, Promise.reject(new Error('Telegram não configurado: insira o token e o Chat ID nas configurações')));
          case 1:
            isVideo = filename.toLowerCase().endsWith('.mp4');
            sendPhoto = function sendPhoto() {
              return new Promise(function (resolve) {
                var photoData = new FormData();
                photoData.append('chat_id', chatId);
                if (threadId) photoData.append('message_thread_id', threadId);
                if (typeof blob === 'string') {
                  photoData.append('photo', blob);
                } else {
                  photoData.append('photo', blob, filename);
                }
                if (caption) photoData.append('caption', caption);
                if (getSettings().debugMode) {
                  console.log("[pinboard] sendPhoto disparado para chat_id=".concat(chatId, ", topic=").concat(threadId));
                  console.log('[Telegram Upload Payload]', {
                    threadId: threadId,
                    mode: mode,
                    chatId: chatId,
                    formDataKeys: Array.from(photoData.keys())
                  });
                }
                GM_xmlhttpRequest({
                  method: 'POST',
                  url: "https://api.telegram.org/bot".concat(token, "/sendPhoto"),
                  data: photoData,
                  onload: function onload(response) {
                    try {
                      var _data$result2;
                      var data = JSON.parse(response.responseText);
                      if (data.ok && (_data$result2 = data.result) !== null && _data$result2 !== void 0 && _data$result2.photo) {
                        var largestPhoto = data.result.photo.pop();
                        resolve(largestPhoto.file_id ? "tg:".concat(largestPhoto.file_id) : null);
                      } else {
                        resolve(null);
                      }
                    } catch (e) {
                      resolve(null);
                    }
                  },
                  onerror: function onerror(e) {
                    console.error('[pinboard] Erro no sendPhoto:', e);
                    resolve(null);
                  }
                });
              });
            };
            sendVideo = function sendVideo() {
              return new Promise(function (resolve, reject) {
                var formData = new FormData();
                formData.append('chat_id', chatId);
                if (threadId) formData.append('message_thread_id', threadId);
                if (typeof blob === 'string') {
                  formData.append('video', blob);
                } else {
                  formData.append('video', blob, filename);
                }
                if (caption) formData.append('caption', caption);
                if (getSettings().debugMode) console.log("[pinboard] sendVideo disparado para chat_id=".concat(chatId, ", topic=").concat(threadId));
                GM_xmlhttpRequest({
                  method: 'POST',
                  url: "https://api.telegram.org/bot".concat(token, "/sendVideo"),
                  data: formData,
                  onload: function onload(response) {
                    try {
                      var _data$result3;
                      var data = JSON.parse(response.responseText);
                      if (!data.ok) {
                        reject(new Error(data.description || 'Telegram API error no sendVideo'));
                        return;
                      }
                      var fileId = (_data$result3 = data.result) === null || _data$result3 === void 0 || (_data$result3 = _data$result3.video) === null || _data$result3 === void 0 ? void 0 : _data$result3.file_id;
                      resolve(fileId ? "tg:".concat(fileId) : null);
                    } catch (e) {
                      reject(new Error('Resposta inválida do Telegram no sendVideo'));
                    }
                  },
                  onerror: function onerror() {
                    return reject(new Error('Falha de rede no upload para o Telegram'));
                  }
                });
              });
            };
            sendDocument = function sendDocument() {
              return new Promise(function (resolve, reject) {
                var formData = new FormData();
                formData.append('chat_id', chatId);
                if (threadId) formData.append('message_thread_id', threadId);
                if (typeof blob === 'string') {
                  formData.append('document', blob);
                } else {
                  formData.append('document', blob, filename);
                }
                if (caption) formData.append('caption', caption);
                if (getSettings().debugMode) console.log("[pinboard] sendDocument disparado para chat_id=".concat(chatId, ", topic=").concat(threadId));
                GM_xmlhttpRequest({
                  method: 'POST',
                  url: "https://api.telegram.org/bot".concat(token, "/sendDocument"),
                  data: formData,
                  onload: function onload(response) {
                    try {
                      var _data$result4;
                      var data = JSON.parse(response.responseText);
                      if (!data.ok) {
                        reject(new Error(data.description || 'Telegram API error no sendDocument'));
                        return;
                      }
                      var fileId = (_data$result4 = data.result) === null || _data$result4 === void 0 || (_data$result4 = _data$result4.document) === null || _data$result4 === void 0 ? void 0 : _data$result4.file_id;
                      resolve(fileId ? "tg:".concat(fileId) : null);
                    } catch (e) {
                      reject(new Error('Resposta inválida do Telegram no sendDocument'));
                    }
                  },
                  onerror: function onerror() {
                    return reject(new Error('Falha de rede no upload para o Telegram'));
                  }
                });
              });
            };
            _context0.p = 2;
            if (!isVideo) {
              _context0.n = 6;
              break;
            }
            if (!(mode === 'document')) {
              _context0.n = 4;
              break;
            }
            _context0.n = 3;
            return sendDocument();
          case 3:
            return _context0.a(2, _context0.v);
          case 4:
            _context0.n = 5;
            return sendVideo();
          case 5:
            return _context0.a(2, _context0.v);
          case 6:
            if (!(mode === 'photo')) {
              _context0.n = 9;
              break;
            }
            _context0.n = 7;
            return sendPhoto();
          case 7:
            photoId = _context0.v;
            if (photoId) {
              _context0.n = 8;
              break;
            }
            throw new Error('Falha ao enviar foto');
          case 8:
            return _context0.a(2, photoId);
          case 9:
            if (!(mode === 'both')) {
              _context0.n = 12;
              break;
            }
            _context0.n = 10;
            return Promise.all([sendDocument().catch(function (e) {
              console.error('Erro doc fallback both:', e);
              return null;
            }), sendPhoto().catch(function (e) {
              console.error('Erro photo fallback both:', e);
              return null;
            })]);
          case 10:
            _yield$Promise$all = _context0.v;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
            docId = _yield$Promise$all2[0];
            _photoId = _yield$Promise$all2[1];
            finalId = docId || _photoId;
            if (finalId) {
              _context0.n = 11;
              break;
            }
            throw new Error('Ambos os uploads (both mode) falharam.');
          case 11:
            return _context0.a(2, finalId);
          case 12:
            _context0.n = 13;
            return sendDocument();
          case 13:
            return _context0.a(2, _context0.v);
          case 14:
            _context0.n = 16;
            break;
          case 15:
            _context0.p = 15;
            _t9 = _context0.v;
            return _context0.a(2, Promise.reject(_t9));
          case 16:
            return _context0.a(2);
        }
      }, _callee8, null, [[2, 15]]);
    }));
    return _uploadToTelegram.apply(this, arguments);
  }
  function backupBookmarkImages(_x5) {
    return _backupBookmarkImages.apply(this, arguments);
  }
  function _backupBookmarkImages() {
    _backupBookmarkImages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(bookmarkId) {
      var _bookmark$postUrl$mat4, _bookmark$mergedImage;
      var options,
        _options$isManual,
        isManual,
        _options$progressInfo,
        progressInfo,
        _options$forceUpload,
        forceUpload,
        bookmarks,
        bookmark,
        settings,
        _bookmark$tags,
        hasTags,
        imagesToUpload,
        isMergeUpload,
        telegramUrls,
        allValid,
        handle,
        postId,
        routes,
        bTags,
        isFav,
        targetThreads,
        anyRouteMatched,
        shouldKeepInGeneral,
        targetsArray,
        debugMode,
        i,
        progressText,
        imgUrl,
        blob,
        ext,
        suffix,
        filename,
        caption,
        finalRef,
        t,
        tid,
        payload,
        ref,
        updatedBookmarks,
        idx,
        successCount,
        _args1 = arguments,
        _t0;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.p = _context1.n) {
          case 0:
            options = _args1.length > 1 && _args1[1] !== undefined ? _args1[1] : {};
            _options$isManual = options.isManual, isManual = _options$isManual === void 0 ? false : _options$isManual, _options$progressInfo = options.progressInfo, progressInfo = _options$progressInfo === void 0 ? null : _options$progressInfo, _options$forceUpload = options.forceUpload, forceUpload = _options$forceUpload === void 0 ? false : _options$forceUpload;
            bookmarks = getBookmarks();
            bookmark = bookmarks.find(function (b) {
              return b.id === bookmarkId;
            });
            if (!(!bookmark || !bookmark.images || bookmark.images.length === 0)) {
              _context1.n = 1;
              break;
            }
            return _context1.a(2);
          case 1:
            if (!(!forceUpload && bookmark.mergedImageUrl && bookmark.mergedImageUrl.startsWith('tg:'))) {
              _context1.n = 2;
              break;
            }
            if (isManual) {
              showToast('A mescla do post já possui backup cloud');
            }
            return _context1.a(2);
          case 2:
            // Verificar filtro de tags (apenas para backup automático)
            settings = getSettings();
            if (!(!isManual && settings.telegramFilterTags && settings.telegramFilterTags.length > 0)) {
              _context1.n = 3;
              break;
            }
            hasTags = (_bookmark$tags = bookmark.tags) === null || _bookmark$tags === void 0 ? void 0 : _bookmark$tags.some(function (t) {
              return settings.telegramFilterTags.includes(t);
            });
            if (hasTags) {
              _context1.n = 3;
              break;
            }
            console.log('[pinboard] Backup skipped: no matching filter tags');
            return _context1.a(2);
          case 3:
            // Se já tem telegramUrls completo, não faz nada
            // Array helper iterável (se mescla disponível e em HTTP, priorizamos o upload exclusivo delo mesclada ao invés do carrossel cortado)
            imagesToUpload = [];
            isMergeUpload = false;
            if (bookmark.mergedImageUrl && bookmark.mergedImageUrl.startsWith('https://')) {
              imagesToUpload = [bookmark.mergedImageUrl];
              isMergeUpload = true;
            } else {
              imagesToUpload = bookmark.images;
            }

            // Se já tem telegramUrls completo *com base na array ativa*, não faz nada
            telegramUrls = bookmark.telegramUrls || [];
            if (!(!isMergeUpload && telegramUrls.length === imagesToUpload.length)) {
              _context1.n = 4;
              break;
            }
            allValid = telegramUrls.every(function (url) {
              return url && url.startsWith('tg:');
            });
            if (!(allValid && !options.forceUpload)) {
              _context1.n = 4;
              break;
            }
            return _context1.a(2);
          case 4:
            handle = extractHandle(bookmark.postUrl) || 'unknown';
            postId = ((_bookmark$postUrl$mat4 = bookmark.postUrl.match(/status\/(\d+)/)) === null || _bookmark$postUrl$mat4 === void 0 ? void 0 : _bookmark$postUrl$mat4[1]) || bookmark.id; // --- PREPARAR ROTAS DE TÓPICOS ---
            routes = getTelegramRoutes();
            bTags = bookmark.tags || [];
            isFav = bookmark.isFavorite;
            targetThreads = new Set();
            anyRouteMatched = false;
            shouldKeepInGeneral = true;
            routes.forEach(function (r) {
              var matchFav = r.tag === '__FAVORITES__' && isFav;
              var matchTag = bTags.includes(r.tag);
              if (matchFav || matchTag) {
                anyRouteMatched = true;
                if (r.topicId) targetThreads.add(r.topicId);
                // Se QUALQUER rota matched explícita negar a cópia pro geral, respeitamos
                if (r.copyToGeneral === false) shouldKeepInGeneral = false;
              }
            });
            if (!anyRouteMatched || shouldKeepInGeneral) {
              targetThreads.add(null);
            }

            // Queremos garantir que o null (Geral) seja sempre o PRIMEIRO a subir pra gerar o file_id base
            targetsArray = Array.from(targetThreads).sort(function (a, b) {
              return a === null ? -1 : b === null ? 1 : 0;
            });
            debugMode = getSettings().debugMode;
            if (debugMode) console.log('[pinboard] Iniciando backup automático...', {
              postId: bookmark.id,
              bookmarkTags: bTags,
              isFavorite: isFav,
              routesMatched: routes.filter(function (r) {
                return bTags.includes(r.tag) || r.tag === '__FAVORITES__' && isFav;
              }),
              resolvedTargets: targetsArray,
              shouldKeepInGeneral: shouldKeepInGeneral
            });
            i = 0;
          case 5:
            if (!(i < imagesToUpload.length)) {
              _context1.n = 15;
              break;
            }
            if (!(!isMergeUpload && telegramUrls[i] && telegramUrls[i].startsWith('tg:') && !options.forceUpload)) {
              _context1.n = 6;
              break;
            }
            return _context1.a(3, 14);
          case 6:
            // Já tem
            progressText = void 0;
            if (progressInfo) {
              progressInfo.current++;
              progressText = "Fazendo backup ".concat(progressInfo.current, "/").concat(progressInfo.total, "...");
            } else {
              progressText = isMergeUpload ? "Fazendo backup da mescla..." : "Fazendo backup ".concat(i + 1, "/").concat(imagesToUpload.length, "...");
            }
            showToast(progressText);
            _context1.p = 7;
            // A formatTwitterUrl pega o formato certo pra download caso o direct link seja 'small' / 'thumb' etc
            imgUrl = isMergeUpload ? imagesToUpload[i] : formatTwitterUrl(imagesToUpload[i]);
            _context1.n = 8;
            return downloadUrlAsBlob(imgUrl);
          case 8:
            blob = _context1.v;
            ext = guessImageExtension(blob.type, imgUrl);
            suffix = isMergeUpload ? 'mescla' : "".concat(i + 1);
            filename = "@".concat(handle, "_").concat(postId, "_").concat(suffix, ".").concat(ext);
            caption = "@".concat(handle, " \u2014 ").concat(bookmark.postUrl);
            if (isFav) caption += ' | ⭐ Favorite';
            if (bTags.includes('AI?')) caption += ' | Possivelmente IA';else if (bTags.includes('Yes, AI')) caption += ' | é IA';
            finalRef = null;
            t = 0;
          case 9:
            if (!(t < targetsArray.length)) {
              _context1.n = 12;
              break;
            }
            tid = targetsArray[t]; // Na 1a iteração, envia o Blob. Nas demais, envia a ref (file_id) pra economizar banda e tempo.
            payload = t === 0 ? blob : finalRef.replace('tg:', '');
            _context1.n = 10;
            return uploadToTelegram(payload, filename, caption, tid);
          case 10:
            ref = _context1.v;
            if (t === 0) finalRef = ref;
          case 11:
            t++;
            _context1.n = 9;
            break;
          case 12:
            if (isMergeUpload) {
              bookmark.mergedImageUrl = finalRef;
            } else {
              telegramUrls[i] = finalRef || null;
            }
            _context1.n = 14;
            break;
          case 13:
            _context1.p = 13;
            _t0 = _context1.v;
            console.error('Telegram upload error:', _t0);
            if (!isMergeUpload) telegramUrls[i] = null; // Marca como falha
          case 14:
            i++;
            _context1.n = 5;
            break;
          case 15:
            // Atualizar bookmark com novos links
            updatedBookmarks = getBookmarks();
            idx = updatedBookmarks.findIndex(function (b) {
              return b.id === bookmarkId;
            });
            if (idx !== -1) {
              if (isMergeUpload) {
                updatedBookmarks[idx].mergedImageUrl = bookmark.mergedImageUrl;
              } else {
                updatedBookmarks[idx].telegramUrls = telegramUrls;
              }
              saveBookmarks(updatedBookmarks);
              console.log('[pinboard] Dados atualizados no array do Telegram/Mescla.');
            }
            successCount = isMergeUpload ? (_bookmark$mergedImage = bookmark.mergedImageUrl) !== null && _bookmark$mergedImage !== void 0 && _bookmark$mergedImage.startsWith('tg:') ? 1 : 0 : telegramUrls.filter(function (u) {
              return u && u.startsWith('tg:');
            }).length;
            showToast(isMergeUpload ? successCount ? 'Backup da mescla concluído' : 'Falha no backup da mescla' : "Backup conclu\xEDdo: ".concat(successCount, "/").concat(imagesToUpload.length, " imagens"));
          case 16:
            return _context1.a(2);
        }
      }, _callee9, null, [[7, 13]]);
    }));
    return _backupBookmarkImages.apply(this, arguments);
  }
  function getImageUrl(bookmark, index) {
    var _bookmark$telegramUrl;
    // Prioriza Twitter (CDN mais rápido) com 4k, fallback para Telegram
    var tgRef = (_bookmark$telegramUrl = bookmark.telegramUrls) === null || _bookmark$telegramUrl === void 0 ? void 0 : _bookmark$telegramUrl[index];
    var hasTelegramBackup = tgRef ? tgRef.startsWith('tg:') || tgRef.startsWith('https://') : false;
    if (bookmark.images && bookmark.images[index]) {
      // Usar formatTwitterUrl para garantir 4k
      var url4k = formatTwitterUrl(bookmark.images[index]);
      return {
        url: url4k,
        fallbackUrl: null,
        isFallback: false,
        hasTelegramBackup: hasTelegramBackup
      };
    }
    // Se não tem Twitter, não podemos retornar a URL do Telegram sincronamente se for tg:
    // Retornamos um dummy para engatilhar o onerror, ou a URL legacy se existir.
    if (tgRef && tgRef.startsWith('https://')) {
      return {
        url: tgRef,
        fallbackUrl: null,
        isFallback: true,
        hasTelegramBackup: true
      };
    } else if (tgRef && tgRef.startsWith('tg:')) {
      return {
        url: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
        fallbackUrl: null,
        isFallback: true,
        hasTelegramBackup: true
      };
    }
    return {
      url: null,
      fallbackUrl: null,
      isFallback: true,
      hasTelegramBackup: false
    };
  }
  function getMergedImageFilename(bookmark) {
    var _bookmark$postUrl$mat;
    var handle = extractHandle(bookmark.postUrl) || 'unknown';
    var postId = ((_bookmark$postUrl$mat = bookmark.postUrl.match(/status\/(\d+)/)) === null || _bookmark$postUrl$mat === void 0 ? void 0 : _bookmark$postUrl$mat[1]) || bookmark.id;
    return "@".concat(handle, "_").concat(postId, "_merged.jpg");
  }

  // ==================== LOCAL DOWNLOAD ====================
  function downloadImage(url, filename) {
    GM_download({
      url: url,
      name: filename,
      saveAs: false,
      onload: function onload() {
        return showToast("Download conclu\xEDdo: ".concat(filename));
      },
      onerror: function onerror(err) {
        console.error('[pinboard] Download failed:', err);
        showToast('Erro no download');
      }
    });
  }
  function loadImageFromBlob(_x6) {
    return _loadImageFromBlob.apply(this, arguments);
  }
  function _loadImageFromBlob() {
    _loadImageFromBlob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(blob) {
      var objectUrl, image, _t1;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.p = _context10.n) {
          case 0:
            objectUrl = URL.createObjectURL(blob);
            _context10.p = 1;
            _context10.n = 2;
            return new Promise(function (resolve, reject) {
              var img = new Image();
              img.onload = function () {
                return resolve(img);
              };
              img.onerror = function () {
                return reject(new Error('Falha ao decodificar imagem para mescla'));
              };
              img.src = objectUrl;
            });
          case 2:
            image = _context10.v;
            return _context10.a(2, {
              image: image,
              revoke: function revoke() {
                return URL.revokeObjectURL(objectUrl);
              }
            });
          case 3:
            _context10.p = 3;
            _t1 = _context10.v;
            URL.revokeObjectURL(objectUrl);
            throw _t1;
          case 4:
            return _context10.a(2);
        }
      }, _callee0, null, [[1, 3]]);
    }));
    return _loadImageFromBlob.apply(this, arguments);
  }
  function getMergeCandidates(_x7, _x8) {
    return _getMergeCandidates.apply(this, arguments);
  }
  function _getMergeCandidates() {
    _getMergeCandidates = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(bookmark, index) {
      var _bookmark$images2, _bookmark$telegramUrl3;
      var candidates, original, url4k, tgRef, url, _t10;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.p = _context11.n) {
          case 0:
            candidates = [];
            original = bookmark === null || bookmark === void 0 || (_bookmark$images2 = bookmark.images) === null || _bookmark$images2 === void 0 ? void 0 : _bookmark$images2[index];
            if (original) {
              url4k = formatTwitterUrl(original);
              if (url4k) candidates.push(url4k);
              if (url4k && url4k.includes('name=4096x4096')) {
                candidates.push(url4k.replace('name=4096x4096', 'name=large'));
              }
              if (original !== url4k) candidates.push(original);
            }
            tgRef = bookmark === null || bookmark === void 0 || (_bookmark$telegramUrl3 = bookmark.telegramUrls) === null || _bookmark$telegramUrl3 === void 0 ? void 0 : _bookmark$telegramUrl3[index];
            if (!tgRef) {
              _context11.n = 6;
              break;
            }
            if (!tgRef.startsWith('tg:')) {
              _context11.n = 5;
              break;
            }
            _context11.p = 1;
            _context11.n = 2;
            return getTelegramFileUrl(tgRef.slice(3));
          case 2:
            url = _context11.v;
            if (url) candidates.push(url);
            _context11.n = 4;
            break;
          case 3:
            _context11.p = 3;
            _t10 = _context11.v;
          case 4:
            _context11.n = 6;
            break;
          case 5:
            if (tgRef.startsWith('https://')) {
              candidates.push(tgRef);
            }
          case 6:
            return _context11.a(2, _toConsumableArray(new Set(candidates.filter(Boolean))));
        }
      }, _callee1, null, [[1, 3]]);
    }));
    return _getMergeCandidates.apply(this, arguments);
  }
  var mergeInProgressIds = new Set();
  function mergeBookmarkImages(_x9) {
    return _mergeBookmarkImages.apply(this, arguments);
  }
  function _mergeBookmarkImages() {
    _mergeBookmarkImages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(bookmark) {
      var decoded, failedIndexes, _bookmark$postUrl$mat5, idx, candidates, loaded, _iterator6, _step6, candidate, blob, decodedImage, targetWidth, drawHeights, totalHeight, canvas, ctx, y, outBlob, handle, postId, filename, _t11, _t12, _t13;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.p = _context12.n) {
          case 0:
            if (!(!bookmark || !Array.isArray(bookmark.images) || bookmark.images.length < 2)) {
              _context12.n = 1;
              break;
            }
            showToast('Este post precisa ter 2+ imagens para mesclar');
            return _context12.a(2, null);
          case 1:
            if (!bookmark.images.some(function (url) {
              return (url || '').toLowerCase().includes('.mp4');
            })) {
              _context12.n = 2;
              break;
            }
            showToast('Não é possível mesclar posts que contêm vídeos');
            return _context12.a(2, null);
          case 2:
            if (!mergeInProgressIds.has(bookmark.id)) {
              _context12.n = 3;
              break;
            }
            showToast('Mescla já em andamento para este post');
            return _context12.a(2, null);
          case 3:
            mergeInProgressIds.add(bookmark.id);
            decoded = [];
            failedIndexes = [];
            _context12.p = 4;
            showToast("Mesclando ".concat(bookmark.images.length, " imagens..."));
            idx = 0;
          case 5:
            if (!(idx < bookmark.images.length)) {
              _context12.n = 19;
              break;
            }
            _context12.n = 6;
            return getMergeCandidates(bookmark, idx);
          case 6:
            candidates = _context12.v;
            loaded = null;
            _iterator6 = _createForOfIteratorHelper(candidates);
            _context12.p = 7;
            _iterator6.s();
          case 8:
            if ((_step6 = _iterator6.n()).done) {
              _context12.n = 14;
              break;
            }
            candidate = _step6.value;
            _context12.p = 9;
            _context12.n = 10;
            return downloadUrlAsBlob(candidate);
          case 10:
            blob = _context12.v;
            _context12.n = 11;
            return loadImageFromBlob(blob);
          case 11:
            decodedImage = _context12.v;
            loaded = {
              image: decodedImage.image,
              revoke: decodedImage.revoke,
              source: candidate
            };
            return _context12.a(3, 14);
          case 12:
            _context12.p = 12;
            _t11 = _context12.v;
            console.warn("[pinboard] Merge: falha ao carregar imagem ".concat(idx + 1, " de"), candidate, _t11.message || _t11);
          case 13:
            _context12.n = 8;
            break;
          case 14:
            _context12.n = 16;
            break;
          case 15:
            _context12.p = 15;
            _t12 = _context12.v;
            _iterator6.e(_t12);
          case 16:
            _context12.p = 16;
            _iterator6.f();
            return _context12.f(16);
          case 17:
            if (!loaded) {
              failedIndexes.push(idx + 1);
            } else {
              decoded.push(loaded);
            }
          case 18:
            idx++;
            _context12.n = 5;
            break;
          case 19:
            if (!(failedIndexes.length > 0)) {
              _context12.n = 20;
              break;
            }
            throw new Error("Falha ao carregar imagem(ns): ".concat(failedIndexes.join(', ')));
          case 20:
            targetWidth = Math.max.apply(Math, _toConsumableArray(decoded.map(function (item) {
              return item.image.naturalWidth || item.image.width || 0;
            })));
            drawHeights = decoded.map(function (item) {
              var w = item.image.naturalWidth || item.image.width || 1;
              var h = item.image.naturalHeight || item.image.height || 1;
              return Math.max(1, Math.round(h * (targetWidth / w)));
            });
            totalHeight = drawHeights.reduce(function (sum, h) {
              return sum + h;
            }, 0);
            if (!(targetWidth < 2 || totalHeight < 2)) {
              _context12.n = 21;
              break;
            }
            throw new Error('Dimensões inválidas para mescla');
          case 21:
            if (!(targetWidth > 16384 || totalHeight > 32767)) {
              _context12.n = 22;
              break;
            }
            throw new Error('Imagem final muito grande para o navegador');
          case 22:
            canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = totalHeight;
            ctx = canvas.getContext('2d');
            if (ctx) {
              _context12.n = 23;
              break;
            }
            throw new Error('Não foi possível criar canvas para mescla');
          case 23:
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, targetWidth, totalHeight);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            y = 0;
            decoded.forEach(function (item, idx) {
              ctx.drawImage(item.image, 0, y, targetWidth, drawHeights[idx]);
              y += drawHeights[idx];
            });
            _context12.n = 24;
            return new Promise(function (resolve, reject) {
              canvas.toBlob(function (blob) {
                if (!blob) {
                  reject(new Error('Falha ao exportar imagem mesclada'));
                  return;
                }
                resolve(blob);
              }, 'image/jpeg', 0.96);
            });
          case 24:
            outBlob = _context12.v;
            handle = extractHandle(bookmark.postUrl) || 'unknown';
            postId = ((_bookmark$postUrl$mat5 = bookmark.postUrl.match(/status\/(\d+)/)) === null || _bookmark$postUrl$mat5 === void 0 ? void 0 : _bookmark$postUrl$mat5[1]) || bookmark.id;
            filename = "@".concat(handle, "_").concat(postId, "_merged.jpg");
            console.log('[pinboard] Merge concluido:', {
              bookmarkId: bookmark.id,
              imagens: bookmark.images.length,
              arquivo: filename,
              fontes: decoded.map(function (item) {
                return item.source;
              })
            });
            return _context12.a(2, {
              blob: outBlob,
              filename: filename,
              width: targetWidth,
              height: totalHeight
            });
          case 25:
            _context12.p = 25;
            _t13 = _context12.v;
            console.error('[pinboard] Falha ao mesclar imagens:', _t13);
            showToast("Erro na mescla: ".concat(_t13.message || 'falha desconhecida'));
            return _context12.a(2, null);
          case 26:
            _context12.p = 26;
            decoded.forEach(function (item) {
              try {
                item.revoke();
              } catch (_) {
                // ignore
              }
            });
            mergeInProgressIds.delete(bookmark.id);
            return _context12.f(26);
          case 27:
            return _context12.a(2);
        }
      }, _callee10, null, [[9, 12], [7, 15, 16, 17], [4, 25, 26, 27]]);
    }));
    return _mergeBookmarkImages.apply(this, arguments);
  }
  function saveMergedImageToGallery(_x0, _x1) {
    return _saveMergedImageToGallery.apply(this, arguments);
  }
  function _saveMergedImageToGallery() {
    _saveMergedImageToGallery = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(bookmark, mergeInfo) {
      var _bookmark$postUrl$mat6;
      var handle, postId, fileName, caption, telegramRef, mergedUrl, bookmarks, bmIdx;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            if (!(!bookmark || !mergeInfo || !mergeInfo.blob)) {
              _context13.n = 1;
              break;
            }
            return _context13.a(2, null);
          case 1:
            handle = extractHandle(bookmark.postUrl) || 'unknown';
            postId = ((_bookmark$postUrl$mat6 = bookmark.postUrl.match(/status\/(\d+)/)) === null || _bookmark$postUrl$mat6 === void 0 ? void 0 : _bookmark$postUrl$mat6[1]) || bookmark.id;
            fileName = "@".concat(handle, "_").concat(postId, "_merged_").concat(Date.now(), ".jpg");
            caption = "@".concat(handle, " \u2014 ").concat(bookmark.postUrl, " (mescla)"); // uploadToTelegram já retorna 'tg:{file_id}'
            _context13.n = 2;
            return uploadToTelegram(mergeInfo.blob, fileName, caption);
          case 2:
            telegramRef = _context13.v;
            if (telegramRef) {
              _context13.n = 3;
              break;
            }
            throw new Error('Telegram não retornou file_id para a imagem mesclada');
          case 3:
            // Armazenar como 'tg:{file_id}' — URL real obtida via getFile quando necessário
            mergedUrl = telegramRef;
            bookmarks = getBookmarks();
            bmIdx = bookmarks.findIndex(function (b) {
              return b.id === bookmark.id;
            });
            if (bmIdx !== -1) {
              bookmarks[bmIdx].mergedImageUrl = mergedUrl;
              bookmarks[bmIdx].mergedImageUpdatedAt = new Date().toISOString();
              saveBookmarks(bookmarks);
            }
            bookmark.mergedImageUrl = mergedUrl;
            bookmark.mergedImageUpdatedAt = new Date().toISOString();
            console.log('[pinboard] Mescla salva na galeria (Telegram):', {
              bookmarkId: bookmark.id,
              mergedUrl: mergedUrl
            });
            return _context13.a(2, mergedUrl);
        }
      }, _callee11);
    }));
    return _saveMergedImageToGallery.apply(this, arguments);
  }
  function downloadBookmarkImages(bookmark) {
    var _bookmark$postUrl$mat2;
    if (!bookmark || !bookmark.images || bookmark.images.length === 0) {
      showToast('Nenhuma imagem para baixar');
      return;
    }
    if (bookmark.mergedImageUrl) {
      var mergedFilename = getMergedImageFilename(bookmark);
      downloadImage(bookmark.mergedImageUrl, mergedFilename);
      showToast('Baixando imagem mesclada...');
      selectedItems.clear();
      return;
    }
    var handle = extractHandle(bookmark.postUrl) || 'unknown';
    var postId = ((_bookmark$postUrl$mat2 = bookmark.postUrl.match(/status\/(\d+)/)) === null || _bookmark$postUrl$mat2 === void 0 ? void 0 : _bookmark$postUrl$mat2[1]) || bookmark.id;
    bookmark.images.forEach(function (img, idx) {
      var _getImageUrl = getImageUrl(bookmark, idx),
        url = _getImageUrl.url;
      var ext = url.includes('.mp4') ? 'mp4' : url.includes('.png') ? 'png' : 'jpg';
      var filename = "".concat(handle, "_").concat(postId, "_").concat(idx + 1, ".").concat(ext);

      // Delay para evitar sobrecarga
      setTimeout(function () {
        return downloadImage(url, filename);
      }, idx * 300);
    });
    showToast("Baixando ".concat(bookmark.images.length, " imagem(ns)..."));
    selectedItems.clear();
  }
  function downloadSelectedItems() {
    if (selectedItems.size === 0) {
      showToast('Nenhum item selecionado');
      return;
    }
    var bookmarks = getBookmarks();
    var totalFiles = 0;
    var delayOffset = 0;
    selectedItems.forEach(function (id) {
      var bookmark = bookmarks.find(function (b) {
        return b.id === id;
      });
      if (bookmark && bookmark.images) {
        var _bookmark$postUrl$mat3;
        if (bookmark.mergedImageUrl) {
          var mergedFilename = getMergedImageFilename(bookmark);
          setTimeout(function () {
            return downloadImage(bookmark.mergedImageUrl, mergedFilename);
          }, delayOffset * 300);
          delayOffset++;
          totalFiles++;
          return;
        }
        var handle = extractHandle(bookmark.postUrl) || 'unknown';
        var postId = ((_bookmark$postUrl$mat3 = bookmark.postUrl.match(/status\/(\d+)/)) === null || _bookmark$postUrl$mat3 === void 0 ? void 0 : _bookmark$postUrl$mat3[1]) || bookmark.id;
        bookmark.images.forEach(function (img, idx) {
          var _getImageUrl2 = getImageUrl(bookmark, idx),
            url = _getImageUrl2.url;
          var ext = url.includes('.mp4') ? 'mp4' : url.includes('.png') ? 'png' : 'jpg';
          var filename = "@".concat(handle, "_").concat(postId, "_").concat(idx + 1, ".").concat(ext);
          setTimeout(function () {
            return downloadImage(url, filename);
          }, delayOffset * 300);
          delayOffset++;
          totalFiles++;
        });
      }
    });
    showToast("Baixando ".concat(totalFiles, " arquivo(s) de ").concat(selectedItems.size, " bookmark(s)..."));
    selectedItems.clear();
    updateGalleryContent();
    updateBulkUI();
  }
  function toggleBookmark(bookmark) {
    var bookmarks = getBookmarks();
    var index = bookmarks.findIndex(function (b) {
      return b.postUrl === bookmark.postUrl;
    });
    if (index !== -1) {
      bookmarks.splice(index, 1);
      saveBookmarks(bookmarks);
      return {
        action: 'removed',
        bookmarkId: null
      };
    } else {
      var settings = getSettings();

      // Auto-tag por regras (@username → tag)
      var handle = normalizeAutotagUsername(extractHandle(bookmark.postUrl));
      if (!bookmark.tags) bookmark.tags = [];
      getAutotagTagsForUsername(handle).forEach(function (tag) {
        if (bookmark.tags.includes(tag)) return;
        bookmark.tags.push(tag);
      });

      // Auto-tag para vídeos
      if (settings.autoTagVideos) {
        var hasVideo = bookmark.images && bookmark.images.some(function (u) {
          return (u || '').toLowerCase().includes('.mp4');
        });
        if (hasVideo && !bookmark.tags.includes('video')) {
          bookmark.tags.push('video');
          // Add 'video' to the global tags list if it doesn't exist
          var globalTags = getTags();
          if (!globalTags.includes('video')) {
            saveTags([].concat(_toConsumableArray(globalTags), ['video']));
          }
        }
      }
      bookmarks.push(bookmark);
      saveBookmarks(bookmarks);
      return {
        action: 'added',
        bookmarkId: bookmark.id
      };
    }
  }
  function isBookmarked(postUrl) {
    return getBookmarks().some(function (b) {
      return b.postUrl === postUrl;
    });
  }
  function extractHandle(postUrl) {
    var match = postUrl.match(/x\.com\/([^\/]+)\//);
    return match ? match[1] : '';
  }
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    var date = d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    var time = d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return "".concat(date, " ").concat(time);
  }
  function formatCompactNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  }
  function getCanonicalTagName(tag) {
    return String(tag || '').trim();
  }
  function getSortedCountEntries(counts, limit) {
    var entries = Object.keys(counts).map(function (key) {
      return {
        label: key,
        count: counts[key]
      };
    });
    entries.sort(function (a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label, 'pt-BR');
    });
    return entries.slice(0, limit);
  }
  function hasBackupUrl(urls) {
    return (urls || []).some(function (url) {
      return typeof url === 'string' && (url.startsWith('tg:') || url.startsWith('https://'));
    });
  }
  function calculateBookmarkStats(bookmarks, createdTags) {
    var userCounts = {};
    var tagCounts = {};
    var uniqueTags = {};
    var taggedBookmarks = 0;
    var bookmarksWithoutTags = 0;
    var favoriteBookmarks = 0;
    var totalMedia = 0;
    var videoBookmarks = 0;
    var backedUpBookmarks = 0;
    var totalAssignedTags = 0;
    var mostRecentTimestamp = null;
    (createdTags || []).forEach(function (tag) {
      var cleanTag = getCanonicalTagName(tag);
      if (cleanTag) uniqueTags[cleanTag] = true;
    });
    bookmarks.forEach(function (bookmark) {
      var handle = extractHandle(bookmark.postUrl || '');
      var userLabel = handle ? '@' + handle : '@desconhecido';
      var bookmarkTags = (bookmark.tags || []).map(getCanonicalTagName).filter(Boolean);
      var bookmarkImages = bookmark.images || [];
      userCounts[userLabel] = (userCounts[userLabel] || 0) + 1;
      totalMedia += bookmarkImages.length;
      if (bookmark.isFavorite) favoriteBookmarks++;
      if (bookmarkImages.some(function (url) {
        return String(url || '').toLowerCase().includes('.mp4');
      })) videoBookmarks++;
      if (hasBackupUrl(bookmark.telegramUrls) || hasBackupUrl([bookmark.mergedImageUrl])) backedUpBookmarks++;
      if (bookmark.timestamp && (!mostRecentTimestamp || new Date(bookmark.timestamp) > new Date(mostRecentTimestamp))) {
        mostRecentTimestamp = bookmark.timestamp;
      }
      if (bookmarkTags.length === 0) {
        bookmarksWithoutTags++;
        return;
      }
      taggedBookmarks++;
      totalAssignedTags += bookmarkTags.length;
      bookmarkTags.forEach(function (tag) {
        uniqueTags[tag] = true;
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return {
      totalBookmarks: bookmarks.length,
      favoriteBookmarks: favoriteBookmarks,
      taggedBookmarks: taggedBookmarks,
      bookmarksWithoutTags: bookmarksWithoutTags,
      totalTagsCreated: Object.keys(uniqueTags).length,
      totalMedia: totalMedia,
      videoBookmarks: videoBookmarks,
      backedUpBookmarks: backedUpBookmarks,
      averageTagsPerBookmark: bookmarks.length ? totalAssignedTags / bookmarks.length : 0,
      mostRecentTimestamp: mostRecentTimestamp,
      topUsers: getSortedCountEntries(userCounts, 10),
      topTags: getSortedCountEntries(tagCounts, 10)
    };
  }
  function createStatsMetric(label, value, note) {
    var card = document.createElement('div');
    card.style = 'background: linear-gradient(145deg, rgba(29,155,240,0.16), rgba(15,23,42,0.88)); border: 1px solid rgba(29,155,240,0.28); border-radius: 18px; padding: 14px; min-height: 76px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 14px 30px rgba(0,0,0,0.25);';
    var labelEl = document.createElement('span');
    labelEl.innerText = label;
    labelEl.style = 'color: #8b98a5; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;';
    var valueEl = document.createElement('strong');
    valueEl.innerText = value;
    valueEl.style = 'color: #f8fafc; font-size: 24px; line-height: 1.1; margin-top: 8px;';
    card.appendChild(labelEl);
    card.appendChild(valueEl);
    if (note) {
      var noteEl = document.createElement('span');
      noteEl.innerText = note;
      noteEl.style = 'color: #657786; font-size: 11px; margin-top: 6px;';
      card.appendChild(noteEl);
    }
    return card;
  }
  function createStatsList(title, entries, emptyLabel) {
    var section = document.createElement('div');
    section.style = 'background: rgba(10,12,16,0.82); border: 1px solid #263241; border-radius: 18px; padding: 16px; min-width: 0;';
    var heading = document.createElement('h3');
    heading.innerText = title;
    heading.style = 'margin: 0 0 12px 0; color: #e7e9ea; font-size: 15px; letter-spacing: 0.02em;';
    section.appendChild(heading);
    if (!entries.length) {
      var empty = document.createElement('p');
      empty.innerText = emptyLabel;
      empty.style = 'margin: 0; color: #657786; font-size: 13px;';
      section.appendChild(empty);
      return section;
    }
    entries.forEach(function (entry, index) {
      var row = document.createElement('div');
      row.style = 'display: grid; grid-template-columns: 28px minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 9px 0; border-top: ' + (index === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)') + ';';
      var rank = document.createElement('span');
      rank.innerText = '#' + (index + 1);
      rank.style = 'color: #1d9bf0; font-weight: 800; font-size: 12px;';
      var label = document.createElement('span');
      label.innerText = entry.label;
      label.title = entry.label;
      label.style = 'color: #f1f5f9; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
      var count = document.createElement('span');
      count.innerText = formatCompactNumber(entry.count);
      count.style = 'background: rgba(29,155,240,0.14); color: #7dd3fc; border: 1px solid rgba(29,155,240,0.26); padding: 3px 9px; border-radius: 999px; font-size: 12px; font-weight: 700;';
      row.appendChild(rank);
      row.appendChild(label);
      row.appendChild(count);
      section.appendChild(row);
    });
    return section;
  }
  function showStatisticsModal() {
    var existing = document.getElementById('pinboard-stats-overlay');
    if (existing) existing.remove();
    var bookmarks = getBookmarks();
    var stats = calculateBookmarkStats(bookmarks, getTags());
    var overlay = document.createElement('div');
    overlay.id = 'pinboard-stats-overlay';
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = "position: fixed; inset: 0; z-index: 10002; background: rgba(0,0,0,0.72); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 18px; font-family: ".concat(LOCAL_FONT_STACK, ";");
    var modal = document.createElement('div');
    modal.style = 'width: min(920px, calc(100vw - 36px)); max-height: calc(100vh - 48px); overflow-y: auto; border-radius: 26px; border: 1px solid #263241; background: radial-gradient(circle at top left, rgba(29,155,240,0.22), transparent 34%), linear-gradient(160deg, #111827 0%, #05070a 78%); color: white; box-shadow: 0 26px 80px rgba(0,0,0,0.72); animation: statsSlideUp 0.24s ease;';
    var header = document.createElement('div');
    header.style = 'display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 22px 22px 12px 22px;';
    var titleBlock = document.createElement('div');
    var eyebrow = document.createElement('div');
    eyebrow.innerText = 'PAINEL DO PINBOARD';
    eyebrow.style = 'color: #7dd3fc; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; margin-bottom: 8px;';
    var title = document.createElement('h2');
    title.innerText = 'Estatísticas';
    title.style = 'margin: 0; color: #f8fafc; font-size: 28px; letter-spacing: -0.03em;';
    var subtitle = document.createElement('p');
    subtitle.innerText = 'Resumo local calculado a partir dos seus favoritos e tags salvos.';
    subtitle.style = 'margin: 8px 0 0 0; color: #8b98a5; font-size: 13px;';
    titleBlock.appendChild(eyebrow);
    titleBlock.appendChild(title);
    titleBlock.appendChild(subtitle);
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = ICON_X;
    closeBtn.style = 'background: rgba(255,255,255,0.06); border: 1px solid #334155; color: #cbd5e1; border-radius: 14px; padding: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;';
    closeBtn.title = 'Fechar estatísticas';
    closeBtn.onmouseenter = function () {
      closeBtn.style.color = '#ef4444';
      closeBtn.style.borderColor = '#ef4444';
    };
    closeBtn.onmouseleave = function () {
      closeBtn.style.color = '#cbd5e1';
      closeBtn.style.borderColor = '#334155';
    };
    closeBtn.onclick = function () {
      return overlay.remove();
    };
    header.appendChild(titleBlock);
    header.appendChild(closeBtn);
    modal.appendChild(header);
    var content = document.createElement('div');
    content.style = 'padding: 12px 22px 22px 22px;';
    if (stats.totalBookmarks === 0) {
      var empty = document.createElement('div');
      empty.style = 'border: 1px dashed rgba(125,211,252,0.42); border-radius: 20px; padding: 28px; text-align: center; background: rgba(15,23,42,0.62);';
      empty.innerHTML = '<strong style="display:block; color:#f8fafc; font-size:18px; margin-bottom:8px;">Ainda não há favoritos salvos.</strong><span style="color:#8b98a5; font-size:13px;">Salve alguns posts para ver perfis mais salvos, tags mais usadas e atividade recente aqui.</span>';
      content.appendChild(empty);
      modal.appendChild(content);
      overlay.appendChild(modal);
      overlay.onclick = function (e) {
        if (e.target === overlay) overlay.remove();
      };
      document.body.appendChild(overlay);
      return;
    }
    var topUser = stats.topUsers[0];
    var topTag = stats.topTags[0];
    var metrics = document.createElement('div');
    metrics.style = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 14px;';
    metrics.appendChild(createStatsMetric('Bookmarks salvos', formatCompactNumber(stats.totalBookmarks), formatCompactNumber(stats.favoriteBookmarks) + ' marcados como favoritos'));
    metrics.appendChild(createStatsMetric('Perfil mais salvo', topUser ? topUser.label : '—', topUser ? formatCompactNumber(topUser.count) + ' bookmarks' : 'sem dados'));
    metrics.appendChild(createStatsMetric('Tag mais usada', topTag ? topTag.label : '—', topTag ? formatCompactNumber(topTag.count) + ' usos' : 'sem tags usadas'));
    metrics.appendChild(createStatsMetric('Tags criadas', formatCompactNumber(stats.totalTagsCreated), 'únicas/registradas'));
    content.appendChild(metrics);
    var secondary = document.createElement('div');
    secondary.style = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(138px, 1fr)); gap: 10px; margin-bottom: 16px;';
    secondary.appendChild(createStatsMetric('Favoritos', formatCompactNumber(stats.favoriteBookmarks), formatCompactNumber(stats.totalBookmarks) + ' total salvo'));
    secondary.appendChild(createStatsMetric('Média tags/fav', stats.averageTagsPerBookmark.toFixed(1).replace('.', ','), 'por bookmark'));
    secondary.appendChild(createStatsMetric('Mídias individuais', formatCompactNumber(stats.totalMedia), formatCompactNumber(stats.videoBookmarks) + ' com vídeo'));
    secondary.appendChild(createStatsMetric('Com backup', formatCompactNumber(stats.backedUpBookmarks), 'Telegram/links salvos'));
    secondary.appendChild(createStatsMetric('Mais recente', formatDate(stats.mostRecentTimestamp), 'último salvo'));
    content.appendChild(secondary);
    var lists = document.createElement('div');
    lists.style = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;';
    lists.appendChild(createStatsList('Perfis mais salvos (top 10)', stats.topUsers, 'Nenhum perfil salvo ainda.'));
    lists.appendChild(createStatsList('Tags mais usadas (top 10)', stats.topTags, 'Nenhuma tag aplicada ainda.'));
    content.appendChild(lists);
    modal.appendChild(content);
    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };
    if (!document.getElementById('pinboard-stats-style')) {
      var style = document.createElement('style');
      style.id = 'pinboard-stats-style';
      style.textContent = '@keyframes statsSlideUp { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }';
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);
  }
  function showToast(message) {
    var existing = document.getElementById('pinboard-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'pinboard-toast';
    toast.innerText = message;
    toast.style = "\n            position: fixed; bottom: 90px; right: 20px; z-index: 10003;\n            background: #1d9bf0; color: white; padding: 12px 20px;\n            border-radius: 10px; font-size: 14px; font-weight: 500;\n            font-family: ".concat(LOCAL_FONT_STACK, "; letter-spacing: 0.01em;\n            box-shadow: 0 4px 12px rgba(0,0,0,0.3);\n            animation: slideIn 0.3s ease;\n        ");

    // Add animation keyframes
    if (!document.getElementById('pinboard-toast-style')) {
      var style = document.createElement('style');
      style.id = 'pinboard-toast-style';
      style.textContent = "\n                @keyframes slideIn {\n                    from { opacity: 0; transform: translateX(50px); }\n                    to { opacity: 1; transform: translateX(0); }\n                }\n                @keyframes slideOut {\n                    from { opacity: 1; transform: translateX(0); }\n                    to { opacity: 0; transform: translateX(50px); }\n                }\n            ";
      document.head.appendChild(style);
    }
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(function () {
        return toast.remove();
      }, 300);
    }, 2500);
  }

  // Toast centralizado estilo X (para adicionar/remover bookmarks)
  function showBookmarkToast(message) {
    var showButton = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var existing = document.getElementById('pinboard-center-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'pinboard-center-toast';
    toast.style = "\n            position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%);\n            z-index: 10004; display: flex; align-items: center;\n            background: #1d9bf0; color: white;\n            border-radius: 4px; font-size: 15px; font-weight: 400;\n            font-family: ".concat(LOCAL_FONT_STACK, "; letter-spacing: 0.01em;\n            box-shadow: 0 4px 12px rgba(0,0,0,0.4);\n            animation: toastSlideUp 0.25s ease;\n            overflow: hidden;\n        ");
    var textSpan = document.createElement('span');
    textSpan.innerText = message;
    textSpan.style = 'padding: 12px 16px;';
    toast.appendChild(textSpan);
    if (showButton) {
      var divider = document.createElement('div');
      divider.style = 'width: 1px; height: 100%; background: rgba(255,255,255,0.3); align-self: stretch;';
      toast.appendChild(divider);
      var actionBtn = document.createElement('button');
      actionBtn.innerText = 'Ver galeria';
      actionBtn.style = "\n                background: transparent; border: none; color: white;\n                padding: 12px 16px; font-size: 15px; font-weight: 600;\n                font-family: ".concat(LOCAL_FONT_STACK, "; letter-spacing: 0.01em;\n                cursor: pointer; transition: background 0.2s;\n            ");
      actionBtn.onmouseenter = function () {
        return actionBtn.style.background = 'rgba(255,255,255,0.1)';
      };
      actionBtn.onmouseleave = function () {
        return actionBtn.style.background = 'transparent';
      };
      actionBtn.onclick = function () {
        toast.remove();
        createGalleryModal();
      };
      toast.appendChild(actionBtn);
    }

    // Adicionar animação
    if (!document.getElementById('pinboard-center-toast-style')) {
      var style = document.createElement('style');
      style.id = 'pinboard-center-toast-style';
      style.textContent = "\n                @keyframes toastSlideUp {\n                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }\n                    to { opacity: 1; transform: translateX(-50%) translateY(0); }\n                }\n                @keyframes toastSlideDown {\n                    from { opacity: 1; transform: translateX(-50%) translateY(0); }\n                    to { opacity: 0; transform: translateX(-50%) translateY(20px); }\n                }\n            ";
      document.head.appendChild(style);
    }
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.animation = 'toastSlideDown 0.25s ease';
      setTimeout(function () {
        return toast.remove();
      }, 250);
    }, 3000);
  }
  function showConfirmModal(message, onConfirm) {
    var overlay = document.createElement('div');
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0,0,0,0.8); z-index: 10002;\n            display: flex; justify-content: center; align-items: center;\n            font-family: ".concat(LOCAL_FONT_STACK, ";\n        ");
    var modal = document.createElement('div');
    modal.style = "\n            background: #15181c; padding: 25px; border-radius: 16px;\n            width: 350px; max-width: 90%; color: white; border: 1px solid #333;\n            text-align: center;\n        ";
    var icon = document.createElement('div');
    icon.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#f4212e\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/><path d=\"M3 6h18\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/></svg>";
    icon.style = 'margin-bottom: 15px;';
    modal.appendChild(icon);
    var text = document.createElement('p');
    text.innerText = message;
    text.style = 'margin: 0 0 20px 0; font-size: 16px; color: #ccc;';
    modal.appendChild(text);
    var btnRow = document.createElement('div');
    btnRow.style = 'display: flex; gap: 10px;';
    var cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancelar';
    cancelBtn.style = 'flex: 1; background: #333; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px;';
    cancelBtn.onclick = function () {
      return overlay.remove();
    };
    var confirmBtn = document.createElement('button');
    confirmBtn.innerText = 'Excluir';
    confirmBtn.style = 'flex: 1; background: #f4212e; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;';
    confirmBtn.onclick = function () {
      overlay.remove();
      onConfirm();
    };
    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);
    modal.appendChild(btnRow);
    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };
    document.body.appendChild(overlay);
  }

  // Modal de escolha assíncrona com múltiplas opções - Interface melhorada
  function showChoiceModal(message, options) {
    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.setAttribute('data-pinboard-overlay', 'true');
      overlay.style = "\n                position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n                background: rgba(0,0,0,0.85); z-index: 10002;\n                display: flex; justify-content: center; align-items: center;\n                animation: fadeIn 0.15s ease;\n                font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n            ";
      var modal = document.createElement('div');
      modal.style = "\n                background: linear-gradient(145deg, #15181c 0%, #1a1d21 100%);\n                padding: 0; border-radius: 16px;\n                width: 380px; max-width: 90%; color: white;\n                border: 1px solid #2a2a2a; overflow: hidden;\n                box-shadow: 0 20px 40px rgba(0,0,0,0.4);\n                animation: slideUp 0.2s ease;\n            ";

      // Header com ícone
      var header = document.createElement('div');
      header.style = "\n                padding: 24px 24px 16px 24px; text-align: center;\n                background: linear-gradient(180deg, rgba(234,179,8,0.08) 0%, transparent 100%);\n            ";
      var iconCircle = document.createElement('div');
      iconCircle.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"/></svg>";
      iconCircle.style = "\n                width: 56px; height: 56px; border-radius: 14px;\n                background: linear-gradient(135deg, #667292 0%, #4a5568 100%);\n                display: flex; align-items: center; justify-content: center;\n                margin: 0 auto 16px auto;\n                box-shadow: 0 4px 12px rgba(102,114,146,0.3);\n            ";
      header.appendChild(iconCircle);
      var title = document.createElement('h3');
      title.innerText = 'Backup no Telegram';
      title.style = 'margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: white;';
      header.appendChild(title);
      var text = document.createElement('p');
      text.innerText = message;
      text.style = 'margin: 0; font-size: 14px; color: #888; line-height: 1.4;';
      header.appendChild(text);
      modal.appendChild(header);

      // Botões
      var btnContainer = document.createElement('div');
      btnContainer.style = 'padding: 16px 24px 24px 24px; display: flex; flex-direction: column; gap: 10px;';
      options.forEach(function (opt, idx) {
        var btn = document.createElement('button');
        btn.innerText = opt.label;

        // Estilo diferenciado baseado no tipo
        var btnStyle = '';
        if (opt.value === 'delete') {
          btnStyle = "\n                        background: #dc2626; color: white; border: none;\n                        font-weight: 600;\n                    ";
        } else if (opt.value === 'keep') {
          btnStyle = "\n                        background: #2a2a2a; color: white; border: none;\n                        font-weight: 500;\n                    ";
        } else {
          btnStyle = "\n                        background: transparent; color: #666; border: 1px solid #333;\n                        font-weight: 400;\n                    ";
        }
        btn.style = "\n                    width: 100%; padding: 12px 16px; border-radius: 10px; cursor: pointer;\n                    font-size: 14px; transition: all 0.2s; text-align: center;\n                    ".concat(btnStyle, "\n                ");
        btn.onmouseenter = function () {
          if (opt.value === 'delete') btn.style.background = '#b91c1c';else if (opt.value === 'keep') btn.style.background = '#3a3a3a';else {
            btn.style.borderColor = '#555';
            btn.style.color = '#999';
          }
        };
        btn.onmouseleave = function () {
          if (opt.value === 'delete') btn.style.background = '#dc2626';else if (opt.value === 'keep') btn.style.background = '#2a2a2a';else {
            btn.style.borderColor = '#333';
            btn.style.color = '#666';
          }
        };
        btn.onclick = function () {
          overlay.remove();
          resolve(opt.value);
        };
        btnContainer.appendChild(btn);
      });
      modal.appendChild(btnContainer);
      overlay.appendChild(modal);
      overlay.onclick = function (e) {
        if (e.target === overlay) {
          overlay.remove();
          resolve(null);
        }
      };
      document.body.appendChild(overlay);
    });
  }

  // ==================== TAG MANAGEMENT ======================================
  function createTagModal(onSave) {
    var overlay = document.createElement('div');
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0,0,0,0.8); z-index: 10001;\n            display: flex; justify-content: center; align-items: center;\n            font-family: ".concat(LOCAL_FONT_STACK, ";\n        ");
    var modal = document.createElement('div');
    modal.style = "\n            background: #15181c; padding: 25px; border-radius: 16px;\n            width: 450px; max-width: 90%; color: white; border: 1px solid #333;\n            position: relative;\n        ";

    // Botão X no canto superior direito
    var closeX = document.createElement('button');
    closeX.innerHTML = ICON_X;
    closeX.style = 'position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #888; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;';
    closeX.onclick = function () {
      overlay.remove();
      if (onSave) onSave();
    };
    closeX.onmouseenter = function () {
      return closeX.style.color = 'white';
    };
    closeX.onmouseleave = function () {
      return closeX.style.color = '#888';
    };
    modal.appendChild(closeX);

    // Título com mais destaque
    var title = document.createElement('h3');
    title.innerText = 'Gerenciar Tags';
    title.style = 'margin: 0 0 20px 0; color: #1d9bf0; font-size: 20px; font-weight: 600;';
    modal.appendChild(title);

    // Input para nova tag (inline com botão)
    var inputRow = document.createElement('div');
    inputRow.style = 'display: flex; gap: 10px; margin-bottom: 20px;';
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Nova tag...';
    input.style = 'flex: 1; padding: 12px 15px; border-radius: 12px; border: 1px solid #333; background: #1a1a1a; color: white; font-size: 14px;';
    input.onkeypress = function (e) {
      if (e.key === 'Enter') addBtn.click();
    };
    var addBtn = document.createElement('button');
    addBtn.innerHTML = "<span>Criar</span>";
    addBtn.style = 'background: #2d2d2d; color: rgba(255,255,255,0.8); border: 1px solid #444; padding: 12px 18px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 14px;';
    addBtn.onclick = function () {
      var newTag = input.value.trim();
      if (newTag && !getTags().includes(newTag)) {
        saveTags([].concat(_toConsumableArray(getTags()), [newTag]));
        input.value = '';
        renderTags();
      }
    };
    inputRow.appendChild(input);
    inputRow.appendChild(addBtn);
    modal.appendChild(inputRow);

    // Lista de tags como chips horizontais (com drag and drop para reordenar)
    var tagList = document.createElement('div');
    tagList.style = 'display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; max-height: 300px; overflow-y: auto; padding: 5px 0;';
    var draggedTag = null;
    var draggedElement = null;
    function renderTags() {
      var tags = getTags();
      tagList.innerHTML = '';
      if (tags.length === 0) {
        var emptyMsg = document.createElement('p');
        emptyMsg.innerText = 'Nenhuma tag criada ainda';
        emptyMsg.style = 'color: #666; text-align: center; width: 100%; font-size: 14px; padding: 20px 0;';
        tagList.appendChild(emptyMsg);
        return;
      }
      tags.forEach(function (tag, index) {
        var chip = document.createElement('div');
        chip.draggable = true;
        chip.dataset.tag = tag;
        chip.dataset.index = index;
        chip.style = "\n                    display: flex; align-items: center; gap: 6px;\n                    padding: 8px 14px; background: #2d2d2d; border-radius: 20px;\n                    font-size: 13px; transition: all 0.2s; cursor: grab;\n                    border: 1px solid transparent;\n                ";

        // Ícone grip para arrastar (menor para layout horizontal)
        var gripIcon = document.createElement('span');
        gripIcon.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"5\" r=\"1\"/><circle cx=\"9\" cy=\"12\" r=\"1\"/><circle cx=\"9\" cy=\"19\" r=\"1\"/><circle cx=\"15\" cy=\"5\" r=\"1\"/><circle cx=\"15\" cy=\"12\" r=\"1\"/><circle cx=\"15\" cy=\"19\" r=\"1\"/></svg>";
        gripIcon.style = 'color: #555; display: flex; align-items: center; flex-shrink: 0;';
        var tagText = document.createElement('span');
        tagText.innerText = tag;
        tagText.style = 'color: #fff; flex: 1;';
        var delBtn = document.createElement('button');
        delBtn.innerHTML = ICON_X.replace('width="16"', 'width="14"').replace('height="16"', 'height="14"');
        delBtn.style = 'background: none; border: none; color: #E57373; cursor: pointer; opacity: 0.5; padding: 2px; display: flex; align-items: center; transition: opacity 0.2s; flex-shrink: 0;';
        delBtn.onmouseenter = function () {
          return delBtn.style.opacity = '1';
        };
        delBtn.onmouseleave = function () {
          return delBtn.style.opacity = '0.5';
        };
        delBtn.onclick = function (e) {
          e.stopPropagation();
          showConfirmModal("Excluir tag \"".concat(tag, "\"?"), function () {
            var updated = getTags().filter(function (t) {
              return t !== tag;
            });
            saveTags(updated);
            var bookmarks = getBookmarks().map(function (b) {
              return _objectSpread(_objectSpread({}, b), {}, {
                tags: (b.tags || []).filter(function (t) {
                  return t !== tag;
                })
              });
            });
            saveBookmarks(bookmarks);
            renderTags();
          });
        };

        // Drag events
        chip.ondragstart = function (e) {
          draggedTag = tag;
          draggedElement = chip;
          chip.style.opacity = '0.5';
          chip.style.cursor = 'grabbing';
          e.dataTransfer.effectAllowed = 'move';
        };
        chip.ondragend = function () {
          chip.style.opacity = '1';
          chip.style.cursor = 'grab';
          draggedTag = null;
          draggedElement = null;
          tagList.querySelectorAll('[data-tag]').forEach(function (el) {
            el.style.borderColor = 'transparent';
            el.style.background = '#2d2d2d';
          });
        };
        chip.ondragover = function (e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (chip !== draggedElement) {
            chip.style.borderColor = '#1d9bf0';
            chip.style.background = 'rgba(29,155,240,0.1)';
          }
        };
        chip.ondragleave = function () {
          chip.style.borderColor = 'transparent';
          chip.style.background = '#2d2d2d';
        };
        chip.ondrop = function (e) {
          e.preventDefault();
          chip.style.borderColor = 'transparent';
          chip.style.background = '#2d2d2d';
          if (draggedTag && draggedTag !== tag) {
            var currentTags = getTags();
            var fromIndex = currentTags.indexOf(draggedTag);
            var toIndex = currentTags.indexOf(tag);
            if (fromIndex !== -1 && toIndex !== -1) {
              currentTags.splice(fromIndex, 1);
              currentTags.splice(toIndex, 0, draggedTag);
              saveTags(currentTags);
              renderTags();
              showToast('Tags reordenadas');
            }
          }
        };
        chip.appendChild(gripIcon);
        chip.appendChild(tagText);
        chip.appendChild(delBtn);
        tagList.appendChild(chip);
      });
    }
    renderTags();
    modal.appendChild(tagList);

    // Dica de reordenação
    var reorderHint = document.createElement('div');
    reorderHint.innerHTML = '↕️ Arraste para reordenar';
    reorderHint.style = 'color: #555; font-size: 12px; text-align: center; margin-top: 15px;';
    modal.appendChild(reorderHint);
    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) {
        overlay.remove();
        if (onSave) onSave();
      }
    };
    document.body.appendChild(overlay);
  }
  function showChoiceModal(message) {
    var choices = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.setAttribute('data-pinboard-overlay', 'true');
      overlay.style = "\n                position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n                background: rgba(0,0,0,0.8); z-index: 10001;\n                display: flex; justify-content: center; align-items: center;\n            ";
      var modal = document.createElement('div');
      modal.style = "\n                background: #15181c; padding: 25px; border-radius: 16px;\n                width: 400px; max-width: 90%; color: white; border: 1px solid #333;\n                text-align: center;\n            ";
      var text = document.createElement('p');
      // Transforma quebras de linha \n em <br> pro texto formatar direito
      text.innerHTML = message.replace(/\\n/g, '<br>');
      text.style = 'margin: 0 0 25px 0; color: #e1e1e1; font-size: 15px; line-height: 1.5;';
      modal.appendChild(text);
      var btnContainer = document.createElement('div');
      btnContainer.style = 'display: flex; flex-direction: column; gap: 10px;';
      choices.forEach(function (choice) {
        var btn = document.createElement('button');
        btn.innerText = choice.label;

        // Tema base
        var bgColor = choice.bg || '#2a2a2a';
        var textColor = choice.color || 'white';
        var fontWeight = choice.bold ? 'bold' : 'normal';
        btn.style = "\n                    width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #333;\n                    background: ".concat(bgColor, "; color: ").concat(textColor, "; font-weight: ").concat(fontWeight, ";\n                    cursor: pointer; transition: all 0.2s; font-size: 14px;\n                ");

        // Hover Effects
        btn.onmouseenter = function () {
          btn.style.filter = 'brightness(1.2)';
          if (bgColor === '#2a2a2a' || bgColor === '#333') btn.style.borderColor = '#555';
        };
        btn.onmouseleave = function () {
          btn.style.filter = 'brightness(1)';
          btn.style.borderColor = '#333';
        };
        btn.onclick = function () {
          resolve(choice.value);
          overlay.remove();
        };
        btnContainer.appendChild(btn);
      });
      modal.appendChild(btnContainer);
      overlay.appendChild(modal);

      // Clicar fora resolve null
      overlay.onclick = function (e) {
        if (e.target === overlay) {
          resolve(null);
          overlay.remove();
        }
      };
      document.body.appendChild(overlay);
    });
  }
  function showTagSelector(bookmark, onUpdate) {
    var overlay = document.createElement('div');
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0,0,0,0.8); z-index: 10001;\n            display: flex; justify-content: center; align-items: center;\n        ";
    var modal = document.createElement('div');
    modal.style = "\n            background: #15181c; padding: 25px; border-radius: 16px;\n            width: 350px; max-width: 90%; color: white; border: 1px solid #333;\n        ";
    var title = document.createElement('h3');
    title.innerText = 'Selecionar Tags';
    title.style = 'margin: 0 0 20px 0; color: #1d9bf0;';
    modal.appendChild(title);
    var tags = getTags();
    var selectedTags = new Set(bookmark.tags || []);
    if (tags.length === 0) {
      modal.innerHTML += '<p style="color: #888; text-align: center;">Nenhuma tag disponível. Crie uma primeiro!</p>';
    } else {
      var tagContainer = document.createElement('div');
      tagContainer.style = 'display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;';
      tags.forEach(function (tag) {
        var chip = document.createElement('button');
        chip.innerText = tag;
        chip.style = "\n                    padding: 8px 16px; border-radius: 20px; border: 1px solid #333;\n                    cursor: pointer; transition: all 0.2s;\n                    background: ".concat(selectedTags.has(tag) ? '#1d9bf0' : '#222', ";\n                    color: ").concat(selectedTags.has(tag) ? 'white' : '#888', ";\n                ");
        chip.onclick = function () {
          if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
            chip.style.background = '#222';
            chip.style.color = '#888';
          } else {
            selectedTags.add(tag);
            chip.style.background = '#1d9bf0';
            chip.style.color = 'white';
          }
        };
        tagContainer.appendChild(chip);
      });
      modal.appendChild(tagContainer);
    }
    var btnRow = document.createElement('div');
    btnRow.style = 'display: flex; gap: 10px;';
    var saveBtn = document.createElement('button');
    saveBtn.innerText = 'Salvar';
    saveBtn.style = 'flex: 1; background: #1d9bf0; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center;';
    saveBtn.onclick = function () {
      var bookmarks = getBookmarks();
      var idx = bookmarks.findIndex(function (b) {
        return b.id === bookmark.id;
      });
      if (idx !== -1) {
        bookmarks[idx].tags = Array.from(selectedTags);
        saveBookmarks(bookmarks);
      }
      overlay.remove();
      if (onUpdate) onUpdate();
    };
    var cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancelar';
    cancelBtn.style = 'flex: 1; background: #333; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center;';
    cancelBtn.onclick = function () {
      return overlay.remove();
    };
    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(saveBtn);
    modal.appendChild(btnRow);
    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };
    document.body.appendChild(overlay);
  }
  function showQuickTagEditor(bookmarkOrId, onUpdate) {
    var bookmark = typeof bookmarkOrId === 'object' ? bookmarkOrId : getBookmarkById(bookmarkOrId);
    if (!bookmark) {
      showToast('Bookmark não encontrado');
      return;
    }
    var existing = document.getElementById('pinboard-quick-tag-popover');
    if (existing) existing.remove();
    var selectedTags = new Set(bookmark.tags || []);
    var popover = document.createElement('div');
    popover.id = 'pinboard-quick-tag-popover';
    popover.style = 'position: fixed; right: 18px; bottom: 88px; z-index: 10005; width: min(360px, calc(100vw - 28px)); max-height: min(520px, calc(100vh - 120px)); overflow-y: auto; background: linear-gradient(145deg, rgba(21,24,28,0.98), rgba(12,18,28,0.98)); color: white; border: 1px solid rgba(29,155,240,0.34); border-radius: 18px; padding: 16px; box-shadow: 0 20px 48px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.04) inset; font-family: ' + LOCAL_FONT_STACK + '; animation: quickTagSlideIn 0.22s ease;';
    var header = document.createElement('div');
    header.style = 'display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px;';
    var titleWrap = document.createElement('div');
    titleWrap.style = 'display: flex; flex-direction: column; gap: 3px; min-width: 0;';
    var title = document.createElement('strong');
    title.innerText = 'Tags rápidas';
    title.style = 'font-size: 15px; color: #dbeafe; letter-spacing: 0.01em;';
    var subtitle = document.createElement('span');
    subtitle.innerText = 'Aplique tags sem abrir a galeria';
    subtitle.style = 'font-size: 12px; color: #8b98a5;';
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = ICON_X;
    closeBtn.title = 'Fechar';
    closeBtn.style = 'background: transparent; border: none; color: #8b98a5; width: 30px; height: 30px; border-radius: 9999px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;';
    closeBtn.onmouseenter = function () {
      closeBtn.style.background = 'rgba(255,255,255,0.08)';
      closeBtn.style.color = 'white';
    };
    closeBtn.onmouseleave = function () {
      closeBtn.style.background = 'transparent';
      closeBtn.style.color = '#8b98a5';
    };
    closeBtn.onclick = function () {
      popover.remove();
    };
    header.appendChild(titleWrap);
    header.appendChild(closeBtn);
    popover.appendChild(header);
    var chipContainer = document.createElement('div');
    chipContainer.style = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; max-height: 190px; overflow-y: auto; padding: 2px 0;';
    var renderChips = function renderChips() {
      var tags = getTags();
      chipContainer.innerHTML = '';
      if (tags.length === 0) {
        var empty = document.createElement('div');
        empty.innerText = 'Nenhuma tag criada ainda. Crie a primeira abaixo.';
        empty.style = 'width: 100%; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.04); color: #8b98a5; font-size: 12px; text-align: center;';
        chipContainer.appendChild(empty);
        return;
      }
      tags.forEach(function (tag) {
        var isSelected = selectedTags.has(tag);
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.innerText = tag;
        chip.style = 'padding: 7px 12px; border-radius: 9999px; border: 1px solid ' + (isSelected ? 'rgba(29,155,240,0.9)' : 'rgba(255,255,255,0.1)') + '; background: ' + (isSelected ? 'rgba(29,155,240,0.95)' : 'rgba(255,255,255,0.055)') + '; color: ' + (isSelected ? 'white' : '#c9d1d9') + '; cursor: pointer; font-size: 12px; font-weight: 700; transition: all 0.16s ease;';
        chip.onclick = function () {
          if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
          } else {
            selectedTags.add(tag);
          }
          renderChips();
        };
        chipContainer.appendChild(chip);
      });
    };
    popover.appendChild(chipContainer);
    var createRow = document.createElement('div');
    createRow.style = 'display: flex; gap: 8px; margin-bottom: 12px;';
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Nova tag...';
    input.style = 'flex: 1; min-width: 0; background: rgba(0,0,0,0.36); color: white; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 10px 12px; outline: none; font-family: ' + LOCAL_FONT_STACK + ';';
    input.onfocus = function () {
      input.style.borderColor = 'rgba(29,155,240,0.8)';
      input.style.boxShadow = '0 0 0 3px rgba(29,155,240,0.16)';
    };
    input.onblur = function () {
      input.style.borderColor = 'rgba(255,255,255,0.12)';
      input.style.boxShadow = 'none';
    };
    var createBtn = document.createElement('button');
    createBtn.type = 'button';
    createBtn.innerText = 'Criar';
    createBtn.style = 'background: rgba(29,155,240,0.16); color: #8bd0ff; border: 1px solid rgba(29,155,240,0.42); padding: 10px 12px; border-radius: 12px; cursor: pointer; font-weight: 800; font-family: ' + LOCAL_FONT_STACK + ';';
    createBtn.onclick = function () {
      var newTag = addGlobalTagIfNeeded(input.value);
      if (!newTag) return;
      selectedTags.add(newTag);
      input.value = '';
      renderChips();
      input.focus();
    };
    input.onkeydown = function (event) {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      createBtn.click();
    };
    createRow.appendChild(input);
    createRow.appendChild(createBtn);
    popover.appendChild(createRow);
    var actions = document.createElement('div');
    actions.style = 'display: flex; gap: 8px;';
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.innerText = 'Limpar';
    clearBtn.style = 'flex: 1; background: rgba(255,255,255,0.06); color: #c9d1d9; border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 12px; cursor: pointer; font-weight: 700; font-family: ' + LOCAL_FONT_STACK + ';';
    clearBtn.onclick = function () {
      selectedTags.clear();
      renderChips();
    };
    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.innerText = 'Salvar tags';
    saveBtn.style = 'flex: 1.35; background: #1d9bf0; color: white; border: none; padding: 10px; border-radius: 12px; cursor: pointer; font-weight: 800; font-family: ' + LOCAL_FONT_STACK + '; box-shadow: 0 8px 20px rgba(29,155,240,0.25);';
    saveBtn.onclick = function () {
      var updatedBookmark = saveBookmarkTags(bookmark.id, Array.from(selectedTags));
      if (!updatedBookmark) {
        popover.remove();
        showToast('Bookmark não encontrado');
        return;
      }
      bookmark = updatedBookmark;
      popover.remove();
      showToast('Tags atualizadas');
      if (onUpdate) onUpdate(updatedBookmark);
    };
    actions.appendChild(clearBtn);
    actions.appendChild(saveBtn);
    popover.appendChild(actions);
    if (!document.getElementById('pinboard-quick-tag-style')) {
      var style = document.createElement('style');
      style.id = 'pinboard-quick-tag-style';
      style.textContent = '@keyframes quickTagSlideIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }';
      document.head.appendChild(style);
    }
    renderChips();
    document.body.appendChild(popover);
    setTimeout(function () {
      input.focus();
    }, 40);
  }

  // ==================== SETTINGS MODAL ====================
  function SettingsModal(onSave) {
    // Evitar múltiplos modais
    if (document.getElementById('pinboard-settings-overlay')) return;
    var settings = getSettings();
    var overlay = document.createElement('div');
    overlay.id = 'pinboard-settings-overlay';
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0,0,0,0.8); z-index: 10001;\n            display: flex; justify-content: center; align-items: center;\n            font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n        ";
    var modal = document.createElement('div');
    modal.style = "\n            background: #15181c; padding: 25px; border-radius: 16px;\n            width: 500px; max-width: 90%; max-height: 85vh; overflow-y: auto;\n            color: white; border: 1px solid #333; position: relative;\n        ";

    // Botão X no canto superior direito
    var closeX = document.createElement('button');
    closeX.innerHTML = ICON_X;
    closeX.style = 'position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #888; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;';
    closeX.onclick = function () {
      overlay.remove();
      if (onSave) setTimeout(onSave, 10);
    };
    closeX.onmouseenter = function () {
      return closeX.style.color = 'white';
    };
    closeX.onmouseleave = function () {
      return closeX.style.color = '#888';
    };
    modal.appendChild(closeX);

    // Título
    var title = document.createElement('h3');
    title.innerText = 'Configurações';
    title.style = 'margin: 0 0 25px 0; color: #1d9bf0; font-size: 20px; font-weight: 600;';
    modal.appendChild(title);

    // Container de settings
    var settingsContainer = document.createElement('div');
    settingsContainer.style = 'display: flex; flex-direction: column; gap: 12px;';

    // Helper para criar seção colapsável
    function createCollapsibleSection(sectionId, icon, titleText, contentBuilder) {
      var section = document.createElement('div');
      section.style = 'background: #1a1a1a; border: 1px solid #333; border-radius: 12px; overflow: hidden;';
      var collapsed = settings.collapsedSections || [];
      // Por padrão, todas as seções vêm fechadas (exceto se explicitamente abertas)
      var isCollapsed = !collapsed.includes(sectionId);

      // Header
      var header = document.createElement('div');
      header.style = 'display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; transition: background 0.2s;';
      header.onmouseenter = function () {
        return header.style.background = '#222';
      };
      header.onmouseleave = function () {
        return header.style.background = 'transparent';
      };
      var headerLeft = document.createElement('div');
      headerLeft.style = 'display: flex; align-items: center; gap: 10px; color: white; font-size: 14px; font-weight: 500;';
      headerLeft.innerHTML = "".concat(icon, " <span>").concat(titleText, "</span>");
      var chevron = document.createElement('span');
      chevron.innerHTML = isCollapsed ? ICON_CHEVRON_DOWN : ICON_CHEVRON_UP;
      chevron.style = 'color: #666; display: flex;';
      header.appendChild(headerLeft);
      header.appendChild(chevron);

      // Content
      var content = document.createElement('div');
      content.style = "padding: ".concat(isCollapsed ? '0 16px' : '16px', "; display: flex; flex-direction: column; gap: 15px; border-top: ").concat(isCollapsed ? 'none' : '1px solid #333', "; overflow: hidden; max-height: ").concat(isCollapsed ? '0' : '2000px', "; opacity: ").concat(isCollapsed ? '0' : '1', "; transition: all 0.3s ease;");
      contentBuilder(content);

      // Toggle
      header.onclick = function () {
        var cols = getSettings().collapsedSections || [];
        var idx = cols.indexOf(sectionId);
        if (idx > -1) {
          // Está na lista de abertas -> fechar (remover da lista)
          cols.splice(idx, 1);
          content.style.padding = '0 16px';
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          content.style.borderTop = 'none';
          chevron.innerHTML = ICON_CHEVRON_DOWN;
        } else {
          // Não está na lista -> abrir (adicionar à lista)
          cols.push(sectionId);
          content.style.padding = '16px';
          content.style.maxHeight = '2000px';
          content.style.opacity = '1';
          content.style.borderTop = '1px solid #333';
          chevron.innerHTML = ICON_CHEVRON_UP;
        }
        saveSetting('collapsedSections', cols);
      };
      section.appendChild(header);
      section.appendChild(content);
      return section;
    }

    // Helper para criar toggle row
    function createToggleRow(labelText, description, key) {
      var row = document.createElement('div');
      row.style = 'display: flex; justify-content: space-between; align-items: center;';
      var info = document.createElement('div');
      info.innerHTML = "<span style=\"color: white; font-size: 13px;\">".concat(labelText, "</span><br><span style=\"color: #666; font-size: 11px;\">").concat(description, "</span>");
      var toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = settings[key];
      toggle.style = 'width: 18px; height: 18px; cursor: pointer; accent-color: #1d9bf0;';
      toggle.onchange = function () {
        return saveSetting(key, toggle.checked);
      };
      row.appendChild(info);
      row.appendChild(toggle);
      return row;
    }

    // === SEÇÃO 1: APARÊNCIA ===
    settingsContainer.appendChild(createCollapsibleSection('appearance', ICON_PALETTE, 'Aparência', function (content) {
      // Toggle Mostrar usuário
      content.appendChild(createToggleRow('Mostrar usuário', 'Exibe foto e nome sobre as imagens', 'showUserLabel'));

      // Toggle Esconder overlays
      content.appendChild(createToggleRow('Esconder overlays', 'Oculta perfil, nome, tags e badge de backup', 'hideOverlays'));

      // Sliders serão adicionados após a função createSliderRow
    }));

    // Helper para criar slider + input numérico (layout refinado)
    function createSliderRow(label, description, key, min, max, unit) {
      var row = document.createElement('div');
      row.style = 'display: flex; flex-direction: column; gap: 8px;';
      var defaultVal = DEFAULT_SETTINGS[key];
      var currentVal = settings[key];

      // Header: título + input numérico inline + botão reset condicional
      var headerRow = document.createElement('div');
      headerRow.style = 'display: flex; align-items: center; justify-content: space-between; gap: 10px;';
      var titleSection = document.createElement('div');
      titleSection.style = 'display: flex; align-items: baseline; gap: 8px; flex: 1;';
      var labelText = document.createElement('span');
      labelText.innerText = label;
      labelText.style = 'color: white; font-size: 14px;';

      // Input numérico integrado (seamless)
      var numInput = document.createElement('input');
      numInput.type = 'number';
      numInput.min = min;
      numInput.max = max;
      numInput.value = currentVal;
      numInput.style = "\n                width: 50px; padding: 2px 4px; border-radius: 4px;\n                border: none; background: transparent; color: #1d9bf0;\n                text-align: center; font-size: 14px; font-weight: 500;\n                outline: none; transition: background 0.2s;\n                -moz-appearance: textfield;\n            ";
      numInput.onmouseenter = function () {
        return numInput.style.background = 'rgba(29,155,240,0.1)';
      };
      numInput.onmouseleave = function () {
        if (document.activeElement !== numInput) numInput.style.background = 'transparent';
      };
      numInput.onfocus = function () {
        return numInput.style.background = 'rgba(29,155,240,0.15)';
      };
      numInput.onblur = function () {
        return numInput.style.background = 'transparent';
      };
      numInput.onkeydown = function (e) {
        // Permitir: teclas de controle e navegação
        var allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
        if (allowedKeys.includes(e.key) || e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
          return;
        }
        // Bloquear se não for número
        if (!/^\d$/.test(e.key)) {
          e.preventDefault();
        }
      };
      var unitLabel = document.createElement('span');
      unitLabel.innerText = unit;
      unitLabel.style = 'color: #666; font-size: 12px;';
      titleSection.appendChild(labelText);
      titleSection.appendChild(numInput);
      titleSection.appendChild(unitLabel);

      // Botão restaurar padrão (condicional - só mostra se valor != padrão)
      var resetBtn = document.createElement('button');
      resetBtn.innerText = '↺';
      resetBtn.title = 'Restaurar padrão';
      resetBtn.style = "\n                background: transparent; border: 1px solid #444; color: #888;\n                padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 12px;\n                transition: all 0.2s; opacity: ".concat(currentVal !== defaultVal ? '1' : '0', ";\n                pointer-events: ").concat(currentVal !== defaultVal ? 'auto' : 'none', ";\n            ");
      resetBtn.onmouseenter = function () {
        resetBtn.style.borderColor = '#1d9bf0';
        resetBtn.style.color = '#1d9bf0';
      };
      resetBtn.onmouseleave = function () {
        resetBtn.style.borderColor = '#444';
        resetBtn.style.color = '#888';
      };
      headerRow.appendChild(titleSection);
      headerRow.appendChild(resetBtn);

      // Descrição
      var descEl = document.createElement('span');
      descEl.innerText = description;
      descEl.style = 'color: #666; font-size: 12px; margin-top: -4px;';

      // Slider container (visual unificado)
      var sliderContainer = document.createElement('div');
      sliderContainer.style = 'display: flex; align-items: center; gap: 10px; background: #1a1a1a; padding: 8px 12px; border-radius: 8px;';
      var slider = document.createElement('input');
      slider.type = 'range';
      slider.min = min;
      slider.max = max;
      slider.value = currentVal;
      slider.style = 'flex: 1; cursor: pointer; accent-color: #1d9bf0;';

      // Função para atualizar visibilidade do botão reset
      var updateResetVisibility = function updateResetVisibility() {
        var isModified = parseInt(numInput.value) !== defaultVal;
        resetBtn.style.opacity = isModified ? '1' : '0';
        resetBtn.style.pointerEvents = isModified ? 'auto' : 'none';
      };
      resetBtn.onclick = function () {
        slider.value = defaultVal;
        numInput.value = defaultVal;
        saveSetting(key, defaultVal);
        updateResetVisibility();
      };
      slider.oninput = function () {
        numInput.value = slider.value;
        saveSetting(key, parseInt(slider.value));
        updateResetVisibility();
      };
      numInput.oninput = function () {
        var val = parseInt(numInput.value) || min;
        val = Math.max(min, Math.min(max, val));
        slider.value = val;
        saveSetting(key, val);
        updateResetVisibility();
      };
      sliderContainer.appendChild(slider);
      row.appendChild(headerRow);
      row.appendChild(descEl);
      row.appendChild(sliderContainer);
      return row;
    }

    // === SEÇÃO 2: ATALHOS ===
    settingsContainer.appendChild(createCollapsibleSection('shortcuts', ICON_SETTINGS, 'Atalhos de Teclado', function (content) {
      var shortcuts = settings.shortcuts || DEFAULT_SETTINGS.shortcuts;
      var shortcutLabels = {
        openGallery: 'Abrir galeria',
        closeModal: 'Fechar modal',
        openSettings: 'Abrir configurações'
      };
      function createShortcutRow(key, label) {
        var _shortcuts$key;
        var row = document.createElement('div');
        row.style = 'display: flex; justify-content: space-between; align-items: center;';
        var labelEl = document.createElement('span');
        labelEl.innerText = label;
        labelEl.style = 'color: #888; font-size: 13px;';
        var keyBtn = document.createElement('button');
        keyBtn.innerText = ((_shortcuts$key = shortcuts[key]) === null || _shortcuts$key === void 0 ? void 0 : _shortcuts$key.toUpperCase()) || '—';
        keyBtn.style = 'background: #2d2d2d; border: 1px solid #444; color: #1d9bf0; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: bold; min-width: 80px;';
        var listening = false;
        keyBtn.onclick = function () {
          if (listening) return;
          listening = true;
          isListeningForShortcut = true;
          keyBtn.innerText = '...';
          keyBtn.style.borderColor = '#1d9bf0';
          var _handler = function handler(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var modifierKeys = ['Control', 'Shift', 'Alt', 'Meta'];
            if (modifierKeys.includes(e.key)) return;
            var combo = [];
            if (e.ctrlKey) combo.push('ctrl');
            if (e.shiftKey) combo.push('shift');
            if (e.altKey) combo.push('alt');
            combo.push(e.key.toLowerCase());
            var newShortcut = combo.join('+');
            shortcuts[key] = newShortcut;
            saveSetting('shortcuts', shortcuts);
            keyBtn.innerText = newShortcut.toUpperCase();
            keyBtn.style.borderColor = '#444';
            listening = false;
            isListeningForShortcut = false;
            document.removeEventListener('keydown', _handler, true);
          };
          document.addEventListener('keydown', _handler, true);
        };
        row.appendChild(labelEl);
        row.appendChild(keyBtn);
        return row;
      }
      Object.keys(shortcutLabels).forEach(function (key) {
        content.appendChild(createShortcutRow(key, shortcutLabels[key]));
      });
      var resetBtn = document.createElement('button');
      resetBtn.innerText = 'Restaurar padrões';
      resetBtn.style = 'background: transparent; border: 1px solid #444; color: #888; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; margin-top: 5px;';
      resetBtn.onmouseenter = function () {
        resetBtn.style.borderColor = '#1d9bf0';
        resetBtn.style.color = '#1d9bf0';
      };
      resetBtn.onmouseleave = function () {
        resetBtn.style.borderColor = '#444';
        resetBtn.style.color = '#888';
      };
      resetBtn.onclick = function () {
        saveSetting('shortcuts', DEFAULT_SETTINGS.shortcuts);
        overlay.remove();
        SettingsModal(onSave);
      };
      content.appendChild(resetBtn);
    }));

    // Sliders para Aparência (adicionados após seção Aparência existente)
    var appearanceSection = settingsContainer.querySelector('div');
    if (appearanceSection) {
      var appearanceContent = appearanceSection.querySelector('div:last-child');
      if (appearanceContent && appearanceContent.style.display === 'flex') {
        appearanceContent.appendChild(createSliderRow('Altura das fotos (Grid)', 'Altura das imagens no modo grid', 'gridPhotoHeight', 150, 500, 'px'));

        // Opções de vídeo
        appearanceContent.appendChild(document.createElement('hr')).style.cssText = 'border: none; border-top: 1px solid #333; margin: 10px 0;';
        appearanceContent.appendChild(createToggleRow('Reproduzir vídeos automaticamente', 'Tocar vídeos nas miniaturas da galeria sem som', 'autoplayVideos'));
        appearanceContent.appendChild(createToggleRow('Criar tag "video" automática', 'Adiciona a tag "video" sempre que salvar mídias em mp4', 'autoTagVideos'));
      }
    }

    // === SEÇÃO 3: BACKUP NA NUVEM ===
    settingsContainer.appendChild(createCollapsibleSection('backup', ICON_CLOUD, 'Backup no Telegram', function (content) {
      // Indicador de status
      var statusIndicator = document.createElement('div');
      statusIndicator.style = 'display: flex; align-items: center; gap: 8px; margin-bottom: 10px;';
      var statusDot = document.createElement('span');
      var hasCredentials = !!(settings.telegramToken && settings.telegramChatId);
      statusDot.style = "width: 8px; height: 8px; border-radius: 50%; background: ".concat(hasCredentials ? '#22c55e' : '#ef4444', "; transition: background 0.3s ease;");
      var statusText = document.createElement('span');
      statusText.innerText = hasCredentials ? 'Configurado' : 'Credenciais não configuradas';
      statusText.style = "color: ".concat(hasCredentials ? '#22c55e' : '#ef4444', "; font-size: 11px; transition: color 0.3s ease;");
      statusIndicator.appendChild(statusDot);
      statusIndicator.appendChild(statusText);
      content.appendChild(statusIndicator);
      var desc = document.createElement('p');
      desc.innerText = 'Imagens são enviadas ao chat do Telegram como documentos (sem compressão) ao salvar um bookmark.';
      desc.style = 'color: #666; font-size: 11px; margin: 0 0 10px 0;';
      content.appendChild(desc);

      // Função para atualizar status visual
      var updateStatus = function updateStatus(state, message) {
        var colors = {
          valid: '#22c55e',
          invalid: '#ef4444',
          validating: '#eab308',
          empty: '#ef4444'
        };
        statusDot.style.background = colors[state] || colors.empty;
        statusText.style.color = colors[state] || colors.empty;
        statusText.innerText = message;
      };

      // Token input
      var tokenRow = document.createElement('div');
      tokenRow.style = 'margin-bottom: 8px;';
      tokenRow.innerHTML = '<label style="display: block; color: #888; font-size: 11px; margin-bottom: 4px;">Bot Token</label>';
      var tokenInputWrapper = document.createElement('div');
      tokenInputWrapper.style = 'position: relative; display: flex; align-items: center;';
      var tokenInput = document.createElement('input');
      tokenInput.type = 'password';
      tokenInput.placeholder = '123456:ABC-DEF...';
      tokenInput.value = settings.telegramToken || '';
      tokenInput.style = "\n                width: 100%; padding: 10px 40px 10px 12px; border-radius: 8px;\n                border: 1px solid #333; background: #15181c; color: white;\n                font-size: 12px; box-sizing: border-box; font-family: monospace;\n                transition: border-color 0.3s ease;\n            ";
      var toggleTokenVisibility = document.createElement('button');
      toggleTokenVisibility.innerHTML = ICON_EYE;
      toggleTokenVisibility.title = 'Mostrar/ocultar token';
      toggleTokenVisibility.style = "\n                position: absolute; right: 8px; top: 50%; transform: translateY(-50%);\n                background: transparent; border: none; color: #666; cursor: pointer;\n                padding: 4px; display: flex; align-items: center; justify-content: center;\n                transition: color 0.2s;\n            ";
      toggleTokenVisibility.onmouseenter = function () {
        return toggleTokenVisibility.style.color = '#1d9bf0';
      };
      toggleTokenVisibility.onmouseleave = function () {
        return toggleTokenVisibility.style.color = '#666';
      };
      toggleTokenVisibility.onclick = function () {
        var isPass = tokenInput.type === 'password';
        tokenInput.type = isPass ? 'text' : 'password';
        toggleTokenVisibility.innerHTML = isPass ? ICON_EYE_OFF : ICON_EYE;
      };
      tokenInputWrapper.appendChild(tokenInput);
      tokenInputWrapper.appendChild(toggleTokenVisibility);
      tokenRow.appendChild(tokenInputWrapper);
      var tokenError = document.createElement('div');
      tokenError.style = 'color: #ef4444; font-size: 11px; margin-top: 4px; display: none;';
      tokenRow.appendChild(tokenError);
      content.appendChild(tokenRow);

      // Chat ID input
      var groupRow = document.createElement('div');
      groupRow.style = 'margin-bottom: 10px;';
      var groupLabel = document.createElement('label');
      groupLabel.style = 'display: flex; justify-content: space-between; align-items: flex-end; color: #888; font-size: 11px; margin-bottom: 4px;';
      groupLabel.innerHTML = "<span>Chat ID <span style=\"color:#555;\">(grupo: -100..., DM: seu user ID)</span></span><span id=\"pinboard-chat-title\" style=\"color:#10b981; font-weight:600; font-size:12px;\"></span>";
      groupRow.appendChild(groupLabel);
      var groupInput = document.createElement('input');
      groupInput.type = 'text';
      groupInput.placeholder = '-1001234567890 ou 123456789';
      groupInput.value = settings.telegramChatId || '';
      groupInput.style = "\n                width: 100%; padding: 10px 12px; border-radius: 8px;\n                border: 1px solid #333; background: #15181c; color: white;\n                font-size: 12px; box-sizing: border-box; font-family: monospace;\n                transition: border-color 0.3s ease;\n            ";
      groupRow.appendChild(groupInput);
      content.appendChild(groupRow);

      // Botão Verificar bot
      var verifyRow = document.createElement('div');
      verifyRow.style = 'margin-bottom: 12px;';
      var verifyBtn = document.createElement('button');
      verifyBtn.innerText = 'Verificar bot';
      verifyBtn.style = "\n                padding: 8px 16px; border-radius: 20px;\n                background: #1d9bf0; border: none;\n                color: white; cursor: pointer; font-size: 12px; font-weight: 600;\n                transition: background 0.2s ease;\n            ";
      verifyBtn.onmouseenter = function () {
        return verifyBtn.style.background = '#1a8cd8';
      };
      verifyBtn.onmouseleave = function () {
        return verifyBtn.style.background = '#1d9bf0';
      };
      verifyBtn.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var token, groupId, result, chatTitleInfo, chatRes, chatTitleEl;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              token = tokenInput.value.trim();
              groupId = groupInput.value.trim();
              if (token) {
                _context.n = 1;
                break;
              }
              tokenError.innerText = '❌ Insira o token do bot';
              tokenError.style.display = 'block';
              updateStatus('invalid', 'Token não configurado');
              return _context.a(2);
            case 1:
              tokenError.style.display = 'none';
              updateStatus('validating', 'Verificando...');
              verifyBtn.disabled = true;
              verifyBtn.innerText = 'Verificando...';
              _context.n = 2;
              return validateTelegramCredentials(token);
            case 2:
              result = _context.v;
              verifyBtn.disabled = false;
              verifyBtn.innerText = 'Verificar bot';
              if (!result.valid) {
                _context.n = 5;
                break;
              }
              chatTitleInfo = '';
              if (!groupId) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return validateTelegramChat(token, groupId);
            case 3:
              chatRes = _context.v;
              if (chatRes.valid) chatTitleInfo = chatRes.title;
            case 4:
              chatTitleEl = document.getElementById('pinboard-chat-title');
              if (chatTitleEl) chatTitleEl.innerText = chatTitleInfo;
              saveSetting('telegramToken', token);
              if (groupId) saveSetting('telegramChatId', groupId);
              updateStatus('valid', "Conectado: @".concat(result.botName, " \u2713"));
              tokenInput.style.borderColor = '#22c55e';
              showSaveIndicator(tokenInput);
              _context.n = 6;
              break;
            case 5:
              updateStatus('invalid', 'Token inválido');
              tokenError.innerText = "\u274C ".concat(result.error || 'Falha na validação');
              tokenError.style.display = 'block';
              tokenInput.style.borderColor = '#ef4444';
            case 6:
              return _context.a(2);
          }
        }, _callee);
      }));
      verifyRow.appendChild(verifyBtn);
      content.appendChild(verifyRow);

      // Salvar chat ID ao mudar
      groupInput.onchange = function () {
        var val = groupInput.value.trim();
        if (val) {
          saveSetting('telegramChatId', val);
          showSaveIndicator(groupInput);
        }
      };

      // Toggle backup automático
      var autoRow = document.createElement('div');
      autoRow.style = 'display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #15181c; border-radius: 8px; margin-top: 2px;';
      autoRow.innerHTML = '<div><span style="color: white; font-size: 13px;">Backup automático</span><br><span style="color: #666; font-size: 11px;">Envia imagens ao salvar bookmark</span></div>';
      var autoToggle = document.createElement('button');
      var isOn = settings.telegramAutoBackup;
      autoToggle.innerHTML = isOn ? 'On' : 'Off';

      // Toggle formato de upload
      var formatRow = document.createElement('div');
      formatRow.style = 'margin-top: 15px; margin-bottom: 5px;';
      formatRow.innerHTML = "\n                <label style=\"display: flex; align-items: center; gap: 6px; color: white; font-size: 13px; margin-bottom: 6px;\">\n                    Modo de Envio \n                    <span title=\"Caso haja compress\xE3o na imagem ao ler fotos longas, o envio como documento garante zero compress\xE3o adicional e tamanho exato daquele download em cache.\" style=\"cursor: help; color: #888; border: 1px solid #444; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px;\">?</span>\n                </label>\n            ";
      var formatSelect = document.createElement('select');
      formatSelect.innerHTML = "\n                <option value=\"document\">Documento (Original / Sem restri\xE7\xF5es)</option>\n                <option value=\"photo\">Foto (Pode haver compress\xE3o)</option>\n                <option value=\"both\">Ambos (Pesa 2x no chat)</option>\n            ";
      formatSelect.value = settings.telegramUploadMode || 'document';
      formatSelect.style = "\n                width: 100%; padding: 8px 10px; border-radius: 8px;\n                border: 1px solid #333; background: #15181c; color: white;\n                font-size: 12px; cursor: pointer; outline: none;\n            ";
      formatSelect.onchange = function (e) {
        return saveSetting('telegramUploadMode', e.target.value);
      };
      formatRow.appendChild(formatSelect);
      content.appendChild(formatRow);
      autoToggle.style = "padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; background: ".concat(isOn ? '#1d9bf0' : '#333', "; color: ").concat(isOn ? 'white' : '#888', "; transition: all 0.2s;");
      autoToggle.onclick = function () {
        isOn = !isOn;
        saveSetting('telegramAutoBackup', isOn);
        autoToggle.innerHTML = isOn ? 'On' : 'Off';
        autoToggle.style.background = isOn ? '#1d9bf0' : '#333';
        autoToggle.style.color = isOn ? 'white' : '#888';
      };
      autoRow.appendChild(autoToggle);
      content.appendChild(autoRow);

      // Filtro de tags
      var filterRow = document.createElement('div');
      filterRow.style = 'margin-top: 12px; padding-top: 12px; border-top: 1px solid #2a2a2a;';
      filterRow.innerHTML = '<label style="display: block; color: #888; font-size: 11px; margin-bottom: 4px;">Filtro de Tags <span style="color: #555;">(opcional)</span></label>';
      var filterHint = document.createElement('div');
      filterHint.innerText = 'Se preenchido, só faz backup de bookmarks com estas tags:';
      filterHint.style = 'color: #555; font-size: 10px; margin-bottom: 8px;';
      filterRow.appendChild(filterHint);
      var filterTagsContainer = document.createElement('div');
      filterTagsContainer.style = 'display: flex; flex-wrap: wrap; gap: 6px;';
      var allTags = getTags();
      var selectedFilterTags = new Set(settings.telegramFilterTags || []);
      if (allTags.length === 0) {
        var noTagsMsg = document.createElement('span');
        noTagsMsg.innerText = 'Nenhuma tag criada ainda';
        noTagsMsg.style = 'color: #555; font-size: 11px; font-style: italic;';
        filterTagsContainer.appendChild(noTagsMsg);
      } else {
        allTags.forEach(function (tag) {
          var tagChip = document.createElement('button');
          var isSelected = selectedFilterTags.has(tag);
          tagChip.innerText = tag;
          tagChip.style = "\n                        padding: 4px 10px; border-radius: 12px; border: none;\n                        cursor: pointer; font-size: 11px; transition: all 0.2s;\n                        background: ".concat(isSelected ? '#22c55e' : '#2d2d2d', ";\n                        color: ").concat(isSelected ? 'white' : '#888', ";\n                    ");
          tagChip.onclick = function () {
            if (selectedFilterTags.has(tag)) {
              selectedFilterTags.delete(tag);
              tagChip.style.background = '#2d2d2d';
              tagChip.style.color = '#888';
            } else {
              selectedFilterTags.add(tag);
              tagChip.style.background = '#22c55e';
              tagChip.style.color = 'white';
            }
            saveSetting('telegramFilterTags', Array.from(selectedFilterTags));
          };
          filterTagsContainer.appendChild(tagChip);
        });
      }
      filterRow.appendChild(filterTagsContainer);
      content.appendChild(filterRow);
      var routesBtn = document.createElement('button');
      routesBtn.innerHTML = "<span>Configurar Rotas de T\xF3picos</span>";
      routesBtn.style = 'margin-top: 15px; width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid #3d8bd9; background: rgba(29, 155, 240, 0.1); color: #1d9bf0; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; transition: all 0.2s;';
      routesBtn.onmouseenter = function () {
        routesBtn.style.background = 'rgba(29, 155, 240, 0.2)';
      };
      routesBtn.onmouseleave = function () {
        routesBtn.style.background = 'rgba(29, 155, 240, 0.1)';
      };
      routesBtn.onclick = function () {
        return TelegramRoutesModal();
      };
      content.appendChild(routesBtn);
    }));

    // === SEÇÃO 4: AUTOMAÇÃO ===
    settingsContainer.appendChild(createCollapsibleSection('automation', ICON_USER, 'Automação', function (content) {
      var autoTagBtn = document.createElement('button');
      autoTagBtn.innerHTML = "".concat(ICON_USER, " <span>Gerenciar Auto-tags por Pessoa</span>");
      autoTagBtn.style = 'width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid #333; background: #15181c; color: rgba(255,255,255,0.8); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; transition: all 0.2s;';
      autoTagBtn.onmouseenter = function () {
        autoTagBtn.style.borderColor = '#1d9bf0';
        autoTagBtn.style.color = '#1d9bf0';
      };
      autoTagBtn.onmouseleave = function () {
        autoTagBtn.style.borderColor = '#333';
        autoTagBtn.style.color = 'rgba(255,255,255,0.8)';
      };
      autoTagBtn.onclick = function () {
        return AutotagModal();
      };
      content.appendChild(autoTagBtn);
    }));

    // === SEÇÃO 5: DESENVOLVEDOR ===
    var ICON_CODE = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><polyline points=\"16 18 22 12 16 6\"/><polyline points=\"8 6 2 12 8 18\"/></svg>";
    settingsContainer.appendChild(createCollapsibleSection('developer', ICON_CODE, 'Desenvolvedor', function (content) {
      content.appendChild(createToggleRow('Modo Debug', 'Mostra logs detalhados no console do navegador', 'debugMode'));
    }));
    modal.appendChild(settingsContainer);
    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) {
        overlay.remove();
        if (onSave) {
          // Executa onSave assincronamente pra não travar o fechamento visual da UI
          setTimeout(onSave, 10);
        }
      }
    };
    document.body.appendChild(overlay);
  }

  // ==================== AUTOTAG MODAL ====================
  function AutotagModal() {
    // Evitar múltiplos modais
    if (document.getElementById('pinboard-autotag-overlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'pinboard-autotag-overlay';
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0, 0, 0, 0.85); z-index: 10002;\n            display: flex; justify-content: center; align-items: center;\n            animation: fadeIn 0.2s ease;\n            font-family: ".concat(LOCAL_FONT_STACK, ";\n        ");

    // Adicionar animações
    if (!document.getElementById('autotag-modal-styles')) {
      var style = document.createElement('style');
      style.id = 'autotag-modal-styles';
      style.textContent = "\n                @keyframes fadeIn {\n                    from { opacity: 0; }\n                    to { opacity: 1; }\n                }\n                @keyframes slideUp {\n                    from { opacity: 0; transform: translateY(20px); }\n                    to { opacity: 1; transform: translateY(0); }\n                }\n                @keyframes ruleSlideIn {\n                    from { opacity: 0; transform: translateX(-10px); }\n                    to { opacity: 1; transform: translateX(0); }\n                }\n                .autotag-rule-card:hover {\n                    border-color: #444 !important;\n                    background: #252525 !important;\n                }\n                .autotag-rule-card .autotag-quick-remove {\n                    opacity: 0.7;\n                    transition: opacity 0.2s, color 0.2s;\n                }\n                .autotag-rule-card:hover .autotag-quick-remove {\n                    opacity: 1;\n                }\n            ";
      document.head.appendChild(style);
    }
    var modal = document.createElement('div');
    modal.style = "\n            background: linear-gradient(145deg, #15181c 0%, #1a1d21 100%);\n            padding: 0; border-radius: 20px;\n            width: 640px; max-width: 95%; max-height: 85vh;\n            color: white; border: 1px solid #2a2a2a;\n            position: relative; overflow: hidden;\n            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);\n            animation: slideUp 0.3s ease;\n        ";

    // Header do modal
    var header = document.createElement('div');
    header.style = "\n            padding: 28px 28px 22px 28px;\n            border-bottom: 1px solid #2a2a2a;\n            background: linear-gradient(180deg, rgba(29, 155, 240, 0.1) 0%, transparent 100%);\n        ";
    var headerTop = document.createElement('div');
    headerTop.style = 'display: flex; justify-content: space-between; align-items: flex-start;';
    var titleSection = document.createElement('div');
    var titleRow = document.createElement('div');
    titleRow.style = 'display: flex; align-items: center; gap: 14px; margin-bottom: 8px;';
    var iconCircle = document.createElement('div');
    iconCircle.innerHTML = ICON_USER.replace('width="16"', 'width="22"').replace('height="16"', 'height="22"');
    iconCircle.style = "\n            width: 44px; height: 44px; border-radius: 12px;\n            background: linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%);\n            display: flex; align-items: center; justify-content: center;\n            box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);\n        ";
    var title = document.createElement('h3');
    title.innerText = 'Auto-tag por Pessoa';
    title.style = "margin: 0; color: white; font-size: 22px; font-weight: 650; letter-spacing: -0.01em; font-family: ".concat(LOCAL_FONT_STACK, ";");
    titleRow.appendChild(iconCircle);
    titleRow.appendChild(title);
    titleSection.appendChild(titleRow);
    var subtitle = document.createElement('p');
    subtitle.innerText = 'Configure tags automáticas para usuários específicos';
    subtitle.style = "margin: 0; color: #8b98a5; font-size: 13px; margin-left: 58px; line-height: 1.4; font-family: ".concat(LOCAL_FONT_STACK, ";");
    titleSection.appendChild(subtitle);
    headerTop.appendChild(titleSection);

    // Botão X de fechar
    var closeX = document.createElement('button');
    closeX.innerHTML = ICON_X.replace('width="16"', 'width="20"').replace('height="16"', 'height="20"');
    closeX.style = "\n            background: rgba(255, 255, 255, 0.05); border: none; color: #666;\n            cursor: pointer; padding: 10px; border-radius: 10px;\n            display: flex; align-items: center; justify-content: center;\n            transition: all 0.2s;\n        ";
    closeX.onmouseenter = function () {
      closeX.style.color = 'white';
      closeX.style.background = 'rgba(255,255,255,0.1)';
    };
    closeX.onmouseleave = function () {
      closeX.style.color = '#666';
      closeX.style.background = 'rgba(255,255,255,0.05)';
    };
    closeX.onclick = function () {
      return overlay.remove();
    };
    headerTop.appendChild(closeX);
    header.appendChild(headerTop);
    modal.appendChild(header);

    // Corpo do modal
    var body = document.createElement('div');
    body.style = 'padding: 28px; overflow-y: auto; max-height: calc(85vh - 200px);';

    // Seção de adicionar nova regra
    var addSection = document.createElement('div');
    addSection.style = "\n            background: #1e2126; border-radius: 18px; padding: 22px;\n            margin-bottom: 28px; border: 1px solid #2a2a2a;\n        ";
    var addTitle = document.createElement('div');
    addTitle.innerText = 'Adicionar Nova Regra';
    addTitle.style = "color: white; font-size: 14px; font-weight: 650; margin-bottom: 16px; letter-spacing: 0.01em; font-family: ".concat(LOCAL_FONT_STACK, ";");
    addSection.appendChild(addTitle);
    var inputRow = document.createElement('div');
    inputRow.style = 'display: flex; gap: 14px; align-items: flex-start;';

    // Input @username com autocomplete customizado
    var userInputWrapper = document.createElement('div');
    userInputWrapper.style = 'flex: 1; position: relative; min-width: 170px;';
    var userInput = document.createElement('input');
    userInput.type = 'text';
    userInput.placeholder = 'usuario';
    userInput.autocomplete = 'off';
    userInput.style = "\n            width: 100%; height: 50px; padding: 0 16px 0 40px;\n            border-radius: 12px; border: 1px solid #333;\n            background: #2d2d2d; color: white; font-size: 14px;\n            font-family: ".concat(LOCAL_FONT_STACK, ";\n            transition: border-color 0.2s, box-shadow 0.2s;\n            box-sizing: border-box;\n        ");

    // Ícone @ dentro do input
    var atIcon = document.createElement('span');
    atIcon.innerText = '@';
    atIcon.style = "\n            position: absolute; left: 16px; top: 15px;\n            color: #1d9bf0; font-weight: bold; font-size: 14px;\n            pointer-events: none;\n        ";

    // Dropdown customizado
    var dropdown = document.createElement('div');
    dropdown.style = "\n            position: absolute; top: calc(100% + 4px); left: 0; right: 0;\n            background: #1e2126; border: 1px solid #333; border-radius: 12px;\n            max-height: 200px; overflow-y: auto; overflow-x: hidden; z-index: 10005;\n            display: none; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);\n        ";

    // Lista de usernames existentes
    var existingUsernames = [];
    getBookmarks().forEach(function (b) {
      var handle = extractHandle(b.postUrl);
      if (handle && !existingUsernames.includes(handle)) {
        existingUsernames.push(handle);
      }
    });
    function renderDropdown() {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      dropdown.innerHTML = '';

      // Smart Selector: esconder usuários que já têm regras
      var editingUser = normalizeAutotagUsername(editingUsername).replace('@', '').toLowerCase();
      var existingRuleUsers = getNormalizedAutotagRules().map(function (r) {
        return r.username.replace('@', '').toLowerCase();
      }).filter(function (username) {
        return username !== editingUser;
      });
      var filtered = existingUsernames.filter(function (u) {
        return !existingRuleUsers.includes(u.toLowerCase());
      });
      if (filter) {
        filtered = filtered.filter(function (u) {
          return u.toLowerCase().includes(filter.toLowerCase());
        });
      }
      if (filtered.length === 0) {
        dropdown.style.display = 'none';
        return;
      }
      filtered.forEach(function (username) {
        var item = document.createElement('div');
        item.style = "\n                    padding: 12px 16px; cursor: pointer;\n                    display: flex; align-items: center; gap: 10px;\n                    transition: background 0.15s;\n                    border-bottom: 1px solid #2a2a2a;\n                ";
        item.onmouseenter = function () {
          return item.style.background = '#2d2d2d';
        };
        item.onmouseleave = function () {
          return item.style.background = 'transparent';
        };
        var avatarIcon = document.createElement('div');
        avatarIcon.innerHTML = ICON_USER.replace('width="16"', 'width="16"').replace('height="16"', 'height="16"');
        avatarIcon.style = "\n                    width: 32px; height: 32px; border-radius: 50%;\n                    background: linear-gradient(135deg, #333 0%, #252525 100%);\n                    display: flex; align-items: center; justify-content: center;\n                    color: #888; flex-shrink: 0;\n                ";
        var usernameText = document.createElement('span');
        usernameText.innerHTML = "<span style=\"color: #1d9bf0;\">@</span><span style=\"color: white;\">".concat(username, "</span>");
        usernameText.style = 'font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0;';
        item.appendChild(avatarIcon);
        item.appendChild(usernameText);
        item.onclick = function () {
          userInput.value = username;
          dropdown.style.display = 'none';
          userInput.focus();
        };
        dropdown.appendChild(item);
      });

      // Remove last border
      if (dropdown.lastChild) {
        dropdown.lastChild.style.borderBottom = 'none';
      }
      dropdown.style.display = 'block';
    }
    userInput.onfocus = function () {
      userInput.style.borderColor = '#1d9bf0';
      userInput.style.boxShadow = '0 0 0 3px rgba(29,155,240,0.15)';
      if (existingUsernames.length > 0) {
        renderDropdown(userInput.value);
      }
    };
    userInput.onblur = function () {
      userInput.style.borderColor = '#333';
      userInput.style.boxShadow = 'none';
      // Delay para permitir click no dropdown
      setTimeout(function () {
        return dropdown.style.display = 'none';
      }, 150);
    };
    userInput.oninput = function () {
      renderDropdown(userInput.value);
    };
    userInputWrapper.appendChild(userInput);
    userInputWrapper.appendChild(atIcon);
    userInputWrapper.appendChild(dropdown);

    // Seletor de múltiplas tags
    var tagSelectWrapper = document.createElement('div');
    tagSelectWrapper.style = 'flex: 1.6; position: relative; min-width: 230px;';
    var selectedTags = new Set();
    var editingUsername = null;

    // Container que parece um input com chips
    var tagContainer = document.createElement('div');
    tagContainer.style = "\n            min-height: 50px; padding: 8px 12px;\n            border-radius: 12px; border: 1px solid #333;\n            background: #2d2d2d; color: white; font-size: 14px;\n            font-family: ".concat(LOCAL_FONT_STACK, "; box-sizing: border-box;\n            cursor: pointer; display: flex; flex-wrap: wrap; gap: 6px;\n            align-items: center; transition: border-color 0.2s;\n        ");
    var placeholder = document.createElement('span');
    placeholder.innerText = 'Clique para selecionar tags...';
    placeholder.style = 'color: #666; font-size: 13px;';

    // Dropdown de tags
    var tagDropdown = document.createElement('div');
    tagDropdown.style = "\n            position: absolute; top: calc(100% + 4px); left: 0; right: 0;\n            background: #1e2126; border: 1px solid #333; border-radius: 12px;\n            max-height: 180px; overflow-y: auto; z-index: 10005;\n            display: none; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);\n        ";
    function renderTagChips() {
      tagContainer.innerHTML = '';
      if (selectedTags.size === 0) {
        tagContainer.appendChild(placeholder);
        return;
      }
      selectedTags.forEach(function (tag) {
        var chip = document.createElement('div');
        chip.style = "\n                    display: flex; align-items: center; gap: 4px;\n                    background: #1d9bf0; padding: 4px 10px;\n                    border-radius: 14px; font-size: 12px; color: white;\n                ";
        var tagText = document.createElement('span');
        tagText.innerText = tag;
        var removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.style = "\n                    background: none; border: none; color: rgba(255, 255, 255, 0.7);\n                    cursor: pointer; font-size: 14px; padding: 0 2px;\n                    display: flex; align-items: center;\n                ";
        removeBtn.onmouseenter = function () {
          return removeBtn.style.color = 'white';
        };
        removeBtn.onmouseleave = function () {
          return removeBtn.style.color = 'rgba(255,255,255,0.7)';
        };
        removeBtn.onclick = function (e) {
          e.stopPropagation();
          selectedTags.delete(tag);
          renderTagChips();
          renderTagDropdown();
        };
        chip.appendChild(tagText);
        chip.appendChild(removeBtn);
        tagContainer.appendChild(chip);
      });
    }
    function renderTagDropdown() {
      tagDropdown.innerHTML = '';
      var allTags = getTags();
      if (allTags.length === 0) {
        var emptyMsg = document.createElement('div');
        emptyMsg.innerText = 'Nenhuma tag criada ainda';
        emptyMsg.style = 'padding: 16px; color: #666; font-size: 13px; text-align: center;';
        tagDropdown.appendChild(emptyMsg);
        return;
      }
      allTags.forEach(function (tag) {
        var isSelected = selectedTags.has(tag);
        var item = document.createElement('div');
        item.style = "\n                    padding: 12px 16px; cursor: pointer;\n                    display: flex; align-items: center; justify-content: space-between;\n                    transition: background 0.15s;\n                    border-bottom: 1px solid #2a2a2a;\n                    background: ".concat(isSelected ? 'rgba(29,155,240,0.1)' : 'transparent', ";\n                ");
        item.onmouseenter = function () {
          return item.style.background = isSelected ? 'rgba(29,155,240,0.15)' : '#2d2d2d';
        };
        item.onmouseleave = function () {
          return item.style.background = isSelected ? 'rgba(29,155,240,0.1)' : 'transparent';
        };
        var tagText = document.createElement('span');
        tagText.innerText = tag;
        tagText.style = "color: ".concat(isSelected ? '#1d9bf0' : 'white', "; font-size: 14px;");
        var checkIcon = document.createElement('span');
        checkIcon.innerHTML = isSelected ? "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#1d9bf0\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 6 9 17l-5-5\" /></svg>" : '';
        checkIcon.style = 'display: flex; align-items: center;';
        item.appendChild(tagText);
        item.appendChild(checkIcon);
        item.onclick = function (e) {
          e.stopPropagation();
          if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
          } else {
            selectedTags.add(tag);
          }
          renderTagChips();
          renderTagDropdown();
        };
        tagDropdown.appendChild(item);
      });

      // Remove last border
      if (tagDropdown.lastChild) {
        tagDropdown.lastChild.style.borderBottom = 'none';
      }
    }
    renderTagChips();
    renderTagDropdown();
    var formActionsRow = document.createElement('div');
    formActionsRow.style = 'display: none; gap: 10px; align-items: center; margin-top: 14px;';
    var editStatus = document.createElement('span');
    editStatus.style = "flex: 1; color: #8b98a5; font-size: 12px; font-family: ".concat(LOCAL_FONT_STACK, ";");
    var cancelEditBtn = document.createElement('button');
    cancelEditBtn.innerText = 'Cancelar edição';
    cancelEditBtn.style = "\n            background: transparent; border: 1px solid #3a3f45; color: #d7dbdf;\n            padding: 9px 14px; border-radius: 10px; cursor: pointer;\n            font-size: 13px; font-weight: 600; font-family: ".concat(LOCAL_FONT_STACK, ";\n            transition: all 0.2s;\n        ");
    cancelEditBtn.onmouseenter = function () {
      cancelEditBtn.style.borderColor = '#66727f';
      cancelEditBtn.style.color = 'white';
    };
    cancelEditBtn.onmouseleave = function () {
      cancelEditBtn.style.borderColor = '#3a3f45';
      cancelEditBtn.style.color = '#d7dbdf';
    };
    formActionsRow.appendChild(editStatus);
    formActionsRow.appendChild(cancelEditBtn);
    function setButtonMode(isEditing) {
      if (isEditing) {
        addTitle.innerText = 'Editar Regra Existente';
        addRuleBtn.innerHTML = ICON_CHECK.replace('width="16"', 'width="20"').replace('height="16"', 'height="20"');
        addRuleBtn.title = 'Salvar alterações';
        formActionsRow.style.display = 'flex';
        editStatus.innerText = 'Editando ' + editingUsername + '. Altere o @ e as tags, depois salve.';
        return;
      }
      addTitle.innerText = 'Adicionar Nova Regra';
      addRuleBtn.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>";
      addRuleBtn.title = 'Adicionar regra';
      formActionsRow.style.display = 'none';
      editStatus.innerText = '';
    }
    function resetAutotagForm() {
      editingUsername = null;
      userInput.value = '';
      selectedTags.clear();
      renderTagChips();
      renderTagDropdown();
      setButtonMode(false);
    }
    function editRulesForUsername(username, tags) {
      editingUsername = normalizeAutotagUsername(username);
      userInput.value = editingUsername.replace('@', '');
      selectedTags.clear();
      tags.forEach(function (tag) {
        return selectedTags.add(tag);
      });
      renderTagChips();
      renderTagDropdown();
      setButtonMode(true);
      userInput.focus();
    }
    cancelEditBtn.onclick = resetAutotagForm;
    var tagDropdownOpen = false;
    tagContainer.onclick = function () {
      tagDropdownOpen = !tagDropdownOpen;
      tagDropdown.style.display = tagDropdownOpen ? 'block' : 'none';
      tagContainer.style.borderColor = tagDropdownOpen ? '#1d9bf0' : '#333';
    };

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function (e) {
      if (!tagSelectWrapper.contains(e.target)) {
        tagDropdownOpen = false;
        tagDropdown.style.display = 'none';
        tagContainer.style.borderColor = '#333';
      }
    });
    tagSelectWrapper.appendChild(tagContainer);
    tagSelectWrapper.appendChild(tagDropdown);

    // Botão adicionar
    var addRuleBtn = document.createElement('button');
    addRuleBtn.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>";
    addRuleBtn.style = "\n            background: linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%);\n            border: none; color: white; width: 50px; min-width: 50px; height: 50px;\n            border-radius: 12px; cursor: pointer; font-size: 20px;\n            display: flex; align-items: center; justify-content: center;\n            transition: transform 0.2s, box-shadow 0.2s;\n            box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);\n        ";
    addRuleBtn.onmouseenter = function () {
      addRuleBtn.style.transform = 'scale(1.05)';
      addRuleBtn.style.boxShadow = '0 6px 16px rgba(29,155,240,0.4)';
    };
    addRuleBtn.onmouseleave = function () {
      addRuleBtn.style.transform = 'scale(1)';
      addRuleBtn.style.boxShadow = '0 4px 12px rgba(29,155,240,0.3)';
    };
    addRuleBtn.onclick = function () {
      var username = userInput.value.trim();
      if (!username) {
        showToast('Digite um @usuário');
        return;
      }
      if (selectedTags.size === 0) {
        showToast('Selecione ao menos uma tag');
        return;
      }

      // Remover @ se o usuário já digitou (pois vamos adicionar)
      username = username.replace(/^@/, '');
      var formattedUsername = '@' + username;
      var previousUsername = editingUsername || formattedUsername;
      if (!editingUsername && getAutotagTagsForUsername(formattedUsername).length > 0) {
        showToast('Este usuário já existe. Use editar para alterar tags.');
        return;
      }
      var result = upsertAutotagRulesForUsername(previousUsername, formattedUsername, Array.from(selectedTags));
      if (!result.saved) {
        if (result.conflict) {
          showToast(result.username + ' já possui regras. Edite esse usuário diretamente para evitar perda de dados.');
          return;
        }
        showToast('Não foi possível salvar a regra');
        return;
      }
      resetAutotagForm();
      renderRules();
      showToast("".concat(result.count, " tag").concat(result.count > 1 ? 's' : '', " salva").concat(result.count > 1 ? 's' : '', " para ").concat(result.username));
    };

    // Enter para adicionar
    userInput.onkeypress = function (e) {
      if (e.key === 'Enter') addRuleBtn.click();
    };
    inputRow.appendChild(userInputWrapper);
    inputRow.appendChild(tagSelectWrapper);
    inputRow.appendChild(addRuleBtn);
    addSection.appendChild(inputRow);
    addSection.appendChild(formActionsRow);

    // Dica
    var hint = document.createElement('div');
    hint.innerHTML = "\uD83D\uDCA1 <span style=\"color: #666;\">Dica: Selecione m\xFAltiplas tags para aplicar todas automaticamente ao salvar bookmark de @usu\xE1rio.</span>";
    hint.style = "margin-top: 14px; font-size: 12px; line-height: 1.45; color: #8899a6; font-family: ".concat(LOCAL_FONT_STACK, ";");
    addSection.appendChild(hint);
    body.appendChild(addSection);

    // Seção de regras existentes
    var rulesSection = document.createElement('div');
    var rulesTitleRow = document.createElement('div');
    rulesTitleRow.style = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;';
    var rulesTitle = document.createElement('div');
    rulesTitle.style = "color: white; font-size: 14px; font-weight: 650; letter-spacing: 0.01em; font-family: ".concat(LOCAL_FONT_STACK, ";");
    var rulesCount = document.createElement('span');
    rulesCount.id = 'autotag-rules-count';
    rulesCount.style = "\n            background: #2d2d2d; color: #888; padding: 4px 10px;\n            border-radius: 20px; font-size: 12px; font-family: ".concat(LOCAL_FONT_STACK, ";\n        ");
    rulesTitleRow.appendChild(rulesTitle);
    rulesTitleRow.appendChild(rulesCount);
    rulesSection.appendChild(rulesTitleRow);

    // Container das regras
    var rulesContainer = document.createElement('div');
    rulesContainer.id = 'autotag-rules-list';
    rulesContainer.style = 'display: flex; flex-direction: column; gap: 12px;';
    function renderRules() {
      rulesContainer.innerHTML = '';
      var rules = getNormalizedAutotagRules();
      saveAutotagRules(rules);
      rulesTitle.innerText = 'Regras Configuradas';
      rulesCount.innerText = rules.length + ' regra' + (rules.length !== 1 ? 's' : '');
      if (rules.length === 0) {
        var emptyState = document.createElement('div');
        emptyState.style = "\n                    text-align: center; padding: 40px 20px;\n                    background: #1e2126; border-radius: 16px;\n                    border: 1px dashed #333;\n                ";
        emptyState.innerHTML = "\n                    <div style=\"font-size: 40px; margin-bottom: 12px;\">\uD83D\uDCCB</div>\n                    <div style=\"color: #666; font-size: 14px;\">Nenhuma regra configurada</div>\n                    <div style=\"color: #555; font-size: 12px; margin-top: 4px;\">Adicione sua primeira regra acima</div>\n            ";
        rulesContainer.appendChild(emptyState);
        return;
      }

      // Agrupar regras por usuário
      var groupedRules = {};
      rules.forEach(function (rule, idx) {
        if (!groupedRules[rule.username]) {
          groupedRules[rule.username] = [];
        }
        groupedRules[rule.username].push(_objectSpread(_objectSpread({}, rule), {}, {
          originalIndex: idx
        }));
      });
      Object.keys(groupedRules).forEach(function (username) {
        var userRules = groupedRules[username];
        var card = document.createElement('div');
        card.className = 'autotag-rule-card';
        card.style = "\n                    background: #1e2126; border-radius: 16px; padding: 18px;\n                    border: 1px solid #2a2a2a; transition: all 0.2s;\n                    animation: ruleSlideIn 0.3s ease;\n                ";
        var cardHeader = document.createElement('div');
        cardHeader.style = 'display: flex; align-items: flex-start; gap: 14px;';

        // Avatar placeholder
        var avatar = document.createElement('div');
        avatar.innerHTML = ICON_USER.replace('width="16"', 'width="18"').replace('height="16"', 'height="18"');
        avatar.style = "\n                    width: 40px; height: 40px; border-radius: 10px;\n                    background: linear-gradient(135deg, #2d2d2d 0%, #252525 100%);\n                    display: flex; align-items: center; justify-content: center;\n                    color: #1d9bf0; flex-shrink: 0;\n                ";
        var userInfo = document.createElement('div');
        userInfo.style = 'flex: 1; min-width: 0;';
        var usernameEl = document.createElement('div');
        usernameEl.innerText = username;
        usernameEl.style = "color: #1d9bf0; font-size: 15px; font-weight: 650; letter-spacing: 0.01em; font-family: ".concat(LOCAL_FONT_STACK, ";");
        var tagsList = document.createElement('div');
        tagsList.style = 'display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;';
        userRules.forEach(function (ruleData) {
          var tagChip = document.createElement('div');
          tagChip.style = "\n                        display: flex; align-items: center; gap: 6px;\n                        background: #2d2d2d; padding: 6px 12px;\n                        border-radius: 20px; font-size: 13px; color: #ccc;\n                    ";
          var tagText = document.createElement('span');
          tagText.innerText = ruleData.tag;
          var removeTagBtn = document.createElement('button');
          removeTagBtn.className = 'autotag-quick-remove';
          removeTagBtn.innerHTML = ICON_X.replace('width="16"', 'width="12"').replace('height="16"', 'height="12"');
          removeTagBtn.style = "\n                        background: none; border: none; color: #666;\n                        cursor: pointer; padding: 2px;\n                        display: flex; align-items: center;\n                        transition: color 0.2s;\n                    ";
          removeTagBtn.onmouseenter = function () {
            return removeTagBtn.style.color = '#e74c3c';
          };
          removeTagBtn.onmouseleave = function () {
            return removeTagBtn.style.color = '#666';
          };
          removeTagBtn.onclick = function (e) {
            e.stopPropagation();
            var allRules = getNormalizedAutotagRules();
            allRules.splice(ruleData.originalIndex, 1);
            saveAutotagRules(allRules);
            if (editingUsername === username) {
              resetAutotagForm();
            }
            renderRules();
            showToast("Regra removida: ".concat(username, " \u2192 ").concat(ruleData.tag, " "));
          };
          tagChip.appendChild(tagText);
          tagChip.appendChild(removeTagBtn);
          tagsList.appendChild(tagChip);
        });
        userInfo.appendChild(usernameEl);
        userInfo.appendChild(tagsList);
        var editPersonBtn = document.createElement('button');
        editPersonBtn.innerHTML = ICON_PENCIL_SMALL;
        editPersonBtn.title = 'Editar @usuário e tags';
        editPersonBtn.style = "\n                    background: transparent; border: 1px solid #333;\n                    color: #8b98a5; padding: 8px; border-radius: 8px;\n                    cursor: pointer; display: flex; align-items: center;\n                    justify-content: center; transition: all 0.2s;\n                    flex-shrink: 0;\n                ";
        editPersonBtn.onmouseenter = function () {
          editPersonBtn.style.borderColor = '#1d9bf0';
          editPersonBtn.style.color = '#1d9bf0';
        };
        editPersonBtn.onmouseleave = function () {
          editPersonBtn.style.borderColor = '#333';
          editPersonBtn.style.color = '#8b98a5';
        };
        editPersonBtn.onclick = function (e) {
          e.stopPropagation();
          editRulesForUsername(username, userRules.map(function (ruleData) {
            return ruleData.tag;
          }));
        };

        // Botão Delete Person
        var deletePersonBtn = document.createElement('button');
        deletePersonBtn.innerHTML = ICON_TRASH;
        deletePersonBtn.title = 'Remover todas as regras deste usuário';
        deletePersonBtn.style = "\n                    background: transparent; border: 1px solid #333;\n                    color: #666; padding: 8px; border-radius: 8px;\n                    cursor: pointer; display: flex; align-items: center;\n                    justify-content: center; transition: all 0.2s;\n                    flex-shrink: 0;\n                ";
        deletePersonBtn.onmouseenter = function () {
          deletePersonBtn.style.borderColor = '#f4212e';
          deletePersonBtn.style.color = '#f4212e';
        };
        deletePersonBtn.onmouseleave = function () {
          deletePersonBtn.style.borderColor = '#333';
          deletePersonBtn.style.color = '#666';
        };
        deletePersonBtn.onclick = function (e) {
          e.stopPropagation();
          showConfirmModal("Remover todas as ".concat(userRules.length, " regra(s) de ").concat(username, "?"), function () {
            var allRules = getNormalizedAutotagRules();
            var filteredRules = allRules.filter(function (r) {
              return r.username !== username;
            });
            saveAutotagRules(filteredRules);
            if (editingUsername === username) {
              resetAutotagForm();
            }
            renderRules();
            showToast("Todas as regras de ".concat(username, " removidas"));
          });
        };
        var cardActions = document.createElement('div');
        cardActions.style = 'display: flex; gap: 8px; align-items: center; flex-shrink: 0;';
        cardActions.appendChild(editPersonBtn);
        cardActions.appendChild(deletePersonBtn);
        cardHeader.appendChild(avatar);
        cardHeader.appendChild(userInfo);
        cardHeader.appendChild(cardActions);
        card.appendChild(cardHeader);
        rulesContainer.appendChild(card);
      });
    }
    renderRules();
    rulesSection.appendChild(rulesContainer);
    body.appendChild(rulesSection);
    modal.appendChild(body);
    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };
    document.body.appendChild(overlay);
  }
  var TAG_FAVORITES = '__FAVORITES__';

  // ==================== TELEGRAM ROUTES MODAL ====================
  function TelegramRoutesModal() {
    if (document.getElementById('pinboard-telegram-routes-overlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'pinboard-telegram-routes-overlay';
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0, 0, 0, 0.85); z-index: 10002;\n            display: flex; justify-content: center; align-items: center;\n            animation: fadeIn 0.2s ease;\n            font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n        ";
    if (!document.getElementById('telegram-routes-styles')) {
      var style = document.createElement('style');
      style.id = 'telegram-routes-styles';
      style.textContent = "\n                .tg-route-card:hover { border-color: #444 !important; background: #252525 !important; }\n                .tg-route-card .remove-btn { opacity: 0; transition: opacity 0.2s; }\n                .tg-route-card:hover .remove-btn { opacity: 1; }\n                input[type=\"number\"]::-webkit-outer-spin-button,\n                input[type=\"number\"]::-webkit-inner-spin-button {\n                    -webkit-appearance: none;\n                    margin: 0;\n                }\n                input[type=\"number\"] {\n                    -moz-appearance: textfield;\n                }\n            ";
      document.head.appendChild(style);
    }
    var modal = document.createElement('div');
    modal.style = "\n            background: linear-gradient(145deg, #15181c 0%, #1a1d21 100%);\n            padding: 0; border-radius: 20px; width: 550px; max-width: 95%; max-height: 85vh;\n            color: white; border: 1px solid #2a2a2a; position: relative; overflow: hidden;\n            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); animation: slideUp 0.3s ease; display:flex; flex-direction:column;\n        ";
    var header = document.createElement('div');
    header.style = 'padding: 25px 25px 20px 25px; border-bottom: 1px solid #2a2a2a; background: linear-gradient(180deg, rgba(29, 155, 240, 0.1) 0%, transparent 100%); display:flex; justify-content:space-between; align-items:flex-start;';
    var titleSection = document.createElement('div');
    var titleRow = document.createElement('div');
    titleRow.style = 'display: flex; align-items: center; gap: 12px; margin-bottom: 8px;';
    var iconCircle = document.createElement('div');
    iconCircle.innerHTML = ICON_TELEGRAM.replace('width="22"', 'width="24"').replace('height="22"', 'height="24"');
    iconCircle.style = "width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);";
    var title = document.createElement('h3');
    title.innerText = 'Roteamento de Tópicos';
    title.style = 'margin: 0; color: white; font-size: 22px; font-weight: 600;';
    titleRow.appendChild(iconCircle);
    titleRow.appendChild(title);
    titleSection.appendChild(titleRow);
    var subtitle = document.createElement('p');
    subtitle.innerText = 'Envie imagens automaticamente para diferentes chats ou tópicos baseados em Tags ou Favoritos.';
    subtitle.style = 'margin: 0; color: #666; font-size: 13px; margin-left: 56px; line-height:1.4;';
    titleSection.appendChild(subtitle);
    header.appendChild(titleSection);
    var closeX = document.createElement('button');
    closeX.innerHTML = ICON_X.replace('width="16"', 'width="20"').replace('height="16"', 'height="20"');
    closeX.style = "background: rgba(255, 255, 255, 0.05); border: none; color: #666; cursor: pointer; padding: 10px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;";
    closeX.onmouseenter = function () {
      closeX.style.color = 'white';
      closeX.style.background = 'rgba(255,255,255,0.1)';
    };
    closeX.onmouseleave = function () {
      closeX.style.color = '#666';
      closeX.style.background = 'rgba(255,255,255,0.05)';
    };
    closeX.onclick = function () {
      return overlay.remove();
    };
    header.appendChild(closeX);
    modal.appendChild(header);
    var body = document.createElement('div');
    body.style = 'padding: 25px; overflow-y: auto; flex:1;';
    var addSection = document.createElement('div');
    addSection.style = 'background: #1e2126; border-radius: 16px; padding: 20px; margin-bottom: 25px; border: 1px solid #2a2a2a; margin-top: 5px;';
    var topRow = document.createElement('div');
    topRow.style = 'display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: stretch; margin-bottom: 12px; width: 100%;';
    var bottomRow = document.createElement('div');
    bottomRow.style = 'display: flex; gap: 12px; align-items: stretch; margin-bottom: 12px; width: 100%;';
    var tagSelectWrapper = document.createElement('div');
    tagSelectWrapper.style = 'position: relative;';
    var tagSelect = document.createElement('select');
    tagSelect.style = "width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #333; background: #2d2d2d; color: white; font-size: 14px; transition: border-color 0.2s; box-sizing: border-box; appearance: none; cursor:pointer;";
    var selectHtml = "<option value=\"\" disabled selected>Escolha o Gatilho...</option><option value=\"".concat(TAG_FAVORITES, "\">\u2B50 Favoritos</option>");
    getTags().forEach(function (t) {
      return selectHtml += "<option value=\"".concat(t, "\">\uD83C\uDFF7\uFE0F ").concat(t, "</option>");
    });
    tagSelect.innerHTML = selectHtml;
    tagSelectWrapper.appendChild(tagSelect);

    // Chevron para o select para parecer customizado
    var selectChevron = document.createElement('div');
    selectChevron.innerHTML = ICON_CHEVRON_DOWN;
    selectChevron.style = 'position:absolute; right:15px; top:15px; pointer-events:none; color:#666;';
    tagSelectWrapper.appendChild(selectChevron);
    var topicInputWrapper = document.createElement('div');
    topicInputWrapper.style = 'position: relative;';
    var topicInput = document.createElement('input');
    topicInput.type = 'text';
    topicInput.inputMode = 'numeric';
    topicInput.placeholder = 'ID do Tópico';
    topicInput.style = "flex: 1; width: 100%; height: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #333; background: #2d2d2d; color: white; font-size: 14px; font-family:monospace; box-sizing: border-box;";
    topicInputWrapper.appendChild(topicInput);
    var helpIcon = document.createElement('span');
    helpIcon.innerHTML = '?';
    helpIcon.title = 'Para pegar o ID de um Tópico, clique com o botão direito em qualquer mensagem dele no Telegram > Copiar Link. O ID do tópico é o número que vem depois do ID do grupo. Ex: t.me/c/12345/6789 -> O ID do Tópico é 6789.';
    helpIcon.style = 'position: absolute; right: 10px; top: 13px; cursor: help; color: #888; border: 1px solid #444; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-family: sans-serif; opacity: 0.7; transition: opacity 0.2s; background: #2d2d2d;';
    helpIcon.onmouseenter = function () {
      return helpIcon.style.opacity = '1';
    };
    helpIcon.onmouseleave = function () {
      return helpIcon.style.opacity = '0.7';
    };
    topicInputWrapper.appendChild(helpIcon);
    var aliasInputWrapper = document.createElement('div');
    aliasInputWrapper.style = 'flex: 1; position: relative;';
    var aliasInput = document.createElement('input');
    aliasInput.type = 'text';
    aliasInput.placeholder = 'Nome (Opcional)';
    aliasInput.style = "width: 100%; height: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #333; background: #2d2d2d; color: white; font-size: 14px; box-sizing: border-box;";
    aliasInputWrapper.appendChild(aliasInput);
    var nameHelpIcon = document.createElement('span');
    nameHelpIcon.innerHTML = '?';
    nameHelpIcon.title = 'Apenas um apelido visual (ex: "Pictures") para organizar sua visualização de tópicos nesta lista de regras.';
    nameHelpIcon.style = 'position: absolute; right: 10px; top: 13px; cursor: help; color: #888; border: 1px solid #444; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-family: sans-serif; opacity: 0.7; transition: opacity 0.2s; background: #2d2d2d;';
    nameHelpIcon.onmouseenter = function () {
      return nameHelpIcon.style.opacity = '1';
    };
    nameHelpIcon.onmouseleave = function () {
      return nameHelpIcon.style.opacity = '0.7';
    };
    aliasInputWrapper.appendChild(nameHelpIcon);
    var addRuleBtn = document.createElement('button');
    addRuleBtn.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>";
    addRuleBtn.style = "background: linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%); border: none; color: white; width: 48px; min-width: 48px; height: 48px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3); transition: transform 0.2s;";
    addRuleBtn.onmouseenter = function () {
      addRuleBtn.style.transform = 'scale(1.05)';
    };
    addRuleBtn.onmouseleave = function () {
      addRuleBtn.style.transform = 'scale(1)';
    };
    topRow.appendChild(tagSelectWrapper);
    topRow.appendChild(topicInputWrapper);
    bottomRow.appendChild(aliasInputWrapper);
    bottomRow.appendChild(addRuleBtn);
    addSection.appendChild(topRow);
    addSection.appendChild(bottomRow);
    var optionsRow = document.createElement('div');
    optionsRow.style = 'display:flex; gap:15px; align-items:center;';
    var copyGeneralLabel = document.createElement('label');
    copyGeneralLabel.style = 'display:flex; align-items:center; gap:8px; color:#aaa; font-size:13px; cursor:pointer; user-select:none;';
    var copyGeneralCheck = document.createElement('input');
    copyGeneralCheck.type = 'checkbox';
    copyGeneralCheck.checked = true; // Por padrão, mantém no geral
    copyGeneralCheck.style = 'accent-color: #1d9bf0; width:16px; height:16px; cursor:pointer;';
    copyGeneralLabel.appendChild(copyGeneralCheck);
    copyGeneralLabel.appendChild(document.createTextNode('Enviar também para o Chat Geral'));
    optionsRow.appendChild(copyGeneralLabel);
    addSection.appendChild(optionsRow);
    body.appendChild(addSection);
    var rulesTitleRow = document.createElement('div');
    rulesTitleRow.style = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';
    var rulesTitle = document.createElement('div');
    rulesTitle.innerText = 'Rotas Configuradas';
    rulesTitle.style = 'color: white; font-size: 14px; font-weight: 500;';
    var rulesCount = document.createElement('span');
    rulesCount.style = "background: #2d2d2d; color: #888; padding: 4px 10px; border-radius: 20px; font-size: 12px;";
    rulesTitleRow.appendChild(rulesTitle);
    rulesTitleRow.appendChild(rulesCount);
    body.appendChild(rulesTitleRow);
    var rulesList = document.createElement('div');
    rulesList.style = 'display: flex; flex-direction: column; gap: 8px;';
    function renderRules() {
      rulesList.innerHTML = '';
      var routes = getTelegramRoutes();
      rulesCount.innerText = routes.length + ' rota' + (routes.length !== 1 ? 's' : '');
      if (routes.length === 0) {
        rulesList.innerHTML = "<div style=\"text-align:center; padding:30px 20px; background:#1e2126; border-radius:16px; border:1px dashed #333; color:#666; font-size:13px;\">Nenhuma rota configurada</div>";
        return;
      }
      routes.forEach(function (route, idx) {
        var card = document.createElement('div');
        card.className = 'tg-route-card';
        card.style = "background: #1e2126; border-radius: 12px; padding: 12px 16px; border: 1px solid #2a2a2a; display:flex; align-items:center; gap:15px; animation: fadeIn 0.3s ease;";
        var tagIcon = document.createElement('div');
        tagIcon.innerHTML = route.tag === TAG_FAVORITES ? '⭐' : '🏷️';
        tagIcon.style = 'font-size: 18px; width:36px; height:36px; border-radius:10px; background:#2d2d2d; display:flex; align-items:center; justify-content:center;';
        var infoCol = document.createElement('div');
        infoCol.style = 'flex:1; display:flex; flex-direction:column; gap:4px;';
        var tagEl = document.createElement('div');
        tagEl.innerText = route.tag === TAG_FAVORITES ? 'Favoritos' : route.tag;
        tagEl.style = 'color: #1d9bf0; font-size: 14.5px; font-weight: 500;';
        infoCol.appendChild(tagEl);
        var detailRow = document.createElement('div');
        detailRow.style = 'display:flex; gap:10px; align-items:center;';
        var topicEl = document.createElement('div');
        var displayName = route.topicName ? "".concat(route.topicName, " <span style=\"color:#666;\">(ID: ").concat(route.topicId, ")</span>") : "T\xF3pico: <span style=\"font-family:monospace; color:#ccc;\">".concat(route.topicId, "</span>");
        topicEl.innerHTML = displayName;
        topicEl.style = 'color:#aaa; font-size:12px; background:#2a2a2a; padding:3px 8px; border-radius:6px;';
        detailRow.appendChild(topicEl);
        if (route.copyToGeneral) {
          var copyBadge = document.createElement('div');
          copyBadge.innerText = '+ Geral';
          copyBadge.style = 'color:#22c55e; font-size:11px; font-weight:600; background:rgba(34, 197, 94, 0.1); padding:2px 8px; border-radius:6px;';
          detailRow.appendChild(copyBadge);
        }
        infoCol.appendChild(detailRow);
        var removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = ICON_TRASH;
        removeBtn.title = 'Remover Rota';
        removeBtn.style = "background: transparent; border: none; color: #666; padding: 8px; cursor: pointer; display: flex; transition: color 0.2s;";
        removeBtn.onmouseenter = function () {
          return removeBtn.style.color = '#e74c3c';
        };
        removeBtn.onmouseleave = function () {
          return removeBtn.style.color = '#666';
        };
        removeBtn.onclick = function () {
          var updated = getTelegramRoutes();
          updated.splice(idx, 1);
          saveTelegramRoutes(updated);
          renderRules();
        };
        card.appendChild(tagIcon);
        card.appendChild(infoCol);
        card.appendChild(removeBtn);
        rulesList.appendChild(card);
      });
    }
    addRuleBtn.onclick = function () {
      var tag = tagSelect.value;
      var topicId = topicInput.value.trim();
      var topicAlias = aliasInput.value.trim();
      var copyGeneral = copyGeneralCheck.checked;
      if (!tag) return showToast('Selecione um gatilho');
      if (!topicId) return showToast('Digite o ID do Tópico');
      var routes = getTelegramRoutes();
      if (routes.some(function (r) {
        return r.tag === tag && r.topicId === topicId;
      })) {
        return showToast('Essa rota já existe!');
      }
      routes.push({
        tag: tag,
        topicId: topicId,
        topicName: topicAlias || null,
        copyToGeneral: copyGeneral
      });
      saveTelegramRoutes(routes);
      topicInput.value = '';
      aliasInput.value = '';
      tagSelect.value = '';
      renderRules();
      showToast('Rota adicionada com sucesso');
    };
    renderRules();
    body.appendChild(rulesList);
    modal.appendChild(body);
    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };
    document.body.appendChild(overlay);
  }

  // ==================== UI INJECTION ====================
  function injectButtons() {
    var injectedButtons = document.querySelectorAll('button[data-pinboard-injected="true"]');
    injectedButtons.forEach(function (button) {
      var article = button.closest('article');
      var existingDownloadBtn;
      if (!article) return;
      existingDownloadBtn = article.querySelector('button[data-pinboard-download-injected="true"]');
      if (hasSaveableMedia(article)) {
        button.style.display = '';
        if (existingDownloadBtn) existingDownloadBtn.style.display = '';
        return;
      }
      if (existingDownloadBtn) existingDownloadBtn.style.display = 'none';
      button.style.display = 'none';
    });
    var grokButtons = document.querySelectorAll('button[aria-label="Ações do Grok"]:not([data-pinboard-injected]), article:not([data-pinboard-photo-route-checked])');
    grokButtons.forEach(function (button) {
      var _article$querySelecto, _downloadBtn$querySel;
      var article = button.closest('article');
      var isPhotoRouteArticle = button.tagName && button.tagName.toLowerCase() === 'article';
      if (isPhotoRouteArticle) {
        if (!/\/(photo|video)\/\d+\/?$/.test(window.location.pathname || '')) return;
        article = button;
        if (article.querySelector('button[data-pinboard-injected="true"]')) {
          article.setAttribute('data-pinboard-photo-route-checked', 'true');
          return;
        }
        button = article.querySelector('button[aria-label="Ações do Grok"]:not([data-pinboard-injected])');
        if (!button) {
          if (!hasSaveableMedia(article)) article.setAttribute('data-pinboard-photo-route-checked', 'true');
          return;
        }
      }
      if (!article) {
        button.setAttribute('data-pinboard-injected', 'true');
        return;
      }
      if (article.querySelector('button[data-pinboard-injected="true"]')) return;
      if (!hasSaveableMedia(article)) return;
      if (isPhotoRouteArticle) article.setAttribute('data-pinboard-photo-route-checked', 'true');
      var quotedArea = article.querySelector('[data-testid="quotedTweet"]') || ((_article$querySelecto = article.querySelector('[data-testid="testCondensedMedia"]')) === null || _article$querySelecto === void 0 ? void 0 : _article$querySelecto.closest('[role="link"]'));
      var postUrlElement = null;
      var postDate = null;
      var allTimeElements = article.querySelectorAll('time');
      var _iterator = _createForOfIteratorHelper(allTimeElements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var timeEl = _step.value;
          var link = timeEl.parentElement;
          if (quotedArea && quotedArea.contains(timeEl)) continue;
          if (link && link.getAttribute('href')) {
            postUrlElement = link;
            postDate = timeEl.getAttribute('datetime');
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var postUrl = null;
      if (postUrlElement && postUrlElement.getAttribute('href')) {
        postUrl = normalizeStatusUrl("https://x.com".concat(postUrlElement.getAttribute('href')));
      } else {
        var currentUrl = window.location.href;
        if (isStatusOrMediaPath(window.location.pathname)) {
          postUrl = normalizeStatusUrl(currentUrl);
        }
      }

      // Criar botão de download rápido
      var downloadBtn = button.cloneNode(true);
      downloadBtn.removeAttribute('data-pinboard-injected');
      downloadBtn.setAttribute('data-pinboard-download-injected', 'true');
      downloadBtn.setAttribute('aria-label', 'Download Direto');
      downloadBtn.title = 'Baixar Mídias Direto (Sem Salvar)';
      downloadBtn.style.marginRight = IN_POST_ACTION_BUTTON_GAP;
      applyInPostActionButtonSize(downloadBtn);
      button.style.marginLeft = '0';
      var downloadIconContainer = (_downloadBtn$querySel = downloadBtn.querySelector('svg')) === null || _downloadBtn$querySel === void 0 ? void 0 : _downloadBtn$querySel.parentElement;
      if (downloadIconContainer) {
        downloadIconContainer.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"/></svg>";
        downloadIconContainer.style.transition = 'color 0.2s, transform 0.15s';
        downloadIconContainer.style.color = GRAY_COLOR;
        downloadBtn.onmouseenter = function () {
          downloadIconContainer.style.color = '#17bf63';
        };
        downloadBtn.onmouseleave = function () {
          downloadIconContainer.style.color = GRAY_COLOR;
        };
      }
      downloadBtn.addEventListener('click', /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
          var _postUrl$match;
          var targetSvg, allImgElements, hasVideos, images, lightboxImg, src, primaryUrl, urlObj, vxUrl, vxResponse, data, handle, postId, _t;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.p = _context2.n) {
              case 0:
                e.preventDefault();
                e.stopPropagation();
                if (postUrl) {
                  _context2.n = 1;
                  break;
                }
                return _context2.a(2);
              case 1:
                targetSvg = downloadBtn.querySelector('svg');
                if (targetSvg) {
                  targetSvg.style.transform = 'scale(0.85)';
                  setTimeout(function () {
                    return targetSvg.style.transform = 'scale(1)';
                  }, 150);
                }
                allImgElements = getActionMediaElements(article);
                hasVideos = false;
                images = Array.from(allImgElements).map(function (el) {
                  var src = el.tagName.toLowerCase() === 'video' ? el.poster : el.src;
                  if (el.tagName.toLowerCase() === 'video') hasVideos = true;
                  if (!src) return '';
                  if (src.includes('video_thumb') || src.includes('ext_tw_video_thumb') || src.includes('tweet_video_thumb')) hasVideos = true;
                  if (el.tagName.toLowerCase() === 'img') {
                    if (src.includes('name=')) {
                      return src.replace(/name=[^&]+/, 'name=4096x4096');
                    } else if (src.includes('?')) {
                      return src + '&name=4096x4096';
                    }
                  }
                  return src;
                }).filter(Boolean);
                if (images.length === 0) {
                  lightboxImg = getLightboxMediaElement();
                  if (lightboxImg) {
                    src = lightboxImg.tagName.toLowerCase() === 'video' ? lightboxImg.poster : lightboxImg.src;
                    if (lightboxImg.tagName.toLowerCase() === 'video') hasVideos = true;
                    if (src && (src.includes('video_thumb') || src.includes('ext_tw_video_thumb'))) hasVideos = true;
                    primaryUrl = src;
                    if (lightboxImg.tagName.toLowerCase() === 'img') {
                      if (src.includes('name=')) {
                        primaryUrl = src.replace(/name=[^&]+/, 'name=4096x4096');
                      } else if (src.includes('?')) {
                        primaryUrl = src + '&name=4096x4096';
                      }
                    }
                    if (primaryUrl) images.push(primaryUrl);
                  }
                }
                if (!hasVideos) {
                  _context2.n = 5;
                  break;
                }
                showBookmarkToast('Extraindo vídeo...', false);
                _context2.p = 2;
                urlObj = new URL(postUrl);
                vxUrl = "https://api.vxtwitter.com".concat(urlObj.pathname);
                _context2.n = 3;
                return new Promise(function (resolve) {
                  GM_xmlhttpRequest({
                    method: 'GET',
                    url: vxUrl,
                    onload: function onload(res) {
                      return resolve(res.responseText);
                    },
                    onerror: function onerror(err) {
                      console.error('[pinboard] Erro no GM_xmlhttpRequest:', err);
                      resolve(null);
                    }
                  });
                });
              case 3:
                vxResponse = _context2.v;
                if (vxResponse) {
                  data = JSON.parse(vxResponse);
                  if (data && data.media_extended && data.media_extended.length > 0) {
                    images = data.media_extended.map(function (m) {
                      return m.url;
                    });
                  }
                }
                _context2.n = 5;
                break;
              case 4:
                _context2.p = 4;
                _t = _context2.v;
                console.error('[pinboard] Erro ao buscar vídeo da API vxtwitter:', _t);
              case 5:
                if (!(images.length === 0)) {
                  _context2.n = 6;
                  break;
                }
                alert('Nenhuma imagem ou vídeo encontrado neste post.');
                return _context2.a(2);
              case 6:
                handle = extractHandle(postUrl) || 'unknown';
                postId = ((_postUrl$match = postUrl.match(/status\/(\d+)/)) === null || _postUrl$match === void 0 ? void 0 : _postUrl$match[1]) || Date.now();
                images.forEach(function (url, idx) {
                  var ext = url.includes('.mp4') ? 'mp4' : url.includes('.png') ? 'png' : 'jpg';
                  var filename = "".concat(handle, "_").concat(postId, "_").concat(idx + 1, ".").concat(ext);
                  setTimeout(function () {
                    return downloadImage(url, filename);
                  }, idx * 300);
                });
                showToast("Baixando ".concat(images.length, " m\xEDdia(s)..."));
              case 7:
                return _context2.a(2);
            }
          }, _callee2, null, [[2, 4]]);
        }));
        return function (_x10) {
          return _ref2.apply(this, arguments);
        };
      }());
      var quickTagBtn = button.cloneNode(true);
      quickTagBtn.removeAttribute('data-pinboard-injected');
      quickTagBtn.setAttribute('data-pinboard-quick-tag-injected', 'true');
      quickTagBtn.setAttribute('data-pinboard-post-url', postUrl || '');
      quickTagBtn.setAttribute('aria-label', 'Editar Tags do Bookmark');
      quickTagBtn.title = 'Adicionar/editar tags deste bookmark';
      quickTagBtn.style.marginRight = IN_POST_ACTION_BUTTON_GAP;
      applyInPostActionButtonSize(quickTagBtn);
      var quickTagSvg = quickTagBtn.querySelector('svg');
      var quickTagIconContainer = quickTagSvg ? quickTagSvg.parentElement : quickTagBtn;
      if (quickTagIconContainer) {
        quickTagIconContainer.innerHTML = '<span data-pinboard-quick-tag-icon="true" style="display:inline-flex; align-items:center; justify-content:center; width:' + IN_POST_ACTION_BUTTON_SIZE + '; height:' + IN_POST_ACTION_BUTTON_SIZE + '; color:' + GRAY_COLOR + '; transition: color 0.2s;">' + ICON_TAG.replace('width="16"', 'width="18"').replace('height="16"', 'height="18"') + '</span>';
      }
      quickTagBtn.onmouseenter = function () {
        setQuickTagButtonVisualState(quickTagBtn, postUrl, true);
      };
      quickTagBtn.onmouseleave = function () {
        setQuickTagButtonVisualState(quickTagBtn, postUrl, false);
      };
      quickTagBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var savedBookmark = getBookmarkByPostUrl(postUrl);
        if (!savedBookmark) {
          showBookmarkToast('Salve o post antes de adicionar tags', false);
          return;
        }
        showQuickTagEditor(savedBookmark, function () {
          setQuickTagButtonVisualState(quickTagBtn, postUrl, false);
        });
      });
      if (!button.parentNode) return;
      var bookmarkButton = button;
      button.parentNode.insertBefore(downloadBtn, button);
      button.parentNode.insertBefore(quickTagBtn, button);
      setQuickTagButtonVisualState(quickTagBtn, postUrl, false);
      bookmarkButton.setAttribute('data-pinboard-injected', 'true');
      applyInPostActionButtonSize(bookmarkButton);
      bookmarkButton.style.transition = 'background-color 0.2s, color 0.2s';
      var bookmarkSvg = bookmarkButton.querySelector('svg');
      var iconContainer = bookmarkSvg ? bookmarkSvg.parentElement : bookmarkButton;
      if (iconContainer) {
        iconContainer.innerHTML = BOOKMARK_ICON_SVG;
        iconContainer.style.transition = 'color 0.2s';
        iconContainer.style.color = GRAY_COLOR;
        iconContainer.style.display = 'inline-flex';
        iconContainer.style.alignItems = 'center';
        iconContainer.style.justifyContent = 'center';
        iconContainer.style.width = IN_POST_ACTION_BUTTON_SIZE;
        iconContainer.style.height = IN_POST_ACTION_BUTTON_SIZE;
        iconContainer.style.minWidth = IN_POST_ACTION_BUTTON_SIZE;
        iconContainer.style.minHeight = IN_POST_ACTION_BUTTON_SIZE;
        iconContainer.style.borderRadius = '9999px';
        iconContainer.style.backgroundColor = 'transparent';
        iconContainer.style.transform = 'translateY(0)';
      }
      setBookmarkButtonVisualState(bookmarkButton, iconContainer, postUrl, false);
      bookmarkButton.onmouseenter = function () {
        setBookmarkButtonVisualState(bookmarkButton, iconContainer, postUrl, true);
      };
      bookmarkButton.onmouseleave = function () {
        setBookmarkButtonVisualState(bookmarkButton, iconContainer, postUrl, false);
      };
      bookmarkButton.setAttribute('aria-label', 'Bookmark Interno');
      bookmarkButton.title = 'Salvar/Remover Bookmark Interno';
      bookmarkButton.addEventListener('click', /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
          var allImgElements, hasVideos, images, lightboxImg, src, primaryUrl, urlObj, vxUrl, vxResponse, data, userName, userAvatar, userCell, nameSpans, _iterator2, _step2, span, avatarImg, skipTelegram, result, settings, _t2, _t3;
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.p = _context3.n) {
              case 0:
                e.preventDefault();
                e.stopPropagation();
                if (postUrl) {
                  _context3.n = 1;
                  break;
                }
                return _context3.a(2);
              case 1:
                allImgElements = getActionMediaElements(article);
                hasVideos = false;
                images = Array.from(allImgElements).map(function (el) {
                  var src = el.tagName.toLowerCase() === 'video' ? el.poster : el.src;
                  if (el.tagName.toLowerCase() === 'video') hasVideos = true;
                  if (!src) return '';
                  if (src.includes('video_thumb') || src.includes('ext_tw_video_thumb') || src.includes('tweet_video_thumb')) hasVideos = true;
                  // Criar URL com 4096x4096 (máxima qualidade)
                  if (el.tagName.toLowerCase() === 'img') {
                    if (src.includes('name=')) {
                      return src.replace(/name=[^&]+/, 'name=4096x4096');
                    } else if (src.includes('?')) {
                      return src + '&name=4096x4096';
                    }
                  }
                  return src;
                }).filter(Boolean); // Fallback: Se não encontrou imagens no article, tentar buscar do lightbox
                if (images.length === 0) {
                  // Lightbox do Twitter geralmente tem a imagem em um layer separado
                  lightboxImg = getLightboxMediaElement();
                  if (lightboxImg) {
                    src = lightboxImg.tagName.toLowerCase() === 'video' ? lightboxImg.poster : lightboxImg.src;
                    if (lightboxImg.tagName.toLowerCase() === 'video') hasVideos = true;
                    if (src && (src.includes('video_thumb') || src.includes('ext_tw_video_thumb'))) hasVideos = true;
                    primaryUrl = src;
                    if (lightboxImg.tagName.toLowerCase() === 'img') {
                      if (src.includes('name=')) {
                        primaryUrl = src.replace(/name=[^&]+/, 'name=4096x4096');
                      } else if (src.includes('?')) {
                        primaryUrl = src + '&name=4096x4096';
                      }
                    }
                    if (primaryUrl) images.push(primaryUrl);
                  }
                }
                if (!hasVideos) {
                  _context3.n = 5;
                  break;
                }
                showBookmarkToast('Extraindo vídeo...', false);
                _context3.p = 2;
                urlObj = new URL(postUrl);
                vxUrl = "https://api.vxtwitter.com".concat(urlObj.pathname);
                _context3.n = 3;
                return new Promise(function (resolve) {
                  GM_xmlhttpRequest({
                    method: 'GET',
                    url: vxUrl,
                    onload: function onload(res) {
                      return resolve(res.responseText);
                    },
                    onerror: function onerror(err) {
                      console.error('[pinboard] Erro no GM_xmlhttpRequest (provável bloqueio de permissão):', err);
                      resolve(null);
                    }
                  });
                });
              case 3:
                vxResponse = _context3.v;
                if (vxResponse) {
                  data = JSON.parse(vxResponse);
                  if (data && data.media_extended && data.media_extended.length > 0) {
                    // Substituir completamente o array pelo que a API encontrou (que possui os links originais dos vídeos e fotos corretos do post principal)
                    images = data.media_extended.map(function (m) {
                      return m.url;
                    });
                  } else {
                    showBookmarkToast('Aviso: API não retornou a mídia', false);
                  }
                } else {
                  showBookmarkToast('Aviso: Permita o api.vxtwitter.com no Violentmonkey', true);
                  console.error('[pinboard] API vxtwitter retornou nulo. A permissão "@connect api.vxtwitter.com" foi concedida?');
                }
                _context3.n = 5;
                break;
              case 4:
                _context3.p = 4;
                _t2 = _context3.v;
                console.error('[pinboard] Erro ao buscar vídeo da API vxtwitter:', _t2);
                showBookmarkToast('Falha ao obter vídeo', false);
              case 5:
                if (!(images.length === 0 && !isBookmarked(postUrl))) {
                  _context3.n = 6;
                  break;
                }
                alert('Nenhuma imagem ou vídeo encontrado no seu post principal.');
                return _context3.a(2);
              case 6:
                // Extrair nome e avatar do usuário
                userName = '';
                userAvatar = '';
                userCell = article.querySelector('[data-testid="User-Name"]');
                if (!userCell) {
                  _context3.n = 13;
                  break;
                }
                nameSpans = userCell.querySelectorAll('span');
                _iterator2 = _createForOfIteratorHelper(nameSpans);
                _context3.p = 7;
                _iterator2.s();
              case 8:
                if ((_step2 = _iterator2.n()).done) {
                  _context3.n = 10;
                  break;
                }
                span = _step2.value;
                if (!(span.textContent && !span.textContent.startsWith('@') && span.textContent.trim())) {
                  _context3.n = 9;
                  break;
                }
                userName = span.textContent.trim();
                return _context3.a(3, 10);
              case 9:
                _context3.n = 8;
                break;
              case 10:
                _context3.n = 12;
                break;
              case 11:
                _context3.p = 11;
                _t3 = _context3.v;
                _iterator2.e(_t3);
              case 12:
                _context3.p = 12;
                _iterator2.f();
                return _context3.f(12);
              case 13:
                avatarImg = article.querySelector('img[src*="profile_images"]');
                if (avatarImg) {
                  userAvatar = avatarImg.src.replace('_normal.', '_400x400.');
                }
                skipTelegram = e.shiftKey;
                result = toggleBookmark({
                  id: Date.now(),
                  postUrl: postUrl,
                  images: images,
                  tags: [],
                  timestamp: new Date().toISOString(),
                  postDate: postDate || null,
                  userName: userName || '',
                  userAvatar: userAvatar || '',
                  skipTelegramBackup: skipTelegram
                });
                setBookmarkButtonVisualState(bookmarkButton, iconContainer, postUrl, false);
                updateQuickTagButtonsForPost(postUrl);

                // Toast centralizado estilo X
                if (result.action === 'added') {
                  if (skipTelegram) {
                    showBookmarkToast('Adicionado aos salvos (Local apenas)', true);
                  } else {
                    showBookmarkToast('Adicionado aos itens salvos', true);

                    // Backup automático no Telegram se configurado
                    settings = getSettings();
                    if (settings.telegramAutoBackup && settings.telegramToken && settings.telegramChatId && result.bookmarkId) {
                      backupBookmarkImages(result.bookmarkId);
                    }
                  }
                  showQuickTagEditor(result.bookmarkId, function () {
                    updateQuickTagButtonsForPost(postUrl);
                  });
                } else {
                  showBookmarkToast('Removido dos itens salvos');
                }
              case 14:
                return _context3.a(2);
            }
          }, _callee3, null, [[7, 11, 12, 13], [2, 4]]);
        }));
        return function (_x11) {
          return _ref3.apply(this, arguments);
        };
      }());
    });
  }
  function debounce(func, delay) {
    var timeout;
    return function () {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        return func.apply(_this, args);
      }, delay);
    };
  }
  function getGalleryTitleText() {
    var title = String(getSettings().galleryTitle || '').trim();
    if (title) return title;
    return DEFAULT_SETTINGS.galleryTitle;
  }
  function startInlineGalleryTitleEdit() {
    var titleEl = document.getElementById('pinboard-title');
    var editBtn = document.getElementById('pinboard-title-edit');
    if (!titleEl || document.getElementById('pinboard-title-input')) return;
    var originalTitle = getGalleryTitleText();
    var input = document.createElement('input');
    input.id = 'pinboard-title-input';
    input.type = 'text';
    input.value = originalTitle;
    input.setAttribute('aria-label', 'Editar título da galeria');
    input.style = 'width: min(420px, 52vw); padding: 5px 10px; border-radius: 10px; border: 1px solid #1d9bf0; background: rgba(0,0,0,0.55); color: #1d9bf0; font-size: 24px; font-weight: 700; outline: none; box-shadow: 0 0 0 3px rgba(29,155,240,0.18);';
    var isFinished = false;
    var finishEditing = function finishEditing(shouldSave) {
      if (isFinished) return;
      isFinished = true;
      var nextTitle = String(input.value || '').trim();
      if (shouldSave && nextTitle) {
        saveSetting('galleryTitle', nextTitle);
        titleEl.innerText = nextTitle;
        showToast('Título atualizado');
      } else if (shouldSave && !nextTitle) {
        titleEl.innerText = originalTitle;
        showToast('Título vazio descartado');
      } else {
        titleEl.innerText = originalTitle;
      }
      input.remove();
      titleEl.style.display = '';
      if (editBtn) editBtn.style.display = '';
    };
    input.onkeydown = function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        finishEditing(true);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        finishEditing(false);
      }
    };
    input.onblur = function () {
      finishEditing(true);
    };
    titleEl.parentNode.insertBefore(input, titleEl);
    titleEl.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';
    input.focus();
    input.select();
  }
  function resolveViewerSource(bookmark, imageIndex, renderedSource) {
    if (!bookmark) return '';
    if (renderedSource && renderedSource.indexOf('data:image/gif;base64') !== 0) return renderedSource;
    var imageData = getImageUrl(bookmark, imageIndex);
    if (imageData && imageData.url) return imageData.url;
    if (bookmark.images && bookmark.images[imageIndex]) return formatTwitterUrl(bookmark.images[imageIndex]);
    return renderedSource || '';
  }
  function resolveViewerTelegramFallback(bookmark, imageIndex, onSuccess, onFailure) {
    if (!bookmark || !bookmark.telegramUrls) {
      onFailure();
      return;
    }
    var tgRef = bookmark.telegramUrls[imageIndex];
    if (!tgRef) {
      onFailure();
      return;
    }
    if (tgRef.indexOf('https://') === 0) {
      onSuccess(tgRef);
      return;
    }
    if (tgRef.indexOf('tg:') !== 0) {
      onFailure();
      return;
    }
    getTelegramFileUrl(tgRef.slice(3)).then(function (url) {
      if (url) {
        onSuccess(url);
        return;
      }
      onFailure();
    }).catch(function () {
      onFailure();
    });
  }
  function showImageViewer(bookmark, startIndex, renderedSources) {
    if (!bookmark || !bookmark.images || bookmark.images.length === 0) return;
    var sources = renderedSources || [];
    var currentIndex = Math.max(0, Math.min(startIndex || 0, bookmark.images.length - 1));
    var zoom = 1;
    var panX = 0;
    var panY = 0;
    var isDragging = false;
    var triedLargeFallback = false;
    var triedTelegramFallback = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragOriginX = 0;
    var dragOriginY = 0;
    var dragMoved = false;
    var isViewableImageIndex = function isViewableImageIndex(index) {
      var source = bookmark.images[index] || '';
      source = String(source).toLowerCase();
      return source.indexOf('.mp4') === -1 && source.indexOf('video.twimg.com') === -1;
    };
    if (!isViewableImageIndex(currentIndex)) {
      showToast('Vídeos abrem em nova aba');
      return;
    }
    var overlay = document.createElement('div');
    overlay.id = 'pinboard-image-viewer';
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = 'position: fixed; inset: 0; z-index: 10006; background: radial-gradient(circle at 50% 20%, rgba(29,155,240,0.12), rgba(0,0,0,0.96) 44%, rgba(0,0,0,0.99)); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: ' + LOCAL_FONT_STACK + '; overflow: hidden;';
    var topBar = document.createElement('div');
    topBar.style = 'position: absolute; top: 18px; left: 20px; right: 20px; z-index: 3; display: flex; align-items: center; justify-content: space-between; gap: 12px; pointer-events: none;';
    var counter = document.createElement('div');
    counter.style = 'background: rgba(15,18,22,0.78); border: 1px solid rgba(255,255,255,0.14); color: #d7e7f7; border-radius: 9999px; padding: 8px 13px; font-size: 13px; box-shadow: 0 12px 30px rgba(0,0,0,0.35); pointer-events: auto;';
    topBar.appendChild(counter);
    var controls = document.createElement('div');
    controls.style = 'display: flex; align-items: center; gap: 8px; pointer-events: auto; background: rgba(15,18,22,0.78); border: 1px solid rgba(255,255,255,0.14); border-radius: 9999px; padding: 6px; box-shadow: 0 12px 30px rgba(0,0,0,0.35);';
    var createControlButton = function createControlButton(label, title) {
      var button = document.createElement('button');
      button.innerHTML = label;
      button.title = title;
      button.style = 'min-width: 34px; height: 34px; border: none; border-radius: 9999px; background: transparent; color: white; cursor: pointer; font-size: 16px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s;';
      button.onmouseenter = function () {
        button.style.background = 'rgba(29,155,240,0.22)';
        button.style.color = '#8bd0ff';
      };
      button.onmouseleave = function () {
        button.style.background = 'transparent';
        button.style.color = 'white';
      };
      return button;
    };
    var zoomOutBtn = createControlButton('−', 'Diminuir zoom');
    var zoomInBtn = createControlButton('+', 'Aumentar zoom');
    var zoomPercent = document.createElement('span');
    zoomPercent.style = 'min-width: 48px; height: 30px; border-radius: 9999px; background: rgba(255,255,255,0.08); color: #d7e7f7; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; letter-spacing: 0.02em;';
    var resetBtn = createControlButton('Fit', 'Ajustar à tela');
    resetBtn.style.minWidth = '44px';
    resetBtn.style.fontSize = '13px';
    var openBtn = createControlButton(ICON_EXTERNAL_LINK, 'Abrir original');
    var closeBtn = createControlButton(ICON_X, 'Fechar');
    controls.appendChild(zoomPercent);
    controls.appendChild(zoomOutBtn);
    controls.appendChild(zoomInBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(openBtn);
    controls.appendChild(closeBtn);
    topBar.appendChild(controls);
    overlay.appendChild(topBar);
    var stage = document.createElement('div');
    stage.style = 'position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: default;';
    overlay.appendChild(stage);
    var viewerFrame = document.createElement('div');
    viewerFrame.style = 'position: relative; display: inline-flex; align-items: center; justify-content: center; max-width: calc(92vw - 128px); max-height: 86vh;';
    stage.appendChild(viewerFrame);
    var image = document.createElement('img');
    image.alt = 'Imagem do bookmark';
    image.draggable = false;
    image.style = 'max-width: calc(92vw - 128px); max-height: 86vh; object-fit: contain; user-select: none; transform-origin: center center; transition: transform 0.12s ease-out; box-shadow: 0 30px 80px rgba(0,0,0,0.55); border-radius: 10px; cursor: zoom-in;';
    viewerFrame.appendChild(image);
    var styleViewerArrowButton = function styleViewerArrowButton(button, sideProperty) {
      button.style.position = 'absolute';
      button.style[sideProperty] = '-68px';
      button.style.top = '50%';
      button.style.transform = 'translateY(-50%)';
      button.style.width = '52px';
      button.style.height = '52px';
      button.style.minWidth = '52px';
      button.style.borderRadius = '9999px';
      button.style.background = 'rgba(15,18,22,0.86)';
      button.style.border = '1px solid rgba(255,255,255,0.18)';
      button.style.boxShadow = '0 16px 38px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08)';
      button.style.color = '#f5fbff';
      button.style.padding = '0';
      button.style.fontSize = '0';
      button.style.lineHeight = '1';
      button.style.display = 'inline-flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.zIndex = '2';
      var svg = button.querySelector('svg');
      if (svg) {
        svg.style.display = 'block';
        svg.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.38))';
      }
      button.onmouseenter = function () {
        button.style.background = 'rgba(29,155,240,0.28)';
        button.style.color = '#bfe7ff';
        button.style.borderColor = 'rgba(139,208,255,0.42)';
      };
      button.onmouseleave = function () {
        button.style.background = 'rgba(15,18,22,0.86)';
        button.style.color = '#f5fbff';
        button.style.borderColor = 'rgba(255,255,255,0.18)';
      };
    };
    var prevBtn = createControlButton(ICON_CHEVRON_LEFT, 'Imagem anterior');
    styleViewerArrowButton(prevBtn, 'left');
    var nextBtn = createControlButton(ICON_CHEVRON_RIGHT, 'Próxima imagem');
    styleViewerArrowButton(nextBtn, 'right');
    viewerFrame.appendChild(prevBtn);
    viewerFrame.appendChild(nextBtn);
    var updateZoomDisplay = function updateZoomDisplay() {
      zoomPercent.innerText = Math.round(zoom * 100) + '%';
    };
    var setZoom = function setZoom(nextZoom) {
      zoom = Math.max(0.5, Math.min(nextZoom, 6));
      if (zoom <= 1) {
        panX = 0;
        panY = 0;
      }
      image.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + zoom + ')';
      image.style.cursor = zoom > 1 ? 'grab' : 'zoom-in';
      updateZoomDisplay();
    };
    var resetView = function resetView() {
      zoom = 1;
      panX = 0;
      panY = 0;
      setZoom(1);
    };
    var closeViewer;
    var showImageAtIndex = function showImageAtIndex(nextIndex) {
      if (nextIndex < 0 || nextIndex >= bookmark.images.length) return;
      currentIndex = nextIndex;
      triedLargeFallback = false;
      triedTelegramFallback = false;
      resetView();
      counter.innerText = currentIndex + 1 + ' / ' + bookmark.images.length;
      prevBtn.style.display = bookmark.images.length > 1 ? 'inline-flex' : 'none';
      nextBtn.style.display = bookmark.images.length > 1 ? 'inline-flex' : 'none';
      image.style.opacity = '0.45';
      image.src = resolveViewerSource(bookmark, currentIndex, sources[currentIndex]);
    };
    var showRelativeImage = function showRelativeImage(direction) {
      if (bookmark.images.length < 2) return;
      for (var step = 1; step <= bookmark.images.length; step++) {
        var nextIndex = (currentIndex + direction * step + bookmark.images.length) % bookmark.images.length;
        if (isViewableImageIndex(nextIndex)) {
          showImageAtIndex(nextIndex);
          return;
        }
      }
    };
    var onKeyDown = function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeViewer();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showRelativeImage(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showRelativeImage(1);
        return;
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setZoom(zoom + 0.25);
        return;
      }
      if (event.key === '-') {
        event.preventDefault();
        setZoom(zoom - 0.25);
        return;
      }
      if (event.key === '0') {
        event.preventDefault();
        resetView();
      }
    };
    var onMouseMove = function onMouseMove(event) {
      if (!isDragging) return;
      if (Math.abs(event.clientX - dragStartX) > 3 || Math.abs(event.clientY - dragStartY) > 3) {
        dragMoved = true;
      }
      panX = dragOriginX + event.clientX - dragStartX;
      panY = dragOriginY + event.clientY - dragStartY;
      setZoom(zoom);
    };
    var onMouseUp = function onMouseUp() {
      if (!isDragging) return;
      isDragging = false;
      image.style.cursor = zoom > 1 ? 'grab' : 'zoom-in';
      if (dragMoved) {
        setTimeout(function () {
          dragMoved = false;
        }, 0);
      }
    };
    closeViewer = function closeViewer() {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      overlay.remove();
    };
    image.onload = function () {
      image.style.opacity = '1';
    };
    image.onerror = function () {
      if (!triedLargeFallback && image.src.indexOf('name=4096x4096') > -1) {
        triedLargeFallback = true;
        image.src = image.src.replace('name=4096x4096', 'name=large');
        return;
      }
      if (triedTelegramFallback) {
        showToast('Não foi possível carregar a imagem');
        return;
      }
      triedTelegramFallback = true;
      resolveViewerTelegramFallback(bookmark, currentIndex, function (url) {
        image.src = url;
      }, function () {
        showToast('Não foi possível carregar a imagem');
      });
    };
    stage.onwheel = function (event) {
      event.preventDefault();
      setZoom(zoom + (event.deltaY < 0 ? 0.18 : -0.18));
    };
    stage.onmousedown = function (event) {
      if (event.target !== image) return;
      if (zoom <= 1) return;
      event.preventDefault();
      isDragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragOriginX = panX;
      dragOriginY = panY;
      image.style.cursor = 'grabbing';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    image.onclick = function (event) {
      event.stopPropagation();
      if (dragMoved) {
        dragMoved = false;
        return;
      }
      if (zoom > 1) {
        resetView();
        return;
      }
      setZoom(2);
    };
    stage.ondblclick = function () {
      if (zoom > 1) {
        resetView();
        return;
      }
      setZoom(2);
    };
    overlay.onclick = function (event) {
      if (event.target === overlay || event.target === stage) closeViewer();
    };
    viewerFrame.onclick = function (event) {
      if (event.target === viewerFrame) closeViewer();
    };
    prevBtn.onclick = function (event) {
      event.stopPropagation();
      showRelativeImage(-1);
    };
    nextBtn.onclick = function (event) {
      event.stopPropagation();
      showRelativeImage(1);
    };
    zoomOutBtn.onclick = function (event) {
      event.stopPropagation();
      setZoom(zoom - 0.25);
    };
    zoomInBtn.onclick = function (event) {
      event.stopPropagation();
      setZoom(zoom + 0.25);
    };
    resetBtn.onclick = function (event) {
      event.stopPropagation();
      resetView();
    };
    openBtn.onclick = function (event) {
      event.stopPropagation();
      if (image.src) window.open(image.src, '_blank');
    };
    closeBtn.onclick = function (event) {
      event.stopPropagation();
      closeViewer();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.appendChild(overlay);
    showImageAtIndex(currentIndex);
  }
  function showMergedImageViewer(imageUrl) {
    if (!imageUrl) return;
    showImageViewer({
      images: [imageUrl],
      telegramUrls: []
    }, 0, [imageUrl]);
  }

  // ==================== GALLERY ====================
  function createGalleryModal() {
    // Focus Fix: salvar posição de scroll antes de modificar
    var scrollPos = window.scrollY;

    // Função para restaurar scroll (chamada múltiplas vezes para garantir)
    var restoreScroll = function restoreScroll() {
      window.scrollTo(0, scrollPos);
    };

    // Travar scroll da página
    document.body.style.overflow = 'hidden';
    var existing = document.getElementById('pinboard-gallery');
    if (existing) {
      existing.style.display = 'flex';
      existing.scrollTop = 0;
      currentPage = 1;
      updateGalleryContent();
      // Restaurar posição de scroll com múltiplos attempts
      restoreScroll();
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 100);
      return;
    }
    var modal = document.createElement('div');
    modal.id = 'pinboard-gallery';
    modal.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0,0,0,0.95); z-index: 9999;\n            display: flex; flex-direction: column; align-items: center;\n            padding: 20px 20px 120px 20px; overflow-y: auto; color: white;\n            font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n        ";

    // Header
    var header = document.createElement('div');
    header.id = 'pinboard-header';
    header.style = 'width: 100%; max-width: 1200px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;';
    var titleArea = document.createElement('div');
    titleArea.style = 'display: flex; align-items: center; gap: 10px;';
    var title = document.createElement('h2');
    title.id = 'pinboard-title';
    title.style = 'margin: 0; font-size: 24px; color: #1d9bf0;';
    title.innerText = getGalleryTitleText();
    titleArea.appendChild(title);
    var editTitleBtn = document.createElement('button');
    editTitleBtn.id = 'pinboard-title-edit';
    editTitleBtn.innerHTML = ICON_PENCIL_SMALL;
    editTitleBtn.title = 'Editar título da galeria';
    editTitleBtn.style = 'background: transparent; border: 1px solid transparent; color: #1d9bf0; padding: 6px; border-radius: 9999px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;';
    editTitleBtn.onclick = function (event) {
      event.stopPropagation();
      startInlineGalleryTitleEdit();
    };
    editTitleBtn.onmouseenter = function () {
      editTitleBtn.style.background = 'rgba(29,155,240,0.12)';
      editTitleBtn.style.borderColor = 'rgba(29,155,240,0.4)';
    };
    editTitleBtn.onmouseleave = function () {
      editTitleBtn.style.background = 'transparent';
      editTitleBtn.style.borderColor = 'transparent';
    };
    titleArea.appendChild(editTitleBtn);
    var counter = document.createElement('span');
    counter.id = 'pinboard-counter';
    counter.style = 'background: #1d9bf0; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold;';
    counter.innerText = getBookmarks().length;
    titleArea.appendChild(counter);
    var versionText = document.createElement('span');
    versionText.style = 'font-size: 12px; color: #555;';
    versionText.innerText = "v".concat(VERSION);
    titleArea.appendChild(versionText);
    header.appendChild(titleArea);
    var headerRight = document.createElement('div');
    headerRight.style = 'display: flex; align-items: center; gap: 10px;';
    var refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = ICON_REFRESH.replace('width="16"', 'width="24"').replace('height="16"', 'height="24"');
    refreshBtn.style = 'background: transparent; color: white; border: none; padding: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease, color 0.2s;';
    refreshBtn.title = 'Atualizar Galeria';
    refreshBtn.onclick = function () {
      var svg = refreshBtn.querySelector('svg');
      if (svg) {
        svg.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        svg.style.transform = 'rotate(360deg)';
        setTimeout(function () {
          svg.style.transition = 'none';
          svg.style.transform = 'rotate(0deg)';
        }, 500);
      }
      currentPage = 1;
      updateGalleryContent();
      showToast('Galeria atualizada!');
    };
    refreshBtn.onmouseenter = function () {
      refreshBtn.style.color = '#1d9bf0';
      var svg = refreshBtn.querySelector('svg');
      if (svg) {
        svg.style.transition = 'transform 0.2s ease-out';
        svg.style.transform = 'rotate(45deg)';
      }
    };
    refreshBtn.onmouseleave = function () {
      refreshBtn.style.color = 'white';
      var svg = refreshBtn.querySelector('svg');
      if (svg) {
        svg.style.transition = 'transform 0.2s ease-out';
        svg.style.transform = 'rotate(0deg)';
      }
    };
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = ICON_X.replace('width="16"', 'width="24"').replace('height="16"', 'height="24"');
    closeBtn.style = 'background: transparent; color: white; border: none; padding: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: color 0.2s;';
    closeBtn.title = 'Fechar';
    closeBtn.onclick = function () {
      closePinboardGallery(modal);
    };
    closeBtn.onmouseenter = function () {
      return closeBtn.style.color = '#e74c3c';
    };
    closeBtn.onmouseleave = function () {
      return closeBtn.style.color = 'white';
    };
    headerRight.appendChild(refreshBtn);
    headerRight.appendChild(closeBtn);
    header.appendChild(headerRight);
    modal.appendChild(header);

    // Toolbar (Busca + Ordenação + Tags)
    var toolbar = document.createElement('div');
    toolbar.id = 'pinboard-toolbar';
    toolbar.style = 'width: 100%; max-width: 1200px; display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #333;';

    // Busca
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar por @usuário...';
    searchInput.style = 'flex: 1; min-width: 200px; padding: 10px 15px; border-radius: 20px; border: 1px solid #333; background: #000; color: white;';
    searchInput.oninput = debounce(function () {
      currentFilter.search = searchInput.value;
      currentPage = 1;
      updateGalleryContent();
    }, 250);
    toolbar.appendChild(searchInput);

    // Ordenação
    var sortContainer = document.createElement('div');
    sortContainer.style = 'display: flex; align-items: center; gap: 8px;';
    var sortLabel = document.createElement('span');
    sortLabel.innerText = 'Ordenar por:';
    sortLabel.style = 'color: #888; font-size: 13px;';
    var sortSelect = document.createElement('select');
    sortSelect.style = 'padding: 10px 15px; border-radius: 20px; border: 1px solid #333; background: #000; color: white; cursor: pointer;';
    sortSelect.innerHTML = "\n            <option value=\"newest_added\">Adicionado (Recente)</option>\n            <option value=\"oldest_added\">Adicionado (Antigo)</option>\n            <option value=\"newest_post\">Postado (Recente)</option>\n            <option value=\"oldest_post\">Postado (Antigo)</option>\n            <option value=\"favorites_first\">Favoritos</option>\n            <option value=\"most_images\">Mais Fotos</option>\n        ";
    sortSelect.value = currentFilter.sort;
    sortSelect.onchange = function (e) {
      currentFilter.sort = e.target.value;
      currentPage = 1;
      updateGalleryContent();
    };
    sortContainer.appendChild(sortLabel);
    sortContainer.appendChild(sortSelect);
    toolbar.appendChild(sortContainer);

    // Botão gerenciar tags
    var manageTagsBtn = document.createElement('button');
    manageTagsBtn.innerHTML = "".concat(ICON_TAG, " <span>Tags</span>");
    manageTagsBtn.style = 'padding: 10px 20px; border-radius: 20px; border: 1px solid #333; background: #222; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; gap: 6px;';
    manageTagsBtn.onclick = function () {
      return createTagModal(updateGalleryContent);
    };
    toolbar.appendChild(manageTagsBtn);

    // Botão configurações
    var settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = "".concat(ICON_SETTINGS, " <span>Configura\xE7\xF5es</span>");
    settingsBtn.style = 'padding: 10px 20px; border-radius: 20px; border: 1px solid #333; background: #222; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; gap: 6px;';
    settingsBtn.onclick = function () {
      return SettingsModal(updateGalleryContent);
    };
    toolbar.appendChild(settingsBtn);

    // Botão estatísticas
    var statsBtn = document.createElement('button');
    statsBtn.id = 'pinboard-stats-button';
    statsBtn.innerHTML = "".concat(ICON_STATS, " <span>Estat\xEDsticas</span>");
    statsBtn.style = 'padding: 10px 20px; border-radius: 20px; border: 1px solid rgba(29,155,240,0.45); background: linear-gradient(135deg, rgba(29,155,240,0.18), #202734); color: #dbeafe; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 8px 20px rgba(29,155,240,0.08);';
    statsBtn.onmouseenter = function () {
      statsBtn.style.borderColor = '#1d9bf0';
      statsBtn.style.color = 'white';
    };
    statsBtn.onmouseleave = function () {
      statsBtn.style.borderColor = 'rgba(29,155,240,0.45)';
      statsBtn.style.color = '#dbeafe';
    };
    statsBtn.onclick = showStatisticsModal;
    toolbar.appendChild(statsBtn);

    // Bulk Actions Container
    var bulkContainer = document.createElement('div');
    bulkContainer.id = 'pinboard-bulk-actions';
    bulkContainer.style = 'display: none; position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); z-index: 10000; align-items: center; flex-wrap: wrap; justify-content: center; gap: 10px; width: max-content; max-width: calc(100vw - 24px); padding: 10px 12px; border-radius: 16px; border: 1px solid #2f2f2f; background: rgba(18,18,18,0.92); backdrop-filter: blur(8px); box-shadow: 0 10px 26px rgba(0,0,0,0.45);';
    var bulkInfo = document.createElement('span');
    bulkInfo.id = 'pinboard-bulk-info';
    bulkInfo.style = 'color: #888; font-size: 13px;';
    bulkInfo.innerText = '0 selecionados';

    // Botão Selecionar Tudo - azul
    var bulkSelectAllBtn = document.createElement('button');
    bulkSelectAllBtn.id = 'pinboard-select-all';
    bulkSelectAllBtn.innerHTML = "<span>Selecionar Tudo</span>";
    bulkSelectAllBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #1d9bf0; background: transparent; color: #1d9bf0; cursor: pointer; display: flex; align-items: center; gap: 6px;';
    bulkSelectAllBtn.onclick = function () {
      var bookmarks = getBookmarks();
      var filtered = bookmarks;
      if (currentFilter.tags.length > 0) {
        filtered = filtered.filter(function (bookmark) {
          var bookmarkTags = bookmark.tags || [];
          return currentFilter.tags.some(function (tag) {
            return bookmarkTags.includes(tag);
          });
        });
      }
      if (currentFilter.search) {
        var search = currentFilter.search.toLowerCase().replace('@', '');
        filtered = filtered.filter(function (b) {
          return extractHandle(b.postUrl).toLowerCase().includes(search);
        });
      }
      filtered.forEach(function (b) {
        return selectedItems.add(b.id);
      });
      updateGalleryContent();
      updateBulkUI();
      showToast("".concat(filtered.length, " item(s) selecionado(s)"));
    };

    // Botão Limpar Seleção - com ícone de vassoura
    var bulkClearBtn = document.createElement('button');
    bulkClearBtn.innerHTML = "".concat(ICON_BROOM, " <span>Limpar Sele\xE7\xE3o</span>");
    bulkClearBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #3a3a3a; background: transparent; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; gap: 6px;';
    bulkClearBtn.onclick = function () {
      selectedItems.clear();
      updateGalleryContent();
      updateBulkUI();
      showToast('Seleção limpa');
    };

    // Botão Gerenciar Tags - azul
    var bulkTagBtn = document.createElement('button');
    bulkTagBtn.innerHTML = "".concat(ICON_TAG, " <span>Gerenciar Tags</span>");
    bulkTagBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #1d9bf0; background: transparent; color: #1d9bf0; cursor: pointer; display: flex; align-items: center; gap: 6px;';
    bulkTagBtn.onclick = bulkAddTag;

    // Botão Favoritar - amarelo
    var bulkFavoriteBtn = document.createElement('button');
    bulkFavoriteBtn.id = 'pinboard-bulk-favorite';
    bulkFavoriteBtn.innerHTML = "".concat(ICON_STAR, " <span>Favoritar</span>");
    bulkFavoriteBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #f59e0b; background: transparent; color: #f59e0b; cursor: pointer; display: flex; align-items: center; gap: 6px;';
    bulkFavoriteBtn.onclick = bulkFavorite;

    // Botão Download - verde
    var bulkDownloadBtn = document.createElement('button');
    bulkDownloadBtn.innerHTML = "".concat(ICON_DOWNLOAD, " <span>Download</span>");
    bulkDownloadBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #22c55e; background: transparent; color: #22c55e; cursor: pointer; display: flex; align-items: center; gap: 6px;';
    bulkDownloadBtn.onclick = downloadSelectedItems;

    // Botão Backup - Telegram
    var bulkBackupBtn = document.createElement('button');
    bulkBackupBtn.innerHTML = "".concat(ICON_TELEGRAM, " <span>Backup</span>");
    bulkBackupBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #2196f3; background: transparent; color: #2196f3; cursor: pointer; display: flex; align-items: center; gap: 6px;';
    bulkBackupBtn.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var settings, allBookmarks, totalImages, hasDuplicates, idsArray, _iterator3, _step3, _loop2, count, modalText, choice, _iterator4, _step4, _loop, progressInfo, _iterator5, _step5, id, _t4, _t5, _t6;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            if (!(selectedItems.size === 0)) {
              _context6.n = 1;
              break;
            }
            showToast('Nenhum item selecionado');
            return _context6.a(2);
          case 1:
            settings = getSettings();
            if (!(!settings.telegramToken || !settings.telegramChatId)) {
              _context6.n = 2;
              break;
            }
            showToast('Configure o Token e Chat ID do Telegram primeiro');
            return _context6.a(2);
          case 2:
            // Calcular total de imagens para progresso e checar duplicatas
            allBookmarks = getBookmarks();
            totalImages = 0;
            hasDuplicates = false;
            idsArray = _toConsumableArray(selectedItems);
            _iterator3 = _createForOfIteratorHelper(idsArray);
            _context6.p = 3;
            _loop2 = /*#__PURE__*/_regenerator().m(function _loop2() {
              var id, bm, oldTelegramUrls, bmHasTgBackup, needsBackup;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.n) {
                  case 0:
                    id = _step3.value;
                    bm = allBookmarks.find(function (b) {
                      return b.id === id;
                    });
                    if (!(bm !== null && bm !== void 0 && bm.images)) {
                      _context5.n = 2;
                      break;
                    }
                    oldTelegramUrls = bm.telegramUrls || [];
                    bmHasTgBackup = oldTelegramUrls.some(function (u) {
                      return u && (u.startsWith('tg:') || u.startsWith('https://'));
                    });
                    if (bmHasTgBackup) hasDuplicates = true;
                    if (!(bm.mergedImageUrl && bm.mergedImageUrl.startsWith('https://'))) {
                      _context5.n = 1;
                      break;
                    }
                    return _context5.a(2, 1);
                  case 1:
                    // Contar apenas imagens sem backup
                    needsBackup = bm.images.filter(function (_, idx) {
                      var _bm$telegramUrls;
                      var tgUrl = (_bm$telegramUrls = bm.telegramUrls) === null || _bm$telegramUrls === void 0 ? void 0 : _bm$telegramUrls[idx];
                      return !(tgUrl && (tgUrl.startsWith('tg:') || tgUrl.startsWith('https://')));
                    }).length;
                    totalImages += needsBackup;
                  case 2:
                    return _context5.a(2);
                }
              }, _loop2);
            });
            _iterator3.s();
          case 4:
            if ((_step3 = _iterator3.n()).done) {
              _context6.n = 7;
              break;
            }
            return _context6.d(_regeneratorValues(_loop2()), 5);
          case 5:
            if (!_context6.v) {
              _context6.n = 6;
              break;
            }
            return _context6.a(3, 6);
          case 6:
            _context6.n = 4;
            break;
          case 7:
            _context6.n = 9;
            break;
          case 8:
            _context6.p = 8;
            _t4 = _context6.v;
            _iterator3.e(_t4);
          case 9:
            _context6.p = 9;
            _iterator3.f();
            return _context6.f(9);
          case 10:
            if (!(totalImages === 0 && !hasDuplicates)) {
              _context6.n = 11;
              break;
            }
            count = selectedItems.size;
            showToast(count === 1 ? 'Este item já tem backup!' : 'Todos os itens já têm backup!');
            return _context6.a(2);
          case 11:
            if (!hasDuplicates) {
              _context6.n = 21;
              break;
            }
            modalText = 'Arquivos com backup existente.\\n\\nRe-enviar o backup fará o re-upload de todas as fotos para pegar os IDs corretos. Esteja ciente que isso NÃO apagará as fotos no telegram por limitação de API, deixando sobras no chat.\\n\\nVocê concorda com isso?';
            _context6.n = 12;
            return showChoiceModal(modalText, [{
              label: 'Sim, Re-enviar',
              value: 'continue',
              bg: '#f4212e',
              bold: true
            }, {
              label: 'Cancelar',
              value: 'cancel',
              bg: '#333'
            }]);
          case 12:
            choice = _context6.v;
            if (!(choice !== 'continue')) {
              _context6.n = 13;
              break;
            }
            return _context6.a(2);
          case 13:
            // Se usuário forçou o re-envio, recalcularemos o totalImages baseando no total de imagens em todos os favoritos com duplicatas,
            // já que o `backupBookmarkImages(..., { forceUpload: true })` vai re-alocar tudo
            totalImages = 0;
            _iterator4 = _createForOfIteratorHelper(idsArray);
            _context6.p = 14;
            _loop = /*#__PURE__*/_regenerator().m(function _loop() {
              var id, bm;
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.n) {
                  case 0:
                    id = _step4.value;
                    bm = allBookmarks.find(function (b) {
                      return b.id === id;
                    });
                    if (!(bm !== null && bm !== void 0 && bm.images)) {
                      _context4.n = 2;
                      break;
                    }
                    if (!(bm.mergedImageUrl && bm.mergedImageUrl.startsWith('https://'))) {
                      _context4.n = 1;
                      break;
                    }
                    return _context4.a(2, 1);
                  case 1:
                    totalImages += bm.images.length;
                  case 2:
                    return _context4.a(2);
                }
              }, _loop);
            });
            _iterator4.s();
          case 15:
            if ((_step4 = _iterator4.n()).done) {
              _context6.n = 18;
              break;
            }
            return _context6.d(_regeneratorValues(_loop()), 16);
          case 16:
            if (!_context6.v) {
              _context6.n = 17;
              break;
            }
            return _context6.a(3, 17);
          case 17:
            _context6.n = 15;
            break;
          case 18:
            _context6.n = 20;
            break;
          case 19:
            _context6.p = 19;
            _t5 = _context6.v;
            _iterator4.e(_t5);
          case 20:
            _context6.p = 20;
            _iterator4.f();
            return _context6.f(20);
          case 21:
            // Objeto mutável para rastrear progresso entre bookmarks
            progressInfo = {
              current: 0,
              total: totalImages
            };
            _iterator5 = _createForOfIteratorHelper(idsArray);
            _context6.p = 22;
            _iterator5.s();
          case 23:
            if ((_step5 = _iterator5.n()).done) {
              _context6.n = 25;
              break;
            }
            id = _step5.value;
            _context6.n = 24;
            return backupBookmarkImages(id, {
              isManual: true,
              progressInfo: progressInfo,
              forceUpload: hasDuplicates
            });
          case 24:
            _context6.n = 23;
            break;
          case 25:
            _context6.n = 27;
            break;
          case 26:
            _context6.p = 26;
            _t6 = _context6.v;
            _iterator5.e(_t6);
          case 27:
            _context6.p = 27;
            _iterator5.f();
            return _context6.f(27);
          case 28:
            selectedItems.clear();
            showToast('Backup concluído!');
            updateGalleryContent();
            updateBulkUI();
          case 29:
            return _context6.a(2);
        }
      }, _callee4, null, [[22, 26, 27, 28], [14, 19, 20, 21], [3, 8, 9, 10]]);
    }));

    // Botão Excluir
    var bulkDelBtn = document.createElement('button');
    bulkDelBtn.innerHTML = "".concat(ICON_TRASH, " <span>Excluir</span>");
    bulkDelBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #f4212e; background: transparent; color: #f4212e; cursor: pointer; display: flex; align-items: center; gap: 6px;';
    bulkDelBtn.onclick = bulkDelete;
    bulkContainer.appendChild(bulkInfo);
    bulkContainer.appendChild(bulkSelectAllBtn);
    bulkContainer.appendChild(bulkClearBtn);
    bulkContainer.appendChild(bulkTagBtn);
    bulkContainer.appendChild(bulkFavoriteBtn);
    bulkContainer.appendChild(bulkDownloadBtn);
    bulkContainer.appendChild(bulkBackupBtn);
    bulkContainer.appendChild(bulkDelBtn);
    modal.appendChild(toolbar);

    // Tag filters
    var tagFilters = document.createElement('div');
    tagFilters.id = 'pinboard-tag-filters';
    tagFilters.style = 'width: 100%; max-width: 1200px; display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;';
    modal.appendChild(tagFilters);

    // Container
    var container = document.createElement('div');
    container.id = 'pinboard-container';
    container.style = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; width: 100%; max-width: 1200px; align-items: start;';
    modal.appendChild(container);

    // Bulk actions flutuante para facilitar uso durante scroll
    modal.appendChild(bulkContainer);
    modal.addEventListener('scroll', function () {
      if (modal.scrollTop + modal.clientHeight >= modal.scrollHeight - 300) {
        if (currentPage * ITEMS_PER_PAGE < filteredCount) {
          currentPage++;
          updateGalleryContent();
        }
      }
    });
    document.body.appendChild(modal);
    currentPage = 1;
    updateGalleryContent();
  }
  function updateGalleryContent() {
    var container = document.getElementById('pinboard-container');
    var tagFiltersEl = document.getElementById('pinboard-tag-filters');
    var counterEl = document.getElementById('pinboard-counter');
    var titleEl = document.getElementById('pinboard-title');
    if (!container) return;

    // Atualizar título da galeria
    if (titleEl && !document.getElementById('pinboard-title-input')) {
      titleEl.innerText = getGalleryTitleText();
    }

    // Galeria fixa em grid; o antigo modo lista foi removido da UI.
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    container.style.maxWidth = '1200px';

    // Render tag filter chips
    if (tagFiltersEl) {
      var allTags = getTags();
      tagFiltersEl.innerHTML = '';

      // Chip "Todos"
      var allChip = document.createElement('button');
      allChip.innerText = 'Todos';
      allChip.style = "\n                padding: 6px 16px; border-radius: 20px; border: none; cursor: pointer;\n                background: ".concat(currentFilter.tags.length === 0 ? '#1d9bf0' : '#222', ";\n                color: ").concat(currentFilter.tags.length === 0 ? 'white' : '#888', ";\n            ");
      allChip.onclick = function () {
        currentFilter.tags = [];
        currentPage = 1;
        updateGalleryContent();
      };
      tagFiltersEl.appendChild(allChip);
      allTags.forEach(function (tag) {
        var isActive = currentFilter.tags.includes(tag);
        var chip = document.createElement('button');
        chip.innerText = tag;
        chip.style = "\n                    padding: 6px 16px; border-radius: 20px; border: none; cursor: pointer;\n                    background: ".concat(isActive ? '#1d9bf0' : '#222', ";\n                    color: ").concat(isActive ? 'white' : '#888', ";\n                ");
        chip.onclick = function () {
          if (isActive) {
            currentFilter.tags = currentFilter.tags.filter(function (t) {
              return t !== tag;
            });
          } else {
            currentFilter.tags.push(tag);
          }
          currentPage = 1;
          updateGalleryContent();
        };
        tagFiltersEl.appendChild(chip);
      });
    }

    // Filter bookmarks
    var bookmarks = getBookmarks();

    // Filtrar por tags (bookmark deve ter pelo menos UMA das tags selecionadas - union)
    if (currentFilter.tags.length > 0) {
      bookmarks = bookmarks.filter(function (b) {
        var bTags = b.tags || [];
        return currentFilter.tags.some(function (tag) {
          return bTags.includes(tag);
        });
      });
    }
    // Filtrar por busca (handle)
    if (currentFilter.search) {
      var search = currentFilter.search.toLowerCase().replace('@', '');
      bookmarks = bookmarks.filter(function (b) {
        return extractHandle(b.postUrl).toLowerCase().includes(search);
      });
    }

    // Ordenar
    switch (currentFilter.sort) {
      case 'oldest_added':
        bookmarks.sort(function (a, b) {
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
        break;
      case 'newest_post':
        bookmarks.sort(function (a, b) {
          return new Date(b.postDate || 0) - new Date(a.postDate || 0);
        });
        break;
      case 'oldest_post':
        bookmarks.sort(function (a, b) {
          return new Date(a.postDate || 0) - new Date(b.postDate || 0);
        });
        break;
      case 'favorites_first':
        bookmarks.sort(function (a, b) {
          var favDiff = (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
          if (favDiff !== 0) return favDiff;
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        break;
      case 'most_images':
        bookmarks.sort(function (a, b) {
          var _b$images, _a$images;
          var diff = (((_b$images = b.images) === null || _b$images === void 0 ? void 0 : _b$images.length) || 0) - (((_a$images = a.images) === null || _a$images === void 0 ? void 0 : _a$images.length) || 0);
          if (diff !== 0) return diff;
          // Desempate por data de adição (mais recente primeiro)
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        break;
      case 'newest_added':
      default:
        bookmarks.sort(function (a, b) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
    }
    filteredCount = bookmarks.length;
    container.innerHTML = filteredCount === 0 ? '<p style="text-align:center; width: 100%; font-size: 18px; color: #888;">Nenhum bookmark encontrado.</p>' : '';

    // Atualizar contador
    if (counterEl) counterEl.innerText = filteredCount;
    var visibleBookmarks = bookmarks.slice(0, currentPage * ITEMS_PER_PAGE);
    visibleBookmarks.forEach(function (b) {
      var item = document.createElement('div');

      // Modo Grid (original)
      var settings = getSettings();
      var gridHeight = settings.gridPhotoHeight;
      item.style = 'background: #15181c; border-radius: 16px; overflow: hidden; position: relative; border: 1px solid #333; transition: transform 0.2s;';
      item.onmouseover = function () {
        item.style.transform = 'scale(1.02)';
        var video = item.querySelector('video');
        if (video) video.play().catch(function () {});
      };
      item.onmouseout = function () {
        item.style.transform = 'scale(1)';
        var video = item.querySelector('video');
        if (video && settings.autoplayVideos === false) video.pause();
      };
      var imgContainer = document.createElement('div');
      var hasMerged = !!b.mergedImageUrl;
      var numImgs = hasMerged ? 1 : b.images ? b.images.length : 1;
      var originalNumImgs = b.images ? b.images.length : 0;
      imgContainer.style = "display: grid; grid-template-columns: ".concat(numImgs > 1 ? '1fr 1fr' : '1fr', "; gap: 2px; background: #000; cursor: pointer; height: ").concat(gridHeight, "px; position: relative;");
      imgContainer.title = numImgs > 1 ? 'Clique para ver todas as imagens' : 'Clique para abrir imagem';
      imgContainer.onclick = function () {
        if (numImgs > 1 || hasMerged) {
          showDetails(b);
        } else {
          var currentImg = imgContainer.querySelector('img, video');
          if (currentImg && currentImg.tagName.toLowerCase() === 'video') {
            window.open(currentImg.src || getImageUrl(b, 0).url || b.images[0], '_blank');
            return;
          }
          showImageViewer(b, 0, [currentImg ? currentImg.src : '']);
        }
      };
      var displayImages = hasMerged ? [b.mergedImageUrl] : b.images ? b.images.slice(0, 4) : [];
      var backupCount = 0;
      var fallbackCount = 0;
      for (var i = 0; i < originalNumImgs; i++) {
        var _b$telegramUrls;
        var tgRef = (_b$telegramUrls = b.telegramUrls) === null || _b$telegramUrls === void 0 ? void 0 : _b$telegramUrls[i];
        if (tgRef && (tgRef.startsWith('tg:') || tgRef.startsWith('https://'))) {
          backupCount++;
        } else {
          fallbackCount++;
        }
      }
      displayImages.forEach(function (src, idx) {
        var isVideo = (src || '').toLowerCase().includes('.mp4');
        var img = document.createElement(isVideo && !hasMerged ? 'video' : 'img');
        if (isVideo && !hasMerged) {
          img.muted = true;
          img.loop = true;
          img.autoplay = settings.autoplayVideos !== false;
          img.setAttribute('playsinline', '');
        } else {
          img.loading = 'lazy';
        }
        var imgData = hasMerged ? {
          url: b.mergedImageUrl,
          hasTelegramBackup: true
        } : getImageUrl(b, idx);
        if (hasMerged && b.mergedImageUrl.startsWith('tg:')) {
          img.src = '';
          getTelegramFileUrl(b.mergedImageUrl.slice(3)).then(function (u) {
            var _b$images2;
            if (u) img.src = u;else img.src = getImageUrl(b, 0).url || ((_b$images2 = b.images) === null || _b$images2 === void 0 ? void 0 : _b$images2[0]) || '';
          }).catch(function () {
            var _b$images3;
            img.src = getImageUrl(b, 0).url || ((_b$images3 = b.images) === null || _b$images3 === void 0 ? void 0 : _b$images3[0]) || '';
          });
        } else {
          img.src = imgData.url;
        }
        var itemHeight = "".concat(gridHeight, "px");
        if (numImgs > 1) {
          itemHeight = numImgs === 2 ? "".concat(gridHeight, "px") : "".concat(Math.floor(gridHeight / 2) - 1, "px");
        }
        img.style = "width: 100%; height: ".concat(itemHeight, "; object-fit: cover; display: block; pointer-events: none;");
        // Fallback chain: 4096x4096 → large → Telegram
        img.onerror = function () {
          var _b$telegramUrls2;
          img.dataset.failedAttempts = img.dataset.failedAttempts || '';
          if (img.dataset.failedAttempts.includes(img.src)) {
            img.onerror = null;
            return;
          }
          img.dataset.failedAttempts += img.src + '|';
          if (hasMerged) {
            var _b$images4;
            var fallbackThumb = getImageUrl(b, 0).url || ((_b$images4 = b.images) === null || _b$images4 === void 0 ? void 0 : _b$images4[0]);
            if (fallbackThumb && img.src !== fallbackThumb) {
              img.src = fallbackThumb;
              item.style.border = '1px solid #f59e0b';
              return;
            }
          }
          var telegramUrl = (_b$telegramUrls2 = b.telegramUrls) === null || _b$telegramUrls2 === void 0 ? void 0 : _b$telegramUrls2[idx];
          var failedUrl = img.src;
          var debugMode = getSettings().debugMode;

          // Se estava usando 4096x4096 e falhou, tentar large
          if (img.src.includes('name=4096x4096')) {
            if (debugMode) {
              console.log('[pinboard] Grid: 4k failed, trying large | URL:', failedUrl);
            } else {
              console.log('[pinboard] Grid: 4k failed, trying large');
            }
            img.src = img.src.replace('name=4096x4096', 'name=large');
            return;
          }

          // Se large falhou: resolver Telegram backup async
          if (telegramUrl && !img.dataset.telegramFallbackShown) {
            img.dataset.telegramFallbackShown = '1';
            img.onerror = null;
            var showWarningBadge = function showWarningBadge() {
              if (!imgContainer.querySelector('.fallback-badge')) {
                var fallbackBadge = document.createElement('div');
                fallbackBadge.className = 'fallback-badge main-badge';
                fallbackBadge.innerHTML = '⚠️';
                fallbackBadge.title = 'Twitter indisponível (usando backup)';
                var badgeCount = imgContainer.querySelectorAll('.main-badge, .merge-badge, .video-badge, .favorite-badge').length;
                var rightOffset = 10 + badgeCount * 30;
                fallbackBadge.style = "position: absolute; top: 10px; right: ".concat(rightOffset, "px; background: rgba(245,158,11,0.95); color: white; padding: 4px 6px; border-radius: 6px; font-size: 12px; z-index: 7;");
                imgContainer.appendChild(fallbackBadge);
              }
            };
            var handleFailedBackup = function handleFailedBackup() {
              img.src = '';
              item.style.border = '1px solid #f59e0b';
              showWarningBadge();
            };
            if (telegramUrl.startsWith('tg:')) {
              var fileId = telegramUrl.slice(3);
              getTelegramFileUrl(fileId).then(function (url) {
                if (url) {
                  img.src = url;
                  showWarningBadge(); // Mostra warning que fallback visual engatilhou
                } else {
                  handleFailedBackup();
                }
              }).catch(function () {
                return handleFailedBackup();
              });
            } else if (telegramUrl.startsWith('https://')) {
              img.src = telegramUrl;
              showWarningBadge();
            } else {
              handleFailedBackup();
            }
          }
        };
        imgContainer.appendChild(img);
      });

      // Indicador de status do backup
      if (!settings.hideOverlays) {
        var nextTopRightBadgeOffset = function nextTopRightBadgeOffset() {
          var badgeCount = imgContainer.querySelectorAll('.main-badge, .merge-badge, .video-badge, .favorite-badge').length;
          return 10 + badgeCount * 30;
        };
        var backupBadge = document.createElement('div');
        backupBadge.className = 'main-badge';
        if (hasMerged) {
          // Mescla salva conta como backup principal
          backupBadge.innerHTML = ICON_TELEGRAM_BADGE;
          backupBadge.title = 'Mescla salva no Telegram';
          var rightOffset = nextTopRightBadgeOffset();
          backupBadge.style = "position: absolute; top: 10px; right: ".concat(rightOffset, "px; background: #2196f3; color: white; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 6; cursor: help;");
          imgContainer.appendChild(backupBadge);
        } else if (backupCount > 0 && fallbackCount === 0) {
          // Todo backup OK (Telegram)
          backupBadge.innerHTML = ICON_TELEGRAM_BADGE;
          backupBadge.title = 'Imagens salvas no Telegram';
          var _rightOffset = nextTopRightBadgeOffset();
          backupBadge.style = "position: absolute; top: 10px; right: ".concat(_rightOffset, "px; background: #2196f3; color: white; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 6; cursor: help;");
          imgContainer.appendChild(backupBadge);
        } else if (fallbackCount > 0 && backupCount > 0) {
          // Mix de backup e fallback
          backupBadge.innerHTML = "".concat(ICON_CLOUD_OFF, " <span style=\"margin-left: 4px;\">").concat(backupCount, "/").concat(originalNumImgs, "</span>");
          backupBadge.title = "".concat(backupCount, " de ").concat(originalNumImgs, " imagens no Telegram");
          var _rightOffset2 = nextTopRightBadgeOffset();
          backupBadge.style = "position: absolute; top: 10px; right: ".concat(_rightOffset2, "px; background: rgba(245,158,11,0.95); color: white; padding: 6px 8px; border-radius: 8px; font-size: 10px; display: flex; align-items: center; z-index: 6; cursor: help;");
          imgContainer.appendChild(backupBadge);
        } else if (fallbackCount > 0) {
          // Sem backup (Twitter)
          backupBadge.innerHTML = ICON_TWITTER;
          backupBadge.title = 'Usando imagens do Twitter (sem backup)';
          var _rightOffset3 = nextTopRightBadgeOffset();
          backupBadge.style = "position: absolute; top: 10px; right: ".concat(_rightOffset3, "px; background: rgba(113,118,123,0.95); color: white; padding: 6px; border-radius: 8px; font-size: 10px; display: flex; align-items: center; justify-content: center; z-index: 6; cursor: help;");
          imgContainer.appendChild(backupBadge);
        }
        if (hasMerged) {
          var mergeBadge = document.createElement('div');
          mergeBadge.className = 'merge-badge';
          mergeBadge.innerHTML = ICON_MERGE;
          mergeBadge.title = 'Imagem mesclada salva';
          mergeBadge.style = 'position: absolute; top: 10px; right: 10px; background: rgba(245,158,11,0.95); color: white; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 7; cursor: help;';
          mergeBadge.style.right = "".concat(nextTopRightBadgeOffset(), "px");
          imgContainer.appendChild(mergeBadge);
        }
        if (b.images && b.images.some(function (u) {
          return (u || '').toLowerCase().includes('.mp4');
        })) {
          var videoBadge = document.createElement('div');
          videoBadge.className = 'video-badge';
          videoBadge.innerHTML = ICON_VIDEO;
          videoBadge.title = 'Contém vídeo';
          videoBadge.style = 'position: absolute; top: 10px; right: 10px; background: rgba(239,68,68,0.95); color: white; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 7; cursor: help;';
          videoBadge.style.right = "".concat(nextTopRightBadgeOffset(), "px");
          imgContainer.appendChild(videoBadge);
        }
        if (b.isFavorite) {
          var favoriteBadge = document.createElement('div');
          favoriteBadge.className = 'favorite-badge';
          favoriteBadge.innerHTML = ICON_STAR;
          favoriteBadge.title = 'Favorito';
          favoriteBadge.style = 'position: absolute; top: 10px; right: 10px; background: rgba(245,158,11,0.95); color: #fff4bf; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 8; cursor: help;';
          favoriteBadge.style.right = "".concat(nextTopRightBadgeOffset(), "px");
          var starSvg = favoriteBadge.querySelector('svg');
          if (starSvg) {
            starSvg.setAttribute('width', '14');
            starSvg.setAttribute('height', '14');
          }
          imgContainer.appendChild(favoriteBadge);
        }
      }

      // Tags do bookmark - posicionadas na parte inferior do imgContainer
      if (!settings.hideOverlays && b.tags && b.tags.length > 0) {
        var tagBadges = document.createElement('div');
        tagBadges.style = 'position: absolute; bottom: 10px; left: 10px; display: flex; flex-wrap: wrap; gap: 5px; max-width: calc(100% - 20px); z-index: 5;';
        b.tags.forEach(function (tag) {
          var badge = document.createElement('span');
          badge.innerText = tag;
          badge.style = 'background: rgba(29,155,240,0.7); color: white; padding: 3px 8px; border-radius: 10px; font-size: 11px; text-align: center; display: inline-flex; align-items: center; justify-content: center;';
          tagBadges.appendChild(badge);
        });
        imgContainer.appendChild(tagBadges);
      }

      // User info bar (Nome + @ com avatar) - posicionado no topo da imagem
      if (!settings.hideOverlays && settings.showUserLabel) {
        var userBar = document.createElement('div');
        userBar.style = 'position: absolute; top: 10px; left: 10px; display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 20px; max-width: calc(100% - 110px); z-index: 5;';
        if (b.userAvatar) {
          var avatar = document.createElement('img');
          avatar.src = b.userAvatar;
          avatar.style = 'width: 24px; height: 24px; border-radius: 50%; object-fit: cover;';
          userBar.appendChild(avatar);
        }
        var userText = document.createElement('span');
        var displayName = b.userName || '';
        var handle = extractHandle(b.postUrl);
        userText.innerText = displayName ? "".concat(displayName, " (@").concat(handle, ")") : "@".concat(handle);
        userText.style = 'color: white; font-size: 12px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
        userBar.appendChild(userText);
        imgContainer.appendChild(userBar);
      }
      var actions = document.createElement('div');
      actions.style = 'padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; background: #15181c; gap: 8px;';
      var infoCol = document.createElement('div');
      infoCol.style = 'display: flex; flex-direction: column; gap: 2px; overflow: hidden; flex: 1;';
      var postDateInfo = document.createElement('span');
      postDateInfo.innerHTML = "".concat(ICON_CALENDAR, " Postado: ").concat(formatDate(b.postDate));
      postDateInfo.style = 'color: #666; font-size: 10px; display: flex; align-items: center; gap: 4px;';
      var addDateInfo = document.createElement('span');
      addDateInfo.innerHTML = "".concat(ICON_DOWNLOAD, " Adicionado: ").concat(formatDate(b.timestamp));
      addDateInfo.style = 'color: #666; font-size: 10px; display: flex; align-items: center; gap: 4px;';
      infoCol.appendChild(postDateInfo);
      infoCol.appendChild(addDateInfo);

      // Checkbox de seleção
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = selectedItems.has(b.id);
      checkbox.style = 'width: 18px; height: 18px; cursor: pointer; accent-color: #1d9bf0;';
      checkbox.onclick = function (e) {
        e.stopPropagation();
        if (checkbox.checked) {
          selectedItems.add(b.id);
        } else {
          selectedItems.delete(b.id);
        }
        updateBulkUI();
      };

      // Botão Ver Post
      var ICON_LINK_SMALL = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 3h6v6\"/><path d=\"M10 14 21 3\"/><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/></svg>";
      var viewPostBtn = document.createElement('button');
      viewPostBtn.innerHTML = ICON_LINK_SMALL;
      viewPostBtn.title = 'Abrir post original';
      viewPostBtn.style = 'background: transparent; border: 1px solid #333; color: #888; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;';
      viewPostBtn.onmouseenter = function () {
        viewPostBtn.style.borderColor = '#1d9bf0';
        viewPostBtn.style.color = '#1d9bf0';
      };
      viewPostBtn.onmouseleave = function () {
        viewPostBtn.style.borderColor = '#333';
        viewPostBtn.style.color = '#888';
      };
      viewPostBtn.onclick = function (e) {
        e.stopPropagation();
        window.open(b.postUrl, '_blank');
      };

      // Botão Editar Links
      var editLinksBtn = document.createElement('button');
      editLinksBtn.innerHTML = ICON_PENCIL_SMALL;
      editLinksBtn.title = 'Editar links das imagens';
      editLinksBtn.style = 'background: transparent; border: 1px solid #333; color: #888; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;';
      editLinksBtn.onmouseenter = function () {
        editLinksBtn.style.borderColor = '#f97316';
        editLinksBtn.style.color = '#f97316';
      };
      editLinksBtn.onmouseleave = function () {
        editLinksBtn.style.borderColor = '#333';
        editLinksBtn.style.color = '#888';
      };
      editLinksBtn.onclick = function (e) {
        e.stopPropagation();
        showEditLinksModal(b, function () {
          updateGalleryContent();
        });
      };

      // Botão Testar Backup (Injeta a imagem [0] manualmente via uploadToTelegram)
      var ICON_TEST_BACKUP = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"17 8 12 3 7 8\"/><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\"/></svg>";
      var testBackupBtn = document.createElement('button');
      testBackupBtn.innerHTML = ICON_TEST_BACKUP;
      testBackupBtn.title = 'Testar envio (Envia formato Mescla ou Todas Imagens)';
      testBackupBtn.style = 'background: transparent; border: 1px solid #333; color: #10b981; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;';
      testBackupBtn.onmouseenter = function () {
        testBackupBtn.style.borderColor = '#10b981';
        testBackupBtn.style.background = 'rgba(16,185,129,0.1)';
      };
      testBackupBtn.onmouseleave = function () {
        testBackupBtn.style.borderColor = '#333';
        testBackupBtn.style.background = 'transparent';
      };
      testBackupBtn.onclick = /*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(e) {
          var _t7;
          return _regenerator().w(function (_context7) {
            while (1) switch (_context7.p = _context7.n) {
              case 0:
                e.stopPropagation();
                if (!(!b.images || b.images.length === 0)) {
                  _context7.n = 1;
                  break;
                }
                return _context7.a(2);
              case 1:
                testBackupBtn.style.opacity = '0.5';
                testBackupBtn.disabled = true;
                _context7.p = 2;
                _context7.n = 3;
                return backupBookmarkImages(b.id, {
                  isManual: true,
                  forceUpload: true
                });
              case 3:
                showToast('Testes disparados e roteados!');
                _context7.n = 5;
                break;
              case 4:
                _context7.p = 4;
                _t7 = _context7.v;
                console.error('[pinboard] Erro no teste manual:', _t7);
                showToast('Erro no envio de teste', true);
              case 5:
                _context7.p = 5;
                testBackupBtn.style.opacity = '1';
                testBackupBtn.disabled = false;
                return _context7.f(5);
              case 6:
                return _context7.a(2);
            }
          }, _callee5, null, [[2, 4, 5, 6]]);
        }));
        return function (_x12) {
          return _ref5.apply(this, arguments);
        };
      }();
      actions.appendChild(checkbox);
      actions.appendChild(infoCol);
      if (settings.debugMode) {
        actions.appendChild(testBackupBtn);
      }
      if (b.images && b.images.length > 1) {
        actions.appendChild(editLinksBtn);
      }
      actions.appendChild(viewPostBtn);
      item.appendChild(imgContainer);
      item.appendChild(actions);
      container.appendChild(item);
    });
  }

  // ==================== BULK ACTIONS ====================
  function updateBulkUI() {
    var bulkContainer = document.getElementById('pinboard-bulk-actions');
    var bulkInfo = document.getElementById('pinboard-bulk-info');
    var bulkFavoriteBtn = document.getElementById('pinboard-bulk-favorite');
    if (bulkContainer && bulkInfo) {
      var count = selectedItems.size;
      if (count > 0) {
        bulkContainer.style.display = 'flex';
        bulkInfo.innerText = count === 1 ? '1 item selecionado' : "".concat(count, " itens selecionados");
        if (bulkFavoriteBtn) {
          var bookmarks = getBookmarks();
          var selectedBookmarks = bookmarks.filter(function (b) {
            return selectedItems.has(b.id);
          });
          var allFavorited = selectedBookmarks.length > 0 && selectedBookmarks.every(function (b) {
            return !!b.isFavorite;
          });
          if (allFavorited) {
            bulkFavoriteBtn.innerHTML = "".concat(ICON_STAR, " <span>Desfavoritar</span>");
            bulkFavoriteBtn.style.borderColor = '#f59e0b';
            bulkFavoriteBtn.style.color = '#f59e0b';
          } else {
            bulkFavoriteBtn.innerHTML = "".concat(ICON_STAR, " <span>Favoritar</span>");
            bulkFavoriteBtn.style.borderColor = '#f59e0b';
            bulkFavoriteBtn.style.color = '#f59e0b';
          }
        }
      } else {
        bulkContainer.style.display = 'none';
        if (bulkFavoriteBtn) {
          bulkFavoriteBtn.innerHTML = "".concat(ICON_STAR, " <span>Favoritar</span>");
        }
      }
    }
  }
  function bulkDelete() {
    if (selectedItems.size === 0) return;
    var count = selectedItems.size;
    showConfirmModal("Deseja excluir ".concat(count, " bookmark(s)?"), function () {
      var bookmarks = getBookmarks().filter(function (b) {
        return !selectedItems.has(b.id);
      });
      saveBookmarks(bookmarks);
      selectedItems.clear();
      updateGalleryContent();
      updateBulkUI();
      showToast("".concat(count, " bookmark(s) exclu\xEDdo(s)"));
    });
  }
  function bulkFavorite() {
    if (selectedItems.size === 0) return;
    var bookmarks = getBookmarks();
    var selectedBookmarks = bookmarks.filter(function (b) {
      return selectedItems.has(b.id);
    });
    var allFavorited = selectedBookmarks.length > 0 && selectedBookmarks.every(function (b) {
      return !!b.isFavorite;
    });
    var changed = 0;
    bookmarks.forEach(function (bookmark) {
      if (!selectedItems.has(bookmark.id)) return;
      if (allFavorited) {
        if (bookmark.isFavorite) {
          bookmark.isFavorite = false;
          changed++;
        }
      } else if (!bookmark.isFavorite) {
        bookmark.isFavorite = true;
        changed++;
      }
    });
    if (changed === 0) {
      selectedItems.clear();
      updateGalleryContent();
      updateBulkUI();
      showToast(allFavorited ? 'Itens já estavam desfavoritados' : 'Itens já estavam favoritados');
      return;
    }
    saveBookmarks(bookmarks);
    selectedItems.clear();
    updateGalleryContent();
    updateBulkUI();
    if (allFavorited) {
      showToast(changed === 1 ? '1 item desfavoritado' : "".concat(changed, " itens desfavoritados"));
    } else {
      showToast(changed === 1 ? '1 item favoritado' : "".concat(changed, " itens favoritados"));
    }
  }
  function bulkAddTag() {
    if (selectedItems.size === 0) return;
    var tags = getTags();
    if (tags.length === 0) {
      alert('Nenhuma tag disponível. Crie uma primeiro!');
      return;
    }

    // Encontrar tags comuns a TODOS os itens selecionados
    var bookmarks = getBookmarks();
    var selectedBookmarks = bookmarks.filter(function (b) {
      return selectedItems.has(b.id);
    });
    var commonTags = new Set();
    tags.forEach(function (tag) {
      if (selectedBookmarks.every(function (b) {
        return (b.tags || []).includes(tag);
      })) {
        commonTags.add(tag);
      }
    });
    var overlay = document.createElement('div');
    overlay.setAttribute('data-pinboard-overlay', 'true');
    overlay.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0,0,0,0.8); z-index: 10001;\n            display: flex; justify-content: center; align-items: center;\n        ";
    var modal = document.createElement('div');
    modal.style = "\n            background: #15181c; padding: 25px; border-radius: 16px;\n            width: 400px; max-width: 90%; color: white; border: 1px solid #333;\n        ";
    var title = document.createElement('h3');
    title.innerText = "Gerenciar Tags (".concat(selectedItems.size, " item(s))");
    title.style = 'margin: 0 0 10px 0; color: #1d9bf0;';
    modal.appendChild(title);
    var hint = document.createElement('p');
    hint.innerText = 'Clique para adicionar/remover tag de todos os selecionados';
    hint.style = 'margin: 0 0 20px 0; color: #888; font-size: 12px;';
    modal.appendChild(hint);
    var tagContainer = document.createElement('div');
    tagContainer.style = 'display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;';
    var selectedTags = new Set(commonTags);
    tags.forEach(function (tag) {
      var chip = document.createElement('button');
      chip.innerText = tag;
      var isSelected = selectedTags.has(tag);
      chip.style = "\n                padding: 8px 16px; border-radius: 20px; border: 1px solid #333;\n                cursor: pointer; transition: all 0.2s;\n                background: ".concat(isSelected ? '#1d9bf0' : '#222', ";\n                color: ").concat(isSelected ? 'white' : '#888', ";\n            ");
      chip.onclick = function () {
        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
          chip.style.background = '#222';
          chip.style.color = '#888';
        } else {
          selectedTags.add(tag);
          chip.style.background = '#1d9bf0';
          chip.style.color = 'white';
        }
      };
      tagContainer.appendChild(chip);
    });
    modal.appendChild(tagContainer);
    var btnRow = document.createElement('div');
    btnRow.style = 'display: flex; gap: 10px;';
    var applyBtn = document.createElement('button');
    applyBtn.innerText = 'Aplicar';
    applyBtn.style = 'flex: 1; background: #1d9bf0; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center;';
    applyBtn.onclick = function () {
      var count = selectedItems.size;
      var bks = getBookmarks();
      var added = 0,
        removed = 0;
      bks.forEach(function (b) {
        if (selectedItems.has(b.id)) {
          if (!b.tags) b.tags = [];

          // Adicionar novas tags
          selectedTags.forEach(function (tag) {
            if (!b.tags.includes(tag)) {
              b.tags.push(tag);
              added++;
            }
          });

          // Remover tags desmarcadas (que estavam em commonTags)
          commonTags.forEach(function (tag) {
            if (!selectedTags.has(tag) && b.tags.includes(tag)) {
              b.tags = b.tags.filter(function (t) {
                return t !== tag;
              });
              removed++;
            }
          });
        }
      });
      saveBookmarks(bks);
      selectedItems.clear();
      overlay.remove();
      updateGalleryContent();
      updateBulkUI();
      var msg = 'Tags atualizadas';
      if (added > 0 && removed > 0) msg = "".concat(added, " tag(s) adicionada(s), ").concat(removed, " removida(s)");else if (added > 0) msg = "".concat(added, " tag(s) adicionada(s)");else if (removed > 0) msg = "".concat(removed, " tag(s) removida(s)");
      showToast(msg);
    };
    var cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancelar';
    cancelBtn.style = 'flex: 1; background: #333; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center;';
    cancelBtn.onclick = function () {
      return overlay.remove();
    };
    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(applyBtn);
    modal.appendChild(btnRow);
    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) overlay.remove();
    };
    document.body.appendChild(overlay);
  }
  function showDetails(bookmark) {
    var _bookmark$images;
    var detailModal = document.createElement('div');
    detailModal.setAttribute('data-pinboard-overlay', 'true');
    detailModal.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0,0,0,0.98); z-index: 10000;\n            display: flex; flex-direction: column; align-items: center;\n            padding: 40px; overflow-y: auto; color: white;\n            font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n        ";
    var mergedPreviewObjectUrl = null;
    var showingMerged = false;
    var cleanupMergedPreview = function cleanupMergedPreview() {
      if (mergedPreviewObjectUrl) {
        URL.revokeObjectURL(mergedPreviewObjectUrl);
        mergedPreviewObjectUrl = null;
      }
    };
    var header = document.createElement('div');
    header.style = 'width: 100%; max-width: 1200px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;';
    var titleEl = document.createElement('h3');
    titleEl.innerText = 'Imagens do Post';
    titleEl.style = 'margin: 0; font-size: 20px; color: #1d9bf0;';
    header.appendChild(titleEl);
    var btnContainer = document.createElement('div');
    btnContainer.style = 'display: flex; gap: 10px;';

    // Botão Editar Links
    var editLinksBtn = document.createElement('button');
    editLinksBtn.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z\"/></svg> <span>Editar Links</span>";
    editLinksBtn.style = 'background: transparent; color: #1d9bf0; border: 1px solid #1d9bf0; padding: 10px 20px; cursor: pointer; border-radius: 9999px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s;';
    editLinksBtn.onmouseenter = function () {
      editLinksBtn.style.background = 'rgba(29,155,240,0.1)';
    };
    editLinksBtn.onmouseleave = function () {
      editLinksBtn.style.background = 'transparent';
    };
    editLinksBtn.onclick = function () {
      return showEditLinksModal(bookmark, function () {
        cleanupMergedPreview();
        detailModal.remove();
        // Reabrir com dados atualizados
        var updatedBookmarks = getBookmarks();
        var updatedBookmark = updatedBookmarks.find(function (b) {
          return b.id === bookmark.id;
        });
        if (updatedBookmark) showDetails(updatedBookmark);
        updateGalleryContent();
      });
    };
    btnContainer.appendChild(editLinksBtn);
    var imgList = document.createElement('div');
    imgList.style = 'display: flex; flex-wrap: wrap; gap: 20px; width: 100%; max-width: 1200px; padding-bottom: 50px; justify-content: center;';
    var renderOriginalImages = function renderOriginalImages() {
      imgList.innerHTML = '';
      var renderedSources = [];
      bookmark.images.forEach(function (src, idx) {
        var item = document.createElement('div');
        item.style = 'background: #15181c; border-radius: 16px; overflow: hidden; border: 1px solid #333; width: 280px;';
        var isVideo = (src || '').toLowerCase().includes('.mp4');
        var img = document.createElement(isVideo ? 'video' : 'img');
        if (isVideo) {
          img.controls = true;
        }
        // Usar formatTwitterUrl para garantir 4k
        img.src = formatTwitterUrl(src);
        img.style = 'width: 100%; height: 280px; object-fit: cover; cursor: pointer; display: block;';

        // Chain fallback: 4k → large → Telegram
        img.onerror = function () {
          var _bookmark$telegramUrl2;
          img.dataset.failedAttempts = img.dataset.failedAttempts || '';
          if (img.dataset.failedAttempts.includes(img.src)) {
            img.onerror = null;
            return;
          }
          img.dataset.failedAttempts += img.src + '|';
          var failedUrl = img.src;
          var debugMode = getSettings().debugMode;
          if (img.src.includes('name=4096x4096')) {
            // Tentar large
            if (debugMode) {
              console.log('[pinboard] Details: 4k failed, trying large | URL:', failedUrl);
            } else {
              console.log('[pinboard] Details: 4k failed, trying large');
            }
            img.src = img.src.replace('name=4096x4096', 'name=large');
            renderedSources[idx] = img.src;
          } else if ((_bookmark$telegramUrl2 = bookmark.telegramUrls) !== null && _bookmark$telegramUrl2 !== void 0 && _bookmark$telegramUrl2[idx] && !img.dataset.telegramFallbackShown) {
            var tgRef = bookmark.telegramUrls[idx];
            img.dataset.telegramFallbackShown = '1';
            img.onerror = null;
            var handleFailedBackup = function handleFailedBackup() {
              img.src = '';
              img.style.outline = '2px solid #ef4444';
              img.title = '❌ Falha total (Twitter off, Telegram backup indisponível)';
            };
            var handleSuccessBackup = function handleSuccessBackup(url) {
              img.src = url;
              renderedSources[idx] = url;
              img.style.outline = '2px solid #f59e0b';
              img.title = '⚠️ Twitter indisponível (Exibindo backup comprimido)';
            };
            if (tgRef.startsWith('tg:')) {
              getTelegramFileUrl(tgRef.slice(3)).then(function (url) {
                if (url) handleSuccessBackup(url);else handleFailedBackup();
              }).catch(function () {
                return handleFailedBackup();
              });
            } else if (tgRef.startsWith('https://')) {
              handleSuccessBackup(tgRef);
            } else {
              handleFailedBackup();
            }
          }
        };
        img.onclick = function () {
          if (img.tagName.toLowerCase() === 'video') {
            window.open(formatTwitterUrl(src), '_blank');
            return;
          }
          renderedSources[idx] = img.src;
          showImageViewer(bookmark, idx, renderedSources);
        };
        renderedSources[idx] = img.src;
        item.appendChild(img);
        imgList.appendChild(item);
      });
    };
    var renderMergedPreview = function renderMergedPreview(url) {
      var mergeInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      imgList.innerHTML = '';
      var item = document.createElement('div');
      item.style = 'background: #15181c; border-radius: 16px; overflow: hidden; border: 1px solid #333; width: min(100%, 1200px);';
      var meta = document.createElement('div');
      meta.style = 'padding: 12px 16px; color: #f59e0b; font-size: 12px; border-bottom: 1px solid #2a2a2a;';
      if (mergeInfo && mergeInfo.width && mergeInfo.height) {
        meta.innerText = "".concat(bookmark.images.length, " imagens mescladas \u2022 ").concat(mergeInfo.width, "x").concat(mergeInfo.height);
      } else {
        meta.innerText = "".concat(bookmark.images.length, " imagens mescladas \u2022 vers\xE3o salva");
      }
      var img = document.createElement('img');
      img.style = 'width: 100%; height: auto; display: block; cursor: pointer;';
      if (url && url.startsWith('tg:')) {
        getTelegramFileUrl(url.slice(3)).then(function (resolvedUrl) {
          if (resolvedUrl) {
            img.src = resolvedUrl;
            img.onclick = function () {
              showMergedImageViewer(resolvedUrl);
            };
          }
        });
      } else {
        img.src = url;
        img.onclick = function () {
          showMergedImageViewer(img.src || url);
        };
      }
      item.appendChild(meta);
      item.appendChild(img);
      imgList.appendChild(item);
    };
    if ((((_bookmark$images = bookmark.images) === null || _bookmark$images === void 0 ? void 0 : _bookmark$images.length) || 0) > 1) {
      var mergeBtn = document.createElement('button');
      var getMergeIdleLabel = function getMergeIdleLabel() {
        return bookmark.mergedImageUrl ? "".concat(ICON_MERGE, " <span>Ver Mesclada Salva</span>") : "".concat(ICON_MERGE, " <span>Mesclar Imagens</span>");
      };
      mergeBtn.innerHTML = getMergeIdleLabel();
      mergeBtn.style = 'background: transparent; color: #f59e0b; border: 1px solid #f59e0b; padding: 10px 20px; cursor: pointer; border-radius: 9999px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s;';
      mergeBtn.onmouseenter = function () {
        mergeBtn.style.background = 'rgba(245,158,11,0.12)';
      };
      mergeBtn.onmouseleave = function () {
        mergeBtn.style.background = 'transparent';
      };
      var unmergeBtn = document.createElement('button');
      unmergeBtn.innerHTML = '🗑️ <span>Desfazer Mescla</span>';
      unmergeBtn.title = 'Desfazer mescla e restaurar imagens múltiplas';
      unmergeBtn.style = 'background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 10px 20px; cursor: pointer; border-radius: 9999px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s;';
      unmergeBtn.style.display = bookmark.mergedImageUrl ? 'flex' : 'none';
      unmergeBtn.onmouseenter = function () {
        unmergeBtn.style.background = 'rgba(239,68,68,0.1)';
      };
      unmergeBtn.onmouseleave = function () {
        unmergeBtn.style.background = 'transparent';
      };
      unmergeBtn.onclick = function () {
        if (confirm('Tem certeza que deseja apagar a mescla? Voltará a exibir as imagens múltiplas separadas.')) {
          var bookmarks = getBookmarks();
          var idx = bookmarks.findIndex(function (b) {
            return b.id === bookmark.id;
          });
          if (idx !== -1) {
            bookmarks[idx].mergedImageUrl = null;
            saveBookmarks(bookmarks);
            bookmark.mergedImageUrl = null;
            cleanupMergedPreview();
            showingMerged = false;
            titleEl.innerText = 'Imagens do Post';
            updateGalleryContent();
            var updatedBookmark = getBookmarks().find(function (b) {
              return b.id === bookmark.id;
            });
            if (updatedBookmark) {
              detailModal.remove();
              showDetails(updatedBookmark);
            }
          }
        }
      };
      mergeBtn.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        var mergeInfo, savedMergedUrl, previewUrl, _t8;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              if (!showingMerged) {
                _context8.n = 1;
                break;
              }
              showingMerged = false;
              titleEl.innerText = 'Imagens do Post';
              mergeBtn.innerHTML = getMergeIdleLabel();
              unmergeBtn.style.display = 'none';
              renderOriginalImages();
              return _context8.a(2);
            case 1:
              if (!bookmark.mergedImageUrl) {
                _context8.n = 2;
                break;
              }
              showingMerged = true;
              titleEl.innerText = 'Imagem Mesclada Salva';
              renderMergedPreview(bookmark.mergedImageUrl, null);
              mergeBtn.innerHTML = "".concat(ICON_GRID, " <span>Ver Originais</span>");
              unmergeBtn.style.display = 'flex';
              return _context8.a(2);
            case 2:
              mergeBtn.disabled = true;
              mergeBtn.style.opacity = '0.65';
              mergeBtn.innerHTML = "".concat(ICON_MERGE, " <span>Mesclando...</span>");
              _context8.p = 3;
              _context8.n = 4;
              return mergeBookmarkImages(bookmark);
            case 4:
              mergeInfo = _context8.v;
              if (mergeInfo) {
                _context8.n = 5;
                break;
              }
              mergeBtn.innerHTML = getMergeIdleLabel();
              return _context8.a(2);
            case 5:
              mergeBtn.innerHTML = "".concat(ICON_CLOUD, " <span>Salvando...</span>");
              _context8.n = 6;
              return saveMergedImageToGallery(bookmark, mergeInfo);
            case 6:
              savedMergedUrl = _context8.v;
              cleanupMergedPreview();
              previewUrl = savedMergedUrl;
              if (!previewUrl) {
                mergedPreviewObjectUrl = URL.createObjectURL(mergeInfo.blob);
                previewUrl = mergedPreviewObjectUrl;
              }
              showingMerged = true;
              titleEl.innerText = savedMergedUrl ? 'Imagem Mesclada Salva' : 'Imagem Mesclada';
              renderMergedPreview(previewUrl, mergeInfo);
              mergeBtn.innerHTML = "".concat(ICON_GRID, " <span>Ver Originais</span>");
              if (savedMergedUrl) unmergeBtn.style.display = 'flex';
              showToast(savedMergedUrl ? 'Mescla salva na galeria' : 'Mescla criada (não foi possível salvar)');
              updateGalleryContent();
              _context8.n = 8;
              break;
            case 7:
              _context8.p = 7;
              _t8 = _context8.v;
              console.error('[pinboard] Falha ao salvar mescla na galeria:', _t8);
              showToast("Erro ao salvar mescla: ".concat(_t8.message || 'falha desconhecida'));
              mergeBtn.innerHTML = getMergeIdleLabel();
            case 8:
              _context8.p = 8;
              mergeBtn.disabled = false;
              mergeBtn.style.opacity = '1';
              return _context8.f(8);
            case 9:
              return _context8.a(2);
          }
        }, _callee6, null, [[3, 7, 8, 9]]);
      }));
      if (bookmark.mergedImageUrl) {
        showingMerged = true;
        titleEl.innerText = 'Imagem Mesclada Salva';
        renderMergedPreview(bookmark.mergedImageUrl, null);
        mergeBtn.innerHTML = "".concat(ICON_GRID, " <span>Ver Originais</span>");
        // unmergeBtn defaults to flex on load so it will be visible
      }
      btnContainer.appendChild(mergeBtn);
      btnContainer.appendChild(unmergeBtn);
    }
    var closeBtn = document.createElement('button');
    closeBtn.innerText = 'Voltar';
    closeBtn.style = 'background: #333; color: white; border: none; padding: 10px 25px; cursor: pointer; border-radius: 9999px; font-weight: bold;';
    closeBtn.onclick = function () {
      cleanupMergedPreview();
      detailModal.remove();
    };
    btnContainer.appendChild(closeBtn);
    header.appendChild(btnContainer);
    detailModal.appendChild(header);
    if (!showingMerged) {
      renderOriginalImages();
    }
    detailModal.appendChild(imgList);
    document.body.appendChild(detailModal);
  }

  // Modal de edição de links do bookmark - Interface melhorada
  function showEditLinksModal(_x13, _x14) {
    return _showEditLinksModal.apply(this, arguments);
  } // ==================== PREVIEW POPUP ====================
  function _showEditLinksModal() {
    _showEditLinksModal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(bookmark, onSave) {
      var overlay, modal, header, headerTop, titleSection, titleRow, iconCircle, title, subtitle, closeX, body, editedImages, hasChanges, urlContainer, renderUrls, addBtn, footer, warning, btnRow, cancelBtn, saveBtn;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            renderUrls = function _renderUrls() {
              urlContainer.innerHTML = '';
              if (editedImages.length === 0) {
                var emptyState = document.createElement('div');
                emptyState.style = 'text-align: center; padding: 30px; color: #555;';
                emptyState.innerHTML = "\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"margin-bottom: 12px; opacity: 0.5;\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"/></svg>\n                    <p style=\"margin: 0; font-size: 14px;\">Nenhuma imagem adicionada</p>\n                ";
                urlContainer.appendChild(emptyState);
                return;
              }
              editedImages.forEach(function (url, idx) {
                var card = document.createElement('div');
                card.style = "\n                    background: #1e2126; border: 1px solid #2a2a2a; border-radius: 12px;\n                    padding: 14px; display: flex; gap: 12px; align-items: center;\n                    transition: all 0.2s; animation: ruleSlideIn 0.2s ease;\n                ";
                card.onmouseenter = function () {
                  card.style.borderColor = '#3a3a3a';
                  card.style.background = '#252830';
                };
                card.onmouseleave = function () {
                  card.style.borderColor = '#2a2a2a';
                  card.style.background = '#1e2126';
                };

                // Thumbnail preview
                var thumbContainer = document.createElement('div');
                thumbContainer.style = "\n                    width: 60px; height: 60px; border-radius: 8px; overflow: hidden;\n                    background: #15181c; flex-shrink: 0; position: relative;\n                ";
                var isVideo = (url || '').toLowerCase().includes('.mp4');
                var thumb = document.createElement(isVideo ? 'video' : 'img');
                if (isVideo) {
                  thumb.muted = true;
                  thumb.loop = true;
                  thumb.autoplay = getSettings().autoplayVideos !== false;
                  thumb.setAttribute('playsinline', '');
                }
                thumb.src = formatTwitterUrl(url) || '';
                thumb.style = 'width: 100%; height: 100%; object-fit: cover;';
                thumb.onerror = function () {
                  thumbContainer.innerHTML = "\n                        <div style=\"width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #2a2a2a;\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#555\" stroke-width=\"2\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"/></svg>\n                        </div>\n                    ";
                };
                thumbContainer.appendChild(thumb);

                // Número do índice
                var indexBadge = document.createElement('div');
                indexBadge.innerText = idx + 1;
                indexBadge.style = "\n                    position: absolute; top: 4px; left: 4px;\n                    background: rgba(0,0,0,0.7); color: white;\n                    font-size: 10px; font-weight: bold;\n                    padding: 2px 6px; border-radius: 4px;\n                ";
                thumbContainer.appendChild(indexBadge);
                card.appendChild(thumbContainer);

                // Input container
                var inputContainer = document.createElement('div');
                inputContainer.style = 'flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0;';
                var inputLabel = document.createElement('label');
                inputLabel.innerText = "Imagem ".concat(idx + 1);
                inputLabel.style = 'color: #888; font-size: 11px; font-weight: 500;';
                inputContainer.appendChild(inputLabel);
                var input = document.createElement('input');
                input.type = 'text';
                input.value = url;
                input.placeholder = 'Cole a URL da imagem...';
                input.style = "\n                    width: 100%; padding: 10px 12px; border-radius: 8px;\n                    border: 1px solid #333; background: #15181c; color: white;\n                    font-size: 12px; font-family: monospace; box-sizing: border-box;\n                    transition: border-color 0.2s, box-shadow 0.2s;\n                ";
                input.onfocus = function () {
                  input.style.borderColor = '#1d9bf0';
                  input.style.boxShadow = '0 0 0 3px rgba(29,155,240,0.15)';
                };
                input.onblur = function () {
                  input.style.borderColor = '#333';
                  input.style.boxShadow = 'none';
                };
                input.oninput = function () {
                  editedImages[idx] = input.value.trim();
                  hasChanges = true;
                  // Atualizar thumbnail
                  if (input.value.trim()) {
                    thumb.src = formatTwitterUrl(input.value.trim());
                  }
                };
                inputContainer.appendChild(input);
                card.appendChild(inputContainer);

                // Botões de ação
                var actionsContainer = document.createElement('div');
                actionsContainer.style = 'display: flex; gap: 6px; flex-shrink: 0;';

                // Botão de abrir em nova aba
                var openBtn = document.createElement('button');
                openBtn.innerHTML = ICON_EXTERNAL_LINK;
                openBtn.title = 'Abrir em nova aba';
                openBtn.style = "\n                    background: transparent; border: 1px solid #333; color: #666;\n                    padding: 10px; border-radius: 8px; cursor: pointer; display: flex;\n                    transition: all 0.2s;\n                ";
                openBtn.onmouseenter = function () {
                  openBtn.style.borderColor = '#1d9bf0';
                  openBtn.style.color = '#1d9bf0';
                };
                openBtn.onmouseleave = function () {
                  openBtn.style.borderColor = '#333';
                  openBtn.style.color = '#666';
                };
                openBtn.onclick = function () {
                  if (input.value.trim()) window.open(formatTwitterUrl(input.value.trim()), '_blank');
                };
                actionsContainer.appendChild(openBtn);

                // Botão de remover
                var removeBtn = document.createElement('button');
                removeBtn.innerHTML = ICON_TRASH;
                removeBtn.title = 'Remover imagem';
                removeBtn.style = "\n                    background: transparent; border: 1px solid #333; color: #666;\n                    padding: 10px; border-radius: 8px; cursor: pointer; display: flex;\n                    transition: all 0.2s;\n                ";
                removeBtn.onmouseenter = function () {
                  removeBtn.style.borderColor = '#f4212e';
                  removeBtn.style.color = '#f4212e';
                  removeBtn.style.background = 'rgba(244,33,46,0.1)';
                };
                removeBtn.onmouseleave = function () {
                  removeBtn.style.borderColor = '#333';
                  removeBtn.style.color = '#666';
                  removeBtn.style.background = 'transparent';
                };
                removeBtn.onclick = function () {
                  editedImages.splice(idx, 1);
                  hasChanges = true;
                  renderUrls();
                };
                actionsContainer.appendChild(removeBtn);
                card.appendChild(actionsContainer);
                urlContainer.appendChild(card);
              });
            };
            overlay = document.createElement('div');
            overlay.setAttribute('data-pinboard-overlay', 'true');
            overlay.style = "\n            position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n            background: rgba(0,0,0,0.85); z-index: 10001;\n            display: flex; justify-content: center; align-items: center;\n            animation: fadeIn 0.2s ease;\n        ";
            modal = document.createElement('div');
            modal.style = "\n            background: linear-gradient(145deg, #15181c 0%, #1a1d21 100%);\n            padding: 0; border-radius: 20px;\n            width: 650px; max-width: 95%; max-height: 85vh;\n            color: white; border: 1px solid #2a2a2a;\n            position: relative; display: flex; flex-direction: column;\n            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);\n            animation: slideUp 0.3s ease;\n        ";

            // Header do modal
            header = document.createElement('div');
            header.style = "\n            padding: 25px 25px 20px 25px;\n            border-bottom: 1px solid #2a2a2a;\n            background: linear-gradient(180deg, rgba(29,155,240,0.08) 0%, transparent 100%);\n            flex-shrink: 0;\n        ";
            headerTop = document.createElement('div');
            headerTop.style = 'display: flex; justify-content: space-between; align-items: flex-start;';
            titleSection = document.createElement('div');
            titleRow = document.createElement('div');
            titleRow.style = 'display: flex; align-items: center; gap: 12px; margin-bottom: 8px;';
            iconCircle = document.createElement('div');
            iconCircle.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z\"/></svg>";
            iconCircle.style = "\n            width: 44px; height: 44px; border-radius: 12px;\n            background: linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%);\n            display: flex; align-items: center; justify-content: center;\n            box-shadow: 0 4px 12px rgba(29,155,240,0.3);\n        ";
            title = document.createElement('h3');
            title.innerText = 'Editar Links';
            title.style = 'margin: 0; color: white; font-size: 20px; font-weight: 600;';
            titleRow.appendChild(iconCircle);
            titleRow.appendChild(title);
            titleSection.appendChild(titleRow);
            subtitle = document.createElement('p');
            subtitle.innerText = 'Gerencie as URLs das imagens deste bookmark';
            subtitle.style = 'margin: 0; color: #666; font-size: 13px; margin-left: 56px;';
            titleSection.appendChild(subtitle);
            headerTop.appendChild(titleSection);

            // Botão X de fechar
            closeX = document.createElement('button');
            closeX.innerHTML = ICON_X.replace('width="16"', 'width="20"').replace('height="16"', 'height="20"');
            closeX.style = "\n            background: rgba(255,255,255,0.05); border: none; color: #666;\n            cursor: pointer; padding: 10px; border-radius: 10px;\n            display: flex; align-items: center; justify-content: center;\n            transition: all 0.2s;\n        ";
            closeX.onmouseenter = function () {
              closeX.style.color = 'white';
              closeX.style.background = 'rgba(255,255,255,0.1)';
            };
            closeX.onmouseleave = function () {
              closeX.style.color = '#666';
              closeX.style.background = 'rgba(255,255,255,0.05)';
            };
            closeX.onclick = function () {
              return overlay.remove();
            };
            headerTop.appendChild(closeX);
            header.appendChild(headerTop);
            modal.appendChild(header);

            // Corpo do modal
            body = document.createElement('div');
            body.style = 'padding: 25px; overflow-y: auto; flex: 1; min-height: 0;';

            // Estado local das URLs
            editedImages = _toConsumableArray(bookmark.images || []);
            hasChanges = false; // Container das URLs
            urlContainer = document.createElement('div');
            urlContainer.style = 'display: flex; flex-direction: column; gap: 12px;';
            renderUrls();
            body.appendChild(urlContainer);

            // Botão adicionar nova URL
            addBtn = document.createElement('button');
            addBtn.innerHTML = "\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>\n            <span>Adicionar Nova Imagem</span>\n        ";
            addBtn.style = "\n            width: 100%; margin-top: 16px; padding: 14px;\n            background: transparent; border: 2px dashed #333;\n            border-radius: 12px; color: #666; cursor: pointer;\n            display: flex; align-items: center; justify-content: center; gap: 8px;\n            font-size: 14px; transition: all 0.2s;\n        ";
            addBtn.onmouseenter = function () {
              addBtn.style.borderColor = '#1d9bf0';
              addBtn.style.color = '#1d9bf0';
              addBtn.style.background = 'rgba(29,155,240,0.05)';
            };
            addBtn.onmouseleave = function () {
              addBtn.style.borderColor = '#333';
              addBtn.style.color = '#666';
              addBtn.style.background = 'transparent';
            };
            addBtn.onclick = function () {
              editedImages.push('');
              hasChanges = true;
              renderUrls();
              // Scroll to bottom
              setTimeout(function () {
                return body.scrollTop = body.scrollHeight;
              }, 100);
            };
            body.appendChild(addBtn);
            modal.appendChild(body);

            // Footer com aviso e botões
            footer = document.createElement('div');
            footer.style = 'padding: 20px 25px; border-top: 1px solid #2a2a2a; background: #15181c; flex-shrink: 0;';

            // Aviso sobre backup do Telegram - AMARELO para chamar atenção
            if (bookmark.telegramUrls && bookmark.telegramUrls.some(function (u) {
              return u && (u.startsWith('tg:') || u.startsWith('https://'));
            })) {
              warning = document.createElement('div');
              warning.innerHTML = "\n                <div style=\"display: flex; align-items: center; gap: 10px;\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#eab308\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/><path d=\"M12 9v4\"/><path d=\"M12 17h.01\"/></svg>\n                    <div>\n                        <div style=\"color: #eab308; font-size: 13px; font-weight: 500;\">Backup detectado</div>\n                        <div style=\"color: #a3a310; font-size: 11px;\">Editar links invalidar\xE1 os backups atuais do Telegram</div>\n                    </div>\n                </div>\n            ";
              warning.style = "\n                background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.3);\n                border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;\n            ";
              footer.appendChild(warning);
            }

            // Botões de ação
            btnRow = document.createElement('div');
            btnRow.style = 'display: flex; gap: 12px;';
            cancelBtn = document.createElement('button');
            cancelBtn.innerText = 'Cancelar';
            cancelBtn.style = "\n            flex: 1; background: #2a2a2a; color: white; border: none;\n            padding: 12px 20px; border-radius: 10px; cursor: pointer;\n            font-size: 14px; font-weight: 500; transition: all 0.2s;\n            text-align: center;\n        ";
            cancelBtn.onmouseenter = function () {
              cancelBtn.style.background = '#3a3a3a';
            };
            cancelBtn.onmouseleave = function () {
              cancelBtn.style.background = '#2a2a2a';
            };
            cancelBtn.onclick = function () {
              return overlay.remove();
            };
            btnRow.appendChild(cancelBtn);
            saveBtn = document.createElement('button');
            saveBtn.innerText = 'Salvar';
            saveBtn.style = "\n            flex: 1; background: #1d9bf0; color: white; border: none;\n            padding: 12px 20px; border-radius: 10px; cursor: pointer;\n            font-size: 14px; font-weight: 600; transition: all 0.2s;\n            text-align: center;\n        ";
            saveBtn.onmouseenter = function () {
              saveBtn.style.background = '#1a8cd8';
            };
            saveBtn.onmouseleave = function () {
              saveBtn.style.background = '#1d9bf0';
            };
            saveBtn.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
              var cleanedImages, oldTelegramUrls, hasOldBackups, keepOldBackups, choice, bookmarks, idx;
              return _regenerator().w(function (_context14) {
                while (1) switch (_context14.n) {
                  case 0:
                    // Filtrar URLs vazias
                    cleanedImages = editedImages.filter(function (u) {
                      return u && u.trim() !== '';
                    });
                    if (!(cleanedImages.length === 0)) {
                      _context14.n = 1;
                      break;
                    }
                    showToast('Adicione pelo menos uma URL');
                    return _context14.a(2);
                  case 1:
                    // Verificar se há backups antigos que precisam ser tratados
                    oldTelegramUrls = bookmark.telegramUrls || [];
                    hasOldBackups = oldTelegramUrls.some(function (u) {
                      return u && (u.startsWith('tg:') || u.startsWith('https://'));
                    });
                    keepOldBackups = false;
                    if (!(hasChanges && hasOldBackups)) {
                      _context14.n = 4;
                      break;
                    }
                    _context14.n = 2;
                    return showChoiceModal('O que fazer com os backups antigos no Telegram?', [{
                      label: 'Limpar referências locais',
                      value: 'delete',
                      bg: '#f4212e',
                      bold: true
                    }, {
                      label: 'Manter referências',
                      value: 'keep',
                      bg: '#333'
                    }, {
                      label: 'Cancelar',
                      value: 'cancel',
                      color: '#888'
                    }]);
                  case 2:
                    choice = _context14.v;
                    if (!(choice === 'cancel' || choice === null)) {
                      _context14.n = 3;
                      break;
                    }
                    return _context14.a(2);
                  case 3:
                    if (choice === 'keep') keepOldBackups = true;
                  case 4:
                    // Atualizar bookmark
                    bookmarks = getBookmarks();
                    idx = bookmarks.findIndex(function (b) {
                      return b.id === bookmark.id;
                    });
                    if (idx !== -1) {
                      // Normalizar URLs para 4k
                      bookmarks[idx].images = cleanedImages.map(formatTwitterUrl);
                      // Limpar telegramUrls pois o conteúdo mudou (salvo se o usuário pediu para manter)
                      if (hasChanges && !keepOldBackups) {
                        bookmarks[idx].telegramUrls = [];
                      }
                      saveBookmarks(bookmarks);
                      showToast('Links atualizados com sucesso');
                    }
                    overlay.remove();
                    if (onSave) onSave();
                  case 5:
                    return _context14.a(2);
                }
              }, _callee12);
            }));
            btnRow.appendChild(saveBtn);
            footer.appendChild(btnRow);
            modal.appendChild(footer);
            overlay.appendChild(modal);
            overlay.onclick = function (e) {
              if (e.target === overlay) overlay.remove();
            };
            document.body.appendChild(overlay);
          case 1:
            return _context15.a(2);
        }
      }, _callee13);
    }));
    return _showEditLinksModal.apply(this, arguments);
  }
  var previewEl = null;
  function showPreview(e, src) {
    if (!src) return;
    hidePreview();
    previewEl = document.createElement('div');
    previewEl.style = "\n            position: fixed; z-index: 10002; pointer-events: none;\n            background: #000; border: 2px solid #1d9bf0; border-radius: 12px;\n            padding: 5px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);\n        ";
    var isVideo = (src || '').toLowerCase().includes('.mp4');
    var img = document.createElement(isVideo ? 'video' : 'img');
    if (isVideo) {
      img.muted = true;
      img.loop = true;
      img.autoplay = true; // Sempre tocar no hover
      img.setAttribute('playsinline', '');
      // Para garantir autoplay dinâmico em alguns browsers, forçar play ao ser anexado
      setTimeout(function () {
        if (document.body.contains(img)) img.play().catch(function () {});
      }, 50);
    }
    img.src = src;
    img.style = 'max-width: 400px; max-height: 400px; border-radius: 8px; display: block;';
    previewEl.appendChild(img);
    document.body.appendChild(previewEl);

    // Posicionar - garantir que fique dentro da tela
    var rect = e.target.getBoundingClientRect();
    var previewHeight = 410; // max-height + padding
    var previewWidth = 420;
    var left = rect.right + 10;
    var top = rect.top;

    // Se não cabe à direita, mostra à esquerda
    if (left + previewWidth > window.innerWidth) {
      left = rect.left - previewWidth - 10;
    }

    // Se não cabe embaixo, ajusta pra cima
    if (top + previewHeight > window.innerHeight) {
      top = window.innerHeight - previewHeight - 10;
    }

    // Garantir que não fique negativo
    if (top < 10) top = 10;
    if (left < 10) left = 10;
    previewEl.style.left = left + 'px';
    previewEl.style.top = top + 'px';
  }
  function hidePreview() {
    if (previewEl) {
      previewEl.remove();
      previewEl = null;
    }
  }

  // ==================== INIT ====================
  GM_registerMenuCommand('Ver Meus Bookmarks', createGalleryModal);
  installPinboardRouteWatcher();
  var observer = new MutationObserver(function () {
    injectButtons();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  handlePinboardRouteChanged();

  // ==================== PERIODIC BACKUP SCAN ====================
  // Varredura periódica para fazer backup de bookmarks que têm auto-tag configurado
  function periodicBackupScan() {
    return _periodicBackupScan.apply(this, arguments);
  }
  function _periodicBackupScan() {
    _periodicBackupScan = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
      var isInitial,
        settings,
        rules,
        normalizedRules,
        autotagUsers,
        bookmarks,
        pendingBookmarks,
        _iterator7,
        _step7,
        _bookmark$images3,
        _bookmark$telegramUrl4,
        _bookmark,
        handle,
        isAutotagUser,
        matchesFilterTag,
        _bookmark$tags2,
        needsBackup,
        _i,
        _pendingBookmarks,
        bookmark,
        _args16 = arguments,
        _t14,
        _t15;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.p = _context16.n) {
          case 0:
            isInitial = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : false;
            settings = getSettings(); // Só executa se backup automático estiver habilitado e credenciais configuradas
            if (!(!settings.telegramAutoBackup || !settings.telegramToken || !settings.telegramChatId)) {
              _context16.n = 1;
              break;
            }
            console.log('[pinboard] Periodic scan skipped: auto backup not configured');
            return _context16.a(2);
          case 1:
            rules = getAutotagRules();
            if (!(rules.length === 0)) {
              _context16.n = 2;
              break;
            }
            console.log('[pinboard] Periodic scan skipped: no auto-tag rules');
            return _context16.a(2);
          case 2:
            normalizedRules = normalizeAutotagRules(rules); // Notificação de início da varredura
            if (isInitial) {
              showToast('Varredura inicial de backup iniciada...');
            }

            // Coletar todos os @usernames das regras
            autotagUsers = new Set(normalizedRules.map(function (r) {
              return getAutotagUsernameKey(r.username);
            }));
            bookmarks = getBookmarks();
            pendingBookmarks = [];
            console.log('[pinboard] Scan config:', {
              autotagUsers: _toConsumableArray(autotagUsers),
              filterTags: settings.telegramFilterTags || [],
              totalBookmarks: bookmarks.length
            });
            _iterator7 = _createForOfIteratorHelper(bookmarks);
            _context16.p = 3;
            _iterator7.s();
          case 4:
            if ((_step7 = _iterator7.n()).done) {
              _context16.n = 11;
              break;
            }
            _bookmark = _step7.value;
            handle = normalizeAutotagUsername(extractHandle(_bookmark.postUrl));
            isAutotagUser = autotagUsers.has(getAutotagUsernameKey(handle)); // Verificar se tem tags no filtro (se configurado)
            matchesFilterTag = false;
            if (settings.telegramFilterTags && settings.telegramFilterTags.length > 0) {
              matchesFilterTag = (_bookmark$tags2 = _bookmark.tags) === null || _bookmark$tags2 === void 0 ? void 0 : _bookmark$tags2.some(function (t) {
                return settings.telegramFilterTags.includes(t);
              });
            }

            // Bookmark deve ser de usuário com auto-tag OU ter tag do filtro
            if (!(!isAutotagUser && !matchesFilterTag)) {
              _context16.n = 5;
              break;
            }
            return _context16.a(3, 10);
          case 5:
            if (!_bookmark.skipTelegramBackup) {
              _context16.n = 6;
              break;
            }
            return _context16.a(3, 10);
          case 6:
            if (!(!_bookmark.images || _bookmark.images.length === 0)) {
              _context16.n = 7;
              break;
            }
            return _context16.a(3, 10);
          case 7:
            if (!(_bookmark.mergedImageUrl && (_bookmark.mergedImageUrl.startsWith('https://') || _bookmark.mergedImageUrl.startsWith('tg:')))) {
              _context16.n = 8;
              break;
            }
            return _context16.a(3, 10);
          case 8:
            // Verificar se já tem backup completo das imagens individuais
            needsBackup = !_bookmark.telegramUrls || _bookmark.telegramUrls.length !== _bookmark.images.length || !_bookmark.telegramUrls.every(function (url) {
              return url && (url.startsWith('tg:') || url.startsWith('https://'));
            });
            if (needsBackup) {
              _context16.n = 9;
              break;
            }
            return _context16.a(3, 10);
          case 9:
            console.log('[pinboard] Found pending:', {
              handle: handle,
              tags: _bookmark.tags,
              hasImages: (_bookmark$images3 = _bookmark.images) === null || _bookmark$images3 === void 0 ? void 0 : _bookmark$images3.length,
              hasTelegramBackup: ((_bookmark$telegramUrl4 = _bookmark.telegramUrls) === null || _bookmark$telegramUrl4 === void 0 ? void 0 : _bookmark$telegramUrl4.length) || 0,
              isAutotagUser: isAutotagUser,
              matchesFilterTag: matchesFilterTag
            });
            pendingBookmarks.push(_bookmark);
          case 10:
            _context16.n = 4;
            break;
          case 11:
            _context16.n = 13;
            break;
          case 12:
            _context16.p = 12;
            _t14 = _context16.v;
            _iterator7.e(_t14);
          case 13:
            _context16.p = 13;
            _iterator7.f();
            return _context16.f(13);
          case 14:
            if (!(pendingBookmarks.length === 0)) {
              _context16.n = 15;
              break;
            }
            console.log('[pinboard] Periodic scan: all bookmarks already backed up');
            if (isInitial) {
              showToast('Varredura concluída: todos os backups em dia');
            }
            return _context16.a(2);
          case 15:
            console.log("[pinboard] Periodic scan: found ".concat(pendingBookmarks.length, " bookmark(s) needing backup"));
            showToast("Varredura: ".concat(pendingBookmarks.length, " bookmark(s) pendente(s)"));

            // Fazer backup de cada um (com delay para não sobrecarregar)
            _i = 0, _pendingBookmarks = pendingBookmarks;
          case 16:
            if (!(_i < _pendingBookmarks.length)) {
              _context16.n = 22;
              break;
            }
            bookmark = _pendingBookmarks[_i];
            _context16.p = 17;
            _context16.n = 18;
            return backupBookmarkImages(bookmark.id);
          case 18:
            _context16.n = 19;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 2000);
            });
          case 19:
            _context16.n = 21;
            break;
          case 20:
            _context16.p = 20;
            _t15 = _context16.v;
            console.error("[pinboard] Periodic backup failed for ".concat(bookmark.id, ":"), _t15);
          case 21:
            _i++;
            _context16.n = 16;
            break;
          case 22:
            console.log('[pinboard] Periodic scan completed');
            showToast("Varredura conclu\xEDda: ".concat(pendingBookmarks.length, " backup(s)"));
          case 23:
            return _context16.a(2);
        }
      }, _callee14, null, [[17, 20], [3, 12, 13, 14]]);
    }));
    return _periodicBackupScan.apply(this, arguments);
  }
  var BACKUP_SCAN_INTERVAL = 5 * 60 * 1000;

  // ==================== MIGRAÇÃO: Limpar URLs com pipe ====================
  function migrateCleanPipeUrls() {
    var bookmarks = getBookmarks();
    var migrated = 0;
    bookmarks.forEach(function (bookmark) {
      if (bookmark.images && Array.isArray(bookmark.images)) {
        bookmark.images = bookmark.images.map(function (url) {
          if (url && url.includes('|')) {
            migrated++;
            // Pegar apenas a primeira URL (4k), ignorar o fallback
            return url.split('|')[0];
          }
          return url;
        });
      }
    });
    if (migrated > 0) {
      saveBookmarks(bookmarks);
      console.log("[pinboard] Migra\xE7\xE3o: ".concat(migrated, " URL(s) com pipe corrigida(s)"));
    }
  }

  // Executar migração imediatamente
  migrateCleanPipeUrls();

  // Primeira varredura após 30 segundos para não impactar carregamento inicial
  setTimeout(function () {
    periodicBackupScan(true); // isInitial = true

    // Depois continua a cada X minutos
    setInterval(function () {
      return periodicBackupScan(false);
    }, BACKUP_SCAN_INTERVAL);
  }, 30000);

  // ==================== FLOATING BUTTON ====================
  function createFloatingButton() {
    if (document.getElementById('pinboard-fab')) return;
    var settings = getSettings();

    // Criar o botão com estilo nativo do X
    var fab = document.createElement('button');
    fab.id = 'pinboard-fab';
    fab.setAttribute('role', 'button');
    fab.setAttribute('type', 'button');
    fab.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"32\" height=\"32\" fill=\"currentColor\"><path d=\"M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z\"></path></svg>";
    fab.title = "Abrir Meus Bookmarks (".concat(settings.shortcuts.openGallery.toUpperCase(), ")");
    fab.onclick = function (e) {
      if (e.detail === 0) return;
      createGalleryModal();
    };

    // Estilo nativo do X - fundo preto com bordas arredondadas e glow
    fab.style.cssText = "\n            position: fixed; bottom: 20px; right: 80px; z-index: 9998;\n            width: 57px; height: 57px; border-radius: 16px;\n            background: rgb(0, 0, 0); color: rgb(231, 233, 234);\n            border: 1px solid rgba(255, 255, 255, 0.3);\n            cursor: pointer; display: flex; align-items: center; justify-content: center;\n            transition: background 0.2s, transform 0.2s;\n            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);\n        ";
    fab.onmouseover = function () {
      return fab.style.background = 'rgb(22, 24, 28)';
    };
    fab.onmouseout = function () {
      return fab.style.background = 'rgb(0, 0, 0)';
    };
    document.body.appendChild(fab);

    // Sincronizar posição com o GrokDrawer
    function syncPosition() {
      var path = window.location.pathname;
      if (path === '/messages/compose' || path === '/compose/post') {
        fab.style.display = 'flex';
        fab.style.opacity = '0.5';
        fab.style.pointerEvents = 'none';
      } else if (path.includes('/photo/')) {
        fab.style.display = 'none';
      } else {
        var reserved = ['explore', 'messages', 'settings', 'search', 'logout', 'login', 'i', 'compose'];
        var firstSegment = path.split('/')[1];
        var isHome = path === '/home' || path === '/';
        var isExplore = path.startsWith('/explore');
        var isSettings = path.startsWith('/settings');
        var isCommunities = path.startsWith('/communities') || path.startsWith('/i/communities');
        var isNotifications = path === '/notifications';
        var isBookmarks = path === '/i/bookmarks';
        var isStudio = path === '/i/jf/creators/studio';
        var isProfile = !reserved.includes(firstSegment) && /^\/[a-zA-Z0-9_]{1,15}(\/(with_replies|media|likes|highlights|articles|communities))?\/?$/.test(path);
        var isStatus = !reserved.includes(firstSegment) && /^\/[a-zA-Z0-9_]{1,15}\/status\/\d+/.test(path);
        var isLists = !reserved.includes(firstSegment) && /^\/[a-zA-Z0-9_]{1,15}\/lists/.test(path);
        if (isHome || isExplore || isSettings || isCommunities || isNotifications || isBookmarks || isStudio || isProfile || isStatus || isLists) {
          fab.style.display = 'flex';
          fab.style.opacity = '1';
          fab.style.pointerEvents = 'auto';
        } else {
          fab.style.display = 'none';
        }
      }
      var grokDrawer = document.querySelector('[data-testid="GrokDrawer"]');
      if (grokDrawer) {
        var grokRect = grokDrawer.getBoundingClientRect();
        // Posicionar em cima do Grok (mesmo right, mas acima)
        var grokRightFromEdge = window.innerWidth - grokRect.right;
        fab.style.bottom = window.innerHeight - grokRect.top + 12 + 'px';
        fab.style.right = grokRightFromEdge + 'px';
      }
    }

    // Sincronizar imediatamente e quando houver mudanças
    syncPosition();
    var posObserver = new MutationObserver(syncPosition);
    posObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    // Também sincronizar no scroll e resize
    window.addEventListener('scroll', syncPosition, {
      passive: true
    });
    window.addEventListener('resize', syncPosition, {
      passive: true
    });
  }
  createFloatingButton();

  // ==================== KEYBOARD SHORTCUTS ====================
  function matchesShortcut(e, shortcut) {
    if (!shortcut) return false;
    var parts = shortcut.toLowerCase().split('+');
    var needsCtrl = parts.includes('ctrl');
    var needsShift = parts.includes('shift');
    var needsAlt = parts.includes('alt');
    var key = parts.filter(function (p) {
      return !['ctrl', 'shift', 'alt'].includes(p);
    })[0];
    if (needsCtrl !== e.ctrlKey) return false;
    if (needsShift !== e.shiftKey) return false;
    if (needsAlt !== e.altKey) return false;
    if (key === 'escape') return e.key === 'Escape';
    return e.key.toLowerCase() === key;
  }

  // Usar capture: true para interceptar antes do site
  document.addEventListener('keydown', function (e) {
    var _document$activeEleme, _document$activeEleme2, _document$activeEleme3;
    // Ignorar se estamos definindo um novo atalho
    if (isListeningForShortcut) return;
    var settings = getSettings();
    var shortcuts = settings.shortcuts || DEFAULT_SETTINGS.shortcuts;
    var gallery = document.getElementById('pinboard-gallery');
    var isGalleryOpen = gallery && gallery.style.display !== 'none';
    var isInputFocused = ((_document$activeEleme = document.activeElement) === null || _document$activeEleme === void 0 ? void 0 : _document$activeEleme.tagName) === 'INPUT' || ((_document$activeEleme2 = document.activeElement) === null || _document$activeEleme2 === void 0 ? void 0 : _document$activeEleme2.tagName) === 'TEXTAREA' || ((_document$activeEleme3 = document.activeElement) === null || _document$activeEleme3 === void 0 ? void 0 : _document$activeEleme3.isContentEditable);

    // Abrir/fechar galeria
    if (matchesShortcut(e, shortcuts.openGallery)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (isGalleryOpen) {
        closePinboardGallery(gallery);
      } else {
        createGalleryModal();
      }
      return;
    }

    // Fechar modal ativo (ESC só fecha, nunca abre)
    if (matchesShortcut(e, shortcuts.closeModal)) {
      // Primeiro tenta fechar modais internos (settings, tags, etc)
      var overlays = getPinboardModalArtifacts().filter(function (element) {
        return element.id !== 'pinboard-gallery';
      });
      if (overlays.length > 0) {
        e.preventDefault();
        overlays[overlays.length - 1].remove();
        return;
      }
      // Depois fecha a galeria se estiver aberta
      if (isGalleryOpen) {
        e.preventDefault();
        closePinboardGallery(gallery);
        return;
      }
      // Se nada está aberto, não faz nada
      return;
    }

    // Atalhos que só funcionam na galeria e sem foco em input
    if (!isGalleryOpen || isInputFocused) return;

    // Abrir configurações
    if (matchesShortcut(e, shortcuts.openSettings)) {
      e.preventDefault();
      SettingsModal(updateGalleryContent);
      return;
    }
  }, true);
})();
