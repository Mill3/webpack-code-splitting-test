import barba from "@barba/core";

const SELECTOR = `[data-ui="dashboard"]`;
const CLASSNAME_OPEN = `--open`

class Dashboard {
  constructor() {
    this.el = null
    this._toggle = this._toggle.bind(this)
  }

  get name() {
    return `Dashboard`;
  }

  init() {
    this.el = document.querySelector(SELECTOR)
    this._registerEvents();
  }

  destroy() {
    console.log(`Destroying ${this.name}`);
    if(this.emitter) this.emitter.off('Dashboard.toggle', this._toggle)
  }

  _registerEvents() {
    barba.hooks.leave(() => this._close());

    if(!this.emitter) return
    this.emitter.on('Dashboard.toggle', this._toggle)
  }

  _toggle() {
    console.log(`should close or open dashboard`);
    this.el.classList.toggle(CLASSNAME_OPEN)
  }

  _close() {
    this.el.classList.remove(CLASSNAME_OPEN)
  }

}

export default Dashboard