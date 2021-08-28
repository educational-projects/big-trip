import AbstractView from './abstract';
import { SortType } from '../const';

const createSortingTemplate = (sortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.DAY}" type="radio" name="trip-sort" value="sort-day" ${sortType === SortType.DAY ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-day">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.EVENT}" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.TIME}" type="radio" name="trip-sort" value="sort-time" ${sortType === SortType.TIME ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-time">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.PRICE}" type="radio" name="trip-sort" value="sort-price" ${sortType === SortType.PRICE ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-price">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.OFFERS}" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
  </div>
</form>`
);

export default class Sorting extends AbstractView {
  constructor(sortType) {
    super();
    this._sortType = sortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler );
  }

  getTemplate() {
    return createSortingTemplate(this._sortType);
  }
}
