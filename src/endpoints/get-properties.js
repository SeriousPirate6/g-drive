const { authenticate } = require("../g-drive/default/authenticate");
const { getPropsFromFile } = require("../g-drive/default/properties");
const { sendBadRequest } = require("../responses/errors");
const { sendSuccessResponse } = require("../responses/success");

module.exports = {
  propertiesFromIdEndpoint: async (req, res) => {
    const fileId = req.params.id;
    const { properties } = req.body;

    if (fileId) {
      try {
        const auth = await authenticate();

        const metadata = await getPropsFromFile({ auth, fileId, properties });

        sendSuccessResponse(res, metadata);
      } catch (error) {
        console.log(error);

        sendBadRequest(
          "The param 'properties' must be an array of strings or a string of words separated by comma"
        );
      }
    } else {
      sendBadRequest(
        res,
        "The param 'id' must be provided along with the request url"
      );
    }
  },
};
