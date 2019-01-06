/**
 * For now it is only string utils
 * STATIC
 */

class Utils {
  //this doesnt seem XSS thing xD better use express validators and sanitizers
  static sanitize(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  static validate(text) {
    const value = Utils.sanitize(text.trim());
    const tuple = {
      value,
      valid: value.length > 0
    };
    return tuple;
  }
}

module.exports = Utils;
