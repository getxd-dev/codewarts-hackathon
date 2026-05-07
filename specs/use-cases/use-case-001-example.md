# Use Case 001 - Example Factory Artifact

## Problem

Teams need a repeatable way to create specs, plans, code, tests, docs, and review loops for AI-assisted engineering.

## User Flow

1. User describes a feature.
2. Agent researches repo context.
3. Agent writes a plan.
4. Agent implements the feature.
5. Review agent checks the diff.
6. CI validates the result.
7. Durable lessons are promoted back into the factory.

## Acceptance Criteria

- A plan exists before implementation.
- Code is covered by at least one test.
- Review findings are resolved or explicitly rejected.
- Docs/specs are updated if behavior changes.

