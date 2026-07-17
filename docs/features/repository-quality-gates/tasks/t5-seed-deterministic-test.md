---
id: T5
title: "Seed focused deterministic coverage"
layer: "tests"
deps: ["T4"]
acs: ["AC-06"]
files_hint: ["tests/unit", "src/commands/mulberry32.ts", "src/engine/time/timeFormat.ts", "src/engine/field/fieldSizeValidation.ts"]
owner: "Tech Lead"
estimate: "S"
status: "todo"
---

# T5 - Seed focused deterministic coverage

## Why

This derives from [spec AC-06](../spec.md), [sad.md section 5](../sad.md), and [ADR-0002](../adr/0002-use-vitest-for-deterministic-typescript-tests.md). The repository needs at least one passing focused check that future engine or utility rules can copy.

## What

Add one or more deterministic Vitest checks for an isolated utility or pure rule that does not need React, Three.js, the R3F frame loop, or mutable engine bootstrapping. Good seed candidates from the current source are `src/commands/mulberry32.ts`, `src/engine/time/timeFormat.ts`, or `src/engine/field/fieldSizeValidation.ts`.

## Definition of Done

- [ ] At least one focused unit test passes through `npm run test:unit`.
- [ ] The test demonstrates deterministic behavior and can be used as a template for future rule checks.
- [ ] The test does not launch the browser game, mount React, or rely on R3F frame callbacks.
- [ ] If a tested module logs warnings or uses mutable state, the test isolates or resets that behavior explicitly.

## Notes

Prefer a test that can be committed without changing gameplay behavior. Avoid broad engine setup until reset discipline is designed in a later feature.
