var load = require('soundfont-loader')

function Sampler (ac, buffers, preset) {
  preset = preset || {}
  var output = ac.createGain()
  output.gain.value = preset.gain || 1

  var sampler = {}
  sampler.connect = function (destination) {
    output.connect(destination)
    return sampler
  }
  sampler.sample = function (note, options) {
    options = options || {}
    var buffer = buffers[note]
    if (!buffer) return
    var source = ac.createBufferSource()
    source.buffer = buffer
    source.loop = options.loop || false
    source.connect(output)
    track(source)
    return source
  }
  sampler.stop = function (when) {
    when = when || 0
    Object.keys(tracked).forEach(function (id) {
      tracked[id].stop(when)
      delete tracked[id]
    })
  }

  var nextId = 0
  var tracked = {}
  function track (source) {
    source.id = nextId++
    tracked[source.id] = source
    source.addEventListener('ended', onBufferEnded)
  }

  function onBufferEnded (e) {
    var source = e.target
    source.stop()
    source.disconnect()
    delete tracked[source.id]
  }

  return sampler
}
Sampler.load = load

if (typeof module === 'object' && module.exports) module.exports = Sampler
if (typeof window !== 'undefined') window.Sampler = Sampler
