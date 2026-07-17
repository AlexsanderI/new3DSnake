---
status: Accepted
owner: "Tech Lead"
reviewers: ["Maintainer"]
updated_at: "2026-07-14"
feature_size: "S"
ticket: "repository-quality-gates"
---

# 0001 - Use npm scripts as the local quality-gate contract

- **Status:** Accepted
- **Date:** 2026-07-14
- **Deciders:** Tech Lead, Maintainer

## Context

Snake3D already exposes development commands through `package.json`, and contributors are instructed to use repository-documented commands before review. The feature needs one local verification path that is easy to discover, easy for CI to reuse, and consistent with the existing React + TypeScript + Vite project.

## Decision drivers

- Local deterministic gate runtime must be <= 60 seconds on a warmed developer machine, excluding browser stability coverage.
- 100% of configured checks need a documented purpose and failure owner.
- Clean checkout setup must be <= 3 commands before a Contributor can run documented gates.
- The repository already uses npm scripts for development, build, preview, and Playwright coverage.

## Considered options

1. **Use npm scripts as the gate contract** - add focused scripts such as `typecheck`, `lint`, deterministic test commands, `verify`, and keep `test:e2e` visible.
2. **Use a standalone shell script** - add a script file that orchestrates tools outside `package.json`.
3. **Document individual commands only** - list separate commands in README without a stable aggregate script.

## Decision outcome

**Chosen:** Use npm scripts as the gate contract. This keeps the command surface where contributors already look, lets CI call the same aggregate command, and avoids a second orchestration mechanism.

## Consequences

**Positive**
- Contributors and CI share the same stable command names.
- Gate purpose and ordering can be documented directly beside existing project commands.
- No extra runtime architecture is introduced.

**Negative**
- `package.json` becomes the coordination point for multiple tools and must be kept tidy.
- Long-running browser coverage may need a separate script from the deterministic aggregate gate to preserve the <= 60 second deterministic target.

**Neutral**
- Future task stages can add or reorder scripts, but README and CI must stay in sync.

## Links

- Spec: [[../spec.md]]
- SAD: [[../sad.md]] §4
