import barba from "@barba/core";
import BarbaWebpackChunks from './plugins/barba.webpack-chunks'

// all UI elements
// import {  }

const BarbaWebpackChunksInstance = new BarbaWebpackChunks()
barba.use(BarbaWebpackChunksInstance)

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

barba.init({
  debug: true,
  prevent: ({ el }) => {
    if (
      /.pdf/.test(el.href.toLowerCase()) ||
      /.jpg/.test(el.href.toLowerCase()) ||
      /.png/.test(el.href.toLowerCase()) ||
      /.gif/.test(el.href.toLowerCase())
    ) {
      return true;
    }
  },
  transitions: [
    {
      name: "default-transition",
      leave: (data) => {
        // console.log(BarbaWebpackChunksInstance._modules);
      }
    },
  ],
});