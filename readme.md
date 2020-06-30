# Concept des modules avec webpack chunk loading

* Un object ```modules[]``` sera le contenant tous les modules actifs sur une page
* Au chargement d'une page, on parse la source HTML, trouver les ```data-module="my-module"```, load module, call ```init()```, on skip si le module est déjà présent dans ```modules```
* si le module à une méthode destroy(), on l’invoke avant de passer à la page suivante, ensuite on le retire de ```modules```
* Les modules en dehors du ```barba-container``` ne sont pas initialisé à nouveau, donc ne pas inclure de méthode ```destroy()``` sur ces modules pour les garder en instance unique entre les pages

## Exemple d'un chunk loader

```js
const modules = [];
const elements = source.querySelectorAll(`[data-module]`);

// import each module as a webpack chunk
elements.forEach((el) => {
  const { initialized, module } = el.dataset;

  // stop here if already initialized
  if (initialized === `true`) return;

  // set element initialized
  el.dataset.initialized = true

  import(`@modules/${module}/`)
    .then((module) => {
      const { instance } = module.default;
      const { name } = typeof instance === `object` ? instance : null;

      // return if module already loaded
      if (modules[name]) return;

      // push instance to all modules
      if (instance && name) modules[name] = instance;

      // init attached instance
      if (typeof instance.init === `function`) instance.init();
    })
    .catch((e) => {
      console.error("Error loading module :", e);
    });
});
```

Source html :

```html

<body data-barba="wrapper">

  <!-- init() invoke 1 seule fois -->
  <header data-module="transitions-pane"></header>

  <main data-barba="container" data-barba-namespace="home">

    <!-- init() invoke à chaque changement de cette page -->
    <h4 data-module="foo">Should init FooBar module</h4>

    <!-- init() invoke à chaque changement de cette page -->
    <section data-module="sliders">
      <img src="image-1.jpg" alt="image 1">
      <img src="image-2.jpg" alt="image 2">
    </section>
    ...
```

Dans ce cas, le chunk loader ci-haut fera 3 imports & ```init()```, par contre le premier est à l'extérieur du ```data-barba="container"```, donc pas de destroy() entre les changements de page, un invoke ```init()``` unique.

```js
// has no destroy() method
import('modules/transitions-pane/index.js')
// has destroy() methods
import('modules/foo/index.js')
import('modules/sliders/index.js')
```

## Anatomie d'un module

Placer dans un répertoire unique chaque module, un fichier index.js qui va créer un object ```instance``` du module et l'exporter comme default

```js
// @modules/foo/index.js
import FoobarClass from './FoobarClass'

export const instance = new FoobarClass()

export default { instance }
```

Ensuite, dans le fichier incluant la Class, qui doit inclure :

* Constructor avec ses defaults
* une static method ```get name()```
* method ```init()```
  * si non présente, l'instance ne sera pas auto-init au changement de page
* method ```destroy()```
  * si non présente, l'instance ne sera pas détruite au changement de page
* Finalement invoquer via une balise ```<div data-module="my-name"></div>``` qui doit être exactement la valeur du dossier parent qui  contient ce module, c'est cette valeur que webpack match au moment du ```import(@modules/my-name)```


```js
// @modules/foo/FoobarClass.js
import './Foobar.style.scss'

const SELECTOR = `[data-module="foo"]`

class FoobarClass {

  constructor(defaultBoolean = true) {
    this._defaultBoolean = defaultBoolean;
    this._objects = [];
    this.el = null;
    this.emitter = new Emitter()
  }

  // should return this class instance name
  get name() {
    return `FoobarClass`;
  }

  init () {
    this._objects = ['foo', 'bar'];
    this.el = document.querySelector(SELECTOR)
  }

  destroy() {
    this._objects = [];
    this.el = null;
  }

}

export default FoobarClass
```

Le(s) fichiers CSS/SASS associés à un module sont dans le même dossier.

```css
/* @modules/foo/Foo.style.scss */
[data-module="foo"] {
  font-size: 4rem;
}
```