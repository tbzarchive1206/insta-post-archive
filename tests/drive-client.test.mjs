import assert from 'node:assert/strict';
import test from 'node:test';
import {listFolder} from '../scripts/drive-client.mjs';
import {normalizeArchive} from '../scripts/official-tools.mjs';
test('OTHER matches filenames, including new untagged media',()=>{
 const media=normalizeArchive({generatedAt:'now',nodes:[{id:'1',type:'file',name:'261014 Other.jpg',mimeType:'image/jpeg',path:['OFFICIAL_THEBOYZ']},{id:'2',type:'file',name:'261014 Jacob.jpg',mimeType:'image/jpeg',path:['OFFICIAL_THEBOYZ','Other']}]}).media;
 assert.deepEqual(media.find(m=>m.id==='1').members,['Other']);
 assert.deepEqual(media.find(m=>m.id==='2').members,['Jacob']);
});
test('pagination retries rate limits and includes newly added files without duplicates',async()=>{
 let calls=0;const urls=[];
 const files=await listFolder('folder','test',{sleep:async()=>{},fetchImpl:async(url)=>{
  urls.push(new URL(url)); calls++;
  if(calls===1)return new Response(JSON.stringify({error:{errors:[{reason:'userRateLimitExceeded'}]}}),{status:403});
  if(calls===2)return Response.json({files:[{id:'old'}],nextPageToken:'next'});
  return Response.json({files:[{id:'old'},{id:'new'}]});
 }});
 assert.deepEqual(files.map(f=>f.id),['old','new']); assert.equal(urls[2].searchParams.get('pageToken'),'next');
});
test('persistent errors and incomplete listings fail instead of publishing partial data',async()=>{
 await assert.rejects(listFolder('folder','test',{fetchImpl:async()=>new Response('{}',{status:403})}),/Drive API 403/);
 await assert.rejects(listFolder('folder','test',{fetchImpl:async()=>Response.json({files:[],incompleteSearch:true})}),/Incomplete/);
 let calls=0;await assert.rejects(listFolder('folder','test',{sleep:async()=>{},fetchImpl:async()=>{calls++;throw Error('network');}}),/network failure/);assert.equal(calls,5);
});
