import {DatabaseSync,backup} from 'node:sqlite';
import {mkdirSync,cpSync,existsSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const source=resolve(process.env.DATA_DIR||'data'),destination=resolve(process.argv[2]||'');
if(!process.argv[2]||existsSync(destination)||destination.startsWith(source+'/'))throw new Error('Indiquez un nouveau dossier de sauvegarde hors du dossier data.');
mkdirSync(destination,{recursive:true,mode:0o700});const db=new DatabaseSync(resolve(source,'aqtheris.sqlite'),{readOnly:true});
try{await backup(db,resolve(destination,'aqtheris.sqlite'));cpSync(resolve(source,'files'),resolve(destination,'files'),{recursive:true});writeFileSync(resolve(destination,'manifest.json'),JSON.stringify({format:'aqtheris-backup-v1',created_at:new Date().toISOString()}),{mode:0o600});console.log('Sauvegarde créée. Conservez-la dans un emplacement privé.')}finally{db.close()}
