import charming from 'charming'

export const SELECTOR = `[data-module*="typography"]`;

class Typography {
  constructor() {

  }

  // should return this class instance name
  get name() {
    return `Typography`;
  }

  init() {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      charming(el)
    })

  }

  destroy() {

  }


}

export default Typography;
