import * as PIXI from 'pixi.js';
export const SELECTOR = `[data-module="module-large"]`;
import image from './cat.png';

class ModuleLarge {
  constructor() {
    this._speed = null;
  }

  // should return this class instance name
  get name() {
    return `ModuleLarge`;
  }

  init() {
    console.log(`Init ${this.name}`);

    // set values
    this._speed = 0.01;

    // register emitters
    this._registerEvents()

    // create elements
    document.querySelectorAll(SELECTOR).forEach((el) => {
      this._canvas(el)
    });
  }

  _registerEvents() {
    if(!this.emitter) return
    this.emitter.on('ModuleLarge.faster', () => {
      this._speed = this._speed + 0.005
    })
  }

  destroy() {
    console.log(`Destroy ${this.name}`);
    this._speed = null;
  }

  _canvas(el) {
    const app = new PIXI.Application({
      width: 1024,
      height: 768,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    });

    el.appendChild(app.view);

    const container = new PIXI.Container();

    app.stage.addChild(container);

    const texture = PIXI.Texture.from(image);

    for (let i = 0; i < 25; i++) {
      const bunny = new PIXI.Sprite(texture);
      bunny.anchor.set(0.5);
      bunny.x = (i % 5) * 120;
      bunny.y = Math.floor(i / 5) * 120;
      container.addChild(bunny);
    }

    // Move container to the center
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    // Listen for animate update
    app.ticker.add((delta) => {
        // rotate the container!
        // use delta to create frame-independent transform
        container.rotation -= this._speed * delta;
    });


  }

}

export default ModuleLarge;
