# T7 - Integrate lifecycle with React, R3F, input, and pause

## Goal

Wire lifecycle into React/R3F, frame advancement, keyboard listener selection, pause
and resume behavior, terminal input ignoring, and StrictMode-safe cleanup while
preserving the existing `useFrame` loop.

## Why This Task Is Isolated

This task connects lifecycle to runtime wiring without adding terminal result content.
It can be verified through unit/component-level checks before UI result slices.

## Dependencies

- T5.
- T6.

## In-Scope Files Or Likely Code Surfaces

- `src/components/Game.tsx`
- `src/engine/time/setLoop.ts`
- `src/engine/events/keyboardEvents.ts`
- `src/engine/events/pauseEvent.ts`
- `src/store/`
- `tests/unit/session/`

## Out-Of-Scope Changes

- No Game Over/Victory result UI.
- No new frame loop.
- No mobile/touch controls.
- No broad menu redesign.

## Linked FR, AC, And Design Sections

- FR: FR-02, FR-12, FR-13.
- AC: AC-02, AC-03, AC-07, AC-17, AC-23.
- Design: sections 5, 6, 11, 12, 13.

## RED Test/Check To Add First

Add tests proving:

- `setLoop` or its caller does not advance gameplay outside `active-gameplay`;
- pause command works only in `active-gameplay`;
- resume command works only in `paused`;
- movement/speed/pause input is ignored in main-menu and terminal states;
- listener registration is derived from lifecycle and does not duplicate handlers
  after pause/resume and restart;
- StrictMode-like mount/cleanup/mount leaves one active handler.

## GREEN Minimum Implementation

Wire `Game`, frame gating, keyboard handling, and pause handling to lifecycle command
guards and exact pause setters.

## REFACTOR Boundaries

- Preserve the existing R3F `useFrame` call path.
- Keep listener cleanup in React effects.
- Do not move gameplay state into React/Zustand.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Tests prove pause and terminal input guards.
- Tests or review evidence show listener behavior remains single-registration.

## Commit-Message Suggestion

`feat(commercial-game-loop): gate frame input and pause by lifecycle`

## Risks And Rollback Notes

- Risk: event handlers still mutate engine state before guard checks. Place guards at
  the earliest practical entry point.
- Risk: frame gating pauses rendering. Only gameplay mutation should stop; visible UI
  and scene rendering may continue as designed.

