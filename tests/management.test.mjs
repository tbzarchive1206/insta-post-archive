import assert from 'node:assert/strict';
import test from 'node:test';
import {normalizeArchive} from '../scripts/archive-tools.mjs';

test('management filters use immediate subfolders and include nested media and new folders',()=>{
 const archive=normalizeArchive({generatedAt:'2026-10-22',nodes:[
 {id:'company',name:'COMPANY',type:'folder',path:['MGMT COMAPNIES']},
 {id:'empty',name:'NEW COMPANY',type:'folder',path:['MGMT COMAPNIES']},
 {id:'nested',name:'2026',type:'folder',path:['MGMT COMAPNIES','COMPANY']},
 {id:'old',name:'250101 image.jpg',mimeType:'image/jpeg',type:'file',path:['MGMT COMAPNIES','COMPANY','2026']},
 {id:'new',name:'261022 video.mp4',mimeType:'video/mp4',type:'file',path:['MGMT COMAPNIES','COMPANY']},
 {id:'root',name:'261020 audio.mp3',mimeType:'audio/mpeg',type:'file',path:['MGMT COMAPNIES']},
 {id:'official',name:'261022 Eric.jpg',mimeType:'image/jpeg',type:'file',path:['OFFICIAL_THEBOYZ']}
 ]});
 assert.equal(archive.management.sourceFolderId,'1RTg8YVRwp0vTVibigF23aMVYExe7u_tT');
 assert.deepEqual(archive.management.media.map(m=>m.id),['new','root','old']);
 assert.equal(archive.management.media.find(m=>m.id==='old').folderId,'company');
 assert.deepEqual(archive.management.folders.map(f=>f.name),['COMPANY','NEW COMPANY','ROOT FOLDER']);
 assert.equal(archive.official.media.length,1);
 assert.equal(archive.other.media.length,0);
});
