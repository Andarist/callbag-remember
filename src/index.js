const noop = () => {}
const UNIQUE = {}

export default function remember(source) {
  let sinks = []
  let inited = false
  let endValue = UNIQUE
  let ask
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

    if (sinks.length === 1) {
      source(0, (type, data) => {
        if (type === 0) {
          ask = data
          return
        }

        if (type === 1) {
          inited = true
          value = data
        }

        sinks.slice(0).forEach(sink => {
          sink(type, data)
        })

        if (type === 2) {
          endValue = data
          sinks = null
        }
      })
    }

    sink(0, (type, data) => {
      if (type === 0) return

      if (type === 1 && endValue === UNIQUE) {
        ask(1)
        return
      }

      const index = sinks.indexOf(sink)

      if (index !== -1) {
        sinks.splice(index, 1)
      }
    })

    if (inited && endValue === UNIQUE) {
      sink(1, value)
    }
  }
}
