import AbstractView from './abstract';
import { FilterType } from '../const';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createEmptyList = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">${noPointTextValue}</p>`);
};

export default class EmptyList extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createEmptyList(this._data);
  }
}
