# sampler.js

A simple audio sampler:

```js
var ac = new AudioContext()
var sampler = require('sampler-inst')(ac)
var loader = require('soundfont-loader')(ac)
loader.load('piano', loader.).then(function (audioBuffers) {
  piano = sampler.instrument(audioBuffers, { poly: 8, adsr: [0.2, 0.2, 0.7, 1] })
})



var saw = sampler(ac, buffers, {
  poly: 1,
  loop: true, // loop samples
  map: { 1: [1, 10] }
  mapMode: 'transpose'
})
