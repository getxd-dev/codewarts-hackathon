# AI Code Review Loop

Use agents for review, but keep humans accountable for final judgment.

## Loop

1. Implementation agent writes code.
2. Review agent inspects the diff.
3. Review agent reports only actionable findings.
4. Implementation agent fixes valid issues.
5. Tests and CI run again.
6. Lessons become docs, specs, tests, or skills.

## Review Criteria

- Does this match the spec?
- Does this follow the plan?
- Are permissions enforced in code?
- Are tests meaningful?
- Are docs/specs updated when behavior changes?
- Did the implementation avoid unrelated changes?

