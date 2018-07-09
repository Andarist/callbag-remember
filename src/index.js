const noop = () => {}
const UNIQUE = {}

export default function remember(source) {
  let sinks = []
  let inited = false
  let endValue = UNIQUE
  let ask
  let value
  let handshook = [] // array of booleans of whether or not we've returned a greeting

  return (start, sink) => {
    if (start !== 0) return

    if (endValue !== UNIQUE) {
      sink(0, noop)
      if (inited) {
        sink(1, value)
      }
      sink(2, endValue)
      return
    }

    sinks.push(sink)
    handshook.push(false)

    const talkback = (type, data) => {
      if (type === 0) return

      if (type === 1 && endValue === UNIQUE) {
        ask(1)
        return
      }

      if (type === 2) {
        const index = sinks.indexOf(sink)

        if (index !== -1) {
          sinks.splice(index, 1)
          handshook.splice(index, 1)
        }
      }
    }

    if (sinks.length === 1) {
      // first subscriber, so subscribe to source
      source(0, (type, data) => {
        if (type === 0) {
          ask = data
          return
        }

        if (type === 1) {
          inited = true
          value = data
        }

        sinks.slice(0).forEach((sink, index) => {
          if (!handshook[index]) {
            sink(0, talkback)
            handshook[index] = true
          }
          sink(type, data)
        })

        if (type === 2) {
          endValue = data
          sinks = []
        }
      })
    }

    if (!handshook[handshook.length - 1]) {
      // handshake may have already happened synchronously (see above)
      // upon subscribing to source
      sink(0, talkback)
      handshook[handshook.length - 1] = true
      if (inited && endValue === UNIQUE) {
        sink(1, value)
      }
    }
  }
}
