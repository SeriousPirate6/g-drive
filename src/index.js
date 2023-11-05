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

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});

/* GET */

app.get("/keepAlive", keepAlive);

app.get("/nameToFileId", nameToFileIdEndpoint);

app.get("/listAllFolders", listAllFoldersEndpoint);

app.get("/listAllFiles", listAllFilesEndpoint);

/* POST */

app.post("/createFolder", createFolderEndpoint);

app.post("/upload", uploadFileEndpoint);

/* PATCH */

app.patch("/parentId", updateParentIdEndpoint);

app.patch("/sharePermissions/:id", updateSharePermissionsEndpoint);

/* DELETE */

app.delete("/:id", deleteFileEndpoint);

app.delete("/files", deleteFileEndpoint);

(async () => {
  const auth = await authenticate();
  await remainingSpace({ auth, print: true });
})();
