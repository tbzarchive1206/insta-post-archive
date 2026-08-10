import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_FOLDER_ID = "18x3sDWTEUpoZVWT3sHc1Q0oWqgXCmc1G";

const allowedMembers = [
  ["SANGYEON", "Sangyeon"],
  ["JACOB", "Jacob"],
  ["YOUNGHOON", "Younghoon"],
  ["HYUNJAE", "Hyunjae"],
  ["JUYEON", "Juyeon"],
  ["KEVIN", "Kevin"],
  ["CHANGMIN", "Q"],
  ["SUNWOO", "Sunwoo"],
  ["ERIC", "Eric"],
];

function dateCode(value, fallback = "") {
  const match = String(value).match(/^(\d{6})/u);
  if (match) return Number(`20${match[1]}`);
  const time = Date.parse(fallback);
  if (Number.isNaN(time)) return 0;
  const date = new Date(time);
  return Number(`${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`);
}

function compactMedia(node) {
  const kind = node.mimeType.startsWith("image/")
    ? "image"
    : node.mimeType.startsWith("audio/")
      ? "audio"
      : node.mimeType.startsWith("video/")
        ? "video"
        : "other";
  const date = dateCode(node.name, node.modifiedTime);
  const value = String(date).padStart(8, "0");
  return {
    id: node.id,
    kind,
    mimeType: node.mimeType,
    date,
    year: Number(value.slice(0, 4)),
    month: Number(value.slice(4, 6)),
  };
}

export function normalizeArchive(raw) {
  const topFolders = raw.nodes.filter((node) => node.type === "folder" && node.path.length === 1);
  const members = allowedMembers.flatMap(([folderName, displayName]) => {
    const folder = topFolders.find((item) => item.name.replace(/^\d+\.\s*/u, "").toUpperCase().startsWith(folderName));
    if (!folder) return [];
    const media = raw.nodes
      .filter((node) => node.type !== "folder" && node.path[1] === folder.name)
      .map(compactMedia)
      .sort((a, b) => b.date - a.date);
    return [{ id: folder.id, name: displayName, media }];
  });

  const otherFolder = topFolders.find((folder) => folder.name.startsWith("TBZ on Other People"));
  const other = {
    id: otherFolder?.id || "1zNeQEYRHTviwSAsHwvgxjz9rSXOFVR8l",
    name: "TBZ on Other People’s Profiles",
    media: otherFolder
      ? raw.nodes.filter((node) => node.type !== "folder" && node.path[1] === otherFolder.name).map(compactMedia).sort((a, b) => b.date - a.date)
      : [],
  };

  return {
    generatedAt: raw.generatedAt,
    sourceFolderId: ROOT_FOLDER_ID,
    members,
    other,
  };
}

export async function writeNormalized(raw, outputFile) {
  const target = outputFile instanceof URL ? fileURLToPath(outputFile) : outputFile;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(normalizeArchive(raw))}\n`, "utf8");
}
