import EditEventView from './view/edit-point.js';
import FilterView from './view/filters.js';
import SiteMenuView from './view/trip-mune.js';
import RouteAndPriceView from './view/route-and-price.js';
import SortingView from './view/sorting.js';
import TripEventListView from './view/trip-event-list.js';
import TripEventView from './view/trip-event.js';
import { generateTask } from './mock/task-mock.js';
import {RenderPosition, render} from './utils.js';

const TASK_COUNT = 15;
const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');

render(siteTripElement, new RouteAndPriceView().getElement(), RenderPosition.AFTERBEGIN);
render(siteNavigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FilterView().getElement(), RenderPosition.BEFOREEND);
render(siteTripEventElement, new SortingView().getElement(), RenderPosition.BEFOREEND);

const eventList = new TripEventListView();
render(siteTripEventElement, eventList.getElement(), RenderPosition.BEFOREEND);

const renderEvent = (position, eventTask) => {
  const eventComponent = new TripEventView(eventTask);
  const eventEditComponent = new EditEventView(eventTask);

  const replacePointToForm = () => {
    position.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToPoint = () => {
    position.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  });

  render(position, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

tasks.forEach((event) => renderEvent(eventList.getElement(), event));
