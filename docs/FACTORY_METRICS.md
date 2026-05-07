# Factory Metrics

Track whether the software factory is making work more repeatable and safer.

## Delivery Metrics

- Time from issue/spec to first plan.
- Time from plan to first passing tests.
- Time from first PR to merge.
- Percentage of changes with a plan before code.
- Percentage of changes with updated tests.

## Quality Metrics

- CI pass rate on first push.
- Review findings per PR.
- Reopened bugs tied to missing tests.
- Docs/spec drift found during implementation.
- Number of repeated workflows converted into skills.

## Agent Metrics

- Agent review findings accepted versus rejected.
- Subagent tasks completed without integration conflict.
- Tool-call failures caused by missing permissions.
- Prompt-only guardrails replaced by deterministic code checks.

## Suggested Scorecard

```text
Factory health = planning coverage + validation coverage + review resolution + durable learning
```

Use the scorecard qualitatively at first. Avoid fake precision until the team has real data.

