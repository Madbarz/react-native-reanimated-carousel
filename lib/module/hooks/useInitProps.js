import React from 'react';
import { DATA_LENGTH } from '../constants';
export function useInitProps(props) {
  const {
    defaultIndex = 0,
    data: _data = [],
    loop = true,
    autoPlayInterval = 1000,
    style = {},
    panGestureHandlerProps = {},
    pagingEnabled = true,
    enableSnap = true,
    width: _width,
    height: _height
  } = props;
  const width = Math.round(_width || 0);
  const height = Math.round(_height || 0);
  const data = React.useMemo(() => {
    if (!loop) return _data;

    if (_data.length === DATA_LENGTH.SINGLE_ITEM) {
      return [_data[0], _data[0], _data[0]];
    }

    if (_data.length === DATA_LENGTH.DOUBLE_ITEM) {
      return [_data[0], _data[1], _data[0], _data[1]];
    }

    return _data;
  }, [_data, loop]);

  if (props.mode === 'vertical-stack' || props.mode === 'horizontal-stack') {
    var _props$modeConfig$sho, _props$modeConfig;

    if (!props.modeConfig) {
      props.modeConfig = {};
    }

    props.modeConfig.showLength = (_props$modeConfig$sho = (_props$modeConfig = props.modeConfig) === null || _props$modeConfig === void 0 ? void 0 : _props$modeConfig.showLength) !== null && _props$modeConfig$sho !== void 0 ? _props$modeConfig$sho : data.length - 1;
  }

  return { ...props,
    defaultIndex,
    data,
    loop,
    autoPlayInterval,
    style,
    panGestureHandlerProps,
    pagingEnabled,
    enableSnap,
    width,
    height
  };
}
//# sourceMappingURL=useInitProps.js.map