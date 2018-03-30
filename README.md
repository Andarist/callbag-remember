# callbag-remember

Callbag operator which shares input stream between subscribers and emits last emitted value upon subscription. It behaves pretty much as Rx's [`.shareReplay(1)`](https://www.learnrxjs.io/operators/multicasting/sharereplay.html).

## Example

```js
import fromEvent from 'callbag-from-event'
import forEach from 'callbag-for-each'
import map from 'callbag-map'
import merge from 'callbag-merge'
import pipe from 'callbag-pipe'
import remember from 'callbag-remember'

const focus$ = remember(
  merge(
    map(() => false)(fromEvent(window, 'blur')),
    map(() => true)(fromEvent(window, 'focus')),
  ),
)

pipe(
  focus$,
  forEach(tabFocused => {
    // ...
  }),
)

// ...

setTimeout(() => {
  pipe(
    focus$,
    forEach(tabFocused => {
      // ... will get last emitted value immediately
    }),
  )
}, 1000)
```
