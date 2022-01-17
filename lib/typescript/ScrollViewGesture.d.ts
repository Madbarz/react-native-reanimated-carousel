import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
interface Props {
    size: number;
    infinite?: boolean;
    onScrollEnd?: () => void;
    onScrollBegin?: () => void;
    style?: StyleProp<ViewStyle>;
    translation: Animated.SharedValue<number>;
}
export declare const ScrollViewGesture: React.FC<Props>;
export {};
