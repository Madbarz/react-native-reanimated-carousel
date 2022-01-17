"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAutoPlay = useAutoPlay;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function useAutoPlay(opts) {
  const {
    autoPlay = false,
    autoPlayReverse = false,
    autoPlayInterval,
    autoPlayDelay,
    carouselController
  } = opts;
  const timer = React.useRef();
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
      autoPlayReverse ? carouselController.prev() : carouselController.next();
    }, autoPlayDelay);
  }, [pause, autoPlay, autoPlayReverse, autoPlayInterval, autoPlayDelay, carouselController]);
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
    pause
  };
}
//# sourceMappingURL=useAutoPlay.js.map