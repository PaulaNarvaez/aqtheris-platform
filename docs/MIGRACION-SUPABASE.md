# Aqtheris: pasar del computador local a Supabase

## Decisión y estado real

Paula eligió **Supabase: PostgreSQL y almacenamiento privado**. Esta es la arquitectura objetivo, no una conexión ya activada.

La versión actual sigue utilizando SQLite y archivos bajo `data/`. En esta sesión se comprobó únicamente la presencia de variables: no hay `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` ni `STORAGE_BUCKET` configuradas. No se leyeron valores de credenciales ni se transfirieron datos. El proyecto ya existe: `https://uzmaiawliytthyplrldi.supabase.co`, región Frankfurt. No se ha verificado una conexión autenticada.

El servidor actual usa operaciones síncronas de SQLite. Establecer una variable o crear un proyecto Supabase no sustituye esa implementación: falta desarrollar y probar el adaptador asíncrono PostgreSQL, la gestión transaccional y el almacenamiento remoto antes de cambiar el entorno real. No hay una migración automática ya ejecutada ni se debe borrar `data/`.

## Tres componentes necesarios

1. **PostgreSQL administrado en Supabase:** organizaciones, sitios, contactos, visitas, resultados, tareas, cuentas y auditoría.
2. **Supabase Storage, bucket privado:** informes, fotos y documentos. La base conserva identificadores, versiones y la ruta del objeto, no enlaces públicos permanentes.
3. **Alojamiento de la aplicación Node:** sirve la portada y la API, aplica roles y sitios y se conecta a Supabase. Subir el código a GitHub no equivale a este alojamiento. El navegador no recibe credenciales administrativas de base ni de almacenamiento.

El proveedor de alojamiento y el dominio público aún no se han definido.

## Qué puede preparar Paula

1. Entrar en `https://supabase.com/dashboard` y crear un proyecto para Aqtheris, dentro de su propia organización.
2. Elegir una región conforme a las necesidades de la institución y la ubicación autorizada de los datos. Guardar la contraseña de base en un gestor privado.
3. Compartir **solo la URL pública del proyecto**, con forma `https://referencia.supabase.co`. No compartir contraseña, cadena de conexión con contraseña, clave `service_role` ni tokens por chat.
4. Configurar las credenciales necesarias mediante secretos del entorno/hosting. Los valores nunca deben aparecer en archivos de Git, variables `VITE_*`, capturas ni commits.
5. Reservar un bucket privado para documentos, por ejemplo `aqtheris-documents`. Crear el bucket no convierte los documentos locales en archivos remotos: habrá que transferirlos y verificar cada objeto.

La URL pública identifica el proyecto; no autoriza por sí sola a leer o migrar sus datos. Cuando se conozca el proyecto habrá que verificar las rutas de red y la conexión requerida en este entorno, sin ampliar permisos de forma genérica ni desactivar TLS.

## Reglas para la implementación

- Mantener inicialmente las cuentas y contraseñas scrypt de Aqtheris: copiar sus hashes/sales de forma privada, sin convertirlos a texto ni obligar a recrear usuarios. Adoptar Supabase Auth sería un cambio distinto, con su propio plan.
- Mantener la aprobación de cuentas, los roles y el alcance por sitio en el servidor. No exponer una tabla de cuentas/credenciales mediante una API pública.
- Usar conexiones verificadas por TLS y credenciales del servidor con los permisos necesarios. No usar `rejectUnauthorized: false`.
- Adaptar consultas, tipos, migraciones y transacciones a PostgreSQL. Cada transacción debe permanecer en su conexión; una conversión de llamadas sin revisar concurrencia puede romper el aislamiento.
- Migrar documentos mediante identificadores estables y rutas internas. Las descargas deben seguir pasando por autorización de usuario/sitio/módulo o mediante enlaces firmados breves después de esa comprobación.
- Una caída de Supabase no debe crear otra base local vacía ni cambiar silenciosamente a datos distintos.
- Configurar copia de seguridad de la base **y** de los objetos, retención y prueba de restauración. Verificar las capacidades/costes del plan Supabase elegido; no asumir que un plan gratuito incluye todas las copias necesarias.

## Migración que deberá verificarse antes del cambio

1. Respaldar base y archivos locales en un destino privado y probar su restauración.
2. Preparar esquema en un entorno de ensayo: claves, referencias, versiones y auditoría.
3. Importar organizaciones/sitios y registros dependientes conservando IDs, fechas y autores.
4. Transferir usuarios/permisos privados. Invalidar sesiones y códigos antiguos al efectuar el cambio definitivo.
5. Subir originales y versiones archivadas al bucket privado; comparar contenido por SHA-256 y vincular cada ruta a su documento.
6. Comparar conteos por entidad, registros huérfanos, responsables, versiones y contenidos de archivos.
7. Probar cuentas administradora, veterinario, laboratorio y consulta: datos permitidos, datos ajenos rechazados, aprobaciones, recuperación y descarga privada.
8. Probar operaciones concurrentes, errores de red, reemplazo/retirada documental y restauración.
9. Detener escrituras durante la sincronización final y cambiar la conexión solo tras la validación. Conservar el respaldo local y un procedimiento de vuelta atrás, evitando escrituras simultáneas a dos bases.

## Comprobar la conexión desde Windows

En PowerShell, dentro del repositorio actualizado:

```powershell
git pull --ff-only origin work
npm.cmd ci
Copy-Item .env.example .env -ErrorAction Stop
notepad .env
```

Si `.env` ya existe, no lo sobrescribas: ábrelo y añade únicamente los campos que falten. Sustituye `[YOUR-PASSWORD]` por la contraseña de **base de datos** elegida al crear el proyecto, no tu contraseña de acceso a Supabase. Guarda el archivo y ejecuta:

```powershell
npm.cmd run db:check
```

Este comando carga `.env` únicamente en el proceso de comprobación, conecta al Session pooler con TLS verificado y ejecuta `SELECT 1` dentro de una transacción de solo lectura. No crea tablas, no importa datos y no cambia el servidor de SQLite a PostgreSQL. No imprime contraseñas ni mensajes originales del driver. Los campos separados evitan tener que codificar caracteres especiales dentro de una URI. Si la contraseña contiene comillas, utiliza el otro tipo de comilla para delimitar el valor en `.env`.

No compartas `.env` ni uses nombres `VITE_*` para credenciales. El archivo está ignorado por Git. Si falla TLS, configura un certificado CA de confianza del proveedor mediante `NODE_EXTRA_CA_CERTS`; nunca desactives la verificación.

## Pendiente concreto

Falta comprobar la conexión con las credenciales privadas de Paula y desarrollar y validar el adaptador PostgreSQL y Storage para realizar esta integración. Hasta entonces, la aplicación y los nuevos gráficos funcionan con los datos de la instalación actual. No afirmar que la base ya es remota.
