# Revisión de Aqtheris frente a la propuesta

Base revisada: commit `999cbd1`. Documento: «Propuesta de desarrollo», sistema integrado de seguimiento de explotaciones acuícolas y visitas sanitarias, referencia D65-7520.

Esta revisión compara los requisitos con el modelo de datos, las rutas del servidor, las pantallas y los tests actuales. No modifica la aplicación ni reemplaza decisiones institucionales pendientes. Las preferencias posteriores de Paula —tres idiomas, diseño, gestión sencilla de roles— se mantienen.

**Conclusión: existe una base funcional de desarrollo; el MVP del documento no está completo.** Que una entidad tenga formulario, una lista y almacenamiento no demuestra que su flujo profesional esté resuelto.

## Qué conviene conservar

- Separación entre organización, sitio, visita y dossier.
- Datos persistentes, identificadores estables y relaciones verificadas.
- Estados separados de visita e informe; validaciones registradas.
- Cadena básica visita → muestra → análisis → resultado → revisión.
- Versiones de resultados/documentos, retiro documental con motivo y auditoría.
- Acceso por rol, módulo y sitio; interfaz adaptada a los permisos.
- Tareas con responsable y vencimiento; dashboard calculado desde registros.
- CSV y exportación JSON; respaldo/restauración local comprobados.
- Idiomas español, inglés y francés; perfil y recuperación por código.

## Diferencias relevantes por requisito

| Propuesta | Estado actual | Lo que falta |
|---|---|---|
| Empresa, sitio, contacto, unidad y dossier | Base implementada | El contacto solo enlaza con sitio, no directamente con organización; completar relaciones y ficha profesional. |
| Ficha completa del sitio | Parcial | Dirección física estructurada, coordenadas, acceso, sistema productivo, denominaciones históricas y fechas de vigencia. `location`, `species` y `notes` no sustituyen todos esos campos. |
| Preparación y programación de visitas | Parcial | Fecha propuesta frente a confirmada, hora, responsable explícito, participantes, disponibilidades y motivos de cambio/cancelación. La lista datada no es un calendario. |
| Registro profesional de visita | Parcial | Motivo, objetivos, actividades realizadas, observaciones estructuradas y origen de cada observación. La fuente existe en mediciones, pero no estructura todas las notas de una visita. Los campos científicos deben validarse con profesionales. |
| Expediente longitudinal del sitio | Parcial | Hoy hay secciones/tablas agrupadas. Falta una cronología común con fechas, evidencia y recorrido contextual para preparar la siguiente visita. |
| Muestras y análisis | Base implementada | Muestra desde visita **o dossier**, categoría, responsable explícito y referencias externas. Cada análisis actual apunta a una muestra; falta modelar una solicitud que incluya varias muestras cuando se requiera. |
| Resultados y revisión | Parcial | Fechas separadas de emisión/recepción, vínculo al informe original, tipos de valor estructurados y una conexión directa entre revisión y seguimiento. No se debe interpretar automáticamente un resultado. |
| Acciones y etapas | Parcial | Hoy enlazan con sitio y visita opcional. Faltan vínculos directos a dossier/resultado, dependencias y distinción formal de etapas frente a tarea completa. |
| Documentos | Parcial | Hoy enlazan con sitio y versiones. Falta asociarlos directamente a visitas, resultados, envíos y dossiers, incluyendo referencias externas si se decide usar almacenamiento institucional. |
| Roles y permisos | Parcial | Falta responsable de proyecto y alcance por proyecto/tipo de información. Actualmente el administrador concentra gestión técnica y funcional. Mantener la asignación sencilla; no volver a ocultar el menú por falta de sitios. |
| Integridad temporal | Parcial | Hay fechas de registro y auditoría, pero no reconstrucción temporal completa del expediente ni estados estructurados «desconocido/no evaluado/no aplicable/cero». Catálogos actuales definidos en código, sin versionado. |
| Automatizaciones | Pendiente | Recordatorios, avisos, registro de ejecuciones y reintentos idempotentes. No hay servicio de correo; la recuperación actual usa códigos. |
| Indicadores | Parcial | Faltan filtros por período, sitios sin seguimiento, tiempos de respuesta/revisión y distribución territorial/productiva. Los totales actuales no son el cuadro de indicadores completo. |
| Exportaciones e informes | Parcial | CSV y JSON disponibles; no hay informes PDF ni generador de balances. La exportación JSON de usuarios no incluye toda su configuración/perfil; el respaldo de base sí conserva el estado local completo. |
| Búsqueda y borradores | Parcial | Búsqueda textual por lista, sin filtros combinables. Borradores de algunos formularios en sesión del navegador, no borradores de servidor ni trabajo sin conexión. |
| Recuperación de históricos | Pendiente | Inventario, correspondencias de campos, detección de duplicados aproximados, importación de prueba y validación por muestreo. |
| Uso institucional | Pendiente de decisiones | Alojamiento, conservación, soporte, relación con registro maestro, SharePoint/OneDrive, volumen de usuarios/documentos y necesidad de trabajo offline. |

## Contraste de los diez criterios de aceptación

«Básico disponible» no equivale a aceptación por el profesional responsable. Esta tabla señala qué puede ensayarse y qué necesita ampliación.

| Nº | Criterio del PDF | Evidencia actual y límite |
|---|---|---|
| 1 | Organización con dos sitios | Comprobado en integración con datos temporales. |
| 2 | Varias visitas conservando antecedentes | Modelo/listas persistentes y escenario de varias visitas comprobados; faltan los campos y preparación completos. |
| 3 | Varias muestras y análisis por visita | El modelo permite varias muestras y varios análisis por muestra. La prueba principal actual usa una muestra con dos análisis: falta ampliar el escenario a varias muestras y la revisión del flujo en interfaz. |
| 4 | Resultado corregido conservando anterior | Comprobado en integración; falta vincular evidencia documental original al resultado. |
| 5 | Separar recibido, revisión y seguimiento | Entidades/estados separados disponibles. El seguimiento aún no tiene vínculo directo con resultado/revisión: aceptación parcial. |
| 6 | Acción con responsable y vencimiento | Comprobado en integración; faltan dependencias y algunos vínculos. |
| 7 | Contar visitas y sitios únicos | Cálculos distintos presentes en dashboard; falta una prueba dedicada de los indicadores y sus reglas por período. |
| 8 | Acceso por perfil | Comprobados rol/módulo/sitio y sesión existente; faltan alcance por proyecto y rol responsable de proyecto. |
| 9 | Autor y fecha de modificación | Auditoría disponible y probada en operaciones de prueba; falta reconstrucción histórica completa desde interfaz. |
| 10 | Exportar y restaurar | Exportación JSON y respaldo/restauración comprobados con documento. La restauración usa un respaldo local, no el JSON; falta validar operación institucional y completar exportación de configuración. |

## Orden recomendado para continuar

1. **Expediente como centro del trabajo.** Elegir sitio, ver contexto y cronología, preparar visita y seguir sus pendientes. Conservar acceso a los módulos, pero evitar obligar a recorrer listas independientes para realizar una sola intervención.
2. **Visita completa y documentos contextualizados.** Responsable, fechas/horas, motivo, objetivos, actividades, observaciones y adjuntos ligados a la visita. Conectar informes de laboratorio a resultados y acciones a su origen.
3. **Cadena de laboratorio completa.** Dossiers/muestras, solicitudes con las muestras necesarias, fechas de recepción/emisión, revisión y seguimiento trazables.
4. **Permisos funcionales acordados.** Separar responsable de proyecto y administración técnica. Definir si Proyecto será una entidad real antes de implementar permisos por proyecto. La experiencia de asignación debe seguir siendo simple.
5. **Aceptación y balances.** Ensayar los diez criterios con datos representativos, añadir pruebas pendientes, indicadores por período e informes/exportaciones requeridos.
6. **Integraciones y operación.** Abordar alojamiento, correo, importación e integración institucional según las decisiones del responsable. Calendario integrado, mapas y modo offline pueden ser posteriores si no son indispensables para el MVP, tal como permite el apartado 11 del PDF.

## Qué no hay que confundir

- Una pantalla visible por rol no concede acceso a datos de sitios no asignados.
- Una visita realizada no implica informe validado.
- Un resultado recibido no implica revisión ni diagnóstico.
- Una auditoría no sustituye por sí sola un modelo temporal consultable.
- Un documento asociado al sitio no está automáticamente asociado a una visita o análisis concreto.
- Un respaldo SQLite restaurable no equivale a un importador del JSON exportado.
- Publicar el entorno de desarrollo o subir código a GitHub no despliega una aplicación institucional accesible a los usuarios.

## Validación realizada en esta revisión

- Lectura de la propuesta adjunta y contraste con `server/app.js`, `server/permissions.js`, `src/main.js`, documentación y tests.
- `npm test`: ocho escenarios aprobados, cero fallidos. Se mantienen los límites de cobertura indicados arriba; no constituyen validación clínica.
- `npm run build`: aprobado.
- En esta revisión no se añadieron funciones ni se ejecutó una nueva revisión visual en navegador. Los resultados de navegador descritos en la guía de pruebas pertenecen a las tareas anteriores.
