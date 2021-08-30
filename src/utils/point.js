import dayjs from 'dayjs';

export const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const getDiffTimePoint = (startTime, endTime) => {
  const startEvent = dayjs(startTime);
  const endEvent = dayjs(endTime);
  return endEvent.diff(startEvent);
};

export const sortPointDay = (pointA, pointB) => pointA.dateTo - pointB.dateTo;

export const sortPointTime = (pointA, pointB) => getDiffTimePoint(pointB.dateFrom, pointB.dateTo) - getDiffTimePoint(pointA.dateFrom, pointA.dateTo);
