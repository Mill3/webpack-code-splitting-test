import barba from "@barba/core";
import BarbaWebpackChunks from './plugins/barba.webpack-chunks'
import { before } from "lodash";

// all UI elements
// import {  }

const BarbaWebpackChunksInstance = new BarbaWebpackChunks()
barba.use(BarbaWebpackChunksInstance)

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

barba.init({
  debug: true,
  transitions: [
    {
      name: "default-transition",
      leave: (data) => {
        console.log(BarbaWebpackChunksInstance._modules);
      }
    },
  ],
});