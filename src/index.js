require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const {
  nameToFileIdEndpoint_authenticated,
} = require("./endpoints/g-drive/name-to-file-id");
const { authenticate } = require("./g-drive/default/authenticate");
const { remainingSpace } = require("./g-drive/default/remaining-space");
const {
  createFolderEndpoint_authenticated,
} = require("./endpoints/g-drive/create-folder");
const {
  listAllFilesEndpoint_authenticated,
  listAllFoldersEndpoint_authenticated,
} = require("./endpoints/g-drive/list");
const {
  uploadFileEndpoint_authenticated,
} = require("./endpoints/g-drive/upload-file");
const {
  deleteFileEndpoint_authenticated,
} = require("./endpoints/g-drive/delete-file");
const { keepAlive } = require("./endpoints/g-drive/keep-alive");
const {
  updateParentIdEndpoint_authenticated,
} = require("./endpoints/g-drive/update-parent-id");
const {
  updateSharePermissionsEndpoint_authenticated,
} = require("./endpoints/g-drive/update-share-permissions");
const {
  uploadEnvVarsEndpoint_authenticated,
} = require("./endpoints/g-drive/upload-env-vars");
const { getFirstTokenAvailable } = require("./database/tokens");
const { writeJSON } = require("./utils/json");
const {
  addNewCredentialsEndpoint_authenticated,
} = require("./endpoints/g-drive/add-new-credentials");
const multer = require("multer");
const {
  propertiesFromIdEndpoint_authenticated,
} = require("./endpoints/g-drive/get-properties");
const {
  idToFileNameEndpoint_authenticated,
} = require("./endpoints/g-drive/id-to-file-name");
const { jwtAuthentication } = require("./authentication/middleware");
const {
  exposeFileEndpoint_authenticated,
  exposeFileEndpoint,
} = require("./endpoints/bucket/create-presigned-url");
const {
  uploadMediaEndpoint_authenticated,
} = require("./endpoints/bucket/upload-media");
const {
  listMediaEndpoint_authenticated,
} = require("./endpoints/bucket/list-media");

const port = 3001;
const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

(async () => {
  /* fetching first set of available credentials from DB */
  // const driveCredentials = await getFirstTokenAvailable();

  // /* writing down the JSON file with the credentials */
  // await writeJSON(driveCredentials, process.env.GDRIVE_KEY_FILE);

  /* performing authentication */
  const auth = await authenticate();

  /* checking the remaining space for the current set of credentials */
  await remainingSpace({ auth, print: true });

  /* setting up the app for receiving requests */
  app.listen(port, () => {
    console.log(`Running on port: ${port}`);
  });

  /* exposing all the endpoints */

  /*
   * AUTHENTICATION
   */

  app.post("/authenticate", jwtAuthentication);

  /*
   * BUCKET
   */

  /* GET */
  app.get("/bucket/listFiles", listMediaEndpoint_authenticated);
  // app.get("/bucket/exposeMedia/:fileName", exposeFileEndpoint_authenticated);

  exposeFileEndpoint(app);

  /* PUT */
  app.put("/bucket/uploadImage", uploadMediaEndpoint_authenticated);

  /*
   * DRIVE
   */

  /* GET */
  app.get("/keepAlive", keepAlive);
  app.get("/idToName/:id", idToFileNameEndpoint_authenticated);
  app.get("/nameToFileId", nameToFileIdEndpoint_authenticated);
  app.get("/listAllFiles", listAllFilesEndpoint_authenticated);
  app.get("/nameToFolderId", nameToFileIdEndpoint_authenticated);
  app.get("/listAllFolders", listAllFoldersEndpoint_authenticated);
  app.get("/properties/:id", propertiesFromIdEndpoint_authenticated);

  /* POST */
  app.post("/createFolder", createFolderEndpoint_authenticated);
  app.post("/upload", upload.any(), uploadFileEndpoint_authenticated);
  app.post("/addNewCredentials", addNewCredentialsEndpoint_authenticated);

  /* PATCH */
  app.patch(
    "/sharePermissions/:id",
    updateSharePermissionsEndpoint_authenticated
  );
  app.patch("/parentId", updateParentIdEndpoint_authenticated);
  app.patch("/pushEnvVarsToRender", uploadEnvVarsEndpoint_authenticated);

  /* DELETE */
  app.delete("/:id", deleteFileEndpoint_authenticated);
  app.delete("/files", deleteFileEndpoint_authenticated);
})();
