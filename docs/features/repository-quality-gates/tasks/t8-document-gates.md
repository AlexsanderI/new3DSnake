---
id: T8
title: "Document setup, gate order, and completion rules"
layer: "docs"
deps: ["T1", "T6", "T7"]
acs: ["AC-01", "AC-02", "AC-03", "AC-04", "AC-05", "AC-06", "AC-07"]
files_hint: ["README.md", "AGENTS.md", "docs/roadmap.md", "docs/features/repository-quality-gates/spec.md"]
owner: "Tech Lead"
estimate: "M"
status: "todo"
---

# T8 - Document setup, gate order, and completion rules

## Why

This derives from every acceptance criterion in [spec section 5](../spec.md), the documentation conventions in [sad.md section 8](../sad.md), and the failure-ownership requirement in [sad.md section 10](../sad.md). The command surface is only useful if contributors, maintainers, and reviewing agents see the same expectations.

## What

Update contributor-facing documentation so clean-checkout setup, deterministic gate order, check purpose, likely failure owner, pull-request verification, and browser stability preservation all agree. Keep roadmap status concise and avoid duplicating implementation detail outside the feature artifacts.

## Definition of Done

- [ ] README documents clean-checkout setup in no more than three commands before running gates.
- [ ] README names each configured gate, its purpose, and the likely owner of failures.
- [ ] README or AGENTS guidance states that `npm run test:e2e` remains part of completion verification.
- [ ] Pull-request workflow behavior is documented consistently with `.github/workflows/quality-gates.yml`.
- [ ] Feature spec or review notes record any explicit manual verification for branch protection settings that cannot be enforced in repository files.

## Notes

This is the final convergence task because it depends on the actual command and workflow names from earlier tasks.
