# T8 - Deliver Game Over result slice

## Goal

Wire terminal failure paths to the controller, capture Game Over snapshots before
reset, render required Game Over result content, guard terminal input, remove the Game
Over reload path, and support dependent Play Again/Main Menu commands.

## Why This Task Is Isolated

Game Over is a complete vertical terminal slice with its own failure reasons and UI.
Victory remains separate to keep final-level behavior reviewable.

## Dependencies

- T2.
- T6.
- T7.

## In-Scope Files Or Likely Code Surfaces

- `src/engine/events/gameOverEvent.ts`
- `src/engine/events/keyboardEvents.ts`
- `src/engine/protocol/gameOver.ts`
- `src/components/Menu.tsx`
- `src/components/`
- `src/styles/`
- `tests/unit/session/`

## Out-Of-Scope Changes

- No Victory behavior.
- No broad menu redesign.
- No Playwright scenario yet.
- No new failure reasons beyond the spec.

## Linked FR, AC, And Design Sections

- FR: FR-03, FR-04, FR-06, FR-11, FR-12.
- AC: AC-04, AC-05, AC-06, AC-07, AC-10, AC-15, AC-18, AC-19, AC-21.
- Design: sections 6, 9, 10, 11, 13.

## RED Test/Check To Add First

Add tests proving:

- no available moves, time expired, and no lives remaining produce Game Over
  snapshots with the required player-facing reason;
- snapshot captures score, best score, and level reached before reset;
- Game Over lifecycle remains visible until command action;
- terminal movement/speed/pause inputs are no-ops;
- the Game Over path does not call `location.reload()`.

## GREEN Minimum Implementation

Replace Game Over menu-title/reload behavior with a controller terminal report and a
result view showing `Game Over`, score, best score, level reached, failure reason,
`Play Again`, and `Main Menu`.

## REFACTOR Boundaries

- Reuse existing overlay/menu styling where practical.
- Do not introduce a design-system rewrite.
- Keep result snapshot values immutable after capture.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Unit/component tests cover each failure reason.
- Source search shows no Game Over lifecycle path uses `location.reload()`.
- Result content matches spec.

## Commit-Message Suggestion

`feat(commercial-game-loop): add game over result flow`

## Risks And Rollback Notes

- Risk: current `gameOver()` protocol side effects conflict with controller reporting.
  Keep protocol append if needed, but terminal UI and reload must be controller-owned.
- Risk: player-facing lives display could go negative. Rely on T3 semantics and tests.

