
export const SELECTOR = `[data-module="site-nav"]`;

class SiteNav {
  constructor() {
  }

  get name() {
    return `SiteNav`;
  }

  init() {
    console.log(`Init ${this.name}`);
  }

  destroy() {
    console.log(`Destroying ${this.name}`);
  }

}

export default SiteNav