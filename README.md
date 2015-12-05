# sampler.js

A simple audio sampler:

```js
var sampler = require('sampler.js')
loader.load('piano').then(function (buffers) {
var piano = midi(sampler(ac, buffers, { poly: 8, adsr: [0.2, 0.2, 0.7, 1]}))
  piano.play('c2')
})

var saw = sampler(ac, buffers, {
  poly: 1,
  loop: true, // loop samples
  map: { 1: [1, 10] }
  mapMode: 'transpose'
})
