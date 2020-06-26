import imagesLoaded from 'imagesloaded'
import Flickity from 'flickity'
import './sliders.style.css'

export const SELECTOR = `[data-module="sliders"]`

export default () => {
  console.log(`init all sliders`);
  document.querySelectorAll(SELECTOR).forEach(el => {
    imagesLoaded(el, () => {
      console.log(`image loaded for`, el);
      new Flickity(el, {
        adaptiveHeight: true
      })
    })
  })
}