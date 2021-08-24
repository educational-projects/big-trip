import RouteAndPriceView from '../view/route-and-price';
import TripEventListView from '../view/trip-event-list';
import SortingView from '../view/sorting';
import EmptyListView from '../view/empty-list';
import { render, RenderPosition } from '../utils/redner';
import { updateItem } from '../utils/common';
import PointPresenter from './point';

export default class Trip {
  constructor(tripContainer, routContainer) {
    this._tripContainer = tripContainer;
    this._routContainer = routContainer;
    this._pointPresenter = new Map();

    this._tripListComponent = new TripEventListView();
    this._sortComponent = new SortingView();
    this._noTripComponent = new EmptyListView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(tripTasks) {
    this._tripTasks = tripTasks.slice();

    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._tripTasks = updateItem(this._tripTasks, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderRoutAndPrie() {
    //метод для рендеринга маршрута и стоймости
    render(this._routContainer, new RouteAndPriceView(this._tripTasks), RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    //метод для рендеринга сортировки
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(event) {
    //метод для рендеринга точки маршрута
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(event);
    this._pointPresenter.set(event.id, pointPresenter);
  }

  _renderPoints() {
    //метод для рендеринга всех точек маршрута
    this._tripTasks
      .forEach((EventTask) => this._renderPoint(EventTask));
  }

  _renderTripEventList() {
    //метод для рендеринга обертки точек маршрута + все точки
    render(this._tripContainer, this._tripListComponent, RenderPosition.BEFOREEND);
    this._renderPoints();
  }

  _renderNoTrip() {
    //метод для рендеринга заглшки
    render(this._tripContainer, this._noTripComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (!this._tripTasks.length) {
      this._renderNoTrip();
      return;
    }

    this._renderRoutAndPrie();
    this._renderSort();
    this._renderTripEventList();
  }
}
