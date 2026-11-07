import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'vite';
import {createApp} from '../server/app.js';
import {apiProxy} from '../vite.config.js';

test('browser registration and login through Vite preserve origin and reject foreign origins',async()=>{
 const directory=mkdtempSync(join(tmpdir(),'aq-origin-'));
 const api=createApp({dataDir:directory});await new Promise(r=>api.listen(0,'127.0.0.1',r));
 const proxy=await createServer({configFile:false,server:{host:'127.0.0.1',port:0,proxy:{'/api':{...apiProxy,target:`http://127.0.0.1:${api.address().port}`}}}});
 try{await proxy.listen();const base=`http://127.0.0.1:${proxy.httpServer.address().port}`;
 const request=(path,origin,data)=>fetch(base+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
 const credentials={name:'Test origin',email:'origin@example.test',password:'test-password-only-123'};
 const bad=await request('/api/setup','https://unrelated.example',credentials);assert.equal(bad.status,403);
 const good=await request('/api/setup',base,credentials);assert.equal(good.status,201,await good.text());
 const login=await request('/api/login',base,credentials);assert.equal(login.status,200);assert.match(login.headers.get('set-cookie'),/HttpOnly/);
 const rejected=await request('/api/login','https://unrelated.example',credentials);assert.equal(rejected.status,403);
 }finally{await proxy.close();await new Promise(r=>api.close(r));rmSync(directory,{recursive:true,force:true})}
});
