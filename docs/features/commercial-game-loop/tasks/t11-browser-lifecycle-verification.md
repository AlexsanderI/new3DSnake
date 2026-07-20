# T11 - Add browser lifecycle verification

## Goal

Add representative Playwright lifecycle scenarios for no reload, result-screen
stability, best score across refresh, terminal input ignoring, Main Menu, Play Again,
Victory, and duplicate-listener behavior.

## Why This Task Is Isolated

Browser verification depends on the full user-visible flow. It should be added after
UI and commands exist so it validates real behavior rather than test-only hooks.

## Dependencies

- T10.

## In-Scope Files Or Likely Code Surfaces

- `tests/e2e/`
- `playwright.config.ts` only if existing configuration needs a non-invasive scenario
  addition

## Out-Of-Scope Changes

- No production-only test hooks.
- No level JSON changes.
- No replacement of the existing random-play stability test.
- No implementation changes except fixing issues exposed by RED checks during the task.

## Linked FR, AC, And Design Sections

- FR: FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-10, FR-11, FR-12,
  FR-13, FR-14.
- AC: AC-02, AC-03, AC-04, AC-05, AC-06, AC-07, AC-08, AC-09, AC-10, AC-11, AC-14,
  AC-15, AC-16, AC-17, AC-20, AC-22, AC-23, AC-24.
- Design: section 14.

## RED Test/Check To Add First

Add Playwright checks proving:

- Game Over result appears for representative supported reasons;
- Victory result remains visible instead of reloading;
- result screens remain visible for the required stability window;
- Play Again and Main Menu do not reload the browser;
- best score survives Play Again and browser refresh;
- terminal movement/pause input is ignored;
- no duplicate input listener effect is observed after pause/resume/restart.

## GREEN Minimum Implementation

Add deterministic browser scenarios using public UI and existing app behavior. Use
unit/integration coverage for the 10-cycle stress path if browser gameplay would be
slow; do not add hidden production controls.

## REFACTOR Boundaries

- Keep the existing 5-minute random-play test as a stability check.
- Avoid brittle timing when a state assertion can wait on visible UI.
- Keep helper utilities under `tests/e2e`.

## GATE Commands

- `npm run test:e2e`
- `npm run verify`

## Completion Evidence

- New Playwright lifecycle scenarios pass.
- Existing random-play stability remains runnable.
- Test output demonstrates no lifecycle reload in covered flows.

## Commit-Message Suggestion

`test(commercial-game-loop): add browser lifecycle coverage`

## Risks And Rollback Notes

- Risk: deterministic browser Victory is hard to reach without test hooks. Prefer
  public, stable gameplay paths; if still too slow, rely on unit/integration proof for
  full cycle stress and keep browser coverage representative.
- Risk: e2e runtime grows too much. Keep scenarios focused and avoid duplicating
  unit-level reset assertions.

