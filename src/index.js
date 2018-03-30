export default function remember(source) {
  const sinks = []
  let inited = false
  let ask
  let value

  return (start, sink) => {
    if (start !== 0) return
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
          sinks = []
        }
      })
    }

    sink(0, (type, data) => {
      if (type === 0) return

      if (type === 1) {
        ask(1)
        return
      }

      const index = sinks.indexOf(sink)

      if (index !== -1) {
        sinks.splice(index, 1)
      }
    })

    if (inited) {
      sink(1, value)
    }
  }
}
