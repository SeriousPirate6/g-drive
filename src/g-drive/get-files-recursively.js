const { getAllIdsWithToken } = require("./default/list");
const { QUERY_IN_PARENT } = require("../constants/filters");
const { FOLDER_MIME_TYPE } = require("../constants/properties");

async function getFilesInFoldersAndSubFolderRecursively(
  { auth, parentId = process.env.ROOT_FOLDER_ID, query, noFolders = false },
  foldersList = []
) {
  const folders = await getAllIdsWithToken({
    auth,
    query: `${QUERY_IN_PARENT(parentId)} ${query ? `and ${query}` : ""}`,
    fields: "files(id, name, parents, createdTime, mimeType)",
  });

  for await (const folder of folders) {
    const folderMimeType = folder.mimeType === FOLDER_MIME_TYPE;

    if (noFolders) {
      if (!folderMimeType) {
        foldersList.push(folder);
      }
    } else {
      foldersList.push(folder);
    }

    if (folderMimeType) {
      await getFilesInFoldersAndSubFolderRecursively(
        { auth, parentId: folder.id, query, noFolders },
        foldersList
      );
    }
  }

  return foldersList;
}

module.exports = { getFilesInFoldersAndSubFolderRecursively };
