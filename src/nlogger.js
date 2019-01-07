var COLORS = require("./consts").COLORS;
/**
 * Do the logging and store them called with N to avoid conflicts
 * SINGLETON
 * (winston is good replacement)
 */
class NLogger {
  constructor() {
    this.history = [];
  }

  save(text) {
    this.log.push(text);
  }

  // could be used for storing info to file
  farewell() {
    console.log(`There was ${this.history.length} Events Recorded!`);
  }

  log(text) {
    this._colorLog(COLORS.GREEN, text);
  }

  sys(text) {
    this._colorLog(COLORS.MAAGENT, text);
  }

  error(text) {
    this._colorLog(COLORS.RED, text);
  }

  warn(text) {
    this._colorLog(COLORS.YELLOW, text);
  }

  info(text) {
    this._colorLog(COLORS.BLUE, text);
  }

  _colorLog(color, text) {
    console.log(new Date().toLocaleTimeString() + color, text, COLORS.RESET);
    this.history.push(text);
  }
}

let nlogger = new NLogger();
module.exports = nlogger;
