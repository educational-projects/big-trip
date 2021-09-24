import { MenuItem } from '../const';
import AbstractView from './abstract';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MenuItem.TABLE}</a>
  <a class="trip-tabs__btn" href="#">${MenuItem.STATS}</a>
  </nav>`
);

export default class SiteMenu extends AbstractView {
  constructor(points) {
    super();
    this._points = points;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._points);
  }

  setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    items.forEach((item) => {
      (item.text === menuItem) ? item.classList.add('trip-tabs__btn--active') : item.classList.remove('trip-tabs__btn--active');
    });
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.text);
  }
}
