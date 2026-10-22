import assert from "node:assert/strict";
import test from "node:test";
import { normalizeArchive } from "../scripts/archive-tools.mjs";

test("normalizes dates and keeps former members at the end", () => {
  const root = "INSTA POSTS ARCHIVE";
  const sangyeon = "1. SANGYEON (상연)";
  const chanhee = "7. CHANHEE (뉴)";
  const haknyeon = "9. HAKNYEON (학년)";
  const other = "TBZ on Other People’s Profiles (다른 사람 프로필 속 TBZ)";
  const archive = normalizeArchive({
    generatedAt: "2026-08-10T00:00:00.000Z",
    nodes: [
      { id: "s", name: sangyeon, type: "folder", path: [root] },
      { id: "c", name: chanhee, type: "folder", path: [root] },
      { id: "h", name: haknyeon, type: "folder", path: [root] },
      { id: "o", name: other, type: "folder", path: [root] },
      { id: "s1", name: "260731 (1).jpg", type: "file", mimeType: "image/jpeg", path: [root, sangyeon, "2026"] },
      { id: "c1", name: "260731 (1).jpg", type: "file", mimeType: "image/jpeg", path: [root, chanhee, "2026"] },
      { id: "h1", name: "_juhaknyeon__1742287713_3590892059962087002.jpg", type: "file", mimeType: "image/jpeg", path: [root, haknyeon, "2025"] },
      { id: "o1", name: "260601 post.mp4", type: "file", mimeType: "video/mp4", path: [root, other] },
    ],
  });

  assert.deepEqual(archive.members.map((member) => member.name), ["Sangyeon", "Haknyeon (2017 - 2025)", "New (2017 - 2026)"]);
  assert.equal(archive.members[0].media[0].year, 2026);
  assert.equal(archive.members[0].media[0].month, 7);
  assert.equal(archive.members[1].media[0].year, 2025);
  assert.equal(archive.members[1].media[0].month, 3);
  assert.equal(archive.other.media[0].kind, "video");
  assert.equal(archive.other.media[0].month, 6);
  assert.equal(archive.other.media[0].name, "260601 post.mp4");
});

test("keeps official media separate and parses Twitter filename tags and dates", () => {
 const archive = normalizeArchive({ generatedAt: "2026-10-14T00:00:00Z", nodes: [
  {id: "older", name: "171206 GROUP PHOTO.jpg", type: "file", mimeType: "image/jpeg", path: ["OFFICIAL_THEBOYZ", "2017"]},
  {id: "newer", name: "261014 SANGYEON JACOB.mp4", type: "file", mimeType: "video/mp4", path: ["OFFICIAL_THEBOYZ", "2026"]},
  {id: "skip", name: "notes.txt", type: "file", mimeType: "text/plain", path: ["OFFICIAL_THEBOYZ"]}
 ]});
 assert.equal(archive.official.sourceFolderId, "1yveWb6H9nRlutNZiuv5H9RXKuvnFGM8b");
 assert.deepEqual(archive.official.media.map(item => item.id), ["newer", "older"]);
 assert.deepEqual(archive.official.media[0].members, ["Sangyeon", "Jacob"]);
 assert.deepEqual(archive.official.media[1].members, ["Group photo"]);
 assert.equal(archive.official.media[1].date, 20171206);
 assert.equal(archive.other.media.length, 0);
});

test("OTHER ACCS survives Drive folder renaming and includes nested files", () => {
 for (const name of ["OTHER ACCOUNTS", "OTHER ACCS", "Renamed collection"]) {
  const archive = normalizeArchive({generatedAt: "2026-10-22", nodes: [
   {id: "1zNeQEYRHTviwSAsHwvgxjz9rSXOFVR8l", name, type: "folder", path: ["INSTA POSTS ARCHIVE"]},
   {id: "post", name: "261022 THE BOYZ.jpg", type: "file", mimeType: "image/jpeg", path: ["INSTA POSTS ARCHIVE", name, "2026"]}
  ]});
  assert.equal(archive.other.media.length, 1);
  assert.equal(archive.other.media[0].name, "261022 THE BOYZ.jpg");
  assert.equal(archive.other.name, "OTHER ACCS");
 }
});
