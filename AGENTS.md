# AGENTS.md — Snake3D Repository Instructions

## Mission

Develop Snake3D into a stable, enjoyable, mobile-ready browser game that can be
published as a commercial MVP. Prefer small, testable changes over broad rewrites.

## Required reading before changing code

1. Read `README.md` for project commands and product context.
2. Read `docs/architecture-map.md` for the current implementation.
3. Read `docs/roadmap.md` for priorities.
4. For feature work, read every file in `docs/features/<slug>/` before editing source.
5. Inspect the actual related source files. Documentation is context, not a substitute
   for reading the code.

## Current architecture constraints

- The app is React + TypeScript + Vite.
- 3D rendering uses React Three Fiber and Three.js.
- The game loop is driven by React Three Fiber `useFrame`.
- Core gameplay state is distributed across mutable TypeScript modules under
  `src/engine/`.
- Zustand is currently used only for menu and pause UI state.
- Level configuration is bundled as static JSON.
- There is no backend, account system, database, or persistent player profile.
- Playwright is the current automated test harness.

Do not introduce a second game loop, a second state-management architecture, a
backend, or a new styling system unless an approved feature design explicitly
requires it.

## Working rules

- Work on one feature or one clearly bounded task at a time.
- Use a dedicated branch such as `feat/<slug>` or `fix/<slug>`; do not implement
  feature work directly on `main`.
- Do not edit unrelated files.
- Preserve existing gameplay unless the active specification explicitly changes it.
- Prefer pure functions for game rules when practical.
- Avoid adding new module-level mutable state. If unavoidable, document how it is
  initialized and reset.
- Keep engine rules independent from React and Three.js where practical.
- Keep rendering code in React/R3F components and gameplay rules in `src/engine/`.
- Reuse existing event/protocol conventions before creating a parallel mechanism.
- Clean up timers, listeners, animation handles, and temporary state during restart,
  unmount, and level transitions.
- Do not silently change level JSON values or game balance.
- Do not commit generated folders or local artifacts such as `node_modules/`, `dist/`,
  `playwright-report/`, `test-results/`, screenshots, videos, or traces.
- Do not run `git push`, publish, deploy, or merge unless the user explicitly asks.

## SDD workflow

For a new feature, follow the repository's SDD flow:

1. `specify` — define user-visible behavior, scope, exclusions, and acceptance criteria.
2. `design` — decide how the feature fits the existing architecture.
3. `tasks` — split the design into small, ordered, verifiable tasks.
4. `implement` — complete one task at a time.
5. `review` — compare the implementation with the specification and architecture.
6. `ship` — prepare a clean, verified change for merge or release.

During implementation, prefer the loop:

`RED → GREEN → REFACTOR → GATE → COMMIT`

- **RED:** add or identify a failing deterministic check.
- **GREEN:** make the smallest change that passes it.
- **REFACTOR:** improve structure without changing behavior.
- **GATE:** run all available verification commands.
- **COMMIT:** create one focused commit for the completed task.

Do not fabricate a failing test when a task is documentation-only or cannot reasonably
be tested automatically. In that case, define an explicit manual verification step.

## Verification gates

The repository exposes these verification commands:

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run verify
npm run build
npm run test:e2e
```

Run `npm run verify` before requesting review. It runs `typecheck`, `lint`,
`test:unit`, and `build` in order and stops at the first failing quality area. Run
`npm run test:e2e` before declaring code work complete; the Playwright browser
stability check remains part of completion verification. Fix the first failing gate
before continuing.

A task is not complete merely because the app opens. The relevant acceptance criteria
must also be verified.

## Testing expectations

- Add deterministic unit tests for isolated game rules under `tests/unit` when changing
  pure rules or utilities.
- Add Playwright coverage for critical player journeys and regressions.
- Keep random-play tests as stability checks, not as the only proof of correctness.
- For visual or interaction work, verify desktop and mobile-sized viewports manually or
  through Playwright.
- Record any untested risk in the feature review.

## Documentation rules

- `README.md` describes the project for humans.
- `docs/architecture-map.md` describes the current architecture and should be refreshed
  with `survey` after significant structural changes.
- `docs/roadmap.md` contains product and engineering priorities, not implementation
  details.
- `docs/features/<slug>/` contains the specification, design, tasks, review, and handoff
  artifacts for one feature.
- Update documentation in the same change when behavior, commands, or architecture
  change.

## Definition of done

A feature or task is done only when:

- its acceptance criteria are satisfied;
- relevant automated tests pass;
- `npm run verify` passes;
- `npm run build` passes;
- `npm run test:e2e` passes, unless the task is explicitly documented as not requiring it;
- no new browser console errors are introduced;
- no unrelated behavior is changed;
- documentation is updated where necessary;
- the diff is focused and understandable;
- the user has reviewed any meaningful visual or gameplay change.
