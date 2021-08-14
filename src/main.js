import EditEventView from './view/edit-point.js';
import FilterView from './view/filters.js';
import SiteMenuView from './view/trip-mune.js';
import RouteAndPriceView from './view/route-and-price.js';
import SortingView from './view/sorting.js';
import TripEventListView from './view/trip-event-list.js';
import TripEventView from './view/trip-event.js';
import { generateTask } from './mock/task-mock.js';
import {RenderPosition, renderElement} from './utils.js';

const TASK_COUNT = 15;
const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');

renderElement(siteTripElement, new RouteAndPriceView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(siteNavigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteFiltersElement, new FilterView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteTripEventElement, new SortingView().getElement(), RenderPosition.BEFOREEND);

const eventList = new TripEventListView();
renderElement(siteTripEventElement, eventList.getElement(), RenderPosition.BEFOREEND);

renderElement(eventList.getElement(), new EditEventView(tasks[0]).getElement(), RenderPosition.BEFOREEND);

tasks.forEach((point) => {
  renderElement(eventList.getElement(), new TripEventView(point).getElement(), RenderPosition.BEFOREEND);
});
