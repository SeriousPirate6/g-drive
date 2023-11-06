require("dotenv").config();
const {
  getDB,
  insertData,
  closeConnection,
  createConnection,
  listRecordForAttribute,
} = require("./basics");
const { encrypt, decrypt, fromHexToBytes } = require("../utils/string");
const { Token } = require("../classes/token");
const { authenticate } = require("../g-drive/default/authenticate");
const {
  verifyCredentialsAndGetRemainingSpace,
} = require("../g-drive/verify-json-credentials");
const { sha256Hash } = require("../utils/hash");
const { operators } = require("../constants/properties");

getTokenIfExists = async ({ db, sha256 }) => {
  if (typeof sha256 !== "string" || sha256.length !== 64) {
    return false;
  }

  return await listRecordForAttribute(db, process.env.COLLECTION_TOKENS, {
    fields: ["_id", "sha256"],
    filters: [{ sha256 }],
    limit: 1,
  });
};

module.exports = {
  encryptAndInsertToken: async ({ credentials }) => {
    const client = await createConnection();
    const db = await getDB(client, process.env.DB_NAME);

    const sha256 = sha256Hash(credentials);

    const isTokenPresent = await getTokenIfExists({ db, sha256 });

    if (isTokenPresent) {
      console.log("Credentials provided already stored in DB.");
      return;
    }

    const remaining_space = await verifyCredentialsAndGetRemainingSpace(
      credentials
    );

    if (remaining_space) {
      const encryptedCredentials = encrypt(
        credentials,
        fromHexToBytes(process.env.ENC_SECRET_KEY)
      );

      const token = new Token({
        sha256,
        credentials: encryptedCredentials,
        available_space: remaining_space,
      });

      try {
        const insertedData = await insertData(
          db,
          process.env.COLLECTION_TOKENS,
          token
        );

        return { insertedData };
      } finally {
        await closeConnection(client);
      }
    }
  },

  getTokenIdByHash: async ({ credentials }) => {
    const client = await createConnection();
    const db = await getDB(client, process.env.DB_NAME);

    const sha256 = sha256Hash(credentials);

    const token = await listRecordForAttribute(
      db,
      process.env.COLLECTION_TOKENS,
      { filters: [{ sha256: sha256 }], fields: "_id" }
    );

    return token.length > 0 ? token[0]._id.toString() : null;
  },

  getFirstTokenAvailable: async (fileSize = 0.01) => {
    const client = await createConnection();
    const db = await getDB(client, process.env.DB_NAME);

    const token = await listRecordForAttribute(
      db,
      process.env.COLLECTION_TOKENS,
      {
        filters: [{ available_space: fileSize, operator: operators.greater }],
        limit: 1,
      }
    );

    if (!token[0]) return;

    const credentials = token[0].credentials;

    return decrypt(credentials, fromHexToBytes(process.env.ENC_SECRET_KEY));
  },

  updateTokenAvailableSpace: async ({ objectId }) => {},
};
