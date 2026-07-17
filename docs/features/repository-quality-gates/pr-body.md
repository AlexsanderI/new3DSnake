## Summary

Ships the repository quality-gates foundation for Snake3D. This adds one documented
local deterministic verification path, a deterministic unit-test layer, generated
artifact hygiene, and a GitHub Actions pull-request readiness workflow. See
`docs/features/repository-quality-gates/spec.md`.

## Acceptance Criteria

- AC-01 - `npm run verify` runs aggregate quality gates in the documented order.
- AC-02 - `npm run verify` stops at the first failing quality area through chained npm scripts.
- AC-03 - pull requests run a committed `Quality Gates` workflow before merge readiness.
- AC-04 - browser stability coverage remains available and documented through `npm run test:e2e`.
- AC-05 - clean-checkout setup, runtime expectation, ignore rules, and gate docs agree.
- AC-06 - Vitest deterministic tests are available with initial passing focused coverage.
- AC-07 - failing aggregate PR verification is visible before manual approval.

## Design

- Spec: `docs/features/repository-quality-gates/spec.md`
- Architecture: `docs/features/repository-quality-gates/sad.md`
- Decisions: `docs/features/repository-quality-gates/adr/`
- Data model + migration: none
- API: none
- Changelog: `docs/features/repository-quality-gates/CHANGELOG.md`
- Review: `docs/features/repository-quality-gates/_review/review-2026-07-15-pass.md`

## Tasks

- `c9b4576` - T1 - Pin runtime expectations and artifact hygiene.
- `e8c3278` - T2 - Extract an explicit TypeScript typecheck gate.
- `f22cfd1` - T3 - Add a focused ESLint gate.
- `7b6c281` - T4 - Add the Vitest deterministic test runner.
- `309a730` - T5 - Seed focused deterministic coverage.
- `f3f0ffc` - T6 - Compose the aggregate deterministic verify command.
- `616a4b8` - T7 - Add pull-request verification workflow.
- `8a3a203` - T8 - Document setup, gate order, and completion rules.
- `df35f64` - T1/T7/T8 - Address review findings.
- `5d96274` - Review pass record.

## Verification

- `npm run verify` - passed on 2026-07-15.
- `npm run test:e2e` - passed on 2026-07-15: 1 Playwright stability test in about 6.6 minutes.
- Independent review - passed: `REVIEW_CLEAN: repository-quality-gates main...HEAD after df35f64`.

## Ran the Feature

- AC-01: ran `npm run verify` and observed `typecheck`, `lint`, `test:unit`, then `build`.
- AC-04: ran `npm run test:e2e` and observed the browser stability suite pass.
- AC-06: observed Vitest run 1 unit file with 2 passing deterministic checks.
- AC-03/AC-07: inspected `.github/workflows/quality-gates.yml`; PRs run `npm ci` and `npm run verify`
  on Ubuntu using `.nvmrc`.
- AC-05: inspected `.gitignore`, `README.md`, `AGENTS.md`, and package scripts for aligned setup
  and artifact-hygiene rules.

## Operational Notes

- Migration: none.
- Feature flag / config: none.
- Rollback: revert the merge commit; no data migration or runtime state cleanup is required.
- Maintainer follow-up: configure GitHub branch protection to require `Quality Gates / npm run verify`
  if branch protection is enabled.

