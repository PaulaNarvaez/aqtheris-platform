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

Portada con paisaje acuático original generado para el proyecto, tarjetas interactivas, secciones Quiénes somos / Qué hacemos / Soporte, autoría de **Paula Cortes Narvaez**, contacto público autorizado **paulacnarvaez96@gmail.com** y footer propio. No incorpora un equipo ficticio, testimonios ni estadísticas no verificadas.

Icono original en `public/brand.svg`: A, onda y gota, con colores azul petróleo y turquesa. Sirve como logo, favicon y descarga SVG. La fotografía generada está en `public/aquatic-landscape.png`; no representa un sitio de un usuario ni un caso profesional real. No depende de imágenes remotas para funcionar.

## Cinco idiomas

La presentación, el registro y los textos principales de acceso incluyen español, inglés, francés, neerlandés y alemán. El selector conserva la preferencia y no vacía lo escrito al cambiar el idioma del registro.

La aplicación privada conserva la traducción previa de español/inglés/francés. Para neerlandés/alemán se añadieron sus textos principales de navegación/acceso; los textos especializados aún no traducidos usan inglés como respaldo. La revisión lingüística profesional de las traducciones sigue pendiente.

## Registro y aprobación

1. La persona completa nombre, correo, contraseña (12–200 caracteres), confirmación y aceptación del uso de sus datos para tramitar el acceso.
2. La API crea una cuenta de solo lectura **pendiente**, sin sitios ni módulos asignados. Ignora cualquier rol o permiso que se intente enviar desde el cliente.
3. La persona no puede iniciar sesión hasta que la administradora la apruebe.
4. En Equipo, la administradora usa **Aprobar cuenta** y asigna el rol y los sitios que correspondan. Las cuentas existentes siguen activas; no hay que crearlas otra vez.
5. Cambiar un rol no equivale a aprobar la cuenta: son controles separados. Aprobar por sí solo tampoco entrega permisos operativos.

La instalación debe tener su primera administradora antes de aceptar registros públicos. El alta inicial continúa siendo local y separada del registro. Hay validación y límite de intentos de registro; no se envían emails, no se verifica automáticamente la titularidad del correo y no se envían notificaciones de aprobación. La administradora comunica la aprobación por el medio acordado.

El formulario de registro no es un portal público para consultar datos de explotaciones. Los permisos siguen comprobándose en el servidor.

## Soporte y privacidad

Los enlaces de soporte abren el cliente de correo con `mailto:`. No hay envío automático ni bandeja de tickets. La información pública indica que una recuperación de datos depende de las copias disponibles y de verificar la autorización; no promete recuperar datos inexistentes. No enviar contraseñas ni códigos de recuperación por correo.

El aviso de uso de datos de registro es informativo y debe ajustarse con la institución antes de una apertura pública real. No sustituye una política institucional revisada.

## Verificación

- Pruebas de API: alta pendiente, bloqueo de acceso, intentos de autoasignarse administrador, aprobación exclusiva de administradora, revocación de sesión al suspender y auditoría.
- Chromium: navegación entre portada/registro/login/app, cinco idiomas públicos, conservación de campos al traducir, solicitud pendiente, aprobación desde Equipo, ingreso posterior y vista móvil sin desbordamiento de página.
- Compilación y suites existentes verificadas.
