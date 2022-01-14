import React from 'react';
import { Easing } from '../constants';
import { runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
export function useCarouselController(opts) {
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
  const index = useSharedValue(0); // The Index displayed to the user

  const sharedIndex = React.useRef(0);
  const sharedPreIndex = React.useRef(0);
  const convertToSharedIndex = React.useCallback(i => {
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
  const computedIndex = React.useCallback(() => {
    sharedPreIndex.current = sharedIndex.current;
    const toInt = handlerOffsetX.value / size % length;
    const i = handlerOffsetX.value <= 0 ? Math.abs(toInt) : Math.abs(toInt > 0 ? length - toInt : 0);
    index.value = i;

    const _sharedIndex = convertToSharedIndex(i);

    sharedIndex.current = _sharedIndex;
    onChange(_sharedIndex);
  }, [length, handlerOffsetX, sharedPreIndex, index, size, sharedIndex, convertToSharedIndex, onChange]);
  const getCurrentIndex = React.useCallback(() => {
    return index.value;
  }, [index]);
  const canSliding = React.useCallback(() => {
    return !disable;
  }, [disable]);
  const onScrollEnd = React.useCallback(() => {
    var _opts$onScrollEnd;

    (_opts$onScrollEnd = opts.onScrollEnd) === null || _opts$onScrollEnd === void 0 ? void 0 : _opts$onScrollEnd.call(opts);
  }, [opts]);
  const onScrollBegin = React.useCallback(() => {
    var _opts$onScrollBegin;

    (_opts$onScrollBegin = opts.onScrollBegin) === null || _opts$onScrollBegin === void 0 ? void 0 : _opts$onScrollBegin.call(opts);
  }, [opts]);
  const scrollWithTiming = React.useCallback((toValue, callback) => {
    return withTiming(toValue, {
      duration,
      easing: Easing.easeOutQuart
    }, isFinished => {
      callback === null || callback === void 0 ? void 0 : callback();

      if (isFinished) {
        runOnJS(onScrollEnd)();
      }
    });
  }, [onScrollEnd, duration]);
  const next = React.useCallback(() => {
    if (!canSliding() || !loop && index.value === length - 1) return;
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
    const currentPage = Math.round(handlerOffsetX.value / size);
    handlerOffsetX.value = scrollWithTiming((currentPage - 1) * size);
  }, [canSliding, loop, index.value, length, onScrollBegin, handlerOffsetX, size, scrollWithTiming]);
  const prev = React.useCallback(() => {
    if (!canSliding() || !loop && index.value === 0) return;
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
    const currentPage = Math.round(handlerOffsetX.value / size);
    handlerOffsetX.value = scrollWithTiming((currentPage + 1) * size);
  }, [canSliding, loop, index.value, onScrollBegin, handlerOffsetX, size, scrollWithTiming]);
  const to = React.useCallback((idx, animated = false) => {
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
      runOnJS(onScrollEnd)();
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