import Abstract from './abstract';

const createLoadingTemplate = () => (
  '<p class="trip-events__msg">Loading...</p>'
);

export default class Loading extends Abstract {
  getTemplate() {
    return createLoadingTemplate();
  }
}
