const noop = () => {}
const UNIQUE = {}

export default function remember(source) {
  let sinks = []
  let inited = false
  let endValue = UNIQUE
  let sourceTalkback
  let value

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

    const talkback = (type, data) => {
      if (type === 2) {
        const index = sinks.indexOf(sink)

        if (index !== -1) {
          sinks.splice(index, 1)
        }

        return
      }

      if (endValue !== UNIQUE) {
        return
      }

      sourceTalkback(type, data)
    }

    if (sinks.length === 1) {
      source(0, (type, data) => {
        if (type === 0) {
          sourceTalkback = data
          sink(0, talkback)
          return
        }

        if (type === 1) {
          inited = true
          value = data
        }

        const sinksCopy = sinks.slice(0)

        if (type === 2) {
          endValue = data
          sinks = null
        }

        sinksCopy.forEach(sink => {
          sink(type, data)
        })
      })

      return
    }

    sink(0, talkback)

    if (inited && endValue === UNIQUE) {
      sink(1, value)
    }
  }
}
