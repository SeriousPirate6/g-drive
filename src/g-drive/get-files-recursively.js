const { getAllIdsWithToken } = require("./default/list");
const { QUERY_IN_PARENT } = require("../constants/filters");
const { FOLDER_MIME_TYPE } = require("../constants/properties");

async function getFilesInFoldersAndSubFolderRecursively(
  { auth, parentId = process.env.ROOT_FOLDER_ID, query, noFolders = false },
  filesList = []
) {
  /*
   * listing all folders, or file and folders in the root directory for the bucket
   */
  const folders = await getAllIdsWithToken({
    auth,
    query: `${QUERY_IN_PARENT(parentId)} ${query ? `and ${query}` : ""}`,
    fields: "files(id, name, parents, createdTime, mimeType)",
  });

  /*
   * looping through all items found
   */
  for await (const folder of folders) {
    /*
     * checking if item is of folder mime type
     */
    const folderMimeType = folder.mimeType === FOLDER_MIME_TYPE;

    /*
     * if noFolders is valued to true, means the process is searching only for the files
     */
    if (noFolders) {
      /* excluding folders from list */
      if (!folderMimeType) {
        filesList.push(folder);
      }
    } else {
      filesList.push(folder);
    }

    /*
     * in case of item folder mime type, means the process needs to check for sub files and folders
     */
    if (folderMimeType) {
      /*
       * recurse the function with the folder id as parentId param
       */
      await getFilesInFoldersAndSubFolderRecursively(
        { auth, parentId: folder.id, query, noFolders },
        filesList
      );
    }
  }

  return filesList;
}

module.exports = { getFilesInFoldersAndSubFolderRecursively };
