import { FilterType } from '../const';

const currentDay = new Date ();

const IsPointsAllFilters = (point) => point.dateFrom < currentDay && point.dateTo > currentDay;

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dateFrom >= currentDay || IsPointsAllFilters(point)),
  [FilterType.PAST]: (points) => points.filter((point) => point.dateTo < currentDay || IsPointsAllFilters(point)),
};
