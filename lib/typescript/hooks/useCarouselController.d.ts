import React from 'react';
import type Animated from 'react-native-reanimated';
interface IOpts {
    loop: boolean;
    size: number;
    handlerOffsetX: Animated.SharedValue<number>;
    disable?: boolean;
    duration?: number;
    originalLength: number;
    length: number;
    onScrollBegin?: () => void;
    onScrollEnd?: () => void;
    onChange: (index: number) => void;
}
export interface ICarouselController {
    length: number;
    index: Animated.SharedValue<number>;
    sharedIndex: React.MutableRefObject<number>;
    sharedPreIndex: React.MutableRefObject<number>;
    prev: () => void;
    next: () => void;
    computedIndex: () => void;
    getCurrentIndex: () => number;
    to: (index: number, animated?: boolean) => void;
}
export declare function useCarouselController(opts: IOpts): ICarouselController;
export {};
