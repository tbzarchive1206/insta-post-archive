import assert from 'node:assert/strict';
import test from 'node:test';
import {normalizeArchive} from '../scripts/archive-tools.mjs';
import {videoDimensions} from '../scripts/video-metadata.mjs';

test('preserves individual video dimensions throughout every gallery pipeline',()=>{
 const root='INSTA POSTS ARCHIVE',member='1. SANGYEON';
 const file=(id,path,width,height)=>({id,name:'261022 video.mp4',type:'file',mimeType:'video/mp4',path,videoMediaMetadata:{width,height}});
 const a=normalizeArchive({generatedAt:'now',nodes:[
  {id:'s',name:member,type:'folder',path:[root]},
  {id:'1zNeQEYRHTviwSAsHwvgxjz9rSXOFVR8l',name:'OTHER ACCOUNTS',type:'folder',path:[root]},
  file('member',[root,member],1080,1920),
  file('other',[root,'OTHER ACCOUNTS'],1920,1080),
  file('official',['OFFICIAL_THEBOYZ'],1080,1080),
  file('company',['MGMT COMAPNIES'],720,1280)
 ]});
 for(const [media,width,height] of [[a.members[0].media[0],1080,1920],[a.other.media[0],1920,1080],[a.official.media[0],1080,1080],[a.management.media[0],720,1280]]){
  assert.equal(media.width,width);assert.equal(media.height,height);
 }
});
test('unprocessed video metadata does not break synchronization',()=>{
 for(const metadata of [undefined,{}, {width:0,height:1080},{width:1920,height:-1}])assert.deepEqual(videoDimensions({mimeType:'video/mp4',videoMediaMetadata:metadata}),{});
 assert.deepEqual(videoDimensions({mimeType:'image/jpeg',videoMediaMetadata:{width:100,height:200}}),{});
});
