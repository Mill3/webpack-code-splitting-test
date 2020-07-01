export const SELECTOR = `[data-ui="site-nav"]`;

class SiteNav {
  constructor() {
    this.el = null
    this.buttonA = null
    this.buttonB = null
    this._clickA = this._clickA.bind(this)
    this._clickB = this._clickB.bind(this)
  }

  get name() {
    return `SiteNav`;
  }

  init() {
    this.el = document.querySelector(SELECTOR)
    this.buttonA = this.el.querySelector(`a.button-a`)
    this.buttonB = this.el.querySelector(`a.button-b`)
    this._bindEvents()
  }

  _bindEvents() {
    this.buttonA.addEventListener(`click`, this._clickA)
    this.buttonB.addEventListener(`click`, this._clickB)
  }

  _clickA() {
    // do something with sliders
    this.emitter.emit('Sliders.reload');
    this.emitter.emit('Foobar.dummy');
  }

  _clickB() {
    // import a sub-module and run init()
    import('./SiteNavSubModule').then((module) => {
      const { instance } = module.default;
      instance.init()
    })

    this.emitter.emit('Dashboard.toggle');
  }

}

export default SiteNav