import SiteMenuView from './view/trip-menu.js';
import PointsModel from './model/points.js';
import {generateTask, OffersByType} from './mock/task-mock.js';
import { remove, render, RenderPosition} from './utils/redner.js';
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
const siteMainContainer = document.querySelector('main.page-body__page-main .page-body__container');
const menuContainer = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();
const offersModel = new OffersModel();
offersModel.setOffers(OffersByType);

const handlePointNewFormClose = () => {
  newPointButton.disabled = false;
};

const siteMenuComponent = new SiteMenuView(pointsModel.getPoints());
render(menuContainer, siteMenuComponent, RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(siteTripEventElement, siteTripElement, pointsModel, filterModel, offersModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripPresenter.destroy();
      tripPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      tripPresenter.renderRoutAndPrice(points);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(siteMainContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();


newPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  newPointButton.disabled = true;
  tripPresenter.createPoint(handlePointNewFormClose);
});
