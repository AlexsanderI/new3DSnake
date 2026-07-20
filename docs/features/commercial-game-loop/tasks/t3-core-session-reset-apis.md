# T3 - Add core session reset APIs

## Goal

Add exact, idempotent reset APIs for core session state: score, protocol, current
level, lives with approved zero-lives semantics, timer elapsed/running state, pause,
mistake, and input-related engine state.

## Why This Task Is Isolated

Core engine reset seams can be tested independently before full session orchestration.
This avoids one large reset task and lets review focus on exact state owners.

## Dependencies

- T1.

## In-Scope Files Or Likely Code Surfaces

- `src/engine/scores/`
- `src/engine/protocol/`
- `src/engine/levels/`
- `src/engine/lives/`
- `src/engine/time/`
- `src/engine/events/`
- `tests/unit/engine/`

## Out-Of-Scope Changes

- No snake/food/bonus/obstacle/animation reset APIs.
- No UI result screens.
- No level JSON or initial life count changes.
- No full session orchestration.

## Linked FR, AC, And Design Sections

- FR: FR-03, FR-14.
- AC: AC-01, AC-06, AC-12, AC-13, AC-14.
- Design: sections 7, 8, 9.

## RED Test/Check To Add First

Add unit tests proving:

- score reset sets score exactly to 0 and is idempotent;
- protocol clear removes entries and is idempotent;
- current level reset sets level 1 without level JSON changes;
- timer reset sets elapsed to 0 and running false;
- pause reset sets engine/UI-compatible pause state false without toggling;
- mistake reset clears active mistake state;
- after a final life is consumed and remaining lives becomes 0, Game Over reason is
  `no lives remaining`;
- player-facing lives never become negative.

## GREEN Minimum Implementation

Add exact reset/set APIs in the owning modules and adjust no-lives predicate to the
approved semantics while preserving configured initial life counts.

## REFACTOR Boundaries

- Do not rewrite scoring, timing, or collision rules.
- Prefer exact setters over additive reset tricks.
- Keep legacy helpers only if needed for compatibility.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Core reset tests pass repeatedly.
- No level JSON values changed.
- Lives tests pin the approved zero-lives semantics.

## Commit-Message Suggestion

`feat(commercial-game-loop): add core session reset APIs`

## Risks And Rollback Notes

- Risk: no-lives change can affect gameplay balance. Roll back to the prior predicate
  only if tests or maintainer review show unintended allowance changes; do not change
  level JSON.
- Risk: additive setters hide stale state. Prefer exact state assignment.

