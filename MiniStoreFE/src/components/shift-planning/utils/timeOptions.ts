import moment from "moment";

// returns an array of time options in 30 minute increments
export function timeOptions() {
  const timeArray = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = moment({ hour, minute }).format("HH:mm:ss");
      const label = moment({ hour, minute }).format("h:mma");

      timeArray.push({ value: time, label: label });
    }
  }

  return timeArray;
}
