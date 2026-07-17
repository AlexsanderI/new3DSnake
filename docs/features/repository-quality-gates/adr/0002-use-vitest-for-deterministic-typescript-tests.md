---
status: Accepted
owner: "Tech Lead"
reviewers: ["Maintainer"]
updated_at: "2026-07-14"
feature_size: "S"
ticket: "repository-quality-gates"
---

# 0002 - Use Vitest for deterministic TypeScript tests

- **Status:** Accepted
- **Date:** 2026-07-14
- **Deciders:** Tech Lead, Maintainer

## Context

The repository has no unit-test runner today. Existing Playwright coverage is valuable as a browser stability check, but it is too broad and slow to be the only proof for future engine-rule changes. The project is already built with Vite and TypeScript, so the deterministic runner should fit that toolchain.

## Decision drivers

- Establish at least one deterministic test command and one passing focused check in this feature.
- Keep deterministic gate runtime <= 60 seconds on a warmed developer machine, excluding browser stability coverage.
- Preserve the existing browser stability test instead of replacing it.
- Avoid coupling initial focused tests to React Three Fiber or browser rendering when practical.

## Considered options

1. **Use Vitest** - Vite-native TypeScript test runner suitable for focused unit-style checks.
2. **Use Jest** - mature general-purpose runner with a larger independent transform/config surface.
3. **Use Node's built-in test runner** - minimal dependency choice, but less aligned with Vite-specific TypeScript and project ergonomics.

## Decision outcome

**Chosen:** Use Vitest. It aligns with Vite, keeps the deterministic test layer close to the current stack, and gives future engine-rule tests a fast runner without launching the full game.

## Consequences

**Positive**
- Fast local feedback for isolated rules and utilities.
- Minimal conceptual mismatch with the Vite project.
- Supports future RED/GREEN loops before broader Playwright coverage.

**Negative**
- Adds a new dev dependency and configuration surface.
- Existing mutable engine modules may need reset discipline before they are safe to test directly.

**Neutral**
- Playwright remains responsible for browser gameplay stability and is not replaced by Vitest.

## Links

- Spec: [[../spec.md]]
- SAD: [[../sad.md]] §4
