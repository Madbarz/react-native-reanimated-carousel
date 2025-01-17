"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseLayout = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _useOffsetX = require("../hooks/useOffsetX");

var _LazyView = require("../LazyView");

var _store = require("../store");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BaseLayout = props => {
  const {
    handlerOffsetX,
    index,
    children,
    visibleRanges,
    animationStyle
  } = props;

  const context = _react.default.useContext(_store.CTX);

  const {
    props: {
      loop,
      data,
      width,
      height,
      vertical,
      customConfig,
      mode,
      modeConfig
    }
  } = context;
  const size = vertical ? height : width;

  const [shouldUpdate, setShouldUpdate] = _react.default.useState(false);

  let offsetXConfig = {
    handlerOffsetX,
    index,
    size,
    data,
    loop,
    ...(typeof customConfig === 'function' ? customConfig() : {})
  };

  if (mode === 'horizontal-stack') {
    const {
      snapDirection,
      showLength
    } = modeConfig;
    offsetXConfig = {
      handlerOffsetX,
      index,
      size,
      data,
      loop,
      type: snapDirection === 'right' ? 'negative' : 'positive',
      viewCount: showLength
    };
  }

  const x = (0, _useOffsetX.useOffsetX)(offsetXConfig, visibleRanges);
  const animationValue = (0, _reactNativeReanimated.useDerivedValue)(() => x.value / size, [x, size]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => animationStyle(x.value / size), [animationStyle]);

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
    }, animatedStyle]
  }, /*#__PURE__*/_react.default.createElement(_LazyView.LazyView, {
    shouldUpdate: shouldUpdate
  }, children({
    animationValue
  })));
};

exports.BaseLayout = BaseLayout;
//# sourceMappingURL=BaseLayout.js.map