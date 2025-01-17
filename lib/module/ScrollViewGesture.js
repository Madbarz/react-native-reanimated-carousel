function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, runOnJS, useAnimatedGestureHandler, useAnimatedReaction, useDerivedValue, useSharedValue, withDecay, withTiming } from 'react-native-reanimated';
import { Easing } from './constants';
import { CTX } from './store';

const IScrollViewGesture = props => {
  const {
    props: {
      vertical,
      style,
      data,
      pagingEnabled,
      enableSnap,
      panGestureHandlerProps,
      loop: infinite,
      autoPlayInterval
    }
  } = React.useContext(CTX);
  const {
    translation,
    onScrollBegin,
    onScrollEnd,
    size
  } = props;
  const maxPage = data.length;
  const isHorizontal = useDerivedValue(() => !vertical, [vertical]);
  const touching = useSharedValue(false);
  const scrollEndTranslation = useSharedValue(0);
  const scrollEndVelocity = useSharedValue(0);

  const _withSpring = React.useCallback((toValue, onFinished) => {
    'worklet';

    return withTiming(toValue, {
      duration: autoPlayInterval,
      easing: Easing.easeOutQuart
    }, isFinished => {
      if (isFinished) {
        onFinished === null || onFinished === void 0 ? void 0 : onFinished();
      }
    });
  }, [autoPlayInterval]);

  const endWithSpring = React.useCallback(onFinished => {
    'worklet';

    const origin = translation.value;
    const velocity = scrollEndVelocity.value;

    if (!pagingEnabled) {
      if (enableSnap) {
        const nextPage = Math.round((origin + velocity * 0.4) / size) * size;
        translation.value = _withSpring(nextPage, onFinished);
        return;
      }

      translation.value = withDecay({
        velocity,
        deceleration: 0.999
      });
      return;
    }

    const page = Math.round(-translation.value / size);
    const velocityPage = Math.round(-(translation.value + scrollEndVelocity.value) / size);
    let finalPage = Math.min(page + 1, Math.max(page - 1, velocityPage));

    if (!infinite) {
      finalPage = Math.min(maxPage - 1, Math.max(0, finalPage));
    }

    translation.value = _withSpring(-finalPage * size, onFinished);
  }, [infinite, _withSpring, translation, scrollEndVelocity, size, maxPage, pagingEnabled, enableSnap]);
  const resetBoundary = React.useCallback(() => {
    'worklet';

    const onFinish = isFinished => {
      if (isFinished) {
        touching.value = false;
        onScrollEnd && runOnJS(onScrollEnd)();
      }
    };

    const activeDecay = () => {
      touching.value = true;
      translation.value = withDecay({
        velocity: scrollEndVelocity.value
      }, onFinish);
    };

    if (touching.value) {
      return;
    }

    if (translation.value > 0) {
      if (scrollEndTranslation.value < 0) {
        activeDecay();
        return;
      }

      if (!infinite) {
        translation.value = _withSpring(0);
        return;
      }
    }

    if (translation.value < -((maxPage - 1) * size)) {
      if (scrollEndTranslation.value > 0) {
        activeDecay();
        return;
      }

      if (!infinite) {
        translation.value = _withSpring(-((maxPage - 1) * size));
        return;
      }
    }
  }, [infinite, touching, _withSpring, translation, scrollEndTranslation, scrollEndVelocity, onScrollEnd, maxPage, size]);
  useAnimatedReaction(() => translation.value, () => {
    if (!pagingEnabled) {
      resetBoundary();
    }
  }, [pagingEnabled]);
  const panGestureEventHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      touching.value = true;
      cancelAnimation(translation);
      onScrollBegin && runOnJS(onScrollBegin)();
      ctx.max = (maxPage - 1) * size;
      ctx.panOffset = translation.value;
    },
    onActive: (e, ctx) => {
      touching.value = true;
      const {
        translationX,
        translationY
      } = e;
      let panTranslation = isHorizontal.value ? translationX : translationY;

      if (!infinite && (translation.value > 0 || translation.value < -ctx.max)) {
        const boundary = translation.value > 0 ? 0 : -ctx.max;
        const fixed = boundary - ctx.panOffset;
        const dynamic = panTranslation - fixed;
        translation.value = boundary + dynamic * 0.5;
        return;
      }

      translation.value = ctx.panOffset + panTranslation;
    },
    onEnd: e => {
      const {
        velocityX,
        velocityY,
        translationX,
        translationY
      } = e;
      scrollEndVelocity.value = isHorizontal.value ? velocityX : velocityY;
      scrollEndTranslation.value = isHorizontal.value ? translationX : translationY;
      endWithSpring(() => onScrollEnd && runOnJS(onScrollEnd)());

      if (!infinite) {
        touching.value = false;
      }
    }
  }, [pagingEnabled, isHorizontal.value, infinite, maxPage, size, enableSnap]);
  const directionStyle = React.useMemo(() => {
    return vertical ? styles.contentHorizontal : styles.contentVertical;
  }, [vertical]);
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.container, directionStyle, style]
  }, /*#__PURE__*/React.createElement(PanGestureHandler, _extends({}, panGestureHandlerProps, {
    onGestureEvent: panGestureEventHandler
  }), props.children));
};

export const ScrollViewGesture = IScrollViewGesture;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  contentVertical: {
    flexDirection: 'column'
  },
  contentHorizontal: {
    flexDirection: 'row'
  }
});
//# sourceMappingURL=ScrollViewGesture.js.map