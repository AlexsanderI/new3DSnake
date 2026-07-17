---
status: Accepted
owner: "Tech Lead"
reviewers: ["Maintainer"]
updated_at: "2026-07-14"
feature_size: "S"
ticket: "repository-quality-gates"
---

# 0003 - Run aggregate verification in GitHub Actions pull requests

- **Status:** Accepted
- **Date:** 2026-07-14
- **Deciders:** Tech Lead, Maintainer

## Context

Maintainers need a pull-request readiness signal that catches broken builds and deterministic quality regressions before manual review. The repository already has GitHub configuration for Dependabot but no pull-request verification workflow.

## Decision drivers

- 100% of required local aggregate checks must run in pull-request verification.
- Pull-request readiness should be visible before manual approval.
- CI parity should not drift from local documentation.
- The feature must not introduce a backend, deployment platform, or runtime monitoring system.

## Considered options

1. **Run the aggregate npm verification script in GitHub Actions** - CI installs dependencies and calls the same command expected locally.
2. **Configure only external branch protection manually** - rely on repository settings without committed workflow definition.
3. **Use a different hosted CI provider** - introduce a new external platform for pull-request checks.

## Decision outcome

**Chosen:** Run the aggregate npm verification script in GitHub Actions pull requests. The workflow is reviewable in the repository, gives Maintainers a visible readiness signal, and keeps command parity by delegating to npm scripts.

## Consequences

**Positive**
- Pull requests expose failing gate results before manual approval.
- CI behavior is versioned with the source.
- Workflow steps can reuse the same aggregate script documented for Contributors.

**Negative**
- GitHub Actions execution time and availability become part of the review experience.
- Required-check enforcement may still need Maintainer configuration in GitHub branch protection settings.

**Neutral**
- Browser stability coverage may run as a separate workflow or documented completion gate if it is too slow for every pull request, but it must remain runnable and visible.

## Links

- Spec: [[../spec.md]]
- SAD: [[../sad.md]] §4
