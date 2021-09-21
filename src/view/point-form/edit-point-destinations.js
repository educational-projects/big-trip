export const createDestinationTemplate = (destination) => {
  const {description, pictures} = destination;

  const createDestinationPhoto = () => {
    if (pictures !== 0) {
      return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map(({src, descriptionPhoto}) => `<img class="event__photo" src="${src}" alt="${descriptionPhoto}">`).join('')}
    </div>
  </div>`;}
  };

  if (destination.name) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${createDestinationPhoto()}
  </section>`;
  }
  return '';
};
