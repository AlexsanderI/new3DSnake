# Changelog - repository-quality-gates

## repository-quality-gates - local and PR verification foundation

**What:** Snake3D now has a documented repository quality-gate path: Node 20 setup,
artifact hygiene, explicit `typecheck`, `lint`, `test:unit`, `verify`, and
`test:e2e` commands, plus a GitHub Actions workflow that runs `npm ci` and
`npm run verify` on pull requests.

**Why:** The feature closes the Milestone 0 verification gap described in
[spec.md](./spec.md) sections 1 and 2: contributors need one repeatable local
verification path, maintainers need a PR readiness signal, and future gameplay work
needs deterministic tests in addition to browser stability coverage. Key decisions are
recorded in [ADR-0001](./adr/0001-use-npm-scripts-as-the-local-quality-gate-contract.md),
[ADR-0002](./adr/0002-use-vitest-for-deterministic-typescript-tests.md), and
[ADR-0003](./adr/0003-run-aggregate-verification-in-github-actions-pull-requests.md).

**How to use:** From a clean checkout, use Node 20+, run `npm ci`, then run
`npm run verify` before requesting review. Before declaring code work complete, also
run `npm run test:e2e`.

**Operational notes:**
- Migration: none.
- Feature flag / config: none.
- Rollback: revert the feature branch merge to remove the new commands, test runner,
  workflow, and documentation. No runtime data or schema migration is involved.
- Repository setting: after merge, maintainers can mark the `Quality Gates / npm run verify`
  workflow as a required branch-protection check in GitHub settings.

**Acceptance criteria delivered:**
- AC-01 - `npm run verify` runs the aggregate gates in documented order.
- AC-02 - the aggregate gate stops at the first failing quality area through chained npm scripts.
- AC-03 - pull requests have a committed GitHub Actions workflow for readiness checks.
- AC-04 - `npm run test:e2e` remains documented and runnable as the browser stability gate.
- AC-05 - runtime setup, artifact hygiene, and verification documentation agree.
- AC-06 - Vitest and an initial deterministic test are available under `tests/unit`.
- AC-07 - failed `npm run verify` results surface as failed pull-request checks.

**Ship verification:**
- `npm run verify` passed on 2026-07-15.
- `npm run test:e2e` passed on 2026-07-15: 1 Playwright stability test, about 6.6 minutes.
- Real AC spot checks:
  - AC-01: ran `npm run verify` and observed `typecheck`, `lint`, `test:unit`, then `build`.
  - AC-04: ran `npm run test:e2e` and observed the existing browser stability suite pass.
  - AC-06: observed Vitest run 1 unit file with 2 passing deterministic checks.

