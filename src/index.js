require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { nameToFileIdEndpoint } = require("./endpoints/name-to-file-id");
const { authenticate } = require("./g-drive/default/authenticate");
const { remainingSpace } = require("./g-drive/default/remaining-space");
const { createFolder } = require("./g-drive/default/create-folders");
const { getAllIdsWithToken, getRootFolder } = require("./g-drive/default/list");
const {
  QUERY_NON_FOLDERS,
  QUERY_ONLY_FOLDERS,
} = require("./constants/filters");
const {
  sendBadRequest,
  sendInternalServerError,
} = require("./responses/errors");
const { sendSuccessResponse } = require("./responses/success");
const { createFolderEndpoint } = require("./endpoints/create-folder");
const { listAllFoldersEndpoints } = require("./endpoints/list-all-folders");

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});

app.get("/keepAlive", async ({ res }) => {
  res.send({
    status: "success",
    message: "Service running",
  });
});

app.get("/nameToFileId", nameToFileIdEndpoint);

app.put("/createFolder", async (req, res) => {
  await createFolderEndpoint(req, res);
});

app.get("/listAllFolders", async (req, res) => {
  await listAllFoldersEndpoints();
});

(async () => {
  const auth = await authenticate();
  await remainingSpace({ auth, print: true });
})();
