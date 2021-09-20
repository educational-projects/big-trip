const cityValidity = (evt) => {
  const cityInput = evt.target.querySelector('.event__input--destination');

  if (!cityInput.value) {
    cityInput.setCustomValidity('please specify the city');
  } else {
    cityInput.setCustomValidity('');
  }

  cityInput.reportValidity();
};

const priceValidity = (evt) => {
  const priceInput = evt.target.querySelector('.event__input--price');

  if (!priceInput.value) {
    priceInput.setCustomValidity('please specify the price of the trip');
  } else {
    priceInput.setCustomValidity('');
  }

  priceInput.reportValidity();
};

const dateValidity = (evt) => {
  const dateFromInput = evt.target.querySelector('[name=event-start-time]');
  const dateToInput = evt.target.querySelector('[name=event-end-time]');
  // const priceInput = evt.target.querySelector('.event__input--price');

  if (dateFromInput.value > dateToInput.value) {
    dateToInput.setCustomValidity('no no no');
  } else {
    dateToInput.setCustomValidity('');
  }

  dateToInput.reportValidity();
};

export const formValidity = (evt) => {
  cityValidity(evt);
  priceValidity(evt);
  dateValidity(evt);
};
