import AbstractView from './abstract';
import dayjs from 'dayjs';

const showWay = (points) => {
  if (points.length >= 4) {
    return `${points[0].destination.city} — ... — ${points[points.length -1].destination.city}`;
  }
  return points.map((task) => task.destination.city).join(' — ');
};

const showDate = (points) => {
  const startData = points[0].dateFrom;
  const endData = points[points.length - 1].dateTo;

  const startMonth = dayjs(startData).format('MMM');
  const endMonth = dayjs(endData).format('MMM');

  const isOneMonth = startMonth === endMonth ? 'DD' : 'MMM DD';

  return `${dayjs(startData).format('MMM DD')} — ${dayjs(endData).format(isOneMonth)}`;
};

const getTotalPrice = (points) => points.reduce((sum, {basePrice}) => sum + basePrice, 0);

const createRouteAndPriceTemplate = (points) => {
  const way = showWay(points);
  const data = showDate(points);
  const totalPrice = getTotalPrice(points);

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
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRouteAndPriceTemplate(this._points);
  }
}
