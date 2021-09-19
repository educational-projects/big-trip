import dayjs from 'dayjs';
import { FilterType } from '../const';

const currentDay = dayjs();

const IsPointsAllFilters = (point) => dayjs(point.dateFrom) < currentDay && dayjs(point.dateTo) > currentDay;

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom) >= currentDay || IsPointsAllFilters(point)),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo) < currentDay || IsPointsAllFilters(point)),
};
