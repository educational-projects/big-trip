const checkCityValidity = (evt) => {
  const cityInput = evt.target.querySelector('.event__input--destination');

  if (!cityInput.value) {
    cityInput.setCustomValidity('please specify the city');
  } else {
    cityInput.setCustomValidity('');
  }

  cityInput.reportValidity();
};

const checkPriceValidity = (evt) => {
  const priceInput = evt.target.querySelector('.event__input--price');

  if (!priceInput.value) {
    priceInput.setCustomValidity('please specify the price of the trip');
  } else {
    priceInput.setCustomValidity('');
  }

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
