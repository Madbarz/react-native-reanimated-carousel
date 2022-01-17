"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParallaxLayout = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _useOffsetX = require("../hooks/useOffsetX");

var _LazyView = require("../LazyView");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ParallaxLayout = props => {
  const {
    handlerOffsetX,
    parallaxScrollingOffset = 100,
    parallaxScrollingScale = 0.8,
    index,
    width,
    height,
    loop,
    data,
    children,
    visibleRanges,
    vertical
  } = props;

  const [shouldUpdate, setShouldUpdate] = _react.default.useState(false);

  const size = props.vertical ? props.height : props.width;
  const x = (0, _useOffsetX.useOffsetX)({
    handlerOffsetX,
    index,
    size,
    data,
    loop
  }, visibleRanges);
  const offsetXStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const value = x.value / size;
    const translate = (0, _reactNativeReanimated.interpolate)(value, [-1, 0, 1], [-size + parallaxScrollingOffset, 0, size - parallaxScrollingOffset], _reactNativeReanimated.Extrapolate.EXTEND);
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
  }, [loop, vertical, parallaxScrollingOffset]);

  const updateView = _react.default.useCallback((negativeRange, positiveRange) => {
    setShouldUpdate(index >= negativeRange[0] && index <= negativeRange[1] || index >= positiveRange[0] && index <= positiveRange[1]);
  }, [index]);

  (0, _reactNativeReanimated.useAnimatedReaction)(() => visibleRanges.value, () => {
    (0, _reactNativeReanimated.runOnJS)(updateView)(visibleRanges.value.negativeRange, visibleRanges.value.positiveRange);
  }, [visibleRanges.value]);
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [{
      width: width || '100%',
      height: height || '100%',
      position: 'absolute'
    }, offsetXStyle]
  }, /*#__PURE__*/_react.default.createElement(_LazyView.LazyView, {
    shouldUpdate: shouldUpdate
  }, children));
};

exports.ParallaxLayout = ParallaxLayout;
//# sourceMappingURL=ParallaxLayout.js.map