# T12 - Finalize documentation and traceability

## Goal

Update feature documentation and traceability after implementation evidence exists,
including FR/AC coverage, verification commands, remaining risks, and readiness for
SDD REVIEW.

## Why This Task Is Isolated

Documentation finalization should happen after browser verification so it records real
evidence rather than planned checks.

## Dependencies

- T11.

## In-Scope Files Or Likely Code Surfaces

- `docs/features/commercial-game-loop/`
- `README.md` only if commands or player-visible lifecycle behavior need project-level
  documentation
- `docs/roadmap.md` only if feature status needs updating during ship/review prep

## Out-Of-Scope Changes

- No production code changes.
- No new implementation work.
- No commit unless this task is later run during IMPLEMENT.

## Linked FR, AC, And Design Sections

- FR: FR-01 through FR-14.
- AC: AC-22, AC-25.
- Design: sections 14, 17, 18.

## RED Test/Check To Add First

Add or run a documentation traceability check manually:

- all FR-01 through FR-14 have implementation evidence;
- all AC-01 through AC-25 have test or documented manual evidence;
- reset owner coverage from design section 8 is complete;
- no known lifecycle reload remains except out-of-scope fatal startup error recovery.

## GREEN Minimum Implementation

Update feature docs/review notes with verification results, known residual risk, and
handoff details needed for REVIEW.

## REFACTOR Boundaries

- Do not rewrite accepted spec/design history.
- Keep docs focused on completed evidence and remaining risks.
- Do not broaden scope into unrelated roadmap items.

## GATE Commands

- `npm run verify`
- `npm run test:e2e`

## Completion Evidence

- Traceability shows all FR/AC covered.
- Maintainer can use the docs to decide SDD REVIEW readiness.

## Commit-Message Suggestion

`docs(commercial-game-loop): record lifecycle verification evidence`

## Risks And Rollback Notes

- Risk: documentation claims more than tests prove. Record gaps explicitly and keep the
  feature out of REVIEW until evidence exists.
- Risk: roadmap churn. Only update roadmap status if the repository convention expects
  it at this stage.

