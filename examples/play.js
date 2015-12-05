
var ac = new window.AudioContext()
var sf = require('../instruments/piano-24.json')
var sampler = require('..')
sampler.load(ac, sf).then(function (buffers) {
  console.log('buffers!')
  var piano = sampler(ac, buffers).connect(ac.destination)
  playNotes(piano)
})

function oneNote (piano) {
  var c3 = piano.sample('c3')
  var t = ac.currentTime
  c3.start(t).start(t + 0.5).start(t + 1)
}

function playNotes (piano) {
  'C D E F G A B A G F E D C'.split(' ').map(function (note, index) {
    piano.sample(note + '2').start(ac.currentTime + index * 0.5)
  })
  setInterval(function () {
    console.log('stop!')
    piano.stop()
  }, 2000)
}
