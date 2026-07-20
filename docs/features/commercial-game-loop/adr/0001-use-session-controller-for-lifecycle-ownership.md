---
status: Accepted
date: "2026-07-20"
feature: "commercial-game-loop"
---

# 0001 - Use Session Controller For Lifecycle Ownership

## Context

The current Snake3D lifecycle is split across React components, Zustand menu/pause
stores, protocol handlers, keyboard handlers, and mutable engine modules. Game Over
and final Victory rely on `location.reload()` to clear state. The accepted
commercial-game-loop specification requires in-page Game Over, Victory, Play Again,
Main Menu, best-score persistence, terminal input guards, and complete repeated
session reset.

The decision must preserve the existing R3F `useFrame` loop and avoid a full engine
rewrite or duplicated gameplay state.

## Decision Drivers

- Preserve existing gameplay rules and frame loop.
- Avoid turning UI title strings into authoritative lifecycle state.
- Avoid duplicating score, lives, timer, snake, food, bonus, obstacle, or animation
  state in a new store.
- Make reset ownership explicit and testable.
- Support at least 10 repeated Play Again cycles without browser reload.
- Keep migration deliverable as vertical slices.

## Options Considered

### A. Extend Existing Zustand UI State To Own Lifecycle

This is easy to wire into the current `Menu` and `Game` components, but it makes a UI
store responsible for gameplay lifecycle and encourages duplicated gameplay facts in
React/Zustand state. It does not address reset ownership for engine modules.

### B. Introduce A Dedicated Session Controller While Keeping Gameplay State In Engine Modules

This gives lifecycle, result snapshots, best-score persistence, reset orchestration,
and input guards one owner while preserving existing engine modules as the source of
gameplay truth. It requires narrow reset/cleanup APIs but avoids a rewrite.

### C. Replace Or Centralize Gameplay State In A New Store

This could produce a cleaner long-term state model, but it is a broad engine rewrite
with high migration risk and likely temporary duplication. It is too large for this
feature's accepted scope.

## Decision

Use Option B.

Create a dedicated lifecycle/session controller that owns observable lifecycle states,
allowed transitions, terminal result snapshots, best-score coordination, and
full-session reset orchestration. Keep score, lives, timer, snake, food, obstacle,
bonus, protocol, and animation state in their current engine/render modules, with
narrow exact reset and cleanup APIs added where required.

## Consequences

Positive consequences:

- Game Over, Victory, Play Again, and Main Menu can stop using browser reload.
- Reset state ownership becomes explicit and testable.
- R3F `useFrame` remains the only gameplay frame loop.
- Zustand remains UI-facing rather than becoming a gameplay store.
- Deterministic lifecycle and 10-cycle restart tests become practical.

Negative consequences:

- Multiple existing modules need reset/cleanup seams.
- Protocol and terminal handlers must be rewired to report lifecycle events instead of
  directly opening menus or reloading.
- The controller must be kept small; adding live gameplay facts to it would recreate a
  duplicated state system.

## Validation

- Unit tests for lifecycle transitions, invalid command no-ops, failure-reason mapping,
  best-score persistence, reset APIs, and idempotence.
- Integration test for at least 10 terminal result -> Play Again cycles.
- Playwright coverage for visible Game Over, Victory, Play Again, Main Menu, best score,
  terminal input ignoring, no duplicate listener effects, and no lifecycle reload.

