import { createEditPointForm } from './view/edit-point.js';
import { createFiltersTemplate } from './view/filters.js';
import { createRouteAndPriceTemplate } from './view/route-and-price.js';
import { createSortingTemplate } from './view/sorting.js';
import { createTripEventListTemplate } from './view/trip-event-list.js';
import { createTripEventTemplate } from './view/trip-event.js';
import {createMenuTemplate} from './view/trip-mune.js';
import { generateTask } from './mock/task-mock.js';

const TASK_COUNT = 15;
const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');

const renderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteTripElement, createRouteAndPriceTemplate(), renderPosition.AFTERBEGIN);
render(siteNavigationElement, createMenuTemplate(), renderPosition.BEFOREEND);
render(siteFiltersElement, createFiltersTemplate(), renderPosition.BEFOREEND);
render(siteTripEventElement, createSortingTemplate(), renderPosition.BEFOREEND);
render(siteTripEventElement, createTripEventListTemplate(), renderPosition.BEFOREEND);
const siteTripList = siteTripEventElement.querySelector('.trip-events__list');
render(siteTripList, createEditPointForm(tasks[0]), renderPosition.BEFOREEND);

tasks.forEach((point) => {
  render(siteTripList, createTripEventTemplate(point), renderPosition.BEFOREEND);
});

generateTask();
console.log(tasks);

//РАЗОБРАТЬСЯ С ПУТЯМИ ИКОНОК
