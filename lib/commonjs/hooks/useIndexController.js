"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIndexController = useIndexController;

var React = _interopRequireWildcard(require("react"));

var _reactNativeReanimated = require("react-native-reanimated");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function useIndexController(opts) {
  const {
    originalLength,
    length,
    size,
    loop,
    handlerOffsetX,
    onChange
  } = opts;
  const index = (0, _reactNativeReanimated.useSharedValue)(0); // The Index displayed to the user

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
  return {
    index,
    length,
    sharedIndex,
    sharedPreIndex,
    computedIndex,
    getCurrentIndex
  };
}
//# sourceMappingURL=useIndexController.js.map