export const SELECTOR = `[data-module="site-nav"]`;

class SiteNav {
  constructor() {
    this.el = null
    this.button = null
    this._click = this._click.bind(this)
  }

  get name() {
    return `SiteNav`;
  }

  init() {
    console.log(this.name, this._click);

    this.el = document.querySelector(SELECTOR)
    this.button = this.el.querySelector(`a.button`)
    console.log('this.button:', this.button)
    this._bindEvents()
  }

  destroy() {
    console.log(`Destroying ${this.name}`);
    // this._unbindEvents();
    // this.el = null;
    // this.button = null;
  }

  _bindEvents() {
    this.button.addEventListener(`click`, this._click)
  }

  _unbindEvents() {
    this.button.removeEventListener(`click`, this._click)
  }

  _click() {
    console.log(`click click`);
    import('./SiteNavSubModule').then((module) => {
      console.log('module:', module)
      const { instance, emitter } = module.default;
      instance.init()
    })
  }

}

export default SiteNav