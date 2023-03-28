const moment = require("moment-timezone");

// TODO add to README
const tz = process.env.tz || "America/Argentina/Buenos_Aires";

class Clock {
  static now(format = "YYYY-MM-DD HH:mm:ss") {
    return moment(Date.now()).tz(tz).format(format);
  }
}

module.exports = Clock;
