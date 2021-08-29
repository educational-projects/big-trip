import dayjs from 'dayjs';
import AbstractView from './abstract';

const createTripEventTemplate = (task) => {
  const {type, basePrice, dateFrom, dateTo, destination, isFavorite, offer} = task;

  const dateToInHours = dayjs(dateTo).format('HH:mm');
  const dateFromInHours = dayjs(dateFrom).format('HH:mm');
  const dateFromInMonthAndDay = dayjs(dateFrom).format('MMM D');
  const dateFromInDateTime = dayjs(dateFrom).format('YYYY-MM-DD');
  const dateToInDatetime = dayjs(dateTo).format('YYYY-MM-DDTHH:mm');
  const dateFromInDatetime = dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');

  const getDiffTime = (date1, date2) => {
    const dateEnd = dayjs(date1);
    const dateStart = dayjs(date2);
    const daysDiff = dateEnd.diff(dateStart, 'd');
    const hoursDiff = dateEnd.diff(dateStart, 'h');
    const minutesDiff = dateEnd.diff(dateStart, 'm');

    const renderDiffTime = (time, text) => time !== 0 ? `${time}${text}` : '';

    return `${renderDiffTime(daysDiff, 'D')} ${renderDiffTime(hoursDiff - daysDiff * 24, 'H')} ${renderDiffTime(minutesDiff - hoursDiff * 60, 'M')}`;
  };

  const getTimeWay = getDiffTime(dateTo, dateFrom);

  //проверка на фаворитность
  const checkFavorite = () => isFavorite ? 'event__favorite-btn--active' : '';

  //генерация дополнительных опций
  const offersPoint = offer.map(({title, price}) => (
    `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`
  )).join('');

  return  `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateFromInDateTime}">${dateFromInMonthAndDay}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type} icon">
    </div>
    <h3 class="event__title">${type} to ${destination.city}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFromInDatetime}">${dateFromInHours}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateToInDatetime}">${dateToInHours}</time>
      </p>
      <p class="event__duration">${getTimeWay}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersPoint}
    </ul>
    <button class="event__favorite-btn ${checkFavorite()}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class TripEvent extends AbstractView {
  constructor(task) {
    super();
    this._task = task;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventTemplate(this._task);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
