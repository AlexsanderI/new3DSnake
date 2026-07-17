---
id: T6
title: "Compose the aggregate deterministic verify command"
layer: "wiring"
deps: ["T2", "T3", "T5"]
acs: ["AC-01", "AC-02", "AC-04", "AC-06"]
files_hint: ["package.json", "README.md"]
owner: "Tech Lead"
estimate: "S"
status: "todo"
---

# T6 - Compose the aggregate deterministic verify command

## Why

This derives from [spec AC-01](../spec.md), [spec AC-02](../spec.md), [spec AC-04](../spec.md), [spec AC-06](../spec.md), [sad.md section 4](../sad.md), and [ADR-0001](../adr/0001-use-npm-scripts-as-the-local-quality-gate-contract.md). Contributors need one deterministic command that stops at the first failing quality area.

## What

Add an aggregate `verify` npm script that runs deterministic gates in a sensible cheap-to-expensive order, such as typecheck, lint, unit tests, and build. Keep `test:e2e` as a separate documented completion gate unless implementation chooses an explicit full gate name for slower browser coverage.

## Definition of Done

- [ ] `npm run verify` exists and delegates to the named component scripts instead of duplicating tool invocations ad hoc.
- [ ] The order makes the first failing quality area clear.
- [ ] `npm run verify` includes the deterministic test layer from T4/T5.
- [ ] `npm run test:e2e` remains available and is not removed from the documented completion gate.

## Notes

Keep the deterministic runtime target from [sad.md section 10](../sad.md) in mind: browser stability coverage is excluded from the `verify` runtime measurement unless explicitly documented otherwise.
