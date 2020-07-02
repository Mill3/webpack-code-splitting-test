import './foobar.style.css'

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
    this.emitter.on('Foobar.dummy', this._dummy)
  }

  destroy() {
    this._objects = [];
    this.el = null;

    if(!this.emitter) return
    this.emitter.off('Foobar.dummy', this._dummy)
  }

  _dummy() {
    console.log(`Someone just called me!`)
    this.state.changeStatus(`Changed state.status for : ${new Date()}`)
    this.state.increment()
  }

}

export default FoobarClass