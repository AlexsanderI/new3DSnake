# Tracker - repository-quality-gates

> Status of every task in the epic. `implement` updates `done` as it commits each task.
> States: `todo` - `in_progress` - `blocked` - `review` - `done`.

| # | Task | Layer | Owner | Estimate | Blocked by | Status |
|---|---|---|---|---|---|---|
| T1 | Pin runtime expectations and artifact hygiene | docs | Tech Lead | S | - | done |
| T2 | Extract an explicit TypeScript typecheck gate | app | Tech Lead | S | - | done |
| T3 | Add a focused ESLint gate | app | Tech Lead | M | - | done |
| T4 | Add the Vitest deterministic test runner | tests | Tech Lead | M | - | done |
| T5 | Seed focused deterministic coverage | tests | Tech Lead | S | T4 | done |
| T6 | Compose the aggregate deterministic verify command | wiring | Tech Lead | S | T2, T3, T5 | done |
| T7 | Add pull-request verification workflow | worker | Maintainer | S | T6 | done |
| T8 | Document setup, gate order, and completion rules | docs | Tech Lead | M | T1, T6, T7 | done |

**Total:** 8 tasks, ~4-5 person-days.
