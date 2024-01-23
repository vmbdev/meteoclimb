/**
 * Error created and managed from meteoclimb backend.
 * Allows us to differentiate it from other sources (i.e. database).
 * @class
 */
class MeteoError {
  constructor(msg, code = 400) {
    this.msg = msg;
    this.code = code;
  }
}

export default MeteoError;
