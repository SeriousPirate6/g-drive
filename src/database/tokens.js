require("dotenv").config();
const { ObjectId } = require("mongodb");
const {
  getDB,
  insertData,
  closeConnection,
  createConnection,
  getDocumentById,
  updateData,
  listRecordForAttribute,
} = require("./basics");
const { encrypt, decrypt, fromHexToBytes } = require("../utils/string");
const { Token } = require("../classes/token");
const { authenticate } = require("../g-drive/default/authenticate");
const {
  verifyCredentialsAndGetRemainingSpace,
} = require("../g-drive/verify-json-credentials");
const { sha256Hash } = require("../utils/hash");

getTokenIfExists = async ({ db, sha256 }) => {
  if (typeof sha256 !== "string" || sha256.length !== 64) {
    return false;
  }

  const tokenFile = await listRecordForAttribute(
    db,
    process.env.COLLECTION_TOKENS,
    {
      fields: ["_id", "sha256"],
      filters: [{ sha256 }],
      limit: 1,
    }
  );
  return tokenFile;
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
        JSON.stringify(credentials),
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

  decryptAndGetToken: async ({ objectId }) => {
    const client = await createConnection();
    const db = await getDB(client, process.env.DB_NAME);
    const tokenData = await getTokenIfExists({ db, objectId });

    if (tokenData) {
      const decryptedTokenData = decrypt(
        tokenData,
        fromHexToBytes(process.env.ENC_SECRET_KEY)
      );

      return decryptedTokenData;
    }
  },

  //   getTokenDataFromId: async ({ objectId }) => {
  //     const client = await createConnection();
  //     const db = await getDB(client, process.env.DB_NAME);

  //     const tokenData = await getDocumentById(
  //       db,
  //       process.env.COLLECTION_TOKENS,
  //       objectId
  //     );

  //     /*
  //      * if tokenData found, decrypting it and returning its access token
  //      */
  //     return tokenData ? decryptTokenData(tokenData) : null;
  //   },
};
