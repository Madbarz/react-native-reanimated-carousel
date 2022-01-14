import * as React from 'react';
import type { ICarouselController } from './useCarouselController';

export function useAutoPlay(opts: {
    autoPlay?: boolean;
    autoPlayInterval?: number;
    autoPlayReverse?: boolean;
    carouselController: ICarouselController;
    autoPlayDelay: number;
}) {
    const {
        autoPlay = false,
        autoPlayReverse = false,
        autoPlayInterval,
        autoPlayDelay,
        carouselController,
    } = opts;

    const timer = React.useRef<NodeJS.Timer>();

    const pause = React.useCallback(() => {
        timer.current && clearInterval(timer.current);
    }, []);

    const run = React.useCallback(() => {
        if (timer.current) {
            pause();
        }

        if (!autoPlay) {
            return;
        }

        timer.current = setInterval(() => {
            autoPlayReverse
                ? carouselController.prev()
                : carouselController.next();
        }, autoPlayDelay);
    }, [
        pause,
        autoPlay,
        autoPlayReverse,
        autoPlayInterval,
        autoPlayDelay,
        carouselController,
    ]);

    React.useEffect(() => {
        if (autoPlay) {
            run();
        } else {
            pause();
        }
        return pause;
    }, [run, pause, autoPlay]);

    return {
        run,
        pause,
    };
}
