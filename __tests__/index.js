import forEach from 'callbag-for-each'
import pipe from 'callbag-pipe'
import subject from 'callbag-subject'
import fromIter from 'callbag-from-iter'
import tap from 'callbag-tap'

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

test('terminates', () => {
  let terminated = false

  const tapped = tap(() => {}, undefined, () => (terminated = true))
  const range$ = tapped(fromIter([10, 20, 30, 40]))
  const source$ = remember(range$)

  let actual = []

  pipe(
    source$,
    forEach(i => actual.push(i)),
  )

  expect(actual).toEqual([10, 20, 30, 40, 40])
  expect(terminated).toEqual(true)
})
