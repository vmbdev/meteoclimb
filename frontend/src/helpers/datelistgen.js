import { DateTime } from 'luxon';

/**
 * Generates a list of days starting from today in the language of the
 * locale given (i.e. "lunes" for Spanish, "Monday" for English...)
 * @param {number} [days=7]  The number of days to generate.
 * @param {string} [locale=en-GB]  The locale of the language.
 * @returns {Array}  The list of days
 */
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
