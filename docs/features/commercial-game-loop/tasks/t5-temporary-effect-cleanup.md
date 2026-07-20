# T5 - Add session temporary-effect cleanup

## Goal

Create session-owned cleanup for temporary effects: `lifeLost` interval/timeout
handles, a session cleanup registry or equivalent, stale-session generation guard, and
component-owned timeout cleanup.

## Why This Task Is Isolated

Temporary handles are a distinct leak/stale-state risk and can be tested with fake
timers before terminal UI and full reset orchestration are wired.

## Dependencies

- T1.

## In-Scope Files Or Likely Code Surfaces

- `src/engine/session/`
- `src/engine/protocol/lifeLost.ts`
- `src/components/Game.tsx`
- `tests/unit/session/`
- `tests/unit/engine/`

## Out-Of-Scope Changes

- No Game Over/Victory UI.
- No full reset orchestration.
- No broad animation rewrite.
- No changes to the R3F frame loop.

## Linked FR, AC, And Design Sections

- FR: FR-12, FR-14.
- AC: AC-13, AC-14, AC-23, AC-24.
- Design: sections 7, 8, 12, 13.

## RED Test/Check To Add First

Add fake-timer tests proving:

- `lifeLost` registers or exposes interval and timeout cleanup;
- cleanup clears active handles before their delayed callbacks can mutate a later
  session;
- repeated cleanup is idempotent;
- stale generation callbacks are ignored after a new session starts;
- component-owned scene-finish timeout can be cleared on lifecycle reset or unmount.

## GREEN Minimum Implementation

Add a session cleanup registry or approved equivalent, wire `lifeLost` and `Game`
timeout cleanup into it, and add generation guards for delayed callbacks.

## REFACTOR Boundaries

- Keep cleanup utility focused on session-owned handles.
- Do not add production-only test hooks.
- Do not move gameplay timing into the cleanup registry.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Fake-timer tests fail before cleanup and pass after.
- Repeated cleanup and stale callbacks are proven safe.

## Commit-Message Suggestion

`feat(commercial-game-loop): clean up session temporary effects`

## Risks And Rollback Notes

- Risk: browser and Node timer types differ. Keep types compatible with Vite/Vitest.
- Risk: cleanup becomes a global side-effect bucket. Limit it to session handles.

