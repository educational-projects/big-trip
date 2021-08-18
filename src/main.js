import EditEventView from './view/edit-point.js';
import FilterView from './view/filters.js';
import SiteMenuView from './view/trip-mune.js';
import RouteAndPriceView from './view/route-and-price.js';
import SortingView from './view/sorting.js';
import TripEventListView from './view/trip-event-list.js';
import EmptyListView from './view/empty-list.js';
import TripEventView from './view/trip-event.js';
import { generateTask } from './mock/task-mock.js';
import { render, RenderPosition, replace} from './utils/redner.js';

const TASK_COUNT = 15;
const tasks = new Array(TASK_COUNT).fill().map(generateTask);

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const siteTripEventElement = siteMainElement.querySelector('.trip-events');

render(siteNavigationElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteFiltersElement, new FilterView(), RenderPosition.BEFOREEND);

const checkAndRenderTemplate = (eventData) => {
  if (tasks.length) {
    render(siteTripElement, new RouteAndPriceView(), RenderPosition.AFTERBEGIN);
    render(siteTripEventElement, new SortingView(), RenderPosition.BEFOREEND);

    const eventList = new TripEventListView();
    render(siteTripEventElement, eventList, RenderPosition.BEFOREEND);

    const renderEvent = (position, eventTask) => {
      const eventComponent = new TripEventView(eventTask);
      const eventEditComponent = new EditEventView(eventTask);

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

      render(position, eventComponent, RenderPosition.BEFOREEND);
    };

    eventData.forEach((event) => renderEvent(eventList, event));
  } else {
    render(siteTripEventElement, new EmptyListView(), RenderPosition.BEFOREEND);
  }
};

checkAndRenderTemplate(tasks);

