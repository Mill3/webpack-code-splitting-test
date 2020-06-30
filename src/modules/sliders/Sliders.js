import imagesLoaded from "imagesloaded";
import Flickity from "flickity";
import "./sliders.style.css";

export const SELECTOR = `[data-module="sliders"]`;

class Sliders {
  constructor(defaultBoolean = true) {
    this._defaultBoolean = defaultBoolean;
    this._object = [];
  }

  // should return this class instance name
  get name() {
    return `Sliders`;
  }

  init() {
    console.log(`Init ${this.name}`);

    document.querySelectorAll(SELECTOR).forEach((el) => {
      imagesLoaded(el, () => {
        new Flickity(el, {
          adaptiveHeight: true,
          pageDots: false
        });
      });
    });
  }

  destroy() {
    console.log(`Destroying ${this.name}`);
    this._object = [];

  }

}

export default Sliders;
