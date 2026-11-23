# SPEC 02 — Recibos desde la galería

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-11-23
> **Objective:** Elegir una foto real del recibo en «Fotos recientes», guardar su copia con la compra y mostrarla en el detalle.

## Por qué existe

«Fotos recientes» dibuja nueve recibos falsos y la compra guarda un adjunto `simulated://` de 0 bytes. Este spec reemplaza esa simulación solo en la galería; la cámara sigue simulada.

## Scope

**In:**

- Cuadrícula propia con fotos reales en iOS y Android: tres columnas, más nuevas primero, scroll infinito en páginas de 60, conservando el encabezado y las separaciones actuales.
- Permiso de fotos: carga, denegado, bloqueado y limitado, además de galería vacía y error.
- Al elegir una foto: validar tipo y tamaño e ir al formulario, sin lectura ni datos inventados.
- Miniatura en el formulario con «Quitar».
- Al guardar: copiar el original a documentos y registrar el `Attachment` con nombre, tipo y tamaño reales.
- Miniatura real en la tarjeta «Recibo» del detalle.
- Borrar la copia al eliminar la compra.
- En web: estado «La galería no está disponible en web» con «Ingresar a mano».

**Out of scope (for future specs):**

- Cámara real y OCR.
- «Adjuntar foto» del detalle, que sigue creando un adjunto simulado.
- Selección múltiple, álbumes, recorte, zoom, PDF y vídeos.
- Compresión o conversión de formato.
- Foto real en el documento de reclamo y en el respaldo.
- Archivos de garantías y reclamos, y migración de adjuntos simulados.

## Data model

Sin migraciones: la tabla y la entidad `Attachment` no cambian.

```ts
// src/attachments/domain/services/photo-library.ts
export type PhotoAccess = 'all' | 'limited' | 'denied' | 'blocked' | 'unavailable';

export interface LibraryPhoto {
  id: string;
  previewUri: string; // ph:// en iOS, content:// en Android
}

export interface PickedPhoto {
  uri: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface PhotoLibrary {
  getAccess(): Promise<PhotoAccess>; // no muestra el diálogo
  requestAccess(): Promise<PhotoAccess>;
  chooseMore(): Promise<void>; // selector de acceso limitado
  findRecent(limit: number, offset: number): Promise<LibraryPhoto[]>;
  getPhoto(id: string): Promise<PickedPhoto>;
}

// src/attachments/domain/services/attachment-storage.ts
export interface AttachmentStorage {
  save(sourceUri: string, fileName: string): Promise<string>; // ruta relativa
  delete(fileUri: string): Promise<void>; // ignora rutas ajenas o inexistentes
  resolveUri(fileUri: string): string | null; // null si es ajena o no existe
}

// src/products/presentation/stores/purchase-draft.store.ts
photo: PickedPhoto | null; // nuevo; inicial null
fillFromPhoto: (photo: PickedPhoto, today: IsoDate, months: number) => void;
removePhoto: () => void;

// src/products/presentation/services/register-purchase.ts
interface RegisterPurchaseInput {
  photo?: PickedPhoto; // nuevo; receiptFileName queda para la cámara y los ejemplos
}
```

Convenciones:

- `fileUri` guarda `receipts/<uuid>.<ext>`, relativo a `Paths.document`: la ruta absoluta puede cambiar al actualizar la app en iOS.
- `fileName` conserva el nombre original; `sizeBytes` y `mimeType` salen del archivo. Si el sistema no informa el tipo, se deduce de la extensión; si tampoco se reconoce, se rechaza.
- El límite es `maxAttachmentBytes` (10 MB, inclusive).
- Solo `infrastructure` importa `expo-media-library` y `expo-file-system`.
- Cada adaptador tiene su variante `.web.ts`: acceso `unavailable` y almacenamiento sin archivos.

## Implementation plan

1. Instalar `expo-media-library` y `expo-file-system` con `npx expo install`. Configurar el plugin `expo-media-library` en `app.json` con `photosPermission` en español, `savePhotosPermission: false`, `granularPermissions: ["photo"]` y `preventAutomaticLimitedAccessAlert: true`. Prueba: `npx expo-doctor` y arranque.
2. Crear los contratos `PhotoLibrary` y `AttachmentStorage` con los README de la carpeta nueva, y sus dobles en `tests/shared/application/test-context.ts`.
3. Crear `attachments/infrastructure/services/expo.photo-library.ts` y `.web.ts`. Listar con `Query` (`MEDIA_TYPE` igual a `IMAGE`, orden descendente por `CREATION_TIME`, `limit`, `offset`). Leer tamaño y tipo con `File`.
4. Crear `attachments/infrastructure/services/expo.attachment-storage.ts` y `.web.ts`.
5. Crear los casos de uso, con pruebas: `get-photo-access`, `request-photo-access`, `choose-more-photos`, `find-recent-photos` y `pick-photo` (`.use-case.ts`). `pick-photo` valida tipo y tamaño antes de devolver la foto. Cablearlos en `app.composition.ts` dentro de `photos`.
6. Crear `attach-photo.use-case.ts`: copia el archivo y delega en `CreateAttachmentUseCase`; si el registro falla, borra la copia. Añadir pruebas y cablear.
7. Inyectar `AttachmentStorage` en `DeleteProductUseCase`: borra primero el registro y luego el archivo. Un fallo al borrar el archivo no impide eliminar la compra. Actualizar pruebas y composición.
8. Añadir `photo`, `fillFromPhoto` y `removePhoto` al borrador; `fillManually` y `fillFromReceipt` dejan `photo` en `null`. `registerPurchase` usa `attachPhoto` si hay `photo` y conserva `receiptFileName` en otro caso; si falla, borra el producto como hoy. Añadir pruebas.
9. Crear `use-photo-access.ts` y `use-recent-photos.ts` (`useInfiniteQuery`) en `attachments/presentation/hooks`. El acceso se vuelve a consultar al volver la app a primer plano.
10. Reescribir `purchase-gallery-step.tsx` con `FlatList` y `expo-image`, e implementar los estados de la tabla. Al pulsar una foto se llama a `pick-photo`; mientras resuelve se bloquean otras pulsaciones y se muestra un indicador. Borrar `galleryColors`, ya sin usos.
11. Mostrar la miniatura con «Quitar» en `purchase-form-step.tsx` y pasar `photo` al guardar.
12. Crear `get-attachment-uri.use-case.ts` con prueba, y mostrar la miniatura en `receipt-card.tsx`. Si devuelve `null`, se conserva el recibo dibujado.

Estados de la galería:

| Estado         | Qué se muestra                                                               |
| -------------- | ---------------------------------------------------------------------------- |
| Cargando       | Encabezado e indicador de carga.                                             |
| Sin preguntar  | Se pide el permiso del sistema al entrar, una sola vez.                      |
| `denied`       | Explicación, «Permitir acceso» e «Ingresar a mano».                          |
| `blocked`      | Explicación, «Abrir ajustes» e «Ingresar a mano».                            |
| `limited`      | Cuadrícula y «Elegir más fotos»; al cerrar el selector se recarga.           |
| `all`          | Cuadrícula.                                                                  |
| Sin fotos      | Estado vacío e «Ingresar a mano»; con `limited`, también «Elegir más fotos». |
| Error de lista | Mensaje y «Reintentar».                                                      |
| Foto rechazada | Toast `info` con el motivo; se permanece en la galería.                      |
| `unavailable`  | «La galería no está disponible en web» e «Ingresar a mano».                  |

## Acceptance criteria

- [ ] En iOS y Android, «Galería» muestra fotos reales del dispositivo en tres columnas, de más nueva a más antigua, bajo «Cancelar» y «Fotos recientes».
- [ ] Con más de 60 fotos, llegar al final carga la página siguiente sin repetir fotos.
- [ ] La lista no muestra vídeos.
- [ ] «Cancelar» vuelve a la elección de origen.
- [ ] Con permiso denegado se puede volver a pedir; bloqueado, «Abrir ajustes» abre los ajustes de la app.
- [ ] Al conceder el permiso en ajustes y volver, aparece la cuadrícula sin reiniciar la app.
- [ ] Con acceso limitado, «Elegir más fotos» abre el selector y la cuadrícula se actualiza al cerrarlo.
- [ ] Elegir una foto abre el formulario con la fecha de hoy y los meses por defecto; producto, tienda y precio están vacíos, y no aparece «Leyendo el recibo…» ni el banner de detección.
- [ ] Una foto de más de 10 MB muestra un toast y no abre el formulario.
- [ ] El formulario muestra la miniatura; «Quitar» la elimina sin borrar los campos, y guardar después crea la compra sin recibo.
- [ ] Al guardar existe un archivo en `receipts/` y su `Attachment` tiene ruta relativa y `sizeBytes` mayor a 0.
- [ ] Cancelar el formulario no deja archivos en `receipts/`.
- [ ] Si falla la copia o el registro, no quedan ni la compra ni el archivo, y aparece un toast.
- [ ] El detalle muestra la foto tras reiniciar la app y tras borrar la original de la galería.
- [ ] Eliminar la compra borra su archivo de `receipts/`.
- [ ] Las compras de ejemplo y las de cámara siguen mostrando el recibo dibujado.
- [ ] La cámara simulada conserva su flujo y «Adjuntar foto» del detalle no cambia.
- [ ] En web, «Galería» muestra el aviso, «Ingresar a mano» funciona y no hay errores en consola; la captura se guarda en `playwright/`.
- [ ] `grep -rnE "expo-media-library|expo-file-system" src` solo devuelve archivos de `infrastructure`.
- [ ] `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor` y `npm test` terminan sin errores.

## Decisions

- **Yes:** cuadrícula propia con `expo-media-library`. Conserva el diseño pedido.
- **No:** `expo-image-picker`. No pide permiso y funciona en web, pero elimina esta pantalla.
- **No:** híbrido con selector del sistema en web. Más código para una plataforma secundaria.
- **Yes:** ir directo al formulario. Datos falsos junto a una foto real confundirían; el OCR va aparte.
- **Yes:** copiar al guardar. El recibo sobrevive al borrado de la original y cancelar no deja archivos.
- **No:** guardar solo la referencia. Se perdería con la foto original.
- **Yes:** ruta relativa. Evita enlaces rotos si cambia la carpeta de la app.
- **Yes:** original y validación de 10 MB. Conserva el detalle y no suma dependencias.
- **No:** `expo-image-manipulator`.
- **Yes:** páginas de 60 con scroll infinito. Permite llegar a recibos antiguos.
- **Yes:** borrar la copia con la compra. Evita archivos huérfanos.
- **Yes:** registro antes que archivo, sin bloquear si el archivo falla. Un archivo huérfano es preferible a una compra que no se puede eliminar.
- **Yes:** contratos en el dominio de `attachments`. La arquitectura limpia exige aislar Expo.
- **No:** cambiar la cámara simulada u ocultarla.

## Risks

| Risk                                                                    | Mitigation                                                                                         |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Google Play restringe el acceso amplio a fotos y puede rechazar la app. | Aceptado. `PhotoLibrary` aísla la elección, pero pasar al selector del sistema exigiría otro spec. |
| Expo Go puede limitar la biblioteca o ignorar los textos del plugin.    | Verificar permisos con un development build.                                                       |
| Una foto solo en iCloud tarda en descargarse o falla sin red.           | Indicador al elegir; si falla, toast y se permanece en la galería.                                 |
| Android no dibuja algunos HEIC.                                         | Comprobar en dispositivo; si la vista previa falla, la celda muestra el icono `gallery`.           |
| Fotos nuevas mientras se pagina desplazan el `offset`.                  | Eliminar duplicados por `id`; al volver a entrar se recarga la lista.                              |
| El archivo temporal elegido desaparece antes de guardar.                | La copia falla, se revierte la compra y se avisa con un toast; el formulario conserva sus datos.   |

## What is **not** in this spec

- Cámara real, lectura u OCR.
- «Adjuntar foto» del detalle.
- Selección múltiple, álbumes, recorte, zoom, PDF y vídeos.
- Compresión o conversión de imágenes.
- Foto real en reclamos o respaldos.
- Galería en web.
- Archivos de garantías y reclamos, y migración de adjuntos simulados.

Cada uno, si llega, va en su propio spec.
