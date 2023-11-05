module.exports = {
  sendNotModifiedResponse: (res, message) => {
    /* correct status for "not modified" would be 304, but it doesn't allow to pass a proper response */
    res.status(200).send({
      status: "not modified",
      message,
    });
  },
};
