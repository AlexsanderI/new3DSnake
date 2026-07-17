# Snake3D Product and Engineering Roadmap

## Purpose

Turn the existing Snake3D pet project into a stable, understandable, mobile-ready web
game that can be published as a commercial MVP and tested with real players.

This roadmap defines priorities and outcomes. Individual features must receive their
own specification and design under `docs/features/<slug>/` before implementation.

## Product principles

- Core gameplay quality is more important than feature count.
- A complete player journey comes before accounts, payments, multiplayer, or a store.
- Mobile browser play is a first-class requirement.
- Every meaningful change should be small, reviewable, and protected by verification.
- Commercial decisions should be based on real player behavior and feedback.
- Do not monetize a broken or confusing first-session experience.

## Milestone 0 — Repository and verification foundation

**Goal:** Make the project safe for repeated agent-assisted development.

**Active SDD feature:** `repository-quality-gates` is specified in
[`docs/features/repository-quality-gates/`](features/repository-quality-gates/) and covers the
initial local and pull-request verification foundation.

**Shipped:** `repository-quality-gates` shipped on 2026-07-15 with local verification,
pull-request verification, deterministic unit-test coverage, and documented browser stability
completion gates. See the
[`repository-quality-gates` changelog](features/repository-quality-gates/CHANGELOG.md) and
[`PASS` review](features/repository-quality-gates/_review/review-2026-07-15-pass.md).

### P0 outcomes

- [x] `AGENTS.md`, `README.md`, `docs/architecture-map.md`, and this roadmap are present
      and accurate.
- [x] Generated output and local artifacts are excluded from Git.
- [x] A supported Node.js version is pinned or documented.
- [x] `npm ci` works from a clean checkout.
- [x] `npm run build` passes reliably.
- [x] Existing Playwright tests pass reliably.
- [x] Add an explicit `typecheck` script.
- [x] Add ESLint and a `lint` script.
- [x] Add a unit-test runner and initial deterministic game-rule tests.
- [x] Add one `npm run verify` command that runs all deterministic gates in a sensible
      order.
- [x] Add CI that runs `npm run verify` on pull requests.
- [ ] Establish a baseline for console errors, load time, frame rate, and bundle size.

### Suggested feature slugs

- `repository-quality-gates`
- `deterministic-game-tests`
- `continuous-integration`
- `performance-baseline`

## Milestone 1 — Stable complete game session

**Goal:** A player can complete the entire loop without refreshing the page or becoming
confused.

### P0 outcomes

- [ ] Clear start screen and obvious primary action.
- [ ] Correct initial game state on first launch.
- [ ] Reliable pause and resume behavior.
- [ ] Clear game-over or level-complete state.
- [ ] Reliable restart without browser refresh.
- [ ] Full reset of snake, score, lives, level state, food, obstacles, bonuses, timers,
      protocol state, and input state where required.
- [ ] No duplicate event listeners or stale timers after restart.
- [ ] Best score persists locally and survives refresh.
- [ ] Critical paths have deterministic tests and Playwright coverage.

### Suggested feature slugs

- `game-state-reset`
- `game-over-screen`
- `game-restart`
- `high-score-persistence`
- `pause-resume-hardening`

## Milestone 2 — First-time player experience

**Goal:** A new player understands the objective and controls within the first session.

### P0/P1 outcomes

- [ ] Short first-run tutorial or contextual hints.
- [ ] Clearly presented controls for keyboard and touch.
- [ ] Clear feedback for eating food, collecting bonuses, taking damage, losing a life,
      completing a level, and setting a new record.
- [ ] Difficulty of the first minutes is reviewed with real users.
- [ ] Text is readable and does not cover the play area.
- [ ] Tutorial can be skipped and is not repeated unnecessarily.

### Suggested feature slugs

- `first-time-player-flow`
- `control-hints`
- `gameplay-feedback`
- `difficulty-onboarding-pass`

## Milestone 3 — Mobile readiness

**Goal:** The game is comfortably playable in modern mobile browsers.

### P0 outcomes

- [ ] Touch or swipe controls with prevention of accidental reverse direction.
- [ ] Responsive HUD and menus.
- [ ] Portrait/landscape behavior is defined and tested.
- [ ] Safe handling of browser UI, resize, focus loss, and visibility changes.
- [ ] Acceptable performance on a representative mid-range Android phone.
- [ ] Touch targets are large enough and do not obstruct the field.
- [ ] Mobile Playwright projects cover at least the main journey.

### Suggested feature slugs

- `mobile-controls`
- `responsive-hud`
- `orientation-handling`
- `mobile-performance`

## Milestone 4 — Polish, accessibility, and retention

**Goal:** The game feels intentional and gives players a reason to replay.

### P1 outcomes

- [ ] Sound effects and music policy, with mute controls and persisted preference.
- [ ] Improved visual feedback without harming performance.
- [ ] Consistent UI components and design tokens where useful.
- [ ] Keyboard accessibility for menus and visible focus states.
- [ ] Reduced-motion consideration for nonessential UI animation.
- [ ] Difficulty curve and level progression reviewed.
- [ ] New-record and replay feedback.
- [ ] Error and fallback screens are clear to players.

### Suggested feature slugs

- `audio-settings`
- `ui-foundation`
- `accessibility-pass`
- `difficulty-curve`
- `replay-feedback`

## Milestone 5 — Release readiness

**Goal:** Publish a reliable MVP and observe real usage safely.

### P0 outcomes

- [ ] Production hosting and repeatable deployment process.
- [ ] Domain, title, description, favicon, social metadata, and loading experience.
- [ ] Cross-browser checks for current Chrome, Edge, Firefox, and Safari where possible.
- [ ] Runtime error monitoring.
- [ ] Privacy-respecting product analytics with documented events.
- [ ] Privacy notice and consent handling where legally required.
- [ ] Performance budget and release checklist.
- [ ] Small external playtest with documented findings.
- [ ] Fix all release-blocking findings before public promotion.

### Suggested feature slugs

- `production-deployment`
- `release-metadata`
- `runtime-error-monitoring`
- `privacy-safe-analytics`
- `cross-browser-release-check`

## Milestone 6 — Commercial validation

**Goal:** Determine whether the game attracts and retains enough players to justify
monetization and further investment.

### Questions to answer

- Do visitors start the game?
- Do new players understand the controls?
- How many complete a first session?
- How many restart immediately?
- How long is a typical session?
- Where do players quit?
- Do players return on another day?
- Which devices have performance problems?
- What do players request or dislike?

### Only after validation

Evaluate monetization options such as ads, cosmetic items, a premium version, portal
licensing, sponsored editions, or distribution partnerships. Accounts, server-backed
leaderboards, payments, and multiplayer should be separate later initiatives, not
assumed MVP requirements.

## Recommended first implementation sequence

1. `repository-quality-gates`
2. `deterministic-game-tests`
3. `game-state-reset`
4. `game-over-screen`
5. `game-restart`
6. `high-score-persistence`
7. `first-time-player-flow`
8. `mobile-controls`
9. `responsive-hud`
10. `mobile-performance`
11. `audio-settings`
12. `production-deployment`
13. `privacy-safe-analytics`
14. external playtest and release fixes

This sequence may change after the baseline audit. Do not start a feature only because
it appears next here; confirm that it addresses the highest current risk.

## Prioritization labels

- **P0:** blocks a reliable MVP or public release.
- **P1:** materially improves usability, polish, or retention.
- **P2:** useful after initial player validation.

## Feature lifecycle

Each feature should move through:

```text
candidate → specified → designed → tasked → implementing → reviewed → shipped
```

The feature directory is the canonical place for its SDD artifacts. The roadmap should
only contain a concise status and priority, not duplicate the full specification.
