import imagesLoaded from "imagesloaded";
import Flickity from "flickity";
import "./sliders.style.css";

export const SELECTOR = `[data-module*="sliders"]`;

class Sliders {
  constructor() {
    this.sliders = []
    this._next = this._next.bind(this)
    this._change = this._change.bind(this)
  }

  // should return this class instance name
  get name() {
    return `Sliders`;
  }

  init() {
    console.log(`Init ${this.name}`);

    // register events on global Emitter
    this._registerEvents()

    //
    document.querySelectorAll(SELECTOR).forEach((el) => {
      console.log('el:', el)
      imagesLoaded(el, () => {
        const s = new Flickity(el, {
          adaptiveHeight: true,
          pageDots: false,
          on: {
            change: (index) =>  this.emitter.emit('Sliders.change', index)
          }
        });

        this.sliders.push(s)
      });
    });
  }

  destroy() {
    [...this.sliders].forEach(slider => {
      slider.destroy()
    })

    // empty holder
    this.sliders = [];

    if(!this.emitter) return
    this.emitter.off('Sliders.next', this._next)
    this.emitter.off('Sliders.change', this._change)
  }

  _registerEvents() {
    if(!this.emitter) return
    this.emitter.on('Sliders.next', this._next)
    this.emitter.on('Sliders.change', this._change)
  }

  _next() {
    [...this.sliders].forEach(slider => {
      slider.next(true)
    })
  }

  _change(index) {
    console.log(`slide has changed to : ${index}`);
  }

}

export default Sliders;
