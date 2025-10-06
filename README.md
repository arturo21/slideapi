<h1 align="center">🎞️ slideapi.js</h1>
<p align="center">Slideshow declarativo, modular y extensible para <code>general.js</code></p>

<p align="center">
  <img src="https://img.shields.io/badge/versión-estable%20v1.0.0-blue.svg" alt="Versión estable">
  <img src="https://img.shields.io/badge/modular-extensible-orange.svg" alt="Modularidad">
  <img src="https://img.shields.io/badge/licencia-MIT-green.svg" alt="Licencia">
</p>

---

## ✨ Características

| Característica                     | Descripción                                                                 |
|------------------------------------|------------------------------------------------------------------------------|
| ✅ Declarativo por atributos `data-`| Configura el slideshow directamente en HTML                                 |
| 🧩 Modular y extensible             | Compatible con plugin systems y efectos personalizados                      |
| 🎞️ Animaciones visuales por clase   | Efectos desacoplados (`fade`, `slide`, `none`)                              |
| 🧃 Autoheight dinámico              | Ajusta la altura del contenedor según el contenido del slide                |
| 🧠 Metadata por slide               | Trazabilidad con `data-slide-meta`, `data-caption`, `data-slide-state`      |
| 🔘 Navegación externa               | Control desde botones con `data-slide-prev`, `data-slide-next`, `data-slide-go` |
| 🧠 API imperativa avanzada          | Métodos como `pause`, `resume`, `go`, `addSlide`, `removeSlide`, `getMeta` |
| 🧪 Debug visual y trazabilidad      | `console.groupCollapsed`, dataset por slide, inspección DOM                 |
| 🧬 Integración con `general.js`     | Compatible con `g(selector)` para control declarativo e imperativo          |


## 🧠 Funciones disponibles

| Método                    | Descripción                                                                 |
|---------------------------|------------------------------------------------------------------------------|
| `initSlideshow(el)`       | Inicializa el slideshow en el elemento especificado                         |
| `slideNext()`             | Avanza al siguiente slide                                                   |
| `slidePrev()`             | Retrocede al slide anterior                                                 |
| `slideGo(index)`          | Navega a un slide específico                                                |
| `slidePause()`            | Pausa el autoplay                                                           |
| `slidePlay()`             | Reanuda el autoplay                                                         |
| `slideDestroy()`          | Elimina el slideshow y limpia el DOM                                        |
| `getCurrentSlide()`       | Devuelve el índice del slide activo                                         |
| `getSlideMeta()`          | Devuelve metadata del slide activo                                          |
| `addSlide(node, meta)`    | Agrega dinámicamente un nuevo slide con metadata opcional                   |
| `removeSlide(index)`      | Elimina un slide por índice                                                 |
| `setFx(name)`             | Cambia el efecto visual en tiempo real                                      |
| `registerEffect(name, fn)`| Registra un nuevo efecto visual personalizado                               |
| `getSlideshow(elOrId)`    | Devuelve la instancia API del slideshow por elemento o ID                   |

## 🧩 Atributos `data-slide-*` disponibles

| Atributo                | Tipo       | Descripción                                                                 | Valor por defecto |
|-------------------------|------------|------------------------------------------------------------------------------|-------------------|
| `data-slide-fx`         | `string`   | Tipo de efecto visual (`fade`, `slide`, `none`)                             | `"fade"`          |
| `data-slide-timeout`    | `number`   | Tiempo en milisegundos entre transiciones automáticas                       | `3000`            |
| `data-slide-autoheight`| `boolean`  | Ajusta automáticamente la altura del contenedor al contenido del slide      | `false`           |
| `data-slide-meta`       | `boolean`  | Activa trazabilidad por slide (`data-slide-state`, `data-caption`, etc.)    | `false`           |
| `data-slide-pager`      | `string`   | Selector del contenedor de paginación externa                               | `null`            |
| `data-slide-on-start`   | `string`   | Nombre de función global que se ejecuta al iniciar un slide                 | `null`            |
| `data-slide-on-end`     | `string`   | Nombre de función global que se ejecuta al finalizar un ciclo               | `null`            |


## 📦 Changelog

| Versión  | Fecha       | Cambios realizados                                                                 |
|----------|-------------|------------------------------------------------------------------------------------|
| `v1.0.0` | 2025-10-06   | Versión avanzada con arquitectura modular, trazabilidad y API imperativa completa |
|          |              | - Registro de efectos visuales personalizados (`registerEffect`)                 |
|          |              | - Navegación externa por atributos declarativos (`data-slide-*`)                 |
|          |              | - Metadata por slide (`data-caption`, `data-slide-state`, `data-slide-meta`)     |
|          |              | - API imperativa con `addSlide`, `removeSlide`, `getSlideMeta`, `setFx`          |
|          |              | - Debug visual con `console.groupCollapsed` y dataset por slide                  |
|          |              | - Integración declarativa e imperativa con `general.js`                          |

## Ejemplo Básico Declarativo
```html
<div id="galeria" class="slide-show"
     data-slide-fx="fade"
     data-slide-timeout="4000"
     data-slide-autoheight="true"
     data-slide-meta="true">
  <img src="img1.jpg" data-caption="Primera imagen">
  <img src="img2.jpg" data-caption="Segunda imagen">
  <img src="img3.jpg" data-caption="Tercera imagen">
</div>

<button data-slide-prev="galeria">Anterior</button>
<button data-slide-next="galeria">Siguiente</button>

<script>
  g('#galeria').initSlideshow();
</script>
```

## Ejemplo Básico Sólo con JS
```html
<div id="slideshow-container"></div>
<button id="btn-next">Siguiente</button>
<button id="btn-prev">Anterior</button>
```

```javascript
// Crear el contenedor dinámicamente
const container = g('div')
  .addClass('slide-show')
  .attr({
    id: 'galeria-js',
    'data-slide-fx': 'fade',
    'data-slide-timeout': '3000',
    'data-slide-autoheight': 'true',
    'data-slide-meta': 'true'
  })
  .appendTo('body');

// Crear slides dinámicamente
const slides = [
  { src: 'img1.jpg', caption: 'Primera imagen' },
  { src: 'img2.jpg', caption: 'Segunda imagen' },
  { src: 'img3.jpg', caption: 'Tercera imagen' }
];

slides.forEach(({ src, caption }) => {
  g('img')
    .attr({ src, 'data-caption': caption })
    .appendTo(container);
});

// Inicializar slideshow con gdom
const api = g('#galeria-js').initSlideshow();

// Crear botones externos con gdom
g('button')
  .text('⟵ Anterior')
  .on('click', api.slidePrev)
  .appendTo('body');

g('button')
  .text('Siguiente ⟶')
  .on('click', api.slideNext)
  .appendTo('body');

```

## 📦 Instalación

### CDN
```html
<script src="https://cdn.underdevelopment.work/generaljs/slideapi.js"></script>
