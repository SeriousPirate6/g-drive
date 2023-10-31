module.exports = {
  Token: class Token {
    constructor({ _id, sha256, credentials, available_space } = {}) {
      this._id = _id;
      this.sha256 = sha256;
      this.credentials = credentials;
      this.available_space = available_space;
    }
  },
};
