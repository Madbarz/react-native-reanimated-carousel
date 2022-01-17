"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCommonVariables = useCommonVariables;

var _react = _interopRequireDefault(require("react"));

var _reactNativeReanimated = require("react-native-reanimated");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useCommonVariables(props) {
  const {
    vertical,
    height,
    width,
    data,
    defaultIndex
  } = props;
  const size = vertical ? height : width;
  const validLength = data.length - 1;
  const defaultHandlerOffsetX = -Math.abs(defaultIndex * size);
  const handlerOffsetX = (0, _reactNativeReanimated.useSharedValue)(defaultHandlerOffsetX);

  _react.default.useEffect(() => {
    handlerOffsetX.value = defaultHandlerOffsetX;
  }, [vertical, handlerOffsetX, defaultHandlerOffsetX]);

  return {
    size,
    validLength,
    handlerOffsetX
  };
}
//# sourceMappingURL=useCommonVariables.js.map