import TripEventView from '../view/trip-event';
import EditEventView from '../view/edit-point';
import { render, RenderPosition, replace } from '../utils/redner';

export default class Point {
  constructor(pointListContainer) {
    this._pointListContainer = pointListContainer;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handlePointClick = this._handlePointClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(task) {
    this._task = task;

    this._pointComponent = new TripEventView(task);
    this._pointEditComponent = new EditEventView(task);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditComponent.setCloseClickHandler(this._handlePointClick);
    this._pointEditComponent.setSubmitClickHandler(this._handleFormSubmit);

    render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handlePointClick() {
    this._replaceFormToPoint();
  }

  _handleFormSubmit() {
    this._replaceFormToPoint();
  }
}
