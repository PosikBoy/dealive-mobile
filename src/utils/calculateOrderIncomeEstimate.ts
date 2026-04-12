const AVERAGE_SPEED_KMH = 12;
const MIN_DELTA_KM = 0.1;
const MIN_TIME_HOURS = 0.167; // ~10 minutes

export interface IOrderIncomeEstimate {
  incomePerHour: number;
  deltaDistance: number;
  safeTime: number;
}

/**
 * Calculates estimated income per hour for an order
 * given its price, the new total route distance, and the current route distance.
 */
export const calculateOrderIncomeEstimate = (
  price: number,
  newRouteDistance: number,
  currentRouteDistance: number,
): IOrderIncomeEstimate => {
  const deltaDistance = newRouteDistance - currentRouteDistance;
  const safeDelta = Math.max(deltaDistance, MIN_DELTA_KM);
  const timeHours = safeDelta / AVERAGE_SPEED_KMH;
  const safeTime = Math.max(timeHours, MIN_TIME_HOURS);
  const incomePerHour = Number((price / safeTime).toFixed(0));

  return { incomePerHour, deltaDistance, safeTime };
};
