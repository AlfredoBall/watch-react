# @alfredoball/watch-react

React integration for [@alfredoball/watch](https://github.com/AlfredoBall/watch).

`@alfredoball/watch-react` provides the React boundary for consuming a `Watch` instance through React context and hooks.

The package intentionally keeps the Watch model in `@alfredoball/watch`. React integration does not redefine the Watch model or introduce a separate state-management abstraction.

## Installation

```bash
npm install @alfredoball/watch-react
```

> **Note:** `@alfredoball/watch-react` requires React 18 or later.

## Usage

Create a React context value from a Watch instance and consume it with `useWatch`.

```tsx
import {
    WatchContext,
    useWatch,
} from "@alfredoball/watch-react";

function WatchView() {
    const {
        watch,
        cables,
        time,
    } = useWatch();

    const activeFrames =
        time.allWorkflowsActiveFrame();

    return (
        <div>
            <div>
                Cables: {cables.length}
            </div>

            <div>
                Active frames: {activeFrames.length}
            </div>
        </div>
    );
}

export function App({
    watch,
}: {
    watch: MyWatch;
}) {
    return (
        <WatchContext.Provider value={watch}>
            <WatchView />
        </WatchContext.Provider>
    );
}
```

### useWatch

`useWatch()` returns the current Watch together with its React-facing view of the Watch topology and time-derived information.

```ts
const {
    watch,
    cables,
    time,
} = useWatch();
```

#### watch
The Watch instance supplied through `WatchContext`.

#### cables
The cables belonging to the Watch bundle.

```ts
readonly cables: readonly Cable<TState>[];
```

#### time
Time-derived reports over the current Watch.

```ts
time.allWorkflowsActiveFrame();
```

`allWorkflowsActiveFrame()` derives the active workflow frames currently established by the Watch. It does not introduce additional React state.

### Context

`WatchContext` is the context boundary between a React application and a Watch instance.

```tsx
<WatchContext.Provider value={watch}>
    <WatchView />
</WatchContext.Provider>
```

Components using `useWatch()` must be descendants of a `WatchContext.Provider`. Calling `useWatch()` without a provider throws:

> `useWatch must be used within a WatchProvider.`

## Relationship to @alfredoball/watch

`watch-react` is an integration layer, not a replacement for the Watch library.

```text
@alfredoball/watch
        │
        │ Watch model
        ▼
@alfredoball/watch-react
        │
        │ React context + hooks
        ▼
React application
```

The underlying Watch topology, workflow frame runs, strands, cables, and derived time reports remain defined by `@alfredoball/watch`.

Install the core package directly when React integration is not required:

```bash
npm install @alfredoball/watch
```

## Public API

The package root exports:
* `WatchContext`
* `useWatch`
* `UseWatchResult`
* `WatchTime`

The underlying Watch types are provided by `@alfredoball/watch`.

## Development

Install dependencies:
```bash
npm install
```

Run the test suite:
```bash
npm test
```

Run the TypeScript build:
```bash
npm run build
```

Run type checking:
```bash
npm run typecheck
```

Run Vitest in watch mode:
```bash
npm run test:watch
```

## License

MIT
