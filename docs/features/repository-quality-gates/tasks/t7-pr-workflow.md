---
id: T7
title: "Add pull-request verification workflow"
layer: "worker"
deps: ["T6"]
acs: ["AC-03", "AC-07"]
files_hint: [".github/workflows/quality-gates.yml", "package.json"]
owner: "Maintainer"
estimate: "S"
status: "todo"
---

# T7 - Add pull-request verification workflow

## Why

This derives from [spec AC-03](../spec.md), [spec AC-07](../spec.md), [sad.md section 6](../sad.md), and [ADR-0003](../adr/0003-run-aggregate-verification-in-github-actions-pull-requests.md). Maintainers need a visible pull-request readiness result before manual approval.

## What

Add a GitHub Actions workflow for pull requests that checks out the repository, installs locked dependencies with `npm ci`, and runs `npm run verify`. Keep branch protection policy outside the repository, but make the workflow result visible and versioned.

## Definition of Done

- [ ] A workflow under `.github/workflows/` runs on pull requests.
- [ ] The workflow uses `npm ci` and calls `npm run verify`.
- [ ] The workflow uses the supported Node.js expectation from T1.
- [ ] A failing `npm run verify` result is visible as a failed pull-request check.

## Notes

Do not duplicate typecheck/lint/test/build command lists in the workflow unless a platform limitation requires it; CI parity should come from the aggregate npm script.
