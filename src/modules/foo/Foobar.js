import './foobar.style.css'
import Emitter from 'component-emitter'

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
    this._registerEvents()
  }

  _registerEvents() {
    if(!this.emitter) return

    this.emitter.on('foo.foo', (value1, value2) => {
      console.log('from FoobarClass :', value1, value2)
    })

    this.emitter.on('bar', () => {
      console.log('bar called')
    })
  }

  destroy() {
    this._objects = [];
    this.el = null;

    if(!this.emitter) return

    // this.emitter.removeListener('foo.foo')
    // this.emitter.removeListener('bar')
  }

}

export default FoobarClass