import imagesLoaded from "imagesloaded";
import Flickity from "flickity";
import "./sliders.style.css";

export const SELECTOR = `[data-module="sliders"]`;

class Sliders {
  constructor() {
    this.sliders = []
    this._reload = this._reload.bind(this)
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
      imagesLoaded(el, () => {
        const s = new Flickity(el, {
          adaptiveHeight: true,
          pageDots: false
        });
        this.sliders.push(s)
      });
    });
  }

  destroy() {
    this.sliders = [];
    this.emitter.off('Sliders.reload', this._reload)
  }

  _registerEvents() {
    if(!this.emitter) return
    this.emitter.on('Sliders.reload', this._reload)
  }

  // dummy method acting on all sliders
  _reload() {
    [...this.sliders].forEach(slider => {
      slider.next(true)
    })
  }

}

export default Sliders;
