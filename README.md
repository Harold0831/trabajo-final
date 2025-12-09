# Sazón Pastel

Recetario web estático con diseño pastel y minimalista. Incluye buscador en vivo y páginas de detalle por receta.

## Estructura
- `public/index.html`: portada con hero, buscador y tarjetas de recetas.
- `public/recipe.html`: vista de detalle, poblada vía query `?id=`.
- `src/css/main.css`: estilos globales y componentes.
- `src/js/data.js`: catálogo de recetas (fuente de verdad editable).
- `src/js/main.js`: lógica para renderizar, buscar y mostrar detalles.

## Cómo correr en local
Opción recomendada (usa `npm run dev`):

```bash
npm install
npm run dev
# abre http://localhost:5173/
```

Opción rápida sin instalar dependencias locales (requiere `serve` global):

```bash
npm install -g serve
serve public
# abre http://localhost:3000/
```

## Uso rápido
- Teclea en el buscador para filtrar por nombre, ingredientes o etiquetas.
- Pulsa un chip para aplicar un filtro rápido y rellenar el buscador.
- Abre una tarjeta para ver ingredientes y pasos en `recipe.html`.

## Personalización
- Añade o edita recetas en `src/js/data.js` (campos: `id`, `title`, `description`, `time`, `difficulty`, `servings`, `tags`, `accent`, `accentSoft`, `ingredients`, `steps`).
- Ajusta la paleta pastel en `src/css/main.css` modificando las variables en `:root`.

## Próximos pasos sugeridos
- Añadir imágenes de cada receta en `src/assets/img/` y referenciarlas en el dataset.
- Crear `.gitignore` y `.editorconfig` con tus convenciones preferidas.
# trabajo-final
