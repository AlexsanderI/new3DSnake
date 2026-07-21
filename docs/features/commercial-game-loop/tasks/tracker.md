# Tracker - commercial-game-loop

> Status of every task in the epic. `implement` updates `done` as it commits each
> task. States: `todo` - `in_progress` - `blocked` - `review` - `done`.

| # | Task | Layer | Owner | Estimate | Blocked by | FR | AC | Status |
|---|---|---|---|---|---|---|---|---|
| T1 | Add lifecycle controller foundation | app | Codex | M | - | FR-01, FR-02, FR-12, FR-13 | AC-01, AC-02, AC-03, AC-07, AC-17 | done |
| T2 | Add best-score service and terminal snapshots | app | Codex | M | T1 | FR-03, FR-04, FR-05, FR-09, FR-10 | AC-04, AC-05, AC-06, AC-08, AC-18, AC-19, AC-20, AC-21 | done |
| T3 | Add core session reset APIs | domain | Codex | M | T1 | FR-03, FR-14 | AC-01, AC-06, AC-12, AC-13, AC-14 | done |
| T4 | Add world-state reset APIs | domain | Codex | L | T1 | FR-14 | AC-01, AC-12, AC-13, AC-14, AC-24 | done |
| T5 | Add session temporary-effect cleanup | app | Codex | M | T1 | FR-12, FR-14 | AC-13, AC-14, AC-23, AC-24 | done |
| T6 | Coordinate session reset and session commands | app | Codex | L | T2, T3, T4, T5 | FR-01, FR-07, FR-08, FR-10, FR-11, FR-14 | AC-01, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15, AC-16, AC-17, AC-20 | done |
| T7 | Integrate lifecycle with React, R3F, input, and pause | wiring | Codex | M | T5, T6 | FR-02, FR-12, FR-13 | AC-02, AC-03, AC-07, AC-17, AC-23 | done |
| T8 | Deliver Game Over result slice | ui | Codex | M | T2, T6, T7 | FR-03, FR-04, FR-06, FR-11, FR-12 | AC-04, AC-05, AC-06, AC-07, AC-10, AC-15, AC-18, AC-19, AC-21 | done |
| T9 | Deliver Victory result slice | ui | Codex | M | T2, T6, T7 | FR-05, FR-06, FR-11 | AC-08, AC-09, AC-11, AC-16, AC-18, AC-19, AC-21 | done |
| T10 | Wire result actions and accessible lifecycle UI | ui | Codex | M | T8, T9 | FR-07, FR-08, FR-10, FR-12, FR-13 | AC-03, AC-07, AC-10, AC-11, AC-15, AC-16, AC-17, AC-20 | done |
| T11 | Add browser lifecycle verification | tests | Codex | L | T10 | FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-10, FR-11, FR-12, FR-13, FR-14 | AC-02, AC-03, AC-04, AC-05, AC-06, AC-07, AC-08, AC-09, AC-10, AC-11, AC-14, AC-15, AC-16, AC-17, AC-20, AC-22, AC-23, AC-24 | todo |
| T12 | Finalize documentation and traceability | docs | Codex | S | T11 | FR-01 through FR-14 | AC-22, AC-25 | todo |

**Total:** 12 tasks, expected 12 focused implementation commits.

## Split Task Notes

- T4A snake, food, and bonus reset APIs is complete.
- T4B obstacles, animations, and render/HUD reset APIs is complete.

## Regression Notes

- BUG-01 fixed non-final level-transition world desynchronization after T10 review: the non-final level-complete path now clears level-local snake, food, obstacle, obstacle visual, and snake animation state before reusing the existing next-level initializer. T11 remains not started.

## Dependency Order

T1 -> (T2, T3, T4, T5) -> T6 -> T7 -> (T8, T9) -> T10 -> T11 -> T12.

## Reset Owner Assignment

| Reset owner from design | Assigned task |
|---|---|
| Current level | T3, T6 |
| Score | T3 |
| Lives and zero-lives semantics | T3, T8 |
| Timer elapsed/running and time-per-level | T3, T6, T7 |
| Snake state | T4 |
| Food state | T4 |
| Obstacles engine state/history | T4 |
| Obstacles visual state | T4 |
| Bonuses and active effects | T4 |
| Protocol | T3, T8, T9 |
| Engine pause flag | T3, T7 |
| Pause UI store | T7, T10 |
| Menu UI store | T1, T8, T9, T10 |
| Mistake flag | T3 |
| Input listeners | T7, T11 |
| Life-lost effects | T5 |
| Game finish timeout | T5, T7 |
| Animation counters | T4 |
| Render/HUD side effects | T4, T5 |
| Best score | T2, T6, T8, T9, T11 |
