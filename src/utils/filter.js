import { FilterType } from '../const';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => point),
  [FilterType.PAST]: (points) => points.filter((point) => point),
};
