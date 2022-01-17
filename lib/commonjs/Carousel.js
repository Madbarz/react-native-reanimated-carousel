"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _constants = require("./constants");

var _useAutoPlay = require("./hooks/useAutoPlay");

var _useCarouselController = require("./hooks/useCarouselController");

var _useCommonVariables = require("./hooks/useCommonVariables");

var _useInitProps = require("./hooks/useInitProps");

var _useLayoutConfig = require("./hooks/useLayoutConfig");

var _useOnProgressChange = require("./hooks/useOnProgressChange");

var _usePropsErrorBoundary = require("./hooks/usePropsErrorBoundary");

var _useVisibleRanges = require("./hooks/useVisibleRanges");

var _BaseLayout = require("./layouts/BaseLayout");

var _ScrollViewGesture = require("./ScrollViewGesture");

var _store = require("./store");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Carousel(_props, ref) {
  const props = (0, _useInitProps.useInitProps)(_props);
  const {
    data,
    loop,
    mode,
    style,
    width,
    height,
    vertical,
    autoPlay,
    autoPlayDelay = 5000,
    windowSize,
    autoPlayReverse,
    autoPlayInterval,
    renderItem,
    onScrollEnd,
    onSnapToItem,
    onScrollBegin,
    onProgressChange,
    customAnimation
  } = props;
  const commonVariables = (0, _useCommonVariables.useCommonVariables)(props);
  const {
    size,
    handlerOffsetX
  } = commonVariables;
  const offsetX = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const totalSize = size * data.length;
    const x = handlerOffsetX.value % totalSize;

    if (!loop) {
      return handlerOffsetX.value;
    }

    return isNaN(x) ? 0 : x;
  }, [loop, size, data]);
  (0, _usePropsErrorBoundary.usePropsErrorBoundary)(props);
  (0, _useOnProgressChange.useOnProgressChange)({
    size,
    offsetX,
    data,
    onProgressChange
  });
  const carouselController = (0, _useCarouselController.useCarouselController)({
    loop,
    size,
    handlerOffsetX,
    length: data.length,
    disable: !data.length,
    originalLength: data.length,
    onScrollEnd: () => (0, _reactNativeReanimated.runOnJS)(_onScrollEnd)(),
    onScrollBegin: () => !!onScrollBegin && (0, _reactNativeReanimated.runOnJS)(onScrollBegin)(),
    onChange: i => onSnapToItem && (0, _reactNativeReanimated.runOnJS)(onSnapToItem)(i),
    duration: autoPlayInterval
  });
  const {
    next,
    prev,
    sharedPreIndex,
    sharedIndex,
    computedIndex,
    getCurrentIndex
  } = carouselController;
  const {
    run,
    pause
  } = (0, _useAutoPlay.useAutoPlay)({
    autoPlay,
    autoPlayInterval,
    autoPlayReverse,
    carouselController,
    autoPlayDelay
  });

  const scrollViewGestureOnScrollBegin = _react.default.useCallback(() => {
    pause();
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
  }, [onScrollBegin, pause]);

  const _onScrollEnd = _react.default.useCallback(() => {
    computedIndex();
    onScrollEnd === null || onScrollEnd === void 0 ? void 0 : onScrollEnd(sharedPreIndex.current, sharedIndex.current);
  }, [sharedPreIndex, sharedIndex, computedIndex, onScrollEnd]);

  const scrollViewGestureOnScrollEnd = _react.default.useCallback(() => {
    run();

    _onScrollEnd();
  }, [_onScrollEnd, run]);

  const goToIndex = _react.default.useCallback((i, animated) => {
    carouselController.to(i, animated);
  }, [carouselController]);

  _react.default.useImperativeHandle(ref, () => ({
    next,
    prev,
    getCurrentIndex,
    goToIndex
  }), [getCurrentIndex, goToIndex, next, prev]);

  const visibleRanges = (0, _useVisibleRanges.useVisibleRanges)({
    total: data.length,
    viewSize: size,
    translation: handlerOffsetX,
    windowSize
  });
  const layoutConfig = (0, _useLayoutConfig.useLayoutConfig)({ ...props,
    size
  });

  const renderLayout = _react.default.useCallback((item, i) => {
    let realIndex = i;

    if (data.length === _constants.DATA_LENGTH.SINGLE_ITEM) {
      realIndex = i % 1;
    }

    if (data.length === _constants.DATA_LENGTH.DOUBLE_ITEM) {
      realIndex = i % 2;
    }

    return /*#__PURE__*/_react.default.createElement(_BaseLayout.BaseLayout, {
      key: i,
      index: i,
      handlerOffsetX: offsetX,
      visibleRanges: visibleRanges,
      animationStyle: customAnimation || layoutConfig
    }, ({
      animationValue
    }) => renderItem({
      item,
      index: realIndex,
      animationValue
    }));
  }, [data, offsetX, visibleRanges, renderItem, layoutConfig, customAnimation]);

  return /*#__PURE__*/_react.default.createElement(_store.CTX.Provider, {
    value: {
      props,
      common: commonVariables
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, {
      width: width || '100%',
      height: height || '100%'
    }, style]
  }, /*#__PURE__*/_react.default.createElement(_ScrollViewGesture.ScrollViewGesture, {
    size: size,
    translation: handlerOffsetX,
    onScrollBegin: scrollViewGestureOnScrollBegin,
    onScrollEnd: scrollViewGestureOnScrollEnd
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    key: mode,
    style: [styles.container, {
      width: width || '100%',
      height: height || '100%'
    }, style, vertical ? styles.itemsVertical : styles.itemsHorizontal]
  }, data.map(renderLayout)))));
}

var _default = /*#__PURE__*/_react.default.forwardRef(Carousel);

exports.default = _default;

const styles = _reactNative.StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  itemsHorizontal: {
    flexDirection: 'row'
  },
  itemsVertical: {
    flexDirection: 'column'
  }
});
//# sourceMappingURL=Carousel.js.map