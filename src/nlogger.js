class NLogger {
  constructor() {
    this.history = [];
  }

  save(text) {
    this.log.push(text);
  }
  log(text) {
    console.log(text);
    this.history.push(text);
  }
}

let nlogger = new NLogger();
module.exports = nlogger;
