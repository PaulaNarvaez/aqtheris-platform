import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,mkdirSync,copyFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

test('API starts from a filesystem path containing spaces and serves production assets',async()=>{
 const root=mkdtempSync(join(tmpdir(),'aqtheris startup '));
 mkdirSync(join(root,'dist'));
 const {writeFileSync}=await import('node:fs');
 writeFileSync(join(root,'dist','index.html'),'<h1>Aqtheris startup test</h1>');
 copyFileSync(resolve('server/app.js'),join(root,'app.mjs'));
 const child=spawn(process.execPath,[join(root,'app.mjs')],{cwd:root,env:{...process.env,PORT:'0',DATA_DIR:join(root,'private data')},stdio:['ignore','pipe','pipe']});
 let output='';child.stderr.on('data',chunk=>output+=chunk);
 try{
 const line=await new Promise((ok,no)=>{const timer=setTimeout(()=>no(new Error('Startup timeout: '+output)),10000);child.stdout.on('data',chunk=>{output+=chunk;if(output.includes('Aqtheris API')){clearTimeout(timer);ok(output)}});child.once('exit',code=>{clearTimeout(timer);no(new Error(`Unexpected exit ${code}: ${output}`))})});
 const port=line.match(/Aqtheris API : port (\d+)/)[1];const health=await fetch(`http://127.0.0.1:${port}/api/health`);assert.deepEqual(await health.json(),{ok:true});const page=await fetch(`http://127.0.0.1:${port}/`);assert.equal(page.status,200);assert.match(await page.text(),/Aqtheris startup test/);
 }finally{child.kill();await new Promise(r=>child.exitCode!==null?r():child.once('exit',r));rmSync(root,{recursive:true,force:true})}
});
