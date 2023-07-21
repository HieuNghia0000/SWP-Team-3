import moment from "moment";

export default function getDatesUntilWeek(dateArray: string[], dateB: string) {
  const newDatesArray = [];

  for (const date of dateArray) {
    const newDate = moment(date);

    while (newDate.isSameOrBefore(dateB)) {
      newDatesArray.push(newDate.format('YYYY-MM-DD'));
      newDate.add(1, 'week');
    }
  }

  return newDatesArray;
}