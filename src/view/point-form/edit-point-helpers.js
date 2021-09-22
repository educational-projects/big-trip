export const createEventRollupButtonTemplate = (isNewEvent, isDisabled) => (
  `${!isNewEvent ? `<button class="event__rollup-btn" type="button" ${isDisabled? 'disabled' : ''}>
    <span class="visually-hidden">Open event</span>
  </button>`: ''}`
);

export const createContentButton = (isNewEvent, isDeleting) => {
  const editButton = isDeleting ? 'Deleting...' : 'Delete';
  return `${isNewEvent ? 'Cancel' : editButton}`;
};

//генерация опций города
export const createCityList = (destinations) => (
  destinations.map(({name}) => (
    `<option value="${name}"></option>`
  )).join('')
);

//генерация тайп-листа
export const createEventTypeList = (offers ,id) => (
  offers.map(({type}) => `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type}</label>
    </div>`).join('')
);
