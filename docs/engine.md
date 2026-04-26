# engine

the engine is the core logic provider for Geng Shii. it is located in `src/game.ts`.

## data structures

the engine relies on strict typescript types to define the game world.

- `RoomId`: unique identifiers for every location.
- `ItemId`: unique identifiers for every collectible.
- `GameState`: the comprehensive record of the player's progress.

## action resolution

the `resolveAction` function is the primary entry point for gameplay. it uses a nested switch-case structure to evaluate player intent based on their current room.

### conditional logic

the engine handles complex environmental interactions:
- **inventory checks:** e.g., requiring the `screwdriver` to remove a vent.
- **state flags:** e.g., checking if `dogScared` is true before allowing theft.
- **probability:** random encounters (e.g., security patrols) are calculated using `Math.random()`.

## narrative generation

the engine does not just return state; it returns narrative. every `ActionResult` includes a `lines` array. this allows the engine to describe the consequences of an action (e.g., "HP reduced by 20") before the state update is visually processed.

## victory conditions

the game concludes when the `victory` flag is set within the `headmastersOffice` room case. this triggers the terminal phase in the ui.
