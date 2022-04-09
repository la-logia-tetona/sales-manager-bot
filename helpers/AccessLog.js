const moment = require("moment-timezone");

const AccessLogMessage = require("./AccessLogMessage");
const Clock = require("./Clock")

class AccessLog {
  constructor(thread, accessLogMessage) {
    this.thread = thread;
    this.accessLogMessage = accessLogMessage;
  }

  // TODO add try..catch
  static async for(thread, opts) {
    let accessLogMessage = null;

    if (opts) {
      if (opts["message"]) {
        accessLogMessage = opts["message"];
      } else if (opts["messageId"]) {
        accessLogMessage = await AccessLogMessage.findById(
          thread,
          opts["messageId"]
        );
      }
    } else {
      accessLogMessage = await AccessLogMessage.create(thread);
    }

    if (accessLogMessage === null) {
      console.error(
        `[${Clock.now()}] AccessLogMessage not found for thread #${thread.id}`
      );

      throw "AccessLogMessageNotFound";
    }

    return new AccessLog(thread, accessLogMessage);
  }

  id() {
    return this.accessLogMessage.id();
  }

  async log(user) {
    const logMessage = this._logMessage(Clock.now(), user);

    while (!this.accessLogMessage.hasSpaceFor(logMessage)) {
      this.accessLogMessage = await this.accessLogMessage.next();
    }

    return await this.accessLogMessage.log(logMessage);
  }

  _logMessage(datetime, user) {
    return `\r\n[${datetime}] <@${user.id}\> `;
  }
}

module.exports = AccessLog;
