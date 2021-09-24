const CITY_VALIDATION_ERROR = 'please specify the city';
const PRICE_VALIDATION_ERROR = 'please specify the price of the trip';

const checkCityValidity = (evt) => {
  const cityInput = evt.target.querySelector('.event__input--destination');

  cityInput.setCustomValidity(!cityInput.value ? CITY_VALIDATION_ERROR :'');

  cityInput.reportValidity();
};

const checkPriceValidity = (evt) => {
  const priceInput = evt.target.querySelector('.event__input--price');

  priceInput.setCustomValidity(!priceInput.value ? PRICE_VALIDATION_ERROR : '');

  priceInput.reportValidity();
};

const checkDateValidity = (evt) => {
  const dateFromInput = evt.target.querySelector('[name=event-start-time]');
  const dateToInput = evt.target.querySelector('[name=event-end-time]');

  dateToInput.removeAttribute('readonly');

  if (dateFromInput.value > dateToInput.value) {
    dateToInput.setCustomValidity('please enter the correct completion date');
  } else {
    dateToInput.setCustomValidity('');
  }

  dateToInput.reportValidity();
  dateFromInput.setAttribute('readonly', true);
};

export const checkFormValidity = (evt) => {
  checkCityValidity(evt);
  checkPriceValidity(evt);
  checkDateValidity(evt);
};
