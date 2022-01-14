import * as React from 'react';
import Animated from 'react-native-reanimated';
export interface IIndexController {
    length: number;
    sharedPreIndex: React.MutableRefObject<number>;
    sharedIndex: React.MutableRefObject<number>;
    index: Animated.SharedValue<number>;
    computedIndex: () => void;
    getCurrentIndex: () => number;
}
export declare function useIndexController(opts: {
    handlerOffsetX: Animated.SharedValue<number>;
    loop: boolean;
    originalLength: number;
    length: number;
    size: number;
    onChange: (index: number) => void;
}): IIndexController;
