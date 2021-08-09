import dayjs from 'dayjs';

//тип точки маршрута
const TYPE = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
//список городов путешествия
const CITIES = ['Петрозаводск', 'Сегежа', 'Кондопога', 'Олонец', 'Сортовала'];

//описание городов
const DESTINATION_DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];
//описание фотографий
const PICKTYRES_DESCRIPTION = ['картинка1', 'картинка2', 'картинка3'];
// Дополнительные опции
const OffersByType = {
  Taxi: [
    {
      title: 'Upgrade to a business class',
      price: 120,
    },
    {
      title: 'Choose the radio station',
      price: 60,
    },
    {
      title: 'Подождать 5 минут',
      price: 60,
    },
  ],
  Bus: [],
  Train: [
    {
      title: 'Upgrade to a business class',
      price: 120,
    },
    {
      title: 'Choose the radio station',
      price: 60,
    },
    {
      title: 'Постельное бельё',
      price: 60,
    },
    {
      title: 'заварить бич-пакет',
      price: 260,
    },
  ],
  Ship: [],
  Drive: [
    {
      title: 'Upgrade to a business class',
      price: 120,
    },
    {
      title: 'Choose the radio station',
      price: 60,
    },
  ],
  Flight: [
    {
      title: 'подушка под голову',
      price: 180,
    },
    {
      title: 'музыку погромче',
      price: 50,
    },
    {
      title: 'покурить в окошко',
      price: 180,
    },
    {
      title: 'сфотографироваться с стюардессой',
      price: 50,
    },
  ],
  'Check-in': [
    {
      title: 'тест',
      price: 120,
    },
    {
      title: 'Choose the radio station',
      price: 60,
    },
  ],
  Sightseeing: [
    {
      title: 'Choose meal',
      price: 180,
    },
    {
      title: 'Upgrade to comfort class',
      price: 50,
    },
  ],
  Restaurant: [
    {
      title: 'порцию побольше',
      price: 620,
    },
    {
      title: 'острый нож',
      price: 160,
    },
  ],
};

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

//случайная генерация даты окончания точки путешествия
const generateDate = () => {
  const startDate = dayjs();
  const diffTime = startDate.date() + getRandomInteger(60, 2880);
  const endDate = dayjs().add(diffTime, 'm').toDate();

  return {
    startDate,
    endDate,
  };
};

// Генерация типа точки маршрута
const generateType = () => {
  const randomIndex = getRandomInteger(0, TYPE.length -1);

  return TYPE[randomIndex];
};

const generateOffers = (type, offersPoint) => {
  const offers = offersPoint[type];
  return offers;
};

// Генерация города
const generateDestinationCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length -1);

  return CITIES[randomIndex];
};

// Генерация описания картинки
const generatePictyreDescription = () => {
  const randomIndex = getRandomInteger(0, PICKTYRES_DESCRIPTION.length -1);

  return PICKTYRES_DESCRIPTION[randomIndex];
};


const DESTINATION_PHOTO = 'http://picsum.photos/248/152?r=';

//Генерация данных
export const generateTask = () => {
  const data = generateDate();
  const type = generateType();

  return {
    type: type,
    basePrice: getRandomInteger(1, 100),
    offer: generateOffers(type, OffersByType),
    dateFrom: data.startDate,
    dateTo: data.endDate,
    destination: {
      description: DESTINATION_DESCRIPTION.slice(0, getRandomInteger(1, DESTINATION_DESCRIPTION.length)),
      city: generateDestinationCity(),
      pictures: [
        {
          src: DESTINATION_PHOTO + Math.random(),
          description: generatePictyreDescription(),
        },
      ],
    },
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
