import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { runOnJS, useDerivedValue } from 'react-native-reanimated';
import { DATA_LENGTH } from './constants';
import { useAutoPlay } from './hooks/useAutoPlay';
import { useCarouselController } from './hooks/useCarouselController';
import { useCommonVariables } from './hooks/useCommonVariables';
import { useInitProps } from './hooks/useInitProps';
import { useLayoutConfig } from './hooks/useLayoutConfig';
import { useOnProgressChange } from './hooks/useOnProgressChange';
import { usePropsErrorBoundary } from './hooks/usePropsErrorBoundary';
import { useVisibleRanges } from './hooks/useVisibleRanges';
import { BaseLayout } from './layouts/BaseLayout';
import { ScrollViewGesture } from './ScrollViewGesture';
import { CTX } from './store';

function Carousel(_props, ref) {
  const props = useInitProps(_props);
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
  const commonVariables = useCommonVariables(props);
  const {
    size,
    handlerOffsetX
  } = commonVariables;
  const offsetX = useDerivedValue(() => {
    const totalSize = size * data.length;
    const x = handlerOffsetX.value % totalSize;

    if (!loop) {
      return handlerOffsetX.value;
    }

    return isNaN(x) ? 0 : x;
  }, [loop, size, data]);
  usePropsErrorBoundary(props);
  useOnProgressChange({
    size,
    offsetX,
    data,
    onProgressChange
  });
  const carouselController = useCarouselController({
    loop,
    size,
    handlerOffsetX,
    length: data.length,
    disable: !data.length,
    originalLength: data.length,
    onScrollEnd: () => runOnJS(_onScrollEnd)(),
    onScrollBegin: () => !!onScrollBegin && runOnJS(onScrollBegin)(),
    onChange: i => onSnapToItem && runOnJS(onSnapToItem)(i),
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
  } = useAutoPlay({
    autoPlay,
    autoPlayInterval,
    autoPlayReverse,
    carouselController,
    autoPlayDelay
  });
  const scrollViewGestureOnScrollBegin = React.useCallback(() => {
    pause();
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
  }, [onScrollBegin, pause]);

  const _onScrollEnd = React.useCallback(() => {
    computedIndex();
    onScrollEnd === null || onScrollEnd === void 0 ? void 0 : onScrollEnd(sharedPreIndex.current, sharedIndex.current);
  }, [sharedPreIndex, sharedIndex, computedIndex, onScrollEnd]);

  const scrollViewGestureOnScrollEnd = React.useCallback(() => {
    run();

    _onScrollEnd();
  }, [_onScrollEnd, run]);
  const goToIndex = React.useCallback((i, animated) => {
    carouselController.to(i, animated);
  }, [carouselController]);
  React.useImperativeHandle(ref, () => ({
    next,
    prev,
    getCurrentIndex,
    goToIndex
  }), [getCurrentIndex, goToIndex, next, prev]);
  const visibleRanges = useVisibleRanges({
    total: data.length,
    viewSize: size,
    translation: handlerOffsetX,
    windowSize
  });
  const layoutConfig = useLayoutConfig({ ...props,
    size
  });
  const renderLayout = React.useCallback((item, i) => {
    let realIndex = i;

    if (data.length === DATA_LENGTH.SINGLE_ITEM) {
      realIndex = i % 1;
    }

    if (data.length === DATA_LENGTH.DOUBLE_ITEM) {
      realIndex = i % 2;
    }

    return /*#__PURE__*/React.createElement(BaseLayout, {
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
  return /*#__PURE__*/React.createElement(CTX.Provider, {
    value: {
      props,
      common: commonVariables
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.container, {
      width: width || '100%',
      height: height || '100%'
    }, style]
  }, /*#__PURE__*/React.createElement(ScrollViewGesture, {
    size: size,
    translation: handlerOffsetX,
    onScrollBegin: scrollViewGestureOnScrollBegin,
    onScrollEnd: scrollViewGestureOnScrollEnd
  }, /*#__PURE__*/React.createElement(Animated.View, {
    key: mode,
    style: [styles.container, {
      width: width || '100%',
      height: height || '100%'
    }, style, vertical ? styles.itemsVertical : styles.itemsHorizontal]
  }, data.map(renderLayout)))));
}

export default /*#__PURE__*/React.forwardRef(Carousel);
const styles = StyleSheet.create({
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