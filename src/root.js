import barba from '@barba/core';

const SELECTOR = `[data-module]`

const initModules = (source) => {
  let modules = [...source.querySelectorAll(SELECTOR)].map(el => el.dataset.module)

  modules.forEach(file => {
    // let banner = `/* webpackChunkName: "${file}" */`
    import(`./${file}`).then(module => {
      const init = module.default
      if (typeof init === `function`) init()
    }).catch(e => {
      console.error('Error loading module :', e)
    })
  })

}

barba.init({
  transitions: [{
    name: 'default-transition',
    leave() {
      // create your stunning leave animation here
    },
    enter() {
      // create your amazing enter animation here
    },
    after({ next }) {
      var parser = new DOMParser();
      let source = parser.parseFromString(next.html, "text/html");
      let classNames = source.querySelector("body").classList;

      initModules(source)

      // apply new classList to body
      document.body.classList = classNames;
    }
  }]
});

let body = document.querySelector(`body`)
initModules(body)