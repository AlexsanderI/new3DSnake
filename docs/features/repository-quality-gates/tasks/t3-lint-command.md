---
id: T3
title: "Add a focused ESLint gate"
layer: "app"
deps: []
acs: ["AC-01", "AC-02"]
files_hint: ["package.json", "package-lock.json", "eslint.config.js", "src", "tests"]
owner: "Tech Lead"
estimate: "M"
status: "todo"
---

# T3 - Add a focused ESLint gate

## Why

This derives from [spec AC-01](../spec.md), [spec AC-02](../spec.md), [sad.md section 4](../sad.md), and the lint risk in [sad.md section 11](../sad.md). The first lint gate should catch style and correctness issues without turning pre-existing broad cleanup into this feature.

## What

Add ESLint dev dependencies, a focused flat config for the current TypeScript/React/Vite codebase, and an npm `lint` script. Scope the initial rules to source and test files so failures are actionable and owned by the contributor changing code.

## Definition of Done

- [ ] `npm run lint` exists and checks the configured source/test file set.
- [ ] ESLint configuration is committed and compatible with the current TypeScript and React source.
- [ ] Existing generated folders remain ignored by lint.
- [ ] The README task in T8 can name lint purpose and likely failure owner.

## Notes

If adding lint reveals pre-existing failures, fix the first failing gate within this task rather than weakening the command silently.
