module.exports = {
  sendInternalServerError: (res) => {
    res.status(500).send({
      status: "failed",
      message: "The service has not been executed properly",
    });
  },

  sendBadRequest: (res, message) => {
    res.status(400).send({
      status: "bad request",
      message,
    });
  },
};
