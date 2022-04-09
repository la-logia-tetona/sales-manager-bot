class AccessLogMessage {
  constructor(message) {
    this.message = message;
  }

  static async findById(thread, messageId) {
    let message = await thread.messages.fetch(messageId, {
      cache: false,
      force: true,
    });

    return message ? new AccessLogMessage(message) : null;
  }

  static async create(thread) {
    let message = await thread.send("Access Log:");

    const accessLogMessage = new AccessLogMessage(message);

    return accessLogMessage;
  }

  id() {
    return this.message.id;
  }

  thread() {
    return this.message.channel;
  }

  async next() {
    return this.hasNext()
      ? await AccessLogMessage.findById(this.thread(), this._next())
      : await this._createNext();
  }

  hasNext() {
    return !(this._next() === null);
  }

  hasSpaceFor(content) {
    content =
      this.message.content + content + this._nextLogMessage(this.message.id);

    return content.length <= 2000;
  }

  async log(logMessage) {
    try {
      await this._addContent(logMessage);

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  _next() {
    let regexp =
      /https:\/\/discord.com\/channels\/([0-9]+)\/([0-9]+)\/(?<messageId>[0-9]+)/;

    try {
      let {
        groups: { messageId },
      } = regexp.exec(this.message.content);

      return messageId;
    } catch (e) {
      return null;
    }
  }

  async _createNext() {
    const nextMessage = await AccessLogMessage.create(this.thread());

    await this._addContent(this._nextLogMessage(nextMessage.id()));

    return nextMessage;
  }

  _nextLogMessage(messageId) {
    const [guildId, threadId] = [this.thread().guild.id, this.thread().id];

    return `\r\nNext log: https://discord.com/channels/${guildId}/${threadId}/${messageId}`;
  }

  async _addContent(content) {
    await this.message.edit({
      content: `${this.message.content}${content}`,
    });
  }
}

module.exports = AccessLogMessage;
