# T1 - Add lifecycle controller foundation

## Goal

Create the lifecycle/session controller foundation described in [design.md sections
4-6](../design.md#4-chosen-architecture), with observable states, allowed transition
rules, invalid-command no-ops, and a controller read/subscription API.

## Why This Task Is Isolated

This task establishes the lifecycle contract without wiring gameplay, UI, best score,
reset orchestration, or browser behavior. It keeps the first implementation slice
small and prevents later tasks from inventing incompatible lifecycle semantics.

## Dependencies

- None.

## In-Scope Files Or Likely Code Surfaces

- `src/engine/session/`
- `src/store/` only if a small UI-facing lifecycle adapter is needed
- `tests/unit/session/`

## Out-Of-Scope Changes

- No gameplay reset APIs.
- No Game Over or Victory UI.
- No best-score persistence.
- No R3F/input wiring.
- No changes to level JSON or gameplay rules.

## Linked FR, AC, And Design Sections

- FR: FR-01, FR-02, FR-12, FR-13.
- AC: AC-01, AC-02, AC-03, AC-07, AC-17.
- Design: sections 4, 5, 6, 11, 13.
- ADR: [0001](../adr/0001-use-session-controller-for-lifecycle-ownership.md).

## RED Test/Check To Add First

Add deterministic unit tests proving:

- initial lifecycle is `main-menu`;
- allowed commands transition only as designed;
- invalid commands are no-ops;
- subscribers/readers receive lifecycle changes;
- controller state does not contain live score, lives, timer, snake, food, bonus, or
  obstacle facts.

## GREEN Minimum Implementation

Add lifecycle types, a small controller/reducer, command functions, `getState()`, and
subscription support sufficient to pass the tests.

## REFACTOR Boundaries

- Keep the controller small and lifecycle-only.
- Do not centralize gameplay facts.
- Do not wire production components until later tasks.

## GATE Commands

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`

## Completion Evidence

- Unit tests fail before implementation and pass after.
- TypeScript confirms no invalid lifecycle states are used.
- Code review can verify no duplicated live gameplay state was added.

## Commit-Message Suggestion

`feat(commercial-game-loop): add lifecycle controller foundation`

## Risks And Rollback Notes

- Risk: the controller grows into a second gameplay store. Roll back by removing
  gameplay fields and keeping only lifecycle/snapshot references.
- Risk: TypeScript contract changes break later wiring. Keep exports narrow until a
  concrete downstream task needs them.

