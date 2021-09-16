import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CanvasType } from '../const';
import dayjs from 'dayjs';
import { getDurationTime, makeItemsUniq } from '../utils/statistics';

const moneyChart = (moneyCtx, points) => {
// //   //функция для отрисовки графиков по цене
  const types = points.map((point) => point.type);
  const uniqTypes = makeItemsUniq(types);
  const moneyArray =  Array.from(points.reduce((point, { type, basePrice }) => point.set(type, (point.get(type) || 0) + basePrice), new Map));
  const sortedMoney = moneyArray.sort((a, b) => b[1] - a[1]);
  const moneyForType = sortedMoney.map((it) => it[1]);
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypes,
      datasets: [{
        data: moneyForType,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      layout: {
        padding: {
          left: 45,
        },
      },
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const typeChart = (typeCtx, points) => {
//   //функция для отрисовки графиков по типу
  const types = points.map((point) => point.type);
  const uniqTypes = makeItemsUniq(types);
  const typeArray =  Array.from(points.reduce((point, {type}) => point.set(type, (point.get(type) || 0) + 1), new Map));
  const sortedType = typeArray.sort((a,b) => b[1] - a[1]);
  const typeQuantity = sortedType.map((it) => it[1]);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypes,
      datasets: [{
        data: typeQuantity,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      layout: {
        padding: {
          left: 45,
        },
      },
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const timeChart = (timeCtx, points) => {
  //функция для отрисовки графиков по типу
  const types = points.map((point) => point.type);
  const uniqTypes = makeItemsUniq(types);
  const timeArray =  Array.from(points.reduce((point, { type, dateFrom, dateTo }) => point.set(type, (point.get(type) || 0) + dayjs(dateTo).diff(dayjs(dateFrom))), new Map));
  const sortedTime = timeArray.sort((a, b) => b[1] - a[1]);
  const timeForType = sortedTime.map((it) => it[1]);
  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypes,
      datasets: [{
        data: timeForType,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      layout: {
        padding: {
          left: 45,
        },
      },
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getDurationTime(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const createStatisticsTemplate = () => {
  const canvasTypes = Object.values(CanvasType);

  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  ${canvasTypes.map((id) => `<div class="statistics__item">
  <canvas class="statistics__chart" id="${id}" width="900"></canvas>
</div>`)}
</section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();
    this._points = points;

    this._renderMoneyChart = null;
    this._renderTypeChart = null;
    this._renderTimeChart = null;
    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._callback._renderMoneyChart !== null || this._renderTypeChart !== null || this._renderTimeChart !== null) {
      this._renderMoneyChart = null;
      this._renderTypeChart = null;
      this._renderTimeChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._points);
  }

  _restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._renderMoneyChart !== null || this._renderTypeChart !== null || this._renderTimeChart !== null) {
      this._renderMoneyChart = null;
      this._renderTypeChart = null;
      this._renderTimeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;

    this._renderMoneyChart = moneyChart(moneyCtx, this._points);
    this._renderTypeChart = typeChart(typeCtx, this._points);
    this._renderTimeChart = timeChart(timeCtx, this._points);
  }
}
