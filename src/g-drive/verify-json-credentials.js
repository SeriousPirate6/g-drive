const { writeJSON } = require("../utils/json");
const { authenticate } = require("./default/authenticate");
const { remainingSpace } = require("./default/remaining-space");

module.exports = {
  verifyCredentialsAndGetRemainingSpace: async (credentials) => {
    await writeJSON(credentials, process.env.GDRIVE_KEY_FILE);

    try {
      const auth = await authenticate();

      const remaining_space = await remainingSpace({ auth });

      return remaining_space > 0 ? remaining_space : null;
    } catch (error) {
      console.log("Provided JSON credentials are not valid.");
    }
  },
};
