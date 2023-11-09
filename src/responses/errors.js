module.exports = {
  sendBadRequest: (res, message) => {
    res.status(400).send({
      status: "bad request",
      message,
    });
  },

  sendNotAuthorized: (res, message) => {
    res.status(401).send({
      status: "not authorized",
      message,
    });
  },

  sendNotFound: (res) => {
    res
      .status(404)
      .send({
        status: "not found",
        message: "The file requested has not be found",
      });
  },

  sendInternalServerError: (res) => {
    res.status(500).send({
      status: "failed",
      message: "The service has not been executed properly",
    });
  },
};
