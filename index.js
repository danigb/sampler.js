var load = require('soundfont-loader')

function noop () {}

function Sampler (ac, buffers, preset) {
  preset = preset || {}
  var output = ac.createGain()
  output.gain.value = preset.gain || 1

  var sampler = { emit: noop }
  sampler.connect = function (destination) {
    output.connect(destination)
    return sampler
  }
  sampler.sample = function (name, options) {
    options = options || {}
    var buffer = buffers[name]
    if (!buffer) return
    return {
      start: function (when, offset, duration) {
        when = when || ac.currentTime
        offset = offset || 0
        duration = duration || buffer.length - offset
        var source = ac.createBufferSource()
        source.sampleName = name
        source.buffer = buffer
        source.loop = options.loop || false
        source.connect(output)
        track(source)
        source.start(when, offset, duration)

        return {
          stop: function (when) { source.stop() },
          start: function (when, offset, duration) {
            return sampler.sample(name, options).start(when, offset, duration)
          }
        }
      }
    }
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
    source.onended = bufferEnded
    tracked[source.id] = source
  }

  function bufferEnded (e) {
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
