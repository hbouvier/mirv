const exponentiallyWeightedMovingAverge =
  sampleCountWindow =>
  (average, sample) => (average - (average / sampleCountWindow)) + (sample / sampleCountWindow);

export { exponentiallyWeightedMovingAverge };
export default exponentiallyWeightedMovingAverge;
