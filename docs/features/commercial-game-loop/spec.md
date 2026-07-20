---
status: Draft
owner: "Tech Lead"
reviewers: ["Maintainer"]
updated_at: "2026-07-20"
feature_size: "M"
---

# Spec - commercial-game-loop

> **Glossary / survey:** [CONTEXT](./CONTEXT.md)
> **Reference module / docs / channels used:** `AGENTS.md`, `README.md`,
> `docs/architecture-map.md`, `docs/roadmap.md`,
> `docs/features/commercial-game-loop/CONTEXT.md`, `package.json`.

## 1. Feature Purpose

Snake3D needs a complete commercial game-session loop: a player can start, play,
pause during active play, lose or win, read the result, and choose what to do next
without the browser reloading. The current surveyed behavior relies on reload for
game-over replay and final victory, which hides stale-state risks and prevents a
polished result flow.

This matters now because the roadmap's first commercial milestone is a stable complete
session. The feature closes the highest-risk lifecycle gaps before mobile controls,
onboarding, retention polish, or release work.

The committed product approach is to introduce explicit observable game lifecycle
states, result screens for Game Over and Victory, persistent best score, and a full
new-session reset that is proven through repeated Play Again cycles.

Assumptions recorded during specify:

- Feature size is assumed `M` because the feature crosses player-facing UI, lifecycle
  behavior, persistence, and verification, but does not add accounts, backend services,
  deployment, or a new gameplay mode.
- The player is the only end-user role for runtime behavior. Maintainer and Reviewing
  agent remain verification roles for acceptance and release readiness.
- Existing game balance, level count, scoring rules, and collision rules are preserved
  unless the reset lifecycle requires restoring them to the correct initial state.

## 2. User Stories

### US-01: Start A Session

**As a** Player
**I want** to begin a new game session from the main menu
**So that** I can enter active gameplay with a correct initial state

### US-02: Pause Active Gameplay

**As a** Player
**I want** pause to work only while I am actively playing
**So that** terminal and menu screens do not accidentally change play state

### US-03: Understand Game Over

**As a** Player
**I want** a Game Over result screen with my score, best score, level reached, and failure reason
**So that** I understand what happened and can decide whether to replay

### US-04: Understand Victory

**As a** Player
**I want** a Victory result screen with final score, best score, and levels completed
**So that** finishing the game feels complete and does not disappear unexpectedly

### US-05: Play Again Cleanly

**As a** Player
**I want** Play Again to start a completely fresh session from level 1
**So that** repeated replays do not inherit stale score, lives, timer, input, or world state

### US-06: Return To Main Menu

**As a** Player
**I want** Main Menu to leave the terminal result screen and return to a non-playing start state
**So that** I can choose when to begin another session

### US-07: Keep Best Score

**As a** Player
**I want** my best score to survive replay and browser refresh
**So that** the game gives me a reason to improve over multiple sessions

### US-08: Verify Lifecycle Safety

**As a** Reviewing agent
**I want** lifecycle behavior to be covered by deterministic and browser checks
**So that** restart and cleanup regressions are caught before review

### US-09: Review Release Readiness

**As a** Maintainer
**I want** completion evidence for repeated restart, persistence, and no duplicate input handling
**So that** the feature can be judged against commercial MVP reliability goals

## 3. Functional Requirements

- FR-01: The game must expose a main menu state from which the Player can start a new
  session.
- FR-02: The game must expose active gameplay, paused, level-complete, game-over,
  victory, and main-menu states as distinct player-observable states.
- FR-03: Game Over must be reached only for supported failure reasons: no available
  moves, time expired, or no lives remaining.
- FR-04: Game Over must show the heading `Game Over`, current score, best score, level
  reached, failure reason, `Play Again`, and `Main Menu`.
- FR-05: Victory must show the heading `Victory`, final score, best score, levels
  completed, `Play Again`, and `Main Menu`.
- FR-06: Game Over and Victory result screens must remain visible until the Player
  chooses `Play Again` or `Main Menu`.
- FR-07: `Play Again` must start a completely new session from level 1.
- FR-08: `Main Menu` must return to a non-playing start state without starting a
  session by itself.
- FR-09: Best score must persist in browser-local storage using `localStorage`.
- FR-10: `Play Again` must not clear best score.
- FR-11: Browser refresh must not be required for Game Over, Victory, Play Again, or
  Main Menu transitions.
- FR-12: Gameplay movement input must be ignored while the game is in a terminal
  result state or main-menu state.
- FR-13: Pause input must be honored only during active gameplay.
- FR-14: A new session must reset all session-scoped state listed in the Reset
  Invariants section.

## 4. Game Lifecycle States

- **Main Menu:** No active session is advancing. The Player may start a session.
- **Starting Session:** A transient state where a new level 1 session is prepared for
  play. It is not a result state.
- **Active Gameplay:** The game accepts movement input, advances time, evaluates
  collisions, score, lives, food, bonuses, obstacles, and level progress.
- **Paused:** Active gameplay is temporarily stopped by the Player. Movement and timer
  progression do not advance while paused.
- **Level Complete:** The current level is complete and the game prepares the next
  level or transitions to Victory after the final level.
- **Game Over:** A terminal state caused by no available moves, time expired, or no
  lives remaining.
- **Victory:** A terminal state caused by completing the final level.

## 5. Allowed State Transitions

Allowed transitions:

- Main Menu -> Starting Session when the Player starts a game.
- Starting Session -> Active Gameplay when the session is ready.
- Active Gameplay -> Paused when the Player pauses.
- Paused -> Active Gameplay when the Player resumes.
- Active Gameplay -> Level Complete when the current level objective is completed.
- Level Complete -> Active Gameplay when the next level begins.
- Level Complete -> Victory when the final level is completed.
- Active Gameplay -> Game Over when a supported failure reason occurs.
- Game Over -> Starting Session when the Player chooses Play Again.
- Victory -> Starting Session when the Player chooses Play Again.
- Game Over -> Main Menu when the Player chooses Main Menu.
- Victory -> Main Menu when the Player chooses Main Menu.

Disallowed transitions:

- Game Over must not return to Active Gameplay through movement input.
- Victory must not return to Active Gameplay through movement input.
- Main Menu must not enter Active Gameplay through movement or pause input.
- Result screens must not disappear without an explicit Player action.
- Browser reload must not be used as a lifecycle transition.

## 6. Game Over Behavior

Game Over occurs when the Player reaches one of these failure reasons:

- `no available moves`
- `time expired`
- `no lives remaining`

The Game Over result screen must show:

- `Game Over`
- current score
- best score
- level reached
- failure reason
- `Play Again`
- `Main Menu`

The result screen must remain visible until the Player chooses an action. Movement,
speed, and pause input must not mutate gameplay while Game Over is visible.

## 7. Victory Behavior

Victory occurs when the Player completes the final available level.

The Victory result screen must show:

- `Victory`
- final score
- best score
- levels completed
- `Play Again`
- `Main Menu`

Victory must remain visible until the Player chooses an action. It must not immediately
reload the browser, disappear, or start another session without Player intent.

## 8. Play Again Behavior

Choosing `Play Again` from Game Over or Victory starts a completely new session from
level 1. The new session must behave like a fresh first session except that persistent
best score remains available.

The Player must be able to complete at least 10 consecutive Play Again cycles without
browser reload and without stale state affecting the next session.

## 9. Main Menu Behavior

Choosing `Main Menu` from Game Over or Victory returns to the main menu without browser
reload. The main menu must not keep advancing the prior session, accept gameplay
movement, keep stale pause state, or clear best score.

Starting a game from the main menu after returning from a result screen starts a new
session from level 1.

## 10. Best-Score Behavior

Best score is the highest session score recorded by the game in the current browser.
It must be shown on Game Over and Victory result screens.

Best score must:

- update when the current session score exceeds the previous best score;
- remain unchanged when the current session score is lower than or equal to the
  previous best score;
- survive Play Again;
- survive browser refresh;
- not require accounts, network access, or backend storage.

If no prior best score exists, the game must show an initial best score of zero until a
session produces a higher score.

## 11. Pause Behavior

Pause is available only during active gameplay. While paused:

- gameplay time does not advance;
- movement input does not advance the snake;
- the Player can resume active gameplay.

Pause input on Main Menu, Game Over, Victory, and other non-active states must not open
or toggle a gameplay pause state.

## 12. Reset Invariants

A new session started by Play Again or by starting from Main Menu after a terminal
result must reset all session-scoped state:

- current level;
- score;
- lives;
- elapsed timer and running timer state;
- snake state and direction;
- food state;
- obstacle state and movement history;
- bonus state and active bonus effects;
- protocol;
- pause state;
- mistake state;
- input state;
- animation state required for a clean replay;
- temporary intervals, timeouts, and visual effects.

Persistent best score must not be reset by the new-session reset.

After reset, the first visible and playable state of the new session must match a clean
level 1 session: no stale score, lives, timers, bonuses, obstacles, listeners,
intervals, protocol entries, or animation state from the prior session may influence
the new session.

## 13. Error And Edge-Case Behavior

- If stored best-score data is missing, unreadable, or invalid, the game must continue
  with best score treated as zero and must not block play.
- If best-score saving fails, the current session result must remain visible and the
  Player must still be able to choose Play Again or Main Menu.
- If a terminal state is reached while temporary visual effects are active, the result
  screen must remain stable and those effects must not continue into the next session.
- If the Player repeatedly chooses Play Again, each cycle must produce a clean new
  session without duplicate input handling or accelerated game behavior.
- If the Player presses movement or pause input rapidly on a result screen, the result
  state must remain unchanged.
- If the Player refreshes the browser from any state, the game may boot to its normal
  initial screen, and best score must remain available.

## 14. Accessibility And Input Expectations

- Result-screen actions must be reachable by pointer and keyboard.
- The focused action on result screens must be visible.
- Result-screen text must be readable without relying only on icon meaning.
- Supported failure reasons must use clear player-facing language.
- Movement input must not trigger hidden result-screen actions.
- Pause input must have no effect outside active gameplay.
- The feature must not introduce new player-facing controls that are unavailable to
  keyboard users.

## 15. Acceptance Criteria

### AC-01 (US-01) - happy

**Given** the Player is on the main menu with no active session advancing
**When** the Player starts the game
**Then** the Player enters a new level 1 session with initial score, lives, timer,
snake, food, obstacles, bonuses, protocol, pause, mistake, input, and required
animation state set for a clean first play

### AC-02 (US-02) - happy

**Given** the Player is in active gameplay
**When** the Player pauses and then resumes
**Then** gameplay stops while paused, resumes only after the Player resumes, and the
timer and movement do not advance during the paused period

### AC-03 (US-02) - domain invariant

**Given** the Player is on Main Menu, Game Over, or Victory
**When** the Player uses pause input
**Then** the game does not enter or toggle a gameplay pause state because pause is only
valid during active gameplay

### AC-04 (US-03) - happy

**Given** the active session ends because no available moves remain
**When** Game Over is shown
**Then** the Player sees `Game Over`, current score, best score, level reached, failure
reason `no available moves`, `Play Again`, and `Main Menu`

### AC-05 (US-03) - happy

**Given** the active session ends because time has expired
**When** Game Over is shown
**Then** the Player sees `Game Over`, current score, best score, level reached, failure
reason `time expired`, `Play Again`, and `Main Menu`

### AC-06 (US-03) - happy

**Given** the active session ends because no lives remain
**When** Game Over is shown
**Then** the Player sees `Game Over`, current score, best score, level reached, failure
reason `no lives remaining`, `Play Again`, and `Main Menu`

### AC-07 (US-03) - domain invariant

**Given** Game Over is visible
**When** the Player uses movement, speed, or pause input
**Then** the result screen remains visible and the prior session state does not change

### AC-08 (US-04) - happy

**Given** the Player completes the final level
**When** Victory is shown
**Then** the Player sees `Victory`, final score, best score, levels completed,
`Play Again`, and `Main Menu`

### AC-09 (US-04) - domain invariant

**Given** Victory is visible
**When** the Player takes no action
**Then** the Victory screen remains visible and the browser does not reload or start a
new session automatically

### AC-10 (US-05) - happy

**Given** Game Over is visible
**When** the Player chooses `Play Again`
**Then** a completely new session starts from level 1 without browser reload and best
score remains available

### AC-11 (US-05) - happy

**Given** Victory is visible
**When** the Player chooses `Play Again`
**Then** a completely new session starts from level 1 without browser reload and best
score remains available

### AC-12 (US-05) - cross-context

**Given** the Player has completed a session and the game recorded a best score
**When** the Player starts a new session through `Play Again`
**Then** session-scoped state is reset while the persistent best score is preserved

### AC-13 (US-05) - domain invariant

**Given** the Player starts a new session through `Play Again`
**When** the new session becomes playable
**Then** there is no stale score, lives, timer, bonus effect, obstacle position or
movement history, protocol entry, pause state, mistake state, input state, temporary
effect, or required animation state from the prior session

### AC-14 (US-05) - happy

**Given** the Player can reach a terminal result state
**When** the Player completes 10 consecutive `Play Again` cycles
**Then** every cycle starts a clean level 1 session without browser reload, duplicate
input handling, stale timers, stale protocol, or accelerated gameplay

### AC-15 (US-06) - happy

**Given** Game Over is visible
**When** the Player chooses `Main Menu`
**Then** the game returns to a non-playing main menu without browser reload and without
advancing the prior session

### AC-16 (US-06) - happy

**Given** Victory is visible
**When** the Player chooses `Main Menu`
**Then** the game returns to a non-playing main menu without browser reload and without
advancing the completed session

### AC-17 (US-06) - domain invariant

**Given** the Player is on the main menu after a terminal result
**When** the Player uses movement or pause input
**Then** no gameplay session advances until the Player explicitly starts a game

### AC-18 (US-07) - happy

**Given** the Player finishes a session with a score higher than the current best score
**When** the result screen is shown
**Then** the best score shown to the Player updates to the new higher score

### AC-19 (US-07) - domain invariant

**Given** the Player finishes a session with a score lower than or equal to the current
best score
**When** the result screen is shown
**Then** the best score shown to the Player remains unchanged

### AC-20 (US-07) - cross-context

**Given** the game has recorded a best score in the current browser
**When** the Player uses `Play Again` or refreshes the browser
**Then** the best score remains visible in later result screens

### AC-21 (US-07) - error

**Given** the stored best-score value is missing, unreadable, or invalid
**When** the Player reaches Game Over or Victory
**Then** the result screen still appears, best score is treated as zero, and the Player
can choose `Play Again` or `Main Menu`

### AC-22 (US-08) - happy

**Given** lifecycle verification is run for this feature
**When** the Reviewing agent checks the feature
**Then** the verification covers start, pause and resume, Game Over, Victory, Play
Again, Main Menu, best-score survival, repeated restarts, and terminal input ignoring

### AC-23 (US-08) - domain invariant

**Given** the Player pauses, resumes, reaches a terminal result, and restarts
**When** lifecycle verification inspects input behavior
**Then** there are no duplicate gameplay or pause input listeners affecting a single
Player action

### AC-24 (US-08) - domain invariant

**Given** temporary intervals, timeouts, or visual effects were active before a terminal
result or restart
**When** the next session becomes playable
**Then** those prior temporary effects no longer mutate the screen or session state

### AC-25 (US-09) - authorization

**Given** a change for this feature has not demonstrated the required lifecycle and
reset behavior
**When** the Maintainer reviews release readiness
**Then** the feature is treated as not ready to ship until the missing evidence is
provided

## 16. Non-Functional Requirements

| Aspect | Target | Measurement |
|---|---:|---|
| Play Again cycle reliability | 10 consecutive cycles pass without reload or stale state | Browser lifecycle scenario for this feature |
| Result-screen stability | Result screen remains visible for at least 30 seconds without player action | Browser scenario on Game Over and Victory |
| Input listener duplication | 0 duplicate gameplay or pause effects from one player action after pause/resume and restart | Instrumented lifecycle verification or browser scenario evidence |
| Best-score durability | 100% survival across Play Again and browser refresh in covered scenarios | Browser scenario using a recorded higher score |
| Deterministic reset coverage | 100% of reset invariant categories have direct verification or documented manual evidence | Feature review checklist |
| Browser reload avoidance | 0 browser reloads during Game Over, Victory, Play Again, and Main Menu transitions | Browser lifecycle scenario |

## 16.1 Security / Privacy

- **Data classification:** public gameplay preference/result data; best score is local
  game progress data and not account-linked.
- **Personal data touched:** none.
- **AuthZ/AuthN impact:** none for product runtime; the game has one local Player and
  no account permissions.
- **Abuse cases:**
  - Tampered best score: the game may display the local value but must not treat it as
    server-trusted or competitive proof.
  - Invalid stored value: the game treats it as zero and continues.
  - Shared browser profile: any person using the same browser profile may see the local
    best score.
- **Security review:** N/A because no personal data, account boundary, backend service,
  or monetization flow is introduced.

## 17. Out-of-Scope Items

- Backend services, accounts, cloud sync, payments, multiplayer, leaderboards, or
  anti-cheat.
- Level balance changes, scoring-rule changes, collision-rule changes, or new level
  content.
- Mobile controls, responsive HUD redesign, tutorial/onboarding, audio, analytics,
  deployment, release metadata, or monetization.
- A new rendering engine, second game loop, or replacement gameplay state architecture.
- A broad visual redesign of the whole game outside the required result and menu states.
- Exporting, replaying, or displaying full protocol history to the Player.

## 18. Traceability Back To CONTEXT.md Findings

| Survey finding | Spec coverage |
|---|---|
| Game-over restart uses browser reload. | FR-11, AC-10, AC-14, NFR browser reload avoidance. |
| Final win path reloads immediately. | FR-06, Victory Behavior, AC-08, AC-09. |
| No full in-app reset exists for session-scoped state. | Reset Invariants, AC-01, AC-12, AC-13, AC-14. |
| Best-score persistence was missing while roadmap requires it. | Best-Score Behavior, AC-18, AC-19, AC-20, AC-21. |
| Pause is split across UI and engine state. | Pause Behavior, AC-02, AC-03. |
| Terminal states could still receive gameplay input without explicit rules. | Allowed State Transitions, AC-07, AC-17. |
| Listener duplication and temporary effects are lifecycle risks. | AC-23, AC-24, NFR input listener duplication. |
| Existing tests do not cover lifecycle reset or restart. | AC-22, AC-25, NFR deterministic reset coverage. |
| Obstacle, bonus, protocol, animation, and timer state have stale-state risk. | Reset Invariants, AC-13, AC-14. |
| Game-over reason for no lives remaining was unclear. | FR-03, Game Over Behavior, AC-06. |

## 19. Open Questions

<!-- N/A: product decisions for this specification were supplied before writing. Design may still decide internal decomposition, state ownership, and verification mechanics. -->
