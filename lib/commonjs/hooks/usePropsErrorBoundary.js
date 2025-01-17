"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePropsErrorBoundary = usePropsErrorBoundary;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function usePropsErrorBoundary(props) {
  _react.default.useEffect(() => {
    const {
      defaultIndex,
      data
    } = props;
    const viewCount = data.length;

    if (typeof defaultIndex === 'number' && viewCount > 0) {
      if (defaultIndex < 0 || defaultIndex >= viewCount) {
        throw Error('DefaultIndex must be in the range of data length.');
      }
    } // TODO


    if (!props.mode || props.mode === 'parallax') {
      if (!props.vertical && !props.width) {
        throw Error('`width` must be specified for vertical carousels.');
      }

      if (props.vertical && !props.height) {
        throw Error('`height` must be specified for vertical carousels.');
      }
    }
  }, [props]);
}
//# sourceMappingURL=usePropsErrorBoundary.js.map