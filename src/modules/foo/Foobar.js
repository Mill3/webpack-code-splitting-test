import './foobar.style.css'

const SELECTOR = `[data-module="foo"]`

class FoobarClass {

  constructor(defaultBoolean = true) {
    this._defaultBoolean = defaultBoolean;
    this._objects = [];
    this.el = null;
    // this.emitter = new Emitter()
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