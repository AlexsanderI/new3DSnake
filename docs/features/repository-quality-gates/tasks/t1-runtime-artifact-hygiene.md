---
id: T1
title: "Pin runtime expectations and artifact hygiene"
layer: "docs"
deps: []
acs: ["AC-05"]
files_hint: ["package.json", ".nvmrc", ".gitignore", "README.md"]
owner: "Tech Lead"
estimate: "S"
status: "todo"
---

# T1 - Pin runtime expectations and artifact hygiene

## Why

This derives from [spec AC-05](../spec.md), [sad.md section 2](../sad.md), and the clean-checkout quality requirement in [sad.md section 10](../sad.md). Contributors need setup expectations that agree across repository files before quality-gate results can be compared.

## What

Choose and record the supported Node.js expectation in the repository command surface and docs, then confirm generated local artifacts remain excluded from source control. Keep the change limited to runtime/setup metadata and artifact hygiene; do not add verification tools in this task.

## Definition of Done

- [ ] The supported Node.js expectation is recorded in a machine-readable or conventional place such as `package.json` `engines` and/or `.nvmrc`.
- [ ] README setup text names the same runtime expectation without conflicting with package metadata.
- [ ] `.gitignore` excludes generated folders and Playwright artifacts named by `AGENTS.md`.
- [ ] `npm ci` remains the documented clean-checkout dependency command.

## Notes

This task is documentation/setup only. It must not change gameplay source or level JSON.
