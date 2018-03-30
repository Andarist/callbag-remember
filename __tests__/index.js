import forEach from 'callbag-for-each'
import pipe from 'callbag-pipe'
import subject from 'callbag-subject'

import remember from '../src'

test('works', () => {
  const actual = []
  let next

  const mock = subject()
  const source = remember(mock)

  pipe(
    source,
    forEach(data => {
      actual.push(['1', data])
    }),
  )

  pipe(
    source,
    forEach(data => {
      actual.push(['2', data])
    }),
  )

  return Promise.resolve()
    .then(() => mock(1, 0))
    .then(() => mock(1, 1))
    .then(() => {
      pipe(
        source,
        forEach(data => {
          actual.push(['3', data])
        }),
      )
    })
    .then(() => mock(1, 2))
    .then(() => mock(1, 3))
    .then(() => {
      expect(actual).toEqual([
        ['1', 0],
        ['2', 0],
        ['1', 1],
        ['2', 1],
        ['3', 1],
        ['1', 2],
        ['2', 2],
        ['3', 2],
        ['1', 3],
        ['2', 3],
        ['3', 3],
      ])
    })
})
