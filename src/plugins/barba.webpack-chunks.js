/**
 * @mill3-packages/barba-scripts
 * <br><br>
 * ## Barba Scripts.
 *
 * - Add external scripts from head
 * - Manage inlined scripts in next.container
 *
 * @module barba-scripts
 * @preferred
 */

import EventEmitter2 from 'eventemitter2'

const VERSION = `0.0.1`;

const MODULES_SELECTOR = `[data-module]`;
const UI_SELECTOR = `[data-ui]`;

export class WebpackChunks {
  constructor() {
    this.name = "@barba/webpack-chunks";
    this.version = VERSION;
    this.barba;
    this.logger;

    this._parser;
    this._modules = [];
    this._ui = [];
    this._emitter = null;
    this._state = {};
  }

  /**
   * Plugin installation.
   */
  install(barba) {
    this.logger = new barba.Logger(this.name);
    this.logger.info(this.version);

    this.barba = barba;

    this._parser = new DOMParser();
    this._emitter = new EventEmitter2({
      wildcard: true,
    })

    // Application State example
    this._state = {
      initial: true,
      count: 0,
      changeStatus: (value) => {
        this._state.initial = value
      },
      increment: () => {
        this._state.count++
      }
    }
  }

  /**
   * Plugin installation.
   */
  init() {
    // afterLeave, new page is ready, parse and load modules
    this.barba.hooks.beforeEnter(this._beforeEnter, this);

    // prev page is gone, init all module
    this.barba.hooks.after(this._after, this);

    // when leaving
    this.barba.hooks.beforeLeave(this._beforeLeave, this);
  }


  /**
   * `beforeLeave` hook.
   */
  _beforeLeave() {
    // Remove and destroy all module with a destroy() func
    Object.keys(this._modules).forEach((m) => {
      if (typeof this._modules[m].destroy !== `function`) return
      this._modules[m].destroy();
      delete this._modules[m]
    });
  }

  /**
   * `beforeEnter` hook.
   */
  _beforeEnter({ next }) {
    return new Promise((resolve) => {
      const { initial } = this._state
      const source = this._parser.parseFromString(next.html, "text/html");

      this._importModules(source);

      // import UI only on intial load
      if(initial) this._importUI(source);

      // set initial state to false
      if(initial) this._state.changeStatus(false)

      return resolve()
    });
  }

  /**
   * `after` hook, init() all modules only
   */
  _after() {
    // console.log(this._emitter);
    // noop
  }

   /**
   * the module importer, look for data-module entries in DOM source
   */
  _importModules(source, autoinit = false) {
    let elements = source.querySelectorAll(MODULES_SELECTOR);

    // import each module as a webpack chunk
    elements.forEach((el) => {
      const { initialized, module } = el.dataset;

      // element can cast 1 or multiple modules, each seperated by a coma
      const modules = module.split(',')

      // stop here if already initialized
      if (initialized === `true`) return;

      // set element initialized
      el.dataset.initialized = true

      // try to load each module attached
      modules.forEach(module => {
        import(`@modules/${module}/`)
          .then((module) => {
            const { instance } = module.default;
            const { name } = typeof instance === `object` ? instance : null;

            // return if module already loaded
            if (this._modules[name]) return;

            // push instance to all modules
            if (instance && name) this._modules[name] = instance;

            // attach emitter to instance
            instance.emitter = this._emitter

            // attach state
            instance.state = this._state

            // init attached instance
            if (typeof instance.init === `function`) instance.init();
          })
          .catch((e) => {
            console.error("Error loading module :", e);
          });
      })

    });
  }

  /**
   * the module importer, look for data-module entries in DOM source
   */
  _importUI(source) {
    let elements = source.querySelectorAll(UI_SELECTOR);

    // import each module as a webpack chunk
    elements.forEach((el) => {
      const { initialized, ui } = el.dataset;

      // stop here if already initialized
      if (initialized === `true`) return;

      // set element initialized
      el.dataset.initialized = true

      import(`@ui/${ui}/`)
        .then((module) => {
          const { instance, emitter } = module.default;
          const { name } = typeof instance === `object` ? instance : null;

          // return if UI already loaded
          if (this._ui[name]) return;

          // push instance to all UI
          if (instance && name) this._ui[name] = instance;

          // attach emitter to instance
          instance.emitter = this._emitter

          // attach state
          instance.state = this._state

          // init attached instance
          if (typeof instance.init === `function`) instance.init();
        })
        .catch((e) => {
          console.error("Error loading UI :", e);
        });
    });

  }

}

export default WebpackChunks;
