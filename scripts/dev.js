import {spawn} from 'node:child_process';
const children=[spawn(process.execPath,['server/app.js'],{stdio:'inherit'}),spawn(process.execPath,['node_modules/vite/bin/vite.js'],{stdio:'inherit'})];
let exiting=false;function stop(code=0){if(exiting)return;exiting=true;for(const p of children)p.kill('SIGTERM');process.exitCode=code}
for(const child of children){child.on('error',e=>{console.error(e.message);stop(1)});child.on('exit',code=>stop(code||0))}process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
