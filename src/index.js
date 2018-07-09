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

    let greeted = false
    sinks.push(sink)

    const talkback = (type, data) => {
      if (type === 0) return

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
      // sink starting subscription is safe to be marked as greeted right away
      // it shouldn't cause any issues with prevValue because there is no prevValue yet
      greeted = true

      source(0, (type, data) => {
        if (type === 0) {
          sourceTalkback = data
          sink(0, talkback)
          return
        }

        if (type === 1) {
          const prevValue = value
          value = data

          if (inited && !greeted) {
            sink(1, prevValue)
          }

          inited = true
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
    greeted = true

    if (inited && endValue === UNIQUE) {
      sink(1, value)
    }
  }
}
