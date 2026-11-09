# Presentación pública, acceso y registro

## Direcciones locales

Con `npm run dev`:

- `http://localhost:5173/`: presentación pública de Aqtheris.
- `http://localhost:5173/login`: inicio de sesión.
- `http://localhost:5173/register`: registro de una persona nueva.
- `http://localhost:5173/app`: aplicación privada, después de iniciar sesión.
- `http://localhost:5173/setup`: alta inicial de la administradora si la instalación no tiene cuentas.

Estas direcciones son locales. Compartirlas no publica el servicio en Internet. Las mismas rutas funcionan con `npm run build` y `npm start`, en el puerto configurado del servidor.

## Presentación

Portada con paisaje acuático original generado para el proyecto, tarjetas interactivas, secciones Quiénes somos / Qué hacemos / Soporte, presentación centrada en la plataforma, contacto público autorizado **paulacnarvaez96@gmail.com** y footer propio. No incorpora un equipo ficticio, testimonios ni estadísticas no verificadas.

Icono original en `public/brand.svg`: A, onda y gota, con colores azul petróleo y turquesa. Sirve como logo, favicon y descarga SVG. La fotografía generada está en `public/aquatic-landscape.png`; no representa un sitio de un usuario ni un caso profesional real. No depende de imágenes remotas para funcionar.

## Cinco idiomas

La presentación, el registro y los textos principales de acceso incluyen español, inglés, francés, neerlandés y alemán. El selector conserva la preferencia y no vacía lo escrito al cambiar el idioma del registro.

La aplicación privada conserva la traducción previa de español/inglés/francés. Para neerlandés/alemán se añadieron sus textos principales de navegación/acceso; los textos especializados aún no traducidos usan inglés como respaldo. La revisión lingüística profesional de las traducciones sigue pendiente.

## Registro y aprobación

1. La persona completa nombre, correo, contraseña (12–200 caracteres), confirmación y aceptación del uso de sus datos para tramitar el acceso.
2. La API crea una cuenta de solo lectura **pendiente**, sin sitios ni módulos asignados. Ignora cualquier rol o permiso que se intente enviar desde el cliente.
3. Al terminar el registro se redirige automáticamente al login y se completa el correo, sin guardar la contraseña. La persona puede iniciar sesión, pero solo ve una pantalla de espera con el aviso de contactar a la administradora. La API rechaza sus peticiones de datos y configuración mientras siga pendiente.
4. En Equipo, la administradora usa **Aprobar cuenta** y asigna el rol y los sitios que correspondan. Las cuentas existentes siguen activas; no hay que crearlas otra vez.
5. Cambiar un rol no equivale a aprobar la cuenta: son controles separados. Aprobar por sí solo tampoco entrega permisos operativos.

La instalación debe tener su primera administradora antes de aceptar registros públicos. El alta inicial continúa siendo local y separada del registro. Hay validación y límite de intentos de registro; no se envían emails, no se verifica automáticamente la titularidad del correo y no se envían notificaciones de aprobación. La administradora comunica la aprobación por el medio acordado.

El formulario de registro no es un portal público para consultar datos de explotaciones. Los permisos siguen comprobándose en el servidor.

## Soporte y privacidad

Los enlaces de soporte abren el cliente de correo con `mailto:`. No hay envío automático ni bandeja de tickets. La información pública indica que una recuperación de datos depende de las copias disponibles y de verificar la autorización; no promete recuperar datos inexistentes. No enviar contraseñas ni códigos de recuperación por correo.

El aviso de uso de datos de registro es informativo y debe ajustarse con la institución antes de una apertura pública real. No sustituye una política institucional revisada.

## Verificación

- Pruebas de API: alta pendiente, acceso pendiente limitado a su identidad y cierre de sesión, intentos de autoasignarse administrador, aprobación exclusiva de administradora, bloqueo de operaciones al suspender y auditoría.
- Chromium: navegación entre portada/registro/login/app, cinco idiomas públicos, conservación de campos al traducir, redirección automática al login, sesión pendiente, aprobación desde Equipo y verificación del acceso sin nuevo login y vista móvil sin desbordamiento de página.
- Compilación y suites existentes verificadas.

## Ajuste editorial y de legibilidad

Se retiró la presentación personal y el nombre de la creadora de las pantallas públicas. El único crédito del footer es «Creado por **paujnarvaez** con ♥», traducido según el idioma. También se aplica al footer del dashboard. El correo autorizado de soporte permanece. No se modifica el nombre de cuentas privadas ni la autoría Git de PaulaNarvaez.

Se amplió la tipografía pública, los controles y los textos de la aplicación; los iconos propios recibieron bases translúcidas, luces y relieve. Inspora no pudo inspeccionarse porque su dominio está bloqueado en el entorno: no se descargaron ni copiaron recursos de ese sitio.

## Dashboard y menú

El dashboard coloca el footer de crédito fuera del contenido principal, al pie del espacio de trabajo. Se mantiene «Creado por paujnarvaez con ♥». Los iconos laterales usan tamaño y base uniformes; las etiquetas pueden ocupar dos líneas en escritorio sin recortarse. Se conserva el desplazamiento del menú al navegar.

La pantalla de espera dispone de «Verificar mi acceso». Tras la aprobación y asignación de rol, actualiza el espacio de trabajo sin repetir el login. Si la cuenta está aprobada pero aún no tiene módulos, el dashboard informa que debe solicitar el rol correspondiente. No se concede acceso universal por completar el registro.
