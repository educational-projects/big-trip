import { createEditPointForm } from './view/edit-point.js';
import { createFiltersTemplate } from './view/filters.js';
import { createRouteAndPriceTemplate } from './view/route-and-price.js';
import { createSortingTemplate } from './view/sorting.js';
import { createTripEventListTemplate } from './view/trip-event-list.js';
import { createTripEventTemplate } from './view/trip-event.js';
import {createMenuTemplate} from './view/trip-mune.js';
import { generateTask } from './mock/task-mock.js';

const TASK_COUNT = 5;
const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteTripElement, createRouteAndPriceTemplate(), 'afterbegin');
render(siteNavigationElement, createMenuTemplate(), 'beforeend');
render(siteFiltersElement, createFiltersTemplate(), 'beforeend');
render(siteTripEventElement, createSortingTemplate(), 'beforeend');
render(siteTripEventElement, createTripEventListTemplate(), 'beforeend');
const siteTripList = siteTripEventElement.querySelector('.trip-events__list');
render(siteTripList, createEditPointForm(), 'beforeend');
// render(siteTripList, createTripEventTemplate(), 'beforeend');
// render(siteTripList, createTripEventTemplate(), 'beforeend');
// render(siteTripList, createTripEventTemplate(), 'beforeend');

for (let i = 0; i < TASK_COUNT; i++) {
  render(siteTripList, createTripEventTemplate(tasks[i]), 'beforeend');
  console.log(tasks[i]);
}
