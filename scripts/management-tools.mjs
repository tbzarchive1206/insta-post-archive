import { normalizeArchive } from "./official-tools.mjs";

export const MANAGEMENT_FOLDER_ID = "1RTg8YVRwp0vTVibigF23aMVYExe7u_tT";
export function normalizeManagement(raw) {
  const nodes = raw.nodes.filter((node) => node.path[0] === "MGMT COMAPNIES");
  const folders = nodes.filter((node) => node.type === "folder" && node.path.length === 1)
    .map((node) => ({ id: node.id, name: node.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const media = normalizeArchive({ ...raw, nodes }).media.map((item) => {
    const folder = folders.find((folder) => folder.name === item.account);
    return { ...item, folderId: folder?.id || "root" };
  });
  if (media.some((item) => item.folderId === "root")) folders.push({ id: "root", name: "ROOT FOLDER" });
  return { generatedAt: raw.generatedAt, sourceFolderId: MANAGEMENT_FOLDER_ID, accounts: [], folders, media };
}
