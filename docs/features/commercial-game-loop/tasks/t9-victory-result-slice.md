# T9 - Deliver Victory result slice

## Goal

Wire final-level completion to Victory, capture the Victory snapshot, keep the result
visible, remove automatic final-win reload, and expose required actions for later
shared result action wiring.

## Why This Task Is Isolated

Victory has different source events and result fields than Game Over. Keeping it
separate reduces risk around level-complete behavior and final-level handling.

## Dependencies

- T2.
- T6.
- T7.

## In-Scope Files Or Likely Code Surfaces

- `src/engine/protocol/levelComplete.tsx`
- `src/engine/events/levelCompleteEvent.ts`
- `src/components/Menu.tsx`
- `src/components/`
- `src/styles/`
- `tests/unit/session/`

## Out-Of-Scope Changes

- No Game Over behavior.
- No level JSON or max-level changes.
- No level balance changes.
- No Playwright scenario yet.

## Linked FR, AC, And Design Sections

- FR: FR-05, FR-06, FR-11.
- AC: AC-08, AC-09, AC-11, AC-16, AC-18, AC-19, AC-21.
- Design: sections 6, 9, 10, 13.

## RED Test/Check To Add First

Add tests proving:

- final-level completion reports Victory instead of reloading;
- Victory snapshot includes final score, best score, and levels completed;
- best score updates or remains unchanged as appropriate;
- Victory remains visible without automatic session start;
- final win path does not call `location.reload()`.

## GREEN Minimum Implementation

Change final-level completion to report Victory to the session controller and render
`Victory`, final score, best score, levels completed, `Play Again`, and `Main Menu`.

## REFACTOR Boundaries

- Preserve non-final level progression behavior unless reset correctness requires a
  narrow cleanup.
- Do not rewrite level loading.
- Do not add new victory gameplay rules.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Tests prove final victory no longer reloads.
- Result screen fields match the spec and remain stable until action.

## Commit-Message Suggestion

`feat(commercial-game-loop): add victory result flow`

## Risks And Rollback Notes

- Risk: final-level detection changes non-final progression. Keep detection logic
  localized and covered by tests.
- Risk: existing protocol write side effects fail. Protocol failure must not hide the
  Victory screen.

