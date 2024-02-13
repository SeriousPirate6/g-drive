const path = require("path");
const express = require("express");
const { checkJwtToken } = require("../../authentication/middleware");
const fs = require("fs");
const { sendSuccessResponse } = require("../../responses/success");
const { sendBadRequest, sendNotFound } = require("../../responses/errors");

exposeFileEndpoint = (app) => {
  app.get("/bucket/exposeMedia/:fileName", async (req, res) => {
    const mediaName = req.params.fileName;

    if (mediaName) {
      const mediaPath = path.join(__dirname, mediaName);

      if (fs.existsSync(mediaPath)) {
        app.use(`/${mediaName}`, express.static(mediaPath));
        sendSuccessResponse(res, "Media file exposed correctly");
      } else {
        sendNotFound(res);
      }
    } else {
      sendBadRequest(res, "The param 'mediaName' must be provided in the url");
    }
  });
};

module.exports = {
  exposeFileEndpoint,

  exposeFileEndpoint_authenticated: async (req, res) => {
    await checkJwtToken(req, res, exposeFileEndpoint);
  },
};
