import AbstractView from './abstract';
import dayjs from 'dayjs';

const showWay = (tasks) => {
  if (tasks.length >= 4) {
    return `${tasks[0].destination.city} — ... — ${tasks[tasks.length -1].destination.city}`;
  }
  return tasks.map((task) => task.destination.city).join(' — ');
};

const showDate = (tasks) => {
  const startData = tasks[0].dateFrom;
  const endData = tasks[tasks.length - 1].dateTo;

  const startMonth = dayjs(startData).format('MMM');
  const endMonth = dayjs(endData).format('MMM');

  const isOneMonth = startMonth === endMonth ? 'DD' : 'MMM DD';

  return `${dayjs(startData).format('MMM DD')} — ${dayjs(endData).format(isOneMonth)}`;
};

const getTotalPrice = (points) => points.reduce((sum, {basePrice}) => sum + basePrice, 0);

const createRouteAndPriceTemplate = (tasks) => {
  const way = showWay(tasks);
  const data = showDate(tasks);
  const totalPrice = getTotalPrice(tasks);

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${way}</h1>

    <p class="trip-info__dates">${data}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
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
