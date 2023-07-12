const moment = require("moment-timezone");

// TODO add to README
const tz = process.env.tz || "America/Argentina/Buenos_Aires";

class Clock {
  static now(format = "YYYY-MM-DD HH:mm:ss") {
    return moment(Date.now()).tz(tz).format(format);
  }

  static nowMoment() {
    return moment(Date.now()).tz(tz);
  }

  static from(date) {
    return moment(date);
  }

  static diffInMinutes(oldDate, newDate) {
    return moment.duration(newDate.diff(oldDate)).minutes();
  }
}

module.exports = Clock;
