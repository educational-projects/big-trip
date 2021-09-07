import RouteAndPriceView from '../view/route-and-price';
import TripEventListView from '../view/trip-event-list';
import SortingView from '../view/sorting';
import EmptyListView from '../view/empty-list';
import { remove, render, RenderPosition } from '../utils/redner';
import PointPresenter from './point';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import { sortPointDay, sortPointPrice, sortPointTime } from '../utils/point';
import { filter } from '../utils/filter';

export default class Trip {
  constructor(tripContainer, routContainer, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._routContainer = routContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY.name;
    this._filterType = FilterType.EVERYTHING;

    this._sortComponent = null;
    this._routAndPriceComponent = null;
    this._noTripComponent = null;

    this._tripListComponent = new TripEventListView();
    // this._noTripComponent = new EmptyListView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[this._filterType](points);

    switch(this._currentSortType) {
      case SortType.PRICE.name:
        return filtredPoints.sort(sortPointPrice);
      case SortType.TIME.name:
        return filtredPoints.sort(sortPointTime);
    }

    return filtredPoints.sort(sortPointDay);
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }

  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        //обновить часть проекта
        break;
      case UpdateType.MAJOR:
        //обновить проект полностью
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if(this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._renderSort();
    this._clearTripEventList();
    this._renderTripEventList();
  }

  _renderRoutAndPrice() {
    if(this._routAndPriceComponent !== null) {
      this._routAndPriceComponent = null;
    }
    const sortedPoints = this._pointsModel.getPoints().slice().sort(sortPointDay);

    this._routAndPriceComponent = new RouteAndPriceView(sortedPoints);

    render(this._routContainer, this._routAndPriceComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    remove(this._sortComponent);

    this._sortComponent = new SortingView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderTripEventList() {
    render(this._tripContainer, this._tripListComponent, RenderPosition.BEFOREEND);
    const points = this._getPoints();
    this._renderPoints(points);
  }

  _clearTripEventList() {
    this._pointPresenter
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderNoTrip() {
    this._noTripComponent = new EmptyListView(this._filterType);
    render(this._tripContainer, this._noTripComponent, RenderPosition.BEFOREEND);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointPresenter.forEach((presenter) =>presenter.destroy());
    this._pointPresenter.clear();

    remove(this._noTripComponent);
    remove(this._sortComponent);
    remove(this._tripListComponent);
    remove(this._routAndPriceComponent);

    if(resetSortType) {
      this._currentSortType = SortType.DAY.name;
    }
  }

  _renderTrip() {
    if (!this._getPoints().length) {
      this._renderNoTrip();
      return;
    }

    this._renderSort();
    this._renderTripEventList();
    this._renderRoutAndPrice();
  }

}
