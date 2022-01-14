import type { TCarouselProps } from '../types';
export declare type TInitializeCarouselProps<T> = TCarouselProps<T> & {
    defaultIndex: Required<TCarouselProps>['defaultIndex'];
    loop: Required<TCarouselProps>['loop'];
    width: Required<TCarouselProps>['width'];
    height: Required<TCarouselProps>['height'];
};
export declare function useInitProps<T>(props: TCarouselProps<T>): TInitializeCarouselProps<T>;
