import React from 'react';
import Animated from 'react-native-reanimated';
import type { ComputedDirectionTypes } from 'src/types';
import type { IVisibleRanges } from '../hooks/useVisibleRanges';
export declare const ParallaxLayout: React.FC<ComputedDirectionTypes<{
    loop?: boolean;
    parallaxScrollingOffset?: number;
    parallaxScrollingScale?: number;
    handlerOffsetX: Animated.SharedValue<number>;
    index: number;
    data: unknown[];
    visibleRanges: IVisibleRanges;
}>>;
