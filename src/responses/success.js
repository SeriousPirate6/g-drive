module.exports = {
  sendSuccessResponse: (res, message, data) => {
    res.send({ status: "success", message, data });
  },
};
