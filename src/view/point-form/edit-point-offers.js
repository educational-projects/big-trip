//генерация дополнительных опций
export const createAdditionalOffer = (checkedOffers, availableOffers, id, isDisabled) => {
  const getOffersChecked = (offerTitle) => checkedOffers
    .map(({title}) => title.toLowerCase())
    .includes(offerTitle.toLowerCase()) ? 'checked' : '' ;

  if (availableOffers.length) {
    return  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
    ${availableOffers.map(({title, price}) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" data-title="${title.toLowerCase()}" data-price="${price}" id="event-offer-${title}-${id}" type="checkbox" name="event-offer-${title}" ${getOffersChecked(title)} ${isDisabled? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${title}-${id}">
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
