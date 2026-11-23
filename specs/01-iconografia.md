# SPEC 01 — Iconografía unificada y navbar solo con iconos

> **Status:** Aprobado
> **Depends on:** —
> **Date:** 2026-11-23
> **Objective:** Unificar la iconografía de la app con `expo-symbols`, dejar el navbar solo con iconos y acompañar con iconos las acciones, ajustes, estados y campos.

## Por qué existe

La app mezcla símbolos de texto (`◐ ≡ ⚙ ✕ − + → ●`) con dos SVG propios. Además, `Category.icon` ya guarda un SF Symbol, pero la interfaz lo ignora y muestra un código de tres letras.

## Scope

**In:**

- Componente `Icon` único sobre `expo-symbols` y catálogo tipado de iconos.
- Navbar: Resumen, Compras, Ajustes y el botón de nueva compra, sin texto visible.
- Categorías: `Category.icon` en color neutro en el cuadro de cada compra y en los chips de categoría (filtro y formulario).
- Símbolos de texto: se reemplazan `✕`, `−`, `+` (navbar, stepper y «Extender garantía»), `→` y `●`.
- Acciones con icono y texto: Volver, Eliminar, Extender garantía, Agregar extensión, Exportar PDF para reclamo, Compartir PDF, Guardar compra, Cámara, Galería, Ingresar a mano, Adjuntar foto, Limpiar filtros, Ver todas y Reintentar.
- Ajustes y avisos: icono en moneda, tema, garantía por defecto, filas de avisos (Ajustes y detalle), respaldo y restauraciones.
- Estados e información: badge de garantía, leyenda de «Dinero protegido», tarjetas de estadística, estados vacíos, toast, errores de campo y banner de recibo leído.
- Campos del formulario: producto, tienda, fecha y precio.

**Out of scope (for future specs):**

- Icono de la app, splash y favicon.
- Colorear iconos con `Category.color`.
- Crear o editar categorías y elegir su icono.
- Animaciones de símbolos.
- Iconos en «Cancelar», chips de tienda y de meses, `SegmentedControl`, obturador, recibos simulados y el papel del documento de reclamo.

## Data model

No hay cambios en dominio, base de datos ni migraciones. Solo cambia la presentación:

```ts
// src/shared/presentation/constants/icons.ts
import type { SymbolViewProps } from 'expo-symbols';

// Objeto con una clave por icono; cada valor define { ios, android, web }.
export const icons = {
  add: { ios: 'plus', android: 'add', web: 'add' },
  // …
} as const satisfies Record<string, SymbolViewProps['name']>;
export type IconName = keyof typeof icons;

// src/shared/presentation/components/icon.tsx
interface Props {
  name: IconName;
  color: string;
  size?: number; // 20 por defecto
}

// src/categories/presentation/constants/category-icons.ts
// Convierte el SF Symbol guardado en Category.icon; si no lo conoce, devuelve 'categoryOther'.
export function getCategoryIcon(icon: string): IconName;

// src/products/presentation/models/purchase.ts
interface Purchase {
  categoryIcon: string; // reemplaza a categoryCode; 'shippingbox' si no hay categoría
}

// src/shared/presentation/stores/toast.store.ts
type ToastType = 'success' | 'info';
interface ToastState {
  message: string | null;
  type: ToastType;
}
function showToast(message: string, type?: ToastType): void; // 'success' por defecto
```

Catálogo (Android y web comparten nombre de Material Symbols):

| `IconName`           | iOS                                 | Android / web          | Uso                                                  |
| -------------------- | ----------------------------------- | ---------------------- | ---------------------------------------------------- |
| `summary`            | `chart.pie`                         | `pie_chart`            | Pestaña Resumen                                      |
| `purchases`          | `list.bullet`                       | `format_list_bulleted` | Pestaña Compras                                      |
| `settings`           | `gearshape`                         | `settings`             | Pestaña Ajustes                                      |
| `add`                | `plus`                              | `add`                  | Nueva compra, sumar mes, extender, agregar extensión |
| `remove`             | `minus`                             | `remove`               | Restar mes                                           |
| `close`              | `xmark`                             | `close`                | Cerrar                                               |
| `search`             | `magnifyingglass`                   | `search`               | Buscador                                             |
| `back`               | `chevron.left`                      | `chevron_left`         | Volver                                               |
| `forward`            | `chevron.right`                     | `chevron_right`        | Ver todas                                            |
| `arrow`              | `arrow.right`                       | `arrow_forward`        | Rango de fechas                                      |
| `delete`             | `trash`                             | `delete`               | Eliminar                                             |
| `calendar`           | `calendar`                          | `calendar_month`       | Fecha de compra, «vencen este mes»                   |
| `bell`               | `bell`                              | `notifications`        | Avisos y su tarjeta                                  |
| `camera`             | `camera`                            | `photo_camera`         | Cámara                                               |
| `gallery`            | `photo`                             | `photo_library`        | Galería                                              |
| `edit`               | `square.and.pencil`                 | `edit`                 | Ingresar a mano                                      |
| `share`              | `square.and.arrow.up`               | `share`                | Compartir PDF                                        |
| `pdf`                | `doc.text`                          | `picture_as_pdf`       | Exportar PDF                                         |
| `save`               | `checkmark.circle`                  | `save`                 | Guardar compra                                       |
| `attach`             | `paperclip`                         | `attach_file`          | Adjuntar foto                                        |
| `clearFilters`       | `line.3.horizontal.decrease.circle` | `filter_alt_off`       | Limpiar filtros                                      |
| `retry`              | `arrow.counterclockwise`            | `restart_alt`          | Reintentar, datos de ejemplo                         |
| `backup`             | `square.and.arrow.up`               | `upload`               | Crear respaldo                                       |
| `restore`            | `square.and.arrow.down`             | `download`             | Restaurar respaldo                                   |
| `theme`              | `circle.lefthalf.filled`            | `contrast`             | Tema                                                 |
| `money`              | `banknote`                          | `payments`             | Moneda, precio                                       |
| `warranty`           | `checkmark.shield`                  | `verified_user`        | Garantía por defecto                                 |
| `product`            | `tag`                               | `sell`                 | Producto                                             |
| `store`              | `bag`                               | `shopping_bag`         | Tienda                                               |
| `active`             | `checkmark.circle`                  | `check_circle`         | Vigente, toast de éxito                              |
| `expiring`           | `clock`                             | `schedule`             | Por vencer                                           |
| `expired`            | `xmark.circle`                      | `cancel`               | Vencida                                              |
| `info`               | `info.circle`                       | `info`                 | Toast informativo                                    |
| `error`              | `exclamationmark.circle`            | `error`                | Error de campo                                       |
| `empty`              | `tray`                              | `inbox`                | Estado vacío                                         |
| `scan`               | `text.viewfinder`                   | `document_scanner`     | Banner de recibo leído                               |
| `categoryTech`       | `laptopcomputer`                    | `laptop_mac`           | Tecnología                                           |
| `categoryAppliances` | `refrigerator`                      | `kitchen`              | Electrodomésticos                                    |
| `categoryHome`       | `sofa`                              | `chair`                | Hogar                                                |
| `categoryTools`      | `hammer`                            | `construction`         | Herramientas                                         |
| `categorySports`     | `bicycle`                           | `directions_bike`      | Deportes                                             |
| `categoryOther`      | `shippingbox`                       | `package_2`            | Otros y respaldo                                     |

Convenciones:

- Solo `icon.tsx` importa `SymbolView`; los demás archivos usan `Icon`.
- El color siempre llega de la paleta (`useTheme`).
- Tamaños: 24 en navbar y botón `+`; 20 en filas, campos y tarjetas; 16 en botones y chips; 12 en badges y leyenda.
- `Icon` es decorativo y se oculta a lectores de pantalla; el nombre accesible lo da el control.

## Implementation plan

1. Crear `shared/presentation/constants/icons.ts` y `shared/presentation/components/icon.tsx`. Prueba: `npx tsc --noEmit` valida todos los nombres.
2. Navbar (`app-tab-bar.tsx`): cambiar `glyph` por `icon`, quitar el texto y usar `label` como `accessibilityLabel`. Conservar la píldora, su alto y el fondo activo; `+` pasa a `Icon`.
3. Migrar `SearchIcon` y `BackIcon` (`purchases-page.tsx`, `purchase-detail-page.tsx`) y borrar `icons.tsx` de componentes.
4. Categorías en compras: crear `category-icons.ts`, sustituir `categoryCode` por `categoryIcon` en `purchase.ts`, actualizar `purchase.test.ts` y mostrar el icono en `purchase-row.tsx`, con `categoryName` como etiqueta accesible del cuadro.
5. Chips: prop `icon?` en `chip.tsx`; `filter-chips.tsx` recibe opciones `{ label, icon? }`; pasarla para categorías en `purchases-page.tsx` y `purchase-form-step.tsx`.
6. Prop `icon?` en `primary-button.tsx` y `text-button.tsx`; aplicarla en `purchase-detail-page.tsx`, `purchases-page.tsx`, `summary-page.tsx`, `claim-document-sheet.tsx`, `extend-warranty-sheet.tsx`, `purchase-form-step.tsx`, `purchase-source-step.tsx` y `app/_layout.tsx`. «Reintentar» se dibuja fuera de `AppThemeProvider`: comprobar que su color no exige el proveedor.
7. Reemplazar los símbolos restantes: `✕` y opciones Cámara/Galería en `purchase-source-step.tsx`, stepper en `purchase-form-step.tsx`, `→` y «Extender garantía» en `warranty-coverage-card.tsx`, adjuntar en `receipt-card.tsx`.
8. Estados: añadir `statusIcons` a `status-labels.ts`; usarlo en `warranty-status-badge.tsx` y en la leyenda de `protected-money-card.tsx`. Borrar `fonts.symbol`, ya sin usos.
9. Tarjetas de estadística: prop `icon` en `summary-stat-card.tsx`, arriba a la derecha y en la misma línea que el número; `calendar` y `bell` en `summary-page.tsx`.
10. Ajustes: prop `icon` en `setting-field.tsx`, `setting-action.tsx` y `switch-row.tsx`; aplicarla en `settings-page.tsx` y `warranty-reminders-card.tsx`.
11. Campos: prop `icon?` en `text-field.tsx`, `date-field.types.ts`, `date-field.tsx` y `date-field.web.tsx`, dibujada a la izquierda dentro del campo; aplicarla en `purchase-form-step.tsx`.
12. Información: icono en `empty-state.tsx`, `field-error.tsx` y el banner de `purchase-form-step.tsx`.
13. Toast: añadir `type` a `toast.store.ts`, dibujar su icono en `toast.tsx` y pasar `'info'` en fallos (`use-app-mutation.ts`, `use-export-backup.ts`), «Restaurar respaldo estará disponible pronto», «Esa fecha ya pasó», «Activa el aviso…» y «Aviso cancelado».

## Acceptance criteria

- [ ] El navbar no muestra texto; sus tres pestañas y el botón `+` muestran icono.
- [ ] Las pestañas exponen «Resumen», «Compras» y «Ajustes», y el botón `+` expone «Nueva compra», como nombre accesible.
- [ ] La pestaña activa conserva el fondo oscuro y la navegación funciona.
- [ ] `grep -rnE "◐|≡|⚙|✕|●|→" src --include="*.tsx"` no devuelve símbolos dibujados en la interfaz.
- [ ] Los botones del stepper y «Extender garantía» no usan `−` ni `+` como texto.
- [ ] `SymbolView` solo se importa en `icon.tsx`; no quedan usos de `SearchIcon`, `BackIcon`, `categoryCode` ni `fonts.symbol`.
- [ ] Cada compra muestra el icono de su categoría en color neutro y ninguna muestra un código de tres letras.
- [ ] Una categoría con un icono desconocido muestra `categoryOther`.
- [ ] Todos los elementos listados en «In» muestran el icono del catálogo y los botones con texto lo conservan.
- [ ] Las dos tarjetas de estadística muestran el icono arriba a la derecha, en la línea del número.
- [ ] Un toast de éxito muestra `active`; uno de fallo o aviso muestra `info`.
- [ ] `npx tsc --noEmit`, `npx expo lint` y `npm test` terminan sin errores.
- [ ] En web, las capturas de Resumen, Compras, Ajustes, detalle y nueva compra, en tema claro y oscuro y guardadas en `playwright/`, muestran todos los iconos sin recortes.
- [ ] En el simulador iOS, esas mismas pantallas no muestran huecos en lugar de iconos.

## Decisions

- **Yes:** `expo-symbols`. Ya está instalado, funciona en Expo Go y encaja con `Category.icon`.
- **No:** `lucide-react-native`. Da un dibujo idéntico en todas las plataformas, pero suma una dependencia.
- **No:** SVG propios. Más dibujo y mantenimiento.
- **Yes:** color neutro en categorías. Mantiene la paleta y el contraste en ambos temas.
- **No:** `Category.color` en los iconos. Algunos colores contrastan poco en tema claro.
- **Yes:** píldora actual sin texto. Solo cambia el contenido.
- **No:** variante rellena en la pestaña activa ni barra más compacta.
- **Yes:** icono y texto fuera del navbar. Las acciones siguen siendo explícitas.
- **No:** Volver y Eliminar como botones de solo icono.
- **Yes:** tarjetas con el icono arriba a la derecha. Ocupa el hueco sin aumentar el alto.
- **Yes:** toast con `'success' | 'info'`; los fallos usan `'info'` para no mostrar un icono de éxito.
- **No:** tipo `'error'` en el toast. Solo se acordaron dos tipos.
- **Yes:** traducción de `Category.icon` en presentación. El dominio y los datos guardados no cambian.
- **Yes:** `bag` para tienda en iOS en lugar de `storefront`, que requiere una versión de iOS más reciente.

## Risks

| Risk                                                             | Mitigation                                                                            |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| El dibujo difiere entre iOS y Android/web.                       | Aceptado; se comprueba en web y simulador iOS. Android queda sin verificación visual. |
| En Android y web la fuente de símbolos carga de forma asíncrona. | `SymbolView` reserva el tamaño mientras carga, así que no hay salto de diseño.        |
| Un SF Symbol no existe en la versión de iOS instalada.           | El catálogo evita símbolos recientes y se revisa en simulador.                        |
| El navbar sin texto es menos evidente.                           | Iconos habituales y nombre accesible en cada pestaña.                                 |

## What is **not** in this spec

- Icono de la app, splash y favicon.
- Colores por categoría ni editor de categorías.
- Animaciones de símbolos.
- Iconos en «Cancelar», chips de tienda y de meses, `SegmentedControl`, obturador y documentos simulados.
- Cambios en dominio, base de datos o migraciones.
- Verificación visual en Android.

Cada uno, si llega, va en su propio spec.
