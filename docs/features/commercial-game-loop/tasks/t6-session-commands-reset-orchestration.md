# T6 - Coordinate session reset and session commands

## Goal

Implement session commands and reset orchestration: start from Main Menu, Play Again
from Game Over/Victory, return to Main Menu, full reset ordering, best-score
preservation, and deterministic 10-cycle replay verification.

## Why This Task Is Isolated

This task composes already-tested foundation, persistence, reset APIs, and cleanup. It
does not add terminal UI or React listener wiring.

## Dependencies

- T2.
- T3.
- T4.
- T5.

## In-Scope Files Or Likely Code Surfaces

- `src/engine/session/`
- `src/engine/events/setInitialLevelOfGame.ts`
- `tests/unit/session/`
- `tests/integration/`

## Out-Of-Scope Changes

- No Game Over/Victory screen rendering.
- No Playwright tests.
- No R3F frame gate.
- No new gameplay rules.

## Linked FR, AC, And Design Sections

- FR: FR-01, FR-07, FR-08, FR-10, FR-11, FR-14.
- AC: AC-01, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15, AC-16, AC-17, AC-20.
- Design: sections 6, 7, 8, 10, 14.

## RED Test/Check To Add First

Add integration tests proving:

- start from main menu resets and initializes level 1;
- Play Again from Game Over resets all session state and preserves best score;
- Play Again from Victory behaves the same;
- Main Menu returns to non-playing state without starting a session;
- terminal/main-menu movement and pause commands remain no-ops;
- 10 consecutive terminal -> Play Again cycles produce clean level 1 state without
  stale score, lives, timer, protocol, bonuses, obstacles, intervals, or animation
  counters.

## GREEN Minimum Implementation

Wire the session controller to call reset APIs and level initialization in the design
order, with best score excluded from reset.

## REFACTOR Boundaries

- Keep orchestration in session-level code.
- Do not embed reset ordering in UI components.
- Do not add browser-only controls to make tests pass.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- The 10-cycle deterministic test passes.
- Reset orchestration is idempotent.
- Best score persists across Play Again in tests.

## Commit-Message Suggestion

`feat(commercial-game-loop): coordinate session reset commands`

## Risks And Rollback Notes

- Risk: reset orchestration uncovers missing reset owner. Add the missing narrow reset
  API in the owning module rather than special-casing in the controller.
- Risk: this task can become too large if reset APIs were incomplete. Stop and split
  the missing owner into a prerequisite task if needed.

