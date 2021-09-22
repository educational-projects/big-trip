import dayjs from 'dayjs';
import { getFirstLetterInCapitalLetters } from '../../utils/common';
import flatpickr from 'flatpickr';
import SmartView from '../smart';
import { formValidity } from '../../utils/form-validity';
import { createAdditionalOffer } from './edit-point-offers';
import { createDestinationTemplate } from './edit-point-destinations';

import '../../../node_modules/flatpickr/dist//flatpickr.min.css';
import { createCityList, createContentButton, createEventRollupButtonTemplate, createEventTypeList } from './edit-point-helpers';

const BLANK_POINT = {
  type: 'taxi',
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  offer: [],
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  isFavorite: false,
};

const createEditPointForm = (data, AllOffers, Alldestinations, isNewEvent) => {
  const {type, basePrice, dateFrom, dateTo, destination, offer, id, isDisabled, isSaving, isDeleting} = data;

  const availableOffersByType = AllOffers.find((offerdd) => offerdd.type === type.toLowerCase()).offers;

  const dateToInDateValue = dayjs(dateTo).format('DD/MM/YY HH:mm');
  const dateFromInDateValue = dayjs(dateFrom).format('DD/MM/YY HH:mm');

  const cityList = createCityList(Alldestinations);

  const eventTypeList = createEventTypeList(AllOffers ,id);

  const additionalOffers = createAdditionalOffer(offer, availableOffersByType, id, isDisabled);

  const destinationList = createDestinationTemplate(destination);

  const eventRollupButton = createEventRollupButtonTemplate(isNewEvent, isDisabled);

  const buttonText = createContentButton(isNewEvent, isDeleting);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type} icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled? 'disabled' : ''}>

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${eventTypeList}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}" ${isDisabled? 'disabled' : ''}>
      <datalist id="destination-list-${id}">
        ${cityList}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFromInDateValue}" ${isDisabled? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateToInDateValue}" ${isDisabled? 'disabled' : ''}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}" ${isDisabled? 'disabled' : ''}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled? 'disabled' : ''}>${isSaving? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled? 'disabled' : ''}>${buttonText}</button>
    ${eventRollupButton}
  </header>
  <section class="event__details">
    ${additionalOffers}

    ${destinationList}
  </section>
</form>
</li>`;
};

export default class EditEvent extends SmartView {
  constructor(data) {
    super();
    const {point = BLANK_POINT, offers, destinations} = data;
    this._data = EditEvent.parsePointToData(point);

    this._newPoint = !data.point;
    this._offers = offers;
    this._destinations = destinations;

    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._submitClickHandler = this._submitClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._DateFromChangeHandler = this._DateFromChangeHandler.bind(this);
    this._DateToChangeHandler = this._DateToChangeHandler.bind(this);
    this._offersSelectedHandler = this._offersSelectedHandler.bind(this);

    this._setInnertHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    const isNewEvent = (this._newPoint);

    return createEditPointForm(this._data, this._offers, this._destinations, isNewEvent);
  }

  _typeChangeHandler(evt) {
    if (evt.target.tagName === 'INPUT') {
      this.updateData(
        {
          type: evt.target.value,
          offer: [],
        },
      );
    }
  }

  _cityChangeHandler(evt) {
    const inputValue = getFirstLetterInCapitalLetters(evt.target.value);
    const cityList = this._destinations.map((destination) => destination.name);
    const isCityExist = cityList.includes(inputValue);

    evt.preventDefault();
    if (inputValue.length <= 0 || isCityExist === false) {
      evt.target.setCustomValidity('please select a city from the list');
    } else {
      evt.target.setCustomValidity('');
      this.updateData(
        {
          destination: {
            description: this._destinations.find((destination) => destination.name === inputValue).description,
            name: inputValue,
            pictures: this._destinations.find((destination) => destination.name === inputValue).pictures,
          },
        },
      );
    }
    evt.target.reportValidity();
  }

  _priceChangeHandler(evt) {
    const priceInput = evt.target.value;
    const isNotNumber = isNaN(priceInput);
    evt.preventDefault();
    if (priceInput <= 0 || isNotNumber) {
      evt.target.setCustomValidity('please use only positive numbers');
    } else {
      evt.target.setCustomValidity('');
      this.updateData(
        {
          basePrice: + evt.target.value,
        },
        true,
      );
    }
    evt.target.reportValidity();
  }

  _offersSelectedHandler(evt) {
    evt.preventDefault();
    const checkInputs = this.getElement().querySelectorAll('.event__offer-checkbox');
    const currentOffers = [];

    checkInputs.forEach((offer) => {
      if(offer.checked) {
        currentOffers.push({
          title: offer.dataset.title,
          price: Number(offer.dataset.price),
        });
      }
    });

    this.updateData({
      offer: currentOffers,
    });
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if(this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }
  }

  reset(point) {
    this.updateData(
      EditEvent.parsePointToData(point),
    );
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditEvent.parseDataToPoin(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;

    if (this.getElement().querySelector('.event__rollup-btn')) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
    }
  }

  _setDatepicker() {
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  _setDatepickerFrom() {
    this._datepickerFrom = flatpickr(
      this.getElement().querySelector('[name = "event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._data.dateFrom,
        onChange: this._DateFromChangeHandler,
      },
    );
  }

  _setDatepickerTo() {
    this._datepickerTo = flatpickr(
      this.getElement().querySelector('[name = "event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minDate: this._data.dateFrom,
        defaultDate: this._data.dateTo,
        onChange: this._DateToChangeHandler,
      },
    );
  }

  _DateFromChangeHandler([userDate]) {
    this.updateData(
      {
        dateFrom: userDate,
      },
    );
  }

  _DateToChangeHandler([userDate]) {
    this.updateData(
      {
        dateTo: userDate,
      },
    );
  }

  _submitClickHandler(evt) {
    evt.preventDefault();
    formValidity(evt);

    if(evt.target.checkValidity()) {
      this._callback.submitClick(EditEvent.parseDataToPoin(this._data));
    }
  }

  setSubmitClickHandler(callback) {
    this._callback.submitClick = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._submitClickHandler);
  }

  _setInnertHandlers() {
    this.getElement().querySelector('.event__type-list').addEventListener('click', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceChangeHandler);
    this.getElement().querySelector('.event__section').addEventListener('change', this._offersSelectedHandler);
    if (this.getElement().querySelector('.event__rollup-btn')) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
    }
  }

  restoreHandlers() {
    this._setInnertHandlers();
    this._setDatepicker();
    this.setSubmitClickHandler(this._callback.submitClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoin(data) {
    data = Object.assign(
      {},
      data,
    );

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
