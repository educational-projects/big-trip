import AbstractView from './abstract';
import { SortType } from '../const';

const createSortingTemplate = (sortType) => {
  const sortTypes = Object.values(SortType);
  const getDisabled = (disabled) => disabled ? 'disabled' : '';
  const getChecked = (type) => sortType === type ? 'checked' : '';

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${sortTypes.map(({name, disabled}) => `<div class="trip-sort__item  trip-sort__item--${name}">
  <input id="sort-${name}" class="trip-sort__input  visually-hidden" data-sort-type="${name}" type="radio" name="trip-sort" value="sort-${name}" ${getChecked(name)} ${getDisabled(disabled)}>
  <label class="trip-sort__btn" for="sort-${name}">${name}</label>
</div>`).join('')}
</form>`;};

export default class Sorting extends AbstractView {
  constructor(sortType) {
    super();
    this._sortType = sortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler );
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
