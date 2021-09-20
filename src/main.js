import SiteMenuView from './view/trip-menu.js';
import PointsModel from './model/points.js';
import { remove, render, RenderPosition} from './utils/redner.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import FilterModel from './model/filters.js';
import { MenuItem, UpdateType } from './const.js';
import OffersModel from './model/offers.js';
import DestinationModel from './model/destination.js';
import StatisticsView from './view/statistic.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic gd4v185jv45128n';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteMainContainer = document.querySelector('main.page-body__page-main .page-body__container');
const menuContainer = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');
const newPointButton = siteHeaderElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationModel();

newPointButton.disabled = true;
const handlePointNewFormClose = () => {
  newPointButton.disabled = false;
};

const siteMenuComponent = new SiteMenuView(pointsModel.getPoints());
render(menuContainer, siteMenuComponent, RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(siteTripEventElement, siteTripElement, pointsModel, filterModel, offersModel, destinationsModel, api);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripPresenter.destroy();
      tripPresenter.init();
      newPointButton.disabled = false;
      document.querySelectorAll('.trip-filters__filter-input').forEach((filter) => filter.disabled = false);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      tripPresenter.renderRoutAndPrice(pointsModel.getPoints());
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      newPointButton.disabled = true;
      document.querySelectorAll('.trip-filters__filter-input').forEach((filter) => filter.disabled = true);

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

Promise.all([
  api.getDestinations(),
  api.getOffers(),
  api.getPoints(),
])
  .then((values) => {
    const [destinations, offers, points] = values;
    destinationsModel.setDestinations(UpdateType.INIT, destinations);
    offersModel.setOffers(UpdateType.INIT, offers);
    pointsModel.setPoints(UpdateType.INIT, points);
    newPointButton.disabled = false;
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

