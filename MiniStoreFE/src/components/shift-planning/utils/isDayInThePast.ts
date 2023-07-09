import moment from "moment";

export default function isDayInThePast(date: string) {
  const currentDate = moment().startOf("day");
  const inputDate = moment(date).startOf("day");

  if (inputDate.isBefore(currentDate)) {
    // console.log('The date is in the past.');
    return true;
    // } else if (inputDate.isAfter(currentDate)) {
    //   console.log('The date is in the future.');
    // } else {
    //   console.log('The date is today.');
    // }
  }

  return false;
}
