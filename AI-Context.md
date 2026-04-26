# AI Context: Geng Shii

this document provides technical context for the Geng Shii codebase to assist in automated development and analysis.

## system architecture

the game is a pure state machine. the interface is a stateless projection of the current game state.

### core state (GameState)

the `GameState` object is the single source of truth. it contains:

- **vitals:** hp and maxhp.
- **location:** the current `RoomId`.
- **flags:** boolean switches representing world changes (e.g., `lockdownActive`, `dogScared`).
- **inventory:** a record of `ItemId` to boolean.

### action resolution

actions are processed through `resolveAction(state, actionId)`. 
- input: current `GameState`, string `actionId`.
- output: `ActionResult` containing the next `GameState` and an array of `lines` (narrative output).

## code conventions

- **immutability:** the state must never be mutated directly. use `cloneState` or spread operators.
- **type safety:** all room and item identifiers are strictly typed using string literals.
- **logic separation:** all game mechanics remain in `src/game.ts`. react components must only handle rendering and user input.

## file mapping

- `src/game.ts`: the engine and data definitions.
- `src/App.tsx`: the root controller and phase manager.
- `src/components/LevelScene.tsx`: the primary game interface.
- `src/components/InventoryOverlay.tsx`: the modal stash view.

## project requirements

Geng Shii is a Quing project. documentation must follow the **slate** design language. maintain technical precision and direct tone.
