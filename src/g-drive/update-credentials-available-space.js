const fs = require("fs");
const {
  getTokenIdByHash,
  updateTokenAvailableSpace,
} = require("../database/tokens");
const { remainingSpace } = require("./default/remaining-space");

module.exports = {
  updateCredentialsAvailableSpace: async ({ auth }) => {
    try {
      /* reading the credentials JSON file from disk */
      const credentials = JSON.parse(
        fs.readFileSync(process.env.GDRIVE_KEY_FILE).toString()
      );

      /* fetching token on DB with same hash signature */
      const { tokenId, storedAvailableSpace } = await getTokenIdByHash({
        credentials,
      });

      /* fetching available space on current set of credentials */
      const available_space = await remainingSpace({ auth });

      /* if the available space is less than the stored one, update the value in DB */
      if (available_space < storedAvailableSpace) {
        await updateTokenAvailableSpace({
          objectId: tokenId,
          available_space,
        });

        console.log("Credentials space updated correctly");

        return true;
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        /* handling file not found case */
        console.error("Credentials file not found");
      } else {
        /* default error */
        console.error(error);
      }
    }
  },
};
