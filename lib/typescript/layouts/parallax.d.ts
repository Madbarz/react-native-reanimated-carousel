import type { ComputedDirectionTypes } from '../types';
declare type TBaseConfig = {
    size: number;
    vertical: boolean;
};
interface ILayoutConfig {
    /**
     * When use default Layout props,this prop can be control prev/next item offset.
     * @default 100
     */
    parallaxScrollingOffset?: number;
    /**
     * When use default Layout props,this prop can be control prev/next item offset.
     * @default 0.8
     */
    parallaxScrollingScale?: number;
}
export declare type TParallaxModeProps = ComputedDirectionTypes<{
    /**
     * Carousel Animated transitions.
     */
    mode?: 'parallax';
    modeConfig?: ILayoutConfig;
}>;
export declare function parallaxLayout(baseConfig: TBaseConfig, modeConfig?: ILayoutConfig): (value: number) => {
    transform: ({
        translateY: number;
        translateX?: undefined;
        scale?: undefined;
    } | {
        translateX: number;
        translateY?: undefined;
        scale?: undefined;
    } | {
        scale: number;
        translateY?: undefined;
        translateX?: undefined;
    })[];
    zIndex: number;
};
export {};
