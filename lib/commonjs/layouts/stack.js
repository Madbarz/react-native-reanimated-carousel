"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.horizontalStackLayout = horizontalStackLayout;
exports.useHorizontalStackLayout = useHorizontalStackLayout;
exports.verticalStackLayout = verticalStackLayout;

var _react = require("react");

var _reactNative = require("react-native");

var _reactNativeReanimated = require("react-native-reanimated");

const screen = _reactNative.Dimensions.get('window');

function horizontalStackLayout(modeConfig = {}) {
  return _value => {
    'worklet';

    const {
      showLength,
      snapDirection = 'left',
      moveSize = screen.width,
      stackInterval = 18,
      scaleInterval = 0.04,
      opacityInterval = 0.1,
      rotateZDeg = 30
    } = modeConfig;
    const transform = [];
    const {
      validLength,
      value,
      inputRange
    } = getCommonVariables({
      showLength: showLength,
      value: _value,
      snapDirection
    });
    const {
      zIndex,
      opacity
    } = getCommonStyles({
      validLength,
      value,
      opacityInterval,
      snapDirection
    });
    const styles = {
      transform,
      zIndex,
      opacity
    };
    let translateX;
    let scale;
    let rotateZ;

    if (snapDirection === 'left') {
      translateX = (0, _reactNativeReanimated.interpolate)(value, inputRange, [-moveSize, 0, validLength * stackInterval], _reactNativeReanimated.Extrapolate.CLAMP);
      scale = (0, _reactNativeReanimated.interpolate)(value, inputRange, [1, 1, 1 - validLength * scaleInterval], _reactNativeReanimated.Extrapolate.CLAMP);
      rotateZ = `${(0, _reactNativeReanimated.interpolate)(value, inputRange, [-rotateZDeg, 0, 0], _reactNativeReanimated.Extrapolate.CLAMP)}deg`;
    } else if (snapDirection === 'right') {
      translateX = (0, _reactNativeReanimated.interpolate)(value, inputRange, [-validLength * stackInterval, 0, moveSize], _reactNativeReanimated.Extrapolate.CLAMP);
      scale = (0, _reactNativeReanimated.interpolate)(value, inputRange, [1 - validLength * scaleInterval, 1, 1], _reactNativeReanimated.Extrapolate.CLAMP);
      rotateZ = `${(0, _reactNativeReanimated.interpolate)(value, inputRange, [0, 0, rotateZDeg], _reactNativeReanimated.Extrapolate.CLAMP)}deg`;
    }

    transform.push({
      translateX: translateX
    }, {
      scale: scale
    }, {
      rotateZ: rotateZ
    });
    return styles;
  };
}

function useHorizontalStackLayout(customAnimationConfig = {}, customConfig = {}) {
  const config = (0, _react.useMemo)(() => ({
    type: customAnimationConfig.snapDirection === 'right' ? 'negative' : 'positive',
    viewCount: customAnimationConfig.showLength,
    ...customConfig
  }), [customAnimationConfig, customConfig]);
  return {
    layout: horizontalStackLayout(customAnimationConfig),
    config
  };
}

function verticalStackLayout(modeConfig = {}) {
  return _value => {
    'worklet';

    const {
      showLength,
      snapDirection = 'left',
      moveSize = screen.width,
      stackInterval = 18,
      scaleInterval = 0.04,
      opacityInterval = 0.1,
      rotateZDeg = 30
    } = modeConfig;
    const transform = [];
    const {
      validLength,
      value,
      inputRange
    } = getCommonVariables({
      showLength: showLength,
      value: _value,
      snapDirection
    });
    const {
      zIndex,
      opacity
    } = getCommonStyles({
      validLength,
      value,
      opacityInterval,
      snapDirection
    });
    const styles = {
      transform,
      zIndex,
      opacity
    };
    let translateX;
    let scale;
    let rotateZ;
    let translateY;

    if (snapDirection === 'left') {
      translateX = (0, _reactNativeReanimated.interpolate)(value, inputRange, [-moveSize, 0, 0], _reactNativeReanimated.Extrapolate.CLAMP);
      scale = (0, _reactNativeReanimated.interpolate)(value, inputRange, [1, 1, 1 - validLength * scaleInterval], _reactNativeReanimated.Extrapolate.CLAMP);
      rotateZ = `${(0, _reactNativeReanimated.interpolate)(value, inputRange, [-rotateZDeg, 0, 0], _reactNativeReanimated.Extrapolate.CLAMP)}deg`;
      translateY = (0, _reactNativeReanimated.interpolate)(value, inputRange, [0, 0, validLength * stackInterval], _reactNativeReanimated.Extrapolate.CLAMP);
    } else if (snapDirection === 'right') {
      translateX = (0, _reactNativeReanimated.interpolate)(value, inputRange, [0, 0, moveSize], _reactNativeReanimated.Extrapolate.CLAMP);
      scale = (0, _reactNativeReanimated.interpolate)(value, inputRange, [1 - validLength * scaleInterval, 1, 1], _reactNativeReanimated.Extrapolate.CLAMP);
      rotateZ = `${(0, _reactNativeReanimated.interpolate)(value, inputRange, [0, 0, rotateZDeg], _reactNativeReanimated.Extrapolate.CLAMP)}deg`;
      translateY = (0, _reactNativeReanimated.interpolate)(value, inputRange, [validLength * stackInterval, 0, 0], _reactNativeReanimated.Extrapolate.CLAMP);
    }

    transform.push({
      translateX: translateX
    }, {
      scale: scale
    }, {
      rotateZ: rotateZ
    }, {
      translateY: translateY
    });
    return styles;
  };
}

function getCommonVariables(opts) {
  'worklet';

  const {
    showLength,
    value: _value,
    snapDirection
  } = opts;

  function easeInOutCubic(v) {
    return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
  }

  const page = Math.floor(Math.abs(_value));
  const diff = Math.abs(_value) % 1;
  const value = _value < 0 ? -(page + easeInOutCubic(diff)) : page + easeInOutCubic(diff);
  const validLength = showLength - 1;
  let inputRange;

  if (snapDirection === 'left') {
    inputRange = [-1, 0, validLength];
  } else if (snapDirection === 'right') {
    inputRange = [-validLength, 0, 1];
  } else {
    throw Error('snapDirection must be set to either left or right');
  }

  return {
    inputRange,
    validLength,
    value
  };
}

function getCommonStyles(opts) {
  'worklet';

  const {
    snapDirection,
    validLength,
    value,
    opacityInterval
  } = opts;
  let zIndex;
  let opacity;

  if (snapDirection === 'left') {
    zIndex = Math.floor((0, _reactNativeReanimated.interpolate)(value, [-1.5, -1, -1 + Number.MIN_VALUE, 0, validLength], [Number.MIN_VALUE, validLength, validLength, validLength - 1, -1]) * 10000) / 100;
    opacity = (0, _reactNativeReanimated.interpolate)(value, [-1, 0, validLength - 1, validLength], [0.25, 1, 1 - (validLength - 1) * opacityInterval, 0.25]);
  } else if (snapDirection === 'right') {
    zIndex = Math.floor((0, _reactNativeReanimated.interpolate)(value, [-validLength, 0, 1 - Number.MIN_VALUE, 1, 1.5], [1, validLength - 1, validLength, validLength, Number.MIN_VALUE]) * 10000) / 100;
    opacity = (0, _reactNativeReanimated.interpolate)(value, [-validLength, 1 - validLength, 0, 1], [0.25, 1 - (validLength - 1) * opacityInterval, 1, 0.25]);
  } else {
    throw Error('snapDirection must be set to either left or right');
  }

  return {
    zIndex,
    opacity
  };
}
//# sourceMappingURL=stack.js.map