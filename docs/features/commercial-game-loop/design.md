---
status: Draft
owner: "Tech Lead"
reviewers: ["Maintainer"]
updated_at: "2026-07-20"
feature_size: "M"
source_spec: "./spec.md"
source_context: "./CONTEXT.md"
adr:
  - "./adr/0001-use-session-controller-for-lifecycle-ownership.md"
target_surfaces:
  - "web-frontend"
---

# Design - commercial-game-loop

## 1. Design Summary

Use a dedicated session lifecycle controller as the single owner of observable game
lifecycle transitions, result snapshots, best-score coordination, and full-session
reset orchestration. Keep gameplay facts in the existing engine modules and expose
narrow reset/cleanup APIs from those modules rather than moving gameplay state into a
new store.

The controller does not create a second frame loop. React Three Fiber `useFrame`
continues to call the existing frame-driven gameplay path. The new controller gates
when gameplay may advance, when input is accepted, when pause is valid, and when
terminal result screens are shown.

The design removes `location.reload()` from Game Over, Victory, Play Again, and Main
Menu transitions. Fatal app-start error recovery in `ErrorScreen` is not part of this
feature.

## 2. Current Architecture Constraints

- The app is React 18, TypeScript, Vite, React Three Fiber, and Three.js.
- R3F `useFrame` is the existing and retained game loop (`src/components/Game.tsx`,
  `src/engine/time/setLoop.ts`).
- Gameplay state is distributed across mutable modules under `src/engine/` and
  animation/render helpers under `src/animations/` and `src/components/`.
- Zustand currently owns only menu and pause UI state (`src/store/menuStore.ts`).
- There is no backend, account system, database, or persistent player profile.
- Level data remains static bundled JSON; this feature must not rebalance levels.
- Existing tests include deterministic Vitest infrastructure and one long Playwright
  random-play stability test, but no lifecycle-specific reset coverage.

## 3. Options Considered

### Option A: Extend Existing Zustand UI State To Own Lifecycle

Benefits:

- Low initial wiring cost because `Menu`, `Game`, and pause already subscribe to
  Zustand UI stores.
- Result overlays could reuse the current menu visibility/title pattern.
- React components would receive lifecycle state through a familiar hook.

Risks:

- Turns a UI store into the owner of gameplay lifecycle, despite repository constraints
  that Zustand is currently UI-only.
- Encourages storing score, lives, timer, and gameplay facts in the UI layer to render
  result screens, duplicating engine state.
- Makes reset ordering ambiguous because engine modules, protocol handlers, and UI
  stores would all mutate lifecycle indirectly.
- Does not solve cleanup of module-level intervals, animation arrays, obstacle history,
  or bonus flags by itself.

Migration cost:

- Small for the first result screen, but grows quickly as every engine terminal path
  needs to coordinate with a UI store that was not designed as an application
  controller.

Testability:

- UI-state transitions are easy to unit test.
- Full reset tests remain hard because the reset owner is not near engine state owners.

Compatibility:

- Partially compatible with current component wiring, but conflicts with the
  architecture constraint that Zustand should not become a parallel gameplay state
  system.

### Option B: Dedicated Lifecycle/Session Controller With Existing Engine State

Benefits:

- Gives one explicit owner for lifecycle transitions, result snapshots, best-score
  persistence, and reset orchestration.
- Keeps authoritative gameplay facts in current engine modules.
- Avoids a second frame loop and broad engine rewrite.
- Makes cleanup dependencies visible through a reset ownership matrix.
- Provides deterministic unit-test seams for 10 restart cycles without random browser
  gameplay.

Risks:

- Requires touching multiple modules to add narrow reset/cleanup APIs.
- Introduces a new coordination module that must not become a duplicate gameplay store.
- Existing protocol handlers need to report terminal events to the controller instead
  of directly opening menus or reloading.

Migration cost:

- Moderate. It crosses UI, event, protocol, persistence, and reset APIs, but can be
  delivered as vertical slices without replacing core rules.

Testability:

- Strong. Lifecycle transitions can be tested as deterministic commands. Reset APIs can
  be tested at module level. Browser tests can verify visible behavior without relying
  on 5-minute random play.

Compatibility:

- Best fit for current architecture. It preserves engine module ownership and R3F
  `useFrame`, while making lifecycle explicit.

### Option C: Replace Or Centralize All Gameplay State In A New Store

Benefits:

- Long-term state ownership could become simpler if all gameplay facts were normalized
  and reset from one reducer/store.
- Reset could become naturally atomic after migration.
- UI result snapshots could be derived from a single state tree.

Risks:

- Full engine rewrite in disguise.
- High regression risk for movement, collision, bonuses, obstacles, animation, and
  scoring rules.
- Likely duplicates state during migration, creating the exact stale-state risk this
  feature is meant to remove.
- Could introduce a second state-management architecture and broad unrelated
  refactoring.

Migration cost:

- High. It would touch most gameplay modules and rendering components.

Testability:

- Potentially strong after completion, but poor during migration because old and new
  state models would coexist.

Compatibility:

- Poor for this feature. It violates the preferred boundaries in the specification and
  repository instructions.

## 4. Chosen Architecture

Choose Option B: a dedicated lifecycle/session controller with existing engine modules
remaining authoritative for gameplay facts.

The controller owns:

- lifecycle state;
- allowed transitions;
- result snapshot capture;
- best-score read/update/write;
- Play Again and Main Menu commands;
- reset orchestration;
- guards for pause and terminal input.

The controller does not own:

- live snake position;
- score accumulation rules;
- timer tick implementation;
- food, bonus, obstacle, or collision rules;
- R3F rendering or `useFrame`.

The chosen ownership is recorded in
[`adr/0001-use-session-controller-for-lifecycle-ownership.md`](./adr/0001-use-session-controller-for-lifecycle-ownership.md).

## 5. Lifecycle State Model

Represent lifecycle as a small discriminated union, exposed by the session controller
for UI and tests:

| State | Meaning | Gameplay frame advancement | Movement input | Pause input |
|---|---|---:|---:|---:|
| `main-menu` | No active gameplay session is advancing. | No | Ignored | Ignored |
| `starting-session` | Reset and level 1 initialization are in progress. | No | Ignored | Ignored |
| `active-gameplay` | Gameplay can advance through `useFrame`. | Yes | Accepted | Accepted |
| `paused` | Active session is intentionally stopped. | No | Ignored | Resume only |
| `level-complete` | Current level is complete and next transition is being prepared. | No | Ignored | Ignored |
| `game-over` | Terminal failure result is visible. | No | Ignored | Ignored |
| `victory` | Terminal final completion result is visible. | No | Ignored | Ignored |

Only this lifecycle state is observable in the UI layer. Live gameplay values stay in
engine modules and are read only when needed for HUD rendering or terminal snapshots.

## 6. State-Transition Model

Allowed commands:

| Command | Allowed from | Result |
|---|---|---|
| `startFromMainMenu()` | `main-menu` | `starting-session` -> `active-gameplay` |
| `pause()` | `active-gameplay` | `paused` |
| `resume()` | `paused` | `active-gameplay` |
| `completeLevel()` | `active-gameplay` | `level-complete`, then next level or `victory` |
| `reportGameOver(reason)` | `active-gameplay` | `game-over` with snapshot |
| `reportVictory()` | `level-complete` | `victory` with snapshot |
| `playAgain()` | `game-over`, `victory` | `starting-session` -> `active-gameplay` |
| `returnToMainMenu()` | `game-over`, `victory` | `main-menu` |

Invalid commands are no-ops that do not mutate engine state. This is required for
terminal input ignoring and React StrictMode idempotence.

## 7. Session Reset Contract

`resetSession()` is the only operation that prepares a clean session. It is
idempotent: running it repeatedly must leave the same clean state and must not append,
toggle, or decrement state.

Reset sequence:

1. Move lifecycle to a non-advancing state (`starting-session` or `main-menu`).
2. Disable gameplay input by lifecycle guard.
3. Stop timer progression.
4. Clear registered session timeouts and intervals.
5. Clear pending component-owned animation teardown handles.
6. Reset engine gameplay state through exact reset APIs.
7. Reset animation and obstacle visual state through exact reset APIs.
8. Clear session protocol.
9. Reset pause, mistake, and input state.
10. Initialize level 1 only when the command is Play Again or Start.
11. Transition to `active-gameplay` only after initialization succeeds.

Best score is explicitly excluded from `resetSession()`.

## 8. Reset Ownership Matrix

| State owner | Current evidence | Required reset/cleanup action |
|---|---|---|
| Current level | `src/engine/levels/currentLevel.ts`, startup via `setInitialLevelOfGame` | Exact set to level 1 before new session. |
| Score | `src/engine/scores/scores.ts` has increment-only `setScores` | Add exact `resetScores()` or `setScoresTotal(0)`. |
| Lives | `src/engine/lives/lives.ts` uses additive `setLives` | Add exact reset/set API; define no-lives semantics without negative display. |
| Timer elapsed/running | `src/engine/time/timer.ts`, `src/engine/time/isTimer.ts` | Set elapsed to 0 and stopped; no additive timer cleanup. |
| Time-per-level and step | `src/engine/time/*`, loaded from level JSON | Reinitialize from level 1 config only during session start. |
| Snake head/body/direction | `src/engine/snake/*` | Reset head, body, stopped direction, previous direction-derived state. |
| Food state | `src/engine/food/*` | Reset amount, current food number, food position, food score, per-level food config. |
| Obstacles engine | `src/engine/obstacles/*`, movement histories in `moveObstacles.ts` | Reset obstacle arrays, step counters, movement histories, speed counters, collision caches. |
| Obstacles visual state | module arrays in `src/components/Obstacles.tsx` | Move behind resettable module/helper or clear on reset/unmount. |
| Bonuses | `src/engine/bonuses/*` flags and current bonus | Add central `resetBonuses()` clearing config-derived current state, active flags, caught/available state, and effects. |
| Protocol | `src/engine/protocol/protocol.ts` | Add `clearProtocol()`; protocol is session-scoped. |
| Pause engine flag | `src/engine/events/pauseEvent.ts` module `isPause` | Add exact `setPause(false)` or `resetPause()`; no toggles in reset. |
| Pause UI store | `src/store/menuStore.ts` | UI mirrors lifecycle; reset to non-paused explicitly. |
| Menu UI store | `src/store/menuStore.ts` | Stop using title strings as lifecycle; display derived lifecycle/result view. |
| Mistake flag | `src/engine/lives/isMistake.ts` | Reset to no active mistake. |
| Input listeners | `src/components/Game.tsx` document keydown effect | Attach one lifecycle-derived listener; remove on cleanup and state changes. |
| Life-lost effects | `src/engine/protocol/lifeLost.ts` interval/timeout handles | Register handles with cleanup or expose `clearLifeLostEffects()`. |
| Game finish timeout | `src/components/Game.tsx` `finishTimeoutRef` | Clear on lifecycle reset and unmount; avoid stale delayed scene hide. |
| Animation counters | `src/animations/snakeAnimation/*`, `counterUnits` append | Add reset APIs for body/head counters, previous steps, wave/eating state, refs-derived counters. |
| Render/HUD side effects | `src/engine/render/*` | Reset rendered info and temporary opacity/effect mutations to normal state. |
| Best score | New localStorage key | Persistent; never cleared by Play Again or Main Menu. |

## 9. Result Snapshot Model

Terminal result data must be captured before any reset:

| Snapshot field | Game Over | Victory | Source |
|---|---|---|---|
| `kind` | `game-over` | `victory` | Controller transition |
| `score` | current score | final score | `getScores()` |
| `bestScore` | updated best | updated best | best-score service |
| `levelReached` | current level | N/A | current level getter |
| `levelsCompleted` | N/A | max completed level | current/max level getters |
| `failureReason` | supported reason | N/A | mapped terminal event |

Failure reason mapping:

- existing `no moves` -> `no available moves`;
- existing `time limit` -> `time expired`;
- existing `lives limit` -> `no lives remaining`.

No-lives semantics:

- A life is a recovery token.
- `no lives remaining` means a life-loss condition has consumed the last available
  recovery and gameplay must not resume.
- The implementation should replace the current `getLives() < 0` terminal predicate
  with an explicit non-negative remaining-lives rule. The player-facing remaining
  lives value must not be displayed below zero.

## 10. Best-Score Persistence Design

Use `localStorage` with a namespaced key such as `snake3d.bestScore`.

Read behavior:

- Missing value -> 0.
- Non-numeric, negative, non-finite, or fractional values -> 0.
- Valid numeric value -> integer best score.

Update behavior:

- On Game Over or Victory, compare the terminal snapshot score to the validated stored
  best score.
- If current score is higher, write the new score to `localStorage`.
- If current score is lower or equal, leave storage unchanged.
- Show the best score used for the result snapshot.

Error behavior:

- If reading throws, treat best score as 0 for that result.
- If writing throws, keep the result screen visible and show the best score computed
  in memory for that terminal event.
- Best-score errors must never force reload or block Play Again/Main Menu.

Existing `localStorage.protocol` writes are not best-score persistence. Protocol data
must not influence session startup or reset behavior.

## 11. Input And Pause Ownership

The session controller owns whether input is allowed. `Game` owns DOM listener
registration because it is the mounted browser component that can reliably clean up
listeners.

Listener design:

- Derive the active keydown handler from lifecycle state.
- `active-gameplay`: gameplay handler accepts arrows, speed keys, and pause.
- `paused`: only resume input is accepted.
- `main-menu`, `starting-session`, `level-complete`, `game-over`, `victory`: movement,
  speed, and pause input are ignored.
- Effect cleanup removes the currently registered listener before registering another.

Pause design:

- Pause command is valid only from `active-gameplay`.
- Resume command is valid only from `paused`.
- Engine pause state and UI pause state are reset with exact setters, not toggles.
- Existing `swapPause()` can remain as a compatibility helper during migration, but
  the final implementation should expose explicit pause/resume/reset operations.

## 12. Timer, Interval, Timeout, And Listener Cleanup

Use one session cleanup registry owned by the session controller or a closely scoped
session-effects module. It tracks handles created outside React effect cleanup.

Required cleanup:

- Stop the game timer through `stopTimer()`.
- Clear life-lost interval and timeout handles.
- Clear delayed scene-finish timeout from `Game`.
- Clear any temporary visual effect handles added by bonuses or animations.
- Remove or no-op stale input handlers through lifecycle listener derivation.
- Restore temporary HUD opacity/visual effects to normal.

React-owned effects still clean themselves up on unmount. Session-owned temporary
effects must also clean up on Play Again and Main Menu, because those transitions no
longer reload the browser.

## 13. React And R3F Integration

`Game` remains the bridge between React, R3F, and engine modules:

- `useFrame` continues to call `setLoop(delta)` and `renderInfo()`.
- `setLoop` or its caller must skip gameplay advancement unless lifecycle is
  `active-gameplay`.
- Rendering may continue for visible menu/result overlays, but gameplay mutation must
  not.
- Terminal transitions are reported from engine/protocol handlers to the session
  controller instead of mutating menu title strings and reloading.
- Result UI is rendered from the session controller's lifecycle and result snapshot.

React StrictMode handling:

- Do not start sessions from component render.
- Effects must remove listeners before adding and on cleanup.
- Reset APIs must set exact values and tolerate repeated calls.
- Use a session generation id or equivalent guard so stale timeouts cannot mutate a
  later session.
- Component remount must not imply Play Again; only player commands do.

## 14. Testing Strategy

Deterministic unit tests:

- Lifecycle transition reducer/commands cover allowed and ignored transitions.
- Best-score parser/updater covers missing, invalid, lower, equal, higher, and storage
  failure cases.
- Failure-reason mapper covers all supported reasons.
- Reset APIs cover score, protocol, timer, lives, pause, mistake, bonuses, obstacles,
  animation counters, and temporary effect cleanup.
- Idempotence tests call each reset API multiple times.

10-cycle verification:

- Use Vitest integration tests against the session controller and reset APIs.
- Simulate terminal snapshot -> Play Again -> initialized level 1 for at least 10
  consecutive cycles.
- Assert no stale score, lives, timer, bonuses, obstacles, protocol, pause, input
  state, intervals, or animation counters.
- This avoids slow random gameplay and avoids production-only hidden controls.

Browser verification:

- Playwright covers start, pause/resume, one Game Over path, Victory result visibility,
  Play Again, Main Menu, best-score survival across refresh, no reload during lifecycle
  transitions, terminal input ignoring, and no duplicate listener effects.
- Existing random-play stability remains useful but is not the proof of lifecycle
  correctness.

Verification gates:

- Run `npm run test:unit` for deterministic reset/lifecycle coverage.
- Run `npm run verify` before review.
- Run `npm run test:e2e` before code completion.

## 15. Error Handling

- Invalid lifecycle commands are ignored and may be logged in development, but must not
  throw during gameplay.
- Best-score storage failures degrade to in-memory display for the current result.
- Reset failure should leave gameplay non-advancing and surface a recoverable UI state
  rather than continuing with partially reset active gameplay.
- Startup fatal errors remain handled by existing `ErrorScreen`; its reload button is
  outside this feature.
- Terminal result screens remain visible even if protocol persistence fails.

## 16. Migration Sequence

Deliver implementation later as vertical slices, not as a broad rewrite:

1. Add lifecycle/session controller types, transition commands, and deterministic
   tests.
2. Add best-score service and result snapshot tests.
3. Add narrow reset APIs for core session state: score, protocol, timer, level, lives,
   pause, mistake.
4. Add reset/cleanup APIs for snake, food, bonuses, obstacles, animation counters, and
   temporary effects.
5. Wire Game Over to snapshot and result UI without reload.
6. Wire Victory to snapshot and result UI without reload.
7. Wire Play Again and Main Menu to the reset contract.
8. Add lifecycle Playwright coverage and keep the existing random-play stability check.

These are implementation slices, not task tickets.

## 17. Risks And Mitigations

| Risk | Mitigation |
|---|---|
| Reload removal exposes incomplete cleanup. | Add reset ownership matrix APIs before wiring Play Again broadly. |
| Zustand menu title strings remain implicit lifecycle. | Move lifecycle authority to controller; UI derives display from lifecycle and snapshot. |
| Scores/protocol lack reset APIs. | Add narrow exact reset APIs with unit tests. |
| Animation and obstacle module arrays accumulate. | Add explicit reset APIs and idempotence tests for arrays/counters. |
| Bonus flags reset incompletely. | Add central `resetBonuses()` covering all active/config/current/caught flags. |
| `lifeLost()` effects survive restart. | Register or expose cleanup for interval/timeout handles. |
| Pause split causes inconsistent state. | Controller owns pause validity; engine/UI pause get exact setters. |
| No-lives behavior changes balance. | Define non-negative no-lives semantics and pin with tests; do not change level JSON. |
| StrictMode double effects duplicate listeners. | Listener effect removes before add; lifecycle invalid commands are no-ops. |
| Browser tests become slow or random. | Use deterministic Vitest 10-cycle coverage; use Playwright for visible representative flows. |

Feature-size recommendation: keep feature size `M`. The work is multi-module but
bounded to lifecycle, reset, result UI, and local persistence. Reclassify to `L` before
TASKS only if the reset API work requires replacing core engine ownership rather than
adding narrow reset/cleanup seams.

## 18. Traceability To Requirements And Acceptance Criteria

### Functional Requirements

| Requirement | Design coverage | Verification |
|---|---|---|
| FR-01 | States and `startFromMainMenu()` | Unit transition test, Playwright start |
| FR-02 | Lifecycle state model | Unit state model test, result UI tests |
| FR-03 | Failure reason mapping | Unit mapper tests |
| FR-04 | Result snapshot and UI | Component/Playwright Game Over |
| FR-05 | Result snapshot and UI | Component/Playwright Victory |
| FR-06 | Terminal states no auto-transition | Playwright 30s stability |
| FR-07 | `playAgain()` reset path | 10-cycle integration |
| FR-08 | `returnToMainMenu()` path | Unit and Playwright |
| FR-09 | Best-score service | Unit storage tests |
| FR-10 | Best excluded from reset | Unit reset/persistence tests |
| FR-11 | Reload removal design | Playwright reload counter |
| FR-12 | Input lifecycle guard | Unit command no-op, Playwright input |
| FR-13 | Pause lifecycle guard | Unit transition and Playwright pause |
| FR-14 | Reset ownership matrix | Unit reset coverage checklist |

### Acceptance Criteria

| AC | Design coverage |
|---|---|
| AC-01 | Session reset contract, reset matrix |
| AC-02 | Input and pause ownership |
| AC-03 | Pause guard in lifecycle state model |
| AC-04 | Game Over snapshot and mapper |
| AC-05 | Game Over snapshot and mapper |
| AC-06 | No-lives semantics and mapper |
| AC-07 | Terminal input guard |
| AC-08 | Victory snapshot |
| AC-09 | Terminal state no auto-transition, reload removal |
| AC-10 | Play Again reset path |
| AC-11 | Play Again reset path |
| AC-12 | Best-score exclusion from reset |
| AC-13 | Reset ownership matrix |
| AC-14 | 10-cycle deterministic integration strategy |
| AC-15 | Main Menu transition |
| AC-16 | Main Menu transition |
| AC-17 | Main-menu input guard |
| AC-18 | Best-score update behavior |
| AC-19 | Best-score unchanged behavior |
| AC-20 | Best-score persistence across refresh |
| AC-21 | Best-score error handling |
| AC-22 | Testing strategy |
| AC-23 | Listener lifecycle design |
| AC-24 | Cleanup registry and reset matrix |
| AC-25 | Verification gates and review evidence |

## 19. ADR Decision Requirement

An ADR is required because lifecycle ownership:

- crosses React UI, Zustand UI stores, engine protocol handlers, tests, and persistence;
- has legitimate alternatives with different migration costs;
- would be expensive to reverse after implementation tasks are split and merged.

ADR created:

- [`adr/0001-use-session-controller-for-lifecycle-ownership.md`](./adr/0001-use-session-controller-for-lifecycle-ownership.md)

