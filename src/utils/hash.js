const crypto = require("crypto-js");

module.exports = {
  sha256Hash: (inputString) => {
    const hash = crypto.SHA256(inputString);
    return hash.toString(crypto.enc.Hex);
  },

  hmacSHA256: (key, data) => {
    const hmac = crypto.HmacSHA256(data, crypto.enc.Utf8.parse(key));
    return hmac.toString(crypto.enc.Hex);
  },
};
