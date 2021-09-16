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

export const formValidity = (evt) => {
  cityValidity(evt);
  priceValidity(evt);
};
