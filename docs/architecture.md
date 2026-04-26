# architecture

this document outlines the structural design of Geng Shii, a Quing production.

## design philosophy

the architecture is built on the principle of the **slate** design language: boilerplate for greatness. it is minimal, complete, and deliberate. 

## state management

the game utilizes a monolithic state tree. this approach ensures that the entire game world can be serialized, saved, and restored without side effects.

### serialization

the `App` component monitors state changes and persists the `GameState` to `window.localStorage` using the `SAVE_KEY`. 

```typescript
const SAVE_KEY = 'geng-shii-save'
```

### phase management

the application logic is divided into distinct phases:
- `title`: the entry point.
- `room`: the active gameplay loop.
- `message`: the transitionary narrative state.
- `end`: the terminal state (victory or defeat).

## unidirectional data flow

1. **input:** the user triggers an action through the keyboard or mouse.
2. **processing:** the action id is passed to the engine.
3. **mutation:** the engine returns a new state object.
4. **render:** the ui updates to reflect the new state.

this flow ensures that the logic remains deterministic and easy to debug.
