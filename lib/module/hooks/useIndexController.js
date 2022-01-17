import * as React from 'react';
import { useSharedValue } from 'react-native-reanimated';
export function useIndexController(opts) {
  const {
    originalLength,
    length,
    size,
    loop,
    handlerOffsetX,
    onChange
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