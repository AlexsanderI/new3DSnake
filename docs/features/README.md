# Feature Workspaces

This directory contains one SDD workspace per feature.

## Naming

Use a short lowercase kebab-case slug:

```text
docs/features/game-restart/
docs/features/mobile-controls/
docs/features/repository-quality-gates/
```

The slug used in Codex commands must match the directory name.

## Do not create all feature folders in advance

Create a feature workspace only when that feature becomes active. The SDD skill should
create and maintain the exact artifacts expected by the installed workflow. Avoid
inventing duplicate files that conflict with the skill.

A workspace may contain artifacts such as context, specification, design, tasks,
reviews, and handoff notes. Treat the active feature's files as the source of truth for
scope and acceptance criteria.

## Starting a feature with Codex

With the marketplace-installed skills, commands are typically similar to:

```text
$specify <slug>
$design <slug>
$tasks <slug>
$implement <slug>
$review <slug>
$ship <slug>
```

With locally vendored skills, names may use an `sdd-` prefix, for example:

```text
$sdd-specify <slug>
$sdd-implement <slug>
```

Type `$` in Codex and use the exact skill names shown by the installed setup.

## Feature selection

Choose the highest-priority, clearly bounded item from `docs/roadmap.md`. Do not use a
vague slug such as `improve-game` or `make-commercial`.

Good examples:

- `repository-quality-gates`
- `game-state-reset`
- `game-restart`
- `mobile-controls`
- `high-score-persistence`

## Scope rules

- One feature workspace should describe one user or engineering outcome.
- Keep acceptance criteria observable and testable.
- Explicitly state exclusions.
- Do not prescribe file-level implementation during `specify`; that belongs in design.
- Split implementation into small tasks.
- Run available gates after each meaningful task.
- Review visual and gameplay changes manually before shipping.
