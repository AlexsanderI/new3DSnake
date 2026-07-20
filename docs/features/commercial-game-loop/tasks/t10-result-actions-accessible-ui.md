# T10 - Wire result actions and accessible lifecycle UI

## Goal

Complete shared lifecycle UI actions: Play Again and Main Menu from both terminal
screens, keyboard/pointer accessibility, focus visibility, best-score preservation,
and non-active input guards.

## Why This Task Is Isolated

This task finishes action behavior after both terminal screens exist. It avoids
mixing shared accessibility/action work into the Game Over or Victory terminal slices.

## Dependencies

- T8.
- T9.

## In-Scope Files Or Likely Code Surfaces

- `src/components/Menu.tsx`
- `src/components/`
- `src/styles/menu.css`
- `src/store/`
- `tests/unit/session/`

## Out-Of-Scope Changes

- No new visual design system.
- No mobile controls.
- No Playwright coverage yet.
- No changes to gameplay rules.

## Linked FR, AC, And Design Sections

- FR: FR-07, FR-08, FR-10, FR-12, FR-13.
- AC: AC-03, AC-07, AC-10, AC-11, AC-15, AC-16, AC-17, AC-20.
- Design: sections 6, 7, 10, 11, 13.

## RED Test/Check To Add First

Add tests proving:

- Play Again from Game Over starts a clean level 1 session and preserves best score;
- Play Again from Victory starts a clean level 1 session and preserves best score;
- Main Menu from Game Over/Victory returns to non-playing main menu;
- result actions are reachable by keyboard and pointer;
- focus is visible on result actions;
- movement and pause input on terminal and main-menu states remain ignored.

## GREEN Minimum Implementation

Wire result buttons/actions to session commands, ensure accessible buttons/focus, and
derive visible menu/result UI from lifecycle instead of title substring checks.

## REFACTOR Boundaries

- Reuse existing overlay structure and CSS where practical.
- Do not create hidden test-only controls.
- Do not store gameplay facts in UI state.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Shared result actions work in deterministic tests.
- UI no longer relies on `titleMenu.indexOf('Game over')` to decide lifecycle action.

## Commit-Message Suggestion

`feat(commercial-game-loop): wire accessible result actions`

## Risks And Rollback Notes

- Risk: replacing menu click behavior changes start/pause UX. Keep start and pause
  behavior covered by tests from T1/T7.
- Risk: focus styling may conflict with existing CSS. Keep changes scoped to lifecycle
  overlays.

