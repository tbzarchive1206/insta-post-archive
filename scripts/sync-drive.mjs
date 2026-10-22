import fs from "node:fs/promises";
import { listFolder } from "./drive-client.mjs";
import { normalizeArchive, ROOT_FOLDER_ID } from "./archive-tools.mjs";
const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
if (!apiKey) throw new Error("Missing GOOGLE_DRIVE_API_KEY.");

const root = { id: ROOT_FOLDER_ID, title: "INSTA POSTS ARCHIVE", path: [] };
let frontier = [root, { id: "1yveWb6H9nRlutNZiuv5H9RXKuvnFGM8b", title: "OFFICIAL_THEBOYZ", path: [] }, { id: "1RTg8YVRwp0vTVibigF23aMVYExe7u_tT", title: "MGMT COMAPNIES", path: [] }];
const nodes = [];
const visited = new Set();
while (frontier.length) {
  const next = [];
  for (let index = 0; index < frontier.length; index += 8) {
    const batch = frontier.slice(index, index + 8).filter((folder) => {
      if (visited.has(`${folder.path[0] || folder.title}:${folder.id}`)) return false;
      visited.add(`${folder.path[0] || folder.title}:${folder.id}`);
      return true;
    });
    const results = await Promise.all(batch.map(async (folder) => ({ folder, files: await listFolder(folder.id, apiKey) })));
    for (const { folder, files } of results) {
      for (const file of files) {
        const isFolder = file.mimeType === "application/vnd.google-apps.folder";
        const node = {
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          type: isFolder ? "folder" : "file",
          size: file.size || null,
          videoMediaMetadata: file.videoMediaMetadata || null,
          createdTime: file.createdTime || null,
          modifiedTime: file.modifiedTime || null,
          path: [...folder.path, folder.title],
        };
        nodes.push(node);
        if (isFolder) next.push({ id: file.id, title: file.name, path: node.path });
      }
    }
  }
  frontier = next;
}

const target = new URL("../app/data/archive.generated.json", import.meta.url);
const archive = normalizeArchive({ generatedAt: new Date().toISOString(), nodes });
const previous = JSON.parse(await fs.readFile(target, "utf8"));
const content = ({ generatedAt, official, management, ...rest }) => ({ ...rest, official: official && { ...official, generatedAt: undefined }, management: management && { ...management, generatedAt: undefined } });
if (JSON.stringify(content(previous)) === JSON.stringify(content(archive))) {
  console.log("Archive unchanged; no commit or deployment needed.");
} else {
  const temporary = new URL("../app/data/archive.generated.json.tmp", import.meta.url);
  await fs.writeFile(temporary, JSON.stringify(archive) + "\n", "utf8");
  await fs.rename(temporary, target);
}
console.log(`Synced ${nodes.length} Drive items.`);
