import barba from "@barba/core";
import anime from 'animejs'
import('./transitions-pane.style.scss')

import { TRANSITION_LEAVE_DURATION, TRANSITION_ENTER_DURATION, TRANSITION_LEAVE_DELAY, TRANSITION_ENTER_DELAY, SLEEP } from '../../constants'

const SELECTOR = `[data-module="transitions-pane"]`

class TransitionsPane {
  constructor() {
    // this.start()
    this.el = null
  }

  get name() {
    return `TransitionsPane`;
  }

  init() {
    this.el = document.querySelector(SELECTOR)
    this._hooks();
  }

  _hooks() {

    // when leaving page
    barba.hooks.leave(() => {
      return new Promise(resolve => {
        anime({
          targets: this.el,
          opacity: [0, 1],
          duration: TRANSITION_LEAVE_DURATION,
          delay: TRANSITION_LEAVE_DELAY,
          easing: "linear",
          complete: resolve
        });
      });
    })

    // when new page is entered
    barba.hooks.after(() => {
      return new Promise(resolve => {
        anime({
          targets: this.el,
          opacity: [1, 0],
          duration: TRANSITION_ENTER_DURATION,
          delay: TRANSITION_ENTER_DELAY,
          easing: "linear",
          complete: resolve
        });
      });
    })

  }

}

export default TransitionsPane