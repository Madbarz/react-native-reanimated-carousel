"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parallaxLayout = parallaxLayout;

var _reactNativeReanimated = require("react-native-reanimated");

function parallaxLayout(baseConfig, modeConfig = {}) {
  const {
    size,
    vertical
  } = baseConfig;
  const {
    parallaxScrollingOffset = 100,
    parallaxScrollingScale = 0.8
  } = modeConfig;
  return value => {
    'worklet';

    const translate = (0, _reactNativeReanimated.interpolate)(value, [-1, 0, 1], [-size + parallaxScrollingOffset, 0, size - parallaxScrollingOffset]);
    const zIndex = (0, _reactNativeReanimated.interpolate)(value, [-1, 0, 1], [0, size, 0], _reactNativeReanimated.Extrapolate.CLAMP);
    const scale = (0, _reactNativeReanimated.interpolate)(value, [-1, 0, 1], [Math.pow(parallaxScrollingScale, 2), parallaxScrollingScale, Math.pow(parallaxScrollingScale, 2)], _reactNativeReanimated.Extrapolate.CLAMP);
    return {
      transform: [vertical ? {
        translateY: translate
      } : {
        translateX: translate
      }, {
        scale
      }],
      zIndex
    };
  };
}
//# sourceMappingURL=parallax.js.map