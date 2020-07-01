# Concept des modules avec webpack chunk loading

* Un object ```modules[]``` sera le contenant tous les modules actifs sur une page
* Au chargement d'une page, on parse la source HTML, trouver les ```data-module="my-module"```, load module, call ```init()```, on skip si le module est déjà présent dans ```modules```
* si le module à une méthode destroy(), on l’invoke avant de passer à la page suivante, ensuite on le retire de ```modules```
* Les modules en dehors du ```barba-container``` ne sont pas initialisé à nouveau, donc ne pas inclure de méthode ```destroy()``` sur ces modules pour les garder en instance unique entre les pages
* Les modules en chunk JS et CSS sont chargé et caché dans le ```<head>``` sur demande dès qu'un module est invoké la première fois, Webpack gère ensuite automatiquement les imports déjà présent dans le ```<head>``` si invoké à nouveau, permettant ainsi un app.bundle de base plus petit

## Exemple d'un chunk loader

```js
const modules = [];
const elements = source.querySelectorAll(`[data-module]`);
const emitter = new EventEmitter2()

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

      // attach emitter to instance
      instance.emitter = emitter

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
import('ui/transitions-pane/index.js')
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
const SELECTOR = `[data-module="foo"]`

class FoobarClass {

  constructor(defaultBoolean = true) {
    this._defaultBoolean = defaultBoolean;
    this._objects = [];
    this.el = null;
    this._dummy = this._dummy.bind(this)
  }

  // should return this class instance name
  get name() {
    return `FoobarClass`;
  }

  init () {
    this._objects = ['foo', 'bar'];
    this.el = document.querySelector(SELECTOR)
    this._registerEvents()
  }

  _registerEvents() {
    if(!this.emitter) return
    this.emitter.once('Foobar.dummy', this._dummy)
  }

  destroy() {
    this._objects = [];
    this.el = null;

    if(!this.emitter) return
    this.emitter.off('Foobar.dummy', this._dummy)
  }

  _dummy() {
    console.log(`Someone just called me, only once!`)
  }

}

```

Le(s) fichiers CSS/SASS associés à un module sont dans le même dossier.

```SCSS
/* @modules/foo/Foo.style.scss */
[data-module="foo"] {
  font-size: 4rem;
}
```

## Event Emitters

Un traversal système est souvent nécessaire pour permettre un ou plusieurs module de communiquer entre eux.

Exemple type, module ```SiteNav.js``` et ```MegaMenu.js```, les élément du menu doivent ouvrir le mega menu en ```:hover```, donc envoyer un event ```Emitter.emit("MegaMenu.open")```.

Chaque module reçoit le même emitter global, à partir duquel il pourra attacher des events.

```js
\\ app.js

const emitter = new EventEmitter2()
const FoobarClassInstance = new FoobarClass()
FoobarClassInstance.emitter = emitter

```

Ensuite dans la class

```js
// @modules/foo/FoobarClass.js
_registerEvents() {
  if(!this.emitter) return
  this.emitter.once('Foobar.dummy', this._dummy)
}

_dummy() {
  console.log(`Act Act !`)
}

```

Finalement dans un autre module :

```js
// @modules/site-nav/SiteNav.js
button.addEventListener(`mouseenter`, this.emitter.emit('Foobar.dummy'))

```