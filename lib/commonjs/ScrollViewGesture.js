"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollViewGesture = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _constants = require("./constants");

var _store = require("./store");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
  } = _react.default.useContext(_store.CTX);

  const {
    translation,
    onScrollBegin,
    onScrollEnd,
    size
  } = props;
  const maxPage = data.length;
  const isHorizontal = (0, _reactNativeReanimated.useDerivedValue)(() => !vertical, [vertical]);
  const touching = (0, _reactNativeReanimated.useSharedValue)(false);
  const scrollEndTranslation = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollEndVelocity = (0, _reactNativeReanimated.useSharedValue)(0);

  const _withSpring = _react.default.useCallback((toValue, onFinished) => {
    'worklet';

    return (0, _reactNativeReanimated.withTiming)(toValue, {
      duration: autoPlayInterval,
      easing: _constants.Easing.easeOutQuart
    }, isFinished => {
      if (isFinished) {
        onFinished === null || onFinished === void 0 ? void 0 : onFinished();
      }
    });
  }, [autoPlayInterval]);

  const endWithSpring = _react.default.useCallback(onFinished => {
    'worklet';

    const origin = translation.value;
    const velocity = scrollEndVelocity.value;

    if (!pagingEnabled) {
      if (enableSnap) {
        const nextPage = Math.round((origin + velocity * 0.4) / size) * size;
        translation.value = _withSpring(nextPage, onFinished);
        return;
      }

      translation.value = (0, _reactNativeReanimated.withDecay)({
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

  const resetBoundary = _react.default.useCallback(() => {
    'worklet';

    const onFinish = isFinished => {
      if (isFinished) {
        touching.value = false;
        onScrollEnd && (0, _reactNativeReanimated.runOnJS)(onScrollEnd)();
      }
    };

    const activeDecay = () => {
      touching.value = true;
      translation.value = (0, _reactNativeReanimated.withDecay)({
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

  (0, _reactNativeReanimated.useAnimatedReaction)(() => translation.value, () => {
    if (!pagingEnabled) {
      resetBoundary();
    }
  }, [pagingEnabled]);
  const panGestureEventHandler = (0, _reactNativeReanimated.useAnimatedGestureHandler)({
    onStart: (_, ctx) => {
      touching.value = true;
      (0, _reactNativeReanimated.cancelAnimation)(translation);
      onScrollBegin && (0, _reactNativeReanimated.runOnJS)(onScrollBegin)();
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
      endWithSpring(() => onScrollEnd && (0, _reactNativeReanimated.runOnJS)(onScrollEnd)());

      if (!infinite) {
        touching.value = false;
      }
    }
  }, [pagingEnabled, isHorizontal.value, infinite, maxPage, size, enableSnap]);

  const directionStyle = _react.default.useMemo(() => {
    return vertical ? styles.contentHorizontal : styles.contentVertical;
  }, [vertical]);

  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.container, directionStyle, style]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.PanGestureHandler, _extends({}, panGestureHandlerProps, {
    onGestureEvent: panGestureEventHandler
  }), props.children));
};

const ScrollViewGesture = IScrollViewGesture;
exports.ScrollViewGesture = ScrollViewGesture;

const styles = _reactNative.StyleSheet.create({
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