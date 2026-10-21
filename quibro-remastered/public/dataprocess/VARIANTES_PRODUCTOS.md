# Sistema de variantes de productos (talla / color)

Documento para replicar en la web actual el modelo de agrupación de productos usado en QuibroRemastered.

## Objetivo

Cada fila de `productos` sigue siendo un **SKU comprable** (stock y precio propios). Varios SKUs pueden formar **un solo producto en tienda**, con selector de **talla** o **color**.

En listados solo se muestra el **principal** del grupo; el resto van como variantes en el selector. Así se evita saturar la web con cientos/miles de fichas sueltas.

---

## 1. Cambios en base de datos

### Columnas nuevas en `productos`

| Columna | Tipo sugerido | Descripción |
|---|---|---|
| `grupo` | `VARCHAR(64) NULL` + índice | Clave compartida del producto. Ej: `QBE001`, `QBTR0003S`, `QBP0004` |
| `variante_tipo` | `VARCHAR(16) NULL` | `talla`, `color` o `NULL` (sin selector) |
| `variante_label` | `VARCHAR(64) NULL` | Texto del botón/swatch. Ej: `60X60`, `100GR`, `Negro` |
| `es_principal` | `TINYINT(1) NOT NULL DEFAULT 0` + índice | `1` = ficha que aparece en listados; `0` = solo variante |

### SQL de migración (MySQL)

```sql
ALTER TABLE productos
  ADD COLUMN grupo VARCHAR(64) NULL AFTER codigo,
  ADD COLUMN variante_tipo VARCHAR(16) NULL AFTER grupo,
  ADD COLUMN variante_label VARCHAR(64) NULL AFTER variante_tipo,
  ADD COLUMN es_principal TINYINT(1) NOT NULL DEFAULT 0 AFTER variante_label;

CREATE INDEX productos_grupo_index ON productos (grupo);
CREATE INDEX productos_es_principal_index ON productos (es_principal);
```

> Ajusta el `AFTER` si el orden de columnas de tu tabla es distinto.

---

## 2. Reglas de negocio

1. **Mismo `grupo`** → aparecen juntas en una sola tarjeta/ficha.
2. Solo **un** registro del grupo debe tener `es_principal = 1`.
3. Si el grupo tiene **más de un** miembro:
   - `variante_tipo = 'talla'` → botones de texto (`60X60`, `500GR`, `1KG`…).
   - `variante_tipo = 'color'` → swatches / chips (`Negro`, `Gris`, `Rosa`…).
   - Cada miembro debe tener `variante_label` relleno.
4. Si el producto está **solo**:
   - `grupo` = su propio `codigo` (o el mismo valor único).
   - `es_principal = 1`
   - `variante_tipo = NULL`
   - `variante_label = NULL`
5. El principal **no tiene por qué** ser el código “base”. Puede ser el primero definido por negocio (Excel / catálogo).
6. Códigos distintos pueden compartir grupo si son el mismo artículo en otro formato/peso  
   (ej. `QBP0004` + `QBP0004/1` + `QBH019`).

### Ejemplo talla (empapadores)

| codigo | grupo | variante_tipo | variante_label | es_principal |
|---|---|---|---|---|
| QBE001 | QBE001 | talla | 60X60 | 1 |
| QBE001/1 | QBE001 | talla | 60X90 | 0 |

### Ejemplo color (transportín)

| codigo | grupo | variante_tipo | variante_label | es_principal |
|---|---|---|---|---|
| QBTR0003S-A | QBTR0003S | color | Negro | 1 |
| QBTR0003S-B | QBTR0003S | color | Gris | 0 |
| QBTR0003S-C | QBTR0003S | color | Azul | 0 |
| QBTR0003S-D | QBTR0003S | color | Rosa | 0 |

### Ejemplo pesos distintos (mismo snack)

| codigo | grupo | variante_tipo | variante_label | es_principal |
|---|---|---|---|---|
| QBP0004 | QBP0004 | talla | 530GR | 1 |
| QBP0004/1 | QBP0004 | talla | 100GR | 0 |
| QBH019 | QBP0004 | talla | 950GR | 0 |

---

## 3. Cómo debe comportarse el backend / API

### Listados (home, categoría, búsqueda)

1. Filtrar solo principales:

```sql
SELECT * FROM productos
WHERE es_principal = 1
  -- AND proveedor = 'QUIBROPETS'
  -- AND denominacion IN ('HIGIENE', ...)
ORDER BY orden, id;
```

2. Para cada principal, cargar hermanos:

```sql
SELECT * FROM productos
WHERE grupo = :grupo
ORDER BY id; -- o el orden de negocio que uséis
```

3. Devolver el producto + array `variantes`.

### Ficha de producto (`/producto/{id}`)

1. Buscar el producto por `id`.
2. Resolver su `grupo`.
3. Cargar todos los del grupo.
4. Mostrar la ficha del grupo (suele usarse el principal como “cara”) con la variante pedida preseleccionada.
5. Al cambiar talla/color: actualizar precio, imagen, stock y el SKU activo para el carrito.

### Contrato JSON orientativo

```json
{
  "id": 55,
  "codigo": "QBE001",
  "nombre": "EMPAPADOR QUIBRO 60x60...",
  "proveedor": "QUIBROPETS",
  "denominacion": "HIGIENE",
  "stock": 7648,
  "precio": 2.76,
  "precio_base": 2.76,
  "descuento": 0,
  "imagen": "https://...",
  "grupo": "QBE001",
  "variante_tipo": "talla",
  "variantes": [
    {
      "id": 55,
      "codigo": "QBE001",
      "label": "60X60",
      "tipo": "talla",
      "stock": 7648,
      "precio": 2.76,
      "precio_base": 2.76,
      "descuento": 0,
      "imagen": "https://...",
      "nombre": "EMPAPADOR QUIBRO 60x60..."
    },
    {
      "id": 56,
      "codigo": "QBE001/1",
      "label": "60X90",
      "tipo": "talla",
      "stock": 4820,
      "precio": 3.7,
      "precio_base": 3.7,
      "descuento": 0,
      "imagen": "https://...",
      "nombre": "EMPAPADOR QUIBRO 60x90..."
    }
  ],
  "selected_id": 55
}
```

---

## 4. Frontend (comportamiento)

- Si `variantes.length <= 1`: no mostrar selector.
- Si `variante_tipo === 'talla'`: botones con `label`.
- Si `variante_tipo === 'color'`: swatches (mapear label → color CSS si hace falta).
- Estado local: `selectedId` (por defecto `selected_id` o el `id` del principal).
- Al seleccionar variante: cambiar imagen, precio, stock visible y el id/código que se añade al carrito.
- **Importante:** el carrito debe guardar el SKU de la variante elegida, no solo el principal.

---

## 5. Relación con categorías (`denominacion`)

Son conceptos distintos:

| Campo | Uso |
|---|---|
| `denominacion` | Categoría de tienda (`HIGIENE`, `SNACKS NATURALES`, `COMEDEROS`…) |
| `grupo` | Variantes (talla/color) dentro de esa categoría |

Flujo típico:

1. Tienda → marca (QuibroPets).
2. Categoría por `denominacion`.
3. Listado de `es_principal = 1` de esa denominación.
4. Cada tarjeta abre ficha con variantes del `grupo`.

Algunos nombres de categoría en UI no coinciden 1:1 con BD. Ejemplos reales:

| UI | `denominacion` en BD |
|---|---|
| SNACKS GATOS | `SNACKS - GATO` |
| UTILIDAD GATO | `UTILIDAD-GATO` |
| JUGUETE PERRO | `JUGUETES` |
| COMEDEROS | `COMEDEROS` + `COMEDEROS-CERÁMICO` |

---

## 6. Cómo se rellenó el dato (referencia)

### A) Heurística por código (arranque)

- Prefijo antes de `/` → mismo grupo (`QBE001`, `QBE001/1`).
- Sufijos `-A/-B/-C` con hermanos → grupo de color (`QBTR0003S`).
- Sirve de base, pero **falla** cuando el mismo artículo tiene códigos distintos (`QBPx` vs `QBHx`).

### B) Excel de negocio (recomendado)

1. Orden de filas → campo `orden`.
2. Celdas **del mismo color contiguas** → mismo grupo de talla.
3. Columna de peso/medida → `variante_label`.
4. El **primero del bloque de color** → `es_principal = 1`.
5. Excel de faltantes con columnas:
   - A: código a crear
   - B: peso/label
   - C: nombre
   - D: código del grupo al que unirse  
   Si el código D estaba solo, se crea/amplía el grupo; si ya tenía variantes, se añade.

---

## 7. Checklist para implementar en la web actual

- [ ] Ejecutar `ALTER TABLE` + índices
- [ ] Rellenar `grupo`, `variante_tipo`, `variante_label`, `es_principal`
- [ ] Listados: filtrar `es_principal = 1`
- [ ] Anidar variantes del mismo `grupo` en la respuesta
- [ ] UI selector talla/color en tarjeta y/o ficha
- [ ] Carrito usa el id/código de la variante seleccionada
- [ ] Precios/descuentos se calculan por SKU (cada fila)
- [ ] Revisar casos con códigos distintos en el mismo grupo

---

## 8. Consultas útiles

### Ver un grupo

```sql
SELECT id, codigo, grupo, variante_tipo, variante_label, es_principal, stock, precio
FROM productos
WHERE grupo = 'QBE001'
ORDER BY es_principal DESC, id;
```

### Principales de una categoría

```sql
SELECT id, codigo, nombre, grupo, variante_tipo
FROM productos
WHERE es_principal = 1
  AND proveedor = 'QUIBROPETS'
  AND denominacion = 'HIGIENE'
ORDER BY orden, id;
```

### Grupos con más de una variante

```sql
SELECT grupo, COUNT(*) AS n, SUM(es_principal) AS principales
FROM productos
WHERE grupo IS NOT NULL AND grupo <> ''
GROUP BY grupo
HAVING n > 1
ORDER BY n DESC;
```

### Detectar grupos sin principal o con más de uno

```sql
SELECT grupo, SUM(es_principal) AS principales, COUNT(*) AS n
FROM productos
WHERE grupo IS NOT NULL AND grupo <> ''
GROUP BY grupo
HAVING principales <> 1;
```

---

## 9. Notas

- No hace falta tabla nueva de variantes: se reutiliza `productos`.
- Stock y precio siguen en cada fila.
- `orden` controla el orden de aparición en catálogo; es independiente del agrupado.
- Tras importar datos, validar siempre que cada `grupo` tenga **exactamente un** `es_principal = 1`.
