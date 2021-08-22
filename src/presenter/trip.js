import RouteAndPriceView from '../view/route-and-price';
import TripEventListView from '../view/trip-event-list';
import SortingView from '../view/sorting';
import EmptyListView from '../view/empty-list';
import TripEventView from '../view/trip-event';
import EditEventView from '../view/edit-point';
import { render, RenderPosition, replace } from '../utils/redner';

export default class Trip {
  constructor(tripContainer, routContainer) {
    this._tripContainer = tripContainer;
    this._routContainer = routContainer;

    this._tripListComponent = new TripEventListView();
    this._sortComponent = new SortingView();
    this._noTripComponent = new EmptyListView();
  }

  init(tripTasks) {
    this._tripTasks = tripTasks.slice();

    this._renderTrip();
  }

  _renderRoutAndPrie() {
    //метод для рендеринга маршрута и стоймости
    render(this._routContainer, new RouteAndPriceView(this._tripTasks), RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    //метод для рендеринга сортировки
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    //метод для рендеринга точки маршрута
    const eventComponent = new TripEventView(event);
    const eventEditComponent = new EditEventView(event);

    const replacePointToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToPoint = () => {
      replace(eventComponent, eventEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.setCloseClickHandler(() => {
      replaceFormToPoint();
    });

    eventEditComponent.setSubmitClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(this._tripListComponent, eventComponent, RenderPosition.BEFOREEND);
  }

  _renderEnents() {
    //метод для рендеринга всех точек маршрута
    this._tripTasks
      .forEach((EventTask) => this._renderEvent(EventTask));
  }

  _renderTripEventList() {
    //метод для рендеринга списка карточек + все карточки
    render(this._tripContainer, this._tripListComponent, RenderPosition.BEFOREEND);
    this._renderEnents();
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
