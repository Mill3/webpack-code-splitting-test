import { TweenMax } from 'gsap'

class SiteNavSubModule {
  constructor() {
  }

  init() {
    console.log(`init sub module with TweenMax`, TweenMax);
  }

}

const instance = new SiteNavSubModule()

export default { instance }