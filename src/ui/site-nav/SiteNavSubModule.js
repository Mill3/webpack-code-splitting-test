import { TweenMax } from 'gsap'

class SiteNavSubModule {
  init() {
    console.log(`init sub module with TweenMax`);
  }

}

const instance = new SiteNavSubModule()

export default { instance }