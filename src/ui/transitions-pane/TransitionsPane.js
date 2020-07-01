import barba from "@barba/core";
import anime from "animejs";

import {
  TRANSITION_INITIAL_DURATION,
  TRANSITION_INITIAL_DELAY,
  TRANSITION_LEAVE_DURATION,
  TRANSITION_ENTER_DURATION,
  TRANSITION_LEAVE_DELAY,
  TRANSITION_ENTER_DELAY,
} from "../../constants";

const SELECTOR = `[data-ui="transitions-pane"]`;

class TransitionsPane {
  constructor() {
    this.el = null;
  }

  get name() {
    return `TransitionsPane`;
  }

  init() {
    this.el = document.querySelector(SELECTOR);
    this.el.innerHTML = new Date();
    this._hooks();
    this._initial();
  }

  _initial() {
    anime({
      targets: this.el,
      opacity: [1, 0],
      duration: TRANSITION_INITIAL_DURATION,
      delay: TRANSITION_INITIAL_DELAY,
      easing: "linear"
    });
  }

  _hooks() {
    // when leaving page
    barba.hooks.leave(() => {
      return new Promise((resolve) => {
        anime({
          targets: this.el,
          opacity: [0, 1],
          duration: TRANSITION_LEAVE_DURATION,
          delay: TRANSITION_LEAVE_DELAY,
          easing: "linear",
          complete: resolve,
        });
      });
    });

    // when new page is entered
    barba.hooks.after(() => {
      return new Promise((resolve) => {
        anime({
          targets: this.el,
          opacity: [1, 0],
          duration: TRANSITION_ENTER_DURATION,
          delay: TRANSITION_ENTER_DELAY,
          easing: "linear",
          complete: resolve,
        });
      });
    });
  }
}

export default TransitionsPane;
