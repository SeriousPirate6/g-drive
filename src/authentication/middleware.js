require("dotenv").config();
const jwt = require("jsonwebtoken");
const { sendNotAuthorized, sendBadRequest } = require("../responses/errors");

module.exports = {
  jwtAuthentication: (req, res) => {
    const credentials = req.body.credentials;
    if (credentials) {
      if (
        credentials.username === process.env.UNAME &&
        credentials.password === process.env.PWORD
      ) {
        const token = jwt.sign(
          { userName: credentials.username, role: "admin" },
          process.env.PWORD,
          {
            expiresIn: "24h",
          }
        );
        res.send({ token });
      } else {
        sendNotAuthorized(res, "Credentials sent not valid");
      }
    } else {
      sendBadRequest(res, "The param 'credentials' is required");
    }
  },

  checkJwtToken: (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (token) {
      if (token.startsWith("Bearer")) {
        token = token.slice(7, token.length);
      }
      jwt.verify(token, process.env.PWORD, (err, decoded) => {
        if (err) {
          sendNotAuthorized(res, "The token provided is invalid or expired");
        } else {
          req.decoded = decoded;
          next(req, res);
        }
      });
    } else {
      sendBadRequest(res, "Token not provided");
    }
  },
};
