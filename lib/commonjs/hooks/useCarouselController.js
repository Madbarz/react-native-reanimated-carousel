"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCarouselController = useCarouselController;

var _react = _interopRequireDefault(require("react"));

var _constants = require("../constants");

var _reactNativeReanimated = require("react-native-reanimated");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useCarouselController(opts) {
  const {
    size,
    loop,
    handlerOffsetX,
    disable = false,
    originalLength,
    length,
    onChange,
    duration
  } = opts;
  const index = (0, _reactNativeReanimated.useSharedValue)(0); // The Index displayed to the user

  const sharedIndex = _react.default.useRef(0);

  const sharedPreIndex = _react.default.useRef(0);

  const convertToSharedIndex = _react.default.useCallback(i => {
    if (loop) {
      switch (originalLength) {
        case 1:
          return 0;

        case 2:
          return i % 2;
      }
    }

    return i;
  }, [originalLength, loop]);

  const computedIndex = _react.default.useCallback(() => {
    sharedPreIndex.current = sharedIndex.current;
    const toInt = handlerOffsetX.value / size % length;
    const i = handlerOffsetX.value <= 0 ? Math.abs(toInt) : Math.abs(toInt > 0 ? length - toInt : 0);
    index.value = i;

    const _sharedIndex = convertToSharedIndex(i);

    sharedIndex.current = _sharedIndex;
    onChange(_sharedIndex);
  }, [length, handlerOffsetX, sharedPreIndex, index, size, sharedIndex, convertToSharedIndex, onChange]);

  const getCurrentIndex = _react.default.useCallback(() => {
    return index.value;
  }, [index]);

  const canSliding = _react.default.useCallback(() => {
    return !disable;
  }, [disable]);

  const onScrollEnd = _react.default.useCallback(() => {
    var _opts$onScrollEnd;

    (_opts$onScrollEnd = opts.onScrollEnd) === null || _opts$onScrollEnd === void 0 ? void 0 : _opts$onScrollEnd.call(opts);
  }, [opts]);

  const onScrollBegin = _react.default.useCallback(() => {
    var _opts$onScrollBegin;

    (_opts$onScrollBegin = opts.onScrollBegin) === null || _opts$onScrollBegin === void 0 ? void 0 : _opts$onScrollBegin.call(opts);
  }, [opts]);

  const scrollWithTiming = _react.default.useCallback((toValue, callback) => {
    return (0, _reactNativeReanimated.withTiming)(toValue, {
      duration,
      easing: _constants.Easing.easeOutQuart
    }, isFinished => {
      callback === null || callback === void 0 ? void 0 : callback();

      if (isFinished) {
        (0, _reactNativeReanimated.runOnJS)(onScrollEnd)();
      }
    });
  }, [onScrollEnd, duration]);

  const next = _react.default.useCallback(() => {
    if (!canSliding() || !loop && index.value === length - 1) return;
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
    const currentPage = Math.round(handlerOffsetX.value / size);
    handlerOffsetX.value = scrollWithTiming((currentPage - 1) * size);
  }, [canSliding, loop, index.value, length, onScrollBegin, handlerOffsetX, size, scrollWithTiming]);

  const prev = _react.default.useCallback(() => {
    if (!canSliding() || !loop && index.value === 0) return;
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
    const currentPage = Math.round(handlerOffsetX.value / size);
    handlerOffsetX.value = scrollWithTiming((currentPage + 1) * size);
  }, [canSliding, loop, index.value, onScrollBegin, handlerOffsetX, size, scrollWithTiming]);

  const to = _react.default.useCallback((idx, animated = false) => {
    if (idx === index.value) return;
    if (!canSliding()) return;
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
    const offset = handlerOffsetX.value + (index.value - idx) * size;

    if (animated) {
      handlerOffsetX.value = scrollWithTiming(offset, () => {
        index.value = idx;
      });
    } else {
      handlerOffsetX.value = offset;
      index.value = idx;
      (0, _reactNativeReanimated.runOnJS)(onScrollEnd)();
    }
  }, [index, canSliding, onScrollBegin, handlerOffsetX, size, scrollWithTiming, onScrollEnd]);

  return {
    next,
    prev,
    to,
    index,
    length,
    sharedIndex,
    sharedPreIndex,
    computedIndex,
    getCurrentIndex
  };
}
//# sourceMappingURL=useCarouselController.js.map