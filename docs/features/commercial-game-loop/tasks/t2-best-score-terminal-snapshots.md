# T2 - Add best-score service and terminal snapshots

## Goal

Add validated `localStorage` best-score behavior, terminal failure-reason mapping, and
Game Over/Victory result snapshot creation per [spec.md sections 6, 7, and
10](../spec.md#10-best-score-behavior).

## Why This Task Is Isolated

Persistence and terminal snapshots can be developed against the lifecycle foundation
without changing frame advancement, reset APIs, or UI rendering.

## Dependencies

- T1.

## In-Scope Files Or Likely Code Surfaces

- `src/engine/session/`
- `src/engine/scores/`
- `src/engine/levels/`
- `tests/unit/session/`

## Out-Of-Scope Changes

- No result screen rendering.
- No Play Again/Main Menu wiring.
- No protocol handler rewiring.
- No backend, account, leaderboard, or cloud sync.

## Linked FR, AC, And Design Sections

- FR: FR-03, FR-04, FR-05, FR-09, FR-10.
- AC: AC-04, AC-05, AC-06, AC-08, AC-18, AC-19, AC-20, AC-21.
- Design: sections 9, 10, 15.

## RED Test/Check To Add First

Add unit tests proving:

- missing, invalid, negative, fractional, and non-finite stored best score read as 0;
- lower/equal score does not overwrite best score;
- higher score writes a new best score;
- storage read/write failures do not throw out of snapshot creation;
- `no moves`, `time limit`, and `lives limit` map to the approved player-facing
  reasons;
- Game Over and Victory snapshots include the required fields and capture score before
  reset.

## GREEN Minimum Implementation

Add a small best-score service and snapshot factory/mapper used by later controller
commands.

## REFACTOR Boundaries

- Keep storage access isolated.
- Do not read or write `localStorage.protocol` as part of best score.
- Do not duplicate live score or level state in the controller.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Unit tests cover all accepted best-score and failure-reason cases.
- Storage errors leave a valid result snapshot.

## Commit-Message Suggestion

`feat(commercial-game-loop): add best score and result snapshots`

## Risks And Rollback Notes

- Risk: browser storage is unavailable in tests. Use injected storage adapters or safe
  guards, not production-only hooks.
- Risk: snapshot creation starts resetting state. Keep reset out of this task.

