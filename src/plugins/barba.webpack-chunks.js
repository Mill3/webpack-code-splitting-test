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

const VERSION = `0.0.1`;

const MODULES_SELECTOR = `[data-module]`;

export class WebpackChunks {
  constructor() {
    this.name = "@barba/webpack-chunks";
    this.version = VERSION;
    this.barba;
    this.logger;

    this._parser;
    this._source;
    this._modules = [];
    this._emitters = [];
  }

  /**
   * Plugin installation.
   */
  install(barba) {
    this.logger = new barba.Logger(this.name);
    this.logger.info(this.version);

    this.barba = barba;

    this._parser = new DOMParser();
  }

  /**
   * Plugin installation.
   */
  init() {
    // DEBUG
    this.barba.hooks.before(() => {
      console.time(`transition-starts`);
    });

    // afterLeave and initial, parse and load modules
    this.barba.hooks.beforeEnter(this._beforeEnter, this);

    // when leaving
    this.barba.hooks.beforeLeave(this._beforeLeave, this);

    // DEBUG
    this.barba.hooks.after(() => {
      console.timeEnd(`transition-starts`);
    });
  }


  /**
   * `beforeLeave` hook.
   */
  _beforeLeave() {
    // Remove and destroy all module with a destroy() func
    Object.keys(this._modules).forEach((m) => {
      if (typeof this._modules[m].destroy === `function`) {
        this._modules[m].destroy();
        delete this._modules[m]
      }
    });

    // empty all
    // this._emitters = [];
  }

  /**
   * `beforeEnter` hook.
   */
  _beforeEnter({ next }) {
    return new Promise((resolve) => {
      let source = this._parser.parseFromString(next.html, "text/html");
      return this._importModules(source, resolve);
    });
  }

   /**
   * the module importer, look for data-module entries in DOM source
   */
  _importModules(source, resolve) {
    let elements = source.querySelectorAll(MODULES_SELECTOR);

    // import each module as a webpack chunk
    elements.forEach((el) => {
      const { initialized, module } = el.dataset;

      // stop here if already initialized
      if (initialized === `true`) return;

      // set element initialized
      el.dataset.initialized = true

      import(`@modules/${module}/`)
        .then((module) => {
          const { instance, emitter } = module.default;
          const { name } = typeof instance === `object` ? instance : null;

          // return if module already loaded
          if (this._modules[name]) return;

          // push instance to all modules
          if (instance && name) this._modules[name] = instance;

          // TODO: handles emitters
          // push emitter
          // if(emitter && name) this._emitters[name] = emitter
          // attach all emitters to instance
          // instance.invokeEmitter = this._invokeEmitter.bind(this._invokeEmitter)

          // init attached instance
          if (typeof instance.init === `function`) instance.init();
        })
        .catch((e) => {
          console.error("Error loading module :", e);
        });
    });

    // resolve when all modules are imported
    return resolve()
  }

}

export default WebpackChunks;
