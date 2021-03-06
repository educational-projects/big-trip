import RouteAndPriceView from '../view/route-and-price';
import TripEventListView from '../view/trip-event-list';
import SortingView from '../view/sorting';
import EmptyListView from '../view/empty-list';
import { remove, render, RenderPosition } from '../utils/redner';
import PointPresenter, {State as PointPresenterViewState} from './point';
import pointNewPresenter from './new-point';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import { sortPointDay, sortPointPrice, sortPointTime } from '../utils/point';
import { filter } from '../utils/filter';
import LoadingView from '../view/loading';

export default class Trip {
  constructor(tripContainer, routContainer, pointsModel, filterModel, offersModel, destinationsModel, api) {
    this._tripContainer = tripContainer;
    this._routContainer = routContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._api = api;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY.name;
    this._filterType = FilterType.EVERYTHING;
    this._isLoading = true;

    this._sortComponent = null;
    this._routAndPriceComponent = null;
    this._noTripComponent = null;
    this._menuComponent = null;

    this._tripListComponent = new TripEventListView();
    this._loadingComponent = new LoadingView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointNewPresenter = new pointNewPresenter(this._tripListComponent, this._handleViewAction);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

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

  renderRoutAndPrice() {
    const points = this._pointsModel.getPoints();
    if (!points.length) {
      return;
    }


    if(this._routAndPriceComponent !== null) {
      this._routAndPriceComponent = null;
    }
    const sortedPoints = this._pointsModel.getPoints().slice().sort(sortPointDay);

    this._routAndPriceComponent = new RouteAndPriceView(sortedPoints);

    render(this._routContainer, this._routAndPriceComponent, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._tripListComponent);
    remove(this._routAndPriceComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();
    this._currentSortType = SortType.DAY.name;
    this._filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);

    remove(this._noTripComponent);
    render(this._tripContainer, this._tripListComponent, RenderPosition.BEFOREEND);
    this._pointNewPresenter.init(this._offers, this._destinations, callback);
  }

  _renderSort() {
    remove(this._sortComponent);

    this._sortComponent = new SortingView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();

    const pointPresenter = new PointPresenter(this._tripListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._offers, this._destinations);
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

  _renderNoTrip() {
    this._noTripComponent = new EmptyListView(this._filterType);
    render(this._tripContainer, this._noTripComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) =>presenter.destroy());
    this._pointPresenter.clear();

    remove(this._noTripComponent);
    remove(this._sortComponent);
    remove(this._loadingComponent);
    remove(this._tripListComponent);
    remove(this._routAndPriceComponent);

    if(resetSortType) {
      this._currentSortType = SortType.DAY.name;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }


    if (!this._getPoints().length) {
      this._renderNoTrip();
      return;
    }

    this._renderSort();
    this._renderTripEventList();
    this.renderRoutAndPrice();
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
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
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if(this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._renderSort();
    this._clearTrip();
    this._renderTrip();
  }

}
