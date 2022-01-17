import type { ICarouselController } from './useCarouselController';
export declare function useAutoPlay(opts: {
    autoPlay?: boolean;
    autoPlayInterval?: number;
    autoPlayReverse?: boolean;
    carouselController: ICarouselController;
    autoPlayDelay: number;
}): {
    run: () => void;
    pause: () => void;
};
