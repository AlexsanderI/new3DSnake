---
id: T2
title: "Extract an explicit TypeScript typecheck gate"
layer: "app"
deps: []
acs: ["AC-01", "AC-02"]
files_hint: ["package.json", "tsconfig.json", "tsconfig.node.json"]
owner: "Tech Lead"
estimate: "S"
status: "todo"
---

# T2 - Extract an explicit TypeScript typecheck gate

## Why

This derives from [spec AC-01](../spec.md), [spec AC-02](../spec.md), [sad.md section 4](../sad.md), and [ADR-0001](../adr/0001-use-npm-scripts-as-the-local-quality-gate-contract.md). Type safety needs a named gate that contributors and CI can run before broader checks.

## What

Add a `typecheck` npm script that runs strict TypeScript checking without emitting files. Keep the existing build behavior equivalent by reusing the same typecheck path before Vite builds.

## Definition of Done

- [ ] `npm run typecheck` runs TypeScript checking over the existing project config and does not emit build output.
- [ ] `npm run build` still performs type checking before `vite build`.
- [ ] Introducing a TypeScript error causes `npm run typecheck` and the aggregate gate later to fail in the typecheck area.

## Notes

This task shares `package.json` with later command tasks, so `implement` should serialize it with T3, T4, and T6.
