import {spawn} from 'node:child_process';
if(Number(process.versions.node.split('.')[0])<24){
 console.error(`Aqtheris nécessite Node.js 24 ou supérieur. Version actuelle : ${process.version}.`);
 process.exit(1);
}
const services=[['API','server/app.js'],['Vite','node_modules/vite/bin/vite.js']];
let exiting=false;
const children=services.map(([name,file])=>({name,process:spawn(process.execPath,[file],{stdio:'inherit'})}));
function stop(code=0){if(exiting)return;exiting=true;for(const child of children)child.process.kill('SIGTERM');process.exitCode=code}
for(const child of children){
 child.process.on('error',error=>{console.error(`${child.name} : ${error.message}`);stop(1)});
 child.process.on('exit',(code,signal)=>{if(exiting)return;console.error(`${child.name} s’est arrêté (code ${code??signal}). Le serveur de développement ne peut pas continuer.`);stop(code||1)});
}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
