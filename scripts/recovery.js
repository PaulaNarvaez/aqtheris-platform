import {DatabaseSync} from 'node:sqlite';
import {randomBytes,createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
const email=process.argv[2];const path=resolve(process.env.DATA_DIR||'data','aqtheris.sqlite');
if(!email||!existsSync(path)){console.error('Uso: npm run recovery -- correo@ejemplo.com (desde el equipo que aloja los datos).');process.exit(1)}
const db=new DatabaseSync(path);try{const user=db.prepare('SELECT id FROM users WHERE lower(email)=?').get(email.trim().toLowerCase());if(!user)throw new Error('No existe una cuenta con ese correo en esta base de datos.');db.exec('CREATE TABLE IF NOT EXISTS recovery_codes(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),expires INTEGER NOT NULL)');const code=randomBytes(24).toString('base64url');db.exec('BEGIN');db.prepare('DELETE FROM recovery_codes WHERE user_id=?').run(user.id);db.prepare('INSERT INTO recovery_codes VALUES(?,?,?)').run(createHash('sha256').update(code).digest('hex'),user.id,Date.now()+30*60000);db.exec('COMMIT');console.log('Código local de recuperación (válido 30 minutos, un solo uso):');console.log(code);console.log('Abre «Olvidé mi contraseña» e introduce el correo, este código y la nueva contraseña. No compartas el código.')}finally{db.close()}
