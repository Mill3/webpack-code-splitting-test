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

## Anatomie d'un module

Placer dans un répertoire unique chaque module, un fichier index.js qui va créer un object ```instance``` du module et l'exporter comme default

```js
// modules/sliders/index.js
import FoobarClass from './Foobar'

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
* Finalement invoquer via une balise ```<div data-module="my-name"></div>``` qui doit être exactgement la valeur du dossier parent qui  contient le module, c'est cette valeur que webpack match avec ```import(@modules/my-name)```


```js
import './foobar.style.css'

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