"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layouts = void 0;

var _normal = require("./normal");

var _parallax = require("./parallax");

var _stack = require("./stack");

const Layouts = {
  normal: _normal.normalLayout,
  parallax: _parallax.parallaxLayout,
  horizontalStack: _stack.horizontalStackLayout,
  verticalStack: _stack.verticalStackLayout
};
exports.Layouts = Layouts;
//# sourceMappingURL=index.js.map