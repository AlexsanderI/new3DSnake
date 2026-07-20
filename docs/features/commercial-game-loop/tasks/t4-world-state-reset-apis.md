# T4 - Add world-state reset APIs

## Goal

Add exact, idempotent reset APIs for world state: snake, food, bonuses and active
effects, obstacle engine state and movement history, obstacle visual state, animation
counters, and transient render state.

## Why This Task Is Isolated

World reset is broad enough to deserve its own review, but it does not need terminal
UI, persistence, or session command wiring to be verified.

## Dependencies

- T1.

## In-Scope Files Or Likely Code Surfaces

- `src/engine/snake/`
- `src/engine/food/`
- `src/engine/bonuses/`
- `src/engine/obstacles/`
- `src/animations/snakeAnimation/`
- `src/components/Obstacles.tsx`
- `src/engine/render/`
- `tests/unit/engine/`
- `tests/unit/animations/`

## Out-Of-Scope Changes

- No level balance changes.
- No broad animation redesign.
- No second render loop.
- No Game Over/Victory UI.
- No core score/lives/timer reset work already owned by T3.

## Linked FR, AC, And Design Sections

- FR: FR-14.
- AC: AC-01, AC-12, AC-13, AC-14, AC-24.
- Design: sections 7, 8, 12, 13.

## RED Test/Check To Add First

Add deterministic tests proving:

- snake head/body/direction reset to a clean level-start state;
- food amount/current position/score state reset exactly;
- all bonus flags, current bonus, availability, caught state, and active effects reset;
- obstacle coordinate, step, speed, movement-history, and collision-cache state reset;
- obstacle visual arrays/counters are cleared;
- animation counters such as body counter arrays are cleared and do not accumulate
  after repeated resets;
- render/HUD transient state returns to normal;
- every reset is idempotent.

## GREEN Minimum Implementation

Add narrow reset APIs in the owning modules, plus any small extraction needed to reset
module-level visual state currently held in components.

## REFACTOR Boundaries

- Keep gameplay rules in existing modules.
- Avoid moving all world state into the session controller.
- Split only local helper code needed to make component-level visual state resettable.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Reset tests prove repeated calls do not accumulate bonus, obstacle, render, or
  animation state.
- Review can trace every world owner from design section 8 to a reset API.

## Commit-Message Suggestion

`feat(commercial-game-loop): add world state reset APIs`

## Risks And Rollback Notes

- Risk: this task is the largest domain slice. If it exceeds one focused session,
  split at implementation time into `snake/food/bonus` and `obstacle/animation/render`
  subtasks before coding.
- Risk: component module state is awkward to test. Extract a narrow helper rather than
  rewriting rendering.

