import SiteMenuView from './view/trip-menu.js';
import PointsModel from './model/points.js';
import { generateTask } from './mock/task-mock.js';
import { render, RenderPosition} from './utils/redner.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import FilterModel from './model/filters.js';

const TASK_COUNT = 5;
const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const pointsModel = new PointsModel();
pointsModel.setPoints(tasks);

const filterModel = new FilterModel ();

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');

render(siteNavigationElement, new SiteMenuView(), RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(siteTripEventElement, siteTripElement, pointsModel, filterModel);
filterPresenter.init();
tripPresenter.init();
