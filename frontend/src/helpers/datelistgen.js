import { DateTime } from 'luxon';

export function dateListGen(days = 7, locale = 'en-GB') {
  const list = [];
  let day = DateTime.local().setLocale(locale);

  for (let i = 0; i < days; i++) {
    list.push({
      day: day.weekdayShort,
      fullDate: day.toFormat('yyyy-MM-dd'),
      selected: i === 0,
    });
    day = day.plus({ days: 1 });
  }

  return list;
}
