module.exports = {
  sendSuccessResponse: (res, message) => {
    res.send({ status: "success", message });
  },
};
