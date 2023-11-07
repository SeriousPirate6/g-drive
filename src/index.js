require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { nameToFileIdEndpoint } = require("./endpoints/name-to-file-id");
const { authenticate } = require("./g-drive/default/authenticate");
const { remainingSpace } = require("./g-drive/default/remaining-space");
const { createFolderEndpoint } = require("./endpoints/create-folder");
const {
  listAllFoldersEndpoint,
  listAllFilesEndpoint,
} = require("./endpoints/list");
const { uploadFileEndpoint } = require("./endpoints/upload-file");
const { deleteFileEndpoint } = require("./endpoints/delete-file");
const { keepAlive } = require("./endpoints/keep-alive");
const { updateParentIdEndpoint } = require("./endpoints/update-parent-id");
const {
  updateSharePermissionsEndpoint,
} = require("./endpoints/update-share-permissions");
const { uploadEnvVarsEndpoint } = require("./endpoints/upload-env-vars");
const { getFirstTokenAvailable } = require("./database/tokens");
const { writeJSON } = require("./utils/json");
const {
  addNewCredentialsEndpoint,
} = require("./endpoints/add-new-credentials");
const multer = require("multer");
const { propertiesFromIdEndpoint } = require("./endpoints/get-properties");
const { idToFileNameEndpoint } = require("./endpoints/id-to-file-name");

const port = 3000;
const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

(async () => {
  /* fetching first set of available credentials from DB */
  const driveCredentials = await getFirstTokenAvailable();

  /* writing down the JSON file with the credentials */
  await writeJSON(driveCredentials, process.env.GDRIVE_KEY_FILE);

  /* performing authentication */
  const auth = await authenticate();

  /* checking the remaining space for the current set of credentials */
  await remainingSpace({ auth, print: true });

  /* setting up the app for receiving requests */
  app.listen(port, () => {
    console.log(`Running on port: ${port}`);
  });

  /* exposing all the endpoints */

  /* GET */

  app.get("/keepAlive", keepAlive);

  app.get("/idToName/:id", idToFileNameEndpoint);

  app.get("/nameToFileId", nameToFileIdEndpoint);

  app.get("/nameToFolderId", nameToFileIdEndpoint);

  app.get("/properties/:id", propertiesFromIdEndpoint);

  app.get("/listAllFolders", listAllFoldersEndpoint);

  app.get("/listAllFiles", listAllFilesEndpoint);

  /* POST */

  app.post("/addNewCredentials", addNewCredentialsEndpoint);

  app.post("/createFolder", createFolderEndpoint);

  app.post("/upload", upload.any(), uploadFileEndpoint);

  /* PATCH */

  app.patch("/parentId", updateParentIdEndpoint);

  app.patch("/sharePermissions/:id", updateSharePermissionsEndpoint);

  app.patch("/pushEnvVarsToRender", uploadEnvVarsEndpoint);

  /* DELETE */

  app.delete("/:id", deleteFileEndpoint);

  app.delete("/files", deleteFileEndpoint);
})();
