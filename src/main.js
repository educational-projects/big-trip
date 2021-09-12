import SiteMenuView from './view/trip-menu.js';
import PointsModel from './model/points.js';
import {generateTask} from './mock/task-mock.js';
import { render, RenderPosition} from './utils/redner.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import FilterModel from './model/filters.js';
import { MenuItem } from './const.js';
import OffersModel from './model/offers.js';
import StatisticsView from './view/statistic.js';

const POINT_COUNT = 5;
const points = new Array(POINT_COUNT).fill().map(generateTask);

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteMainContainer = siteHeaderElement.querySelector('.page-body__container');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();
const offersModel = new OffersModel();
// offersModel.setOffers()

const handlePointNewFormClose = () => {
  newPointButton.disabled = false;
};

const siteMenuComponent = new SiteMenuView();
render(siteNavigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(siteTripEventElement, siteTripElement, pointsModel, filterModel, offersModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      //скрыть статистику
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      tripPresenter.renderRoutAndPrice();
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      //показать статискику
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();
// render(siteMainContainer, new StatisticsView(pointsModel.getPoints()), RenderPosition.BEFOREEND);


newPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  newPointButton.disabled = true;
  tripPresenter.createPoint(handlePointNewFormClose);
});

