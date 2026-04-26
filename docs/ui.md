# user interface

the interface for Geng Shii is built using react. it serves as a high-fidelity projection of the game engine.

## crt aesthetic and scaling

the interface for Geng Shii follows a strict "fixed-frame" crt aesthetic. scrolling is forbidden to maintain immersion and narrative consistency.

### height-based scaling (vh)

to prevent ui overflow across varying devices, the system utilizes a height-driven scaling model. font sizes, component gaps, and vertical margins are defined using `vh` (viewport height) units rather than fixed pixels or width-based units.

- **dynamic fitting:** as the viewport height decreases (e.g., on mobile landscape), the text and spacing contract proportionally.
- **fixed viewport:** the `.screen--game` container is locked to `100svh` with `overflow: hidden`.

## component architecture

the ui is composed of modular components:
- `LevelScene`: the primary viewport for the current room.
- `LevelResult`: a modal narrative layer for action feedback.
- `InventoryOverlay`: the player's stash management view.
- `TitleScreen`: the initialization and persistence management view.

## keyboard navigation

Geng Shii is designed for keyboard-centric interaction. navigation is handled via `useEffect` hooks that listen for `keydown` events.

### focus management

the `LevelScene` component uses `useRef` to track button elements. it manually manages focus using `target?.focus({ preventScroll: true })` to ensure the player can navigate the interface without a mouse or causing unexpected layout shifts.

### key mappings

- **arrows:** navigate choices and hud controls.
- **enter:** confirm the selected action.
- **i:** toggle the inventory stash.
- **p / esc:** toggle the pause menu.

## accessibility

the interface adheres to semantic html standards.
- `<main>` and `<section>` tags define the layout regions.
- `aria-label` provides context for screen readers in the terminal environment.
- `aria-live` is used for critical orientation locks on mobile devices.

## styling

the game uses vanilla css. it employs a "terminal" aesthetic that, while distinct from the **slate** documentation style, maintains the Quing standard for clarity and purpose.
