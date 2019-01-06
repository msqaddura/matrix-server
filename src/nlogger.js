/**
 * Do the logging and store them called with N to avoid conflicts
 * SINGLETON
 */
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

  sys(text) {
    console.log(text);
    this.history.push(text);
  }

  error(text) {
    console.log(text);
    this.history.push(text);
  }

  warn(text) {
    console.log(text);
    this.history.push(text);
  }
}

let nlogger = new NLogger();
module.exports = nlogger;
