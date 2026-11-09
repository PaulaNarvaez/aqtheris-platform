# Pruebas de uso para Paula

Esta guía permite reproducir errores como desarrolladora sin usar datos reales. Ejecuta las pruebas en una instalación de ensayo y con cuentas de prueba. Una cuenta administradora y una ventana de incógnito para cada rol ayudan a comparar lo que ve cada persona.

## Qué controla el acceso

No hay desbloqueo por cantidad de proyectos. Esta versión todavía organiza el trabajo por **sitios**, no por proyectos independientes.

1. La administradora crea la cuenta en **Equipo**.
2. En **Administrar accesos**, selecciona el rol y los sitios.
3. Elegir el rol activa sus módulos predeterminados. El rol también puede cambiarse directamente en la fila del usuario. La personalización queda en Opciones avanzadas.
4. Sin sitios, el usuario ve los módulos de su rol, pero sus listas están vacías y no puede crear registros de trabajo.
5. Solo la administradora ve Equipo, Historial, exportación completa y documentos retirados.

El rol limita qué se puede modificar. Habilitar un módulo a un usuario de solo lectura no le concede permiso de escritura. Los cambios de acceso se comprueban en cada petición, también si ya inició sesión. La navegación vuelve a consultar sus permisos; no es necesario crear otra cuenta.

Las opciones de formularios pueden mostrar identificadores y nombres de referencias autorizadas (por ejemplo, la organización de un sitio). Eso no permite abrir el módulo restringido ni consultar sus demás datos. Los responsables de tareas se muestran por nombre, sin exponer el directorio de correos a los usuarios comunes.

## Si alguien se equivoca de archivo

- **Reemplazar:** abrir Documentos → Ver → Reemplazar archivo. Se propone la siguiente versión numérica. Cargar el archivo correcto y guardar. La versión anterior deja de estar en la lista habitual; la nueva mantiene el vínculo con ella. Solo puede hacerlo quien subió el archivo o la administradora, con permiso sobre el sitio y módulo.
- **Retirar:** la administradora abre el documento → Retirar documento → escribe el motivo. Desaparece para usuarios normales, incluido su enlace de descarga.
- **Restaurar:** la administradora activa “Mostrar documentos retirados y reemplazados”, abre uno retirado y selecciona Restaurar documento con motivo. No se puede restaurar una versión ya reemplazada: debe utilizarse la vigente.
- No hay borrado físico desde la aplicación. El archivo y el registro permanecen en el almacenamiento privado y la base para poder revisar el error. Una eliminación definitiva requeriría acordar una política de conservación y una función separada.

## Casos comprobados automáticamente

Ejecuta:

```sh
npm test
```

| Error o situación | Resultado esperado |
|---|---|
| Veterinario sin sitios asignados | Ve los módulos del rol, con listas vacías. No accede a registros de otros sitios ni puede escribir sin sitio. |
| Veterinario intenta abrir Equipo o Historial | Acceso rechazado. |
| Usuario tiene solo Sitios, Visitas y Documentos | Otros módulos rechazados por el servidor. |
| Usuario intenta cambiar sus propios permisos | Rechazado. |
| Administradora retira módulos de una sesión abierta | La siguiente petición ya no tiene permiso. |
| Elegir módulos incompatibles con el rol | Error de validación. |
| Administradora intenta quitarse su propio rol | Rechazado para evitar perder administración. |
| Abrir un registro de otro sitio | Rechazado. |
| Archivo vacío o con extensión no permitida | Rechazado antes de crear el documento. |
| Subir el mismo archivo al mismo sitio dos veces | Se detecta por contenido y se devuelve aviso. |
| Reemplazar un archivo propio | Original archivado, nuevo documento vigente y enlace de versiones. |
| Reemplazar un archivo de otro usuario sin ser administradora | Rechazado. |
| Usuario intenta retirar un documento | Rechazado; solo administradora. |
| Retirar sin motivo suficiente | Rechazado. |
| Retirar o editar usando una revisión anterior | Conflicto; hay que recargar. |
| Descargar una versión retirada como usuario común | Rechazado aunque conozca el enlace. |
| Restaurar un documento retirado | Vuelve a estar disponible y queda auditoría. |
| Restaurar una versión reemplazada | Rechazado. |
| Fecha imposible, como 31 de febrero | Rechazada. |
| Sitio duplicado con espacios antes/después | Se detecta el duplicado. |
| Correo de usuario repetido | Aviso claro de correo ya utilizado. |
| Relacionar acción/visita/envío con otro sitio | Rechazado. |
| Resultado corregido sobrescribe el anterior | Rechazado; debe crearse una versión nueva. |
| Cambio de contraseña por recuperación | Código de un solo uso; sesiones anteriores revocadas. |
| Reiniciar, respaldar y restaurar | Se conservan registros y archivos; las sesiones/códigos se invalidan al restaurar. |

La suite contiene nueve escenarios de integración, cada uno con varias comprobaciones; no son nueve clics aislados.

## Casos comprobados en navegador

En Chromium se ejercitó: Administrar accesos, asignar tres módulos a un veterinario, comprobar su menú, subir/reemplazar un archivo mediante formularios, retirarlo como administradora, consultar archivos y verificar que no haya desbordamiento de la página en móvil. Las otras revisiones documentadas incluyen perfil/foto, recuperación, cierre de ventanas y conservación del desplazamiento del menú.

## Casos que debes probar con ejemplos reales

Estos casos siguen pendientes de validación de negocio; no se consideran resueltos solo porque compile:

| Caso | Qué revisar |
|---|---|
| Escribir el sitio correcto con un nombre distinto o abreviado | La detección actual es exacta dentro de una organización; no hay deduplicación aproximada. |
| Doble registro de una visita o una muestra | No existe una clave de idempotencia global para todas las creaciones. Revisar si hace falta advertir por coincidencias. |
| Conexión interrumpida al guardar un archivo | Verificar el mensaje y consultar la lista antes de reintentar. No hay cola sin conexión. |
| Archivo con nombre correcto pero contenido clínico equivocado | La app no interpreta el documento; se necesita revisión profesional. |
| CSV con fórmulas o archivo Office con contenido activo | La descarga es privada, pero no hay antivirus/escaneo de contenido. La extensión no prueba que un archivo sea seguro. |
| Contacto, especie o actividad modificada después de una visita | Existe auditoría, pero falta la ficha temporal estructurada que reconstruya todos los datos históricos desde la interfaz. |
| Dos personas guardan cambios simultáneamente | Se detecta revisión obsoleta; no hay combinación automática de campos. |
| Archivar por error un sitio u otra entidad | Todavía no hay interfaz de restauración general para todas las entidades; la restauración implementada es para documentos. |
| Entorno con varios proyectos y permisos distintos por proyecto | Aún no hay entidad Proyecto; no inferir permisos de proyecto desde el número de sitios. |
| Cuenta de una persona que ya no trabaja en el equipo | Falta desactivación de cuentas. Quitar sitios y módulos restringe el trabajo, pero no desactiva su sesión/perfil. |
| Informes grandes y muchos registros | Falta paginación y prueba de carga representativa. |
| Recuperación por email | No se envían correos. Se utiliza código guardado o recuperación local documentada. |

## Cómo reportar un fallo

Anota: módulo, rol, pasos, resultado esperado, resultado real, fecha/hora y texto del error. Si envías captura, oculta contraseñas, códigos de recuperación y datos de personas o explotaciones reales. Para un fallo del servidor, incluye la salida relevante de la terminal de `npm run dev`, sin valores de variables ni credenciales.

Archivos de referencia: `server/permissions.js` (reglas de módulos), `server/app.js` (sitios/validación/auditoría), `tests/access-documents.test.js` (permisos y archivos), `src/main.js` (menú y formularios).

## Asignación simplificada de roles

En Equipo, cambiar el desplegable de rol guarda y activa sus módulos predeterminados sin otra configuración. Si la cuenta tenía permisos personalizados, «Usar permisos del rol» los restablece con un clic. Administrar accesos muestra un resumen de módulos; los sitios son opcionales para comenzar y la personalización se encuentra en Opciones avanzadas. Los usuarios deben recargar su sesión abierta para actualizar el menú. No se entregan datos de sitios no asignados.

En Contactos, los roles con permiso de creación ven el botón Agregar deshabilitado y una explicación si no hay sitios disponibles. Asignar un sitio al veterinario habilita la creación al recargar; no es necesario cambiar su rol ni crear una cuenta nueva. Este recorrido está cubierto por una prueba de integración, incluyendo el rechazo de contactos de otros sitios.
