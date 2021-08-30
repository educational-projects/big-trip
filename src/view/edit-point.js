import dayjs from 'dayjs';
import { CITIES, TYPE } from '../mock/task-mock';
import SmartView from './smart';

//генерация дополнительных опций
const createAdditionalOffer = (offers) => {
  if (offers.length) {
    return  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
    ${offers.map(({title, price}) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title.split(' ').pop()}-1" type="checkbox" name="event-offer-${title.split(' ').pop()}" checked>
    <label class="event__offer-label" for="event-offer-${title.split(' ').pop()}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`).join('')}
    </div>
  </section>`;
  }
  return '';
};

//генерация фотографий места назначения
const createDestinationalPhoto = (photos) => (
  `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${photos.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`)}
  </div>
</div>`
);

//генерация опций города
const createCityList = () => (
  CITIES.map((cityName) => (
    `<option value="${cityName}"></option>`
  )).join('')
);

//генерация тайп-листа
const createEventTypeList = () => (
  TYPE.map((typeEvent) => (
    `<div class="event__type-item">
      <input id="event-type-${typeEvent.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeEvent.toLowerCase()}">
      <label class="event__type-label  event__type-label--${typeEvent.toLowerCase()}" for="event-type-taxi-1">${typeEvent}</label>
    </div>`
  )).join('')
);

const createEditPointForm = (data) => {
  const {type, basePrice, dateFrom, dateTo, destination, offer} = data;

  const dateToInDateValue = dayjs(dateTo).format('DD/MM/YY HH:mm');
  const dateFromInDateValue = dayjs(dateFrom).format('DD/MM/YY HH:mm');

  //генерация опций города
  const cityList = createCityList();

  //генерация тайп-листа
  const eventTypeList = createEventTypeList();

  //генерация дополнительных опций
  const additionalOffers = createAdditionalOffer(offer);

  const destinationPhotos = createDestinationalPhoto(destination.pictures);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type} icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${eventTypeList}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.city}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${cityList}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromInDateValue}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToInDateValue}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    ${additionalOffers}

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${destinationPhotos}
    </section>
  </section>
</form>
</li>`;
};

export default class EditEvent extends SmartView {
  constructor(point) {
    super();
    this._data = EditEvent.parsePointToData(point);

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._submitClickHandler = this._submitClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);

    this._setInnertHandlers();
  }

  getTemplate() {
    return createEditPointForm(this._data);
  }

  _typeChangeHandler(evt) {
    if(evt.target.tagName === 'INPUT') {
      evt.preventDefault();
      console.log(evt.target.value);
    }
  }

  _cityChangeHandler() {

  }

  reset(point) {
    this.updateData(
      EditEvent.parsePointToData(point),
    );
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
  }

  _submitClickHandler(evt) {
    evt.preventDefault();
    this._callback.submitClick(EditEvent.parseDataToPoin(this._data));
  }

  setSubmitClickHandler(callback) {
    this._callback.submitClick = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._submitClickHandler);
  }

  _setInnertHandlers() {
    this.getElement().querySelector('.event__type-list').addEventListener('click', this._typeChangeHandler);
  }

  restoreHandlers() {
    this._setInnertHandlers();
    this.setSubmitClickHandler(this._callback.submitClick);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
    );
  }

  static parseDataToPoin(data) {
    data = Object.assign(
      {},
      data,
    );
    return data;
  }
}
