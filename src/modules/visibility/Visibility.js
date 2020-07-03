
export const SELECTOR = `[data-module*="visibility"]`;

class Visibility {
  constructor() {
    this._observer = null;
    this._visible = this._visible.bind(this);
  }

  // should return this class instance name
  get name() {
    return `Visibility`;
  }

  init() {
    let options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.15
    }

    this._observer = new IntersectionObserver(this._visible, options);
    this._elements = document.querySelectorAll(SELECTOR);
    this._elements.forEach((el) => {
      this._observer.observe(el);
    })

    // window.addEventListener('scroll', () => {
    // })

  }

  destroy() {

  }

  _visible(entries, observer) {
    // console.log('observer:', entries, observer)
    entries.forEach(entry => {
      // console.log('entry:', entry)
      const { target, isIntersecting, isVisible } = entry
      console.log('target, isIntersecting, isVisible:', target, isIntersecting, isVisible)
      if(isIntersecting) {
        target.setAttribute('data-visible', 'true');
      }
    })
  }


}

export default Visibility;
