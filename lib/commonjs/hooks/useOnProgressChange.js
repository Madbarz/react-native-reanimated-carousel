"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useOnProgressChange = useOnProgressChange;

var _reactNativeReanimated = require("react-native-reanimated");

var _constants = require("../constants");

function useOnProgressChange(opts) {
  const {
    offsetX,
    data,
    size,
    onProgressChange
  } = opts;
  (0, _reactNativeReanimated.useAnimatedReaction)(() => offsetX.value, _value => {
    let value = _value;

    if (data.length === _constants.DATA_LENGTH.SINGLE_ITEM) {
      value = value % size;
    }

    if (data.length === _constants.DATA_LENGTH.DOUBLE_ITEM) {
      value = value % (size * 2);
    }

    let absoluteProgress = Math.abs(value / size);

    if (value > 0) {
      absoluteProgress = data.length - absoluteProgress;
    }

    !!onProgressChange && (0, _reactNativeReanimated.runOnJS)(onProgressChange)(value, absoluteProgress);
  }, [onProgressChange, data]);
}
//# sourceMappingURL=useOnProgressChange.js.map