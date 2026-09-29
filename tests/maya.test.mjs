import test from 'node:test';
import assert from 'node:assert/strict';
import {requestMaya,renderMayaText} from '../public/app/js/maya.mjs';
const config={mayaProxyUrl:'https://example.com/maya',supabaseKey:'public-test-key'};
test('Maya sends recent conversation and requests research',async()=>{
 const result=await requestMaya(config,'E com crianças?',Array.from({length:12},(_,i)=>({role:'user',text:String(i)})),{},async(url,options)=>{
  const body=JSON.parse(options.body);assert.equal(body.history.length,8);assert.equal(body.history[0].text,'4');assert.equal(body.search,true);assert.equal(options.headers.authorization,'Bearer public-test-key');
  return {ok:true,json:async()=>({answer:'Visite parques.',sources:[]})};
 });assert.equal(result.answer,'Visite parques.');
});
test('Maya reports unavailable service instead of a fabricated AI answer',async()=>{
 await assert.rejects(()=>requestMaya(config,'O que visitar?',[],{},async()=>({ok:false,status:503,json:async()=>({error:'unavailable'})})),/indisponível/);
});
test('Maya escapes HTML while retaining readable paragraphs',()=>{
 assert.equal(renderMayaText('**Roteiro**\n<script>alert(1)</script>'),'<strong>Roteiro</strong><br>&lt;script&gt;alert(1)&lt;/script&gt;');
});
