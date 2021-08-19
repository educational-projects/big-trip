import AbstractView from './abstract';

const viewWay = (tasks) => {
  if (tasks.length >= 4) {
    return `${tasks[0].destination.city} — ... — ${tasks[tasks.length -1].destination.city}`;
  }
  return tasks.map((task) => task.destination.city).join(' — ');
};

const createRouteAndPriceTemplate = (tasks) => {
  const way = viewWay(tasks);

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${way}</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
  </p>
</section>`;
};

export default class RouteAndPrice extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createRouteAndPriceTemplate(this._task);
  }
}
