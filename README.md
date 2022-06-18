# @ts-awesome/profiler

TypeScript friendly dead-simple profiler library

## Base use

```ts
import {ProfilingSession} from "@ts-awesome/profiler"

const session = new ProfilingSession();

await session.auto('action 1', async () => {
  // something important happens here
});

await session.auto('action 2', 'group 1', async () => {
  // something important happens here
});

await session.auto('action 3', 'group 1', 'some description', async () => {
  // something important happens here
});

// manual way
const action4finish = session.start('action 4');
try {
  // something important happens here
} finally {
  action4finish();
}

const rawLogs = session.valueOf();
const humanReadable = session.toString();
```

# License
May be freely distributed under the [MIT license](https://opensource.org/licenses/MIT).

Copyright (c) 2022 Volodymyr Iatsyshyn and other contributors
