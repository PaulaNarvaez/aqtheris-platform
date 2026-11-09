import pg from 'pg';

const required = ['PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];
const missing = required.filter(key => !process.env[key] || process.env[key].includes('[YOUR-PASSWORD]'));
if (missing.length) {
  console.error(`Completa estas variables en tu archivo .env privado: ${missing.join(', ')}`);
  process.exitCode = 1;
} else {
  const client = new pg.Client({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 10000,
    query_timeout: 10000,
    application_name: 'aqtheris-connection-check',
  });
  try {
    await client.connect();
    await client.query('BEGIN READ ONLY');
    await client.query('SELECT 1');
    await client.query('ROLLBACK');
    console.log('Conexión PostgreSQL correcta con TLS verificado. No se modificaron datos.');
    console.log('La aplicación sigue en SQLite: esta prueba no ejecuta la migración.');
  } catch (error) {
    const messages = {
      '28P01': 'Contraseña o usuario incorrectos. Revisa los datos de Session pooler.',
      ENOTFOUND: 'No se encuentra el servidor. Revisa PGHOST y tu conexión a Internet.',
      ECONNREFUSED: 'Conexión rechazada. Revisa el host, el puerto y el estado del proyecto.',
      ETIMEDOUT: 'La conexión agotó el tiempo de espera. Revisa la red y el estado del proyecto.',
      SELF_SIGNED_CERT_IN_CHAIN: 'No se pudo verificar el certificado TLS. Configura la CA de confianza; no desactives TLS.',
      UNABLE_TO_VERIFY_LEAF_SIGNATURE: 'No se pudo verificar el certificado TLS. Configura la CA de confianza; no desactives TLS.',
    };
    // Do not print driver errors: they may contain credentials or connection details.
    console.error(messages[error.code] || 'No se pudo verificar la conexión. Revisa la configuración privada, la red y los certificados TLS.');
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}
