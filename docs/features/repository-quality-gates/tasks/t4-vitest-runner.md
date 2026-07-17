---
id: T4
title: "Add the Vitest deterministic test runner"
layer: "tests"
deps: []
acs: ["AC-06"]
files_hint: ["package.json", "package-lock.json", "vite.config.ts", "vitest.config.ts", "tests/unit"]
owner: "Tech Lead"
estimate: "M"
status: "todo"
---

# T4 - Add the Vitest deterministic test runner

## Why

This derives from [spec AC-06](../spec.md), [sad.md section 4](../sad.md), and [ADR-0002](../adr/0002-use-vitest-for-deterministic-typescript-tests.md). Future engine-rule changes need a deterministic runner that does not launch the browser game.

## What

Add Vitest and any minimal TypeScript/Vite configuration needed for focused unit-style tests. Add a `test:unit` npm script that targets deterministic tests under a dedicated unit-test location.

## Definition of Done

- [ ] `npm run test:unit` is available as the deterministic test command.
- [ ] Vitest configuration can run TypeScript tests without React Three Fiber or browser startup.
- [ ] The configured test location is distinct from `tests/e2e`.
- [ ] No existing Playwright configuration is replaced or weakened.

## Notes

This task may not fully satisfy AC-06 until T5 adds focused passing coverage.
