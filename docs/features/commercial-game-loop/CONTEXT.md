# Context - commercial-game-loop

## 1. Feature Goal

Define and harden the complete commercial game-session loop so a player can open the
game, start, play, pause, lose or finish, see a clear result, and restart without a
browser refresh or stale runtime state.

This survey is evidence for the next SDD `SPECIFY` phase. It does not define final
acceptance criteria.

## 2. Current Confirmed Behavior

- The browser entrypoint registers lifecycle listeners with one `AbortController`,
  starts `main()` on `DOMContentLoaded` or immediately, and exposes
  `window.__cleanupBootstrap` for tests and HMR consumers (`src/index.ts:6`,
  `src/index.ts:11`, `src/index.ts:45`, `src/index.ts:56`, `src/index.ts:61`).
- `main()` parses `?level=`, defaults to level 1, initializes engine state through
  `setInitialLevelOfGame(level)`, disables page scrolling, and renders `<Main />`
  when initialization succeeds (`src/main.tsx:13`, `src/main.tsx:27`,
  `src/main.tsx:28`, `src/main.tsx:31`).
- Initial UI menu state is visible with title `start`; clicking any non-pause,
  non-game-over menu hides the overlay and starts accepting gameplay input
  (`src/store/menuStore.ts:10`, `src/store/menuStore.ts:11`,
  `src/store/menuStore.ts:12`, `src/components/Menu.tsx:18`).
- R3F drives the game loop. `Game` calls `setLoop(delta)` and `renderInfo()` from
  `useFrame`; `setLoop` checks terminal conditions, calls `playLevel()` when the
  game is not interrupted, and increments elapsed timer only when the timer flag is
  running (`src/components/Game.tsx:43`, `src/components/Game.tsx:44`,
  `src/components/Game.tsx:45`, `src/engine/time/setLoop.ts:18`,
  `src/engine/time/setLoop.ts:20`, `src/engine/time/setLoop.ts:23`).
- Gameplay state is stored mostly in module-level variables: protocol, snake state,
  score, lives, timer, level, food, obstacles, bonuses, pause flag, and animation
  state (`src/engine/protocol/protocol.ts:14`, `src/engine/snake/snake.ts:17`,
  `src/engine/scores/scores.ts:10`, `src/engine/lives/lives.ts:11`,
  `src/engine/time/timer.ts:10`, `src/engine/events/pauseEvent.ts:14`).
- Keyboard listener ownership is in `Game`: it removes both gameplay and pause
  listeners, then adds either `keyboardPauseEvent` for the pause menu or
  `keyboardEvents` while the menu is hidden (`src/components/Game.tsx:19`,
  `src/components/Game.tsx:20`, `src/components/Game.tsx:24`,
  `src/components/Game.tsx:26`, `src/components/Game.tsx:30`).
- The first directional key starts the timer if the direction event is valid
  (`src/engine/events/keyboardEvents.ts:59`, `src/engine/events/keyboardEvents.ts:62`).
- Pause is split between a module-level `isPause` flag and a Zustand pause store.
  Pressing Space toggles menu visibility, sets the title to `Pause`, toggles the
  Zustand pause flag, flips the engine pause flag, and stops the timer
  (`src/engine/events/pauseEvent.ts:14`, `src/engine/events/pauseEvent.ts:35`,
  `src/engine/events/pauseEvent.ts:37`, `src/engine/events/pauseEvent.ts:39`,
  `src/engine/events/pauseEvent.ts:41`).
- Game over occurs through `gameOverEvent()` when lives are below zero or elapsed
  time exceeds level time, and through `keyboardEvents()` when the player has no
  available move after a mistake (`src/engine/events/gameOverEvent.ts:17`,
  `src/engine/events/gameOverEvent.ts:21`, `src/engine/events/keyboardEvents.ts:50`,
  `src/engine/events/keyboardEvents.ts:52`).
- `gameOver()` stops the timer, opens a menu if it is not already visible, sets a
  `Game over! ... Press OK to replay...` title, and stores the protocol in
  `localStorage.protocol` (`src/engine/protocol/gameOver.ts:14`,
  `src/engine/protocol/gameOver.ts:20`, `src/engine/protocol/gameOver.ts:22`,
  `src/engine/protocol/gameOver.ts:24`).
- Clicking a game-over menu reloads the page instead of resetting in-app state
  (`src/components/Menu.tsx:13`).
- Completing all food triggers `level is complete`; the handler increments current
  level. If there is another level, it stops the timer, opens the menu, clears
  bonuses, and calls `setInitialLevelOfGame()` for the next level. If the max level
  has been passed, it shows a win title, stores protocol, and calls
  `location.reload()` immediately (`src/engine/events/levelCompleteEvent.ts:18`,
  `src/engine/protocol/levelComplete.tsx:22`, `src/engine/protocol/levelComplete.tsx:24`,
  `src/engine/protocol/levelComplete.tsx:31`, `src/engine/protocol/levelComplete.tsx:32`,
  `src/engine/protocol/levelComplete.tsx:34`, `src/engine/protocol/levelComplete.tsx:40`,
  `src/engine/protocol/levelComplete.tsx:42`).
- Life loss stops the timer, decrements lives, starts a blinking interval for the
  life HUD, and clears that interval after 5 seconds. It does not reset the mistake
  flag in the active code path (`src/engine/protocol/lifeLost.ts:21`,
  `src/engine/protocol/lifeLost.ts:24`, `src/engine/protocol/lifeLost.ts:25`,
  `src/engine/protocol/lifeLost.ts:35`, `src/engine/protocol/lifeLost.ts:39`).
- No implemented best-score persistence was found. The roadmap calls for best score
  persistence, while source search found only protocol persistence in localStorage
  (`docs/roadmap.md:73`, `src/engine/protocol/gameOver.ts:24`,
  `src/engine/protocol/levelComplete.tsx:31`).

## 3. Relevant Files and Responsibilities

- `src/index.ts`: app bootstrap lifecycle listeners, bootstrap cleanup hook, React root
  unmount, scroll restore.
- `src/main.tsx`: parse startup level, initialize game state, render normal or error
  screen, disable or re-enable scrolling.
- `src/components/Main.tsx`: React/R3F canvas shell, lazy scene/menu composition.
- `src/components/Game.tsx`: frame loop bridge, keyboard listener switching, delayed
  scene teardown after interrupt.
- `src/components/Menu.tsx`: overlay click behavior for start, pause resume, and
  game-over reload.
- `src/store/menuStore.ts`: Zustand menu visibility/title and pause UI state.
- `src/engine/events/keyboardEvents.ts`: converts key presses to direction, speed,
  pause, and no-moves game-over events.
- `src/engine/events/pauseEvent.ts`: engine pause flag plus pause menu side effects.
- `src/engine/events/interruptGameEvent.ts`: terminal-state detection and interrupt
  flag.
- `src/engine/protocol/*`: protocol event append and handlers for start, food, bonus,
  life lost, level complete, and game over.
- `src/engine/levels/*`: current level, max level, static level JSON loading, per-level
  values.
- `src/engine/time/*`: elapsed timer, timer running flag, speed step, level time.
- `src/engine/snake/*`: snake head/body state, movement, contact handling support.
- `src/engine/food/*`: food score, food position, amount, current food number.
- `src/engine/lives/*`: lives, per-level lives, mistake flag.
- `src/engine/scores/*`: current score and max score per level.
- `src/engine/bonuses/*`: bonus configuration, current bonus, availability, caught
  state, active bonus flags, bonus effects.
- `src/engine/obstacles/*`: obstacle configuration, coordinates, steps, speed counter,
  frame collision cache, movement history arrays.
- `src/animations/snakeAnimation/*`: snake animation counters, refs, body/head
  positions, rotations, scales, wave state, previous steps.
- `tests/e2e/snake-random-play.spec.ts`: random-play browser stability check.
- `tests/unit/mulberry32.test.ts`: current deterministic unit coverage.

## 4. Current State Transitions

Confirmed transitions:

1. Browser loads app.
2. `main()` initializes level state and renders the canvas shell.
3. Menu starts visible with title `start`.
4. User clicks menu: overlay hides; `Game` attaches gameplay key listener.
5. User presses a direction: direction event is processed and timer starts.
6. R3F frame loop advances rules and render state.
7. Space opens pause menu, toggles pause flags, and stops timer.
8. Clicking pause menu resumes by toggling both pause stores/flags and hiding menu.
9. Food eaten advances food count, score, and snake growth.
10. All food eaten triggers level completion.
11. Non-final level completion initializes the next level in the same page.
12. Life loss stops timer, decrements lives, and shows temporary HUD blinking.
13. Game-over menu click reloads the page.
14. Final win path currently stores protocol and reloads immediately.

Inference:

- `location.reload()` is acting as the only full-session reset for game-over and final
  win paths. Non-final level transitions perform a partial in-page reinitialization.

## 5. Existing Reset and Cleanup Mechanisms

- Bootstrap cleanup aborts window listeners registered with the bootstrap
  `AbortController`, unmounts the React root, clears `window.__appRoot`, and enables
  scrolling (`src/index.ts:11`, `src/index.ts:17`, `src/index.ts:18`,
  `src/index.ts:21`).
- Scroll lock is idempotent and can be reset through `enableScrolling()` or
  `resetScrollLock()` (`src/commands/disableScrolling.ts:6`,
  `src/commands/enableScrolling.ts:6`, `src/commands/scrollController.ts:11`).
- `Game` removes keydown listeners before adding the current one and removes both on
  effect cleanup (`src/components/Game.tsx:20`, `src/components/Game.tsx:21`,
  `src/components/Game.tsx:30`, `src/components/Game.tsx:31`).
- `Game` clears its delayed finish timeout on unmount (`src/components/Game.tsx:35`,
  `src/components/Game.tsx:38`).
- `loadLevelProps()` resets timer elapsed by adding `-getTimer()`, adjusts lives to
  the per-level configured amount, sets `setNewGame()`, and stops the timer
  (`src/engine/levels/loadLevelProps.ts:29`, `src/engine/levels/loadLevelProps.ts:35`,
  `src/engine/levels/loadLevelProps.ts:47`, `src/engine/levels/loadLevelProps.ts:48`).
- `startLevel()` marks level incomplete, clears stopped snake direction, places the
  snake, creates obstacles and food, resets obstacle speed, clears caught/available
  bonus state (`src/engine/protocol/startLevel.ts:19`, `src/engine/protocol/startLevel.ts:20`,
  `src/engine/protocol/startLevel.ts:21`, `src/engine/protocol/startLevel.ts:25`,
  `src/engine/protocol/startLevel.ts:26`, `src/engine/protocol/startLevel.ts:27`,
  `src/engine/protocol/startLevel.ts:28`).
- `amountOfFoodPerLevel` has `resetAmountOfFood()`, but no call site was found during
  this survey (`src/engine/food/amountOfFoodPerLevel.ts:50`).
- `setObstacleStep` has a per-frame cache reset called by obstacle movement
  (`src/engine/obstacles/setObstacleStep.ts:15`, `src/engine/obstacles/setObstacleStep.ts:58`,
  `src/engine/obstacles/moveObstacles.ts:57`).

No confirmed full in-app reset exists for protocol, score, best score, pause flags,
mistake flag, snake animation counters, obstacle movement history, or all bonus flags.

## 6. Known Problems

- Game-over restart uses `location.reload()` instead of in-app reset
  (`src/components/Menu.tsx:13`).
- Final win path calls `location.reload()` immediately after setting the win title,
  which likely prevents the player from reviewing the win screen
  (`src/engine/protocol/levelComplete.tsx:26`, `src/engine/protocol/levelComplete.tsx:32`).
- Game-over title only names `no moves` and `time limit`; the `lives limit` event
  produces an empty reason in the menu title (`src/engine/protocol/gameOver.ts:17`,
  `src/engine/protocol/gameOver.ts:18`, `src/engine/events/gameOverEvent.ts:19`).
- `scores` only increments and has no reset function in the module
  (`src/engine/scores/scores.ts:10`, `src/engine/scores/scores.ts:15`).
- `protocol` has a setter but no explicit clear/reset call in the current lifecycle
  (`src/engine/protocol/protocol.ts:14`, `src/engine/protocol/protocol.ts:36`).
- `setCounterUnits()` appends to `counterUnits` without clearing, so repeated
  in-page level initialization can accumulate animation counter entries
  (`src/animations/snakeAnimation/bodyAnimations/snakeBodyMoving.ts:14`,
  `src/animations/snakeAnimation/bodyAnimations/snakeBodyMoving.ts:29`).
- `lifeLost()` creates interval/timeout handles but does not expose cleanup if the
  game restarts, unmounts, or reloads before the 5-second timeout fires
  (`src/engine/protocol/lifeLost.ts:25`, `src/engine/protocol/lifeLost.ts:35`).
- `lifeLost()` leaves `noMistakeWasMade()` commented out, so mistake recovery relies
  on another path if any; this needs design-level verification
  (`src/engine/protocol/lifeLost.ts:39`, `src/engine/lives/isMistake.ts:20`).
- Obstacle rendering has module-level visual arrays and counters outside the React
  component, with no reset on component unmount or new level
  (`src/components/Obstacles.tsx:15`, `src/components/Obstacles.tsx:16`,
  `src/components/Obstacles.tsx:17`, `src/components/Obstacles.tsx:18`).
- Obstacle engine movement history arrays persist at module scope and have no reset
  API (`src/engine/obstacles/moveObstacles.ts:16`, `src/engine/obstacles/moveObstacles.ts:17`,
  `src/engine/obstacles/moveObstacles.ts:18`, `src/engine/obstacles/moveObstacles.ts:19`).
- Several active bonus flags have setters but no central reset found:
  stops-growing, crosses-borders, breaks-obstacles, double-score, add-time,
  add-lives, add-scores (`src/engine/bonuses/bonusSnakeStopsGrowing.ts:8`,
  `src/engine/bonuses/bonusSnakeCrossesBorders.ts:8`,
  `src/engine/bonuses/bonusSnakeBreaksObstacles.ts:8`,
  `src/engine/bonuses/bonusDoubleScoresFood.ts:8`,
  `src/engine/bonuses/bonusAddTime.ts:11`,
  `src/engine/bonuses/bonusAddLives.ts:11`,
  `src/engine/bonuses/bonusAddScores.ts:11`).
- Current architecture has no best-score persistence even though the commercial MVP
  roadmap requires it (`docs/roadmap.md:73`).

## 7. Dependencies and Constraints

- Must keep React + TypeScript + Vite, React Three Fiber, and Three.js.
- Must keep the R3F `useFrame` game loop; do not introduce a second game loop.
- Core engine state is mutable module state under `src/engine/`; reset work must either
  centralize cleanup around those modules or add narrow reset APIs to them.
- Zustand is currently UI-only and should not become a parallel gameplay state system
  without an approved design.
- Level data is static JSON; do not silently rebalance level values.
- No backend, account system, database, or persistent profile exists.
- Verification commands are available through npm scripts: `typecheck`, `lint`,
  `test:unit`, `verify`, `build`, and `test:e2e`.

## 8. Testing Coverage and Gaps

Confirmed coverage:

- `npm run test:unit` passes: 1 Vitest file, 2 tests, covering deterministic
  `mulberry32` only.
- Playwright has one 5-minute random-play stability test that opens `/`, sends random
  arrow keys, watches console/page/crash/request failures, checks for animation-frame
  hangs, and calls `window.__cleanupBootstrap` in `finally`
  (`tests/e2e/snake-random-play.spec.ts:7`, `tests/e2e/snake-random-play.spec.ts:25`,
  `tests/e2e/snake-random-play.spec.ts:35`, `tests/e2e/snake-random-play.spec.ts:43`,
  `tests/e2e/snake-random-play.spec.ts:54`, `tests/e2e/snake-random-play.spec.ts:103`).

Important gaps:

- No deterministic test covers full session initialization.
- No deterministic test covers reset of score, lives, timer, current level, snake,
  food, obstacles, bonuses, protocol, pause, or mistake state.
- No test asserts game-over reason text.
- No test asserts restart without `location.reload()`.
- No test asserts final win screen visibility before replay.
- No test detects duplicate document listeners after pause/resume or restart.
- No test detects leftover timers/intervals after life loss.
- No test covers best-score persistence.
- No mobile lifecycle coverage currently exists.

## 9. Technical Risks

- A commercial restart feature touches many module-level state owners; missing even one
  reset can cause stale state or non-deterministic behavior after replay.
- Existing non-final level transition already reinitializes in-page, but some animation
  and obstacle module state appears to persist, so level-to-level behavior may already
  contain hidden drift.
- React StrictMode can mount effects more than once in development; listener code
  removes before adding, but module-level animation and engine state does not have the
  same lifecycle protection.
- The current e2e stability test may pass while restart correctness is broken because
  it does not drive game-over/restart assertions.
- Replacing reload with in-app reset will expose cleanup obligations currently hidden
  by a full browser reload.
- Some comments and text contain mojibake/non-English text. This is not a functional
  blocker, but it increases review risk when changing player-facing strings.

## 10. Open Product Questions

These should be answered during `SPECIFY`:

1. Should `commercial-game-loop` include best-score persistence, or only unblock it with
   a clean reset contract while `high-score-persistence` remains separate?
2. What should happen after final win: show a results screen with replay, advance to a
   later menu, or immediately offer restart?
3. What result information must be shown after game over and win: score, level reached,
   time, cause of failure, best score, or protocol summary?
4. Should restart always begin at level 1, or replay the current/failed level?
5. Should pause be available on the start, level-complete, game-over, and win screens,
   or only during active play?

## 11. Recommended Feature Boundaries

Recommended in scope:

- Replace game-over and final-win `location.reload()` replay paths with an explicit
  in-app session reset.
- Define one reset contract that covers gameplay state, UI state, input state, timers,
  temporary effects, animation state needed for replay, and obstacle/bonus state.
- Preserve the existing R3F frame loop and current engine module layout.
- Add deterministic unit tests for resettable state modules where practical.
- Add Playwright coverage for start -> play -> pause/resume -> terminal state ->
  restart without reload.
- Document any state that remains intentionally persistent, such as protocol export or
  best score if included.

Recommended defer or split:

- Best-score persistence can be included only if the spec makes it a core result-screen
  requirement; otherwise keep it as `high-score-persistence`.
- Mobile controls and responsive HUD should remain later features unless a small
  lifecycle behavior is necessary for restart correctness.

## 12. Out-of-Scope Items

- New backend, accounts, payments, multiplayer, leaderboards, or database.
- Level balance changes or level JSON value changes.
- New rendering engine, second game loop, or replacement state architecture.
- Broad visual redesign, tutorial, mobile controls, audio, analytics, deployment, or
  monetization.
- Rewriting all engine modules for purity in one pass.
- Changing existing snake, obstacle, food, or bonus rules except where necessary to
  make lifecycle reset correct and testable.
